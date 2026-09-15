---
title: "Gradient Boosting"
date: 2025-11-07 17:04:27 +0900
render_with_liquid: false
categories: ["데이터 분석", "머신러닝, 딥러닝"]
---

여러 개의 “아주 얕은 나무(weak learner)”를 순차적으로 더해가며, 앞선 모델이 틀린 부분을 학습하여 조금씩 고쳐 가는 부스팅 기  
법

잔차(residual): 실제 값과의 차이

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/305/img.png)

```python
learning_rate
• 한 번에 보정하는 크기. 
• 작을수록 과적합 위험↓, 대신 더 많은 트리 필요.
• 0.05~0.1 근처로 시작(0.2 이상은 주지 않는다)
max_iter
•  트리(부스팅 단계) 개수. learning_rate와 트레이드오프(500~1000).
max_depth / max_leaf_nodes
• 각 트리의 복잡도. 너무 크면 과적합↑.
min_samples_leaf / L2_regularization
• 과적합 방지용 규제.
early_stopping=True
• 검증 성능이 더 안 오르면 자동 중단
```

장점  
구조화 데이터(Tabular): 범주형/연속형 섞인 실무 데이터에 매우 강함  
트리 기반이라 스케일링 불필요(표준화 없어도 됨)  
소수의 중요 피처가 신호를 강하게 가지는 문제에서 강력

주의할 점  
learning\_rate가 크면 금방 과적합.  
클래스 불균형은 class\_weight 또는 평가 지표(ROC-AUC/F1)로 관리

**ColumnTransformer**

서로 다른 컬럼(숫자/범주/날짜 등)에 서로 다른 전처리기를 한 번에 적용해 주는 scikit-learn 유틸리티  
◼ 파이프라인(Pipeline)과 함께 쓰면 “전처리 + 모델”을 깔끔 하게 묶을 수 있음  
◼ 데이터프레임에 숫자열엔 표준화, 문자열엔 원-핫인코딩, 날짜엔 특성 추출처럼 컬럼마다 다른 변환을 적용.  
◼ 변환 순서/대상 컬럼을 고정해서, 학습/검증/배포 단계마다 같은 방식으로 처리

```python
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

preprocess = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), ["age", "fare"]),  # 숫자 컬럼
        ("cat", OneHotEncoder(handle_unknown="ignore"), ["sex", "embarked"]),
        # 범주 컬럼
    ],
    remainder="drop",
    # 지정하지 않은 나머지 컬럼 처리: "drop" or "passthrough"
)

'''
transformers: (이름, 변환기, 대상컬럼) 튜플의 리스트
OneHotEncoder(handle_unknown="ignore") 
• 처음 들어오는 범주 값이 있으면 0으로 채움

remainder
"drop": 나머지 컬럼 버림(기본값)
"passthrough": 나머지 컬럼을 그대로 보냄(모델에 같이 들어감)'''
``````python
SimpleImputer: 전처리 해줌
```

**예시**

```python
# origin을 target
# cylinders을 as type해서 범주형으로 바꿔서(몇개 없기 때문에) df['name'] = df['name'].astype('category')

from sklearn.inspection import permutation_importance
from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.compose import ColumnTransformer, make_column_selector as selector
from sklearn.preprocessing import OneHotEncoder, StandardScaler
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
import pandas as pd
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    roc_auc_score,
    precision_score,
    recall_score,
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

df = sns.load_dataset("mpg")
print(df)
print(df.info())
df["cylinders"] = df["cylinders"].astype("category")
print(df)
print(df.info())

X = df.drop(columns=["origin"])
y = df["origin"]

# 홀드아웃
X_tr, X_te, y_tr, y_te = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y,  # origin이 타깃이라 클래스 비율 맞춤
)

# 전처리 파이프라인
num_selector = selector(dtype_include=["int64", "float64"])
cat_selector = selector(dtype_include=["object", "category"])

num_pipe = Pipeline(
    [
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
    ]
)

cat_pipe = Pipeline(
    [
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
    ]
)

preprocess = ColumnTransformer(
    [
        ("num", num_pipe, num_selector),
        ("cat", cat_pipe, cat_selector),
    ],
    remainder="drop",
)

# 전체 파이프라인
pipe = Pipeline(
    [
        ("preprocess", preprocess),
        (
            "model",
            HistGradientBoostingClassifier(
                early_stopping=False,  # 튜닝 중엔 끄는 게 깔끔
                random_state=42,
            ),
        ),
    ]
)

# 그리드 정의
param_grid = {
    "model__learning_rate": [0.03, 0.05, 0.08, 0.1],
    "model__max_leaf_nodes": [15, 31, 63],
    "model__max_depth": [None, 3, 5],
    "model__l2_regularization": [0.0, 0.01, 0.1, 1.0],
}

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

# 이중 / 다중 스코어 기록, 최종 refit은 ROC-AUC
scoring = {}
print("y_tr.nunique()", y_tr.nunique())  # 3

if y_tr.nunique() == 2:
    # 이진분류
    scoring = {
        "roc_auc": "roc_auc",
        "f1_macro": "f1_macro",
        "accuracy": "accuracy",
    }
    refit_metric = "roc_auc"
else:
    # 다중분류
    scoring = {
        "roc_auc_ovr": "roc_auc_ovr",
        "f1_macro": "f1_macro",
        "accuracy": "accuracy",
    }

# origin은 다중분류라서 roc_auc는 ovr로
search = GridSearchCV(
    estimator=pipe,
    param_grid=param_grid,
    scoring=scoring,
    refit="roc_auc_ovr",
    cv=cv,
    n_jobs=-1,
    verbose=1,
)

# 학습
search.fit(X_tr, y_tr)

print("Best params:", search.best_params_)
print("Best CV roc_auc_ovr:", search.best_score_)

# 테스트 평가
best_est = search.best_estimator_
best_model = best_est.named_steps["model"]
y_proba = best_est.predict_proba(X_te)
y_pred = best_est.predict(X_te)

print("\n[Test]")

acc = accuracy_score(y_te, y_pred)  # 정확도
prec = precision_score(y_te, y_pred, average="macro")  # 정밀도
rec = recall_score(y_te, y_pred, average="macro")  # 재현율
f1 = f1_score(y_te, y_pred, average="macro")
auc = roc_auc_score(y_te, y_proba, multi_class="ovr")

print("Accuracy: ", acc)
print("prec", prec)
print("rec", rec)
print("F1 (macro): ", f1)
print("ROC-AUC (ovr): ", auc)
print("\nClassification report\n", classification_report(y_te, y_pred, digits=3))

metrics = {
    "Accuracy": acc,
    "Precision": prec,
    "Recall": rec,
    "F1-score": f1,
    "ROC-AUC": auc,
}

# DataFrame 변환
df_metrics = pd.DataFrame(list(metrics.items()), columns=["Metric", "Score"])

# 모델 성능 지표 그래프
plt.figure(figsize=(6, 4))
sns.barplot(data=df_metrics, x="Score", y="Metric", palette="crest")
plt.title("모델 성능 지표")
plt.xlim(0, 1.05)
plt.xlabel("Score")
plt.ylabel("Metric")
plt.tight_layout()
plt.show()

# 전처리 후 피처 이름 가져오기
preprocess_fitted = best_est.named_steps["preprocess"]
feature_names = []

for name, trans, cols in preprocess_fitted.transformers_:
    if name == "remainder":
        continue
    if cols is None or len(cols) == 0:
        continue
    if hasattr(trans, "named_steps"):
        last_step = list(trans.named_steps.values())[-1]
        if hasattr(last_step, "get_feature_names_out"):
            feature_names.extend(last_step.get_feature_names_out(cols))
        else:
            feature_names.extend(cols)
    else:
        if hasattr(trans, "get_feature_names_out"):
            feature_names.extend(trans.get_feature_names_out(cols))
        else:
            feature_names.extend(cols)

feature_names = np.array(feature_names)

# permutation importance
X_te_transformed = preprocess_fitted.transform(X_te)
perm = permutation_importance(
    best_model,
    X_te_transformed,
    y_te,
    scoring="roc_auc_ovr",
    n_repeats=20,
    random_state=42,
    n_jobs=-1,
)

imp_mean = perm.importances_mean
imp_std = perm.importances_std

# 시리즈로 정리
mda_df = pd.Series(perm.importances_mean, index=feature_names).sort_values(
    ascending=False
)

print("\n[Permutation importance top 10]")
print(mda_df.head(10))

# 순열 중요도
plt.figure(figsize=(7, 5))
top_n = 10
plt.barh(
    mda_df.head(top_n).index[::-1],
    mda_df.head(top_n).values[::-1],
)
plt.title("MDA (Permutation Importance) - mpg")
plt.xlabel("Importance (roc_auc_ovr 감소)")
plt.tight_layout()
plt.show()

# 성능 지표에서는 Recall값이 0.72로 약간 놓치는 양성이 있음
# displacement가 0.38로 지대한 영향을 미치고 그 다음은 horsepower인데 0.04로 큰 영향을 미치지 않음
```
