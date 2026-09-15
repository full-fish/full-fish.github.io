---
title: "JS로 slack bot 사용하기 (invalid_auth 에러 해결 법)"
date: 2022-04-27 23:51:47 +0900
render_with_liquid: false
categories: ["코딩 공부", "공부"]
tags: ["bot", "slack", "slack bot", "invalid_auth"]
---

```javascript
await slack.slack("제목");
await slack.slack("내용");
```

**서버에 요청이 갈때마다 해당 요청정보를 slack 채널에 bot이 메시지를 보내는것을 구현하고자 함**

우선 새 워크스페이스를 개설한다

[https://slack.com/](https://slack.com/intl/ko-kr/)

[Slack은 미래의 업무가 이루어지는 곳입니다

Slack은 여러분의 팀과 소통할 새로운 방법입니다. 이메일보다 빠르고, 더 조직적이며, 훨씬 안전합니다.

slack.com](https://slack.com/intl/ko-kr/)

에 접속하여 새 워크스페이스 개설을 누르고 워크스페이스를 생성한다

그 후에 새 app을 만든다

<https://api.slack.com/apps>

[Slack API: Applications | Slack

Your Apps Don't see an app you're looking for? Sign in to another workspace.

api.slack.com](https://api.slack.com/apps)

로 접속해서 Create New App을 누른다음

App Name을 지정해주고 방금 생성한 워크스페이스와 연동시켜준다

![](/assets/images/tistory/78/img.png)

그리고 Bots을 선택한다

그 후에 Features-OAuth & Permissions로 간다

Scopes의 Bot Token Scopes에서

scope들을 허용해줘야하는데

공식문서에서 무엇을 허용해줘야하는지 나와있지만 최신화가 안되어있어서 스코프이름들이 다른게 많다

대체로 아래와 같은것들을 허용해준다

channel:read,

chat:write,

chat:write.public,

users:write

하지만 log기록용이라는 본래 취지에 맞게 남이 볼 수 없도록 나머지는 건드리지않고

chat:write만 허용해준다

허용해도 정상적으로 채널에 메시지가 가지 않는데

chat:write.public이 아니기에 현재 글쓸 권한이없기 때문이다

그러므로 해당 슬랙의 앱을 오른쪽 버튼으로 클릭해서 세부정보를 열어보면

이 앱을 채널에 추가가있는데 원하는 채널에 추가하면 된다

OAuth Tokens for Your Workspace에서 Bot User OAuth Token을 발행받는다 (권한 변경시마다 토큰 refresh해줘야함)

이제 만들어놓은 Slack에서 원하는 채널에 들어간 뒤 url을 보면 마지막에 C로 시작하는 문자열이있는데 그것이 채널의 아이디값이다

#### **코드**

구글링해보면 보이는 아래와 같은 코드는

```javascript
const Slack = require("slack-node");

const API_TOKEN = "Bot User OAuth Access Token";

const slack = new Slack(API_TOKEN);

const send = async (sender, message) => {
    slack.api(
        "chat.postMessage",
        {
            text: `${sender}:\n${message}`,
            channel: "#test",
            icon_emoji: "slack",
        },
        (error, response) => {
            if (error) {
                console.log(error);
                return;
            }
            console.log(response);
        }
    );
};

send("user1", "send message");
```

2021.2.24 이후로 Slack의 정책업데이트로 인해 라이브러리를 사용할 수 없어서 invalid\_auth에러가 난다

그러므로 Slack 공식문서인

<https://api.slack.com/methods>

[Web API methods | Slack

api.slack.com](https://api.slack.com/methods)

여기서 원하는 메소드의 사용법을 숙지해서 사용하자

단순 메시지를 보내는 chat.postMessage메소드의 경우에는

```javascript
const { WebClient, LogLevel } = require("@slack/web-api");
const client = new WebClient("xoxb-your-token", {
  logLevel: LogLevel.DEBUG
});
const channelId = "C12345";
try {
  const result = await client.chat.postMessage({
    channel: channelId,
    text: "Hello world"
  });
  console.log(result);
}
catch (error) {
  console.error(error);
}
```

위의 코드처럼

```css
npm install @slack/web-api
```

해당 명령어로 설치후에 사용하면된다

저같은 경우에는

```javascript
const { WebClient, LogLevel } = require("@slack/web-api");
const client = new WebClient(process.env.SLACK_BOT_API, {
  logLevel: LogLevel.DEBUG,
});
const channelId = process.env.SLACK_CHANNEL;
exports.slack = async (message) => {
  try {
    const result = await client.chat.postMessage({
      channel: channelId,
      text: message,
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};
```

해당 코드처럼 따로 파일을 만들어서 exports해주고

slack에 메시지 보낼곳에서 slack(message)로 호출해서 사용했다

사용할때 2줄 이상을 쓴다면

```javascript
await slack.slack("제목");
await slack.slack("내용");
```

처럼 비동기요청을 해줘야지 제목 내용순으로 나온다  (안해주면 제목이 빨랐다가 내용이 빨랐다가...)

**slack 적용**

[7일차 / Slack Bot

한 것 환경변수들 추가 develoment와 production 데이터베이스 이분화 코드 간결화 전체적인 refactory가 끝났다 이제 기본 골자는 잡혔으니까 백엔드팀원과 서로 구현하고 싶은것을 각자구현하고 merge

fullfish.tistory.com](https://fullfish.tistory.com/79?category=1053678)
