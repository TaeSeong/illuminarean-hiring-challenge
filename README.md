# illuminarean QA Engineer 사전 과제

Playwright를 활용한 프로젝트입니다.

Playwright 외 아래의 라이브러리를 추가로 사용하였습니다.

- faker.js : 임의의 테스트 값 생성 시 사용


### 테스트 환경

- 해상도 : 1920 X 1080
- 디바이스 : 데스크톱
- 브라우저 : Chrome, Firefox, Safari
- 테스팅 도구 : playwright

### 테스트 목표

- 아래의 절차를 수행
  - 일루미나리안 사이트 (https://illuminarean.com/) ＞ [Work] ＞ [GOODVIBE WORKS 바로가기] ＞ [무료체험신청] > 내용 입력 ＞ 신청 취소
- 담당 업무 리스트에서 클릭으로 1개, 검색으로 1개 선택
- 그 외 내용은 자유롭게 채워 넣음
- 무료 이용 신청 버튼은 클릭하지 않음

### 테스트 순서도

![flowchart_right](https://github.com/TaeSeong/illuminarean-hiring-challenge/assets/7597961/9950734a-8441-4e88-ac8f-6bd4ccad5efa)


### 테스트 실행 화면
- playwright-video 라이브러리를 이용

https://github.com/TaeSeong/illuminarean-hiring-challenge/assets/7597961/edacf4a0-1d87-4236-8844-c93901b8847f


### Playwright 실행 화면

https://github.com/TaeSeong/illuminarean-hiring-challenge/assets/7597961/cc7fc8c6-8b87-4ceb-bc98-f73950dfdac5



### Playwright UI 실행 화면

https://github.com/TaeSeong/illuminarean-hiring-challenge/assets/7597961/61cd06a6-f61c-43fd-a34c-d91a8340669d


### 테스트 코드 개발 환경

- node 21.4.0
- playwright 1.42.1
- faker 6.6.6

### 실행 방법

```
npm install @playwright/1.42.1
npm install @faker/6.6.6

npx playwright test
```



