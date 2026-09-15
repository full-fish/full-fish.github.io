---
title: "RNN(Recurrent Neural Networks)"
date: 2025-11-27 14:19:11 +0900
render_with_liquid: false
categories: ["데이터 분석", "머신러닝, 딥러닝"]
---

## 1. RNN이란 무엇인가?

RNN은 입력과 출력을 순서대로 처리하며, 이전 단계의 계산 결과를 저장했다가 다음 단계의 계산에 사용하는 **'순환(Recurrence)' 구조**를 가진 신경망입니다.

### 핵심 아이디어: 메모리 (Memory)

일반적인 신경망(MLP, CNN)은 현재 입력만 처리하지만, RNN은 \*\*은닉 상태(Hidden State, $h\\_t$)\*\*라는 형태의 \*\*'내부 메모리'\*\*를 통해 과거 정보를 요약하여 저장합니다. 이 메모리가 현재의 입력과 결합되어 다음 출력을 결정하는 데 사용됩니다.

* **순환 구조**: RNN의 은닉 계층에서 출력된 값이 다시 다음 시점의 입력으로 사용되는 구조를 가집니다.

---

## 2. RNN의 작동 원리

RNN은 각 시점(Time Step, $t$)에서 동일한 함수와 가중치 집합($W$)을 사용하여 계산을 반복합니다

![](/assets/images/tistory/319/img.png)

![](/assets/images/tistory/319/img_1.png)

## 4. RNN의 주요 한계점

표준 RNN은 이론적으로 강력하지만, 실제 긴 순서열 데이터를 처리할 때 다음과 같은 문제에 직면합니다.

1. **장기 의존성 문제 (Long-Term Dependencies)**: 시점이 멀리 떨어진 정보(즉, 긴 문장의 초반 단어)가 최종 출력에 미치는 영향이 약해지거나 사라지는 현상입니다.
2. **기울기 소실 (Vanishing Gradients)**: 역전파(Backpropagation) 과정에서 기울기(Gradient) 값이 0에 가까워지면서 앞쪽 시점의 가중치가 제대로 업데이트되지 않아 학습이 멈추는 현상입니다.

이러한 한계를 극복하기 위해 **LSTM (Long Short-Term Memory)** 및 \*\*GRU (Gated Recurrent Unit)\*\*와 같은 **게이트(Gate)** 구조를 가진 고급 RNN 모델이 개발되었습니다.

**LSTM**

![](/assets/images/tistory/319/img_2.png)

![](/assets/images/tistory/319/img_3.png)
