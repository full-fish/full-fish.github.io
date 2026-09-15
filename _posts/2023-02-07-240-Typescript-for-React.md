---
title: "Typescript for React"
date: 2023-02-07 23:29:51 +0900
render_with_liquid: false
categories: ["nomadcoder", "React JS 마스터클래스"]
tags: ["TypeScript", "react"]
---

```typescript
npx create-react-app 내 앱 이름 --template typescript
npm i --save-dev @유형/styled-components
npm i styled-components
```
```typescript
// index에서 root에러가 난다면
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
//이렇게 수정
```

interface : object shape(객체모양)을 TypeScript에게 설명해주는 개념

```typescript
interface PlayerShape {
  name: string
  age: number
}
const sayHello = (playerObj: PlayerShape) => `Hello ${playerObj.name} you are ${playerObj.age} years old.`
sayHello({ name: 'manseon', age: 10 })
```
```typescript
const Container = styled.div<ContainerProps>`
  width: 200px;
  height: 200px;
  background-color: ${props => props.bgColor};
  border-radius: 100px;
`

interface ContainerProps {
  bgColor: string
}

interface CircleProps {
  bgColor: string
}

function Circle({ bgColor }: CircleProps) {
  return <Container bgColor={bgColor} />
}
```

props 타입 지정

```typescript
interface DummyProps {
  text: string
  otherThingHere?: boolean
}
function Dummy({ text, otherThingHere }: DummyProps) {
  return <H1>{text}</H1>
}

 <Dummy text="4444"></Dummy>
```

event

```typescript
  const [value, setValue] = useState('')
  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    // const {
    //   currentTarget: { value },
    // } = event
    // setValue(value)
    setValue(event.currentTarget.value)
  }
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log('hello', value)
  }
  
    <form onSubmit={onSubmit}>
        <input value={value} onChange={onChange} type="text" placeholder="username" />
        <button>Log in</button>
    </form>
    
    //onClick같은건 React.MouseEvent<HTMLButtonElement>
```

타입스크립트에서의 라이브러리의 경우

```typescript
npm i --save-dev @types/라이브러리이름
```

SyntheticEvent : <https://reactjs.org/docs/events.html>

[SyntheticEvent – React

A JavaScript library for building user interfaces

reactjs.org](https://reactjs.org/docs/events.html)

**Enum (enumerable)**

열거형은 TypeScript가 제공하는 기능 중 하나입니다.  
enum은 열거형으로 이름이 있는 상수들의 집합을 정의할 수 있습니다.  
열거형을 사용하면 의도를 문서화 하거나 구분되는 사례 집합을 더 쉽게 만들수 있습니다. TypeScript는 숫자와 문자열-기반 열거형을 제공합니다.

```typescript
enum Categories {
  'TO_DO' = 'TO_DO',
  'DOING' = 'DOING',
  'DONE' = 'DONE',
}
```

기본값이 0, 1, 2 이런식으로 들어가서 따로 할당해준것
