# full-fish.github.io

fullfish가 만든 앱 소개와 개발 블로그입니다. → https://full-fish.github.io

- `/` 앱 목록 (FullWeight, Pocketlog)
- `/privacy/<앱>/`, `/terms/<앱>/` 앱별 개인정보처리방침 · 이용약관
- `/blog/` 글 전체, `/categories/`, `/tags/`

## 구조

| 경로 | 내용 |
| --- | --- |
| `_data/apps.yml` | 홈에 나오는 앱 목록. 앱을 추가하면 여기에 항목 하나, 아이콘은 `assets/images/apps/<id>/icon.png` (512px) |
| `_layouts/apps-home.html` | 홈 화면 |
| `_pages/` | 블로그 목록·카테고리·태그 페이지, 앱별 개인정보처리방침·약관 |
| `_posts/` | 블로그 글 (티스토리에서 이전). 주소는 `/blog/<파일명에서 날짜를 뺀 부분>/` |
| `_plugins/` | 카테고리·태그 페이지, 사이드바 카테고리 트리, 예전 글 주소 리다이렉트를 빌드 때 만듭니다 |
| `_data/category_tree.yml` | 카테고리 표시 순서. `/admin/`에서 편집 |
| `_data/legacy_urls.yml` | 2026-10 주소 개편 전 글 주소 → 새 주소 리다이렉트 목록 (고정값, 수정하지 않음) |
| `admin/` | 카테고리 관리자 (GitHub 토큰으로 저장소에 직접 커밋) |
| `_sass/fullfish/` | 사이트 스타일 (`_variables.scss`가 색·글꼴 토큰) |
| `_layouts/`, `_includes/`, `_sass/minimal-mistakes/` | [Minimal Mistakes](https://github.com/mmistakes/minimal-mistakes) 4.24 테마 (일부 수정) |
| `scripts/` | 티스토리 이전 · R2 업로드용 일회성 스크립트 (사이트에는 안 올라감) |

## 로컬 실행

Ruby 3.3 이상이 필요합니다.

```sh
bundle install
bundle exec jekyll serve   # http://localhost:4000
```

## 글 쓰기

`_posts/YYYY-MM-DD-제목.md`

```yaml
---
title: "제목"
date: 2026-10-05 21:00:00 +0900
categories: ["코딩 공부", "공부"]   # [부모, 자식]
tags: ["javascript"]
math: true                         # 수식($...$)이 있을 때만
---
```

카테고리는 글의 `categories`가 기준이고, `_data/category_tree.yml`은 순서만 정합니다. 글이 없는 카테고리는 보이지 않습니다.

## 배포

`main`에 push하면 GitHub Actions(`.github/workflows/pages.yml`)가 빌드해서 GitHub Pages에 올립니다.
