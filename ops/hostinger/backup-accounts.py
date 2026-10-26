#!/usr/bin/env python3
"""Backup consistente SQLite, incluida WAL, fuera de la raíz pública."""
from pathlib import Path
from datetime import datetime, timezone
import os
import sqlite3
from contextlib import closing

def backup(base=Path('/opt/perusurvivor')):
    source = base / 'data/accounts.sqlite'
    if not source.is_file():
        raise RuntimeError('La base de cuentas todavía no existe')
    target = base / 'backups/accounts'
    target.mkdir(parents=True, mode=0o700, exist_ok=True)
    os.chmod(target, 0o700)
    stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')
    destination = target / (stamp + '.sqlite')
    # No se copia el fichero vivo: backup() incluye transacciones confirmadas en WAL.
    with closing(sqlite3.connect(source.as_uri() + '?mode=ro', uri=True)) as src:
        with closing(sqlite3.connect(destination)) as dst:
            src.backup(dst)
            if dst.execute('PRAGMA integrity_check').fetchone()[0] != 'ok':
                raise RuntimeError('Backup no válido')
    os.chmod(destination, 0o600)
    # Retención local de 14 copias. Un backup externo requiere destino privado propio.
    for old in sorted(target.glob('*.sqlite'))[:-14]:
        old.unlink()
    return destination

if __name__ == '__main__':
    print(backup())
