# Real-time Motion Detection API

Real-time Motion Detection API는 WebRTC와 Pose Detection을 기반으로 한 웹 기반 API입니다. 이 API를 사용하면 웹 브라우저에서 실시간 모션 감지를 수행할 수 있습니다. (prototype)

## 기능

- 1:1 방 생성 / 방 입장 후 영상통화
- 본인, 원격 장치 on/off 기능
- 실시간 모션 감지 및 랜더링 (본인, 원격 실시간 동기화)

## API Docs

[API Reference 노션 링크](https://berry-talk-143.notion.site/Reference-Method-3873db24d49d457981e3fbfdcd9f122a?pvs=4)

## 설치

```bash
yarn add rumor-core
```

## 클라우드 (NCP)

      +-------------+
      |     User    |
      +-------------+
              |
              |
              v
     +--------+----------+
     |     EC2 서버       |
     |    (웹 애플리케이션)  |
     |   +------------+  |
     |   |   Nginx    |  |
     |   |   +------+ |  |
     |   |   | Express|  |
     |   |   +------+ |  |
     |   +------------+  |
     +--------^----------+

## 추가 될 기능

- Frontend 구축
- 방 입장/정보 api 개선 및 nest.js로 마이그레이션
- logger 클래스 추가
- Motion 속도 최적화
