#!/usr/bin/env python3
"""Actualiza solo el receptor y la protección HTTP de PERUSURVIVOR."""
from pathlib import Path
import os
import re
import shutil
import subprocess

BASE = Path('/opt/perusurvivor')
RECEIVER = Path('/usr/local/libexec/perusurvivor-receive.py')

def run(*args):
    return subprocess.check_output(args, text=True, stderr=subprocess.STDOUT)

def forward_ip(conf):
    # El backend limita por IP real: nginx debe enviarla en /coop y /api/ (también en configuraciones ya instaladas).
    if 'X-Real-IP' in conf:
        return conf
    return re.sub(r'(?m)^([ \t]*)proxy_set_header Host \$host;\n', lambda m: m.group(0) + m.group(1) + 'proxy_set_header X-Real-IP $remote_addr;\n' + m.group(1) + 'proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n', conf)

def update():
    if os.geteuid() != 0:
        raise RuntimeError('La actualización operativa requiere root')
    release = (BASE / 'live/current').resolve(strict=True)
    releases = (BASE / 'releases').resolve(strict=True)
    if not release.is_relative_to(releases):
        raise RuntimeError('La release activa está fuera del directorio permitido')
    source = release / 'backend/ops/receive.py'
    if not source.is_file():
        raise RuntimeError('La release no contiene el receptor versionado')
    RECEIVER.parent.mkdir(parents=True, exist_ok=True)
    staged = RECEIVER.with_suffix('.py.next')
    shutil.copyfile(source, staged)
    staged.chmod(0o755)
    os.chown(staged, 0, 0)
    os.replace(staged, RECEIVER)

    conf = BASE / 'nginx.conf'
    original = conf.read_text()
    updated = original
    marker = '  # PERUSURVIVOR ARCHIVOS PRIVADOS\n'
    if marker not in updated:
        match = re.search(r'(?m)^[ \t]*location / \{', updated)
        if not match:
            raise RuntimeError('Configuración nginx inesperada')
        routes = marker + '  location ^~ /backend/ { return 404; }\n'
        updated = updated[:match.start()] + routes + updated[match.start():]
    updated = forward_ip(updated)
    if updated != original:
        backup = BASE / 'backups/nginx.conf.before-private-backend'
        backup.parent.mkdir(parents=True, exist_ok=True)
        if not backup.exists():
            backup.write_text(original)
        conf.write_text(updated)
        try:
            print(run('docker', 'exec', 'perusurvivor-web', 'nginx', '-t'))
            print(run('docker', 'exec', 'perusurvivor-web', 'nginx', '-s', 'reload'))
        except Exception:
            conf.write_text(original)
            raise
    print('Receptor actualizado, /backend/ protegido e IP real reenviada.')

if __name__ == '__main__':
    update()
