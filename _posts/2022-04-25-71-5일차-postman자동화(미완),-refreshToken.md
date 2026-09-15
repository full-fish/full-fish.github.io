---
title: "5일차 / postman자동화(미완), refreshToken"
date: 2022-04-25 23:58:12 +0900
render_with_liquid: false
categories: ["Project", "codestates-final-project"]
tags: ["exports", "module.exports", "RefreshToken", "리프레시토큰"]
---

포트스맨 자동화는 내일 완성하고 쓰겠음

리프레시토큰은 엑세스토큰이 만료됐을때 재발행시켜주는 토큰.

일반적으로 아래처럼 엑세스토큰과 리프레시토큰을 발행한 후

엑세스토큰은 res로 보내고

리프레시토큰은 쿠키에 담는다

```javascript
          const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET, { expiresIn: "1s" });
          const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: "7d" });
          res.cookie("refreshToken", refreshToken, {
            sameSite: "Strict",
            httpOnly: true,
            secure: true, 
          });

          res.status(200).send({
            accessToken: accessToken,
          });
```

클라이언트에서 요청이 왔을때 엑세스 토큰 검증 후 문제가 없다면 데이터를 보내준다

하지만 엑세스 토큰이 만료되서 리프레시 토큰으로 재발행 시켜줘야할때가 있으므로

엑세스 토큰 검증

1. 엑세스 토큰이 틀릴 경우 틀리다고 전송

2. 정상적이면 데이터와 빈 엑세스 토큰값 전송

3. 유효기간이 만료됐으면 리프레시 토큰 검증

-> 리프레스 토큰 검증에 대해

  1. 리프레시 토큰이 틀리면 틀리다고 전송

  2. 리프레시 토큰이 정상적이면 데이터와 새로 발행한 엑세스 토큰 전송

  3. 리프레시 토큰이 만료됐다면 만료됐다고 전송

이 순서로 진행된다

-----------------

그리고 내부에 await이 들어갔다면 나중에 실행되서 순서가 꼬이므로

그 상위 상위의 모든 부분을 await을 해줘야한다

-----------------

보통 모듈화해서 export할때 이런식으로 묶어 쓰는데

```javascript
module.exports={
    a: () =>{},
    b: () =>{}
}
```

이러면 a함수에서 b함수는 객체 본인 호출이라 불가능하다

그럴경우

```javascript
exports.a=()=>{}
exports.b=()=>{}
```

이거처럼 각각의 함수를 export해주면 a함수내에서 b함수 호출이 가능하다

**내일할것**

api 401번을 3개로 분기하기

코드상 200번대 요청의 메시지 삭제하기

코드상 비동기를 다 주기
