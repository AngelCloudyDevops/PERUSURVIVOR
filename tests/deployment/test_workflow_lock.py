"""Public gameplay tests must exclude deployments across workflows."""
import importlib.util
from pathlib import Path
import re
import unittest


class WorkflowLockTest(unittest.TestCase):
    def test_public_test_and_deploy_share_non_cancelling_queue(self):
        root = Path(__file__).resolve().parents[2]
        locks = []
        for name in ('ci.yml', 'cooperative-e2e.yml'):
            text = (root / '.github/workflows' / name).read_text(encoding='utf-8')
            block = re.search(r'    concurrency:\n((?:      [^\n]+\n)+)', text)
            self.assertIsNotNone(block, name)
            values = dict(re.findall(r'      ([\w-]+): ([^\n]+)', block[1]))
            self.assertEqual(values.get('cancel-in-progress'), 'false', name)
            self.assertEqual(values.get('queue'), 'max', name)
            locks.append(values.get('group'))
        self.assertIn("perusurvivor-production", locks[0])
        self.assertIn("perusurvivor-staging", locks[0])
        self.assertEqual(locks[1], 'perusurvivor-production')

    def test_private_backend_route_is_part_of_installer(self):
        root = Path(__file__).resolve().parents[2]
        installer = (root / 'ops' / 'hostinger' / 'install-coop.py').read_text(encoding='utf-8')
        self.assertIn('location ^~ /backend/ { return 404; }', installer)

    def test_release_contains_safe_operational_update(self):
        root = Path(__file__).resolve().parents[2]
        build = (root / 'scripts' / 'build.cjs').read_text(encoding='utf-8')
        updater = (root / 'ops' / 'hostinger' / 'update-release.py').read_text(encoding='utf-8')
        self.assertIn("['receive.py','update-release.py','install-staging.py','install-turn.py']", build)
        self.assertIn("release.is_relative_to(releases)", updater)
        self.assertIn("location ^~ /backend/ { return 404; }", updater)

    def test_turn_installer_keeps_secret_private_and_relay_bounded(self):
        root = Path(__file__).resolve().parents[2]
        installer = (root / 'ops' / 'hostinger' / 'install-turn.py').read_text(encoding='utf-8')
        self.assertIn("secret_file.chmod(0o600)", installer)
        self.assertIn("env_file.chmod(0o600)", installer)
        self.assertIn("min-port=49160", installer)
        self.assertIn("max-port=49200", installer)
        self.assertIn("denied-peer-ip=192.168.0.0-192.168.255.255", installer)
        self.assertIn("coturn/coturn:4.18.0-r0-alpine", installer)

    def test_nginx_forwards_real_client_ip(self):
        root = Path(__file__).resolve().parents[2]
        for name in ['install-coop.py', 'install-staging.py']:
            text = (root / 'ops' / 'hostinger' / name).read_text(encoding='utf-8')
            self.assertGreaterEqual(text.count('proxy_set_header X-Real-IP $remote_addr;'), 2, name)
            self.assertGreaterEqual(text.count('proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;'), 2, name)
        spec = importlib.util.spec_from_file_location('update_release', root / 'ops' / 'hostinger' / 'update-release.py')
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        old = '  location /api/ {\n    proxy_set_header Host $host;\n  }\n  location = /coop/health { proxy_pass http://x; }\n'
        new = module.forward_ip(old)
        self.assertIn('X-Real-IP $remote_addr', new)
        self.assertEqual(module.forward_ip(new), new)

    def test_backup_cron_logs_exit_status(self):
        root = Path(__file__).resolve().parents[2]
        installer = (root / 'ops' / 'hostinger' / 'install-coop.py').read_text(encoding='utf-8')
        self.assertIn('/var/log/perusurvivor-backup.log', installer)
        self.assertIn('code=$?', installer)
        self.assertIn('backup exit=$code', installer)
        self.assertIn('exit $code', installer)
        self.assertNotIn('>/dev/null', installer)

    def test_staging_is_isolated_and_bounded(self):
        root = Path(__file__).resolve().parents[2]
        installer = (root / 'ops' / 'hostinger' / 'install-staging.py').read_text(encoding='utf-8')
        receiver = (root / 'ops' / 'hostinger' / 'receive.py').read_text(encoding='utf-8')
        self.assertIn('/opt/perusurvivor-staging', installer)
        self.assertIn('perusurvivor-staging-coop', installer)
        self.assertIn('staging.perusurvivor.michitech.tech', installer)
        self.assertIn('noindex, nofollow, noarchive', installer)
        self.assertIn('mem_limit: 256m', installer)
        self.assertIn('"deploy-staging"', receiver)


if __name__ == '__main__':
    unittest.main()
