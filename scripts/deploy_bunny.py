"""Mirror a built static site to a Bunny Storage Zone using its S3 API."""
import argparse
import mimetypes
import os
from pathlib import Path


S3_ENDPOINT = "https://de-s3.storage.bunnycdn.com"


def remote_files(client, zone):
    files = set()
    token = None
    while True:
        request = {"Bucket": zone}
        if token:
            request["ContinuationToken"] = token
        response = client.list_objects_v2(**request)
        for entry in response.get("Contents", []):
            key = entry.get("Key")
            if not isinstance(key, str) or not key or any(
                part in {"", ".", ".."} for part in key.split("/")
            ):
                raise RuntimeError("Bunny S3 returned an unsafe object key.")
            files.add(key)
        if not response.get("IsTruncated"):
            return files
        token = response.get("NextContinuationToken")
        if not token:
            raise RuntimeError("Bunny S3 returned a truncated listing without a token.")
    return files


def local_files(root):
    files = {}
    for path in root.rglob("*"):
        if path.is_symlink():
            raise RuntimeError("The site artifact must not contain symbolic links.")
        if path.is_file():
            files[path.relative_to(root).as_posix()] = path
    if not files:
        raise RuntimeError("The site artifact is empty.")
    return files


def sync(root, zone, password, client):
    root = Path(root).resolve()
    if not root.is_dir():
        raise RuntimeError("The site artifact directory does not exist.")
    if not zone or not password:
        raise RuntimeError("BUNNY_STORAGE_ZONE and BUNNY_STORAGE_PASSWORD are required.")

    desired = local_files(root)
    existing = remote_files(client, zone)
    for relative, path in sorted(desired.items()):
        content_type = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
        client.upload_file(
            str(path), zone, relative, ExtraArgs={"ContentType": content_type}
        )

    obsolete = sorted(existing - desired.keys())
    for offset in range(0, len(obsolete), 1000):
        batch = obsolete[offset:offset + 1000]
        response = client.delete_objects(
            Bucket=zone,
            Delete={"Objects": [{"Key": key} for key in batch], "Quiet": True},
        )
        if response.get("Errors"):
            raise RuntimeError("Bunny S3 could not remove all obsolete objects.")
    return len(desired), len(obsolete)


def create_client(zone, password):
    import boto3
    from botocore.config import Config

    return boto3.client(
        "s3",
        endpoint_url=S3_ENDPOINT,
        region_name="de",
        aws_access_key_id=zone,
        aws_secret_access_key=password,
        config=Config(signature_version="s3v4", s3={"addressing_style": "path"}),
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("site_directory", type=Path)
    args = parser.parse_args()
    zone = os.environ.get("BUNNY_STORAGE_ZONE", "")
    password = os.environ.get("BUNNY_STORAGE_PASSWORD", "")
    try:
        client = create_client(zone, password)
        uploaded, removed = sync(args.site_directory, zone, password, client)
    except Exception as error:
        if isinstance(error, (OSError, RuntimeError)):
            message = str(error)
        else:
            message = f"Bunny S3 request failed ({type(error).__name__})."
        parser.exit(1, f"Deployment failed: {message}\n")
    print(f"Bunny Storage synchronized: {uploaded} files uploaded, {removed} obsolete files removed.")


if __name__ == "__main__":
    main()