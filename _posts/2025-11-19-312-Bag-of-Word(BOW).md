---
title: "Bag-of-Word(BOW)"
date: 2025-11-19 13:04:26 +0900
render_with_liquid: false
categories: ["데이터 분석", "머신러닝, 딥러닝"]
---

코퍼스(corpus)  
 문서들의 묶음 (전체 데이터)

문서(document)  
 한 개의 글 (한 줄 리뷰, 기사 하나 등)

단어(토큰, token)  
 공백이나 규칙으로 나눈 최소 단위

어휘집(vocabulary)  
 코퍼스에서 등장한 단어들의 집합 (중복 제거)

**Bag-of-Words(BOW)**

문장을 문법과 순서는 무시하고, 단어가 몇 번 나왔는지만 세는 방식

예  
 문서1: "오늘 날씨 정말 좋다"  
 문서2: "오늘 기분 정말 좋다"  
 전체 단어집(vocab): [오늘, 날씨, 정말, 좋다, 기분]  
 BoW 벡터  
  문서1: [1, 1, 1, 1, 0]  
  문서2: [1, 0, 1, 1, 1]

장점  
 단순, 빠름, 기본적인 ML 모델에 바로 넣기 좋음

단점  
 단어 순서 정보가 사라짐  
 문서가 길어질수록 큰 벡터, 희소(sparse)함  
 아주 중요한 단어 vs 자주 나오는 불용어 구분 어려움 → TF-IDF로 개선

**백터 만들기**

```python
import numpy as np

docs = ["오늘 날씨 정말 좋다", "오늘 기분 정말 좋다", "오늘은 기분이 좋지 않다"]
# 1) 공백 기준 토큰화
tokenized_docs = [doc.split() for doc in docs]
print("tokenized_docs", tokenized_docs)
# [['오늘', '날씨', '정말', '좋다'], ...]
# 2) 전체 단어집(어휘집) 만들기
vocab = sorted({word for doc in tokenized_docs for word in doc})
print("vocab:", vocab)
# 3) 단어 → 인덱스 매핑
word_to_idx = {word: i for i, word in enumerate(vocab)}
print("word_to_idx", word_to_idx)

bow_vectors = []

for doc in tokenized_docs:
    vec = np.zeros(len(vocab), dtype=int)  # [0,0,0,0,0,0,0,0,0]
    for word in doc:
        idx = word_to_idx[word]
        vec[idx] += 1
    bow_vectors.append(vec)
print("bow_vectors", bow_vectors)

'''
tokenized_docs [['오늘', '날씨', '정말', '좋다'], ['오늘', '기분', '정말', '좋다'], ['오늘은', '기분이', '좋지', '않다']]
vocab: ['기분', '기분이', '날씨', '않다', '오늘', '오늘은', '정말', '좋다', '좋지']
word_to_idx {'기분': 0, '기분이': 1, '날씨': 2, '않다': 3, '오늘': 4, '오늘은': 5, '정말': 6, '좋다': 7, '좋지': 8}
bow_vectors [array([0, 0, 1, 0, 1, 0, 1, 1, 0]), array([1, 0, 0, 0, 1, 0, 1, 1, 0]), array([0, 1, 0, 1, 0, 1, 0, 0, 1])]'''
```

**CountVectorizer**

```python
vectorizer = CountVectorizer(
    max_features=1000,  # 단어 수 상한
    min_df=2,  # 최소 2개 문서에 등장한 단어만 사용
    stop_words=["오늘", "정말"],  # 제거할 단어들
)

예시
from sklearn.feature_extraction.text import CountVectorizer

docs = ["오늘 날씨 정말 좋다", "오늘 기분 정말 좋다", "오늘은 기분이 좋지 않다"]
# 기본 설정: 공백 기준 토큰화, 소문자 변환(영문 기준)
vectorizer = CountVectorizer()

X = vectorizer.fit_transform(docs)  # 희소행렬(sparse matrix)
print("X.shape", X.shape)  # (문서 수, 단어 수)
print("X", X)

# 단어집(어휘) 확인
print(vectorizer.get_feature_names_out())

# 희소행렬 → 밀집행렬로 보기
print(X.toarray())

'''
X.shape (3, 9)
X <Compressed Sparse Row sparse matrix of dtype 'int64'
        with 12 stored elements and shape (3, 9)>
  Coords        Values
  (0, 4)        1
  (0, 2)        1
  (0, 6)        1
  (0, 7)        1
  (1, 4)        1
  (1, 6)        1
  (1, 7)        1
  (1, 0)        1
  (2, 5)        1
  (2, 1)        1
  (2, 8)        1
  (2, 3)        1
['기분' '기분이' '날씨' '않다' '오늘' '오늘은' '정말' '좋다' '좋지']
[[0 0 1 0 1 0 1 1 0]
 [1 0 0 0 1 0 1 1 0]
 [0 1 0 1 0 1 0 0 1]]'''
```

속성명                                                                           설명                                                                     예시 출력

|  |  |  |
| --- | --- | --- |
| vocabulary\_ | 단어 → 인덱스 매핑 딕셔너리 | {'오늘': 0, '날씨': 1, '좋다': 2} |
| stop\_words\_ | 내부에서 제거된 불용어 목록 (제거된 단어가 있을 경우) | {'the', 'is', 'and'} |
| feature\_names\_out\_ (get\_feature\_names\_out()로 호출) | 인덱스 순서대로 정렬된 단어 리스트 | ['날씨', '오늘', '좋다'] |
| fixed\_vocabulary\_ | 사용자가 직접 vocabulary 지정 시 True | False |
| dtype | 단어 빈도 행렬의 데이터 타입 | <class 'numpy.int64'> |
| ngram\_range | n-gram 범위 | (1, 1) (기본값: unigram) |
| analyzer | 분석 단위 (word / char 등) | 'word' |
| max\_features | 사용할 최대 단어 개수 (None이면 전체 사용) | None |
| lowercase | 영문을 소문자로 변환할지 여부 | True |
| token\_pattern | 토큰 추출 정규식 | '(?u)\\b\\w\\w+\\b' |

**n-gram**

* n개의 단어를 하나의 묶음으로 보는 방식
* 예시 문장: “오늘 날씨 정말 좋다”
  + **1-gram (unigram)**: ['오늘', '날씨', '정말', '좋다']
  + **2-gram (bigram)**: ['오늘 날씨', '날씨 정말', '정말 좋다']
* 순서와 인접 단어를 함께 봄으로써, 간단한 문맥 정보를 반영할 수 있음
  + 예: “좋지 않다” → “좋지”, “않다”가 함께 있을 때 ‘부정’ 의미를 포착  
    → bigram으로 “좋지 않다”를 하나의 패턴으로 인식 가능

**window**

* 중심 단어 주변의 단어를 보는 범위
* 예: window = 2
  + “오늘 날씨 정말 좋다”에서 중심 단어 “날씨”의 이웃 단어: ["오늘", "정말"]
* Word2Vec 같은 임베딩 모델에서 **중심 단어 주변(window)의 단어들을 보고 학습**함 (deep learning 기반)

**n\_gram 예제**

```python
from sklearn.feature_extraction.text import CountVectorizer

docs = ["오늘 날씨 정말 좋다", "오늘 기분 정말 좋다", "오늘은 기분이 좋지 않다"]
# 1) unigram
cv_uni = CountVectorizer(ngram_range=(1, 1))
X_uni = cv_uni.fit_transform(docs)

print("unigram vocab:", cv_uni.get_feature_names_out())
print(X_uni.toarray())
# 2) bigram
cv_bi = CountVectorizer(ngram_range=(2, 2))
X_bi = cv_bi.fit_transform(docs)
print("bigram vocab:", cv_bi.get_feature_names_out())
print(X_bi.toarray())
# 3) uni+bi 같이
cv_uni_bi = CountVectorizer(ngram_range=(1, 2))
X_uni_bi = cv_uni_bi.fit_transform(docs)
print("uni+bi vocab:", cv_uni_bi.get_feature_names_out())
print(X_uni_bi.toarray())

'''
unigram vocab: ['기분' '기분이' '날씨' '않다' '오늘' '오늘은' '정말' '좋다' '좋지']
[[0 0 1 0 1 0 1 1 0]
 [1 0 0 0 1 0 1 1 0]
 [0 1 0 1 0 1 0 0 1]]
bigram vocab: ['기분 정말' '기분이 좋지' '날씨 정말' '오늘 기분' '오늘 날씨' '오늘은 기분이' '정말 좋다' '좋지 않다']
[[0 0 1 0 1 0 1 0]
 [1 0 0 1 0 0 1 0]
 [0 1 0 0 0 1 0 1]]
uni+bi vocab: ['기분' '기분 정말' '기분이' '기분이 좋지' '날씨' '날씨 정말' '않다' '오늘' '오늘 기분' '오늘 날씨' '오늘은'
 '오늘은 기분이' '정말' '정말 좋다' '좋다' '좋지' '좋지 않다']
[[0 0 0 0 1 1 0 1 0 1 0 0 1 1 1 0 0]
 [1 1 0 0 0 0 0 1 1 0 0 0 1 1 1 0 0]
 [0 0 1 1 0 0 1 0 0 0 1 1 0 0 0 1 1]]'''
```
