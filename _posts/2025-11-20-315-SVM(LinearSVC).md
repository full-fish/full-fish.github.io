---
title: "SVM(LinearSVC)"
date: 2025-11-20 16:02:04 +0900
render_with_liquid: false
---

**SVM(Support Vector Machine)**  
서로 다른 두 클래스(예: 긍정 vs 부정)를 가장 잘 분리할 수 있는 선(또는 초평면)을 찾는 모델.  
목표는 두 클래스 사이의 간격(margin)을 최대화하는 결정 경계를 만드는 것.

**Margin(마진)**  
결정 경계 양쪽에 생기는 여유 공간을 의미.  
마진이 넓을수록 모델은  
데이터 노이즈에 강하고  
일반화 성능이 좋아짐.

**Support Vectors**  
마진에 가장 가깝게 위치한 점들.  
이 점들이 실제로 결정 경계를 만드는 핵심 역할을 함.  
전체 데이터 중 극히 일부만 경계에 영향을 줌.

**텍스트(TF-IDF)에서 SVM이 잘 맞는 이유**  
텍스트 벡터(TF-IDF)는 차원이 수천~수만으로 매우 큼.  
고차원 공간에서는 서로 다른 클래스를 선형(직선 또는 초평면)으로 분리하기가 쉬워짐.  
그래서 선형 SVM(LinearSVC)이 텍스트 분류에서 높은 성능을 보임.

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/315/img.png)

**그림 설명**  
가운데 실선이 두 클래스를 나누는 결정 경계.  
양옆 점선은 마진.  
SVM은 이 마진을 가능한 크게 만드는 방향으로 결정 경계를 조정하여 분류함.

**LinearSVC**  
텍스트 분류에서 가장 많이 쓰이는 SVM 모델.  
차원이 매우 큰 데이터(TF-IDF처럼 수천∼수만 차원)에 최적화되어 있어서 빠르고 안정적으로 동작함.  
확률 기반 모델이 아니라 결정 경계만 계산하므로 predict\_proba 기능이 없음.

**SVC(kernel="linear")**  
같은 선형 SVM이지만 내부 구현이 조금 다름.  
데이터가 작거나 조금 더 복잡한 경우에는 더 정확한 결과를 내기도 하지만, 속도가 훨씬 느림.  
probability=True로 설정하면 확률 출력이 가능하지만, 연산이 더 무거워지고 학습 시간이 길어짐.

**LogisticRegression**  
선형 모델에 시그모이드(또는 소프트맥스)를 사용하는 확률 기반 분류 모델.  
predict\_proba 제공 → 문장이 “긍정 확률 몇 %”인지 바로 계산 가능.  
속도가 빠르고 해석이 쉬워서 텍스트 분류에서도 많이 사용됨.

**텍스트 분류에서 보통 어떤 조합을 쓰는가**  
TF-IDF + LinearSVC 조합이 정확도, 속도 모두 가장 우수해서 실전에서 가장 많이 사용됨.

**Accuracy의 한계**

Accuracy는 전체 데이터 중에서 모델이 정답을 맞춘 비율을 의미함.  
겉보기에는 높은 Accuracy가 좋아 보이지만, **클래스 비율이 불균형할 때는 매우 위험한 지표**가 됨.

예를 들어 전체 리뷰 중 95%가 긍정, 5%만 부정이라고 가정하면  
모델이 그냥 모든 리뷰를 “긍정”이라고만 예측해도 Accuracy는 95%가 되어버림.  
즉, 실제로는 전혀 분류를 못해도 높은 Accuracy가 나올 수 있는 상황.

이 때문에 텍스트 감성 분류 같이 **불균형 데이터가 자주 등장하는 문제**에서는  
Accuracy만 보지 않고 Precision, Recall, F1-score 같은 세부 지표가 훨씬 중요해짐.

**Precision, Recall, F1**

Precision(정밀도)은 모델이 “긍정”이라고 예측한 것 중에서 실제 긍정 비율을 의미함.  
즉, 예측한 것의 정확도를 본다고 이해하면 됨.

Recall(재현율)은 실제 긍정 중에서 모델이 긍정이라 판단한 비율을 의미함.  
즉, 놓치지 않고 잘 찾아내는 능력을 측정함.

F1-score는 Precision과 Recall의 조화 평균이며, 두 값이 균형 있게 높아졌는지를 판단하는 지표.  
특히 불균형 데이터에서 많이 사용됨.

**Macro-F1**

클래스 0과 클래스 1 각각에 대해 F1-score를 구하고, 단순 평균을 내는 방식.  
모든 클래스를 **동등하게** 취급한다는 점이 특징.

클래스 수가 여러 개일 때도 활용 가능하고, 특정 클래스(예: 부정 리뷰)가 매우 적더라도  
그 적은 클래스의 성능도 동일하게 중요하게 평가하기 때문에  
불균형 데이터 상황에서 가장 권장되는 지표 중 하나임.

예를 들어  
브랜드 평판(긍정/부정), 리뷰 만족도(만족/보통/불만)처럼  
소수 클래스가 중요한 문제에서 Macro-F1은 좋은 평가 기준이 됨.

```python
from sklearn.svm import LinearSVC  # 선형 SVM 분류기(확률 출력 X)
from sklearn.calibration import (
    CalibratedClassifierCV,
)  # SVM 결과를 확률로 보정해 주는 래퍼
from sklearn.pipeline import Pipeline  # 여러 전처리/모델을 순차적으로 묶는 도구
from sklearn.metrics import (
    classification_report,
)  # 분류 리포트(precision, recall, f1 등) 출력
from sklearn.model_selection import (
    train_test_split,
    GridSearchCV,
)  # 데이터 분할과 하이퍼파라미터 탐색
from sklearn.feature_extraction.text import (
    TfidfVectorizer,
)  # 텍스트를 TF-IDF 벡터로 변환
import pandas as pd  # 데이터프레임 처리용 라이브러리
import numpy as np  # 수치 연산용 라이브러리

# 영화 리뷰 데이터 CSV 파일 읽기
df = pd.read_csv(
    "/Users/choimanseon/Documents/multicampus/example/nlp/stat_nlp/text_preprocess/movie_reviews.csv",
    header=0,  # 첫 줄을 헤더로 간주
    names=["id", "review", "label"],  # 컬럼 이름 강제 지정
)

df = df.dropna()  # 결측값(NA) 포함된 행 제거

# label 컬럼을 정수형으로 강제 변환 (0, 1 레이블을 확실히 정수로 맞춰 줌)
df["label"] = df["label"].astype(int)

print(df.head())  # 데이터 상위 5개 행 출력
# print(df["label"].value_counts())                        # 레이블 개수 확인 (필요시만 사용)
print(df["label"].value_counts(normalize=True))  # 레이블 비율 확인(정규화=True)

# 2. 전체 데이터에서 층화추출(stratify)로 샘플 10000개 추출
_, df_sample = train_test_split(
    df,
    test_size=10000,  # 총 데이터 중 10000개를 샘플로 사용
    stratify=df["label"],  # 레이블 비율을 유지하면서 분할
    shuffle=True,  # 섞어서 추출 (기본값이긴 함)
    random_state=42,  # 재현 가능한 결과를 위한 시드 고정
)

print(len(df_sample))  # 샘플 데이터 크기(10000) 출력
print(len(_))  # 나머지 데이터 크기 출력

X = df_sample["review"]  # 입력 텍스트(리뷰)
y = df_sample["label"]  # 정답 레이블(0/1)

# 3. 샘플 10000개를 다시 train/test로 분할
x_train, x_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,  # 전체 중 20퍼센트를 테스트 셋으로 사용
    stratify=y,  # 샘플 내부에서도 레이블 비율 유지
    shuffle=True,  # 섞어서 분할
    random_state=42,  # 시드 고정
)

# 기본 LinearSVC 모델 정의 (확률은 못 내지만 속도가 빠른 선형 SVM)
base_svm = LinearSVC()

# TF-IDF + LinearSVC를 하나의 파이프라인으로 묶기
svm_clf = Pipeline(
    steps=[
        ("tfidf", TfidfVectorizer()),  # 1단계: 문장을 TF-IDF 벡터로 변환
        ("svm", base_svm),  # 2단계: 선형 SVM으로 분류
    ]
)

# 기본 모델 학습
svm_clf.fit(x_train, y_train)

# 기본 모델로 테스트 데이터 예측
y_pred_svm = svm_clf.predict(x_test)

print("== 기본 LinearSVC 분류 리포트 ==")
print(classification_report(y_test, y_pred_svm))  # precision/recall/f1 출력

# GridSearch에서 탐색할 하이퍼파라미터 설정
param_grid = {
    "tfidf__ngram_range": [(1, 1), (1, 2)],  # 유니그램만 vs 유니그램+바이그램
    "tfidf__min_df": [2, 5],  # 최소 등장 문서 수 (희귀 단어 제거 기준)
    "svm__C": [0.1, 1.0, 10.0],  # SVM 규제 강도(C), 클수록 과적합 경향
}

# GridSearchCV로 하이퍼파라미터 탐색 (기본 LinearSVC 파이프라인 대상)
gs = GridSearchCV(
    svm_clf,  # 탐색 대상 모델(파이프라인)
    param_grid=param_grid,  # 탐색할 하이퍼파라미터 그리드
    scoring="f1_macro",  # 클래스 불균형 고려한 매크로 f1 사용
    cv=3,  # 3겹 교차검증
    refit=True,  # 최고 성능 모델로 다시 전체 학습
    n_jobs=-1,  # 가능한 모든 코어 사용
)

# 하이퍼파라미터 탐색 + 학습 수행
gs.fit(x_train, y_train)

print("Best params : ", gs.best_params_)  # 최적 하이퍼파라미터 출력
print("Best macro-f1 : ", gs.best_score_)  # 교차검증에서의 최고 f1-macro

# 최적 하이퍼파라미터로 다시 학습된 파이프라인
best_model = gs.best_estimator_

# 최적 모델로 테스트셋 예측
y_pred = best_model.predict(x_test)

print("== 하이퍼파라미터 튜닝 LinearSVC 분류 리포트 ==")
print(classification_report(y_test, y_pred, digits=3))  # 소수점 3자리까지 리포트

# TF-IDF 벡터라이저와 SVM 분류기 객체 꺼내기
tfidf = best_model.named_steps["tfidf"]  # 파이프라인에서 'tfidf' 단계
clf = best_model.named_steps["svm"]  # 파이프라인에서 'svm' 단계(LinearSVC)

# TF-IDF에서 단어(특징) 이름 배열 가져오기
feature_names = np.array(tfidf.get_feature_names_out())

# LinearSVC의 가중치(coef_) (이진 분류에서는 shape가 (1, n_features))
coef = clf.coef_

# 긍정 클래스(1)에 강하게 기여하는 상위 10개 단어 인덱스 (가중치 큰 순서)
top10_pos = coef[0].argsort()[-10:]

print("== 긍정에 강하게 기여하는 단어 ==")
print(feature_names[top10_pos])  # 인덱스를 단어로 변환해 출력

# 부정 클래스(0)에 강하게 기여하는 상위 10개 단어 인덱스 (가중치 작은 순서)
top10_neg = coef[0].argsort()[:10]

print("== 부정에 강하게 기여하는 단어 ==")
print(feature_names[top10_neg])  # 인덱스를 단어로 변환해 출력

# ==========================
# 여기부터: 확률 예측을 위한 보정된 SVM 파이프라인
# ==========================

# GridSearch에서 찾은 최적 C 값 가져오기
best_C = clf.C  # best_model의 LinearSVC가 가진 C

# 보정용 파이프라인: 같은 TF-IDF 설정 + CalibratedClassifierCV(LinearSVC)
calibrated_clf = Pipeline(
    steps=[
        (
            "tfidf",
            TfidfVectorizer(
                ngram_range=gs.best_params_["tfidf__ngram_range"],
                min_df=gs.best_params_["tfidf__min_df"],
            ),
        ),
        (
            "svm",
            CalibratedClassifierCV(
                estimator=LinearSVC(C=best_C),  # base_estimator → estimator 로 변경
                cv=3,
                method="sigmoid",
            ),
        ),
    ]
)


# 보정된 파이프라인 학습 (train 데이터 전체 사용)
calibrated_clf.fit(x_train, y_train)

# 확률 예측: 각 샘플에 대해 [부정 확률, 긍정 확률] 반환
probas = calibrated_clf.predict_proba(
    ["지루하고 재미 없었다", "배우의 연기가 영화를 살렸다"]
)

print("== 확률 예측 결과 ==")
print(probas)  # 2행 2열 배열: 각 문장에 대한 클래스별 확률
```

실습

```python
"""
# 텍스트 분류 실습 과제 노트북

## 과제 목표

하나의 텍스트 데이터셋(예: 리뷰, 댓글, SNS 글 등)에 대해

1. 텍스트 데이터를 로드하고 간단한 EDA(탐색적 데이터 분석)를 수행한다.
2. TF-IDF 벡터화를 적용하고,
3. 세 가지 모델을 학습 및 비교한다.
   - 로지스틱 회귀 (`LogisticRegression`)
   - 나이브 베이즈 (`MultinomialNB`)
   - 선형 SVM (`LinearSVC`)
4. 평가지표(특히 macro-F1)를 기준으로 모델 성능을 비교·분석한다.
5. 간단한 보고서(요약 문장)를 마크다운으로 정리한다.

---

>
"""

import re
import numpy as np
import pandas as pd

# import matplotlib.pyplot as plt
# import seaborn as sns
from konlpy.tag import Okt

okt = Okt()
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import LinearSVC
from sklearn.metrics import classification_report, f1_score

# plt.rcParams["font.family"] = "Malgun Gothic"
# plt.rcParams["axes.unicode_minus"] = False

print("라이브러리 임포트 완료")

"""
## 1. 데이터 불러오기 및 전처리

### 1-1. CSV 파일 불러오기


"""
df = pd.read_csv("stat_nlp/naive_bayes_svm/movie_reviews.csv")
print(df.head())

# 불용어
with open(
    "stat_nlp/stopwords-ko.txt",
    encoding="utf-8",
) as f:
    stopwords = set(w.strip() for w in f if w.strip())

"""### 1-2. 간단 EDA

- 데이터 크기 확인 (`df.shape`)
- 레이블 분포 확인 (`value_counts()`)
- 결측값 여부 확인 (`isna().sum()`)
"""
print("데이터 크기:", df.shape)

print("\n레이블 분포:")
print(df["label"].value_counts())  # 각각 10만개

print("\n결측값 개수:")
print(df.isna().sum())
df.dropna(inplace=True)

print("\n결측값 개수:")
print(df.isna().sum())

print("\n레이블 분포:")
print(df["label"].value_counts())  # 각각 99996개


# 너무 오래 걸려서 층화추출
df_sample, _ = train_test_split(
    df,
    train_size=20000,
    stratify=df["label"],
    shuffle=True,
    random_state=42,
)
print(df_sample["label"].value_counts())  # 각각 10000개
"""
1-3. 데이터 전처리(함수로 구현)


*   정제 및 정규화(정규식사용), 어간/표제어처리, 불용어 제거
"""
okt = Okt()
possible_pos = ["Noun", "Verb", "Adjective"]


def preprocess(text):
    str_reg = re.sub(r"[^가-힝0-9a-zA-Z\s]", "", text).lower()
    pos = okt.pos(str_reg, norm=True, stem=True, join=True)
    pos = [word.split("/") for word in pos]
    filtered_pos = [
        word
        for word, tag in pos
        if word and word not in stopwords and tag in possible_pos
    ]
    return filtered_pos


"""
## 2. 학습/테스트 데이터 분리

- `train_test_split`으로 데이터를 분리
- 가능하면 `stratify=df["label"]` 옵션을 사용해 **레이블 비율을 유지**
"""
X = df_sample["document"]
y = df_sample["label"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

vectorizer = TfidfVectorizer(
    tokenizer=preprocess,
    token_pattern=None,
    ngram_range=(1, 2),
    min_df=2,
)

X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)

"""
## 3. 공통 함수: 모델 학습평가

- TF-IDF + 분류기를 하나의 `Pipeline`으로 묶어서 사용
- `classification_report`와 `macro-F1` 점수를 함께 출력
"""


def get_score(clf, name):

    clf.fit(X_train_tfidf, y_train)
    y_pred = clf.predict(X_test_tfidf)

    print(f"\n===== {name} =====")
    print(classification_report(y_test, y_pred))

    macro_f1 = f1_score(y_test, y_pred, average="macro")
    print(f"Macro-F1: {macro_f1:.4f}")

    return macro_f1


"""## 4. 모델별 학습 & 평가

세 가지 모델을 모두 학습해 보고 성능을 비교

1. 로지스틱 회귀 (`LogisticRegression`)
2. 나이브 베이즈 (`MultinomialNB`)
3. LinearSVC (`LinearSVC`)
"""
results = {}

log_clf = LogisticRegression(max_iter=1000)
log_f1 = get_score(log_clf, "LogisticRegression")
results["LogisticRegression"] = log_f1

nb_clf = MultinomialNB()
nb_f1 = get_score(nb_clf, "MultinomialNB")
results["MultinomialNB"] = nb_f1

svc_clf = LinearSVC()
svc_f1 = get_score(svc_clf, "LinearSVC")
results["LinearSVC"] = svc_f1
print(results)

"""## 5. 성능 비교 표 만들기

세 모델의 macro-F1 점수를 하나의 표로 정리
"""
f1_df = pd.DataFrame(
    {"model": list(results.keys()), "macro_f1": list(results.values())}
)
print("f---1_df---")

print(f1_df)
# MultinomialNB이 제일 좋게 나옴


"""
##5.1 최적 하이퍼파라미터 찾기
# """


def search_best(clf, param_grid, name):
    gs = GridSearchCV(
        estimator=clf,
        param_grid=param_grid,
        scoring="f1_macro",
        cv=3,
        n_jobs=1,
        verbose=1,
    )

    gs.fit(X_train_tfidf, y_train)

    print(f"\n===== {name} GridSearchCV 결과 =====")
    print("최적 하이퍼파라미터:", gs.best_params_)
    print("CV 기준 최고 Macro-F1:", gs.best_score_)

    best_clf = gs.best_estimator_
    y_pred = best_clf.predict(X_test_tfidf)

    print(f"\n===== {name} (best model) 테스트 성능 =====")
    print(classification_report(y_test, y_pred))

    macro_f1 = f1_score(y_test, y_pred, average="macro")
    print(f"테스트 세트 Macro-F1: {macro_f1:.4f}")

    return best_clf, macro_f1, gs.best_params_


best_results = {}
best_models = {}

log_param_grid = {
    "C": [0.1, 1.0, 10.0],
    "class_weight": [None, "balanced"],
}
log_best, log_f1, log_best_params = search_best(
    log_clf, log_param_grid, "LogisticRegression"
)
best_results["LogisticRegression"] = log_f1
best_models["LogisticRegression"] = {
    "model": log_best,
    "params": log_best_params,
}


nb_param_grid = {
    "alpha": [0.1, 0.5, 1.0],
    "fit_prior": [True, False],
}
nb_best, nb_f1, nb_best_params = search_best(nb_clf, nb_param_grid, "MultinomialNB")
best_results["MultinomialNB"] = nb_f1
best_models["MultinomialNB"] = {
    "model": nb_best,
    "params": nb_best_params,
}


svc_param_grid = {
    "C": [0.1, 1.0, 10.0],
}
svc_best, svc_f1, svc_best_params = search_best(svc_clf, svc_param_grid, "LinearSVC")
best_results["LinearSVC"] = svc_f1
best_models["LinearSVC"] = {
    "model": svc_best,
    "params": svc_best_params,
}

print("\n===== 최종 Macro-F1 요약 =====")
for name, score in best_results.items():
    print(f"{name}: {score:.4f}")

"""
### 6. 나이브 베이즈: 클래스별 대표 단어

- `MultinomialNB`의 `feature_log_prob_`를 이용해
- 각 클래스에서 중요한 단어 TOP-N을 뽑기
"""
tfidf_nb = vectorizer
nb_model = best_models["MultinomialNB"]["model"]

feature_names = np.array(tfidf_nb.get_feature_names_out())
top_n = 15

for i, class_label in enumerate(nb_model.classes_):
    class_log_prob = nb_model.feature_log_prob_[i]
    top_indices = class_log_prob.argsort()[-top_n:]
    print(
        f"\n클래스 {class_label} {'긍정' if class_label else '부정'} 대표 단어 TOP-{top_n}"
    )
    print(feature_names[top_indices])
"""
### 7. LinearSVC: 단어 가중치 분석

- `coef_`를 이용해 각 단어가 어떤 클래스로 기울게 만드는지 확인

"""
tfidf_svc = vectorizer
svc_model = best_models["LinearSVC"]["model"]

feature_names = np.array(tfidf_svc.get_feature_names_out())


coef = svc_model.coef_[0]

top_pos_idx = coef.argsort()[-top_n:]
top_neg_idx = coef.argsort()[:top_n]

print(f"\n[LinearSVC] 긍정(+) 방향으로 강하게 기여하는 단어 TOP-{top_n}")
print(feature_names[top_pos_idx])

print(f"\n[LinearSVC] 부정(-) 방향으로 강하게 기여하는 단어 TOP-{top_n}")
print(feature_names[top_neg_idx])
```
