#!/usr/bin/env python3
"""Instala un staging aislado de PERUSURVIVOR sin modificar datos de producción."""
from pathlib import Path
import os
import pwd
import shutil
import subprocess

PRODUCTION = Path('/opt/perusurvivor')
BASE = Path('/opt/perusurvivor-staging')
CADDY = Path('/opt/angel/Caddyfile.production')
DOMAIN = 'staging.perusurvivor.michitech.tech'

def run(*args):
    return subprocess.check_output(args, text=True, stderr=subprocess.STDOUT)

def write(path, content, mode=0o644):
    path.write_text(content)
    path.chmod(mode)

def install():
    if os.geteuid() != 0:
        raise RuntimeError('La instalación de staging requiere root')
    account = pwd.getpwnam('perusurvivor-deploy')
    for directory in [BASE, BASE / 'releases', BASE / 'live']:
        directory.mkdir(parents=True, exist_ok=True)
    for directory in [BASE / 'releases', BASE / 'live']:
        os.chown(directory, account.pw_uid, account.pw_gid)
    (BASE / 'live/deploy.lock').touch(mode=0o664, exist_ok=True)
    os.chown(BASE / 'live/deploy.lock', account.pw_uid, account.pw_gid)

    data = BASE / 'data'
    data.mkdir(mode=0o700, exist_ok=True)
    shutil.chown(data, user=1000, group=1000)
    coop = BASE / 'coop'
    coop.mkdir(exist_ok=True)
    source = (PRODUCTION / 'live/current/backend').resolve(strict=True)
    if not source.is_relative_to((PRODUCTION / 'releases').resolve()):
        raise RuntimeError('La release de producción está fuera del directorio permitido')
    for name in ['Dockerfile', 'package.json', 'package-lock.json', 'launcher.cjs']:
        shutil.copyfile(source / name, coop / name)

    nginx = '''server {
  listen 80;
  server_name _;
  root /srv/perusurvivor/live/current;
  index index.html;
  add_header X-Perusurvivor-Environment staging always;
  add_header X-Robots-Tag "noindex, nofollow, noarchive" always;
  location = /coop {
    proxy_pass http://perusurvivor-staging-coop:4180;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_read_timeout 60s;
  }
  location = /coop/health { proxy_pass http://perusurvivor-staging-coop:4180; }
  location /api/ {
    client_max_body_size 128k;
    proxy_pass http://perusurvivor-staging-coop:4180;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 15s;
    add_header Cache-Control "no-store" always;
  }
  location ^~ /backend/ { return 404; }
  location / { try_files $uri $uri/ =404; }
  location ~* \\.(html|js|css)$ { add_header Cache-Control "no-cache"; }
}
'''
    compose = '''services:
  web:
    image: nginx:stable-alpine
    container_name: perusurvivor-staging-web
    restart: unless-stopped
    mem_limit: 96m
    cpus: 0.25
    read_only: true
    security_opt: [no-new-privileges:true]
    tmpfs: [/var/cache/nginx, /var/run]
    volumes:
      - /opt/perusurvivor-staging:/srv/perusurvivor:ro
      - /opt/perusurvivor-staging/nginx.conf:/etc/nginx/conf.d/default.conf:ro
    networks: [gateway]
  coop:
    build: ./coop
    container_name: perusurvivor-staging-coop
    restart: unless-stopped
    init: true
    read_only: true
    user: "1000:1000"
    mem_limit: 256m
    cpus: 0.50
    pids_limit: 48
    cap_drop: [ALL]
    security_opt: [no-new-privileges:true]
    tmpfs: [/tmp]
    environment:
      PORT: "4180"
      MAX_ROOMS: "3"
      ACCOUNTS_DB: /data/accounts.sqlite
      COOP_ORIGINS: https://staging.perusurvivor.michitech.tech
    volumes:
      - /opt/perusurvivor-staging:/releases:ro
      - /opt/perusurvivor-staging/coop/launcher.cjs:/launcher.cjs:ro
      - /opt/perusurvivor-staging/data:/data:rw
    networks: [gateway]
networks:
  gateway:
    external: true
    name: perusurvivor_gateway
'''
    write(BASE / 'nginx.conf', nginx)
    write(BASE / 'compose.yaml', compose)
    print(run('docker', 'compose', '-p', 'perusurvivor-staging', '-f', str(BASE / 'compose.yaml'), 'up', '-d', '--build'))

    original = CADDY.read_text()
    marker = DOMAIN + ' {'
    if marker not in original:
        backup = Path('/opt/perusurvivor/backups/Caddyfile.before-perusurvivor-staging')
        if not backup.exists():
            shutil.copyfile(CADDY, backup)
        block = f'''\n\n{DOMAIN} {{
    encode zstd gzip
    reverse_proxy perusurvivor-staging-web:80
    header {{
        X-Content-Type-Options nosniff
        Referrer-Policy strict-origin-when-cross-origin
        X-Robots-Tag "noindex, nofollow, noarchive"
        -Server
    }}
}}
'''
        CADDY.write_text(original.rstrip() + block)
        try:
            print(run('docker', 'exec', 'angel-web-1', 'caddy', 'validate', '--config', '/etc/caddy/Caddyfile'))
            print(run('docker', 'exec', 'angel-web-1', 'caddy', 'reload', '--config', '/etc/caddy/Caddyfile'))
        except Exception:
            CADDY.write_text(original)
            raise
    print('STAGING_READY ' + DOMAIN)

if __name__ == '__main__':
    install()
