---
title: "카이사르 암호(Caesar cipher)"
date: 2022-06-03 16:32:07 +0900
render_with_liquid: false
categories: ["코딩 공부", "보안"]
tags: ["카이사르", "caesar cipher"]
---

#### **카이사르 암호란**

각 글자를 n만큼 shift시킨 간단한 치환암호

예 : 'abz'를 +1만큼 shift -> 'bca'

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/137/img.png)


출처 : 위키백과

#### **코드화**

문자열의 각 문자를 유니코드화

-> 각 유니코드에 원하는 shift만큼 더해줌

-> 이 때 'z' 다음에는 'a'가 와야하므로 'z'의 유니코드를 넘어서면 알파벳의 갯수인 26을 빼줌

-> 대문자도 고려해줌

-> 유니코드를 다시 알파벳으로 변환

-> 복호화는 반대로 하면 됨

```javascript
function encrypt(str) {
  let resultArr = [];
  let unicodeArr = [];
  for (let i = 0; i < str.length; i++) {
    const unicode = str[i].charCodeAt(0);
    if (str[i] !== " ") {
      if (
        (unicode + shiftNumber > 90 && 65 <= unicode && unicode <= 90) ||
        (unicode + shiftNumber > 122 && 97 <= unicode && unicode <= 122)
      ) {
        unicodeArr.push(unicode + shiftNumber - 26);
      } else unicodeArr.push(unicode + shiftNumber);
    } else unicodeArr.push(unicode);
  }
  unicodeArr.forEach((ele) => resultArr.push(String.fromCharCode(ele)));
  return resultArr.join("");
}

function decrypt(str) {
  let resultArr = [];
  let unicodeArr = [];
  for (let i = 0; i < str.length; i++) {
    const unicode = str[i].charCodeAt(0);
    if (str[i] !== " ") {
      if (
        (unicode - shiftNumber < 65 && 65 <= unicode && unicode <= 90) ||
        (unicode - shiftNumber < 97 && 97 <= unicode && unicode <= 122)
      ) {
        unicodeArr.push(unicode - shiftNumber + 26);
      } else unicodeArr.push(unicode - shiftNumber);
    } else unicodeArr.push(unicode);
  }
  unicodeArr.forEach((ele) => resultArr.push(String.fromCharCode(ele)));
  return resultArr.join("");
}
```

처음에 위 코드대로 만들었는데

저렇게 하면 문제가있었다

1. shiftNumber이 25이하만 가능

2. 특수문자가 shifting이 되면서 shiftNumber유추가 쉬움

그래서 수정한 코드

```javascript
function encrypt(str, shiftNumber) {
  let shift = shiftNumber % 26;
  let resultArr = [];
  let unicodeArr = [];
  for (let i = 0; i < str.length; i++) {
    const unicode = str[i].charCodeAt(0);
    let a = 0;
    if (/[A-Z]/.test(str[i])) {
      if (unicode + shift > 90) a = 26;
      unicodeArr.push(unicode + shift - a);
    } else if (/[a-z]/.test(str[i])) {
      if (unicode + shift > 122) a = 26;
      unicodeArr.push(unicode + shift - a);
    } else unicodeArr.push(unicode);
  }
  unicodeArr.forEach((ele) => resultArr.push(String.fromCharCode(ele)));
  return resultArr.join("");
}

function decrypt(str, shiftNumber) {
  let shift = shiftNumber % 26;
  let resultArr = [];
  let unicodeArr = [];
  for (let i = 0; i < str.length; i++) {
    const unicode = str[i].charCodeAt(0);
    let a = 0;
    if (/[A-Z]/.test(str[i])) {
      if (unicode - shift < 65) a = 26;
      unicodeArr.push(unicode - shift + a);
    } else if (/[a-z]/.test(str[i])) {
      if (unicode - shift < 97) a = 26;
      unicodeArr.push(unicode - shift + a);
    } else unicodeArr.push(unicode);
  }
  unicodeArr.forEach((ele) => resultArr.push(String.fromCharCode(ele)));
  return resultArr.join("");
}
```

**예시**

```javascript
let str = "I am manseon azAZ!@#";
let shiftNumber = 84;

str = encrypt(str, shiftNumber);
console.log("encryptStr : ", str);
str = decrypt(str, shiftNumber);
console.log("decryptStr : ", str);

// 결과
encryptStr :  O gs sgtykut gfGF!@#
decryptStr :  I am manseon azAZ!@#
```

**카이사르 활용**

[리펙토링 및 개선 - 4 / 카이사르, 모노알파베틱 암호화 적용

한것 카이사르 암호화와 모노 알파베틱 암호화를 RSA와 함께 적용했다 (회원가입, 로그인, 비밀번호 변경) 내가 쓴 카이사르와 모노알파베틱 암호화 'bca' 코드화 문자열의 각 문자를 유니코드화 -

fullfish.tistory.com](https://fullfish.tistory.com/139)
