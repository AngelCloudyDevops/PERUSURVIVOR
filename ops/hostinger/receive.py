#!/usr/bin/env python3
"""Receptor SSH restringido: solo acepta 'deploy <SHA>' y un tar.gz por stdin."""
import io
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import sys
import tarfile
import tempfile
import time
import urllib.request

BASE = Path("/opt/perusurvivor")
DOMAIN = "https://perusurvivor.michitech.tech"
MAX_ARCHIVE = 96 * 1024 * 1024
MAX_CONTENT = 192 * 1024 * 1024
KEEP_RECENT_RELEASES = 7
SHA_PATTERN = re.compile(r"[0-9a-f]{40}")

def parse_command(command):
    match = re.fullmatch(r"deploy ([0-9a-f]{40})", command or "")
    if not match:
        raise ValueError("Solo se permite deploy seguido de un SHA completo")
    return match.group(1)

def members_checked(archive):
    members = []
    total = 0
    for member in archive:
        members.append(member)
        if len(members) > 5000:
            raise ValueError("Demasiados archivos")
        name = PurePosixPath(member.name)
        if name.is_absolute() or ".." in name.parts or "\\" in member.name:
            raise ValueError("Ruta de archivo inválida")
        if not (member.isfile() or member.isdir()):
            raise ValueError("No se permiten enlaces ni archivos especiales")
        total += member.size
        if member.size < 0 or total > MAX_CONTENT:
            raise ValueError("Contenido demasiado grande")
    return members

def extract_release(payload, sha):
    if len(payload) > MAX_ARCHIVE:
        raise ValueError("Paquete demasiado grande")
    releases = BASE / "releases"
    target = releases / sha
    with tempfile.TemporaryDirectory(prefix=".incoming-", dir=releases) as temp:
        stage = Path(temp)
        with tarfile.open(fileobj=io.BytesIO(payload), mode="r:gz") as archive:
            for member in members_checked(archive):
                destination = stage.joinpath(*PurePosixPath(member.name).parts)
                if not destination.resolve().is_relative_to(stage.resolve()):
                    raise ValueError("Ruta fuera de la release")
                if member.isdir():
                    destination.mkdir(parents=True, exist_ok=True)
                else:
                    destination.parent.mkdir(parents=True, exist_ok=True)
                    with archive.extractfile(member) as source, destination.open("wb") as output:
                        shutil.copyfileobj(source, output)
                    destination.chmod(0o644)
        if not (stage / "index.html").is_file() or b"CAUSAS" not in (stage / "index.html").read_bytes():
            raise ValueError("El paquete no contiene el juego")
        if not (stage / "js/game.js").is_file():
            raise ValueError("Falta el código del juego")
        (stage / "__release.json").write_text(json.dumps({"git_sha": sha}) + "\n")
        stage.chmod(0o755)
        if target.exists():
            if (target / "__release.json").read_text() != (stage / "__release.json").read_text():
                raise ValueError("Ya existe una release incompatible")
        else:
            stage.rename(target)
            # TemporaryDirectory permite que el directorio se haya movido.
    target.chmod(0o755)
    return target

def switch_link(target):
    live = BASE / "live"
    current = live / "current"
    temporary = live / ("current-next-" + str(os.getpid()))
    if temporary.exists() or temporary.is_symlink():
        temporary.unlink()
    temporary.symlink_to(target)
    os.replace(temporary, current)

def release_sha_from_link(link):
    if not link:
        return None
    name = PurePosixPath(link).name
    return name if SHA_PATTERN.fullmatch(name) else None

def prune_releases(preserve=(), keep=KEEP_RECENT_RELEASES):
    """Conserva las releases recientes sin tocar enlaces ni rutas inesperadas."""
    releases = BASE / "releases"
    protected = {sha for sha in preserve if sha and SHA_PATTERN.fullmatch(sha)}
    candidates = []
    for entry in releases.iterdir():
        if not SHA_PATTERN.fullmatch(entry.name) or entry.is_symlink() or not entry.is_dir():
            continue
        candidates.append(entry)
    candidates.sort(key=lambda entry: entry.stat().st_mtime_ns, reverse=True)
    protected.update(entry.name for entry in candidates[:max(0, keep)])
    removed = []
    for entry in candidates:
        if entry.name in protected:
            continue
        resolved = entry.resolve()
        if not resolved.is_relative_to(releases.resolve()) or resolved.parent != releases.resolve():
            raise RuntimeError("Release fuera del directorio permitido")
        shutil.rmtree(resolved)
        removed.append(entry.name)
    return removed

def healthy(sha):
    for attempt in range(10):
        try:
            request = urllib.request.Request(
                DOMAIN + "/__release.json?verify=" + sha + "-" + str(time.time_ns()),
                headers={"Cache-Control": "no-cache"},
            )
            with urllib.request.urlopen(request, timeout=10) as response:
                if response.status == 200 and json.load(response).get("git_sha") == sha:
                    with urllib.request.urlopen(DOMAIN + "/", timeout=10) as page:
                        if page.status == 200 and b"CAUSAS" in page.read():
                            return True
        except Exception:
            pass
        time.sleep(2)
    return False

def deploy(payload, sha):
    import fcntl
    with (BASE / "live/deploy.lock").open("a") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        current = BASE / "live/current"
        previous = os.readlink(current) if current.is_symlink() else None
        release = extract_release(payload, sha)
        switch_link(os.path.relpath(release, current.parent))
        if not healthy(sha):
            if previous is not None:
                switch_link(previous)
            raise RuntimeError("Comprobación HTTPS fallida; restaurada la versión anterior")
        try:
            removed = prune_releases({sha, release_sha_from_link(previous)})
            prune_warning = None
        except Exception as error:
            # A cleanup problem must not report a healthy, already-active release
            # as failed. Surface it for maintenance without rolling back the game.
            removed = []
            prune_warning = str(error)
    result = {"status": "deployed", "git_sha": sha, "url": DOMAIN, "pruned": removed}
    if prune_warning:
        result["prune_warning"] = prune_warning
    return result

def main():
    try:
        sha = parse_command(os.environ.get("SSH_ORIGINAL_COMMAND", ""))
        payload = sys.stdin.buffer.read(MAX_ARCHIVE + 1)
        print(json.dumps(deploy(payload, sha)))
    except Exception as error:
        print(json.dumps({"status": "failed", "error": str(error)}), file=sys.stderr)
        return 1
    return 0

if __name__ == "__main__":
    sys.exit(main())
