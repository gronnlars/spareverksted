import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import deploy_bunny


class FakeS3Client:
    def __init__(self, pages):
        self.pages = iter(pages)
        self.uploads = []
        self.deletions = []

    def list_objects_v2(self, **_request):
        return next(self.pages)

    def upload_file(self, filename, bucket, key, ExtraArgs):
        self.uploads.append((Path(filename).read_bytes(), bucket, key, ExtraArgs))

    def delete_objects(self, **request):
        self.deletions.append(request)
        return {"Deleted": request["Delete"]["Objects"]}


class BunnyDeployTests(unittest.TestCase):
    def test_sync_uploads_artifact_and_removes_obsolete_remote_files(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "index.html").write_bytes(b"new site")
            client = FakeS3Client([{
                "Contents": [{"Key": "index.html"}, {"Key": "old.html"}],
                "IsTruncated": False,
            }])
            uploaded, removed = deploy_bunny.sync(
                root, "spareverksted", "test-secret", client
            )

        self.assertEqual((uploaded, removed), (1, 1))
        self.assertEqual(client.uploads, [(
            b"new site", "spareverksted", "index.html", {"ContentType": "text/html"}
        )])
        self.assertEqual(client.deletions, [{
            "Bucket": "spareverksted",
            "Delete": {"Objects": [{"Key": "old.html"}], "Quiet": True},
        }])

    def test_sync_reads_all_s3_listing_pages(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "index.html").write_bytes(b"site")
            client = FakeS3Client([
                {"Contents": [{"Key": "old-1.html"}], "IsTruncated": True,
                 "NextContinuationToken": "next-page"},
                {"Contents": [{"Key": "old-2.html"}], "IsTruncated": False},
            ])
            uploaded, removed = deploy_bunny.sync(
                root, "spareverksted", "test-secret", client
            )
        self.assertEqual((uploaded, removed), (1, 2))
        self.assertEqual(
            client.deletions[0]["Delete"]["Objects"],
            [{"Key": "old-1.html"}, {"Key": "old-2.html"}],
        )

    def test_remote_paths_cannot_escape_the_storage_zone(self):
        client = FakeS3Client([{
            "Contents": [{"Key": "nested/.."}], "IsTruncated": False,
        }])
        with self.assertRaisesRegex(RuntimeError, "unsafe object key"):
            deploy_bunny.remote_files(client, "spareverksted")


if __name__ == "__main__":
    unittest.main()