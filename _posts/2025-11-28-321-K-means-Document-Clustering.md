---
title: "K-means Document Clustering"
date: 2025-11-28 17:46:32 +0900
render_with_liquid: false
categories: ["데이터 분석", "머신러닝, 딥러닝"]
---

## 1. K-means 문서 군집화란?

데이터를 $k$개의 그룹(클러스터)으로 나누는 대표적인 비지도 학습 알고리즘입니다. 텍스트 분석에서는 주로 TF-IDF 등으로 벡터화된 문서들이 주어졌을 때, 내용이 비슷한 문서끼리 같은 그룹으로 묶는 데 사용됩니다.

주요 과정

* 임의의 중심(centroid) k개를 설정합니다.
* 모든 데이터를 가장 가까운 중심에 배정합니다.
* 군집 내 데이터들의 평균을 구해 중심을 새롭게 이동합니다.
* 중심의 위치가 변하지 않을 때까지 위 과정을 반복합니다.

활용 예시

* 배송 불만 리뷰, 가격 만족 리뷰 등을 자동으로 분류할 때 사용합니다.
* sklearn 라이브러리의 KMeans 클래스를 사용하여 구현하며, n\_clusters (군집 개수) 설정이 필수적입니다.

```python
kmeans = KMeans(
    n_clusters=k,
    random_state=42,
    n_init="auto" # 최신 sklearn에서 권장 )
```

---

## 2. 최적의 군집 개수(K) 결정 방법

### A. 엘보우 기법 (Elbow Method)

군집 내 오차 제곱 합(SSE, inertia)이 줄어드는 추세를 보고 결정하는 방법입니다.

특징

* k가 늘어날수록 SSE는 무조건 작아집니다.
* 하지만 특정 지점부터는 감소 폭이 확 줄어드는데, 그 꺾이는 지점(팔꿈치 모양)을 최적의 k 후보로 봅니다.

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/321/img.png)

### B. 실루엣 계수 (Silhouette Score)

군집화가 얼마나 잘 되었는지를 -1에서 1 사이의 점수로 정량화하는 방법입니다.

특징

* 점수 해석: +1에 가까울수록 자기 군집에 잘 속해 있고 다른 군집과는 잘 분리된 상태입니다. 0은 경계, 음수는 잘못 분류된 상태를 의미합니다.
* 수식: a(i)는 내 군집 내 평균 거리, b(i)는 가장 가까운 타 군집과의 평균 거리일 때 다음과 같습니다.

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/321/img_1.png)

---

## 3. 엘보우 vs 실루엣 비교 및 선택 가이드

두 방법은 상호 보완적으로 사용되며, 상황에 따라 적절한 것을 선택해야 합니다.

엘보우 (Elbow) 추천 상황

* 데이터와 차원이 매우 커서 계산 속도가 중요할 때 유리합니다.
* $k$의 대략적인 범위(예: 3~8 사이)를 빠르게 필터링하고 싶을 때 사용합니다.
* 계산이 가볍지만, 최적점이 눈으로 보기에 애매할 수 있습니다.

실루엣 (Silhouette) 추천 상황

* 데이터 크기가 적당하고, 군집 품질을 숫자로 명확히 증명해야 할 때(보고서, 논문 등) 유리합니다.
* 엘보우 기법으로 k 후보를 좁힌 뒤, 최종적으로 어떤 k가 더 나은지 비교할 때(예: 4, 5, 6 중 선택) 사용합니다.
* 해석이 직관적이지만 계산량이 많습니다

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import KMeans
import numpy as np
import pandas as pd

# --- 1. 데이터 준비 및 설정 ---
# 1) 예제 리뷰 데이터
docs = [
    "배송이 빠르고 포장이 꼼꼼해서 만족합니다",
    "배송이 너무 느리고 포장도 엉망이에요",
    "가격은 저렴한데 품질이 좋아요",
    "가격이 비싼 편이지만 디자인이 예쁩니다",
    "배송도 빠르고 품질도 좋아서 또 구매하고 싶어요",
]
# 2) TF-IDF 벡터화 객체 초기화
# max_df=0.8: 전체 문서의 80% 이상에 나타나는 단어는 제거 (너무 흔한 단어)
# min_df=1: 최소 1개 문서에 나타나는 단어만 사용
# token_pattern: 한글 포함 모든 단어(토큰)를 인식하도록 설정
tfidf = TfidfVectorizer(
    max_df=0.8, min_df=1, token_pattern=r"(?u)\b\w+\b"  # 한글 포함 토큰
)
# 데이터를 학습하고 TF-IDF 행렬 X를 생성 (희소 행렬 형태)
X = tfidf.fit_transform(docs)  # shape: (문서 수, 단어 수)

# --- 2. K-means 모델 학습 ---
k = 2  # 군집 개수 설정
# n_init="auto": 중심 초기화를 여러 번 시도하여 가장 좋은 결과를 선택 (최신 sklearn 권장)
kmeans = KMeans(n_clusters=k, random_state=42, n_init="auto")

# TF-IDF 행렬 X를 이용하여 K-means 모델 학습
kmeans.fit(X)
# 각 문서가 할당된 클러스터 레이블 (0 또는 1)
labels = kmeans.labels_
print("문서별 클러스터 라벨:", labels)

# --- 3. 클러스터링 결과 확인 ---
# 문서와 클러스터 정보를 같이 보기 위해 DataFrame 생성
df_cluster = pd.DataFrame({"doc_id": range(len(docs)), "text": docs, "cluster": labels})

print("\n[문서별 클러스터 할당 결과]")
print(df_cluster)

# 클러스터별 문서 묶어서 출력하여 클러스터링 결과 시각화
for c in range(k):
    print(f"\n=== 클러스터 {c} ===")
    # 현재 클러스터 c에 속하는 문서만 필터링하여 출력
    for text in df_cluster[df_cluster["cluster"] == c]["text"]:
        print("-", text)

# --- 4. 문서 및 클러스터별 대표 키워드 추출 함수 ---
# 단어집 (TF-IDF 벡터라이저의 피처 이름) 먼저 가져오기
feature_names = tfidf.get_feature_names_out()


# 개별 문서의 상위 키워드를 추출하는 함수
def get_top_keywords_for_doc(tfidf_ventor, top_n=5):
    # print(tfidf_ventor.toarray()) # 문서의 전체 TF-IDF 벡터 출력 (주석 처리)
    # 희소 행렬을 넘파이 배열로 변환하고 1차원으로 평탄화
    vec = tfidf_ventor.toarray().flatten()
    # 가중치가 큰 순서대로 인덱스 top_n개를 추출 (음수(-vec)로 변환 후 argsort는 내림차순 효과)
    top_idx = np.argsort(-vec)[:top_n]
    # 키워드 이름과 가중치를 묶어 반환
    return list(zip(feature_names[top_idx], vec[top_idx]))


# 0번 문서의 상위 3개 키워드 추출 및 출력 예시
top_keyword_doc0 = get_top_keywords_for_doc(X[0], top_n=3)
print("\n[0번 문서 대표 키워드]")
for word, score in top_keyword_doc0:
    print(f"{word} : {score:.3f}")


# 클러스터별 대표 키워드를 추출하는 함수 (평균 벡터 사용)
def get_top_keywords_for_cluster(X, labels, cluster_id, top_n=5):
    # 현재 클러스터 ID와 일치하는 문서들을 찾는 마스크 생성
    mask = labels == cluster_id

    # 1. 마스킹된 희소 행렬을 밀집 배열(toarray())로 변환 후
    # 2. 단어 축(axis=0)을 따라 평균을 계산하여 클러스터 대표 벡터를 생성 (안정성 확보)
    cluster_vec = X[mask].toarray().mean(axis=0)

    # 3. 평균 벡터 처리 (넘파이 배열이므로 flatten 해도 무방)
    vec = cluster_vec.flatten()
    # 4. 가중치가 큰 순서대로 인덱스 top_n개를 추출
    top_idx = np.argsort(-vec)[:top_n]

    # 5. 키워드와 평균 가중치를 묶어 반환
    return list(zip(feature_names[top_idx], vec[top_idx]))


# 모든 클러스터에 대해 대표 키워드 추출 및 출력
for c in range(k):
    # 현재 클러스터 c의 상위 3개 대표 키워드를 추출
    top_keywords = get_top_keywords_for_cluster(X, labels, cluster_id=c, top_n=3)
    print(f"\n==== 클러스터 {c} 대표 키워드 ====")
    for word, score in top_keywords:
        print(f"{word} : {score:.3f}")
        
 '''
 문서별 클러스터 라벨: [0 0 1 1 1]

[문서별 클러스터 할당 결과]
   doc_id                        text  cluster
0       0      배송이 빠르고 포장이 꼼꼼해서 만족합니다        0
1       1        배송이 너무 느리고 포장도 엉망이에요        0
2       2            가격은 저렴한데 품질이 좋아요        1
3       3       가격이 비싼 편이지만 디자인이 예쁩니다        1
4       4  배송도 빠르고 품질도 좋아서 또 구매하고 싶어요        1

=== 클러스터 0 ===
- 배송이 빠르고 포장이 꼼꼼해서 만족합니다
- 배송이 너무 느리고 포장도 엉망이에요

=== 클러스터 1 ===
- 가격은 저렴한데 품질이 좋아요
- 가격이 비싼 편이지만 디자인이 예쁩니다
- 배송도 빠르고 품질도 좋아서 또 구매하고 싶어요

[0번 문서 대표 키워드]
포장이 : 0.482
꼼꼼해서 : 0.482
만족합니다 : 0.482

==== 클러스터 0 대표 키워드 ====
배송이 : 0.382
포장이 : 0.241
꼼꼼해서 : 0.241

==== 클러스터 1 대표 키워드 ====
가격은 : 0.167
좋아요 : 0.167
저렴한데 : 0.167'''
```
```python
import re
import numpy as np
import pandas as pd
from konlpy.tag import Okt
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt

# 코드 상단에 추가되어야 할 import 구문
from sklearn.metrics import silhouette_score

df = pd.read_csv(
    r"/Users/choimanseon/Documents/multicampus/example/nlp/stat_nlp/movie_reviews.csv",
    encoding="utf-8",
)
df = df.dropna()
_, df_sample = train_test_split(
    df, test_size=10000, stratify=df["label"], shuffle=True, random_state=42
)
df_sample = df_sample.reset_index(drop=True)
okt = Okt()
with open(
    r"/Users/choimanseon/Documents/multicampus/example/nlp/stat_nlp/stopwords-ko.txt",
    encoding="utf-8",
) as f:
    stopwords = set(w.strip() for w in f if w.strip())
add_stopwords = set(
    [
        "그리고",
        "그래서",
        "하지만",
        "그러나",
        "너무",
        "정말",
        "진짜",
        "조금",
        "또한",
        "그냥",
        "매우",
        "에서",
        "에게",
        "미만",
        "이상",
        "같은",
        "하다",
        "되다",
    ]
)
stopwords.update(add_stopwords)


def preprocess_text(text: str) -> list:
    text = text.lower()
    text = re.sub(r"[^0-9a-zA-Z가-힣\s]", " ", text)
    morphs = okt.pos(text, stem=True)
    tokens = []
    for word, tag in morphs:
        if tag in ["Noun", "Verb", "Adjective"]:
            if word not in stopwords and len(word) > 1:
                tokens.append(word)
    return tokens


TEXT_COL = "document"

tfidf = TfidfVectorizer(
    max_df=0.8, min_df=1, token_pattern=None, tokenizer=preprocess_text
)

X_tfidf = tfidf.fit_transform(df_sample[TEXT_COL])

inertias = []

#! 엘보우
for k in range(1, 11):
    kmeans = KMeans(n_clusters=k, random_state=42, n_init="auto")

    kmeans.fit(X_tfidf)
    inertias.append(kmeans.inertia_)
plt.plot(range(1, 11), inertias, marker="o")
plt.xlabel("k 클러스터 수")
plt.ylabel("Inertia (SSE)")
plt.title("Elbow Method")
plt.show()

#! 실루엣
k_range = range(2, 11)
sil_scores = []
for k in k_range:
    kmeans = KMeans(n_clusters=k, random_state=42, n_init="auto")

    labels = kmeans.fit_predict(X_tfidf)
    score = silhouette_score(X_tfidf, labels)
    sil_scores.append(score)
    print(f"k={k}, silhouette_score = {score:.3f}")

plt.plot(k_range, sil_scores, marker="o")
plt.xlabel("k cluster count")
plt.ylabel("Silhouette Score")
plt.title("Silhouette Method")
plt.show()
```

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/321/img_2.png)

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/321/img_3.png)
