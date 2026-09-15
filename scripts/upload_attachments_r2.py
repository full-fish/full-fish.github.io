#!/usr/bin/env python3
"""assets/files/tistory 첨부파일을 Cloudflare R2에 업로드하고
_posts 마크다운의 첨부 링크를 R2 공개 URL로 치환하는 스크립트.

기본 동작:
  1) assets/files/tistory/** 업로드
  2) _posts/**/*.md 내 /assets/files/tistory/ 경로를 R2 URL로 치환

옵션:
  --delete-local   업로드/치환 후 로컬 첨부파일 삭제
"""

import argparse
import mimetypes
import os

import boto3
from dotenv import load_dotenv

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILES_ROOT = os.path.join(REPO_ROOT, "assets", "files", "tistory")
POSTS_DIR = os.path.join(REPO_ROOT, "_posts")
LOCAL_PREFIX = "/assets/files/tistory/"

load_dotenv(os.path.join(REPO_ROOT, ".env"))

ACCESS_KEY = os.environ["R2_ACCESS_KEY_ID"]
SECRET_KEY = os.environ["R2_SECRET_ACCESS_KEY"]
ENDPOINT_URL = os.environ["R2_ENDPOINT_URL"]
BUCKET_NAME = os.environ["R2_BUCKET_NAME"]
PUBLIC_URL = os.environ["R2_PUBLIC_URL"].rstrip("/")

s3 = boto3.client(
    "s3",
    endpoint_url=ENDPOINT_URL,
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY,
)


def iter_local_files():
    for root, _dirs, files in os.walk(FILES_ROOT):
        for file_name in files:
            local_path = os.path.join(root, file_name)
            rel_path = os.path.relpath(
                local_path, os.path.join(REPO_ROOT, "assets", "files")
            )
            key = rel_path.replace(os.sep, "/")
            yield local_path, key, file_name


def upload_files():
    uploaded = 0
    for local_path, key, file_name in iter_local_files():
        content_type = mimetypes.guess_type(file_name)[0] or "application/octet-stream"
        s3.upload_file(
            local_path,
            BUCKET_NAME,
            key,
            ExtraArgs={"ContentType": content_type},
        )
        uploaded += 1
    print(f"업로드 완료: {uploaded}개 파일")


def rewrite_post_links():
    updated_files = 0
    for file_name in os.listdir(POSTS_DIR):
        if not file_name.endswith(".md"):
            continue
        post_path = os.path.join(POSTS_DIR, file_name)
        with open(post_path, "r", encoding="utf-8") as f:
            content = f.read()
        if LOCAL_PREFIX not in content:
            continue
        new_content = content.replace(LOCAL_PREFIX, f"{PUBLIC_URL}/files/tistory/")
        with open(post_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        updated_files += 1
    print(f"마크다운 링크 치환 완료: {updated_files}개 파일")


def delete_local_files():
    deleted = 0
    for local_path, _key, _file_name in iter_local_files():
        os.remove(local_path)
        deleted += 1
    print(f"로컬 첨부파일 삭제 완료: {deleted}개 파일")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--delete-local", action="store_true", help="업로드/치환 후 로컬 첨부파일 삭제"
    )
    args = parser.parse_args()

    if not os.path.isdir(FILES_ROOT):
        print("첨부파일 디렉터리가 없어 업로드를 건너뜁니다.")
        return

    upload_files()
    rewrite_post_links()
    if args.delete_local:
        delete_local_files()


if __name__ == "__main__":
    main()
