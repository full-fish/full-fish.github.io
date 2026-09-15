---
title: "CRYPTO TRACKER"
date: 2023-02-10 17:50:55 +0900
render_with_liquid: false
categories: ["nomadcoder", "React JS 마스터클래스"]
---

#### **Route**

src/routes 폴더에 각각의 페이지 컴포넌트 만들고

src/Router.tsx에 아래처럼 라우팅을 한다

```javascript
// Router.tsx
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Coin from './routes/Coin'
import Coins from './routes/Coins'

function Router() {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route path="/:coinId">
            <Coin />
          </Route>
          <Route path="/">
            <Coins />
          </Route>
        </Switch>
      </BrowserRouter>
      ;
    </>
  )
}
export default Router
```

useParams로 해당 url의 params를 가져올 수 있다

```javascript
// /src/routes/Coin.tsx
import { useParams } from 'react-router'
interface Params {
  coinId: string
}
function Coin() {
  //   const { coinId } = useParams<{ coinId: string }>()
  const { coinId } = useParams<Params>()

  console.log(coinId)
  return <h1>Coin: {coinId}</h1>
}
export default Coin
```

**react-router-dom v6 바뀐점**

Switch컴포넌트 -> Routes컴포넌트로 변경  
exact삭제  
useHistory -> useNavigate  
useRoutes

useParams사용시 interface안해줘도 자동으로 타입이 undefiend|string으로 잡힘

#### **Styles**

```javascript
npm i styled-reset
```

위의 명령어로 css를 싹 다 밀어버리고 초기값으로 돌릴 수 있는데

이렇게 하기보다는

<https://github.com/zacanger/styled-reset/blob/master/src/index.ts>

위 페이지로가서

```css
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, menu, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
main, menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, main, menu, nav, section {
  display: block;
}
/* HTML5 hidden-attribute fix for newer browsers */
*[hidden] {
    display: none;
}
body {
  line-height: 1;
}
menu, ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
```

이거 복사해온다음에

```css
// App.tsx
import { createGlobalStyle } from 'styled-components'
const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400&display=swap');
font-family: 'Source Sans Pro', sans-serif;
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, menu, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
main, menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, main, menu, nav, section {
  display: block;
}
/* HTML5 hidden-attribute fix for newer browsers */
*[hidden] {
    display: none;
}
body {
  line-height: 1;
}
menu, ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
*{
  box-sizing: border-box;
}
body{
  font-family:'Source Sans Pro',sans-serif;
  background-color:${props => props.theme.bgColor};
  color:${props => props.theme.textColor}
}
a{
  text-decoration:none;
}`
```

이런식으로 (위 코드는 조금 더 추가해줌 (font와 백그라운드와 그냥 color 그리고 링크 밑줄 삭제))

```css
const GlobalStyle = createGlobalStyle`여기에 붙여 넣음`
```

한다음에 return쪽에 랜더시키면 전역css로서 들어감

**Home part One~Two**

꿀팁들

모바일처럼 중앙정렬 느낌으로 화면 사이즈 바뀌어도 중간에 있음

```css
  max-width: 480px;
  margin: 0 auto;
```

코인 좀 이쁘게

![](/assets/images/tistory/241/img.png)


코인 이쁘게

```css
const Coin = styled.li`
  background-color: white;
  color: ${props => props.theme.bgColor};
  border-radius: 15px;
  margin-bottom: 10px;
  a {
    padding: 20px; // a 바깥쪽에 선언했다면 클릭할 수 있는 영역이 좁았음
    transition: color 0.3s ease-in;
    display: block; // 글씨 밖도 클릭되게끔
  }
  &:hover {
    a {
      color: ${props => props.theme.accentColor};
    }
  }
`
```

코인 리스트들 누르면 url 변경

```typescript
 <CoinsList>
        {coins.map(coin => (
          <Coin key={coin.id}>
            <Link to={`${coin.id}`}>{coin.name} &rarr;</Link>
          </Coin>
        ))}
</CoinsList>
```

<Link>

```html
// 공식문서 사용법
<Link
  to={{
    pathname: "/courses",
    search: "?sort=name",
    hash: "#the-hash",
    state: {fromDashboard: true }
  }}
/>
``````javascript
// Coins.tsx
<Link
   to={{
    pathname: `/${coin.id}`,
    state: { name: coin.name },
   }}
>
```
```javascript
// Coin.tsx
 const { state } = useLocation<RouteState>()
 
 <Title>{state?.name || 'Loading...'}</Title>
```

**react-router-dom v6 바뀐점**

제네릭 미지원

```typescript
interface RouterState {
name: string;
}
const location = useLocation();
const name = location.state as RouterState;

// or

interface RouterState {
state:{
name:string;
};
}
const {state} = useLocation() as RouterState;
```

Link의 to prop에 모든것을 담지않고

```typescript
<Link to={} state={} >
```

형식으로 바뀜

#### **Nested Routes**

tap같은거 선택할 때 url의 끝부분만 바뀌면 해당 컴포넌트 랜더되게끔

```javascript
<Switch>
  <Route path={`/${coinId}/price`}>
    <Price />
  </Route>
  <Route path={`/${coinId}/chart`}>
    <Chart />
   </Route>
 </Switch>
```

**react-router-dom v6 바뀐점**

**<https://nomadcoders.co/react-masterclass/lectures/3318>**

댓글확인

<https://ui.dev/react-router-nested-routes/>

#### **useRouteMatch** : 내가 특정한 URL에 있는지 여부

**react-router-dom v6 바뀐점**

useRouteMatch()가 사라지고 useMatch()를 이용

Switch가 Routes로 변경

Outlet을 사용하면 nested router를 쉽게 이용

#### **Provider**

```javascript
<ThemeProvider theme={theme}>
  <App /> 
</ThemeProvider>
```

ThemeProvider안에 있는 모든 것이 theme로 접근 할 수 있음을 의미

```javascript
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        {/* <E /> */}
        <App />
      </ThemeProvider>
    </QueryClientProvider>
```

QueryClientProvider안에 있는 모든 것이 queryClient로 접근 할 수 있음을 의미

#### **React Query**

React 애플리케이션에서 서버 state를 fetching, caching, synchronizing, updating할 수 있도록 도와주는 라이브러리

global state를 건드리지 않고 데이터를 가져오고 캐시하고 업데이트함

```javascript
  const [coins, setCoins] = useState<CoinInterface[]>([])
  const [loading, setLoading] = useState(true)
  const getCoins = async () => {
    const res = await axios('https://api.coinpaprika.com/v1/coins')
    console.log(res)
    setCoins(res.data.slice(0, 100))
    setLoading(false)
  }
  useEffect(() => {
    // ;(async () => {
    // const response = await fetch('https://api.coinpaprika.com/v1/coins')
    // const json = await response.json()
    // setCoins(json.slice(0, 100))
    // })() // 이런 함수는 바로 실행됨
    getCoins()
  }, [])
```

해당 부분을

```javascript
  const { isLoading, data } = useQuery<ICoin[]>('allCoins', fetchCoins)
  
  // api.ts
  export async function fetchCoins() {
  let a = await axios('https://api.coinpaprika.com/v1/coins')
  return a.data
```

이렇게 줄일 수 있음

장점중 하나는 Coin에서 Coins로 돌아갈 때 상태값이 캐시에 남아있어서 다시 데이터를 받아오지않음

매개변수 있는 예

useQuery의 인자들 (유일한 이름, 함수, Object)

```javascript
// api.ts
export async function fetchCoinInfo(coinId: string) {
  let data = await axios(`${BASE_URL}/coins/${coinId}`)
  return data.data
}

// Coin.tsxz
  const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(['info', coinId], () => fetchCoinInfo(coinId))
```

#### **Helmet**

```
npm i react-helmet
npm i --save-dev @types/react-helmet
```

Helmet은 head로 가는 direct link

예시

```javascript
// Coins.tsx
<Helmet>
  <title>코인</title>
</Helmet>

// Coin.tsx
<Helmet>
  <title>{state?.name ? state.name : loading ? 'Loading...' : infoData?.name}</title>
</Helmet>
```
