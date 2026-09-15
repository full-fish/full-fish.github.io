---
title: "playwright, aiomysql"
date: 2025-10-21 17:24:45 +0900
render_with_liquid: false
categories: ["데이터 분석", "데이터 수집"]
---

웹 브라우저를 자동으로 제어하는 라이브러리

```python
pip install playwright
playwright install chromium # Chromium 만 설치
playwright install # Chromium, Firefox, WebKit 엔진을 모두 설치 우선 Chromium만 필요
``````python
# 기본 예제
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        await page.goto("https://example.com")
        title = await page.title()
        print("제목", title)
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
``````javascript
await p.chromium.launch(headless=True) # defual는 True인데 False하면 창 있이 실행
await browser.new_page()
await page.goto(url)
await page.content() # 현재 페이지의 HTML을 문자열로 반환
await page.query_selector(selector) 
await page.query_selector_all(selector)
await element.inner_text(), .text_content(), .inner_html() # 선택된 요소의 내용(텍스트)을 가져옴
await page.screenshot(path="...") # path='~.png'

await page.evaluate(“java script code”) 
'''
브라우저 내부(웹페이지의 JavaScript 환경) 에서 직접 코드를 실행할 수
있게 해주는 기능
current_height = await page.evaluate("document.body.scrollHeight")
await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
'''
await page.click(selector)
await page.fill(selector, value) # 텍스트 비동기 입력
await page.wait_for_selector(selector) # 특정 요소가 페이지 안에 나타날 때까지 대기
```

**locate**

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/288/img.png)

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/288/img_1.png)

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/288/img_2.png)

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/288/img_3.png)

```javascript
page.locator(selector)
'''
요소가 나타날 때가지 대기 + 재사용 가능한 요소 객체 리턴
Locator 객체는 요소의 집합으로 각 요소를 실행 시 접근할 수 있는 handle의 묶음
실행 시점의 dom을 확인해서 실행
'''

# locator을 쓰면 wait_for_selector를 대부분의 상황에서 안써도됨
await page.wait_for_selector("button#submit")
await page.click("button#submit")
->
button = page.locator("button#submit")
await button.click()

# 하지만 wait_for_selector를 써야할 경우
요소 존재 여부만 검사하고 싶을 때
페이지 전체가 바뀌는 시점 기다릴 때 (로그인 버튼 누르고 다음 페이지의 특정 요소 대기)
locator 생성 전 초기 로딩 기다릴 때 (locator은 page.load후 만드는게 안전 함)

locator은 현재 로드된 페이지 안에서만 요소가 나타날떄 까지 기다리는거라
페이지 넘어가면 기존 dom 사라짐
await page.locator("button#login").click()
await page.locator("div.dashboard").click()  # ❌ 바로 하면 실패할 수 있음
->
해결 법
1.
await page.locator("button#login").click()
await page.wait_for_url("**/dashboard")
await page.locator("div.dashboard").click()

2.
await page.locator("button#login").click()
await page.wait_for_load_state("networkidle")
await page.locator("div.dashboard").click()

3. (이게 제일 좋음)
await page.locator("button#login").click()
await page.wait_for_selector("div.dashboard")  # 새 페이지의 DOM을 기다림
```

**비동기 병렬 실행**

```python
asyncio.gather()
'''
여러 개의 비동기 작업을 동시에 실행하고,
전부 끝날 때까지 기다리는 함수
하나의 task라도 raise Exception() 이 발생하면
나머지 task들이 모두 CancelledError 로 중단
'''

results = await asyncio.gather(task1, task2, task3)

await asyncio.gather(*tasks, return_exceptions=True)
#예외가 발생해도 다른 작업은 계속 진행. 결과 리스트에 정상 결과는 값으로, 오류는 예외 객체로 들어감
```

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/288/img_4.png)

```python
await aiomysql.connect() → MySQL 서버에 연결 (비동기)
await conn.cursor() → 비동기 커서 객체 생성
await cur.execute(sql, params) → SQL 명령 실행
await cur.fetchall() → 모든 행 가져오기
await cur.fetchone() → 한 행만 가져오기
await cur.fetchmany(size) → 지정한 개수만큼 가져오기
await conn.commit() → 트랜잭션 커밋
await conn.rollback() → 트랜잭션 롤백
conn.close() → 연결 종료
aiomysql.create_pool() → 연결 풀(Connection Pool) 생성
pool.acquire() → Connection Pool에서 하나의 MySQL 연결(Connection)을 빌려오기
pool.close() → 연결 풀을 닫힘으로 요청 (동기)
await pool.wait_close() → 실제 연결이 닫히기를 기다리는 함수 (비동기)
``````python
# 예제
import asyncio
import aiomysql


async def query_user(pool, user_id):
    async with pool.acquire() as conn:
        async with conn.cursor() as cur:
            await cur.execute("SELECT * FROM users WHERE id=%s", (user_id,))
            return await cur.fetchone()


async def main():
    pool = await aiomysql.create_pool(
        host="127.0.0.1",
        port=3306,
        user="root",
        password="--",
        db="testdb",
        minsize=1,
        maxsize=5,  # 최대 동시 연결 수
    )
    tasks = [query_user(pool, i) for i in range(1, 6)]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    print(results)

    pool.close()
    await pool.wait_closed()


asyncio.run(main())
```
