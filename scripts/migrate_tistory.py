#!/usr/bin/env python3
"""Tistory HTML 백업(fullfish-1-1)을 Jekyll _posts 마크다운으로 변환하는 1회성 마이그레이션 스크립트.

사용법:
    python3 scripts/migrate_tistory.py

- 원본 백업 폴더(fullfish-1-1)는 건드리지 않고 그대로 보존합니다.
- 결과물은 저장소 루트의 _posts/ 와 assets/images/tistory/ 에 새로 생성됩니다.
"""
import json
import os
import re
import shutil

import requests
from bs4 import BeautifulSoup

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKUP_DIR = os.path.join(REPO_ROOT, "fullfish-1-1")
POSTS_DIR = os.path.join(REPO_ROOT, "_posts")
IMAGES_ROOT = os.path.join(REPO_ROOT, "assets", "images", "tistory")

INVALID_FS_CHARS = re.compile(r'[<>:"/\\|?*\x00-\x1f]')


def slugify(title: str) -> str:
    slug = INVALID_FS_CHARS.sub(" ", title)
    slug = re.sub(r"\s+", "-", slug.strip())
    slug = re.sub(r"-{2,}", "-", slug).strip("-")
    return slug or "untitled"


def yaml_str(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def yaml_list(values):
    return json.dumps(values, ensure_ascii=False)


def replace_code_blocks(soup, content):
    """<pre><code> 블록을 언어 정보를 살린 placeholder로 치환(markdownify 처리 후 코드펜스로 복원)."""
    blocks = []
    for pre in content.find_all("pre"):
        code_tag = pre.find("code")
        code_text = (code_tag.get_text() if code_tag else pre.get_text()).strip("\n")
        lang = ""
        for cls in pre.get("class") or []:
            if cls not in ("", "code_block"):
                lang = cls
                break
        placeholder = f"@@CODEBLOCK{len(blocks)}@@"
        blocks.append((lang, code_text))
        pre.replace_with(placeholder)
    return blocks


def restore_code_blocks(md_content, blocks):
    for i, (lang, code_text) in enumerate(blocks):
        fence = f"```{lang}\n{code_text}\n```"
        md_content = md_content.replace(f"@@CODEBLOCK{i}@@", fence)
    return md_content


def replace_iframes(soup, content):
    """iframe(카카오TV 등 영상 임베드)을 원본 링크로 대체해 내용 유실 방지."""
    for iframe in content.find_all("iframe"):
        src = iframe.get("src", "")
        if src:
            new_p = soup.new_tag("p")
            a = soup.new_tag("a", href=src)
            a.string = "영상 보기"
            new_p.append(a)
            iframe.replace_with(new_p)
        else:
            iframe.decompose()


def process_images(soup, content, post_dir, post_id):
    dest_dir = os.path.join(IMAGES_ROOT, post_id)
    for idx, img in enumerate(content.find_all("img")):
        src = img.get("src")
        if not src:
            continue

        if src.startswith("http://") or src.startswith("https://"):
            ext = os.path.splitext(src.split("?")[0])[1] or ".png"
            file_name = f"remote_{idx}{ext}"
            os.makedirs(dest_dir, exist_ok=True)
            try:
                resp = requests.get(src, timeout=10)
                resp.raise_for_status()
                with open(os.path.join(dest_dir, file_name), "wb") as f:
                    f.write(resp.content)
                img["src"] = f"/assets/images/tistory/{post_id}/{file_name}"
            except Exception as e:
                print(f"[WARN] {post_id}: 원격 이미지 다운로드 실패 {src} ({e})")
            continue

        local_path = os.path.normpath(os.path.join(post_dir, src))
        if os.path.isfile(local_path):
            file_name = os.path.basename(local_path)
            os.makedirs(dest_dir, exist_ok=True)
            shutil.copyfile(local_path, os.path.join(dest_dir, file_name))
            img["src"] = f"/assets/images/tistory/{post_id}/{file_name}"
        else:
            print(f"[WARN] {post_id}: 로컬 이미지 없음 {local_path}")


def convert_post(post_id, post_dir, html_file):
    from markdownify import markdownify

    with open(os.path.join(post_dir, html_file), "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "html.parser")

    title_tag = soup.select_one("h2.title-article")
    title = title_tag.get_text(strip=True) if title_tag else post_id

    date_tag = soup.select_one("p.date")
    date_str = date_tag.get_text(strip=True) if date_tag else "1970-01-01 00:00:00"
    date_only = date_str.split(" ")[0]

    category_tag = soup.select_one("p.category")
    categories = [c.strip() for c in (category_tag.get_text(strip=True) if category_tag else "").split("/") if c.strip()]

    tags_tag = soup.select_one("div.tags")
    tags_text = tags_tag.get_text(strip=True) if tags_tag else ""
    tags = [t.strip() for t in tags_text.split("#") if t.strip()]

    content = soup.select_one("div.article-view div.contents_style")
    if content is None:
        print(f"[WARN] {post_id}: 본문을 찾지 못해 건너뜁니다.")
        return

    replace_iframes(soup, content)
    process_images(soup, content, post_dir, post_id)
    code_blocks = replace_code_blocks(soup, content)

    md_body = markdownify(content.decode_contents(), heading_style="ATX").strip()
    md_body = restore_code_blocks(md_body, code_blocks)

    front_matter_lines = [
        "---",
        f"title: {yaml_str(title)}",
        f"date: {date_str} +0900",
        # 코드 안의 {{ }} / {% %} 가 Liquid 문법으로 오인되지 않도록 렌더링을 끈다.
        "render_with_liquid: false",
    ]
    if categories:
        front_matter_lines.append(f"categories: {yaml_list(categories)}")
    if tags:
        front_matter_lines.append(f"tags: {yaml_list(tags)}")
    front_matter_lines.append("---")

    md_content = "\n".join(front_matter_lines) + "\n\n" + md_body + "\n"

    slug = slugify(title)
    out_name = f"{date_only}-{post_id}-{slug}.md"
    os.makedirs(POSTS_DIR, exist_ok=True)
    with open(os.path.join(POSTS_DIR, out_name), "w", encoding="utf-8") as f:
        f.write(md_content)


def main():
    post_ids = sorted(
        (d for d in os.listdir(BACKUP_DIR) if os.path.isdir(os.path.join(BACKUP_DIR, d))),
        key=lambda x: int(x),
    )
    print(f"총 {len(post_ids)}개 게시물 변환을 시작합니다.")
    for post_id in post_ids:
        post_dir = os.path.join(BACKUP_DIR, post_id)
        html_files = [f for f in os.listdir(post_dir) if f.endswith(".html")]
        if not html_files:
            print(f"[WARN] {post_id}: html 파일 없음, 건너뜁니다.")
            continue
        convert_post(post_id, post_dir, html_files[0])
    print("변환 완료.")


if __name__ == "__main__":
    main()
