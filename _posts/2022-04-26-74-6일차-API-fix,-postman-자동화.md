---
title: "6일차 / API fix, postman 자동화"
date: 2022-04-26 23:00:17 +0900
render_with_liquid: false
categories: ["Project", "codestates-final-project"]
tags: ["PROJECT", "codestates"]
---

#### **한 일**

* 상태코드 전반적 수정, 리프레시 토큰 수정
* post시 입력 내용 부족하면 422 에러
* 리프레시토큰 401에러 3개로 세분화 (엑세스 토큰이 없을때, 리프레시 토큰이 없을 때, 엑세스와 리프레시 토큰 모두 만료시)
* res 응답 형식을 그냥 data만 전송하는 것에서 data키안에 data값을 넣고 같은 선상에 accessToken 추가
* 포스트맨 자동화 : <https://fullfish.tistory.com/73>

**새로 안것**

```javascript
let a = 123
let obj = {a}
console.log(obj) // {a:123}
```

위 코드처럼 obj = {a: a}로 안써도 된다
