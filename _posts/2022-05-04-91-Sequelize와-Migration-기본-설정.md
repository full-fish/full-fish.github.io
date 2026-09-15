---
title: "Sequelize와 Migration 기본 설정"
date: 2022-05-04 00:56:37 +0900
render_with_liquid: false
categories: ["코딩 공부", "공부"]
tags: ["Migration", "sequelize"]
---

Migration을 하면 데이터베이스에 테이블 생성 및 삭제할것을 미리 선언해두는것이고

Seed는 그 테이블에 더미데이터를 집어 넣는거

공식문서 : <https://sequelize.org/docs/v6/other-topics/migrations/>

[Migrations | Sequelize

Just like you use version control systems such as Git to manage changes in your source code, you can use migrations to keep track of changes to the database. With migrations you can transfer your existing database into another state and vice versa: Those s

sequelize.org](https://sequelize.org/docs/v6/other-topics/migrations/)

**초기 세팅**

```javascript
npm install sequelize
npm install --save-dev sequelize-cli
npx sequelize-cli init
```

**Migration 파일 생성**

```javascript
npx sequelize-cli model:generate --name user --attributes name:string,age:integer
```

터미널에 위의 코드 입력시

```javascript
//20220503160532-create-user.js
'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', { //테이블 이름 단수로 하고 싶으면 s 제거
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      age: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        //defaultValue: Sequelize.fn("now") // 현재값을 원한다면
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users'); ////테이블 이름 단수로 하고 싶으면 s 제거
  }
};
```
```javascript
// /models/user.js
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user.init({
    name: DataTypes.STRING,
    age: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'user',
    // 테이블이름 단수형으로 쓰고 싶다면 아래 두개와 migration파일내의 이름도 단수로
     //modelName: "user",
     //freezeTableName: true,
  });
  return user;
};
```

이런 파일이 생성된다

테이블이름이 자동으로 복수형으로 생성되는데

단수형으로 바꾸고 싶다면  위의 주석처럼 migration 파일과 model파일에서 설정해준다

**Migrate 파일 실행**

```javascript
npx sequelize db:migrate
```

**Migrate 실행 취소**

```javascript
npx sequelize-cli db:migrate:undo // 가장 최근꺼 되돌리기
npx sequelize-cli db:migrate:undo:all // 초기 상태로 돌리기
npx sequelize-cli db:migrate:undo:all --to XXXXXXXXXXXXXX-create-posts.js //특정 마이그레이션으로 돌리기
```

**Seed 파일 생성**

```javascript
npx sequelize-cli seed:generate --name demo-user
```
```javascript
// /seeders/20220408012810-demo-user.js
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("user", [
      {
        name: "admin",
        age: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "sub",
        age: 21,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("user", null, {});
  },
};
```

이런 파일이 생성되는데 위의 코드처럼 적절한 더미데이터를 넣어준다

**Seed 파일 실행**

```javascript
npx sequelize-cli db:seed:all
```

**Seed 파일 실행 취소**

```javascript
npx sequelize-cli db:seed:undo // 최근 시드 취소
npx sequelize-cli db:seed:undo --seed name-of-seed-as-in-data // 특정 시드 취소
npx sequelize-cli db:seed:undo:all // 모든 시드 취소
```

관계 설정에 대해 : <https://fullfish.tistory.com/92?category=1054038>

[Sequelize 관계 설정 1 : N, N : M(1대다, 다대다)

trip : diary = 1 : N diart : hashtag = N : M 인 경우의 관계 설정 관계 설정방법은 2가지가 있다 마이그레이션과 모델 모두 이용하는 방법과 마이그레이션을 하지않고 모델만 이용하는 방법이 있는데 마

fullfish.tistory.com](https://fullfish.tistory.com/92?category=1054038)
