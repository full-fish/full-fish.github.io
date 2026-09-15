---
title: "LogisticRegression"
date: 2025-11-04 15:43:04 +0900
render_with_liquid: false
categories: ["데이터 분석", "머신러닝, 딥러닝"]
---

데이터가 어떤 범주(class)에 속할 확률을 0에서 1사이의 값으로 예측하고 그 확률에 따라 가능성이 더 높은 범주에  
속하는 것으로 분류해주는 지도 학습 알고리즘

이진 분류(스팸/햄, 합격/불합격)나 다중 분류(와인 3종류)할 때 쓰는 선형 모델  
입력 특징들에 가중치를 곱해서 직선을(또는 초평면) 만든 다음,  
그 결과를 시그모이드/소프트맥스로 확률로 바꿔서 “이 클래스일 확률이 얼마야”라고 말해주는 모델

이진(sigmod)/다중(softmax) 분류 모두에 사용

시그모이드(Sigmoid) 함수를 사용해 확률을 계산

P = sigmoid(z)  z=0이면 0.5, z가 커질수록 1에 가깝고, 작아질수록 0에 가깝다

소프트맥스함수: 다중 분류에 사용

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/300/img.png)

입력 데이터가 각 클래스에 속할 확률 계산

모든 클래스 확률 더하면 1.0

소프트맥스 K=2는 시그모이드와 동일

```python
from sklearn.linear_model import LogisticRegression

model = LogisticRegression(
    class_weight="balanced",
    max_iter=1000,
    solver="lbfgs",
    n_jobs=None,
    random_state=42,
)

'''
class_weight="balanced" 
데이터가 불균형할 때 쓰는 옵션
더 적은 클래스에 더 큰 가중치
weight(c) = (n)samples / ( n(classes) * n(samples of class c) ) 

max_iter=1000
로지스틱 회귀는 내부적으로 최적화(반복) 를 하면서 가중치를 찾는데
그 반복을 최대 몇 번까지 할 거냐를 정하는 값
기본값은 100인데, 특징이 많거나 정규화가 안 되면 100번 안에 안 끝날 수 있어서 경고가 나와
그래서 1000으로 올려놓으면 “수렴 못 했어요” 경고 덜 봄

solver="lbfgs"
파라미터를 어떻게 최적화할 거냐를 정하는 알고리즘 선택이야
lbfgs:다중 클래스(multi_class='auto')에서도 잘 되며 
  비교적 안정적이고 데이터가 너무 크지만 않으면 무난한 선택
  손실함수의 경사를 활용(L2규제 사용)
liblinear: 소규모/이진분류에 좋음
saga: L1 규제, 대규모 데이터에 좋음

n_jobs=None
“얼마나 많은 CPU 코어를 병렬 처리에 쓸까?”라는 뜻
로지스틱회귀에서 이게 크게 영향 없는 경우도 있음
None이면 기본값(1코어)
n_jobs=-1로 하면 사용할 수 있는 코어를 다 쓰도록 하는 패턴이 많음

penalty="l2": 기본 규제 방식

C=1.0: 규제 강도(작을수록 규제를 강하게)

multi_class="auto": 클래스가 2개면 이진, 3개 이상이면 자동으로 softmax 방식'''
```

**PipeLine**

```python
pipe = Pipeline(
    [
        ("scaler", StandardScaler()),
        (
            "clf",
            LogisticRegression(
                class_weight="balanced",
                max_iter=1000,
                solver="lbfgs",
                n_jobs=None,
                random_state=42,
            ),
        ),
    ]
)

'''
전처리(StandardScaler) + 모델(LogisticRegression) 을 하나의 파이프라인 객체로 묶는 것
교차검증/테스트 시, 스케일러는 훈련 폴드에서만 fit되고 검증/테스트에는 transform만 자동 적용
fit() 한 번 호출로 전처리→학습이 순서대로 자동 수행
GridSearchCV에서 전처리/모델 하이퍼파라미터를 한 번에 탐색 가능
재현성/배포 용이: 학습에 쓰인 전처리 파라미터(평균·표준편차 등)까지 함께 저장되어 그대로 배포 가능'''
```

**교차 검증**

주어진 데이터를 가지고 반복적으로 성과를 측정하여 그 결과를 평균한 것으로 모델를 평가하는 방법

K-Fold 교차 검증(K-Fold Cross Validation)  
1. 전체 데이터를 Shuffle  
2. K개의 폴드로 데이터를 분할  
3. K번째 폴드를 검증용 자료, 나머지 폴드를 훈련용 자료로 사용하  
여 K번 반복 측정  
4. 결과를 평균 낸 값을 최종 평가로 사용  
5. K>=2로 사용

데이터가 충분하지 않을 경우 사용

클래스 불균형 데이터에는 적합하지 않음 (데이터 개수가 작은 클래스에 가중치 주어 보완 가능)

```python
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

# 사용 예시
from sklearn.model_selection import cross_val_score
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_wine
from sklearn.model_selection import StratifiedKFold

X, y = load_wine(return_X_y=True)
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

model = LogisticRegression(max_iter=1000)

scores = cross_val_score(model, X, y, cv=cv, scoring='accuracy')
print("각 fold 정확도:", scores)
print("평균 정확도:", scores.mean())
```

**GridSearchCV()**

하이퍼파라미터 조합을 모두 시도하고

각 조합에 대해 교차검증을 수행해서

가장 성능이 좋은 조합 탐색

```python
grid = GridSearchCV(
    estimator=pipe,
    param_grid=param_grid,
    scoring="roc_auc",  # 하이퍼파라미터 선택 기준 점수
    cv=cv,  # 검증 방식
    n_jobs=-1,  # 가능한 코어 활용(그리드 탐색에만 적용)
    refit=True,  # 최고 점수 모델로 자동 재학습
    return_train_score=True,
)

'''
얻을 수 있는 주요 속성
grid.best_params_	최고 점수를 낸 파라미터 조합
grid.best_score_	최고 평균 검증 점수
grid.best_estimator_	최고 조합으로 학습된 최종 모델
grid.cv_results_	모든 조합의 세부 점수 정보 (dict 형태)'''

'''
cv_results_
mean_train_score : 폴드별 훈련 점수의 평균
std_train_score : 폴드별 훈련 점수의 표준편차
split0_train_score, split1_train_score, ... : 각 폴드의 훈련 점수
mean_test_score : 폴드별 테스트 점수의 평균
std_ test _score : 폴드별 테스트 점수의 표준편차
split0_ test _score, split1_ test _score, ... : 각 폴드의 테스트 점수

mean_train_score ≫ mean_test_score → 과적합 의심(훈련은 잘 맞는데 일반화가 떨어짐)
둘 다 낮음 → 과소적합(모델이 단순하거나 신호가 약함)
'''

'''
estimator=pipe
pipe = Pipeline([
    ('scaler', StandardScaler()),
    ('model', LogisticRegression())
])
이런 형태로 파이프라인(전처리 + 모델)을 넣음
계속 이 pipe를 학습시키면서 모든 하이퍼파라미터 조합을 시험 함

param_grid=param_grid
탐색할 하이퍼파라미터 후보 목록을 딕셔너리 형태로 넣는 곳
예시
param_grid = {
    'model__C': [0.01, 0.1, 1, 10], # 값이 작을 수록 규제가 강함(모델단순,과적합줄임)
    'model__solver': ['lbfgs', 'liblinear']
}

scoring="roc_auc"
성능을 평가할 기준(metric)”을 지정
accuracy → 정확도
precision, recall, f1
roc_auc → ROC 커브 아래 면적 (이진 분류에서 자주 사용)

cv=cv
어떤 교차검증 방법을 쓸지 지정
예시
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

n_jobs=-1
병렬처리 몇 코어 쓸래
-1은 → CPU 가능한 코어 모두 사용
데이터 많거나 파라미터 조합 많을 때 필수

refit=True
리드 탐색 끝나면, **가장 좋은 파라미터 조합(best_params_)**으로
전체 데이터를 다시 학습(refit)할지 여부
True면 이게 실행됨
grid.best_estimator_.fit(X, y)

return_train_score=True
기본적으로는 **검증 점수(cv_score)**만 저장하는데
이걸 True로 두면 훈련 점수(train_score)도 같이 기록
과적합(overfitting) 여부를 확인할 때 유용
예시
grid.cv_results_로 보면
{
  'mean_train_score': [...],
  'mean_test_score': [...],
  'params': [...]
}'''
```

수동으로 그냥 보는거

```python
# cross_val_score()
사이킷런의 교차 검증용 함수 
지정한 모델(pipe)을 여러 번 학습시켜서 평균 성능을 계산

cv_auc = cross_val_score(pipe, x_train, y_train, cv=cv, scoring="roc_auc")
cv_acc = cross_val_score(pipe, x_train, y_train, scoring="accuracy")

# auc
여기서는 AUC(ROC 커브 아래 면적) 기준으로 교차검증 점수를 구함
AUC는 모델이 클래스 구분을 얼마나 잘하는지를 나타내는 지표
1.0이면 완벽 구분
0.5면 그냥 랜덤 수준
분류 문제가 불균형하거나 “정확도만 보면 안 되는 상황”에서 유용

# acc
정확도(accuracy) 기준으로 같은 교차검증을 수행
모델이 예측을 몇 퍼센트 맞췄는지 단순히 보는 지표
데이터가 균형 잡혀 있을 때는 AUC보다 간단하게 성능을 확인
```

**예시**

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split, StratifiedKFold, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score, GridSearchCV
from sklearn.metrics import (
    accuracy_score,
    roc_curve,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report,
)

data = load_breast_cancer(as_frame=True)
print(data.frame)
X = data.frame.drop(columns=["target"])
Y = data.frame["target"]

x_train, x_test, y_train, y_test = train_test_split(
    X, Y, test_size=0.2, random_state=42, stratify=Y
)


pipe = Pipeline(
    [
        ("scaler", StandardScaler()),
        (
            "clf",
            LogisticRegression(
                class_weight="balanced",
                max_iter=1000,
                solver="lbfgs",
                n_jobs=None,
                random_state=42,
            ),
        ),
    ]
)
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

param_grid = {"clf__C": [0.01, 0.1, 0.3, 1, 3, 10]}
grid = GridSearchCV(
    estimator=pipe,
    param_grid=param_grid,
    scoring="roc_auc",  # 하이퍼파라미터 선택 기준 점수
    cv=cv,  # 검증 방식
    n_jobs=-1,  # 가능한 코어 활용(그리드 탐색에만 적용)
    refit=True,  # 최고 점수 모델로 자동 재학습
    return_train_score=True,
)

grid.fit(x_train, y_train)


print("Best Params : ", grid.best_params_)
print("Best CV ROC AUC : ", grid.best_score_)
cvres = (
    pd.DataFrame(grid.cv_results_)
    .loc[:, ["params", "mean_test_score", "mean_train_score"]]
    .sort_values("mean_test_score", ascending=False)
)
print(cvres.head(10))

best_model = grid.best_estimator_
y_pred = best_model.predict(x_test)
y_pred_proba = best_model.predict_proba(x_test)[:, 1]

acc = accuracy_score(y_test, y_pred)  # 정확도
prec = precision_score(y_test, y_pred)  # 정밀도
rec = recall_score(y_test, y_pred)  # 재현율
auc = roc_auc_score(y_test, y_pred_proba)

print("acc : ", acc)
print("prec :", prec)
print("rec : ", rec)
print("auc : ", auc)

print(classification_report(y_test, y_pred, digits=3))

cm = confusion_matrix(y_test, y_pred)
print(cm)

print(pd.DataFrame(cm, index=["악성", "양성"], columns=["악성", "양성"]))
```

**과대적합**

훈련 점수: 높음

검증, 테스트 점수: 낮음

원인: 모델의 매개변수가 많거나, 데이터/졍규화 부족, 노이즈까지 외움

해결법

Feature의 개수를 줄이거나, Dropout(신경망)을 수행  
Regularization, 규제 강도 강화  
계수의 값을 줄이거나 0으로 만들어서 모델을 단순화

**과소적합**

훈련, 검증, 테스트 점수 낮음

원인: 모델 너무 단순, 학습 불충분, 중요한 특징 미포함

해결법

모델 복잡도 올림

학습 더 오래

특징 추가/개선

Feature의 개수를 줄이거나, Dropout(신경망)을 수행  
▪ Regularization, 규제 강도 강화  
• 계수의 값을 줄이거나 0으로 만들어서 모델을 단순화

**평가지표**

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/300/img_1.png)

**예시 코드**

```python
from __future__ import division
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split, StratifiedKFold, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score, GridSearchCV
from sklearn.metrics import (
    accuracy_score,
    roc_curve,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report,
)

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

df = sns.load_dataset("titanic")
# 결측치 제거. 결측치 있으면 스케일러가 못 다룸
df = df.dropna(subset=["age", "embarked", "sex", "class"])
print(df)
# 원핫 인코딩
df_encoded = pd.get_dummies(df, drop_first=True)
print(df_encoded)
#! "alive_yes"이거 가 survived랑 같은 데이터라 있으면 데이터누수 나서 정확도 1이 나옴
X = df_encoded.drop(columns=["survived", "alive_yes"])
Y = df_encoded["survived"]

fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# 객실 등급이 좋을 수록 살 가능성이 높음
sns.barplot(data=df, x="class", y="survived", estimator="mean", ax=axes[0, 0])
axes[0, 0].set_title("Class별 생존률")
axes[0, 0].set_ylabel("생존률")
axes[0, 0].set_xlabel("객실 등급")

x_train, x_test, y_train, y_test = train_test_split(
    X, Y, test_size=0.2, random_state=42, stratify=Y
)

pipe = Pipeline(
    [
        ("scaler", StandardScaler()),
        (
            "clf",
            LogisticRegression(
                class_weight="balanced",
                max_iter=1000,
                solver="lbfgs",
                n_jobs=None,
                random_state=42,
            ),
        ),
    ]
)

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)


param_grid = {"clf__C": [0.01, 0.1, 0.3, 1, 3, 10]}
grid = GridSearchCV(
    estimator=pipe,
    param_grid=param_grid,
    scoring="roc_auc",  # 하이퍼파라미터 선택 기준 점수
    cv=cv,  # 검증 방식
    n_jobs=-1,  # 가능한 코어 활용(그리드 탐색에만 적용)
    refit=True,  # 최고 점수 모델로 자동 재학습
    return_train_score=True,
)

grid.fit(x_train, y_train)

print("Best Params : ", grid.best_params_)
print("Best CV ROC AUC : ", grid.best_score_)

cvres = (
    pd.DataFrame(grid.cv_results_)
    .loc[:, ["params", "mean_test_score", "mean_train_score"]]
    .sort_values("mean_test_score", ascending=False)
)
print(cvres.head(10))


best_model = grid.best_estimator_
y_pred = best_model.predict(x_test)
y_pred_proba = best_model.predict_proba(x_test)[:, 1]

acc = accuracy_score(y_test, y_pred)  # 정확도
prec = precision_score(y_test, y_pred)  # 정밀도
rec = recall_score(y_test, y_pred)  # 재현율
f1 = f1_score(y_test, y_pred)
auc = roc_auc_score(y_test, y_pred_proba)

print("acc : ", acc)
print("prec :", prec)
print("rec : ", rec)
print("f1 : ", f1)
print("auc : ", auc)

metrics = {
    "Accuracy": acc,
    "Precision": prec,
    "Recall": rec,
    "F1-score": f1,
    "ROC AUC": auc,
}
df_metrics = pd.DataFrame(list(metrics.items()), columns=["Metric", "Score"])

sns.barplot(data=df_metrics, x="Score", y="Metric", ax=axes[0, 1], palette="crest")
axes[0, 1].set_title("모델 성능 지표")
axes[0, 1].set_xlim(0, 1.05)

for i, v in enumerate(df_metrics["Score"]):
    axes[0, 1].text(v, i, f"{v:.3f}", va="center")


print(classification_report(y_test, y_pred, digits=3))

cm = confusion_matrix(y_test, y_pred)
print(cm)

print(
    pd.DataFrame(
        cm, index=["실제: 사망", "실제: 생존"], columns=["예측: 사망", "예측: 생존"]
    )
)

fpr, tpr, thresholds = roc_curve(y_test, y_pred_proba)
print(fpr)
print(tpr)
print(thresholds)
# AUC 값이 0.858이 나오는데 성능이 좋은 편임
# 생존자 1명과 사망자 1명을 뽑았을때 85% 확률로 생존자 예측
axes[1, 0].plot(fpr, tpr, label=f"AUC = {auc:.3f}")
axes[1, 0].plot([1, 0], [1, 0], "k--", alpha=0.5)
axes[1, 0].set_title("ROC 곡선")
axes[1, 0].set_xlabel("False Positive Rate")
axes[1, 0].set_ylabel("True Positive Rate")
axes[1, 0].legend(loc="lower right")

# 피처 중요도 분석
coefs = best_model.named_steps["clf"].coef_[0]  # 로지스틱 회귀 계수
features = X.columns

importance = pd.DataFrame({"feature": features, "coef": coefs})
importance["abs_coef"] = importance["coef"].abs()
importance = importance.sort_values("abs_coef", ascending=False)

print(importance.head(15))

# survived에 영향을 가장 많이 주는건 성별임을 알 수 있음
# 성인 남자 일수록 살 가능성이 덕음
sns.barplot(
    data=importance.head(15), x="coef", y="feature", palette="vlag", ax=axes[1, 1]
)
axes[1, 1].set_title("로지스틱 회귀 - 피처 중요도(상위 15개)")
axes[1, 1].axvline(0, color="gray", linestyle="--")
axes[1, 1].set_xlabel("계수 (coef)")
axes[1, 1].set_ylabel("")
plt.tight_layout()
plt.show()
```
