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


if __name__ == '__main__':
    unittest.main()
