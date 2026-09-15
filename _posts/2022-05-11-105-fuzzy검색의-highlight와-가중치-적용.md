---
title: "fuzzy검색의 highlight와 가중치 적용"
date: 2022-05-11 00:04:55 +0900
render_with_liquid: false
categories: ["코딩 공부", "검색"]
tags: ["Fuzzy", "가중치검색", "하이라이트검색"]
---

참고 : <https://taegon.kim/archives/9919>

[[JS] 한글도 지원하는 퍼지 문자열 검색

UI 작업을 하다보면 목록을 검색해야 할 때가 많다. 그런데 사람의 기억이라는 게 정확하지 않아서 혹은 전부 입력하기 귀찮아서 개떡같이 일부만 입력해도 찰떡같이 원하는 결과를 보여주는 UI

taegon.kim](https://taegon.kim/archives/9919)

**Highlight 적용**

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/105/img.png)

검색을 한 글자를 빨간색으로 반환

**가중치 적용**

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/105/img_1.png)

원래 db상 '과일먹자'가 '과자냠냠'보다 id값이 빨라서 상단에 위치했는데

유저가 좀더 찾기를 원했을만한 단어가 위로가게 가중치 적용

빨간색으로 색 바뀌는부분 코드

```javascript
exports.chageRed = (data, search) => {
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
  return resultData;
};

console.log(this.chageRed('안녕하세요', '안녕'));
// 출력
<span style="color: red">안</span><span style="color: red">녕</span>하세요
console.log(match) // '안녕'
console.log(gropus) // [ '안', '녕', 0, '안녕하세요' ]
```

replace 매개변수 참고 : <https://fullfish.tistory.com/66>

매칭되는 글자에 color : red를 붙여서 색을 입힌다

가중치 적용 코드

```javascript
exports.sort = (data, search) => {
  const regex = createFuzzyMatcher(search);
  const resultData = data.map(ele => {
    let totalDistance = 0;
    const title = ele.title.replace(regex, (match, ...groups) => {
      const letters = groups.slice(0, search.length);
      let lastIndex = 0;
      let redColor = [];
      for (let i = 0, l = letters.length; i < l; i++) {
        const idx = match.indexOf(letters[i], lastIndex);
        redColor.push(match.substring(lastIndex, idx));
        redColor.push(`${letters[i]}`);
        if (lastIndex > 0) {
          totalDistance += idx - lastIndex;
        }
        lastIndex = idx + 1;
      }
      return redColor.join('');
    });
    return { title, totalDistance };
  });
  resultData.sort((a, b) => {
    return a.totalDistance - b.totalDistance;
  });
  for (let i = 0; i < data.length; i++) {
    data[i].title = resultData[i].title;
  }
};
```

각 글자간의 거리를 더해서 정렬한다

"과자는새우깡이지"를 검색할때 "과새깡" 라고 검색한다면

3만큼 총 거리가 떨어져있다

총거리보다 제일 긴거리 내림차순이 좋다던데 잘 모르겠다

왜냐하면

"과자는새우깡이지"에서 "과새"와 "과는우이"를 검색할때

1번방법인 총거리로 정렬하면 과새가 더 적합

2번 방법인 제일 긴거리로 정렬하면 과는우이가 더 적합한데

문장이 아닌 단어라서 그런지 과새가 더 적합해보인다

혹시 몰라 랜더해주는 부분 코드

```javascript
const titleInput = useRef();
  useEffect(() => {
    console.log(`${id}번 일기아이템 렌더`);
    titleInput.current.innerHTML = titleInput.current.innerHTML
      .replace(/<span style="color: red">/g, '')
      .replace(/<\/span>/g, '');
    titleInput.current.innerHTML = fuzzy.chageRed(
      titleInput.current.innerHTML,
      search,
    );
  }, [search]);
```

리벤슈타인거리까지 포함된 하이라이트 코드

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

**fuzzy검색의 highlight와 가중치 적용**

[15일차 / fuzzy검색의 highlight와 가중치 적용

한것 Highlight 적용 검색을 한 글자를 빨간색으로 반환 가중치 적용 원래 db상 '과일먹자'가 '과자냠냠'보다 id값이 빨라서 상단에 위치했는데 유저가 좀더 찾기를 원했을만한 단어가 위로가게 가

fullfish.tistory.com](https://fullfish.tistory.com/104?category=1053678)
