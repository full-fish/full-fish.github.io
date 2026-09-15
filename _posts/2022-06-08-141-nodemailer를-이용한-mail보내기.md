---
title: "nodemailer를 이용한 mail보내기"
date: 2022-06-08 21:01:33 +0900
render_with_liquid: false
categories: ["코딩 공부", "공부"]
tags: ["nodemailer"]
---

**EmailJs**

처음에는 EmailJs로 메일을 보내려고 하였다

메일 전송에는 성공하였으나

무료회원은 한달 200개의 횟수제한,

토큰을 3개나 받아오며 보내는 절차가 복잡하기에

별다른 제약없는 nodemailer로 갈아탔다

**nodemailer**

우선 설치한다

```javascript
npm install nodemailer
```

그리고 예제대로 코딩을해서 실행을 시켜보면

```javascript
const nodemailer = require("nodemailer");
async function main() {
  let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, 
    auth: {
      user: "보내는 사람의 이메일주소", 
      pass: "보내는 사람의 비밀번호", 
    },
  });
  let info = await transporter.sendMail({
    from: "보내는 사람의 이메일주소", 
    to: "받는 사람의 이메일 주소", 
    subject: "제목", 
    text: "내용", 
    // html: "<b>Hello world?</b>", 
  });
}
```

보내는 계정으로 구글을 썼는데 로그인을 못한다고 에러가 뜬다

그 이유는

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/141/스크린샷 2022-06-06 오후 4.36.10.png)

불과 10일도 안지난 최근에

구글에서 막아버렸다

그래서 네이버에서 보내게끔 바꿨다

추가적으로 아래의것도 설치해주고

```javascript
npm install nodemailer-smtp-transport
```
```javascript
const nodemailer = require("nodemailer");
const smtpTransporter = require("nodemailer-smtp-transport");

exports.sendEmail = (email, newPassword, subject) => {
  //이메일 보내기
  var smtpTransport = nodemailer.createTransport(
    smtpTransporter({
      service: "Naver",
      host: "smtp.naver.com",
      auth: {
        user: process.env.NAVER_EMAIL, //보내는 분의 메일계정
        pass: process.env.NAVER_PASSWORD,
      },
    })
  );

  var mailOption = {
    from: process.env.NAVER_EMAIL, // 보내는 분의 메일계정
    to: email, // 받는 분의 메일계정 (여러 개 가능)
    subject: subject,
    text: '내용'
  };

  smtpTransport.sendMail(mailOption, (err, response) => {
    // 메일을 보내는 코드
    if (err) {
      console.log(err);
      throw err;
    }
  });
};
```

이런식으로 해주면 된다

**nodemailer 활용**

[리펙토링 및 개선 - 7 / nodemailer를 이용한 비밀번호 재발급

현재의 문제점 현재 user의 password는 Bcrypt에 의해 hashing되어져서 보관되고 있으므로 복호화가 불가능하다 그래서 user가 password를 잊어먹었을 경우에는 찾을 방법이 없다 만약에 mysql에서 password를

fullfish.tistory.com](https://fullfish.tistory.com/142)
