---
title: "LSA (Latent Semantic Analysis)"
date: 2025-11-26 11:26:01 +0900
render_with_liquid: false
categories: ["데이터 분석", "머신러닝, 딥러닝"]
---

## LSA (Latent Semantic Analysis, 잠재 의미 분석)

LSA는 수많은 문서와 단어 속에 숨겨진 \*\*"잠재적인 의미 구조(Latent Semantic Structure)"\*\*를 찾아내기 위한 자연어 처리 기법입니다.

### 1.  작동 방식: 차원 축소

LSA는 다음과 같은 과정을 통해 작동합니다.

#### 1. 입력 (Input)

* **거대한 표(TF-IDF 행렬)**: 분석 대상이 되는 문서들을 행(Row)으로, 그 문서들에 나타난 모든 단어들을 열(Column)로 구성한 행렬을 사용합니다. 행렬의 각 칸은 해당 단어가 문서에 얼마나 중요한지를 나타내는 **TF-IDF(Term Frequency-Inverse Document Frequency)** 값을 가집니다.
  + **입력**: **문서 $\times$ 단어 TF-IDF 행렬**

#### 2. 핵심 과정 (SVD 적용)

* LSA는 이 거대한 TF-IDF 행렬에 \*\*SVD (Singular Value Decomposition, 특잇값 분해)\*\*라는 수학적 기법을 적용합니다.
* SVD를 통해 원래의 거대한 행렬을 \*\*몇 개의 숨겨진 의미 축(토픽)\*\*으로 **차원을 축소**합니다.

#### 3. 출력 (Output)

SVD를 통해 분해된 결과는 다음과 같은 정보를 제공하며, 이를 통해 우리는 문서와 단어의 잠재적인 의미를 이해할 수 있습니다.

* **각 토픽(의미 축)을 대표하는 단어 조합**: 각 의미 축(토픽)이 어떤 단어들과 강하게 연결되어 있는지 보여줍니다. 이를 통해 추상적인 **토픽의 내용**을 파악할 수 있습니다.
* **각 문서의 토픽 좌표**: 각 문서가 이 잠재된 의미 공간에서 어떤 좌표(위치)를 가지는지 보여줍니다. 이는 **문서가 어떤 토픽과 얼마나 관련 있는지**를 정량적으로 나타냅니다

**SVD(특이값 분해)**

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/316/img.png)

|  |  |  |  |
| --- | --- | --- | --- |
| **행렬** | **명칭** | **역할** | **포함된 정보** |
|  |  |  |  |
| --- | --- | --- | --- |
| $\mathbf{U}$ | **왼쪽 특이 벡터 행렬** | **출력 공간**의 회전 (또는 반사) | 데이터가 변환된 후의 새로운 축 데이터가 새로운 의미 축에서 어떻게 배치 |
| $\mathbf{V^T}$ | **오른쪽 특이 벡터 행렬** | **입력 공간**의 회전 (또는 반사) | 데이터의 원래 주요 방향 각 단어가 어떤 의미 축에 기여하는지 보여줌 |
| $\mathbf{\Sigma}$ | **특이값 행렬** | **스케일링** (늘리기/줄이기) | 데이터의 **핵심 중요도** (특이값) |

**특이값 (Sigma의 대각 성분)의 의미**

사용자님께서 복사해주신 문구를 **호환 가능한 순수 텍스트 문자열**로 수정하여 다시 설명드립니다.

**Σ 행렬**의 대각선에 있는 값들이 \*\*특이값(Singular Values)\*\*입니다. 이 **특이값**들은 데이터의 각 축(방향)이 **얼마나 중요한 정보**를 담고 있는지를 나타냅니다.

* **특이값**이 클수록 해당 축은 원본 행렬 $A$의 정보를 더 많이 보존하고 있는 **핵심 정보**입니다.

**주요 목적**

SVD는 데이터의 본질적인 구조를 중요도 순으로 분리해내어, 다음과 같은 문제 해결에 활용됩니다.

* **차원 축소**: 특이값이 작은 축(덜 중요한 정보)을 제거하고 중요한 축만 보존하여 데이터의 크기를 줄입니다 (**LSA**에서 사용됨).
* **노이즈 제거**: 데이터의 미세한 노이즈로 간주될 수 있는 작은 특이값들을 걸러냅니다.
* **핵심 구조 파악**: 복잡한 행렬을 단순화하여 데이터가 숨기고 있는 **가장 중요한 특징**을 추출합니다.

# TF-IDF 행렬 + LSA(= SVD 기반 차원 축소) 요약 정리

## 1) **TF-IDF 행렬이란?**

* 문서 수: m
* 단어 수: n
* TF-IDF 행렬 X: 크기 **m × n**
  + 각 문서가 어떤 단어를 얼마나 중요한 단어로 포함하는지 숫자로 표현한 표

---

## 2) **왜 LSA를 쓰나?**

단어도 많고 문서도 많으면  
행렬이 **m × n → 너무 크고 복잡**해짐.

그래서 X를 몇 개의 “숨은 의미 축(= 주제)”으로 요약해주는 방법이 필요함.  
그게 **LSA** (Latent Semantic Analysis).

---

## 3) **LSA = SVD로 의미 공간으로 변환**

LSA는 TF-IDF 행렬 X에 SVD를 적용해  
큰 행렬을 “주제 공간 K차원”으로 축소함:

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/316/img_1.png)

​

각 요소의 의미는:

### ✔ **K : 주제(토픽) 개수**

* 원하는 의미 축의 개수
* 예: 100차원 의미 공간

---

### ✔ **Uₖ : 문서 × K**

* 각 문서가 어떤 주제에 얼마나 관련 있는지
* 즉, **문서의 주제 좌표**

### **Σₖ : K × K**

* 주제(축)마다 중요도
* 큰 값일수록 핵심 의미 축

---

### ✔ **Vₖ : K × 단어**

* 각 주제를 구성하는 단어들의 가중치
* 즉, **주제별 단어 조합**

---

# 한 줄 요약

> **LSA는 TF-IDF 행렬을 SVD로 분해해서  
> 방대한 단어×문서 정보를 적은 수의 ‘주제 K개’로 정리하는 방법.**
>
> Uₖ = 문서의 주제 벡터  
> Σₖ = 주제 중요도  
> Vₖ = 주제를 구성하는 단어 벡터
>
> ### 1. TF-IDF 행렬 (Term-Frequency Inverse Document Frequency Matrix)
>
> * **TF-IDF 행렬 $X$**: \*\*문서(Document)\*\*와 **단어(Term)** 간의 관계를 수치화한 행렬입니다.
>   + **크기**: $m \times n$
>   + $m$: **문서 수**
>   + $n$: **단어 수**
>   + **행렬의 값**: 각 셀은 특정 단어가 특정 문서에서 얼마나 **중요한지**를 나타내는 TF-IDF 값입니다. (자주 등장할수록, 다른 문서에서는 희귀할수록 높음)
>
> ### 2. 단어 $X$ 문서 표를 "주제 공간"으로 바꿔주는 도구 (SVD/LSA)
>
> * **목표**: 단어와 문서가 너무 많아 복잡한 $m \times n$ 차원의 TF-IDF 행렬을, 데이터에 숨겨져 있는 몇 개의 **핵심 주제**를 기반으로 재구성하여 **단순화**하는 것입니다. 이 과정은 **차원 축소**의

## LSA(잠재 의미 분석)를 사용하는 이유

LSA를 사용하는 주된 목적은 **단어 수의 폭증**으로 발생하는 고차원 데이터의 문제점을 해결하고, **잠재된 의미 구조**를 파악하여 데이터 분석의 효율성을 높이는 것입니다.

### 1. 단어 수 폭증의 문제점 (LSA 사용 전)

텍스트 데이터를 분석할 때, 단어의 개수가 늘어나면서 다음과 같은 문제가 발생합니다.

* **고차원 희소 벡터**: 수만 개의 단어가 사용되면 TF-IDF와 같은 행렬이 매우 커지지만(고차원), 대부분의 값이 0인 **희소(Sparse)한 행렬**이 됩니다. 이는 계산 비용을 높입니다.
* **의미 미반영**: **비슷한 의미를 가진 단어**들("배송", "배달", "택배" 등)이 컴퓨터에게는 완전히 **다른 단어**로 취급됩니다. 따라서 "배송"이 포함된 문서와 "택배"가 포함된 문서는 의미적으로 유사해도 벡터 공간에서는 멀리 떨어지게 됩니다.

### 2. LSA를 사용하게 되면

LSA는 SVD(특잇값 분해)를 통해 원본 행렬을 낮은 차원의 **의미 공간**으로 축소하여 위 문제를 해결합니다.

* **의미 기반 좌표 조정**: "배송", "배달", "택배"와 같이 **비슷한 의미를 가진 단어/문서**들을 축소된 잠재 의미 공간에서 **가까운 좌표**로 묶어줍니다.
* **차원 감소**: 수만 개의 단어 차원을 수백 개의 \*\*토픽 차원($K$)\*\*으로 줄여, 데이터를 다루기 쉽게 만듭니다.
  + **활용**: 차원이 줄어들면 **시각화, 군집 분석, 분류**와 같은 머신러닝 작업 전에 **전처리** 단계로 활용하기 좋습니다.
* **노이즈 감소**: 데이터에 자주 나오지만 문서의 핵심 의미와는 관련이 없는 단어들(불용어, 특이값이 작은 단어들)의 영향력을 줄여주어 **노이즈**를 다소 제거해줍니다.

```python
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
import matplotlib.pyplot as plt

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


docs = [
    # 분석할 6개의 고객 리뷰(문서) 목록입니다.
    "이 브랜드 배송이 너무 빨라서 좋았어요",
    "품질은 괜찮은데 배송이 너무 느려요",
    "가격이 저렴해서 가성비가 좋아요",
    "브랜드 이미지가 세련되고 품질도 좋아요",
    "배송도 빠르고 포장도 깔끔해서 만족합니다",
    "가격은 비싼 편인데 품질이 좋아요",
]

# 1) TF-IDF 변환
# -----------------------------------------------------------
tfidf = TfidfVectorizer(
    # TfidfVectorizer 객체를 생성합니다.
    max_df=0.8,  # 문서의 80% 이상에 나타나는 단어는 너무 흔하다고 보고 무시합니다 (불용어 처리).
    min_df=1,  # 최소 1개 문서에 나타나는 단어만 사용합니다.
    token_pattern=r"(?u)\b\w+\b",  # 한글을 포함한 단어 토큰 패턴을 지정합니다.
)

X = tfidf.fit_transform(docs)
# docs를 TF-IDF 행렬로 변환합니다. X는 (문서 수, 단어 수) 크기의 행렬이 됩니다.

print("TF-IDF shape:", X.shape)  # X 행렬의 크기를 출력합니다. (6, 11)이 나올 것입니다.

# 2) LSA - TruncatedSVD 사용
# -----------------------------------------------------------
n_topics = 2  # 추출하고자 하는 주제(토픽)의 개수를 2개로 설정합니다.
# 이 값(k)이 LSA로 축소될 차원이 됩니다.

svd = TruncatedSVD(n_components=n_topics, random_state=42)
# TruncatedSVD 객체를 생성합니다. n_components=2로 설정했습니다.

X_lsa = svd.fit_transform(X)
# TF-IDF 행렬 X에 SVD를 적용하여 차원을 축소합니다.
# X_lsa는 (문서 수, 토픽 수), 즉 (6, 2) 크기의 행렬이 됩니다 (이전의 U_k와 관련됨).

print(
    "LSA shape:", X_lsa.shape
)  # X_lsa 행렬의 크기를 출력합니다. (6, 2)가 나올 것입니다.

# 3) 토픽별 상위 단어 보기
# -----------------------------------------------------------
terms = tfidf.get_feature_names_out()
# TF-IDF 행렬을 만들 때 사용된 모든 단어(피처 이름) 목록을 가져옵니다.

for topic_idx, comp in enumerate(svd.components_):
    # svd.components_는 (토픽 수, 단어 수) 크기의 행렬 (이전의 V_k^T와 관련됨)이며, 각 토픽을 구성하는 단어 가중치를 담고 있습니다.

    term_idx = comp.argsort()[::-1][:5]
    # 현재 토픽(comp)에서 가중치가 높은 단어 5개의 인덱스를 찾습니다. (argsort로 정렬 후 역순으로 5개 선택)

    print(f"\n[토픽 {topic_idx}]")
    # 현재 토픽의 인덱스를 출력합니다.

    for idx in term_idx:
        print(terms[idx], f"({comp[idx]:.4f})")
        # 단어 목록(terms)에서 해당 인덱스의 단어와 가중치를 출력합니다.

# 4) 각 문서의 토픽 좌표 확인
# -----------------------------------------------------------
lsa_df = pd.DataFrame(X_lsa, columns=[f"topic_{i}" for i in range(n_topics)])
# LSA 결과 행렬 X_lsa를 데이터프레임으로 변환하고, 열 이름은 'topic_0', 'topic_1'로 지정합니다.

lsa_df["text"] = docs
# 원본 리뷰 텍스트를 데이터프레임에 새로운 열로 추가합니다.

print("\n문서별 토픽 좌표:")
print(lsa_df)
# 각 문서가 2개의 토픽에 대해 얻은 점수(좌표)를 최종적으로 출력하여 문서의 주제를 확인합니다.

'''
TF-IDF shape: (6, 25)
LSA shape: (6, 2)

[토픽 0]
너무 (0.3847)
배송이 (0.3847)
브랜드 (0.3541)
좋아요 (0.2699)
이 (0.2465)

[토픽 1]
좋아요 (0.4618)
저렴해서 (0.2653)
가격이 (0.2653)
가성비가 (0.2653)
품질이 (0.2262)

문서별 토픽 좌표:
        topic_0       topic_1                    text
0  7.414380e-01 -3.365248e-01   이 브랜드 배송이 너무 빨라서 좋았어요
1  6.230089e-01 -4.647627e-01     품질은 괜찮은데 배송이 너무 느려요
2  2.798881e-01  5.981388e-01       가격이 저렴해서 가성비가 좋아요
3  5.070817e-01  4.322453e-01   브랜드 이미지가 세련되고 품질도 좋아요
4  8.189720e-17 -1.261259e-16  배송도 빠르고 포장도 깔끔해서 만족합니다
5  2.635410e-01  5.785359e-01      가격은 비싼 편인데 품질이 좋아요'''
```

## t-SNE (t-distributed Stochastic Neighbor Embedding)

### 1. t-SNE의 정체 및 목적

* **정체:** **고차원 데이터를 2D 또는 3D 그림으로 예쁘게 보여주는 전용 알고리즘**입니다.
* **분류:** **비선형 차원 축소 알고리즘**의 한 종류입니다.
* **목적:** 데이터 차원이 너무 높아 (예: 100차원, 300차원) 사람이 **눈으로 바로 볼 수 없을 때**, 이 알고리즘을 사용하여 저차원으로 변환한 후 다음을 **시각화**로 확인합니다.
  + **비슷한 데이터**끼리 잘 모여 있는지 (군집의 형성 여부)
  + 데이터가 의미 있는 **클러스터**로 나뉘는지

### 2. 주요 사용 예시

t-SNE는 데이터의 잠재적인 구조를 파악하는 데 유용하며, **분석용 모델**이라기보다는 **시각화용 도구**로 주로 활용됩니다.

* **손글씨 숫자 데이터 (MNIST):**
  + 원본 데이터인 784차원의 숫자를 2차원 평면에 점으로 찍어서, 같은 숫자(0, 1, 2 등)끼리 **잘 뭉쳐서** 클러스터를 형성하는지 확인합니다. \* **문장/단어 임베딩 벡터:**
  + 고차원의 단어나 문장 임베딩 벡터를 저차원으로 줄여 **비슷한 의미**를 가진 요소들이 서로 가까이 모여 있는지 확인합니다.
* **이미지 특징 벡터:**
  + 이미지의 특징을 추출한 벡터를 축소하여 **같은 클래스**에 속하는 이미지들이 서로 **잘 뭉치는** 경향이 있는지 확인합니다.

## t-SNE의 주요 하이퍼 파라미터

t-SNE는 데이터의 고차원 구조를 저차원으로 매핑할 때, 사용자가 지정해야 하는 몇 가지 중요한 설정 값(하이퍼 파라미터)을 가지고 있습니다. 이미지에 제시된 파라미터는 다음과 같습니다.

### 1. n\_components

* **역할:** **줄이고 싶은 차원 수**를 결정합니다.
* **일반적인 값:** 시각화를 위해 주로 **2D (2)** 또는 \*\*3D (3)\*\*로 설정합니다.

### 2. perplexity (5 ~ 50 권장)

* **역할:** 한 점이 \*\*평균적으로 몇 개의 이웃(친구)\*\*을 중요한 이웃으로 고려할지 가정하여 정하는 값입니다. 이는 고차원 데이터의 밀도 정보를 저차원으로 옮기는 데 핵심적인 역할을 합니다. \* **값이 작을 경우 (5에 가까울수록):**
  + 매우 **로컬(Local) 구조**에 집중하여 봅니다.
  + 데이터의 작은 부분에 대한 상세한 클러스터가 강조되며, 클러스터가 **잘게 쪼개져서** 나타날 수 있습니다.
* **값이 클 경우 (50에 가까울수록):**
  + **글로벌(Global) 구조**를 더 많이 반영하여 봅니다.
  + 전반적인 데이터 분포를 파악하는 데는 좋지만, 작은 규모의 클러스터 구조가 서로 뭉쳐져서 **무시되거나 뭉개질** 수 있습니다.

> **일반적인 가이드라인:** 보통 $5$에서 $50$ 사이의 값을 사용하며, 데이터셋의 크기와 복잡성에 따라 적절한 값을 찾아야 합니다.

### 3. learning\_rate (50 ~ 1000 권장)

* **역할:** 좌표를 \*\*경사 하강법(Gradient Descent)\*\*으로 업데이트할 때, **한 번에 얼마나 크게 움직일지** (이동 폭)를 결정하는 값입니다.
* **값이 작을 경우 (too low):**
  + 점들이 조금씩 움직여 수렴하는 데 **느리거나** 시간이 오래 걸립니다.
  + 원하는 전역 최솟값(Global Minimum)이 아닌 \*\*지역 최솟값(Local Minimum)\*\*에 갇힐 위험이 있습니다.
* **값이 클 경우 (too high):**
  + 점들이 너무 크게 움직여 최적의 위치를 지나쳐 버리거나 **튕겨서** 그림이 엉망이 될 수 있습니다 (발산).

```python
# 필요한 라이브러리를 임포트합니다.
# 1. load_digits: scikit-learn에 내장된 손글씨 숫자 데이터셋을 로드하는 함수
# 2. TSNE: 비선형 차원 축소 알고리즘인 t-SNE 모델
# 3. matplotlib.pyplot: 시각화를 위한 라이브러리 (보통 plt로 줄여서 사용)
from sklearn.datasets import load_digits
from sklearn.manifold import TSNE
import matplotlib.pyplot as plt

# 1) 데이터 로드 및 준비
# --------------------
# 손글씨 숫자 데이터 (0~9)를 로드합니다. 각 이미지는 8x8 픽셀(64차원)입니다.
digits = load_digits()

print("\n\ndigis\n", digits)

# 원본 고차원 데이터 (64차원)
X = digits.data
# 데이터의 실제 라벨 (0부터 9까지의 숫자) -> 시각화 시 색상 지정에 사용됨
y = digits.target

# 2) t-SNE를 이용한 차원 축소
# --------------------
# TSNE 모델 객체를 생성하고 하이퍼 파라미터를 설정합니다.
tsne = TSNE(
    n_components=2,  # 축소할 차원 수: 2차원으로 설정하여 2D 평면에 시각화
    perplexity=30,  # 이웃의 개수 설정 (5~50 권장): 로컬 구조를 보존하며 변환
    learning_rate=200,  # 학습률: 최적화 단계에서 이동 폭을 결정
    random_state=42,  # 결과 재현성을 위한 시드 고정
)

# 64차원 데이터 X를 2차원으로 변환합니다. (t-SNE 학습 및 변환 동시 수행)
X_2d = tsne.fit_transform(X)

# 3) 결과 시각화
# --------------------
# 그래프 크기 설정
plt.figure(figsize=(8, 6))

# 산점도(Scatter Plot)를 이용하여 변환된 데이터를 시각화합니다.
# X_2d[:, 0] : x축 좌표 (첫 번째 t-SNE 차원)
# X_2d[:, 1] : y축 좌표 (두 번째 t-SNE 차원)
# c=y : 각 점의 색상을 라벨(y, 즉 실제 숫자)에 따라 다르게 지정하여 클러스터링을 쉽게 확인
# s=10 : 점의 크기 설정
scatter = plt.scatter(X_2d[:, 0], X_2d[:, 1], c=y, s=10, cmap="viridis")

# 그래프 제목 설정
plt.title("t-SNE visualization of digits (64D to 2D)")

# 범례(Legend) 추가: 어떤 색이 어떤 숫자를 의미하는지 표시
plt.colorbar(scatter, ticks=range(10), label="Digit Label")

# 그래프 출력
plt.show()
```

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/316/img_2.png)

```python
# 필요한 라이브러리 임포트
import re  # 정규 표현식 처리를 위한 라이브러리
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
from sklearn.decomposition import (
    TruncatedSVD,
)  # LSA(잠재 의미 분석)를 위한 Truncated SVD
from sklearn.manifold import TSNE  # 비선형 차원 축소 알고리즘 (시각화용)
import matplotlib.pyplot as plt  # 시각화 라이브러리

# 1. 데이터 로드 및 전처리
# --------------------------------------------------------------------------------

# 영화 리뷰 데이터 CSV 파일 읽기
# 파일 경로와 컬럼 이름 지정
df = pd.read_csv(
    "/Users/choimanseon/Documents/multicampus/example/nlp/stat_nlp/text_preprocess/movie_reviews.csv",
    header=0,  # 첫 줄을 헤더(제목)로 간주
    names=[
        "id",
        "review",
        "label",
    ],  # 컬럼 이름 강제 지정: 'id', 'review'(텍스트), 'label'(긍정/부정)
)

df = df.dropna()  # 결측값(NA) 포함된 행 제거

# label 컬럼을 정수형으로 강제 변환 (0, 1 레이블을 확실히 정수로 맞춰 줌)
df["label"] = df["label"].astype(int)

print(df.head())  # 데이터 상위 5개 행 출력 (데이터 구조 확인)
# print(df["label"].value_counts()) # 레이블 개수 확인 (필요시만 사용)
print(
    df["label"].value_counts(normalize=True)
)  # 레이블 비율 확인 (0/1 비율이 균등한지 확인)

# 2. 전체 데이터에서 층화추출(stratify)로 샘플 추출 (대규모 데이터셋에서 샘플링)
# --------------------------------------------------------------------------------

# 전체 df에서 1000개의 샘플만 추출하여 df_sample에 저장 (나머지는 _ 변수에 저장)
_, df_sample = train_test_split(
    df,
    test_size=1000,  # 총 데이터 중 1000개를 샘플로 사용
    stratify=df["label"],  # 레이블 비율(긍정/부정)을 유지하면서 샘플 분할 (층화 추출)
    shuffle=True,  # 데이터를 섞어서 추출 (기본값)
    random_state=42,  # 재현 가능한 결과를 위한 시드 고정
)

print(len(df_sample))  # 샘플 데이터 크기(1000) 출력
print(len(_))  # 나머지 데이터 크기 출력

# 3. 텍스트 정제 함수 정의 및 적용
# --------------------------------------------------------------------------------


# 한국어 텍스트 클리닝 함수 정의
def simple_korean_clean(text):
    # 1. 한글, 숫자, 공백 외의 모든 문자(특수문자, 영문 등)를 공백으로 대체
    text = re.sub(r"[^가-힣0-9\s]", " ", text)
    # 2. 연속된 공백(하나 이상의 \s)을 하나의 공백으로 압축하고, 양쪽 끝 공백 제거
    text = re.sub(r"\s+", " ", text).strip()
    return text


# 'review' 컬럼에 클리닝 함수 적용하여 새로운 'clean' 컬럼 생성
df_sample["clean"] = df_sample["review"].astype(str).apply(simple_korean_clean)
# 클리닝된 텍스트 목록을 list 형태로 변환 (Vectorization 입력 형식)
texts = df_sample["clean"].tolist()

# 4. LSA 파이프라인 정의 및 적용 (TF-IDF -> SVD)
# --------------------------------------------------------------------------------

# LSA(Truncated SVD)를 통해 축소할 주제(토픽)의 개수 설정
n_topics = 5

# TfidfVectorizer와 TruncatedSVD를 순차적으로 묶는 파이프라인 정의
pipe_lsa = Pipeline(
    steps=[
        # 1단계: TF-IDF 행렬 변환기 (고차원 특징 추출)
        (
            "tfidf",
            TfidfVectorizer(
                max_df=0.7,  # 문서 70% 이상에 등장하는 단어 제외
                min_df=5,  # 문서 5개 미만에 등장하는 단어 제외
                token_pattern=r"(?u)\b\w+\b",
            ),
        ),
        # 2단계: Truncated SVD (LSA 수행, 5차원으로 차원 축소)
        (
            "svd",
            TruncatedSVD(n_components=n_topics, random_state=42),
        ),
    ]
)

# 파이프라인 실행: 텍스트를 TF-IDF 행렬로 변환하고 5차원의 LSA 주제 공간으로 최종 변환
X_lsa = pipe_lsa.fit_transform(texts)

# 학습 완료된 파이프라인 내부의 개별 객체(변환기)를 추출
tfidf = pipe_lsa.named_steps["tfidf"]  # TfidfVectorizer 객체 추출
svd = pipe_lsa.named_steps["svd"]  # TruncatedSVD 객체 추출

# 5. LSA 결과 크기 및 주제별 핵심 단어 확인
# --------------------------------------------------------------------------------

print("TF-IDF shape : ", tfidf.transform(texts).shape)  # TF-IDF 행렬의 크기 (고차원)
print("LSA shape : ", X_lsa.shape)  # LSA 최종 행렬의 크기 (저차원: 1000 x 5)

terms = tfidf.get_feature_names_out()  # TF-IDF에 사용된 전체 단어 사전 추출

# 각 주제(토픽)별 상위 10개 단어 출력
for topic_idx, comp in enumerate(svd.components_):
    # comp.argsort()[::-1][:10] : 가중치가 가장 높은 상위 10개 단어의 인덱스 추출
    term_idx = comp.argsort()[::-1][:10]
    print(f"\n[토픽 {topic_idx}]")
    # 인덱스를 이용해 실제 단어(terms)를 찾아 쉼표로 연결하여 출력
    print(", ".join(terms[i] for i in term_idx))

# 6. LSA 결과에 t-SNE 적용 및 시각화
# --------------------------------------------------------------------------------

# LSA로 축소된 5차원 데이터를 t-SNE를 이용해 2차원으로 시각화
tsne = TSNE(n_components=2, perplexity=30, random_state=42)
X_2d = tsne.fit_transform(X_lsa)

# 2차원 좌표를 데이터프레임에 저장
df_sample["tsne_x"] = X_2d[:, 0]
df_sample["tsne_y"] = X_2d[:, 1]

# 산점도(Scatter Plot) 시각화
plt.figure(figsize=(6, 5))
scatter = plt.scatter(
    df_sample["tsne_x"],
    df_sample["tsne_y"],
    c=df_sample["label"],  # c=df["label"] 오류 수정: 샘플 데이터의 라벨 사용
    s=15,
    alpha=0.7,
)

# 그래프 꾸미기
plt.title("문서들의 2D LSA공간 (t-SNE)")
plt.xlabel("dim 1")
plt.ylabel("dim 2")
plt.colorbar(
    scatter, ticks=[0, 1], label="Label (0: Negative, 1: Positive)"
)  # 컬러바에 라벨 추가
plt.tight_layout()
# plt.show() # 주석 처리됨: 시각화 창을 띄우는 함수

# 7. 특정 영역의 데이터 추출 및 확인
# --------------------------------------------------------------------------------

# t-SNE Y축 좌표가 -40 이상 -30 이하인 데이터만 추출 (특정 클러스터 확인용)
extract_df = df_sample[(df_sample["tsne_y"] >= -40) & (df_sample["tsne_y"] <= -30)]

print(len(extract_df))  # 추출된 데이터의 개수 출력

# 추출된 데이터 중 10개를 무작위로 샘플링하여 출력 (데이터 내용 확인)
random10_df = extract_df.sample(n=10, random_state=42)
print("\n\nrnadome10_df\n", random10_df)
```

## UMAP (Uniform Manifold Approximation and Projection)

UMAP은 **고차원 데이터를 저차원으로 줄여주는** 비선형 차원 축소 알고리즘으로, 최근 t-SNE의 대안으로 많이 사용되고 있습니다.

### 1. 주요 특징

UMAP은 데이터의 \*\*국소 구조(local)\*\*와 \*\*전체 구조(global)\*\*를 모두 잘 보존하면서 차원을 줄여주는 것이 특징입니다.

* **빠름:** t-SNE보다 **10배에서 50배**가량 매우 빠릅니다.
* **덜 휘어짐:** \*\*전체적인 모양(global structure)\*\*을 t-SNE보다 더 잘 보존합니다. (t-SNE는 주로 local structure에 집중함)
* **더 안정적:** 반복 실행해도 결과 모양이 크게 바뀌지 않아 **재현성이 높습니다**.
* **대규모 데이터에 강함:** 수천~수십만 개의 데이터에도 처리가 가능하여 **대규모 데이터셋** 분석에 유리합니다.

### 2. 작동 원리

UMAP은 \*\*위상수학(Topology)\*\*을 기반으로 하며, 고차원 데이터의 구조를 그래프로 모델링한 후, 저차원에서 이 그래프 구조를 최대한 유사하게 재구성하는 방식으로 작동합니다.

* **이웃 그래프(Neighborhood Graph) 생성:**
  + 고차원 공간에서 각 점에 대해 \*\*k-최근접 이웃(k-nearest neighbors)\*\*을 찾습니다.
  + 이웃 간의 **연결 강도**를 확률처럼 계산하여 고차원 구조를 나타내는 그래프를 생성합니다. \* **저차원 공간에서의 재구성:**
  + **저차원(2D/3D)** 공간에서 이 고차원 그래프 구조를 **최대한 유지**하도록 좌표를 조정합니다.
  + 이 최적화 과정에서 사용하는 \*\*손실 함수(Loss function)\*\*는 t-SNE의 KL-divergence와 달리 **cross-entropy 기반의 거리 손실**을 사용하며, 이 덕분에 더 **안정적이고 빠르게 최적화**됩니다.

UMAP은 t-SNE의 장점(클러스터 시각화)을 가지면서도 속도, 안정성, 대규모 데이터 처리 능력 면에서 훨씬 우수하여 고차원 데이터 시각화의 새로운 표준이 되고 있습니다.

## UMAP의 주요 하이퍼 파라미터

### 1. n\_neighbors

이 파라미터는 **이웃으로 볼 점의 수**를 결정합니다. 이는 t-SNE의 perplexity와 비슷한 역할을 하지만, UMAP에서는 국소 구조(local)와 전체 구조(global)의 균형을 조절합니다.

* **작은 값 (5~10):**
  + **로컬 구조(local structure)를 강조**합니다.
  + 결과적으로 클러스터(군집)가 더 뚜렷하고 밀집되게 나타납니다.
* **큰 값 (30~200):**
  + **전체 구조(global structure)를 강조**합니다.
  + 전체적인 데이터의 모양이 더 안정적이고 광범위한 관계를 반영합니다.

### 2. min\_dist

이 파라미터는 저차원 공간에서 데이터 포인트들이 **얼마나 가까이 뭉칠 수 있는지**를 결정하는 최소 거리 값입니다.

* **0.0:**
  + **완전히 빽빽한 클러스터**를 만듭니다. (점들이 서로 달라붙도록 허용)
* **0.5 (기본값 근처):**
  + 클러스터 사이가 적당히 넓게 떨어지고, 클러스터 내의 밀집도는 낮아집니다. (점들이 너무 밀집되는 것을 방지)

### 3. n\_components

* **역할:** 축소하려는 **최종 차원 수**를 지정합니다.
* **사용:** 주로 **2 또는 3**을 사용하여 시각화 목적으로 활용됩니다.

### 4. metric

* **역할:** 데이터 포인트 간의 \*\*거리(유사도)\*\*를 계산하는 방법을 결정합니다.
* **기본값:** "euclidean" (유클리드 거리)
* **텍스트 임베딩**이나 고차원 데이터의 경우: "cosine" (코사인 유사도)를 자주 사용합니다. 코사인 유사도는 벡터의 크기보다는 방향(각도)에 기반하여 유사도를 측정하므로, 텍스트 데이터에서 의미적 유사도를 파악하는 데 유용합니다.

#### **종합실습**

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
import re
from konlpy.tag import Okt

okt = Okt()
# N-gram, TF-IDF용 라이브러리
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from umap import UMAP
from sklearn.pipeline import Pipeline
from sklearn.decomposition import (
    TruncatedSVD,
)  # LSA(잠재 의미 분석)를 위한 Truncated SVD

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
"""
1. 여성의류 쇼핑몰 .json 데이터 활용
2. 만족, 불만족, 보통의 데이터를 나누어 토픽 뽑기(LSA)
   -토픽당 주요 단어 20개 뽑아 출력해보기
3. LSA가 뽑은 토픽을 UMAP을 활용해 2D 산점도로 그려서 군집 형태 분석"""
base_dir = Path(r"stat_nlp/naive_bayes_svm/Sample/02.라벨링데이터")

# 불용어
with open(
    "stat_nlp/stopwords-ko.txt",
    encoding="utf-8",
) as f:
    stopwords = set(w.strip() for w in f if w.strip())
stopwords.update(["하다", "하"])
"""
##! 1. 데이터 로드 및 기본 정보 확인
""" ""

df = []
i = 1
TARGET = 2000
counts = {1: 0, 0: 0, -1: 0}
while True:
    path = f"{base_dir}/쇼핑몰/01. 패션/1-1. 여성의류/1-1.여성의류({i}).json"
    try:
        print(i, "번 파일 읽음")
        temp = pd.read_json(path)

        if all(value >= TARGET for value in counts.values()):
            print("모든 클래스 600개씩 수집 완료")
            break

        for _, row in temp.iterrows():
            if pd.isna(row["GeneralPolarity"]):
                continue
            if counts[int(row["GeneralPolarity"])] < TARGET:
                counts[int(row["GeneralPolarity"])] += 1
                df.append(row.to_dict())

        i += 1
    except Exception as e:
        print(i, "번 파일에서 에러 발생")
        print("에러 내용:", e)
        break
df = pd.DataFrame(df)
df = df.dropna(subset=["RawText", "GeneralPolarity", "ReviewScore", "RDate"])
print("\ndf.head()", df.head())


def preprocess(text):
    str_reg = re.sub(r"[^가-힝0-9a-zA-Z\s]", "", text).lower()
    pos = okt.pos(str_reg, norm=True, stem=True, join=True)
    pos = [word.split("/") for word in pos]
    filtered_pos = [
        word
        for word, tag in pos
        if word and word not in stopwords and tag in ["Noun", "Verb", "Adjective"]
    ]
    return filtered_pos


n_topics = 3
neighbors_list = [5, 10, 30]
df["polarity_map"] = df["GeneralPolarity"].map({-1: 0, 0: 1, 1: 2})

print("\n==========================================")
print("[전체 데이터] LSA 분석 시작")
print("==========================================")

texts_all = df["RawText"].astype(str).tolist()

pipe_lsa = Pipeline(
    steps=[
        (
            "tfidf",
            TfidfVectorizer(
                tokenizer=preprocess,
                token_pattern=None,
                ngram_range=(1, 2),
                max_df=0.8,
                min_df=5,
            ),
        ),
        (
            "svd",
            TruncatedSVD(n_components=n_topics, random_state=42),
        ),
    ]
)

X_lsa_all = pipe_lsa.fit_transform(texts_all)
tfidf = pipe_lsa.named_steps["tfidf"]
svd = pipe_lsa.named_steps["svd"]
terms = tfidf.get_feature_names_out()

print(f"LSA 행렬 크기 (축소된 차원): {X_lsa_all.shape}")


print(f"\n[LSA 토픽별 주요 단어 (Top 20) - 전체 데이터]")
for topic_idx, comp in enumerate(svd.components_):
    term_idx = comp.argsort()[::-1][:20]
    top_terms = [terms[i] for i in term_idx]
    print(f"토픽 {topic_idx + 1}: {', '.join(top_terms)}")


# UMAP 시각화 (감성별 군집 분석)
plt.figure(figsize=(15, 5))

for i, n_nb in enumerate(neighbors_list, start=1):
    reducer = UMAP(
        n_components=2,
        n_neighbors=n_nb,
        min_dist=0.5,
        metric="cosine",
        random_state=42,
        n_jobs=1,
    )
    X_umap = reducer.fit_transform(X_lsa_all)

    plt.subplot(1, 3, i)

    scatter = plt.scatter(
        X_umap[:, 0],
        X_umap[:, 1],
        c=df["polarity_map"],
        s=3,
        cmap="bwr",
        alpha=0.7,
    )

    plt.title(f"UMAP (n_neighbors = {n_nb})", fontsize=12)
    plt.xticks([])
    plt.yticks([])


plt.suptitle(
    "전체 데이터 UMAP 시각화",
    y=1.05,
    fontsize=14,
)
plt.tight_layout()
plt.show()
```

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/316/img_3.png)
