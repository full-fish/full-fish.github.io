---
title: "선택 정렬 (Selection Sort)"
date: 2022-06-14 17:55:03 +0900
render_with_liquid: false
categories: ["코딩 테스트", "알고리즘 공부"]
tags: ["sort", "정렬", "선택 정렬", "Selection Sort"]
---

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/146/selection_AdobeExpress.gif)


[ 65, 73, 67, 98, 75, 80, 87, 30, 61, 45, 4, 36, 52, 5, 23, 68, 71, 70, 61, 21, 29, 73, 36, 90, 13,&nbsp; 97, 14, 71, 1, 51, 49, 3, 15, 64, 51, 87, 80, 8, 73, 84, 21, 93, 46, 87, 49, 41, 77, 40, 73, 96]

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/146/img.gif)

#### **선택 정렬이란?**

제자리 정렬 알고리즘

원소 넣을 위치는 정해져있고 무슨 원소를 넣을지 선택하는 알고리즘

**시간복잡도**

|  |  |  |
| --- | --- | --- |
|  | 시간 복잡도 (comparisons) | 시간 복잡도 (swaps) |
| 최악 | O(n^2) | O(n) |
| 평균 | O(n^2) | O(n) |
| 최상 | O(n^2) | O(n) |

**공간 복잡도**

전체 O(n), 보조 O(1)

#### **특징**

이동 횟수 미리 결정됨

크기가 같은 요소의 상대적 위치가 변경될 수 있음. 불안정 정렬(Unstable Sort)

비교횟수는 많지만 교환 횟수가 적음

제자리 정렬(In-place Sort). 추가메모리 x

#### **로직**

1. 주어진 요소 중에 최소값을 찾음

2. 그 값을 맨 앞에 위치한 값과 교체

3. 맨 처음 위치를 제외하고 반복

즉, 처음 순회때 가장 작은 요소가 0번째에 들어가며

두번째 순회때 두번째로 작은수가 1번째에 들어간다 (오름차순의 경우)

#### **코드**

```javascript
function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[minIndex] > arr[j]) minIndex = j
    }
    if (minIndex !== i) [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
  }
  return arr
}
```
```javascript
let arr = [
  65, 73, 67, 98, 75, 80, 87, 30, 61, 45, 4, 36, 52, 5, 23, 68, 71, 70, 61, 21, 29, 73, 36, 90, 13,
  97, 14, 71, 1, 51, 49, 3, 15, 64, 51, 87, 80, 8, 73, 84, 21, 93, 46, 87, 49, 41, 77, 40, 73, 96,
];
console.log(selectionSort(arr));

// 결과
[
   1,  3,  4,  5,  8, 13, 14, 15, 21, 21, 23,
  29, 30, 36, 36, 40, 41, 45, 46, 49, 49, 51,
  51, 52, 61, 61, 64, 65, 67, 68, 70, 71, 71,
  73, 73, 73, 73, 75, 77, 80, 80, 84, 87, 87,
  87, 90, 93, 96, 97, 98
]
comparisons : 1225
swaps : 46
```

#### 

#### **성능 향상 방법**

1. 이중 선택 정렬 : 한 번의 탐색에서 최솟값과 최댓값을 같이 찾음. 탐색 횟수가 반으로 줄음

2. 한 번의 탐색 때 동일한 값이 있으면 함께 정렬

이중 선택 정렬 적용한 코드

```javascript
function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1 - i; i++) {
    let minIndex = i;
    let maxIndex = arr.length - 1 - i;
    for (let j = i + 1; j < arr.length - i; j++) {
      if (arr[minIndex] > arr[j]) {
        minIndex = j;
      }
      if (arr[maxIndex] < arr[j]) {
        maxIndex = j;
      }
    }
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
    if (maxIndex !== arr.length - 1 - i && arr[maxIndex] > arr[arr.length - 1 - i]) {
      [arr[arr.length - 1 - i], arr[maxIndex]] = [arr[maxIndex], arr[arr.length - 1 - i]];
    }
  }
  return arr;
}
```
```javascript
let arr = [
  65, 73, 67, 98, 75, 80, 87, 30, 61, 45, 4, 36, 52, 5, 23, 68, 71, 70, 61, 21, 29, 73, 36, 90, 13,
  97, 14, 71, 1, 51, 49, 3, 15, 64, 51, 87, 80, 8, 73, 84, 21, 93, 46, 87, 49, 41, 77, 40, 73, 96,
];
console.log(selectionSort(arr));

// 결과
[
   1,  3,  4,  5,  8, 13, 14, 15, 21, 21, 23,
  29, 30, 36, 36, 40, 41, 45, 46, 49, 49, 51,
  51, 52, 61, 61, 64, 65, 67, 68, 70, 71, 71,
  73, 73, 73, 73, 75, 77, 80, 80, 84, 87, 87,
  87, 90, 93, 96, 97, 98
]
comparisons : 625
swaps : 44
```
