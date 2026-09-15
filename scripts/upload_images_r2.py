#!/usr/bin/env python3
"""assets/images/tistory 이미지를 Cloudflare R2에 업로드하고
_posts 마크다운의 이미지 경로를 R2 공개 URL로 치환하는 1회성 스크립트.

자격증명은 저장소 루트의 .env (git 추적 제외)에서 읽습니다.

사용법:
    python3 scripts/upload_images_r2.py
"""
import mimetypes
import os

import boto3
from dotenv import load_dotenv

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES_ROOT = os.path.join(REPO_ROOT, "assets", "images", "tistory")
POSTS_DIR = os.path.join(REPO_ROOT, "_posts")
LOCAL_PREFIX = "/assets/images/tistory/"

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


def upload_images():
    uploaded = 0
    for root, _dirs, files in os.walk(IMAGES_ROOT):
        for file_name in files:
            local_path = os.path.join(root, file_name)
            # 로컬 경로 구조(tistory/<post_id>/<file>)를 그대로 R2 key로 사용해 파일명 충돌 방지
            rel_path = os.path.relpath(local_path, os.path.dirname(IMAGES_ROOT))
            key = rel_path.replace(os.sep, "/")
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
    updated = 0
    for file_name in os.listdir(POSTS_DIR):
        if not file_name.endswith(".md"):
            continue
        path = os.path.join(POSTS_DIR, file_name)
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        if LOCAL_PREFIX not in content:
            continue
        new_content = content.replace(LOCAL_PREFIX, f"{PUBLIC_URL}/tistory/")
        with open(path, "w", encoding="utf-8") as f:
            f.write(new_content)
        updated += 1
    print(f"마크다운 경로 치환 완료: {updated}개 파일")


if __name__ == "__main__":
    upload_images()
    rewrite_post_links()
