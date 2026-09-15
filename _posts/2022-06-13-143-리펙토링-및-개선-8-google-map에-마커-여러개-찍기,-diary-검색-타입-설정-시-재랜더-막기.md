---
title: "리펙토링 및 개선 - 8 / google map에 마커 여러개 찍기, diary 검색 타입 설정 시 재랜더 막기"
date: 2022-06-13 22:45:22 +0900
render_with_liquid: false
categories: ["Project", "codestates-final-project"]
tags: ["PROJECT"]
---

## **google map에 마커 여러개 찍기**

원래는 가계부에서 하나의 물건에 대한 위치만 구글 맵에서 확인이 가능했다

변경 후에는

하나의 카드(하나의 구매내역)의 지도를 확인시 해당 구매한 위치를 중심으로 띄우며

모든 구매한곳의 마커를 한번에 볼 수 있게하였다.

**코딩도중 애먹은점**

우선 현재 google map관련된 script는 Helmet태그로 감싸져있다

Helmet태그로 감싸지않으면

```html
Functions are not valid as a React child
```

라는 에러가 뜨는데

구글링해보면

해당에러는 함수를 실행시켜주지 않았기 때문이며 router부분에서 ()를 뒤에 붙여줘서 함수실행을 시켜줘야한다고 한다

하지만 현재 구글 맵은 따로 페이지를 만든것이아닌, modal창을 사용한것이라 실행이란 개념이 없다

그래서 현재 Helmet태그를 쓰고 있는것이다

그런데 Helmet태그의 문제점이 있는데

태그 내부와 외부의 변수가 같이 쓰이지 못하며 부모 자식간의 관계도아닌 그냥 독립적으로 작동한다

이것이 어째서 문제가 되냐면 마커를 여러개 찍기 위해서는

각 지점별 gps를 받아와서 각각 마커를 찍어야한다

즉 반복문을 사용해서 gps갯수만큼 반복 시켜야한다.

하지만 gps의 index를 참조할 방법이 없다

(gps가 배열일 때, gps[index]에서 index가 태그 바깥의 변수라서 참조 못한다)

독립적으로 작동한다는 의미는 Helmet 태그 밖에

let a = 1이라고 하고

안에서 a를 참조해보면 정의되지 않았다고 뜬다

하지만 바깥의 a를 쓸 수 있는 방법이 있는데

${a}를 사용하면 바깥의 a를 참조할 수 있다

즉,

```javascript
let a = 1
<Helmet>
  <script>
    {`
      let a = 2
      console.log(a)
      console.log(${a})
    `}
  </script>
</Helmet>

// 결과
2
1
```

이렇다

하지만 gps의 인덱스쪽에서 문제가 여전히 발생하는데

for문 안에서

gps[i]라고 하면 gps가 정의되지 않았다고 하며

${gps}[i]나

${gps[i]} 역시 안된다

gps를 forEach와 같은 다른 메소드와 함께 쓰는것도 안된다

여기서 한참 헤맸는데 팀원분이 해결해주셨다

2가지를 해줘야하는데

우선 gps라는 배열을

Helmet 안에서 따로 배열에 할당하면

```javascript
// Helmet 안에서
let arr = ${gps}
```

이러면 arr이라는 배열은 메소드를 사용할 수 있다.

또한 Helmet에 들어갈 배열의 요소는 json화를 해줘야한다

#### **코드**

```html
import { Helmet } from 'react-helmet';
import React from 'react';
function Map({ gps, data }) {
  const meyLatLng = gps.split(',').join(', ');
  const image =
    'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
  const stringifyData = JSON.stringify(data);

  return (
    <>
      <div id="googleMap" style={{ width: '100%', height: '40vw' }}></div>
      <Helmet>
        <script>
          {`function myMap() {
        var mapOptions = {
          center: new google.maps.LatLng(
            ${meyLatLng}
          ),
          zoom: 17,
        };

        var map = new google.maps.Map(
          document.getElementById('googleMap'),
          mapOptions,
        );

        const dataArr = ${stringifyData};
        var marker = dataArr.map((ele) => {
          const lat = Number(ele.gps.split(',')[0]);
          const lng = Number(ele.gps.split(',')[1]);

          return new google.maps.Marker({
            position: new google.maps.LatLng({lat, lng}), 
            map: map,
            label: ele.item_name,
          })
        })
      }`}
        </script>
        <script src="https://maps.googleapis.com/maps/api/js?key=키값&callback=myMap"></script>
      </Helmet>
    </>
  );
}
export default Map;
```

## **diary 검색 타입 설정 시 재랜더 막기**

**문제점**  
검색 타입이 제목과 내용 두개 있는데

예를 들어 제목을 클릭시 검색 타입 상태에는 제목이 들어간다

여기서 검색해봐도 문제없이 잘 작동하지만

radio버튼은 체크가 되어 있지 않으며 다시금 클릭하면 체크 된다

이유는 버튼 클릭 후 체크가 되었지만 재랜더 되면서 체크표시가 사라진것이며

실제 상태는 클릭된 값이 들어가있는 상태이다

checkd 옵션으로 상태값을 이용한 조건을 걸 수 있어서 해결했다

(팀원분이 옵션 찾아 주심 감사)

**코드**

```html
<div>
<input
  type="radio"
  name="searchType"
  value="title"
  onChange={getSearchType}
  checked={searchType === 'title'}
/>{' '}
제목
<input
  type="radio"
  name="searchType"
  value="content"
  onChange={getSearchType}
  checked={searchType === 'content'}
/>{' '}
기록
</div>
```
