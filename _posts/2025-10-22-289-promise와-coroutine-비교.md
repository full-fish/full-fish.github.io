---
title: "promise와 coroutine 비교"
date: 2025-10-22 10:13:23 +0900
render_with_liquid: false
categories: ["데이터 분석", "데이터 수집"]
---

![](/assets/images/tistory/289/img.png)

**공통점**

둘다 비동기 작업을 표현함

**차이점**

- 언어레벨

promise: js 런타임에 내장된 비동기 제어 객체, 자동으로 이벤트 루프 등록되고 완료되면 콜백 실행

coroutine: phthon 언어 차원에서 제공하는 제어 구조. 스스로 실행 x (비동기 함수의 실행 컨텍스트)

- 자동 실행 여부

promise: 생성되자마자 자동으로 실행

coroutine: 생성만 되고 await나 asyncio.run()으로 실행해야함

- 역할 범위

promise: 결과값이나 에러를 전달하는 통일된 객체

coroutine: 실행을 중단/재개할 수 있는 함수 객체

```python
# Python
async def foo():
    return 10

result = foo()  # 이건 실행이 아님! 코루틴 객체를 리턴함
print(result)   # <coroutine object foo at ...>

# 실행하려면 await 이나 asyncio.run 필요
import asyncio
print(asyncio.run(foo()))  # 10
```
```javascript
// JavaScript
async function foo() {
  return 10;
}

const result = foo();  // 바로 Promise 객체
console.log(result);   // Promise { <pending> }

result.then(console.log);  // 자동으로 스케줄되어 10 출력
```
