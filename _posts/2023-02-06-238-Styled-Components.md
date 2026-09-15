---
title: "Styled Components"
date: 2023-02-06 22:23:09 +0900
render_with_liquid: false
categories: ["nomadcoder", "React JS 마스터클래스"]
tags: ["Styled Components"]
---

tag에 style 직접 먹일 때

```html
<div style={{ backgroundColor: 'teal', width: 100, height: 100 }}></div>
```

일반적 사용법 : 이름을 붙여 줄 수 있다

```css
const BoxOne = styled.div`
  background-color: teal;
  width: 100px;
  height: 100px;
`
```

props내리기 가능

```css
const Box = styled.div`
  background-color: ${props => props.bgColor};
  width: 100px;
  height: 100px;
`

<Box bgColor="teal" />
```

컴포넌트 extend하기

```css
const Box = styled.div`
  background-color: ${props => props.bgColor};
  width: 100px;
  height: 100px;
`
const Circle = styled(Box)`
  border-radius: 50px;
`
```

tag만 바꾸고 싶을 때

```css
const Btn = styled.button`
  color: white;
  background-color: tomato;
  border: 0;
  border-radius: 15px;
`

<Btn>Log in</Btn>
<Btn as="a" href="/">
```

tag의 속성을 넣고 싶을 때

```css
const Input = styled.input`
  background-color: tomato;
`
<Input required /> 

//위에꺼 대신

const InputRequired = styled.input.attrs({ required: true })`
  background-color: tomato;
`
<InputRequired />
```

애니메이션주기

```javascript
import styled, { keyframes } from 'styled-components'
```
```css
const animation = keyframes`
/* from{
    transform:rotate(0deg);
    border-radius:0px;
}
to{
    transform:rotate(360deg);
    border-radius:100px;
} */
0%{
    transform:rotate(0deg);
    border-radius:0px;
}
50%{
    transform:rotate(360deg);
    border-radius:100px;
}
100%{    transform:rotate(0deg);
    border-radius:0px;}
`

const Box = styled.div`
  animation: ${animation} 1s linear infinite;
`
```

pseudo selector (컴포넌트안의 컴포넌트 선택하기)

```css
<Box>
  <span>Hi</span>
</Box>

const Box = styled.div`
  height: 200px;
  width: 200px;
  background-color: tomato;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${animation} 1s linear infinite;
  span {
    font-size: 40px;
    &:hover {
      font-size: 70px;
    }
    &:active {
      opacity: 0;
    }
  }
  /* span:hover{}은 위의 &:hover{}과 같다 */
`

  <Box>
    {/* span은 styled components안에 있지 않지만 셀렉트 할 수 있음 */}
    <span>Hi</span>
  </Box>
```
```css
const Emoji = styled.span`
  font-size: 40px;
`

const Box = styled.div`
  height: 200px;
  width: 200px;
  background-color: tomato;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${animation} 1s linear infinite;
  ${Emoji} {
    &:hover {
      font-size: 70px;
    }
    &:active {
      opacity: 0;
    }
  }
`

<Box>
  <Emoji>Hi</Emoji>
</Box>
```

Theme (dark mode & light mode)

(다크모드와 라이트모드는 Theme와 local Estate Management의 합작으로 완성됨 local~은 나중에 배움)

```javascript
// index.js
import { ThemeProvider } from 'styled-components'

const darkTheme = {
  textColor: 'whitesmoke',
  backgroundColor: '#111',
}

const lightTheme = {
  textColor: '#111',
  backgroundColor: '#whitesmoke',
}

root.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <C />
    </ThemeProvider>
  </React.StrictMode>
)
```
```javascript
//C
const Title = styled.h1`
  color: ${props => props.theme.textColor};
`

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.backgroundColor};
`

function C() {
  return (
    <Wrapper>
      <Title>Hi</Title>
    </Wrapper>
  )
}
```
