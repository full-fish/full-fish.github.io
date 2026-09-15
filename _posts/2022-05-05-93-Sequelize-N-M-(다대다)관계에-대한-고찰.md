---
title: "Sequelize N : M (다대다)관계에 대한 고찰"
date: 2022-05-05 00:19:38 +0900
render_with_liquid: false
categories: ["코딩 공부", "공부"]
tags: ["다대다", "sequelize", "N : M"]
---

diary : hashtag = N : M 일때

처음에는

```javascript
await diary.create()
await diary_hashtag.create()
await hashtag.create()
```

로 각각 3개의 테이블에 데이터를 만들어 줬는데

belongsToMany로 관계설정을 해줬으니까 각각 안만들어줘도 똑똑한 sequelize가 join table은 자동 생성해줄거라고 생각했다

또한 위에처럼 각각 만들어줬을때 diary를 삭제하면 연관되는 diary\_hashtag테이블의 칼럼이 삭제되고   
또한 hashtag를 삭제했을때도 연관되는 diary\_hashtag테이블의 칼럼이 삭제는 되지만

더 나아가서 diary 삭제시 diary\_hashtag테이블이 삭제되고 diary\_hashtag테이블을 참조하는  hashtag가 1개도 없다면 해당 hashtag는 자동으로 삭제되어야한다고 생각했다

예를들어 다이어리1에 해시태그 1과 2가 있고

다이어리2에 해시태그 2와 3이있다면

해쉬태그 테이블은 1,2,3을 가질것이고

조인테이블은 (diary\_id : 1, hashtag\_id : 1), (diary\_id : 1, hashtag\_id : 2),

(diary\_id : 2, hashtag\_id : 2), (diary\_id : 2, hashtag\_id : 3)

을 가질것인데 다이어리2를 삭제시에

조인테이블은 (diary\_id : 1, hashtag\_id : 1), (diary\_id : 1, hashtag\_id : 2)

만을 가질것이고

hashtag 3은 아무곳에서도 참조안하니 삭제되어야한다고 생각한것이다

그래서 위의 코드처럼 각각 넣어주는것이아닌 메소드가 따로 존재한다고 생각했는데

스페셜메소드란것이 있다

해당 공식문서 : <https://sequelize.org/docs/v6/advanced-association-concepts/advanced-many-to-many/>

[Advanced M:N Associations | Sequelize

Make sure you have read the associations guide before reading this guide.

sequelize.org](https://sequelize.org/docs/v6/advanced-association-concepts/advanced-many-to-many/)

공식문서를 보면

```javascript
//1번 방법
const amidala = await User.create({ username: 'p4dm3', points: 1000 });
const queen = await Profile.create({ name: 'Queen' });
await amidala.addProfile(queen, { through: { selfGranted: false } });
const result = await User.findOne({
  where: { username: 'p4dm3' },
  include: Profile
});
console.log(result);
//2번 방법
const amidala = await User.create({
  username: 'p4dm3',
  points: 1000,
  profiles: [{
    name: 'Queen',
    User_Profile: {
      selfGranted: true
    }
  }]
}, {
  include: Profile
});

const result = await User.findOne({
  where: { username: 'p4dm3' },
  include: Profile
});

console.log(result);
// 출력값
{
  "id": 1,
  "username": "p4dm3",
  "points": 1000,
  "profiles": [
    {
      "id": 1,
      "name": "Queen",
      "User_Profile": {
        "selfGranted": true,
        "userId": 1,
        "profileId": 1
      }
    }
  ]
}
```

위 코드처럼 설명이 되어있는데

1번 방법은 addProfile이라는 메소드를 쓰는것을 알 수 있다 여기서 Profile은 테이블이름인데 실제 테이블이 소문자로 시작하더라도 대문자로 써줘야한다

2번방법은 한번의 create 호출로도 모든 관계를 만들 수 있는데 주의할점은 테이블명이 단수라도 profiles라고 되어있는 부분은 복수로 써줘야한다

두 방법 모두 출력값은 똑같으며 이해하기 쉽게 diary와 hashtag로 빗댄다면

```javascript
{
  "id": 1,
  "title": "놀이공원감",
  "content": "재밌었다,
  "hashtag": [
    {
      "id": 1,
      "hashtag": "good",
      "diary_hashtag": {
        "selfGranted": true,
        "diray_id": 1,
        "hashtag_id": 1
      }
    }
  ]
}
```

와 같은 출력이라고 할 수 있다

여기서 2가지 문제가 발생한다

1번 문제 : 스페셜 메소드를 이용해서 자동으로 join table이 생성되게끔 관계설정을 해주어도 diary를 삭제시 필요없어진 hashtag까지는 삭제가 안된다

2번 문제 : 다이어리를 작성할떄 해쉬태그를 동시에 생성하기에 생기는 문제인데 클라이언트에서 해쉬태그를 1개 1개받아오는것이 아니라 배열로 받아오기때문에 해쉬태그 생성시 다이어리는 1개가 생성되지만 해쉬태그는 여러개가 생성될 수 있다. 

또한 다이어리 수정시 해시태그가 생성및 삭제가 될 수 있고 배열길이도 달라질 수 있다

1번문제에 대한것은 많은 검색을 해봤는데 원래 hashtag까지는 삭제가 안되는것이 맞아보인다

왜냐하면 현재 내가 diary를 삭제해서 어디에서도 참조하지않는 hashtag값이 생기는 상황은 N : M 연결이지만 hashtag가 diary에 귀속되어있는 느낌이 강하게 나는데 사실 N : M은 서로가 종속되지않은 독립적인 테이블이라 hashtag가 지워진다면 원치않게 데이터가 삭제되는 상황이 발생될 수 있기 때문이다

하지만 옵션을 줘서 삭제유무를 선택할 수 있었으면 좋았을거 같다...

2번문제에 대한것은

스페셜메소드를 써서 데이터를 생성하는 1번방법의 경우에는 배열로 들어오는것을 각각 생성이 불가능해보이며

2번방법이 좀더 컨트롤할 껀덕지가많은데

```javascript
const amidala = await User.create({
  username: 'p4dm3',
  points: 1000,
  profiles: [{name: 'Queen'},{name: 'King'}]
}, {
  include: Profile
});

const result = await User.findOne({
  where: { username: 'p4dm3' },
  include: Profile
});
```

이런 형태처럼 profiles의 배열에 각각 넣어주면

1개의 다이어리를 생성할 때 여러개의 hashtag를 생성할 수 있다

하지만 이 방법도 문제가 있는데

hashtag가 이미 있는 값이여도 새로운 id값을 가지며 중복생성이 되어 버린다

그래서 migration에서 uniqe옵션을 주어봤더니 중복생성은 안되지만 생성 자체가 안되므로

join table에도 생성이 안되어 버린다....

또한 patch시에 원래 hashtag가 1,2,3 인데 수정되어서 들어오는 배열이

[1,3,4,5] 라면 2라는 hashtag는 삭제, 4와 5는 추가되며 배열 길이도 달라지는데 이 상황을

hashtag와 diary\_hashtag 테이블에 스페셜메소드로는 적용시킬 수 없기때문에

맨 처음했던 방법인 각각의 테이블을 컨트롤하는것으로 결론 내렸다

참고용으로 짜둔 코드를 올림 (diary에 대한 post요청과 patch요청)

```javascript
post: async (req, res) => {
    try {
      const { trip_id, title, picture, gps, content, write_date, hashtags } = req.body;
      if (!title || !picture || !content || !write_date) {
        await slack.slack("Diary Post 422");
        return res.status(422).send({ message: "insufficient parameters supplied" });
      }
      const validity = await tokenHandler.accessTokenVerify(req, res);
      if (validity) {
        //해쉬태그 제외한 다이어리 추가
        const diaryPayload = {
          trip_id,
          title,
          picture,
          gps,
          content,
          write_date,
        };
        const diaryInfo = await diary.create(diaryPayload);
        // 해쉬태그 추가 // map같은거 배열로 오는 해쉬태그를 하나하나추가 / 해쉬태그 중복여부
        hashtags.map(async (ele) => {
          const data = await hashtag.findOne({
            where: {
              hashtag: ele,
            },
          });
          let hashtagInfo = data;
          //해쉬태그가 이미 있는게 아닐경우 (없을 경우)
          if (!data) {
            const hashtagPayload = {
              hashtag: ele,
            };
            hashtagInfo = await hashtag.create(hashtagPayload);
            await slack.slack("Hashtag Post 201", `id : ${hashtagInfo.id}`);
          }
          //조인테이블 추가
          const diary_hashtagPayload = {
            diary_id: diaryInfo.dataValues.id,
            hashtag_id: hashtagInfo.dataValues.id,
          };
          await diary_hashtag.create(diary_hashtagPayload);
        });
        await slack.slack("Diary Post 201", `id : ${diaryInfo.id}`);
        res.status(201).send({ data: { id: diaryInfo.id }, accessToken: validity.accessToken });
      }
    } catch (err) {
      await slack.slack("Diary Post 501");
      res.status(501).send("Diary Post");
    }
  }
```
```javascript
  patch: async (req, res) => {
    //patch 하나만 바꾸는거고 put은 모든거 지정(지정안한거 null됨)
    try {
      const validity = await tokenHandler.accessTokenVerify(req);
      if (validity) {
        const id = req.params.diary_id;
        const { new_title, new_content, new_hashtags } = req.body;
        const diaryInfo = await diary.findOne({
          where: { id: id },
        });
        const hashtagsInfo = await diary.findAll({
          include: [
            {
              model: hashtag,
              attributes: ["id", "hashtag"], //select 뒤에 오는거 뭐 찾을지 없으면 all
            },
          ],
          where: { id: id },
        });
        const { title, content } = diaryInfo;
        let hashtags = [];
        hashtagsInfo[0].hashtags.forEach((ele) => hashtags.push(ele.hashtag));

        if (diaryInfo) {
          if (
            title === new_title &&
            content === new_content &&
            JSON.stringify(hashtags.sort()) === JSON.stringify(new_hashtags.sort())
          ) {
            // 바뀐게 없음
            await slack.slack("Diary Patch 412", `id : ${id}`);
            res.status(412).send({
              data: { id: id },
              accessToken: validity.accessToken,
              message: "No Change",
            });
          } else {
            await diary.update(
              {
                title: new_title,
                content: new_content,
              },
              { where: { id: id } }
            );
            //? 해쉬태그 부분
            //만약 new값의 요소가 현재 다이어리의 원래 db상에 없다면 조인테이블과 해쉬태그 테이블에 추가
            new_hashtags.forEach(async (ele) => {
              if (!hashtags.includes(ele)) {
                //?
                //데이터베이스상 모든 헤시태그
                const hashtagAllDBInfo = await hashtag.findAll();
                let hashtagAllDBHashtag = [];
                hashtagAllDBInfo.forEach((ele) => {
                  hashtagAllDBHashtag.push(ele.hashtag);
                });

                //new_hashtag의 요소가 모든db상에 없다면 hashtag테이블에 추가
                if (!hashtagAllDBHashtag.includes(ele)) {
                  await hashtag.create({ hashtag: ele });
                }
                const hashtag_id = await hashtag.findOne({
                  where: { hashtag: ele },
                });

                //조인 테이블추가
                const diary_hashtagPayload = {
                  diary_id: diaryInfo.dataValues.id,
                  hashtag_id: hashtag_id.dataValues.id,
                };
                await diary_hashtag.create(diary_hashtagPayload);
              }
            });
            //만약 해당 다이어리의 hashtag db상에 있는 요소가 new값에 없다면 해당 요소 조인테이블상에서 삭제
            hashtags.forEach(async (ele) => {
              const hashtag_id = await hashtag.findOne({
                where: { hashtag: ele },
              });
              if (!new_hashtags.includes(ele)) {
                await diary_hashtag.destroy({
                  where: { hashtag_id: hashtag_id.dataValues.id, diary_id: id },
                });
              }
            });
            //?

            await slack.slack("Diary Patch 200", `id : ${id}`);
            res.status(200).send({ data: { id: id }, accessToken: validity.accessToken });
          }
        } else {
          //다이어리 정보 없음
          await slack.slack("Diary Patch 404", `id : ${id}`);
          res.status(404).send({
            data: { id: id },
            accessToken: validity.accessToken,
            message: "Deleted Diary",
          });
        }
      }
    } catch (err) {
      await slack.slack("Diary Patch 501");
      res.status(501).send("Diary Patch");
    }
  }
```

아무대서도 참조하지않는 hashtag를 지우는것을

cron을 이용해서 주기적으로 삭제 구현 (delete나 patch때 마다 지워주면 계산낭비라서 주기적 삭제를 해줬다)

<https://fullfish.tistory.com/94?category=1054038>
