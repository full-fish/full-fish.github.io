---
title: "react-hook-form"
date: 2023-02-14 23:22:42 +0900
render_with_liquid: false
categories: ["nomadcoder", "React JS 마스터클래스"]
tags: ["react-hook-form", "react hook form"]
---

사용하기 쉬운 유효성 검사를 통해 성능이 뛰어나고 유연하며 확장 가능한 form입니다.

```javascript
npm i react-hook-form
```

아래 처럼 쓰면 저런 객체가 만들어짐

```javascript
const {register} = useForm()
console.log(register('toDo'))
```

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/245/img.png)


onBlur는 input바깥을 클릭했을 때

**watch**는 값을 추적함 (state를 만들고 onCahge함수를 만들고 input에 props를 주는것과 같음)

```javascript
const { register, watch } = useForm()
console.log(watch)
```

예를 들어 여러개의 from이 있을때

원래는 하나하나 state만들고 그랬어야하는데

```javascript
function ToDoList() {
  const { register, watch } = useForm()
  console.log(watch())
  return (
    <div>
      <form>
        <input {...register('email')} placeholder="Email" />
        <input {...register('firstName')} placeholder="First Name" />
        <input {...register('lastName')} placeholder="Last Name" />
        <input {...register('username')} placeholder="Username" />
        <input {...register('password')} placeholder="Password" />
        <input {...register('password1')} placeholder="Password1" />
        <button>Add</button>
      </form>
    </div>
  )
}
```

이런식으로 쓰면

watch로 모든 값을 볼 수 있음

![](https://pub-3698f907d1774dd4aa55a0831cb166dd.r2.dev/tistory/245/img_1.png)

**handleSubmit** : validation담당함 event preventDefalut도 함. 해야 하는 모든 일을 끝마치고 데이터가 유효하면 onValid 함수 호출

```typescript
  const { register, watch, handleSubmit } = useForm()
  
  <form onSubmit={handleSubmit(onValid, onInvalid)}>
```

onValid : 데이터 유효할 때 실행되는 함수 (필수)

onInvalid : 데이터 유효하지 않을 때 실행되는 함수 (옵션)

```html
function ToDoList() {
  const { register, handleSubmit, formState } = useForm()
  const onValid = (data: any) => {
    console.log(data)
  }
  console.log(formState.errors)
  return (
    <div>
      <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit(onValid)}>
        <input {...register('email', { required: true })} placeholder="Email" />
        <input {...register('firstName', { required: true })} placeholder="First Name" />
        <input {...register('lastName', { required: true })} placeholder="Last Name" />
        <input {...register('username', { required: true, minLength: 10 })} placeholder="Username" />
        <input {...register('password', { required: true, minLength: 5 })} placeholder="Password" />
        <input
          {...register('password1', {
            required: 'Password is required',
            minLength: {
              value: 5,
              message: 'Your password is too short.',
            },
          })}
          placeholder="Password1"
        />
        <button>Add</button>
      </form>
    </div>
  )
}
```

required에 message 줄 수 있고

minLength같은것도 message 줄 수 있다

```html
<input {...register('email')} required placeholder="Email" />
<input {...register('email', { required: true })} placeholder="Email" />

// 두개가 같지만 전자는 html의 기능으로써 안쓴다면 html자체에서 안썼다고 경고창을 띄워줌
// 하지만 html을 수정해서 required를 지우면 submit을 할 수 있음
// 그래서 html에 의지하지않고 js에 쓰는방법인 아래처럼 써주는게 안전함
```

유효하지 않으면 유효하지않은 가장 처음의 form으로 자동으로 화면이 이동됨

**formState**

```html
  const { register, handleSubmit, formState } = useForm()
  console.log(formState.errors)
  
  // 어떤 form이 어떠한 error를 일으키는지 알 수 있다
```

**pattern**: 정규식 사용 가능

```html
// 이렇게 해도 되고
pattern: /^[A-Za-z0-9._%+-]+@naver.com$/
// 객체로 해도 됨
pattern: {
  value: /^[A-Za-z0-9._%+-]+@naver.com$/,
  message: 'Only naver.com emails allowed',
},
```

**typescrtypt**

```typescript
interface IForm {
  email: string
  firstName: string
  lastName: string
  username: string
  password: string
  password1: string
}
const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>({
    defaultValues: {
      email: '@naver.com',
    },
  })
```

그리고 위의 defaultValues에 저런식으로 쓰면

email의 초기값을 줄 수 있음

**setError**

```typescript
  // 이건 setError와 handleSubmint으로 error custom하는거
  const { setError } = useForm()
  
  const onValid = (data: IForm) => {
    if (data.password !== data.password1) {
      setError('password1', { message: 'Password are not the same' }, { shouldFocus: true })
    }
    // setError("extraError", { message: "Server offline." });
  }
  
 // 이건 기본적인 from자체에서 error custom하는거
 <input
    {...register('firstName', {
      required: 'write here',
      validate: {
        noNico: value => (value.includes('nico') ? 'no nicos allowed' : true),
        noNick: value => (value.includes('nick') ? 'no nick allowed' : true),
      },
    })}
    placeholder="First Name"
 />
```

**setValue**: submit시 input값 초기화

```typescript
const { setError } = useForm()

const onValid = (data: IForm) => {
  setValue('toDo', '')
}
```
