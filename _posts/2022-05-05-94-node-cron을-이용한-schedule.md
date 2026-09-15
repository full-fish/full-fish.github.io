---
title: "node-cron을 이용한 schedule"
date: 2022-05-05 16:49:40 +0900
render_with_liquid: false
categories: ["코딩 공부", "공부"]
tags: ["Schedule", "cron"]
---

```javascript
npm install node-cron // 설치
```

**사용 예시**

```javascript
const cron = require('node-cron');

cron.schedule('* * * * * *', function () {
  console.log('매 초 마다 작업 실행');
});
```

cron.schedule의 첫인자로 실행 주기, 두번째 인자로 콜백 함수 입력

**메소드**

기본적으로 자동실행인데

```javascript
const cron = require('node-cron');

const a = cron.schedule('* * * * * *', function () {
  console.log('매 초 마다 작업 실행');
}, {
  scheduled: false
});

a.start();
```

scheduled를 false로 주면 a.start()해야지만 실행된다

a.stop() // 실행 중지

a.destory() : 작업 삭제 (재 실행 못함)

a.validate() : 작성한 실행주기가 유효한지(맞는 문법인지)

**실행주기 설정**

```javascript
# ┌───────────── minute (0 - 59)
# │ ┌───────────── hour (0 - 23)
# │ │ ┌───────────── day of the month (1 - 31)
# │ │ │ ┌───────────── month (1 - 12)
# │ │ │ │ ┌───────────── day of the week (0 - 6) (Sunday to Saturday;
# │ │ │ │ │                                   7 is also Sunday on some systems)
# │ │ │ │ │
# │ │ │ │ │
# * * * * * command to execute
```

기본적으로 5자리를 쓰는데 초까지 설정하고 싶다면 6자리를 쓴다

예시

```javascript
* * * * * * // 매초 마다
* * * * * // 매분 마다
* * * * // 이건 안됨 적어도 5자리 이상되어야함
0 * * * * // 0분 일때 즉, 1시간마다인데 분이 0일때마다 실행
1,2,4,5 * * * * // 1,2,4,5분일때 실행
1-10 * * * * // 1~10분일때 실행
*/3 * * * * // 3분마다 실행

// month와 week에는 이름이나 약어 사용 가능
* * * January Monday // 1월의 월요일 마다
* * * Jan Mon // 위와 동일
```

**실 사용 예시**

diary : hashtag = N : M 일때 diary삭제시 join table이 삭제되고 hashtag가 어디에서도 참조되지 않아서 필요없는 값이 됐을때 주기적으로 삭제하기위한 로직

```javascript
const { hashtag, diary_hashtag } = require("../../models");
const cron = require("node-cron");

schedule = cron.schedule(
  "0 * * * *", //1시간마다
  async function () {
    try {
      const hashtagAllDBInfo = await hashtag.findAll();
      const diary_hashtagALLDBInfo = await diary_hashtag.findAll();
      let diary_hashtagAllDBHashtag = [];
      diary_hashtagALLDBInfo.forEach((ele) => {
        diary_hashtagAllDBHashtag.push(ele.dataValues.hashtag_id);
      });
      hashtagAllDBInfo.forEach(async (ele) => {
        if (!diary_hashtagAllDBHashtag.includes(ele.dataValues.id)) {
          await hashtag.destroy({
            where: { id: ele.dataValues.id },
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
  { scheduled: false }
);
exports.cron = () => {
  schedule.start();
};
```
