"""Public gameplay tests must exclude deployments across workflows."""
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
        self.assertEqual(locks, ['perusurvivor-production'] * 2)

    def test_private_backend_route_is_part_of_installer(self):
        root = Path(__file__).resolve().parents[2]
        installer = (root / 'ops' / 'hostinger' / 'install-coop.py').read_text(encoding='utf-8')
        self.assertIn('location ^~ /backend/ { return 404; }', installer)

    def test_release_contains_safe_operational_update(self):
        root = Path(__file__).resolve().parents[2]
        build = (root / 'scripts' / 'build.cjs').read_text(encoding='utf-8')
        updater = (root / 'ops' / 'hostinger' / 'update-release.py').read_text(encoding='utf-8')
        self.assertIn("['receive.py','update-release.py']", build)
        self.assertIn("release.is_relative_to(releases)", updater)
        self.assertIn("location ^~ /backend/ { return 404; }", updater)


if __name__ == '__main__':
    unittest.main()
