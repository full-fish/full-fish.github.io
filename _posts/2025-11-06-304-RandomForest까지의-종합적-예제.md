---
title: "RandomForest까지의 종합적 예제"
date: 2025-11-06 16:12:37 +0900
render_with_liquid: false
categories: ["데이터 분석", "머신러닝, 딥러닝"]
---

```python
0. 데이터 (seaborn : penguins)
1. 데이터 전처리
   - 수치형/범주형 변수 분리
   - 결측치 처리(수치형(median)/범주형(mode))
   - 범주형 데이터 인코딩(one-hot-encoding)
2. 원시데이터 시각화
   - 클래스 불균형
   - 수치형 변수들의 분포(히스토그램)
   - 이상치 및 분포 확인(박스플롯, 바이올린 플롯)
   - 수치형 변수가의 상관관계(히트맵)
3. ColumnTransformer() 
   -수치형 컬럼 스케일링
4. pipeline()
5. 교차검증객체 생성
6. gridsearchCV()
7. (학습/테스트)데이터 분리
8. 학습
9. 테스트 
10. 테스트 점수 출력
11. 변수 중요도(mdi, mda)
12. 변수 중요도 시각화
```
```python
from __future__ import division
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, StratifiedKFold, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.model_selection import cross_val_score, GridSearchCV
from sklearn.inspection import permutation_importance
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report,
)
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split, StratifiedKFold, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    accuracy_score,
    roc_auc_score,
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

# ----------------------------------------

# species     island  bill_length_mm  bill_depth_mm  flipper_length_mm  body_mass_g     sex
df = sns.load_dataset("penguins")

# 수치형 컬럼과 범주형 컬럼 구분
num_cols = df.select_dtypes(include=["number"]).columns
cat_cols = df.select_dtypes(exclude=["number"]).columns

# 수치형은 중앙값으로 결측치 채우기
for col in num_cols:
    df.fillna({col: df[col].median()}, inplace=True)

# 범주형 → 최빈값으로 결측치 채우기
for col in cat_cols:
    df.fillna({col: df[col].mode()[0]}, inplace=True)
print(df)

X = df.drop(columns=["species"])
X_encoded = pd.get_dummies(data=X, dtype="int", drop_first=False)
Y = df["species"]

# 원시데이터 시각화
fig, axes = plt.subplots(4, 6, figsize=(20, 12))
corr = df[num_cols].corr()

sns.countplot(data=df, x="species", ax=axes[0, 0])
sns.heatmap(corr, annot=True, fmt=".2f", cmap="coolwarm", ax=axes[0, 1])

for index, col in enumerate(X.columns):
    sns.histplot(data=df, x=col, kde=True, ax=axes[1, index])
    axes[1, index].set_title(f"{col}의 분포")
for index, col in enumerate(X.columns):
    sns.boxplot(data=df, x="species", y=col, ax=axes[2, index])
    axes[2, index].set_title(f"{col}의 이상치 및 분포")


x_train, x_test, y_train, y_test = train_test_split(
    X_encoded, Y, test_size=0.2, random_state=42, stratify=Y
)

#  ColumnTransformer()  -수치형 컬럼 스케일링
pipe = Pipeline(
    [
        ("scaler", StandardScaler()),
        (
            "model",
            RandomForestClassifier(
                n_estimators=200, random_state=42, class_weight="balanced", n_jobs=-1
            ),
        ),
    ]
)


# 교차 검증 객체 생성
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

# gridsearchCV
param_grid = {
    "model__n_estimators": [100, 200, 300],
    "model__max_depth": [None, 5, 10],
    "model__min_samples_leaf": [1, 2, 4],
    "model__max_features": [None, "sqrt", "log2"],
}

grid = GridSearchCV(
    estimator=pipe,
    param_grid=param_grid,
    scoring="roc_auc_ovr",  # 하이퍼파라미터 선택 기준 점수
    cv=cv,  # 검증 방식
    n_jobs=-1,  # 가능한 코어 활용(그리드 탐색에만 적용)
    refit=True,  # 최고 점수 모델로 자동 재학습
    return_train_score=True,
)
grid.fit(x_train, y_train)
print("Best Params : ", grid.best_params_)
print("Best CV ROC AUC : ", grid.best_score_)


best_estimator = grid.best_estimator_
best_model = best_estimator.named_steps["model"]

y_pred = best_estimator.predict(x_test)
y_proba = best_estimator.predict_proba(x_test)

# 다중분류 average="macro" 기본 값은 binary인데 이건 이진 분류에서만
acc = accuracy_score(y_test, y_pred)  # 정확도
prec = precision_score(y_test, y_pred, average="macro")  # 정밀도
rec = recall_score(y_test, y_pred, average="macro")  # 재현율
f1 = f1_score(y_test, y_pred, average="macro")
auc = roc_auc_score(y_test, y_proba, multi_class="ovr")

print("Test accuracy:", acc)
print("Test ROC AUC (ovr):", auc)
print("Classification report:\n", classification_report(y_test, y_pred))

metrics = {
    "Accuracy": acc,
    "Precision": prec,
    "Recall": rec,
    "F1-score": f1,
    "ROC AUC": auc,
}
df_metrics = pd.DataFrame(list(metrics.items()), columns=["Metric", "Score"])
sns.barplot(data=df_metrics, x="Score", y="Metric", ax=axes[3, 2], palette="crest")
axes[3, 2].set_title("모델 성능 지표")
axes[3, 2].set_xlim(0, 1.05)

for i, v in enumerate(df_metrics["Score"]):
    axes[3, 2].text(v, i, f"{v:.3f}", va="center")

# MDI
importances = best_model.feature_importances_
feature_names = x_train.columns
mdi_df = pd.DataFrame({"feature": feature_names, "importance": importances})
mdi_df.sort_values("importance", ascending=False, inplace=True)

# MDA
perm = permutation_importance(
    best_estimator,
    x_test,
    y_test,
    n_repeats=30,
    scoring="roc_auc_ovr",
    random_state=42,
    n_jobs=-1,
)
mda_df = pd.Series(perm.importances_mean, index=x_train.columns).sort_values(
    ascending=False
)

# 시각화
axes[3, 0].barh(mdi_df.head(10)["feature"][::-1], mdi_df.head(10)["importance"][::-1])
axes[3, 0].set_title("MDI (Mean Decrease in Impurity)")

axes[3, 1].barh(mda_df.head(10).index[::-1], mda_df.head(10).values[::-1])
axes[3, 1].set_title("MDA (Permutation Importance)")
for ax in axes.flat:  # 1차원으로 평탄화
    if not ax.has_data():  # 빈 거면 안뜨게
        ax.set_visible(False)
plt.tight_layout()
plt.show()
```

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/304/img.png)

**ColumnTransformer**

이거를 쓰면 원핫인코딩과 스케일링이 파이프라인 안에서 한번에 됨

언제 굳이 ColumnTransformer 쓰냐  
실무처럼 “새 데이터가 또 들어올 건데, 이때도 같은 전처리 해줘”를 자동으로 하고 싶을 때  
수치형은 스케일링, 범주형은 원핫, 어떤 건 빼고, 이런 걸 한 번에 묶어서 GridSearch까지 같이 하고 싶을 때  
나중에 이 파이프라인을 joblib으로 저장해서 쓰거나, 배포하는 코드에 넣을 때 이럴 때는 ColumnTransformer가 이득. 한 군데만 정의해두면 됨

이거 쓴 예제

```python
from __future__ import division
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split, StratifiedKFold, GridSearchCV
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    classification_report,
)
from sklearn.inspection import permutation_importance
import platform

# 한글 설정
if platform.system() == "Windows":
    plt.rc("font", family="Malgun Gothic")
elif platform.system() == "Darwin":
    plt.rc("font", family="AppleGothic")
else:
    plt.rc("font", family="NanumGothic")
plt.rcParams["axes.unicode_minus"] = False

# 1. 데이터
df = sns.load_dataset("penguins")

# 2. 결측치 처리 (df 전체에서 먼저)
num_cols_all = df.select_dtypes(include=["number"]).columns
cat_cols_all = df.select_dtypes(exclude=["number"]).columns

for col in num_cols_all:
    df[col].fillna(df[col].median(), inplace=True)
for col in cat_cols_all:
    df[col].fillna(df[col].mode()[0], inplace=True)

# 3. X, y 분리
X = df.drop(columns=["species"])
y = df["species"]

# 4. 숫자/범주형 다시 나누기 (이제 여기서 뽑은 걸 ColumnTransformer에 넣을 거임)
num_cols = X.select_dtypes(include=["number"]).columns
cat_cols = X.select_dtypes(exclude=["number"]).columns

# 5. ColumnTransformer 정의
preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), num_cols),
        ("cat", OneHotEncoder(handle_unknown="ignore"), cat_cols),
    ],
    remainder="drop",
)

# 6. 파이프라인 (전처리 → 모델)
pipe = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        (
            "model",
            RandomForestClassifier(
                n_estimators=200,
                random_state=42,
                class_weight="balanced",
                n_jobs=-1,
            ),
        ),
    ]
)

# 7. 시각화 (여기는 네 원래 코드 스타일 유지해도 됨: 인코딩 전 X로 그린다)
fig, axes = plt.subplots(4, 6, figsize=(20, 12))
corr = df[num_cols].corr()

sns.countplot(data=df, x="species", ax=axes[0, 0])
sns.heatmap(corr, annot=True, fmt=".2f", cmap="coolwarm", ax=axes[0, 1])

# 숫자형만 히스토그램, 박스플롯
for idx, col in enumerate(num_cols):
    sns.histplot(data=df, x=col, kde=True, ax=axes[1, idx])
    axes[1, idx].set_title(f"{col}의 분포")

for idx, col in enumerate(num_cols):
    sns.boxplot(data=df, x="species", y=col, ax=axes[2, idx])
    axes[2, idx].set_title(f"{col}의 이상치 및 분포")

# 8. train/test split은 원본 X로
x_train, x_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 9. 교차검증 객체
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

# 10. GridSearchCV (이제 estimator가 pipe임)
param_grid = {
    "model__n_estimators": [100, 200, 300],
    "model__max_depth": [None, 5, 10],
    "model__min_samples_leaf": [1, 2, 4],
    "model__max_features": [None, "sqrt", "log2"],
}

grid = GridSearchCV(
    estimator=pipe,
    param_grid=param_grid,
    scoring="roc_auc_ovr",
    cv=cv,
    n_jobs=-1,
    refit=True,
    return_train_score=True,
)
grid.fit(x_train, y_train)

print("Best Params :", grid.best_params_)
print("Best CV ROC AUC :", grid.best_score_)

best_estimator = grid.best_estimator_
best_model = best_estimator.named_steps["model"]
best_preprocessor = best_estimator.named_steps["preprocessor"]

# 11. 예측
y_pred = best_estimator.predict(x_test)
y_proba = best_estimator.predict_proba(x_test)

acc = accuracy_score(y_test, y_pred)
prec = precision_score(y_test, y_pred, average="macro")
rec = recall_score(y_test, y_pred, average="macro")
f1 = f1_score(y_test, y_pred, average="macro")
auc = roc_auc_score(y_test, y_proba, multi_class="ovr")

print("Test accuracy:", acc)
print("Test ROC AUC (ovr):", auc)
print("Classification report:\n", classification_report(y_test, y_pred))

# 12. 성능 막대 그래프 (네 원래 코드 그대로)
metrics = {
    "Accuracy": acc,
    "Precision": prec,
    "Recall": rec,
    "F1-score": f1,
    "ROC AUC": auc,
}
df_metrics = pd.DataFrame(list(metrics.items()), columns=["Metric", "Score"])
sns.barplot(data=df_metrics, x="Score", y="Metric", ax=axes[3, 2], palette="crest")
axes[3, 2].set_title("모델 성능 지표")
axes[3, 2].set_xlim(0, 1.05)
for i, v in enumerate(df_metrics["Score"]):
    axes[3, 2].text(v, i, f"{v:.3f}", va="center")

# 13. MDI (RandomForest 내장 중요도) → 전처리된 컬럼 이름 필요
feat_names = best_preprocessor.get_feature_names_out()
importances = best_model.feature_importances_
mdi_df = pd.DataFrame({"feature": feat_names, "importance": importances}).sort_values(
    "importance", ascending=False
)

axes[3, 0].barh(mdi_df.head(10)["feature"][::-1], mdi_df.head(10)["importance"][::-1])
axes[3, 0].set_title("MDI (Mean Decrease in Impurity)")

# 14. MDA (Permutation Importance) → 파이프라인에 원본 X 넣었으니 이름은 원본 X.columns로
perm = permutation_importance(
    best_estimator,
    x_test,
    y_test,
    n_repeats=30,
    scoring="roc_auc_ovr",
    random_state=42,
    n_jobs=-1,
)
mda_df = pd.Series(perm.importances_mean, index=X.columns).sort_values(ascending=False)

axes[3, 1].barh(mda_df.head(10).index[::-1], mda_df.head(10).values[::-1])
axes[3, 1].set_title("MDA (Permutation Importance)")

# 15. 빈 축 숨기기
for ax in axes.flat:
    if not ax.has_data():
        ax.set_visible(False)

plt.tight_layout()
plt.show()
```

파이프라인 안에서 원핫인코딩을 하다보니까 열의 개수가 늘어남

그래서 바뀌는 부분들이 있음

----------------------------------------------

그리고 사실 지금 이코드들은 데이터 누수가 일어 남

1. 결측치를 전체 데이터에서 채웠음

먼저 train, test 분리하고 train기준 결측치를 채우고 그 값을 test에도 적용

2. 원핫인코딩을 split전에 했음. test에 이미 컬럼이 생겨서 알게 되어 버림

누수 막기 예시

결측치랑 원핫인코딩을 안에서 해버림

```python
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier

df = sns.load_dataset("penguins")
X = df.drop(columns=["species"])
y = df["species"]

num_cols = X.select_dtypes(include=["number"]).columns
cat_cols = X.select_dtypes(exclude=["number"]).columns

x_train, x_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

preprocess = ColumnTransformer(
    transformers=[
        ("num", Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]), num_cols),
        ("cat", Pipeline([
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("ohe", OneHotEncoder(handle_unknown="ignore")),
        ]), cat_cols),
    ]
)

pipe = Pipeline(
    [
        ("prep", preprocess),
        ("model", RandomForestClassifier(
            n_estimators=200,
            random_state=42,
            class_weight="balanced",
            n_jobs=-1,
        )),
    ]
)



-----------------------------
이렇게 해도 됨
num_pipe = Pipeline(steps=[
    ("num", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])

cat_pipe = Pipeline(steps=[
    ("cat", SimpleImputer(strategy="most_frequent")),
    ("cat_encode", OneHotEncoder(handle_unknown="ignore")),
])

preprocess = ColumnTransformer(
    transformers=[
        ("num_pre", num_pipe, num_cols),
        ("cat_pre", cat_pipe, cat_cols),
    ],
    remainder="passthrough",
)
```

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/304/img_1.png)

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/304/img_2.png)

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/304/img_3.png)

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/304/img_4.png)
