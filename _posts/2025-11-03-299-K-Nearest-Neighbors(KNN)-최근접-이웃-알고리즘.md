---
title: "K-Nearest Neighbors(KNN) 최근접 이웃 알고리즘"
date: 2025-11-03 14:42:21 +0900
render_with_liquid: false
categories: ["데이터 분석", "머신러닝, 딥러닝"]
---

**scikit-learn(sklearn)**

파이썬 표준 머신러닝 라이브러리로, NumPy/SciPy 위에 구축된 CPU 기반 범용 ML 툴킷

```python
conda install -c conda-forge scikit-learn -y
```

KNN 원리: 새로운 데이터가 들어오면, 가장 가까운 데이터 k개를 찾아 그 다수결(분류)이나 평균(회귀)으로 값을 예측하는 가장  
직관적인 이웃 기반 알고리즘

**동작방식**

**거리정의:** 각 데이터 간 얼마나 비슷한지 거리로

예

유클리드 거리: 두 점 사이 거리. 피타고라스 정리로 √((x₁ - x₂)² + (y₁ - y₂)²)

맨해튼 거리: 대각선으로 못 갈때. |x₁ - x₂| + |y₁ - y₂|

민코프스키 거리: 민코프스키 거리는 유클리드 거리와 맨해튼 거리의 일반화된 형태  
즉, 하나의 공식으로 둘 다 표현할 수 있는 상위 개념

d(x, y) = ( Σ |xᵢ - yᵢ|ᵖ )^(1/p)

* p = 1 → **맨해튼 거리** (|x₁−y₁| + |x₂−y₂| + …)
* p = 2 → **유클리드 거리** (√(Σ (xᵢ−yᵢ)²))
* p → ∞ → **체비쇼프 거리(Chebyshev distance)**  
  (가장 큰 축 방향 거리만 보는 방식, 예: max(|xᵢ−yᵢ|))

**이웃찾기:** 새 샘플과 가장 가까운 k개 훈련 샘플을 고름

예측 만들기

분류: 이웃들의 다수결(또는 거리로 가중 다수결)

회귀: 이웃값의 평균/가중평균

**파라미터:** 모델이 학습하면서 자동으로 찾는 값. 예: 선형회귀의 기울기/절편, 신경망의 가중치와 편향, 로지스틱 회귀의 가중치

**하이퍼 파라미터:**학습 전에 사람이 정해줘야 하는 값

**KNN의 핵심 하이퍼 파라미터**

**k(이웃 수)**

작을 수록: 주변 소수에 민감 -> 과적합 위험  
클수록: 다수의 평균화 -> 과소적합 위험

보통 홀수로 시작해 교차검증으로 선택

**metric(거리 함수)**

euclidean, manhattan, minkowski

**weights**

uniform: 모든 이웃 동일 가중

distance: 가까울수록 더 큰 가중 -> 경계 부근에서 선능 개선 기대

**표준화(scaling)**

스케일이 큰 특성이 거리를 지배함

보통 StandardScaler/MinMaxScaler로 정규화 후 KNN 적용

**StandardScaler(Z-Score)**

각 값을 평균에서 얼마나 떨어져 있나로 변환

평균이 0, 표준편차가 1인 분포로 변환

데이터가 정규분포와 비슷할 때 유용

SVM, 로지스틱 회귀, PCA에서 자주 사용

```python
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler().fit(x_train)
x_train_scaled = scaler.transform(x_train)
```

![](/assets/images/tistory/299/img.png)

**Min-Max 스케일링 (0~1 스케일)**

정규화(normalizationm)로 많이 불림

0과 1 사이 값이 되도록 변환

이미 범위가 이미 있는 경우 씀. RGB 0~255

단점: 이상치에 아주 민감

예: 사진 너무 어두울때 단순 밝기만 올려봤자 픽셀간 차이가 별로 없어서 안보이는데 이거하면 서로간 대비가 커져서 잘보임

대신 밝기가 0~20에 몰려있는데 하나가 200이었다면 200 하나떄문에 레인지가 안넓어짐

```python
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split

x_train, x_test, y_train, y_test = train_test_split(X, Y, test_size=0.2, random_state=42)

scaler = MinMaxScaler()
scaler.fit(x_train)               # 훈련 데이터에서 min, max 계산
x_train_scaled = scaler.transform(x_train)
x_test_scaled = scaler.transform(x_test)  # 훈련 기준으로 변환
```

![](/assets/images/tistory/299/img_1.png)

```python
# fit은 먼저하는게 좋음
# 1. 나중에 하는 거
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
'''
X 전체 데이터의 평균과 표준편차를 구해서
그걸로 X를 표준화함
모든 데이터를 한 번에 쓴다는 점이 핵심'''

# 2. 처음에 하는 거
scaler = StandardScaler().fit(x_train)
x_train_scaled = scaler.transform(x_train)
'''
이게 훨씬 모델 학습에서 올바른 방식
테스트 데이터(x_test)는 아직 “미래 데이터”로 봐야 함
거기서 평균이나 표준편차를 미리 알아버리면
→ 정보가 새어 나간 거라 “데이터 누수(data leakage)”가 됨

그래서 항상 훈련 데이터로만 fit 하고,
테스트나 새 데이터엔 transform만 적용해야 함'''
```

**혼동 행렬(confusion\_matrix)**

분류 모델이 어디서 맞고 어디서 틀렸는지 행렬로 보여줌

![](/assets/images/tistory/299/img_2.png)

TP (True Positive): 실제로 True인데 True이라고 맞게 예측  
TN (True Negative): 실제로 False인데 False라고 맞게 예측  
FP (False Positive): 실제로는 False인데 True이라고 잘못 예측 → “거짓 양성”, 과잉탐지  
FN (False Negative): 실제로는 True인데 False이라고 잘못 예측 → “거짓 음성”, 놓침

![](/assets/images/tistory/299/img_3.png)

```python
# 입력: 정답 레이블(y_true), 모델이 예측한 레이블(y_pred)
from sklearn.metrics import confusion_matrix
cm = confusion_matrix(y_true, y_pred)
print(cm)
```

평가 지표

Precision(정밀도)  
• 이 모델이 ‘이 클래스다!’라고 예측한 것 중에 진짜 그 클래스였던 비율  
• precision = (TP) / (TP + FP) -> 트루라고 한것중 진짜 트루

Recall(재현율, 민감도)  
• 실제로 그 클래스인 것 중에서 모델이 얼마나 잘 찾아냈는가  
• recall = TP / (TP + FN) -> 진짜 트루중에 맞춘 트루

F1-score  
• precision과 recall의 조화평균  
• f1 = 2 × (precision × recall) / (precision + recall)  
• Precision과 Recall이 얼마나 균형이 있는가를 평가  
• 이 클래스에 대해 전반적으로 맞췄는가?

![](/assets/images/tistory/299/img_4.png)

**classification\_report(y\_true, y\_pred) 결과 정리**

support: 실제로 그 라벨이 몇 개 있었는지  
precision: 이거라고 한 것 중에 진짜인 비율 → 예측의 깔끔함  
recall: 진짜인 것 중에 내가 맞춘 비율 → 놓치지 않았나  
f1-score: precision과 recall의 균형  
accuracy: 전체 중에 맞은 비율  
macro avg: 각 클래스를 똑같이 1표씩 줘서 평균  
weighted avg: 개수 많은 클래스를 더 중요하게 보고 평균

**장점**  
개념이 쉽고, 모델 가정이 거의 없음  
다중 클래스·비선형 경계에 잘 대응  
작은 데이터에서는 강력하고 베이스라인으로 좋음

**단점**  
예측이 느림(매번 전체 훈련셋과 거리 계산)  
고차원에서 성능 저하(차원의 저주) → 차원 축소 고려  
불균형 데이터에서 다수 클래스에 끌림 → 가중치/리샘플링 필요  
잡음(outlier)·중복 샘플에 민감 → 전처리 중요

**KNN을 적용하면 좋은 사례**

특성 수가 많지 않고(대략 수십 이하), 표본 수가 수천~수만 수준일 때

결정 경계가 비선형일 때

베이스라인 모델, 혹은 해석이 간단한 이웃기반 판단이 필요할 때

**코드 설명**

```python
x_train, x_test, y_train, y_test = train_test_split(
    X, Y, test_size=0.2, random_state=33, stratify=Y
)
'''
전체 데이터셋 (X, Y)를 훈련용 80%, 테스트용 20% 로 나누는 코드
X → 입력 데이터 (특징, feature)
Y → 정답 데이터 (타깃, label)

test_size=0.2: 전체의 20%를 테스트 세트로 사용
random_state=33: 무작위 분할 시 같은 결과를 재현할 수 있게 고정
stratify=Y: 각 클래스 비율(예: setosa, versicolor, virginica 비율)을 유지하면서 분리

x_train	훈련용 입력 데이터
x_test	테스트용 입력 데이터
y_train	훈련용 정답 라벨
y_test	테스트용 정답 라벨
'''


scaler = StandardScaler().fit(x_train)
'''
표준화(Standardization) 를 위한 StandardScaler 객체를 생성하고,
x_train 데이터를 기준으로 평균(mean)과 표준편차(std)를 계산함.

이때 fit()은 "기준을 학습하는 단계" — 즉, “데이터를 보며 평균과 분산을 기억하는 단계”'''


x_train_scaled = scaler.transform(x_train)
x_test_scaled = scaler.transform(x_test)
'''
앞에서 학습한 평균과 표준편차로 x_train, x_test 데이터를 변환(transform)
z = (x - 평균) / 표준편차
형태로 각 특성값을 변환해서 평균 0, 분산 1이 되도록 맞춤
이유는
KNN은 거리 기반 알고리즘이라 특성의 단위 차이(예: cm, mm, kg 등) 가 성능에 큰 영향
그래서 반드시 스케일을 통일
테스트 데이터는 절대 새로 fit() 하면 안 되고, 훈련 데이터의 기준으로만 변환해야 함 (데이터 누수 방지)'''


knn = KNeighborsClassifier(n_neighbors=k)
'''
이웃 k개 중 가장 많은 클래스가 무엇인지로 분류
기본적으로 거리(metric)는 유클리드 거리
가중치(weights)는 uniform(모든 이웃 동일 가중)'''


knn.fit(x_train_scaled, y_train)
'''
훈련 데이터로 모델 학습
fit()은 모델을 학습시키는 함수인데,KNN은 사실 "저장형(Lazy Learning)" 모델이라
훈련 데이터 전체를 메모리에 저장만 해두고 나중에 예측할 때 거리 계산을 함.

x_train_scaled는 표준화된 입력 데이터
y_train은 각 입력의 정답(타깃, label)'''


y_pred = knn.predict(x_test_scaled)
'''
테스트 데이터를 가지고 예측 수행
x_test_scaled 각각에 대해
→ 훈련 데이터 중 가장 가까운 k개를 찾고
→ 그 중 다수가 속한 클래스를 결과로 내놓음.
즉, “이 테스트 데이터는 Setosa로 보인다” “이건 Virginica로 보인다” 이런 식으로 예측하는 단계'''


accuracy = accuracy_score(y_test, y_pred)


print("----혼동행렬-----")
cm = confusion_matrix(y_test, y_pred)
dfcm = pd.DataFrame(cm, index=iris.target_names, columns=iris.target_names)


'''
예측 결과 평가
accuracy_score()는 실제 정답(y_test)과 예측값(y_pred)을 비교해서 맞춘 비율을 계산'''


print("----------새로운 데이터 붓꽃 예측-----------------")
new_flower = np.array([[5.1, 3.5, 1.4, 0.2]])
new_flower_scaled = scaler.transform(new_flower)

pred = knn.predict(new_flower_scaled)
probabilites = knn.predict_proba(new_flower_scaled)
print(pred)  # 0이라고 나오는것의 이름은 새로운 꽃 저 크기라면 setosa이다
print(probabilites)  # setosa가 될 확률은 1, versicolor와 virginica이건 0
#이건 각각의 확률이 나옴


---------------------------------------------------------------------------

x_train, x_test, y_train, y_test = train_test_split(
    X, Y, test_size=0.2, random_state=42, stratify=Y
)  # 훈련/테스트 데이터 분리 (80:20), stratify=Y 는 데이터 분포를 유지하기 위해 사용

x_tr, x_val, y_tr, y_val = train_test_split(
    x_train, y_train, test_size=0.25, random_state=42, stratify=y_train
)

scaler = StandardScaler().fit(x_tr)
x_tr_scaled = scaler.transform(x_tr)
x_val_scaled = scaler.transform(x_val)
print(x_train)

best_cfg = None
best_acc = -1.0  # 최소값이 0이니까 더 작은값 넣어둠

for k in [3, 5, 7, 9, 11]:
    for weights in ["uniform", "distance"]:
        for metric in ["euclidean", "manhattan"]:
            model = KNeighborsClassifier(n_neighbors=k, metric=metric, weights=weights)
            model.fit(x_tr_scaled, y_tr)
            pred = model.predict(x_val_scaled)
            acc = accuracy_score(y_val, pred)
            print(f"K: {k}, acc: {acc}")

            if acc > best_acc:
                best_acc = acc
                best_cfg = {"k": k, "metric": metric, "weights": weights}
                
훈련 데이터중 일부를 떼서 검증 데이터로
최적의 하이퍼 파라미터를 찾음
왜 따로 때냐면 전체 데이터로 이것을 찾으면 과적합이 될 수 있기떄문에
떼서 하고 새로운 데이터로 검증함
```

**예시 코드 1.**

모델 전체 흐름 + 시각적 분석. 하이퍼 파라미터는 k만 변경

```python
import numpy as np
import matplotlib.pyplot as plt
from pandas.io.sql import com
from scipy.integrate._ivp.radau import P
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import seaborn as sns
import pandas as pd

# 한글
from matplotlib import font_manager, rc
import platform

if platform.system() == "Windows":
    plt.rc("font", family="Malgun Gothic")
elif platform.system() == "Darwin":  # macOS
    plt.rc("font", family="AppleGothic")
else:  # 리눅스 계열 (예: 구글코랩, 우분투)
    plt.rc("font", family="NanumGothic")

plt.rcParams["axes.unicode_minus"] = False  # 마이너스 깨짐 방지


# 1. 데이터 로드
iris = load_iris()  # Bunch 객체

X, Y = iris.data, iris.target
X_2, Y_2 = load_iris(return_X_y=True, as_frame=True)
print(X_2)
print("--------------------------------")
print(Y_2)
print("--------------------------------")
print("--------------------------------")
# 위의 2줄이 같은 값이긴 한데 형태가 다름 처음껀 리스트 형식 밑에는 데이터프레임 형식
print(X)
print("--------------------------------")
print(Y)
print("==붓꽃 데이터셋 정보==")
print(f"데이터 개수: ,{len(X)}")
print(f"특성(features): {iris.feature_names}")
print(f"클래스(species): {iris.target_names}")
df = pd.DataFrame(X[:, [2, 3]], columns=iris.feature_names[2:4])
df["species"] = [iris.target_names[i] for i in Y]

fig = plt.figure(figsize=(12, 5))
ax1 = fig.add_subplot(1, 2, 1)

sns.scatterplot(
    data=df, x=iris.feature_names[2], y=iris.feature_names[3], hue="species", ax=ax1
)
ax1.set_xlabel("꽃받침 길이(cm)")
ax1.set_ylabel("꽃받침 너비(cm)")
ax1.set_title("붗꽃 데이터 분포")
ax1.grid(True)


x_train, x_test, y_train, y_test = train_test_split(
    X, Y, test_size=0.2, random_state=33, stratify=Y
)  # 훈련/테스트 데이터 분리 (80:20), stratify=Y 는 데이터 분포를 유지하기 위해 사용
print(df)

scaler = StandardScaler().fit(x_train)
x_train_scaled = scaler.transform(x_train)
x_test_scaled = scaler.transform(x_test)
print(x_train)
print(x_train_scaled)

k = 33
knn = KNeighborsClassifier(n_neighbors=k)
knn.fit(x_train_scaled, y_train)

y_pred = knn.predict(x_test_scaled)

accuracy = accuracy_score(y_test, y_pred)
print(f"==KNN(k={k} 모델 성능)")
print(f"정확도(accuracy): {accuracy: .2f}")
print("분류 리포트: ")
print(classification_report(y_test, y_pred, target_names=iris.target_names))
print(y_pred)
print(y_test)

print("----혼동행렬-----")
cm = confusion_matrix(y_test, y_pred)
dfcm = pd.DataFrame(cm, index=iris.target_names, columns=iris.target_names)

ax2 = fig.add_subplot(122)
sns.heatmap(data=dfcm, annot=True, fmt="d", cmap="Blues", ax=ax2)
ax2.set_xlabel("예측값")
ax2.set_ylabel("실제값")
ax2.set_title("Confusion Matrix")


k_range = range(3, 51)
accuracies = []

for k in k_range:
    knn_temp = KNeighborsClassifier(n_neighbors=k)
    knn_temp.fit(x_train_scaled, y_train)
    y_pred_temp = knn_temp.predict(x_test_scaled)
    accuracies.append(accuracy_score(y_test, y_pred_temp))

ax3 = fig.add_subplot(133)
ax3.plot(k_range, accuracies, marker="o")
ax3.set_xlabel("k 값")
ax3.set_ylabel("정확도")
ax3.set_title("k값에 따른 분류")
ax3.grid(True)
ax3.set_xticks(range(1, 31, 2))
print(accuracies)
plt.tight_layout()
plt.show()

print("----------새로운 데이터 붓꽃 예측-----------------")
new_flower = np.array([[5.1, 3.5, 1.4, 0.2]])
new_flower_scaled = scaler.transform(new_flower)

pred = knn.predict(new_flower_scaled)
probabilites = knn.predict_proba(new_flower_scaled)
print(pred)  # 0이라고 나오는것의 이름은 새로운 꽃 저 크기라면 setosa이다
print(probabilites)  # setosa가 될 확률은 1, versicolor와 virginica이건 0
```

**예시 코드2.**

하이퍼 파라미터 k, metric, weights 3개 최적값 탐색

```python
import numpy as np
import matplotlib.pyplot as plt
from pandas.io.sql import com
from scipy.integrate._ivp.radau import P
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import seaborn as sns
import pandas as pd

# 한글
from matplotlib import font_manager, rc
import platform

if platform.system() == "Windows":
    plt.rc("font", family="Malgun Gothic")
elif platform.system() == "Darwin":  # macOS
    plt.rc("font", family="AppleGothic")
else:  # 리눅스 계열 (예: 구글코랩, 우분투)
    plt.rc("font", family="NanumGothic")

plt.rcParams["axes.unicode_minus"] = False  # 마이너스 깨짐 방지


# 1. 데이터 로드
iris = load_iris()  # Bunch 객체

X, Y = iris.data, iris.target
X_2, Y_2 = load_iris(return_X_y=True, as_frame=True)
print(X_2)
print("--------------------------------")
print(Y_2)
print("--------------------------------")
print("--------------------------------")
# 위의 2줄이 같은 값이긴 한데 형태가 다름 처음껀 리스트 형식 밑에는 데이터프레임 형식
print(X)
print("--------------------------------")
print(Y)
print("==붓꽃 데이터셋 정보==")
print(f"데이터 개수: ,{len(X)}")
print(f"특성(features): {iris.feature_names}")
print(f"클래스(species): {iris.target_names}")


x_train, x_test, y_train, y_test = train_test_split(
    X, Y, test_size=0.2, random_state=42, stratify=Y
)  # 훈련/테스트 데이터 분리 (80:20), stratify=Y 는 데이터 분포를 유지하기 위해 사용

x_tr, x_val, y_tr, y_val = train_test_split(
    x_train, y_train, test_size=0.25, random_state=42, stratify=y_train
)

scaler = StandardScaler().fit(x_tr)
x_tr_scaled = scaler.transform(x_tr)
x_val_scaled = scaler.transform(x_val)
print(x_train)

best_cfg = None
best_acc = -1.0  # 최소값이 0이니까 더 작은값 넣어둠

for k in [3, 5, 7, 9, 11]:
    for weights in ["uniform", "distance"]:
        for metric in ["euclidean", "manhattan"]:
            model = KNeighborsClassifier(n_neighbors=k, metric=metric, weights=weights)
            model.fit(x_tr_scaled, y_tr)
            pred = model.predict(x_val_scaled)
            acc = accuracy_score(y_val, pred)
            print(f"K: {k}, acc: {acc}")

            if acc > best_acc:
                best_acc = acc
                best_cfg = {"k": k, "metric": metric, "weights": weights}

print(f"[검증] 최고 정확도 = {best_acc: .3f} 설정 = {best_cfg}")

scaler = StandardScaler().fit(x_train)
x_train_scaled = scaler.transform(x_train)
x_test_scaled = scaler.transform(x_test)

knn_model = KNeighborsClassifier(
    n_neighbors=best_cfg["k"], metric=best_cfg["metric"], weights=best_cfg["weights"]
)
knn_model.fit(x_train_scaled, y_train)
pred = knn_model.predict(x_test_scaled)
last_acc = accuracy_score(y_test, pred)

print(f"테스트 정확도: {last_acc: .3f}")
print(classification_report(y_test, pred, digits=3))


cm = confusion_matrix(y_test, pred)
dfcm = pd.DataFrame(cm, index=iris.target_names, columns=iris.target_names)

fig = plt.figure(figsize=(5, 5))
ax = fig.add_subplot()
sns.heatmap(data=dfcm, annot=True, fmt="d", cmap="Blues", ax=ax)
ax.set_xlabel("예측 값")
ax.set_ylabel("실제 값")
ax.set_title("Confusion Matrix")
plt.tight_layout()
plt.show()


print("\n==새로운 데이터 붓꽃 예측===")
new_flower = np.array([[2.1, 1.5, 1.4, 0.2]])
new_flower_scaled = scaler.transform(new_flower)
pred = knn_model.predict(new_flower_scaled)
probabilites = knn_model.predict_proba(new_flower_scaled)
print(pred)
print(probabilites)
```
