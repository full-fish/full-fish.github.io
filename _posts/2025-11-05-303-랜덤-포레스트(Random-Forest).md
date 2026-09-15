---
title: "랜덤 포레스트(Random Forest)"
date: 2025-11-05 17:08:45 +0900
render_with_liquid: false
categories: ["데이터 분석", "머신러닝, 딥러닝"]
---

의사결정나무를 기반으로 하는 앙상블 모형으로 배깅(Bagging)에 랜덤 과정을 추가한 방법

의사결정나무 여러(수십~수백)개를 만들어 투표/평균하여 결과 도출

무작위 방법  
▪부트스트랩 샘플: 훈련 데이터를 복원추출로 랜덤하게 뽑아 트리마  
다 다른 데이터로 학습  
▪특징 무작위화: 각 노드에서 분할할 때 일부 특성만 후보로 고려  
(max\_features)

장점  
▪단일 트리보다 일반화 성능↑ (과대적합 완화)  
▪변수 중요도 제공(특히 초반 피처 선정/설명에 유용)

자주 쓰는 하이퍼 파라미터

```python
n_estimators #트리 개수 (보통 100~500부터 시작)
max_depth, min_samples_leaf #트리 복잡도 제한(과대적합 방지)
max_features #노드 분할 시 고려할 특성 수(분산↓)
bootstrap=True #부트스트랩 사용(복원 추출)
oob_score=True #OOB 점수(훈련 중 내부 교차검증 비슷)로 빠르게 성능 추정

'''OOB 점수: 각 트리를 만들 때 뽑히지 않은 표본(Out-Of-Bag)으로 성능을 재보는
것 → 교차검증처럼 일반화 성능을 빠르게 가늠'''
```

**예제**

```python
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, roc_auc_score, classification_report
from sklearn.inspection import permutation_importance
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

bc = load_breast_cancer()
X = bc.data
Y = bc.target

x_train, x_test, y_train, y_test = train_test_split(
    X, Y, test_size=0.2, random_state=42, stratify=Y
)

print(X)
print("--")
print(Y)

rf = RandomForestClassifier(
    n_estimators=300,
    max_depth=None,
    min_samples_leaf=2,
    max_features="sqrt",
    bootstrap=True,
    oob_score=True,
    n_jobs=-1,
    random_state=42,
)

rf.fit(x_train, y_train)

pred = rf.predict(x_test)
proba = rf.predict_proba(x_test)[:, 1]

print("OOB score : ", rf.oob_score_)
print("accuracy : ", accuracy_score(y_test, pred))
print("ROC AUC : ", roc_auc_score(y_test, proba))
print(
    "Classification Report :\n",
    classification_report(y_test, pred, target_names=bc.target_names),
)
imp_mdi = pd.Series(rf.feature_importances_, index=bc.feature_names).sort_values(
    ascending=False
)
print(imp_mdi)

# ------------------ 결과 ------------------

[[1.799e+01 1.038e+01 1.228e+02 ... 2.654e-01 4.601e-01 1.189e-01]
 [2.057e+01 1.777e+01 1.329e+02 ... 1.860e-01 2.750e-01 8.902e-02]
 [1.969e+01 2.125e+01 1.300e+02 ... 2.430e-01 3.613e-01 8.758e-02]
 ...
 [1.660e+01 2.808e+01 1.083e+02 ... 1.418e-01 2.218e-01 7.820e-02]
 [2.060e+01 2.933e+01 1.401e+02 ... 2.650e-01 4.087e-01 1.240e-01]
 [7.760e+00 2.454e+01 4.792e+01 ... 0.000e+00 2.871e-01 7.039e-02]]
--
[0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
 1 0 0 0 0 0 0 0 0 1 0 1 1 1 1 1 0 0 1 0 0 1 1 1 1 0 1 0 0 1 1 1 1 0 1 0 0
 1 0 1 0 0 1 1 1 0 0 1 0 0 0 1 1 1 0 1 1 0 0 1 1 1 0 0 1 1 1 1 0 1 1 0 1 1
 1 1 1 1 1 1 0 0 0 1 0 0 1 1 1 0 0 1 0 1 0 0 1 0 0 1 1 0 1 1 0 1 1 1 1 0 1
 1 1 1 1 1 1 1 1 0 1 1 1 1 0 0 1 0 1 1 0 0 1 1 0 0 1 1 1 1 0 1 1 0 0 0 1 0
 1 0 1 1 1 0 1 1 0 0 1 0 0 0 0 1 0 0 0 1 0 1 0 1 1 0 1 0 0 0 0 1 1 0 0 1 1
 1 0 1 1 1 1 1 0 0 1 1 0 1 1 0 0 1 0 1 1 1 1 0 1 1 1 1 1 0 1 0 0 0 0 0 0 0
 0 0 0 0 0 0 0 1 1 1 1 1 1 0 1 0 1 1 0 1 1 0 1 0 0 1 1 1 1 1 1 1 1 1 1 1 1
 1 0 1 1 0 1 0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 0 1 0 1 1 1 1 0 0 0 1 1
 1 1 0 1 0 1 0 1 1 1 0 1 1 1 1 1 1 1 0 0 0 1 1 1 1 1 1 1 1 1 1 1 0 0 1 0 0
 0 1 0 0 1 1 1 1 1 0 1 1 1 1 1 0 1 1 1 0 1 1 0 0 1 1 1 1 1 1 0 1 1 1 1 1 1
 1 0 1 1 1 1 1 0 1 1 0 1 1 1 1 1 1 1 1 1 1 1 1 0 1 0 0 1 0 1 1 1 1 1 0 1 1
 0 1 0 1 1 0 1 0 1 1 1 1 1 1 1 1 0 0 1 1 1 1 1 1 0 1 1 1 1 1 1 1 1 1 1 0 1
 1 1 1 1 1 1 0 1 0 1 1 0 1 1 1 1 1 0 0 1 0 1 0 1 1 1 1 1 0 1 1 0 1 0 1 0 0
 1 1 1 0 1 1 1 1 1 1 1 1 1 1 1 0 1 0 0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
 1 1 1 1 1 1 1 0 0 0 0 0 0 1]
OOB score :  0.9560439560439561
accuracy :  0.956140350877193
ROC AUC :  0.9943783068783069
Classification Report :
               precision    recall  f1-score   support

   malignant       0.95      0.93      0.94        42
      benign       0.96      0.97      0.97        72

    accuracy                           0.96       114
   macro avg       0.96      0.95      0.95       114
weighted avg       0.96      0.96      0.96       114

worst area                 0.139921
worst perimeter            0.136556
worst concave points       0.117570
mean concave points        0.096829
worst radius               0.086440
mean radius                0.063880
mean perimeter             0.052479
mean concavity             0.044819
mean area                  0.040960
worst concavity            0.033875
area error                 0.032888
worst texture              0.018331
mean compactness           0.017592
radius error               0.017508
worst compactness          0.013977
mean texture               0.013755
worst smoothness           0.011133
worst symmetry             0.008325
worst fractal dimension    0.006204
perimeter error            0.006012
fractal dimension error    0.005611
mean smoothness            0.005178
concavity error            0.005035
mean symmetry              0.004445
texture error              0.004251
concave points error       0.003974
symmetry error             0.003620
smoothness error           0.003363
compactness error          0.002794
mean fractal dimension     0.002676
dtype: float64
```

**변수 중요도**  
“이 모델이 예측을 할 때 어떤 변수들이 분할을 많이 잘 만들어 성능에 기여했는가”를 수치로 나타낸 것.  
보통 0~1 사이로 정규화되어 합계가 1이 되며, 값이 클 수록 해당 변수의 기여가 크다는 뜻.  
인과관계 아님 => 그 변수 때문에 결과가 “원인적으로”바뀐다는 뜻이 아니라, 이 모델이 그렇게 사용했다는 의  
미

변수 중요도 측정 방법1  
**불순도 기반 중요도(Mean Decrease in Impurity, MDI)**

• 각 트리의 모든 노드에서 그 변수가 분할에 쓰였을 때 줄어든 불순도(gini/entropy 등)를 합산 → 숲 전체 평균.

계산과정

트리의 각 노드마다 → 어떤 변수를 기준으로 나눴는지 확인  
그 분할로 인해 불순도가 얼마나 줄었는지 계산 (예: Gini가 0.45 → 0.2로 줄었다면 0.25 감소)  
그 감소량을 그 변수의 기여도로 더함  
트리 전체, 숲 전체의 평균을 내면  
→ RandomForestClassifier.feature\_importances\_ 값이 됨

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/303/img.png)

즉, 모든 트리에서 “이 변수가 불순도 줄이는 데 얼마나 기여했나”를 평균낸거

장점  
계산이 빠르고 RandomForestClassifier.feature\_importances\_로확인

단점

연속형/카디널리티가 높은 범주형 변수에 중요도가 쏠리는 경향

  (값이 많고 세밀한 변수(예: 나이, 길이)는 불순도를 더 쉽게 줄임 반면 카테고리(0/1 변수)는 기여도가 작게 나옴)  
상관 높은 변수들끼리는 기여가 분산되어 보일 수 있음.

  (비슷한 역할을 하는 feature가 여러 개 있으면 그 중요도가 서로 나뉘어 보임 (실제보다 작게 표시))  
훈련 데이터 기준이라 데이터 누수/과적합 영향 가능

  (트리 내부에서 계산된 불순도만 보기 때문에 과적합된 트리에서는 중요도가 왜곡될 수 있음)

```python
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pandas as pd

# 1. 데이터 불러오기
bc = load_breast_cancer()
X = bc.data
y = bc.target

x_train, x_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 2. 랜덤포레스트 학습
rf = RandomForestClassifier(
    n_estimators=300,
    max_depth=None,
    random_state=42,
    n_jobs=-1,
)
rf.fit(x_train, y_train)

# 3. 불순도 기반 중요도(MDI) 뽑기
imp_mdi = pd.Series(
    rf.feature_importances_,   # <- 이게 MDI
    index=bc.feature_names
).sort_values(ascending=False)

print(imp_mdi)
```

변수 중요도 측정 방법2  
**순열 중요도(Permutation Importance, MDA)**  
평가용 데이터에서 한 변수만 값을 섞어서(셔플) 그 변수와 타깃의 연결을 끊고, 모델 성능이 얼마나 나빠지는지를 측정

계산과정

원래 테스트 데이터로 예측 → baseline 성능 저장  
 예: accuracy = 0.94  
변수 하나 선택 (예: ‘radius\_mean’)  
 → 그 열의 값만 무작위로 섞음 (순서 랜덤화, 즉 feature와 y 관계 파괴)  
섞은 데이터로 다시 예측 → accuracy = 0.81  
성능 감소량 = 0.94 - 0.81 = 0.13  
 → 이 변수의 Permutation Importance = 0.13  
모든 변수에 대해 반복  
 그리고 여러 번 랜덤 셔플해서 평균 낸다 (안정성 향상)  
장점  
모델/지표 불문(AUC, F1, RMSE 등 원하는 평가지표로 가능), 편향 적고 해석 직관적  
훈련 편향에 덜 민감: 검증/테스트셋에서 측정 → 일반화 관점의 기여도를 반영  
편향 적음: 카디널리티 편향이 상대적으로 덜하고, “그 변수 없을 때”의 실제 성능 영향을 직접 봄

단점  
느림: 변수마다, 반복 횟수만큼 재실행 → 컬럼/데이터가 많으면 비용↑  
상관 변수 이슈: 비슷한 역할의 변수가 여럿이면, 한 변수만 섞어도 다른 변수가 대체 → 중요도가 작게 보일 수 있음.  
데이터 분할·지표 민감: 어떤 검증셋/지표를 쓰느냐에 따라 값이 달라짐

```python
from sklearn.inspection import permutation_importance

result = permutation_importance(
    rf, x_test, y_test,
    n_repeats=10,     # ⬅️ 셔플 10번 반복
    random_state=42,
    n_jobs=-1
)

result.importances_mean
# 각 변수별 평균 중요도

result.importances_std
# 각 변수별 표준편차 (값이 크면 불안정)
```

**두 가지 변수 중요도 측정 예제**

```python
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, roc_auc_score, classification_report
from sklearn.inspection import permutation_importance
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

bc = load_breast_cancer()
X = bc.data
Y = bc.target

x_train, x_test, y_train, y_test = train_test_split(
    X, Y, test_size=0.2, random_state=42, stratify=Y
)

print(X)
print("--")
print(Y)

rf = RandomForestClassifier(
    n_estimators=300,
    max_depth=None,
    min_samples_leaf=2,
    max_features="sqrt",
    bootstrap=True,
    oob_score=True,
    n_jobs=-1,
    random_state=42,
)

rf.fit(x_train, y_train)

pred = rf.predict(x_test)
proba = rf.predict_proba(x_test)[:, 1]

print("OOB score : ", rf.oob_score_)
print("accuracy : ", accuracy_score(y_test, pred))
print("ROC AUC : ", roc_auc_score(y_test, proba))
print(
    "Classification Report :\n",
    classification_report(y_test, pred, target_names=bc.target_names),
)


imp_mdi = pd.Series(rf.feature_importances_, index=bc.feature_names)

perm = permutation_importance(
    rf, x_test, y_test, scoring="roc_auc", n_repeats=100, random_state=42, n_jobs=-1
)
imp_perm_mean = pd.Series(perm.importances_mean, index=bc.feature_names)

compare = pd.DataFrame(
    {
        "MDI importance": imp_mdi,
        "MDA importance": imp_perm_mean,
    }
).sort_values("MDA importance", ascending=False)

print(compare)

--------------------------- 결과 -----------------------------

[[1.799e+01 1.038e+01 1.228e+02 ... 2.654e-01 4.601e-01 1.189e-01]
 [2.057e+01 1.777e+01 1.329e+02 ... 1.860e-01 2.750e-01 8.902e-02]
 [1.969e+01 2.125e+01 1.300e+02 ... 2.430e-01 3.613e-01 8.758e-02]
 ...
 [1.660e+01 2.808e+01 1.083e+02 ... 1.418e-01 2.218e-01 7.820e-02]
 [2.060e+01 2.933e+01 1.401e+02 ... 2.650e-01 4.087e-01 1.240e-01]
 [7.760e+00 2.454e+01 4.792e+01 ... 0.000e+00 2.871e-01 7.039e-02]]
--
[0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
 1 0 0 0 0 0 0 0 0 1 0 1 1 1 1 1 0 0 1 0 0 1 1 1 1 0 1 0 0 1 1 1 1 0 1 0 0
 1 0 1 0 0 1 1 1 0 0 1 0 0 0 1 1 1 0 1 1 0 0 1 1 1 0 0 1 1 1 1 0 1 1 0 1 1
 1 1 1 1 1 1 0 0 0 1 0 0 1 1 1 0 0 1 0 1 0 0 1 0 0 1 1 0 1 1 0 1 1 1 1 0 1
 1 1 1 1 1 1 1 1 0 1 1 1 1 0 0 1 0 1 1 0 0 1 1 0 0 1 1 1 1 0 1 1 0 0 0 1 0
 1 0 1 1 1 0 1 1 0 0 1 0 0 0 0 1 0 0 0 1 0 1 0 1 1 0 1 0 0 0 0 1 1 0 0 1 1
 1 0 1 1 1 1 1 0 0 1 1 0 1 1 0 0 1 0 1 1 1 1 0 1 1 1 1 1 0 1 0 0 0 0 0 0 0
 0 0 0 0 0 0 0 1 1 1 1 1 1 0 1 0 1 1 0 1 1 0 1 0 0 1 1 1 1 1 1 1 1 1 1 1 1
 1 0 1 1 0 1 0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 0 1 0 1 1 1 1 0 0 0 1 1
 1 1 0 1 0 1 0 1 1 1 0 1 1 1 1 1 1 1 0 0 0 1 1 1 1 1 1 1 1 1 1 1 0 0 1 0 0
 0 1 0 0 1 1 1 1 1 0 1 1 1 1 1 0 1 1 1 0 1 1 0 0 1 1 1 1 1 1 0 1 1 1 1 1 1
 1 0 1 1 1 1 1 0 1 1 0 1 1 1 1 1 1 1 1 1 1 1 1 0 1 0 0 1 0 1 1 1 1 1 0 1 1
 0 1 0 1 1 0 1 0 1 1 1 1 1 1 1 1 0 0 1 1 1 1 1 1 0 1 1 1 1 1 1 1 1 1 1 0 1
 1 1 1 1 1 1 0 1 0 1 1 0 1 1 1 1 1 0 0 1 0 1 0 1 1 1 1 1 0 1 1 0 1 0 1 0 0
 1 1 1 0 1 1 1 1 1 1 1 1 1 1 1 0 1 0 0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
 1 1 1 1 1 1 1 0 0 0 0 0 0 1]
OOB score :  0.9560439560439561
accuracy :  0.956140350877193
ROC AUC :  0.9943783068783069
Classification Report :
               precision    recall  f1-score   support

   malignant       0.95      0.93      0.94        42
      benign       0.96      0.97      0.97        72

    accuracy                           0.96       114
   macro avg       0.96      0.95      0.95       114
weighted avg       0.96      0.96      0.96       114

                         MDI importance  MDA importance
worst concave points           0.117570        0.004454
worst area                     0.139921        0.003571
mean concave points            0.096829        0.003009
worst perimeter                0.136556        0.002378
worst texture                  0.018331        0.001610
worst concavity                0.033875        0.001300
worst smoothness               0.011133        0.001224
mean texture                   0.013755        0.001187
worst radius                   0.086440        0.000582
radius error                   0.017508        0.000427
mean smoothness                0.005178        0.000304
concave points error           0.003974        0.000301
concavity error                0.005035        0.000288
worst fractal dimension        0.006204        0.000284
mean radius                    0.063880        0.000278
mean concavity                 0.044819        0.000208
area error                     0.032888        0.000142
mean compactness               0.017592        0.000136
worst compactness              0.013977        0.000089
fractal dimension error        0.005611        0.000079
smoothness error               0.003363        0.000056
compactness error              0.002794        0.000050
perimeter error                0.006012        0.000046
symmetry error                 0.003620        0.000033
texture error                  0.004251        0.000007
worst symmetry                 0.008325       -0.000020
mean fractal dimension         0.002676       -0.000033
mean area                      0.040960       -0.000142
mean symmetry                  0.004445       -0.000215
mean perimeter                 0.052479       -0.000301
```
