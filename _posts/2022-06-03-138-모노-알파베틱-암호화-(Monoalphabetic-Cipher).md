---
title: "모노 알파베틱 암호화 (Monoalphabetic Cipher)"
date: 2022-06-03 16:46:10 +0900
render_with_liquid: false
categories: ["코딩 공부", "보안"]
tags: ["암호화", "모노알파베틱", "Monoalphabetic Cipher", "Monoalphabetic"]
---

앞선 카이사르 암호화와 마찬가지로 치환암호

26자의 알파벳을 각기 다른 알파벳으로 치환시킴

![](/assets/images/tistory/138/img.png)

#### **코드화**

알파벳이

오름차순된 ('abcd...') 문자열과

랜덤으로 뒤섞인 문자열을 준비해서

각 알파벳의 index를 참고하여 치환한다

```javascript
function encrypt(str) {
  let resultArr = [];
  for (let i = 0; i < str.length; i++) {
    if (/[a-z]/.test(str[i])) resultArr.push(lowerMonoAlphabet[lowerAlphabet.indexOf(str[i])]);
    else if (/[A-Z]/.test(str[i])) resultArr.push(upperMonoAlphabet[upperAlphabet.indexOf(str[i])]);
    else resultArr.push(str[i]);
  }
  return resultArr.join("");
}

function decrypt(str) {
  let resultArr = [];
  for (let i = 0; i < str.length; i++) {
    if (/[a-z]/.test(str[i])) resultArr.push(lowerAlphabet[lowerMonoAlphabet.indexOf(str[i])]);
    else if (/[A-Z]/.test(str[i])) resultArr.push(upperAlphabet[upperMonoAlphabet.indexOf(str[i])]);
    else resultArr.push(str[i]);
  }
  return resultArr.join("");
}
```

**예시**

```javascript
const lowerAlphabet = "abcdefghijklmnopqrstuvwxyz";
const lowerMonoAlphabet = "jnahiuvrylzmbfcsqtdeogpwxk";
const upperAlphabet = "ABCDEFGHIGKLMNOPQRSTUVWXYZ";
const upperMonoAlphabet = "HPLDCTVSNWAXGZBYFGEMORKQUI";

let str = "I! am manseon";
console.log("str : ", str);
str = encrypt(str);
console.log("encryptStr : ", str);
str = decrypt(str);
console.log("decryptStr : ", str);

// 결과
str :  I! am manseon
encryptStr :  N! jb bjfdicf
decryptStr :  I! am manseon
```

**모노 알파베틱 활용**

[리펙토링 및 개선 - 4 / 카이사르, 모노알파베틱 암호화 적용

한것 카이사르 암호화와 모노 알파베틱 암호화를 RSA와 함께 적용했다 (회원가입, 로그인, 비밀번호 변경) 내가 쓴 카이사르와 모노알파베틱 암호화 'bca' 코드화 문자열의 각 문자를 유니코드화 -

fullfish.tistory.com](https://fullfish.tistory.com/139)
