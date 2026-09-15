---
title: "삽입 정렬 (Insertion Sort)"
date: 2022-06-14 18:22:40 +0900
render_with_liquid: false
categories: ["코딩 테스트", "알고리즘 공부"]
tags: ["sort", "정렬", "insertion sort", "삽입 정렬"]
---

#### 

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/147/insertion_AdobeExpress.gif)


[65, 73, 67, 98, 75, 80, 87, 30, 61, 45, 4, 36, 52, 5, 23, 68, 71, 70, 61, 21, 29, 73, 36, 90, 13,&nbsp; 97, 14, 71, 1, 51, 49, 3, 15, 64, 51, 87, 80, 8, 73, 84, 21, 93, 46, 87, 49, 41, 77, 40, 73, 96]

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/147/img.gif)

#### **삽입 정렬이란?**

이미 정렬된 부분에서 새로운 요소가 들어갈 위치를 찾아 넣음

**시간복잡도**

|  |  |  |
| --- | --- | --- |
|  | 시간 복잡도 (comparisons) | 시간 복잡도 (swaps) |
| 최악 | O(n^2) | O(n^2) |
| 평균 | O(n^2) | O(n^2) |
| 최상 | O(n) | O(1) |

**공간 복잡도**

전체 O(n), 보조 O(1)

#### **특징**

안정 정렬(Stable Sort)

제자리 정렬(In-place Sort). 추가메모리 x

대부분 정렬된 상태일때는 빠름(요소가 적을때도 빠른편)

반대로 요소가 많을 경우 느려짐

#### **로직**

이중 for문으로 순회

index 1부터 실행.

해당 index의 왼쪽 부분의 배열에서 본인이 들어갈 위치를 찾아 넣음

**예시** (오름차순의 경우)

[3,5,1,2] 일 때

index 1인 5가 왼쪽의 3 보다 큰 수이므로 그대로 둔다 -> [3,5,1,2]

index 2인 1은 5보다 작으므로 5를 밀어내고 그 자리로 간다 -> [3,1,5,2]

그리고 3보다도 작으므로 3을 밀어내고 그 자리로 간다 -> {1,3,5,2]

index 3인 2는 5보다 작으므로 5를 밀어내고 그 자리로 간다 -> [1,3,2,5]

3보다도 작으므로 3을 밀어내고 그 자리로 간다 -> [1,2,3,5]

#### **코드**

```javascript
const insertionSort = function (arr) {
  for (let i = 1; i < arr.length; i++) {
    let temp = arr[i];
    let aux = i - 1;
    while (aux >= 0 && arr[aux] > temp) {
      arr[aux + 1] = arr[aux];
      aux--;
    }
    arr[aux + 1] = temp;
  }
  return arr;
};
```
```javascript
let arr = [
  65, 73, 67, 98, 75, 80, 87, 30, 61, 45, 4, 36, 52, 5, 23, 68, 71, 70, 61, 21, 29, 73, 36, 90, 13,
  97, 14, 71, 1, 51, 49, 3, 15, 64, 51, 87, 80, 8, 73, 84, 21, 93, 46, 87, 49, 41, 77, 40, 73, 96,
];
console.log(insertionSort(arr));

// 결과
comparisons : 590
swaps : 590
```

#### 

#### **번외**

삽입정렬의 로직을 사용해서 추가 메모리를 사용해보았다

삽입을 할때 하나씩 밀어내지 않고 맞는 위치에 바로 넣어줘 보았다

```javascript
const insertionSort = function (arr) {
  // 0번째 부분은 정렬된거로 침
  let sortedArr = [arr[0]];
  for (let i = 1; i < arr.length; i++) {
    // 삽입할 요소가 정렬된 요소의 가장 큰 수보다 크다면 그냥 push
    if (arr[i] >= sortedArr[i - 1]) {
      sortedArr.push(arr[i]);
    } else {
      for (let j = 0; j < sortedArr.length; j++) {
        // 삽입할 요소가 정렬된 부분의 어떠한 요소보다 작을 때 그 부분에 삽입
        if (arr[i] <= sortedArr[j]) {
          const left = sortedArr.slice(0, j);
          const right = sortedArr.slice(j);
          sortedArr = left.concat(arr[i], right);
          break;
        }
      }
    }
  }
  return sortedArr;
};
```
```javascript
let arr = [
  65, 73, 67, 98, 75, 80, 87, 30, 61, 45, 4, 36, 52, 5, 23, 68, 71, 70, 61, 21, 29, 73, 36, 90, 13,
  97, 14, 71, 1, 51, 49, 3, 15, 64, 51, 87, 80, 8, 73, 84, 21, 93, 46, 87, 49, 41, 77, 40, 73, 96,
];
console.log(insertionSort(arr));

// 결과
comparisons : 662
swaps : 47
```
