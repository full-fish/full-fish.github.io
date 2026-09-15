---
title: "환경변수 사용법 (react, webpack, aws)"
date: 2022-06-02 23:48:16 +0900
render_with_liquid: false
categories: ["코딩 공부", "공부"]
tags: ["환경변수", "ENV"]
---

일반적으로 환경변수는 .env파일에 선언한것을 process.env.환경변수이름으로 불러와서 사용한다

**node.js 환경**

dotenv 라이브러리는 node.js환경에서 .env파일을 읽어오는것.

**react환경**

기본적으로 처리가 되어있어서 따로 라이브러리 불러올 필요는 없지만

변수이름 앞에 REACT\_APP\_을 꼭 붙여줘야함

**webpack으로 구성한 react환경**

dotenv-webpack 라이브러리 필요 (REACT\_APP\_을 안붙여줘도됨)

(아래 블로그가 설명이 잘 되어 있다)

[[React] Webpack으로 구축한 React 프로젝트에서 환경 변수(.env) 사용하기

TL;DR Webpack을 통해 직접 구성한 리액트 프로젝트 .env 파일에 환경 변수를 선언할 때 REACT\_APP\_ 으로 시작하지 않아도 됨 dotenv 패키지: DefinePlugin 을 통해 수동으로 전역 변수 정의 dotenv-webpack 패키..

db2dev.tistory.com](https://db2dev.tistory.com/entry/React-Webpack%EC%9C%BC%EB%A1%9C-%EA%B5%AC%EC%B6%95%ED%95%9C-React-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%EC%97%90%EC%84%9C-%ED%99%98%EA%B2%BD-%EB%B3%80%EC%88%98env-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0)

**aws 환경**

ec2에서 aws-cli를 이용해서

```javascript
export DATABASE_USER=$(aws ssm get-parameters --region ap-northeast-2 --names DATABASE_USER --query Parameters[0].Value | sed 's/"//g')
```

이런식으로 파라미터 스토어의 값을 불러와도 되며

```javascript
const AWS = require("aws-sdk");
const region = "ap-northeast-2";

const ssm = new AWS.SSM({ region });
getParameter = async (params) => {
  return new Promise((resolve, reject) => {
    ssm.getParameter(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        const value = data.Parameter.Value;
        console.log("test");
        // console.log(value);
        resolve(value);
      }
    });
  });
};
const params = {
  Name: "환경 변수 이름",
};
const aa = async () => {
  const values = await getParameter(params);
  console.log(`### Systems Manager > Parameter Store > ${params.Name}: ${values}`);
};
aa();
```

이런식으로 aws-sdk 라이브러리를 이용해서 코드내에서 불러올 수 있다
