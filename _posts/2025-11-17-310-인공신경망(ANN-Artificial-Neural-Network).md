---
title: "인공신경망(ANN : Artificial Neural Network)"
date: 2025-11-17 14:05:40 +0900
render_with_liquid: false
categories: ["데이터 분석", "머신러닝, 딥러닝"]
---

딥러닝은 머신러닝의 한 종류로 인공신경망(ANN)에 기반을 둔 학습 방법

머신러닝은 정형데이터 학습에

딥러닝은 이미지, 소리, 텍스트와 같은 비정형 데이터 학습에 주로 사용

전이학습 : 풍부한 데이터를 이용해서 학습된 pre-trained model을 가져와

부족한 사용자 데이터 환경에 맞도록 새롭게 모델을 학습 시키는 일련의 과정

입력층, 은닉층, 출력층 3개 층 구성(SLP: 은닉층 없음, MLP: 1개 이상의 은닉층)

파라미터(매개변수) : 가중치(weight)  
하이퍼 파라미터 : 인공신경망의 학습률(learning rate), 배치(batch) 크기, hidden neuron, hidden layer 수

퍼셉트론(Perceptron)  
생물학적 뇌의 뉴런을 모방하여 만든 인공신경망(ANN)의 기본 단위

**인공신경망(ANN) 학습 과정 요약**

**Forward Propagation (순전파)**

* 처음에 모든 **가중치(weight, parameter)** 는 임의의 값으로 초기화된다.
* **입력 X** 가 네트워크를 통과하면서, 각 층의 **가중치(weight)** 와 **활성화 함수(activation)** 를 거쳐 **예측값(predicted value)** 을 계산한다.
* 즉, “입력 → 은닉층 → 출력층” 방향으로 정보를 전달하면서 **예측 ŷ (y-hat)** 을 만든다.

핵심: 입력 데이터를 현재 가중치로 계산해서 “모델이 현재 어떻게 예측하는지” 보는 단계.

---

**Loss / Cost / Error 계산 (손실함수 계산)**

* 예측값 **ŷ** 과 실제값 **y (label)** 을 비교해서 **오차(error)** 를 구한다.
* 이 차이를 **손실함수(loss function)** 에 넣어 하나의 숫자(손실값, cost)를 계산한다.
* 예시: MSE (Mean Squared Error) = 평균제곱오차  
  → (ŷ - y)^2 를 평균낸 값

핵심: 모델이 얼마나 틀렸는지 수치로 평가.

---

**Backward Propagation (역전파)**

* 방금 구한 손실을 기준으로 **각 weight가 손실에 얼마나 영향을 줬는지**를 미분(gradient)으로 계산한다.
* 이 미분값을 **기울기(gradient)** 라고 하고,  
  옵티마이저(Optimizer)가 이를 사용해서 **가중치를 반대 방향으로 조금씩 조정**한다.
* 이 과정을 **“학습” 또는 “파라미터 업데이트”** 라고 부름.

핵심: 오차를 줄이는 방향으로 가중치를 업데이트하여 모델을 점점 똑똑하게 만드는 단계.

**한 사이클의 전체 흐름 요약**

1. 가중치 초기화
2. 순전파로 예측 (Forward)
3. 예측과 실제 비교해 손실 계산
4. 역전파로 가중치 조정 (Backward)  
   → 이 과정을 수백~수천 번 반복하면서 손실이 줄어드는 방향으로 학습됨.

![](/assets/images/tistory/310/img.png)

이론 단계 파이토치 코드 의미 설명

|  |  |  |
| --- | --- | --- |
| **1️⃣ Forward Propagation (순전파)** | pred = model(xb) | - 입력 xb가 네트워크를 통과하면서 예측값 pred 계산- 가중치(weight)와 활성화 함수를 이용해 출력 생성- ANN 그림의 **‘입력 → 은닉층 → 출력층’** 부분 |
| **2️⃣ 손실 계산 (Loss function)** | loss = criterion(pred, yb) | - 예측값 pred와 실제값 yb의 차이 계산- MSE, CrossEntropy 등 사용- ANN 그림의 **“예측값 vs 실제값 → Loss function”** 단계 |
| **3️⃣ Gradient 계산 (역전파 준비)** | optimizer.zero\_grad() | - 이전 배치에서 계산된 gradient(기울기) 초기화- 매번 새롭게 계산해야 올바른 갱신 가능 |
| **4️⃣ Backward Propagation (역전파)** | loss.backward() | - 손실을 기준으로 각 파라미터별 기울기 계산- 수학적으로는 (\frac{d \text{Cost}}{dW}) 계산- ANN 그림의 **‘Backward Propagation 화살표’**, Gradient Descent 그림의 **∂Cost/∂W 계산** 단계 |
| **5️⃣ Gradient Descent (경사 하강)** | optimizer.step() | - 계산된 기울기를 이용해 가중치(weight) 갱신- 내부적으로 (W = W - \alpha \frac{d}{dW} \text{Cost}(W))- Gradient Descent 그림의 **‘Weight 갱신’**, **‘산 아래로 내려가는 화살표’** 단계 |
| **6️⃣ 반복 학습 (Epoch Loop)** | for epoch in range(num\_epochs): ... | - 위의 과정을 반복하며 오차 감소- Global Minimum 근처까지 계속 갱신 |
| **7️⃣ 평가 단계 (Evaluation)** | model.eval()with torch.no\_grad(): ... | - 학습 중이 아닌 상태에서 예측값 확인- gradient 계산 비활성화로 효율 향상 |

**경사 하강법 (Gradient Descent)**

**개념 요약**

* 머신러닝 모델이 **오차(손실)** 를 줄이기 위해 사용하는 **가중치(weight)** 조정 알고리즘.
* 손실함수(cost function)가 **가장 낮은 지점(최솟값, Global Minimum)** 을 찾는 것이 목표.
* 즉, “산을 내려가듯이” 기울기가 낮은 쪽으로 조금씩 이동하며 오차를 줄이는 과정이다.

---

**핵심 아이디어**

* 손실함수 Cost(W) 가 가중치 W 에 따라 어떻게 변하는지를 살핀다.
* 기울기(gradient) = d(Cost)/d(W)  
  → 현재 위치에서 기울기가 양수면 오차가 커지는 방향이므로 **반대 방향**으로 이동해야 한다.

```python
W = W - α * (dCost/dW)

W : 현재 가중치(weight)
α (알파) : 학습률(learning rate) — 한 번에 얼마나 이동할지 결정
dCost/dW : 현재 위치에서의 기울기(gradient)
```

**과정 요약**

1️⃣ **가중치 초기화**

* 임의의 랜덤 값으로 시작한다.
* (이때 위치가 “Initial Weight”)

2️⃣ **손실 계산 (Cost Function)**

* 예측값과 실제값의 차이로 손실을 계산한다.
* 예시: MSE, Cross Entropy 등

3️⃣ **기울기 계산 (Gradient)**

* 손실함수를 가중치 W 에 대해 미분해서, 오차의 방향(기울기)을 구한다.
* 기울기가 클수록 오차가 급격히 커지는 방향이라는 뜻이다.

4️⃣ **가중치 갱신 (Weight Update)**

* 위에서 구한 기울기를 이용해 가중치를 조정한다.
* 식: W = W - α \* (dCost/dW)
* 즉, 오차가 커지는 방향의 **반대쪽**으로 α만큼 이동한다.

5️⃣ **반복 수행 (Iteration)**

* 위의 과정을 여러 번 반복하면서 손실이 점점 줄어든다.
* 최종적으로 손실이 더 이상 줄지 않을 때, **Global Minimum** 근처에 도달한다.

**활성화 함수 (Activation Function)**

**개념**

* 신경망이 **비선형(Non-linear)** 문제를 풀 수 있게 만들어주는 함수.
* 각 뉴런의 출력에 적용되어, 단순한 선형 연산을 넘어서 복잡한 관계를 학습하도록 도와준다.
* 즉, “입력 → 가중합 → 활성화 함수 → 출력” 과정에서  
  이 **활성화 함수**가 신경망의 표현력을 높여주는 역할을 한다.

---

**활성화 함수의 역할**

1. 모델에 **비선형성(Non-linearity)** 을 추가한다.  
   → 선형 함수만 쓰면 아무리 층을 쌓아도 하나의 선형함수로 단순화되어버림.
2. 학습 과정에서 **가중치가 너무 커지거나 작아지는 것을 완화**한다.
3. 층마다 다른 활성화 함수를 써서, 문제 유형에 맞게 조정할 수 있다.

자주 쓰이는 활성화 함수 종류

함수                                         수식 형태 (개념적)                             특징

|  |  |  |
| --- | --- | --- |
| **Sigmoid** | f(x) = 1 / (1 + e^(-x)) | 출력이 0~1 사이. 확률 형태로 표현 가능하지만, 기울기 소실이 잘 생김. |
| **Tanh** | f(x) = (e^x - e^(-x)) / (e^x + e^(-x)) | 출력이 -1~1 사이. 중심이 0이라 sigmoid보다 낫지만 여전히 기울기 약화 가능. |
| **ReLU (Rectified Linear Unit)** | f(x) = max(0, x) | 음수는 0, 양수는 그대로. 계산 빠르고 기울기 소실이 적음. 가장 널리 사용됨. |
| **Leaky ReLU** | f(x) = x (if x>0), 0.01x (if x<=0) | ReLU에서 죽은 뉴런 문제(dead neuron)를 완화. |
| **ELU** | 양수일 땐 x, 음수일 땐 exp(x)-1 | ReLU보다 부드럽고 음수에서도 기울기 존재. |
| **Softmax** | 각 출력의 e^x 값을 전체 합으로 나눈 값 | 분류 문제에서 각 클래스의 확률로 사용됨. |

**기울기 소실 (Vanishing Gradient)**

**개념**

* 신경망의 층이 깊어질수록 **역전파(Backpropagation)** 시  
  **기울기(gradient)** 가 점점 작아져서 거의 0이 되는 현상.
* 이렇게 되면 앞쪽(입력 근처) 레이어는 **업데이트가 거의 안 돼서 학습이 멈춤**.

---

**왜 발생하나**

* sigmoid, tanh 같은 활성화 함수는  
  입력이 커질수록 출력이 거의 일정해지고,  
  그 구간에서 미분값(기울기)이 0에 가까워짐.
* 이런 함수가 여러 층에 반복되면,  
  미분값(gradient)이 계속 곱해지면서 0에 수렴함 → “기울기 소실”.

---

**해결 방법**

* **ReLU 계열 함수 사용**:  
  ReLU, Leaky ReLU, ELU 등은 미분값이 0 또는 1로 단순해서 기울기 소실이 거의 없다.
* **Batch Normalization, Skip Connection(Residual Network)** 등도 보조적으로 사용된다.

**요약**

활성화 함수는 신경망에 비선형성을 주는 핵심 요소이며,

잘못된 함수 선택(sigmoid 등)은 **기울기 소실(Vanishing Gradient)** 을 유발할 수 있다.  
그래서 현대 딥러닝에서는 주로 **ReLU 계열 함수**를 사용한다

```python
"""
실습 목표
1) seaborn 'mpg' 회귀 데이터로 모델링 (target='mpg')
2) train/valid/test 분할
3) LinearRegression 베이스라인 → 테스트 MSE, RMSE
4) MLP 회귀(입력-은닉-출력)
5) 학습 루프 200에폭: 에폭별 train/valid MSE 기록, Early Stopping
6) 최종 테스트 MSE, RMSE
7) 시각화로 과적합 분석 + 모델 비교
"""

import copy
import torch
import torch.nn as nn
from torch.utils.data import TensorDataset, DataLoader

import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

# ===== 한글 폰트 설정(플랫폼별) =====
from matplotlib import font_manager
import platform

if platform.system() == "Windows":
    plt.rc("font", family="Malgun Gothic")  # 윈도우: 맑은고딕
elif platform.system() == "Darwin":
    plt.rc("font", family="AppleGothic")  # 맥: 애플고딕
else:
    plt.rc("font", family="NanumGothic")  # 리눅스: 나눔고딕 (설치 필요할 수 있음)
plt.rcParams["axes.unicode_minus"] = False  # 음수 기호 깨짐 방지

# ===== 1) 데이터 로드 =====
df = sns.load_dataset("mpg").dropna().copy()  # 결측 제거 후 복사
print(df)  # 데이터 확인(선택)

# 사용 특성: horsepower, weight (2개) / 타깃: mpg
X = df[["horsepower", "weight"]].values.astype(np.float32)
y = df["mpg"].values.astype(np.float32)

# ===== 2) train/valid/test 분할 =====
# 1단계: test 20% 분리 → 남은 80%는 train+valid
x_trainval, x_test, y_trainval, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 2단계: 남은 80%에서 valid 25% 분리 → 최종 비율: train 60%, valid 20%, test 20%
valid_ratio_within_train = 0.25
x_train, x_valid, y_train, y_valid = train_test_split(
    x_trainval, y_trainval, test_size=valid_ratio_within_train, random_state=42
)

# 스케일링(입력만): 학습셋 통계로 맞추고(valid/test는 transform만)
scaler = StandardScaler()
x_train_scaled = scaler.fit_transform(x_train)
x_valid_scaled = scaler.transform(x_valid)
x_test_scaled = scaler.transform(x_test)

# ===== 3) 선형회귀 베이스라인(LinearRegression) =====
lin_reg = LinearRegression()
lin_reg.fit(x_train_scaled, y_train)  # 학습
y_pred_lr = lin_reg.predict(x_test_scaled)  # 테스트 예측
mse_lr = mean_squared_error(y_test, y_pred_lr)  # 테스트 MSE
rmse_lr = float(np.sqrt(mse_lr))  # 테스트 RMSE
print(f"[Linear Regression] Test MSE: {mse_lr:.4f} | RMSE: {rmse_lr:.4f}")


# ===== 4) 딥러닝 회귀모델(MLP) 정의 =====
class MLPRegressor(nn.Module):
    """
    입력 2 → 은닉 16(ReLU) → 은닉 16(ReLU) → 출력 1
    간단하지만 비선형성을 학습할 수 있어 선형모델보다 유연함
    """

    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(2, 16), nn.ReLU(), nn.Linear(16, 16), nn.ReLU(), nn.Linear(16, 1)
        )

    def forward(self, x):
        return self.net(x)


model = MLPRegressor()
criterion = nn.MSELoss()  # 회귀 손실: MSE
optimizer = torch.optim.Adam(model.parameters(), lr=0.01)  # 옵티마이저

# ===== 텐서/데이터로더 준비 =====
# 넘파이 → 토치 텐서 (타깃은 (N,1)로 변환해 MSE에서 브로드캐스팅 혼선을 방지)
x_train_t = torch.tensor(x_train_scaled, dtype=torch.float32)
y_train_t = torch.tensor(y_train, dtype=torch.float32).unsqueeze(1)
x_valid_t = torch.tensor(x_valid_scaled, dtype=torch.float32)
y_valid_t = torch.tensor(y_valid, dtype=torch.float32).unsqueeze(1)
x_test_t = torch.tensor(x_test_scaled, dtype=torch.float32)
y_test_t = torch.tensor(y_test, dtype=torch.float32).unsqueeze(1)

train_dataset = TensorDataset(x_train_t, y_train_t)
valid_dataset = TensorDataset(x_valid_t, y_valid_t)
test_dataset = TensorDataset(x_test_t, y_test_t)
"""
train_loader: 가중치를 학습시키는 용도(셔플, 역전파)
valid_loader: 에폭마다 일반화 성능을 점검하고 하이퍼파라미터/early stopping을 결정하는 용도
test_loader: 모든 결정이 끝난 뒤 최종 성능을 한 번만 재는 용도

학습(train) batch_size는 작게
이유: 배치가 작을수록 기울기(gradient)에 적당한 노이즈가 생겨 일반화에 도움이 되고, 메모리 여유도 생김.
또, 역전파가 있으니 메모리·연산량이 커서 너무 큰 배치는 오히려 느리거나 OOM이 나기 쉬움.

검증/테스트(valid/test) batch_size는 크게
이유: 역전파가 없어서 메모리 부담이 훨씬 적고, 큰 배치로 “적은 스텝 수”로 빨리 끝낼 수 있음.
model.eval()이면 Dropout 꺼지고 BatchNorm은 러닝 통계를 쓰니까 배치 크기가 결과에 영향 거의 없음.
그래서 가능한 한 “메모리에 맞는 최대치”로 두면 속도가 좋아짐. 128, 256, 심지어 전체 한 번에도 가능
""" ""
train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
valid_loader = DataLoader(valid_dataset, batch_size=128, shuffle=False)
test_loader = DataLoader(test_dataset, batch_size=128, shuffle=False)

# ===== 5) 학습 루프(200에폭) + Early Stopping =====
num_epochs = 200
patience = 20  # 개선 없이 연속 20에폭이면 중단
train_losses, valid_losses = [], []

# Early Stopping 상태값
best_state = None  # best 가중치 스냅샷
best_epoch = -1  # best 시점(사람 기준 1부터 표시)
best_valid = np.inf  # 지금까지 본 검증 MSE 최소값
no_improve = 0  # 연속 미개선 카운터

for epoch in range(num_epochs):
    # ----- train 단계 -----
    model.train()
    se_sum, n_train = 0.0, 0
    for xb, yb in train_loader:
        optimizer.zero_grad()
        pred = model(xb)  # 순전파
        loss = criterion(pred, yb)  # 배치 평균 MSE
        loss.backward()  # 역전파
        optimizer.step()  # 파라미터 업데이트

        # 에폭 평균을 정확히 계산: 배치 제곱오차 총합을 누적
        se_sum += ((pred - yb) ** 2).sum().item()
        n_train += xb.size(0)
    train_mse = se_sum / n_train  # 학습셋 MSE
    train_losses.append(train_mse)

    # ----- valid 단계 -----
    model.eval()
    with torch.no_grad():
        se_sum_v, n_valid = 0.0, 0
        for xb, yb in valid_loader:
            pred = model(xb)
            se_sum_v += ((pred - yb) ** 2).sum().item()
            n_valid += xb.size(0)
        valid_mse = se_sum_v / n_valid  # 검증셋 MSE
        valid_losses.append(valid_mse)

    # 진행 로그(20에폭마다 + 첫 에폭)
    if (epoch + 1) % 20 == 0 or epoch == 0:
        print(
            f"[Epoch {epoch+1}/{num_epochs}] "
            f"Train MSE {train_mse:.4f} (RMSE {np.sqrt(train_mse):.4f}) | "
            f"Valid MSE {valid_mse:.4f} (RMSE {np.sqrt(valid_mse):.4f})"
        )

    # ----- Early Stopping 판정(검증 MSE 기준) -----
    # 개선이면: 최저 기록 갱신 + 가중치 스냅샷 저장 + 카운터 초기화
    if valid_mse < best_valid:
        best_valid = valid_mse
        best_epoch = epoch + 1
        best_state = copy.deepcopy(model.state_dict())  # 깊은 복사로 안전 저장
        no_improve = 0
    else:
        # 미개선이면: 연속 미개선 카운터 증가 → patience 도달 시 중단
        no_improve += 1
        if no_improve >= patience:
            print(
                f"Early Stopping 발동: epoch {epoch+1}에서 중지 (best epoch={best_epoch})"
            )
            break

# best 에폭의 가중치로 복원(마지막 에폭이 아닌, 최적 시점 성능으로 평가하기 위함)
if best_state is not None:
    model.load_state_dict(best_state)

# ===== 6) 테스트 평가(MSE, RMSE) =====
model.eval()
with torch.no_grad():
    preds_list, ys_list = [], []
    for xb, yb in test_loader:
        preds_list.append(model(xb).squeeze(1).cpu().numpy())
        ys_list.append(yb.squeeze(1).cpu().numpy())
y_pred_mlp = np.concatenate(preds_list)  # MLP 테스트 예측
y_true = np.concatenate(ys_list)  # 테스트 실제값

mse_mlp = mean_squared_error(y_true, y_pred_mlp)
rmse_mlp = float(np.sqrt(mse_mlp))
print(f"[MLP Regression]  Test MSE: {mse_mlp:.4f} | RMSE: {rmse_mlp:.4f}")
print(
    f"(Best epoch={best_epoch}, Best Valid MSE={best_valid:.4f}, RMSE={np.sqrt(best_valid):.4f})"
)

# ===== 7) 시각화 =====
# 7-1) 학습/검증 손실 곡선: 과적합 신호와 Early Stopping 지점 확인
plt.figure(figsize=(9, 5))
plt.plot(train_losses, label="Train MSE")
plt.plot(valid_losses, label="Valid MSE")
if best_epoch > 0:
    plt.axvline(best_epoch - 1, linestyle="--", label=f"Best epoch = {best_epoch}")
plt.xlabel("Epoch")
plt.ylabel("MSE")
plt.title("학습/검증 손실 곡선 (과적합 분석 및 Early Stopping 지점)")
plt.legend()
plt.tight_layout()
plt.show()
# 해석 가이드:
# - Train은 내려가는데 Valid가 어느 지점부터 되돌아 올라가기 시작하면 과적합 신호.
# - 점선(Best epoch)은 검증 MSE 최저 시점 → 그때의 가중치로 복원해 테스트를 평가함.

# 7-2) 실제 vs 예측 산점도(Linear / MLP) + 7-3) 모델 오차 막대그래프(MSE, RMSE)
fig, axes = plt.subplots(1, 3, figsize=(18, 6))

# 대각 기준선 범위를 두 모델/실제 전체 값에서 공통으로 산정
lo = min(y_test.min(), y_pred_lr.min(), y_true.min(), y_pred_mlp.min())
hi = max(y_test.max(), y_pred_lr.max(), y_true.max(), y_pred_mlp.max())

# (좌) Linear 산점도
axes[0].scatter(y_test, y_pred_lr, alpha=0.7)
axes[0].plot([lo, hi], [lo, hi], lw=2)
axes[0].set_title(f"Linear Regression\nMSE {mse_lr:.3f}, RMSE {rmse_lr:.3f}")
axes[0].set_xlabel("True MPG")
axes[0].set_ylabel("Predicted MPG")

# (중) MLP 산점도
axes[1].scatter(y_true, y_pred_mlp, alpha=0.7)
axes[1].plot([lo, hi], [lo, hi], lw=2)
axes[1].set_title(f"MLP Regression\nMSE {mse_mlp:.3f}, RMSE {rmse_mlp:.3f}")
axes[1].set_xlabel("True MPG")
axes[1].set_ylabel("Predicted MPG")

# (우) 모델 비교 막대그래프(MSE, RMSE)
labels = ["Linear", "MLP"]
mse_values = [mse_lr, mse_mlp]
rmse_values = [rmse_lr, rmse_mlp]
x = np.arange(len(labels))
barw = 0.35
axes[2].bar(x - barw / 2, mse_values, width=barw, label="MSE")
axes[2].bar(x + barw / 2, rmse_values, width=barw, label="RMSE")
axes[2].set_xticks(x)
axes[2].set_xticklabels(labels)
axes[2].set_ylabel("Error")
axes[2].set_title("Linear Regressor VS Deep Learning (MSE, RMSE)")
axes[2].legend()

fig.suptitle("테스트셋: 실제 vs 예측 비교 + 모델 오차 비교", y=0.97)
fig.tight_layout()
plt.show()

# ===== 분석 메모(요약) =====
# • 모델 비교: 테스트 MSE/RMSE에서 MLP가 Linear보다 낮음 → 비선형 표현력이 이득.
# • 산점도: 두 모델 모두 대각선 부근 분포, MLP가 약간 더 촘촘(큰 오차 감소).
# • 손실 곡선: Best epoch 이후 Valid MSE 개선 정체/상승 → Early Stopping으로 과적합 구간 진입 전 종료.
# • 추가 개선 팁: 특성 추가(예: cylinders, displacement, acceleration, model_year),
#                 정규화(weight_decay), 드롭아웃, 은닉 차원/학습률/배치 크기 튜닝,
#                 또는 선형모델에 다항/상호작용 특성 추가로 베이스라인 상향.
```

![](/assets/images/tistory/310/img_1.png)

![](/assets/images/tistory/310/img_2.png)
