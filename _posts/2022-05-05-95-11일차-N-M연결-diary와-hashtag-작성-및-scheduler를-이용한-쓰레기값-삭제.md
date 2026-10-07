---
title: "11일차 / N : M연결 diary와 hashtag 작성 및 scheduler를 이용한 쓰레기값 삭제"
date: 2022-05-05 18:33:29 +0900
render_with_liquid: false
categories: ["Project", "codestates-final-project"]
tags: ["PROJECT", "cron", "sequelize"]
---

어제 팬딩이 뜨는상황은 promise로하면 해결이 되긴하지만 다른문제들 때문에 맨 처음했던 방법으로 돌아갔다

진행한 내용은 따로 정리해 뒀다

Sequelize 기본 설정 : [Sequelize와 Migration 기본 설정](/blog/91-Sequelize%EC%99%80-Migration-%EA%B8%B0%EB%B3%B8-%EC%84%A4%EC%A0%95/)

Sequelize 관계 설정 : [Sequelize 관계 설정 1 : N, N : M(1대다, 다대다)](/blog/92-Sequelize-%EA%B4%80%EA%B3%84-%EC%84%A4%EC%A0%95-1-N,-N-M(1%EB%8C%80%EB%8B%A4,-%EB%8B%A4%EB%8C%80%EB%8B%A4)/)

[Sequelize 관계 설정 1 : N, N : M(1대다, 다대다)](/blog/92-Sequelize-%EA%B4%80%EA%B3%84-%EC%84%A4%EC%A0%95-1-N,-N-M(1%EB%8C%80%EB%8B%A4,-%EB%8B%A4%EB%8C%80%EB%8B%A4)/)

N : M 관계에대한 고찰 : [Sequelize N : M (다대다)관계에 대한 고찰](/blog/93-Sequelize-N-M-(%EB%8B%A4%EB%8C%80%EB%8B%A4)%EA%B4%80%EA%B3%84%EC%97%90-%EB%8C%80%ED%95%9C-%EA%B3%A0%EC%B0%B0/)

[Sequelize N : M (다대다)관계에 대한 고찰](/blog/93-Sequelize-N-M-(%EB%8B%A4%EB%8C%80%EB%8B%A4)%EA%B4%80%EA%B3%84%EC%97%90-%EB%8C%80%ED%95%9C-%EA%B3%A0%EC%B0%B0/)

node-cron을 이용한 주기적인 hashtag 쓰레기값 삭제 : [node-cron을 이용한 schedule](/blog/94-node-cron%EC%9D%84-%EC%9D%B4%EC%9A%A9%ED%95%9C-schedule/)
