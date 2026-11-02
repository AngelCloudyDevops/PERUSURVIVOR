import importlib.util
import io
import json
from email.message import Message
from pathlib import Path
import tarfile
import tempfile
import time
import unittest
import urllib.error
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location("receiver", ROOT / "ops/hostinger/receive.py")
receiver = importlib.util.module_from_spec(spec)
spec.loader.exec_module(receiver)
SHA = "a" * 40

def package(entries=None):
    output = io.BytesIO()
    entries = entries or [("index.html", b"KICK PERU"), ("js/game.js", b"game")]
    with tarfile.open(fileobj=output, mode="w:gz") as archive:
        for name, data in entries:
            item = tarfile.TarInfo(name); item.size = len(data)
            archive.addfile(item, io.BytesIO(data))
    return output.getvalue()

class ReceiverTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.base = Path(self.temp.name)
        (self.base / "releases").mkdir()
        (self.base / "live").mkdir()
        self.patch = patch.object(receiver, "BASE", self.base); self.patch.start()
    def tearDown(self):
        self.patch.stop(); self.temp.cleanup()
    def test_commands(self):
        self.assertEqual(receiver.parse_command("deploy " + SHA), ("deploy", SHA))
        self.assertEqual(receiver.parse_command("deploy-staging " + SHA), ("deploy-staging", SHA))
        for command in ["bash", "deploy-test " + SHA, "deploy ../escape", "deploy " + SHA + ";id", ""]:
            with self.assertRaises(ValueError): receiver.parse_command(command)
    def test_targets_are_isolated(self):
        receiver.select_target("deploy-staging")
        self.assertEqual(receiver.BASE, Path("/opt/perusurvivor-staging"))
        self.assertEqual(receiver.DOMAIN, "https://staging.perusurvivor.michitech.tech")
        receiver.select_target("deploy")
        self.assertEqual(receiver.BASE, Path("/opt/perusurvivor"))
    def test_valid_release(self):
        path = receiver.extract_release(package(), SHA)
        self.assertEqual(json.loads((path / "__release.json").read_text())["git_sha"], SHA)
        self.assertTrue((path / "js/game.js").is_file())
        self.assertEqual(path.stat().st_mode & 0o005, 0o005, "Nginx debe poder atravesar la release")
    def test_traversal(self):
        for name in ["../escape", "/etc/passwd", "dir/../../escape"]:
            with self.assertRaises(ValueError): receiver.extract_release(package([(name, b"bad")]), SHA)
        self.assertFalse((self.base / "escape").exists())
    def test_links(self):
        output = io.BytesIO()
        with tarfile.open(fileobj=output, mode="w:gz") as archive:
            item = tarfile.TarInfo("link"); item.type = tarfile.SYMTYPE; item.linkname = "/etc"
            archive.addfile(item)
        with self.assertRaises(ValueError): receiver.extract_release(output.getvalue(), SHA)
    def test_missing_game(self):
        with self.assertRaises(ValueError): receiver.extract_release(package([("index.html", b"other")]), SHA)
    def test_payload_limit(self):
        with patch.object(receiver, "MAX_ARCHIVE", 1):
            with self.assertRaises(ValueError): receiver.extract_release(package(), SHA)
    def test_prunes_only_old_sha_directories(self):
        names = [format(index, '040x') for index in range(10)]
        for index, name in enumerate(names):
            directory = self.base / 'releases' / name
            directory.mkdir()
            (directory / '__release.json').write_text(json.dumps({'git_sha': name}))
            stamp = time.time_ns() + index * 1_000_000_000
            __import__('os').utime(directory, ns=(stamp, stamp))
        keep_old = names[0]
        (self.base / 'releases' / 'manual-note').mkdir()
        removed = receiver.prune_releases({keep_old}, keep=3)
        self.assertEqual(set(removed), set(names[1:-3]))
        self.assertTrue((self.base / 'releases' / keep_old).is_dir())
        self.assertTrue((self.base / 'releases' / 'manual-note').is_dir())
    def test_release_sha_from_link(self):
        self.assertEqual(receiver.release_sha_from_link('../releases/' + SHA), SHA)
        self.assertIsNone(receiver.release_sha_from_link('../releases/current'))
        self.assertIsNone(receiver.release_sha_from_link(None))
    def test_staging_accepts_intentional_basic_auth(self):
        headers = Message(); headers['WWW-Authenticate'] = 'Basic realm="restricted"'
        unauthorized = urllib.error.HTTPError(receiver.TARGETS['deploy-staging'][1] + '/', 401, 'Unauthorized', headers, None)
        with patch.object(receiver, 'DOMAIN', receiver.TARGETS['deploy-staging'][1]), patch.object(receiver.urllib.request, 'urlopen', side_effect=unauthorized):
            self.assertTrue(receiver.homepage_healthy())
    def test_production_rejects_basic_auth(self):
        headers = Message(); headers['WWW-Authenticate'] = 'Basic realm="restricted"'
        unauthorized = urllib.error.HTTPError(receiver.TARGETS['deploy'][1] + '/', 401, 'Unauthorized', headers, None)
        with patch.object(receiver, 'DOMAIN', receiver.TARGETS['deploy'][1]), patch.object(receiver.urllib.request, 'urlopen', side_effect=unauthorized):
            self.assertFalse(receiver.homepage_healthy())
    @unittest.skipIf(__import__("sys").platform == "win32", "flock y symlinks de producción requieren Linux")
    def test_rollback(self):
        (self.base / "live/current").symlink_to("../releases/old")
        with patch.object(receiver, "healthy", return_value=False):
            with self.assertRaises(RuntimeError): receiver.deploy(package(), SHA)
        self.assertEqual(__import__("os").readlink(self.base / "live/current"), "../releases/old")
    @unittest.skipIf(__import__("sys").platform == "win32", "flock y symlinks de producción requieren Linux")
    def test_first_failed_activation_leaves_no_current_link(self):
        with patch.object(receiver, "healthy", return_value=False):
            with self.assertRaises(RuntimeError):
                receiver.deploy(package(), SHA)
        self.assertFalse((self.base / "live/current").exists())
        self.assertFalse((self.base / "live/current").is_symlink())

if __name__ == "__main__": unittest.main()
