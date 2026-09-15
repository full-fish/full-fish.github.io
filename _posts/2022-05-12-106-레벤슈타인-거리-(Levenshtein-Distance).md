---
title: "레벤슈타인 거리 (Levenshtein Distance)"
date: 2022-05-12 02:15:19 +0900
render_with_liquid: false
categories: ["코딩 공부", "검색"]
tags: ["Levenshtein distance", "레벤슈타인 거리"]
---

레벤슈타인 거리란 문자열의 유사도를 검사하는 기본적인 알고리즘으로 편집 거리라고도 부름

a문자열에서 b문자열로 편집할때 몇번의 조작이 필요한지를 도출해낸다

예를들어 '가나다라'와 '가나다마바'의 거리는 2이다 '라' -> '마', '바'추가

코드

```javascript
exports.levenshteinDistance = (str, search) => {
  if (search === undefined) return 0;
  if (str === search) return 0;
  let aLen = str.length;
  let bLen = search.length;
  if (aLen === 0) return bLen;
  if (bLen === 0) return aLen;
  //배열 생성
  let matrix = new Array(aLen + 1).fill(0).map(() => new Array(bLen + 1).fill(0));
  //첫 행과 열 초기화 0,1,2,3,4,5... 왜냐하면 공집합인경우와 비교하는거라서
  for (let i = 0; i < aLen + 1; i++) {
    matrix[i][0] = i;
  }
  for (let i = 0; i < bLen + 1; i++) {
    matrix[0][i] = i;
  }

  for (let i = 1; i < aLen + 1; i++) {
    let aCh = str[i - 1];
    for (j = 1; j < bLen + 1; j++) {
      let bCh = search[j - 1];
      if (aCh === bCh) cost = 0;
      else cost = 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, //문자 제거
        matrix[i][j - 1] + 1, //문자 삽입
        matrix[i - 1][j - 1] + cost //문자 삭제
      );
    }
  }
  return matrix[aLen][bLen];
};
```

문자열 2개를 받아서 다른 정도를 출력한다

```javascript
//예시
levenshteinDistance("가나다라", "가나다")
//matrix
[
  [ 0, 1, 2, 3 ],
  [ 1, 0, 1, 2 ],
  [ 2, 1, 0, 1 ],
  [ 3, 2, 1, 0 ],
  [ 4, 3, 2, 1 ]
]

levenshteinDistance("가나다라", "가나다라마")
//matrix
[
  [ 0, 1, 2, 3, 4, 5 ],
  [ 1, 0, 1, 2, 3, 4 ],
  [ 2, 1, 0, 1, 2, 3 ],
  [ 3, 2, 1, 0, 1, 2 ],
  [ 4, 3, 2, 1, 0, 1 ]
]

levenshteinDistance("가나다라", "하나다라하")
//matrix
[
  [ 0, 1, 2, 3, 4, 5 ],
  [ 1, 1, 2, 3, 4, 5 ],
  [ 2, 2, 1, 2, 3, 4 ],
  [ 3, 3, 2, 1, 2, 3 ],
  [ 4, 4, 3, 2, 1, 2 ]
]
```

**대부분의 블로그들이 삽입이랑 삭제를 혼동하고 있다**

* **글자가 동일하면 cost = 0 다르면 cost =1**
* **글자가 다를 경우 왼쪽 위 숫자 cost 가져옴 // matrix[i - 1] [j - 1] + cost**
* **삽입이 필요할 경우 왼쪽 숫자에서 +1 // matrix[i] [j - 1] + 1**
* **삭제가 필요할 경우 위쪽 수에서 +1 // matrix [i - 1] [j] + 1**

**삽입의 경우**

|  |  |  |  |
| --- | --- | --- | --- |
|  |  | 나 | 는 |
|  | 0 | 1 | 2 |
| 너 | 1 | a = 1 | b=2 |

위 경우에서 '너'와 '나'가 다르므로 cost = 1이되며 a는 좌상 +1인 1이된다 (로직상으론 좌, 상, 좌상 모두 1이므로 a = 1)

'너'와 '나는'은 '는'이 삽입되므로 좌+1이라서 b는 2가된다 (로직상으론 좌, 상, 좌상 모두 2라서 b=2)

**삭제의 경우**

|  |  |  |
| --- | --- | --- |
|  |  | 너 |
|  | 0 | 1 |
| 나 | 1 | a = 1 |
| 는 | 2 | b = 2 |

위 경우에서 '나'와 '너'가 다르므로 cost = 1이 되며 a는 좌상+1인 1이된다 (로직상으론 좌, 상, 좌상 모두 1이므로 a = 1)

'나는'과 '너'는 '는'이 삭제되므로 우+1이라서 b는 2가된다 (로직상으론 좌, 상, 좌상 모두 2라서 b=2)

그리고 문자 삽입, 문자 변경, 문자 삭제중 제일 작은값을 채워나간다

matix[x][y]의 값은 첫번째 인자 문자열의 x번째까지, 두번째 인자 문자열의 y번째까지

이 두개의 문자열의 다름정도이다

참고 : <https://too-march.tistory.com/20>

[[5] 문장의 유사도 분석하기 - 레벤슈타인 거리, N-gram

레벤슈타인 거리란? 레벤슈타인 거리는 문자열이 얼마나 비슷한 지를 나타내는 것으로 편집 거리라고도 부른다. 비슷한 어구 검색, DNA 배열의 유사성 판단 등 다양한 분야에서 활용된다. 편집할

too-march.tistory.com](https://too-march.tistory.com/20)

<https://renuevo.github.io/data-science/levenshtein-distance/>

[[DataScience] Levenshtein Distance (편집거리 알고리즘) - 문장 유사도 분석을 어떻게 하는가?

Levenshtein Distance (편집거리 알고리즘) 는 러시아의 과학자 블라디미르 리벤슈테인가 고안한 알고리즘 Levenshtein Distance이 무엇일까? 오늘날 언어학/데이터과학 같이 폭 넓게 사용되고 있으며 문장

renuevo.github.io](https://renuevo.github.io/data-science/levenshtein-distance/)

리벤슈타인거리 하이라이트 코드

```javascript
exports.chageRed = (data, search) => {
  // 정규식 이용한 fuzzy검색결과 색 바꿈
  const regex = createFuzzyMatcher(search);
  const resultData = data.replace(regex, (match, ...groups) => {
    const letters = groups.slice(0, search.length);
    let lastIndex = 0;
    let redColor = [];
    for (let i = 0, l = letters.length; i < l; i++) {
      const idx = match.indexOf(letters[i], lastIndex);
      redColor.push(match.substring(lastIndex, idx));
      redColor.push(`<span style="color: red">${letters[i]}</span>`);
      lastIndex = idx + 1;
    }
    return redColor.join('');
  });
  if (resultData !== data) return resultData;
  // 리벤슈타인거리 이용한 검색 결과 색 바꿈
  else {
    let redColor = [];
    let index = 0;
    if (search === undefined) return;
    for (let i = 0; i < data.length; i++) {
      if (search.indexOf(data[i], index) === -1) {
        redColor.push(data[i]);
        // data = data.slice(i);
      } else {
        redColor.push(`<span style="color: red">${data[i]}</span>`);
        index++;
      }
    }
    return redColor.join('');
  }
};
```

**리벤슈타인 거리 개선**

[레벤슈타인 거리 시간복잡도와 공간복잡도 개선

기존 코드 //레벤슈타인 거리 코드 exports.levenshteinDistance = (str, search) => { if (search === undefined) return 0; if (str === search) return 0; let aLen = str.length; let bLen = search.length; i..

fullfish.tistory.com](https://fullfish.tistory.com/108)

**리벤슈타인 거리 적용**

[16일차 / axios, 리벤슈타인 거리 값 추가 및 하이라이트 적용

한것 프론트에서 axios 분기 만듦 리벤슈타인 거리 값 추가 및 하이라이트 적용 axios분기 예시(accountGet)일 경우 export function accountGet(trip\_id) { console.log('어카운트 겟요청 됨'); let url = `${end..

fullfish.tistory.com](https://fullfish.tistory.com/119?category=1053678)
