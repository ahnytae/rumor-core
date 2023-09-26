# Real-time Motion Detection API

Real-time Motion Detection API는 WebRTC와 Pose Detection을 기반으로 한 웹 기반 API입니다. 이 API를 사용하면 웹 브라우저에서 실시간 모션 감지를 수행할 수 있습니다. (prototype)

## 기능

- requestAnimationFrame을 이용해 프레임마다 실시간 모션감지
- socket을 사용해 모션 데이터들을 전송
- 사설 TURN 서버 이용해 wifi/모바일 데이터 가능한 1:1 화상 연결

## Preview
### Motion 감지 영상
![Motion 동작 영상](https://github.com/ahnytae/rumor-core/assets/62460298/3ac074ba-ad72-4cda-a105-3a589c5bc94e)

### 방 생성 - 모션 동작까지 전체 데모 영상
[![동영상](https://github.com/ahnytae/rumor-core/blob/main/assets/62460298/52bf54ec-02b5-477c-a0a6-9c3c51145bfd.mp4)](https://github.com/ahnytae/rumor-core/blob/main/assets/62460298/52bf54ec-02b5-477c-a0a6-9c3c51145bfd.mp4)

## API Docs

[API Reference 노션 링크](https://berry-talk-143.notion.site/Reference-Method-3873db24d49d457981e3fbfdcd9f122a?pvs=4)

## 설치

```bash
yarn add rumor-core
```

## 배포

      +-------------+
      |     User    |
      +-------------+
              |
              v
     +--------+----------+
     |     EC2 서버       |
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
