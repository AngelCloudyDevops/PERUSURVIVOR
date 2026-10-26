from contextlib import closing
import importlib.util
from pathlib import Path
import sqlite3
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('accounts_backup', Path(__file__).resolve().parents[2] / 'ops/hostinger/backup-accounts.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class AccountsBackupTests(unittest.TestCase):
    def test_restorable_wal_backup_and_retention(self):
        with tempfile.TemporaryDirectory() as folder:
            base = Path(folder)
            (base / 'data').mkdir()
            with closing(sqlite3.connect(base / 'data/accounts.sqlite')) as live:
                live.execute('PRAGMA journal_mode=WAL')
                live.execute('CREATE TABLE sample(id INTEGER PRIMARY KEY, data TEXT)')
                live.execute("INSERT INTO sample(data) VALUES('progreso de prueba')")
                live.commit()
                for _ in range(16):
                    saved = module.backup(base)
                with closing(sqlite3.connect(saved)) as restored:
                    self.assertEqual(restored.execute('SELECT data FROM sample').fetchone()[0], 'progreso de prueba')
                    self.assertEqual(restored.execute('PRAGMA integrity_check').fetchone()[0], 'ok')
                self.assertEqual(len(list((base / 'backups/accounts').glob('*.sqlite'))), 14)

    def test_missing_database_is_not_created(self):
        with tempfile.TemporaryDirectory() as folder:
            with self.assertRaises(RuntimeError):
                module.backup(Path(folder))

if __name__ == '__main__':
    unittest.main()
