#!/usr/bin/env python3
"""Instalación administrativa única. No reinicia servicios ajenos al juego."""
import argparse
import os
from pathlib import Path
import pwd
import shutil
import subprocess

BASE = Path("/opt/perusurvivor")
USER = "perusurvivor-deploy"
HOME = Path("/var/lib/perusurvivor-deploy")

def run(*args):
    return subprocess.check_output(args, text=True, stderr=subprocess.STDOUT).strip()

def install(public_key):
    if os.geteuid() != 0:
        raise RuntimeError("La instalación inicial requiere root")
    if not public_key.startswith("ssh-ed25519 ") or "\n" in public_key:
        raise ValueError("Se requiere una única clave pública ed25519")
    current = (BASE / "current").resolve(strict=True)
    if not current.is_relative_to((BASE / "releases").resolve()):
        raise RuntimeError("La versión activa no está en releases/")
    try:
        account = pwd.getpwnam(USER)
        if account.pw_dir != str(HOME):
            raise RuntimeError("El usuario existe con otro home")
    except KeyError:
        run("useradd", "--system", "--home-dir", str(HOME), "--shell", "/bin/sh", USER)
        account = pwd.getpwnam(USER)
    HOME.mkdir(mode=0o755, exist_ok=True)
    os.chown(HOME, 0, 0); HOME.chmod(0o755)
    ssh = HOME / ".ssh"
    ssh.mkdir(mode=0o755, exist_ok=True)
    os.chown(ssh, 0, 0); ssh.chmod(0o755)
    receiver = Path("/usr/local/libexec/perusurvivor-receive.py")
    receiver.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(Path(__file__).with_name("receive.py"), receiver)
    receiver.chmod(0o755); os.chown(receiver, 0, 0)
    authorized = ssh / "authorized_keys"
    forced = 'restrict,command="/usr/bin/python3 -I /usr/local/libexec/perusurvivor-receive.py" '
    authorized.write_text(forced + public_key + "\n")
    authorized.chmod(0o644); os.chown(authorized, 0, 0)
    for directory in [BASE / "releases", BASE / "live"]:
        directory.mkdir(exist_ok=True)
        os.chown(directory, account.pw_uid, account.pw_gid)
        directory.chmod(0o755)
    for directory, subdirs, files in os.walk(BASE / "releases", followlinks=False):
        os.chown(directory, account.pw_uid, account.pw_gid)
        for name in files:
            file = Path(directory) / name
            if file.is_symlink():
                raise RuntimeError("Enlace inesperado dentro de una release")
            os.chown(file, account.pw_uid, account.pw_gid)
    live = BASE / "live/current"
    if not live.is_symlink():
        if live.exists(): raise RuntimeError("live/current no es un enlace")
        live.symlink_to(os.path.relpath(current, live.parent))
    conf = BASE / "nginx.conf"
    original = conf.read_text()
    old_root = "root /srv/perusurvivor/current;"
    new_root = "root /srv/perusurvivor/live/current;"
    if new_root not in original:
        if old_root not in original:
            raise RuntimeError("No se reconoce la raíz Nginx del juego")
        backup = BASE / "backups/nginx.conf.before-auto-deploy"
        if not backup.exists(): backup.write_text(original)
        conf.write_text(original.replace(old_root, new_root))
        try:
            print(run("docker", "exec", "perusurvivor-web", "nginx", "-t"))
            print(run("docker", "exec", "perusurvivor-web", "nginx", "-s", "reload"))
        except Exception:
            conf.write_text(original)
            raise
    print("Cuenta restringida instalada. Sin sudo ni acceso a Docker.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--public-key-file", required=True)
    args = parser.parse_args()
    install(Path(args.public_key_file).read_text().strip())
