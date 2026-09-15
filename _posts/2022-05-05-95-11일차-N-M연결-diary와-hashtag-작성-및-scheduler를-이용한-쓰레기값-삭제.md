---
title: "11일차 / N : M연결 diary와 hashtag 작성 및 \bscheduler를 이용한 쓰레기값 삭제"
date: 2022-05-05 18:33:29 +0900
render_with_liquid: false
categories: ["Project", "codestates-final-project"]
tags: ["PROJECT", "cron", "sequelize"]
---

어제 팬딩이 뜨는상황은 promise로하면 해결이 되긴하지만 다른문제들 때문에 맨 처음했던 방법으로 돌아갔다

진행한 내용은 따로 정리해 뒀다

Sequelize 기본 설정 : <https://fullfish.tistory.com/91?category=1054038>

[Sequelize와 Migration 기본 설정

Migration을 하면 데이터베이스에 테이블 생성 및 삭제할것을 미리 선언해두는것이고 Seed는 그 테이블에 더미데이터를 집어 넣는거 공식문서 : https://sequelize.org/docs/v6/other-topics/migrations/ Migratio..

fullfish.tistory.com](https://fullfish.tistory.com/91?category=1054038)

Sequelize 관계 설정 : <https://fullfish.tistory.com/92?category=1054038>

[Sequelize 관계 설정 1 : N, N : M(1대다, 다대다)

trip : diary = 1 : N diart : hashtag = N : M 인 경우의 관계 설정 관계 설정방법은 2가지가 있다 마이그레이션과 모델 모두 이용하는 방법과 마이그레이션을 하지않고 모델만 이용하는 방법이 있는데 마

fullfish.tistory.com](https://fullfish.tistory.com/92?category=1054038)

N : M 관계에대한 고찰 : <https://fullfish.tistory.com/93?category=1054038>

[Sequelize N : M (다대다)관계에 대한 고찰

diary : hashtag = N : M 일때 처음에는 await diary.create() await diary\_hashtag.create() await hashtag.create() 로 각각 3개의 테이블에 데이터를 만들어 줬는데 belongsToMany로 관계설정을 해줬으니까 각..

fullfish.tistory.com](https://fullfish.tistory.com/93?category=1054038)

node-cron을 이용한 주기적인 hashtag 쓰레기값 삭제 : <https://fullfish.tistory.com/94?category=1054038>

[node-cron을 이용한 schedule

npm install node-cron // 설치 사용 예시 const cron = require('node-cron'); cron.schedule('\* \* \* \* \* \*', function () { console.log('매 초 마다 작업 실행'); }); cron.schedule의 첫인자로 실행 주기, 두..

fullfish.tistory.com](https://fullfish.tistory.com/94?category=1054038)
