---
title: "Hash와 Salt 그리고 Bcrypt"
date: 2022-05-26 23:10:34 +0900
render_with_liquid: false
categories: ["코딩 공부", "보안"]
tags: ["hash", "Salt", "BCrypt"]
---

#### **기본 용어**

hash : 다양한 길이를 가진 데이터를 고정된 길이의 데이터로 매핑하는것

digest : hash에 의해 암호화된 데이터

avalanche(눈사태) 효과 : 작은 변화에도 결과가 완전히 달라짐

rainbow 공격 : 공격자가 rainbow table을 이용해서 원본 데이터 찾는것

rainbow table : 원본 데이터와 매칭되는 digest들을 모아놓은 테이블

salt : digest 생성시 추가하는 임의의 문자열

brute force : 무차별 대입 공격

#### **개념**

**hash란**

![](/assets/images/tistory/123/img.png)

일반적으로 자료구조에서 검색을 할때는 선형적으로 검색하므로 시간복잡도가 **O(n)**이다.

해시를 쓰면 John Smith를 특정 해시함수를 통해 나온 값을 (여기서는 02)인덱스로 사용해서 저장한다

그러므로 시간복잡도가 **O(1)**이다

**hash의 특징**

무결성 : 눈사태 효과

보안성 : 복호화 불가

비둘기집 원리 : 해시 충돌 일어 날 수 있음

**hashing과 암호화의 차이점**

암호화는 복호화가 가능.

hashing된 digest는 복호화가 불가능하다.

왜냐하면 (salt가 없을때) 하나의 데이터는 hashing시 항상 같은 digest가 되지만

해당 digest를 만들 수 있는 데이터는 무한하다.

st-lab님 말씀 : "해싱 알고리즘 자체가 비가역성 성질을 갖고있는데, 대부분의 해싱 알고리즘은 패딩(padding)과정과 더불어 xor 혹은 부분 커팅을 하기 때문에 원본 데이터는 손실이 발생하게 되어 정확한 데이터를 얻을 수 있는 역함수(역해싱)을 만들 수 없죠"

**hash값 충돌**

같은 digest값을 만들 수 있는 데이터는 무한하므로

다른 데이터지만 같은 digest값을 가지는 경우가 생길 수 있다.

충돌이 안나는 경우가 제일 좋지만 피치못할 경우에는 2가지의 대표적인 해결법이 있다

1. Separate Chaining (분리 연결법)

![](/assets/images/tistory/123/img_1.png)

충돌이 일어날 시 추가 메모리를 사용해서 다음 데이터의 주소를 저장함

즉, 'John Smith'와 'Sandra Dee'가 같은 곳을 참조하므로 이중배열을 만들어서 그 안에 저장

2. Open Addressing (개방 주소법)

추가 메모리를 사용하지는 않음.

빈 해시테이블의 공간에 저장하는 방법 3가지 방법이 있다.

Linear Probing: 현재의 버킷 index로부터 고정폭 만큼씩 이동하여 차례대로 검색해 비어 있는 버킷에 데이터를 저장한다.

Quadratic Probing: 해시의 저장순서 폭을 제곱으로 저장하는 방식이다. 예를 들어 처음 충돌이 발생한 경우에는 1만큼 이동하고 그 다음 계속 충돌이 발생하면 2^2, 3^2 칸씩 옮기는 방식이다.

Double Hashing Probing: 해시된 값을 한번 더 해싱하여 해시의 규칙성을 없애버리는 방식이다. 해시된 값을 한번 더 해싱하여 새로운 주소를 할당하기 때문에 다른 방법들보다 많은 연산을 하게 된다.

**hash 충돌의 문제점**

해시충돌을 발견하면 이를 이용해서 위조된 데이터로 바꿔치기 할 수 있다.

brute force로 공격을 하여 해시충돌을 찾으려고 할때 모든 수를 대입할 필요가 없는것이 생일 문제에 의해서 직관적인 생각보다

더 높은 확률로 해시충돌을 찾을 수 있다.

(생일 문제 : <https://ko.wikipedia.org/wiki/%EC%83%9D%EC%9D%BC_%EB%AC%B8%EC%A0%9C>)

**우선 많이 쓰는 hashing 알고리즘인 SHA-256을 이용해 설명하겠다.**

**hashing**

'1234'라는 데이터를 SHA-256을 통과시키면

'03AC674216F3E15C761EE1A5E255F067953623C8B388B4459E13F978D7C846F4'라는 digest가 나온다.

**avalanche(눈사태) 효과**

```javascript
'1234' //를 해싱하면
'03AC674216F3E15C761EE1A5E255F067953623C8B388B4459E13F978D7C846F4'

'1235' //를 해싱하면
'310CED37200B1A0DAE25EDB263FE52C491F6E467268ACAB0FFEC06666E2ED959'

'12345' //를 해싱하면
'5994471ABB01112AFCC18159F6CC74B4F511B99806DA59B3CAF5A9C173CACFC5'
```

데이터의 일부분만 바뀌었지만 digest는 완전히 바뀜

**한계 1.**

컴퓨터 성능이 올라감에 따라 brute force에 의해 뚫리는 시간이 짧게 걸림

**한계 2.**

항상 같은 데이터값은 같은 digest를 가짐.

그로인해 데이터값과 digest를 매칭시켜놓은 테이블인

레인보우 테이블을 이용해서 원본 데이터를 취득할 수 있게됨

**한계 1의 해결법 : Key Stretching (키 스트레칭)**

hashing한 digest를 다시 hashing하는것을 반복함

![](/assets/images/tistory/123/img_2.png)

```javascript
'1234'
'03AC674216F3E15C761EE1A5E255F067953623C8B388B4459E13F978D7C846F4' // 1회 hashing
'B248667FC5BD4490F61E52372CB23BCDBA78EAD88DBBD070B0E322732CA4EB89' // 2회 hashing
'1EE76EDEC7BE4530BDC7372D5E78886E0FA6745ACBB3EDAE65AE9B0FA274A224' // 3회 hashing
```

위 내용처럼 '1234'를 해싱해서 나온 값 자체를 해싱하는것을 반복하는것이다.

해당 방법은 brute force에 효과적이다.

그 이유는 해커가 brute force시 컴퓨터 성능이 증가함에 따라서 1초에 얻을 수 있는 digest가 어마어마하게 많겠지만

Key Stretching의 횟수를 증가시켜서 1개의 digest를 얻는데 1초가 걸리게 한다면 사용자 입장에서는 로그인할때

1초의 딜레이가 일어날 뿐이지만 해커의 입장에서는 1초에 100억개를 얻던 digest가 1개로 줄어드는 효과를 얻을 수 있다.

**한계 2의 해결법 : Salt**

Key Stretching을 적용시켰다고 하더라도 하나의 데이터를 n번 hashing한 digest는 항상 같은 값을 가지므로

레인보우 테이블이 생성되어있을 수 있다.

그러므로 salt를 첨가한다.

![](/assets/images/tistory/123/img_3.png)

데이터에 임의의 문자열을 추가시키고 hashing하는 방법으로 레인보우 테이블의 생성을 막을 수 있다.

salt값이 임의의 값이므로 그 모든 salt+data값의 레인보우 테이블을 만드는것은 현실적으로 불가능하다

(SHA-256의 경우에는 salt를 db나 안전한 장소에 저장을하며

Bcrypt의 경우에는 digest에 salt가 붙어있다)

(digest나 salt나 탈취 안당하는것이 제일이지만 사실 해커입장에서 digest든 salt든 획득했다고 하더라도 사용할 방법이 마땅치않다.

즉, digest나 salt나 유출이되었더라고 하더라도 별 문제가 되지는 않는다.)

**Bcrypt를 쓰는 이유**

위의 hash설명에도 있듯이 hash란 기본적으로 빠른 검색을 위해 나온 알고리즘이다.

즉, SHA와 같은 알고리즘은 너무 빨라서 brute force의 속도가 빠르기때문에 보안상 위험하다.

Bcrypt는 key setup phase라는 막대한 전처리 요구로 느리게 만든 Blowfish에다가

반복 횟수를 지정할 수  있게끔해서 digest를 만드는데 걸리는 시간을 조절할 수 있게 했다.

즉, 컴퓨터 성능이 빨라질수록 반복 횟수를 늘려(Key Stretching) 상쇄시킨다.

**Bcrypt**

Key Stretching과 salt를 혼합한 방법을 사용한다.

![](/assets/images/tistory/123/img_4.png)

```javascript
Bcrypt의 구조는
'$2b$15$SY9W6aPRDFeVoa.2Ty6GpOYQdq.nTGCXy/m/QFUD1o/i5BdFAFDBK'
이러한 형식이다
'$2b$15$SY9W6aPRDFeVoa.2Ty6GpO' : salt값 // 29글자
'YQdq.nTGCXy/m/QFUD1o/i5BdFAFDBK' : digest값 // 31글자
salt값의 앞부분은 순서대로
'$2b' : 버전 정보
'$15' : 반복 횟수
```

**Bcrypt로 hashing 및 compare**

**비동기함수를 쓰는 방법**

hashing

```javascript
// salt와 hashing을 따로 하는 방법
bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
        // Store hash in your password DB.
        console.log(hash) // digest값
    });
});

// salt와 hashing을 같이하는 방법
bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    console.log(hash) // digest값
});

saltRounds : 몇번 반복할지 // 2^saltRounds
myPlaintextPassword : hashing하고 싶은 원본 데이터
```

compare

```javascript
bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
    // result == true
    console.log(result) // 검증 되었으면 ture 아니면 false
});

myPlaintextPassword : 입력한 값
hash : db에 저장되어있는 digest값
```

**promise를 쓰는 방법**

hashing

```javascript
bcrypt.hash(myPlaintextPassword, saltRounds).then(function(hash) {
    // Store hash in your password DB.
});
```

compare

```javascript
bcrypt.compare(myPlaintextPassword, hash).then(function(result) {
    // result == true
});
```

async/await을 쓴 예제

```javascript
async function checkUser(username, password) {
    //... fetch user from a db etc.
    const match = await bcrypt.compare(password, user.passwordHash);
    if(match) {
        //login
    }
    //...
}
```

**동기함수를 쓰는 방법**

hashing

```javascript
// salt와 hashing을 따로 하는 방법
const salt = bcrypt.genSaltSync(saltRounds);
const hash = bcrypt.hashSync(myPlaintextPassword, salt);
// Store hash in your password DB.

// salt와 hashing을 같이 하는 방법
const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);
// Store hash in your password DB.
```

compare

```javascript
bcrypt.compareSync(myPlaintextPassword, hash); // true
```

#### **반복 횟수에 따른 hashing에 걸리는 시간 (환경에 따라 다름)**

```javascript
for (let i = 4; i < 18; i++) { // 최소 cost는 4
  console.time(i);
  const hash = bcrypt.hashSync("1234", i);
  console.timeEnd(i);
}
// 선형적 결과를 보기위해 동기함수를 사용함

// 결과
4: 1.471ms
5: 2.882ms
6: 5.742ms
7: 11.326ms
8: 22.707ms
9: 45.435ms
10: 90.72ms
11: 181.183ms
12: 361.39ms
13: 724.609ms
14: 1.455s
15: 2.894s
16: 5.777s
17: 11.586s
```

i값이 1증가함에 따라서 걸리는 시간이 2배씩 증가함을 알 수 있다.

즉  변수 i는 (반복횟수 : 2^i)임을 알 수 있다

#### **Salt에 대한 고찰**

블로그들을 보다보면 반복 할 때마다 salt값이 바뀐다고한다.

하나의 salt값을 쓴다는 블로그 글을 보지 못했는데...

나는 아닌것 같다

왜냐하면 복호화가 불가능하므로 검증을 하기 위해서는

받아온 데이터값을 hashing해서 나온 digest가 저장된 digest와 같은지를 비교해야한다.

그런데 Key Stretching시 salt값이 변한다면 당장 이전의 digest값도 알 수 없고 salt값도 알 수 없기에

받아온 데이터값을 hashing하는데 필요한 salt값을 알 수 없게된다

(20번 반복했다고하면 20개의 salt값을 db에 저장한다면 검증이 가능하겠지만... db용량 낭비이며 그런다고 다이나믹하게 보안이 좋아지진 않아보인다.)

심지어 SHA형식은 salt를 따로 저장하지만

Bcrypt는 digest에 salt를 포함시키므로 반복시마다 salt값이 다르다면 첫 salt값을 잃어버리게 된다

그래서 테스트 해봤다

```javascript
bcrypt.genSalt(10, function (err, salt) {
  console.log("salt :", salt);
  bcrypt.hash("1234", salt, function (err, hash) {
    console.log("hash :", hash); // digest값
  });
});
// 결과
salt : '$2b$10$4mJaRhaGsr9UKFGH6CzNa.'
hash : '$2b$10$4mJaRhaGsr9UKFGH6CzNa.I1mMyIyxjDtj4lGv.vmDiikk1TZ9cZS'
```

위의 경우는 2^10번 반복을 하는데

console.log에 찍힌 salt값이 블로그들의 말이 맞다면 처음값이며 그 다음 반복부터는 다른 값이 된다는 말이다.

그래서 확인을 위해

```javascript
bcrypt.genSalt(10, function (err, salt) {
  bcrypt.hash("1234", "$2b$10$4mJaRhaGsr9UKFGH6CzNa.", function (err, hash) {
    console.log("hash :", hash); // digest값
  });
});

// 결과
hash : '$2b$10$4mJaRhaGsr9UKFGH6CzNa.I1mMyIyxjDtj4lGv.vmDiikk1TZ9cZS'
```

salt값을 아까 얻은 값으로 직접 넣어주고 똑같이 2^10번 반복을 시켰다.

결과는 같은 digest값이 나온다

즉 Key Stretching시 salt값은 digest앞에 붙어있으며 변하지 않는다

---

혹시 반복을해서 해당 digest를 찾을 수 있는지 테스트 해봤다.

cost를 4를 주고 salt와 digest(이하 digest4)를 얻음

-> 얻은 salt를 직접 넣어주고 salt내의 cost를 5로 바꾼후 digest(이하 digest5)를 얻음

-> digest4에 다시 cost 4로 바꾼 salt를 넣고 hashing을 하면 digest5가 나올거라고 생각

(2^4 + 2^4 = 2^5이기에)

```javascript
// 2^4번 반복하고 salt와 digest얻음
bcrypt.genSalt(4, function (err, salt) {
	console.log(salt)
  bcrypt.hash("1234", salt, function (err, hash) {
    console.log("hash4 :", hash);
  });
});
// 결과 
// '$2b$04$g/vBrfdK2n7bq1bUWGs7V.'
// hash4 : '$2b$04$g/vBrfdK2n7bq1bUWGs7V.4NYEXDG/9nhtUbhLui0hBUklxp.6d7a'

// salt내부의 반복수를 04 -> 05로 바꿔줌
bcrypt.genSalt(4, function (err, salt) {
  bcrypt.hash("1234", '$2b$05$g/vBrfdK2n7bq1bUWGs7V.', function (err, hash) {
    console.log("hash5 :", hash);
  });
});
// 결과
// hash5 : '$2b$05$g/vBrfdK2n7bq1bUWGs7V.IOe/CIECALTPiEXGZqU3MW.GmbwymGG'

// 아까 4번 반복해서 얻은 digest인 hash4를 salt의 cost를 4로 두고 다시 hashing하면 
// hash5가 나오겠다고 생각
// 하지만 data자리에 digest부분만 들어가야할지 전체가 들어가야할지 알 수 없어서 다 해보았다

'$2b$04$g/vBrfdK2n7bq1bUWGs7V.4NYEXDG/9nhtUbhLui0hBUklxp.6d7a' 일때
hash : '$2b$04$g/vBrfdK2n7bq1bUWGs7V.J6Sw0G4veHF6h08CnyKoIlwiORlRgSK'

'4NYEXDG/9nhtUbhLui0hBUklxp.6d7a' 일때
hash : '$2b$04$g/vBrfdK2n7bq1bUWGs7V.0DISww0J6Xhat7r7XoUShNwT7rzg54G'

'$g/vBrfdK2n7bq1bUWGs7V.4NYEXDG/9nhtUbhLui0hBUklxp.6d7a' 일때
hash : '$2b$04$g/vBrfdK2n7bq1bUWGs7V.DnoTOvyCAqWMZ5RP52/Fa1t35CJ3vwa'

'g/vBrfdK2n7bq1bUWGs7V.4NYEXDG/9nhtUbhLui0hBUklxp.6d7a' 일떄
hash : '$2b$04$g/vBrfdK2n7bq1bUWGs7V.WVnzXfRvGUf6xzA3Q299EC3fVFCirkW'

모두 hash5와 다른 결과가 나왔다
이로인해 hashing시 salt의 cost의 숫자 자체가 hashing알고리즘에 영향을 끼친다는것을 알 수 있다.
```

hashing시 salt의 cost 숫자가 hashing알고리즘에 영향을 끼치는 이유는

만약에 영향을 안끼친다면

예를들어 1234의 원본데이터를 100만번 Key Stretching을해서 'efg'라는 digest가 나왔을때

우연하게도 777이란 원본데이터를 2번 Key Stretching을해서 'efg'라는 digest가 나올 수도 있다

이러면 해킹의 우려가 있기에 salt의 cost숫자 자체가 영향을 끼치게 만들면

777이란 원본데이터도 똑같이 100만번 Key Stretching을 했을때 'efg'가 나와야지 검증이 될테니까

해쉬충돌이 일어날 확률을 1 / 2^cost만큼 줄여준다

#### **Bctypt 활용**

[리펙토링 및 개선 - 3 / Bcrypt 적용

Bcrypt에 대해 내가 쓴 글 https://fullfish.tistory.com/123?category=1054038 Hash와 Salt 그리고 Bcrypt 기본 용어 hash : 다양한 길이를 가진 데이터를 고정된 길이의 데이터로 매핑하는것 digest : hash에 의..

fullfish.tistory.com](https://fullfish.tistory.com/125?category=1053678)

#### **참고**

[[자료구조] 해시테이블(HashTable)이란?

1. 해시테이블(HashTable)이란? [ HashTable(해시테이블)이란? ] 해시 테이블은 (Key, Value)로 데이터를 저장하는 자료구조 중 하나로 빠르게 데이터를 검색할 수 있는 자료구조이다. 해시 테이블이 빠른

mangkyu.tistory.com](https://mangkyu.tistory.com/102)
[패스워드의 암호화와 저장 - Hash(해시)와 Salt(솔트)

[읽기 전에] 더보기 이 번 주제 같은 경우 어디까지나 비밀번호를 어떠한 원리로 저장하게 되는지 그 과정을 살펴보기 위한 글이다. 읽다보면 구현 소스코드들이 나올텐데 실제로는 이후 나오는

st-lab.tistory.com](https://st-lab.tistory.com/100)
[비밀번호 안전보관: bcrypt 를 알아보자

개요 사용자의 비밀번호를 그대로 보관하는 것은 위험하다. 비밀번호 보관에 특화된 bcrypt 를 알아보자. 참고링크 - 링크: https://auth0.com/blog/hashing-in-action-understanding-bcrypt/ - 링크: https://d2...

jusths.tistory.com](https://jusths.tistory.com/158)
[bcrypt

A bcrypt library for NodeJS.. Latest version: 5.0.1, last published: a year ago. Start using bcrypt in your project by running `npm i bcrypt`. There are 3352 other projects in the npm registry using bcrypt.

www.npmjs.com](https://www.npmjs.com/package/bcrypt)
