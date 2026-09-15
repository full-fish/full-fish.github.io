---
title: "정규표현식의 capture, group"
date: 2022-05-09 01:28:07 +0900
render_with_liquid: false
categories: ["코딩 공부", "공부"]
---

```javascript
//예시 문자열
let str = "안녕하세요 안녕 제 전화번호는 010-1234-5678입니다 G gd god good goood!.";
```

capture는 ()로 사용

```javascript
str.match(/전화번호/)
//반환
[
  '전화번호',
  index: 11,
  input: '안녕하세요 안녕 제 전화번호는 010-1234-5678입니다 good!.',
  groups: undefined
]

str.match(/전화(번호)/)
//반환
[
  '전화번호',
  '번호',
  index: 11,
  input: '안녕하세요 안녕 제 전화번호는 010-1234-5678입니다 good!.',
  groups: undefined
]
```

위 코드에서 처럼 '번호'에 capture을 할 경후 match의 반환값 2번째 인자로 capture안의 문자열이 들어간다

```javascript
일반적으로 replace는 바꾸고 싶은 부분을 검색해서 치환하는데 capture을 쓰면 검색된 부분만을 남길 수 있다
str.replace(/(안녕하세요).*/, "$1 안녕하세요뺴고 지우기")
// '안녕하세요 안녕하세요뺴고 지우기'

$1를 숫자만큼 이용가능하다
str.replace(/(전화)(번호)/, "$2-$1")
// '안녕하세요 안녕 제 번호-전화는 010-1234-5678입니다 good!.'

떨어진 글자는 그 사이글자들도 생각해야한다
str.replace(/(안녕하세요).*(전화번호)/, "$2-$1")
// '전화번호-안녕하세요는 010-1234-5678입니다 good!.'
```

쓰는중....
