#!/usr/bin/env python3
"""Instala coturn compartido e inyecta sus credenciales solo en el backend elegido."""
from argparse import ArgumentParser
from pathlib import Path
import ipaddress
import os
import re
import secrets
import socket
import subprocess

TURN = Path('/opt/perusurvivor-turn')
HOST = 'srv2060131.hstgr.cloud'


def run(*args):
    return subprocess.check_output(args, text=True, stderr=subprocess.STDOUT)


def public_ip(value=None):
    address = value or socket.gethostbyname(HOST)
    parsed = ipaddress.ip_address(address)
    if parsed.version != 4 or not parsed.is_global:
        raise RuntimeError('TURN necesita la IPv4 pública explícita del VPS')
    return address


def add_env_file(compose, env_path):
    text = compose.read_text()
    block = re.search(r'(?ms)^  coop:\n(?P<body>.*?)(?=^  [a-zA-Z0-9_-]+:\n|^networks:\n)', text)
    if not block:
        raise RuntimeError('No se encontró el servicio coop esperado')
    body = block.group(0)
    marker = '    env_file:\n      - ' + str(env_path) + '\n'
    if marker in body:
        return False
    if '    env_file:\n' in body:
        raise RuntimeError('El servicio coop ya usa otro env_file; revisar antes de combinar secretos')
    updated = body.replace('    environment:\n', marker + '    environment:\n', 1)
    if updated == body:
        raise RuntimeError('El servicio coop no tiene el bloque environment esperado')
    staged = compose.with_suffix('.yaml.next')
    staged.write_text(text[:block.start()] + updated + text[block.end():])
    run('docker', 'compose', '-f', str(staged), 'config', '--quiet')
    os.replace(staged, compose)
    return True


def install(environment, address=None):
    if os.geteuid() != 0:
        raise RuntimeError('La instalación TURN requiere root')
    address = public_ip(address)
    TURN.mkdir(mode=0o700, exist_ok=True)
    secret_file = TURN / 'shared-secret'
    if not secret_file.exists():
        secret_file.write_text(secrets.token_urlsafe(48))
        secret_file.chmod(0o600)
    secret = secret_file.read_text().strip()
    if len(secret) < 40:
        raise RuntimeError('El secreto TURN existente no cumple el mínimo de seguridad')

    config = TURN / 'turnserver.conf'
    config.write_text(f'''listening-port=3478
listening-ip=0.0.0.0
external-ip={address}
relay-ip={address}
min-port=49160
max-port=49200
fingerprint
use-auth-secret
static-auth-secret={secret}
realm={HOST}
stale-nonce=600
total-quota=100
user-quota=4
no-cli
no-tls
no-dtls
no-multicast-peers
no-loopback-peers
denied-peer-ip=0.0.0.0-0.255.255.255
denied-peer-ip=10.0.0.0-10.255.255.255
denied-peer-ip=100.64.0.0-100.127.255.255
denied-peer-ip=127.0.0.0-127.255.255.255
denied-peer-ip=169.254.0.0-169.254.255.255
denied-peer-ip=172.16.0.0-172.31.255.255
denied-peer-ip=192.168.0.0-192.168.255.255
denied-peer-ip=224.0.0.0-255.255.255.255
log-file=stdout
simple-log
''')
    config.chmod(0o600)
    os.chown(config, 65534, 65533)  # nobody:nogroup dentro de la imagen oficial fijada
    compose = TURN / 'compose.yaml'
    compose.write_text('''services:
  turn:
    image: coturn/coturn:4.18.0-r0-alpine
    container_name: perusurvivor-turn
    restart: unless-stopped
    init: true
    read_only: true
    network_mode: host
    mem_limit: 128m
    cpus: 0.25
    pids_limit: 48
    cap_drop: [ALL]
    cap_add: [NET_BIND_SERVICE]
    security_opt: [no-new-privileges:true]
    tmpfs: [/tmp]
    volumes:
      - /opt/perusurvivor-turn/turnserver.conf:/etc/coturn/turnserver.conf:ro
    command: ["-c", "/etc/coturn/turnserver.conf"]
''')
    compose.chmod(0o600)
    print(run('docker', 'compose', '-p', 'perusurvivor-turn', '-f', str(compose), 'up', '-d', '--pull', 'always'))

    if environment == 'staging':
        target = Path('/opt/perusurvivor-staging/compose.yaml')
        project = 'perusurvivor-staging'
    else:
        target = Path('/opt/perusurvivor/coop/compose.yaml')
        project = 'perusurvivor-coop'
    if not target.is_file():
        raise RuntimeError('No existe el compose del entorno ' + environment)
    env_file = TURN / (environment + '.env')
    env_file.write_text('TURN_URLS=turn:' + HOST + ':3478?transport=udp,turn:' + HOST + ':3478?transport=tcp\nTURN_SHARED_SECRET=' + secret + '\nTURN_TTL_SECONDS=3600\n')
    env_file.chmod(0o600)
    add_env_file(target, env_file)
    print(run('docker', 'compose', '-p', project, '-f', str(target), 'up', '-d', '--no-build', 'coop'))

    try:
        if 'Status: active' in run('ufw', 'status'):
            for rule in [('allow', '3478/udp'), ('allow', '3478/tcp'), ('allow', '49160:49200/udp')]:
                print(run('ufw', *rule).strip())
    except (FileNotFoundError, subprocess.CalledProcessError):
        pass
    print('TURN_READY entorno=' + environment + ' host=' + HOST + ' relay=udp')


if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('--environment', choices=['staging', 'production'], required=True)
    parser.add_argument('--public-ip')
    args = parser.parse_args()
    install(args.environment, args.public_ip)
