# Jest 프론트엔드 유닛 테스트 시작하기

이 프로젝트는 빌드 도구 없이 실행되는 HTML/CSS/JavaScript 앱입니다. 회전과 낙하 속도 계산은 `game-logic.js` 모듈로 분리되어 있으며, `game.html`과 Jest 테스트가 같은 함수를 사용합니다. Jest로 게임 규칙 같은 순수 JavaScript 로직을 검증하고, 필요하면 `jsdom` 환경을 추가해 DOM 동작도 테스트할 수 있습니다.

## 1. macOS에 Node.js 설치

Node.js 웹사이트에서 **LTS** 버전의 macOS 설치 파일(`.pkg`)을 내려받아 설치합니다.

- 공식 다운로드: <https://nodejs.org/en/download>
- Mac 칩에 맞는 설치 파일(Apple silicon 또는 Intel)을 선택합니다.
- 설치가 끝나면 터미널을 새로 열고 버전을 확인합니다.

```sh
node --version
npm --version
```

두 명령 모두 버전 번호를 출력하면 준비가 끝난 것입니다. Homebrew가 이미 설치되어 있다면 대신 다음 명령으로 설치할 수도 있습니다.

```sh
brew install node
```

## 2. 프로젝트에 Jest 설치

테스트를 추가할 저장소 폴더로 이동합니다.

```sh
cd ~/work/tetris
```

아직 `package.json`이 없는 경우 npm 프로젝트를 초기화하고 Jest를 개발 의존성으로 설치합니다.

```sh
npm init -y
npm install --save-dev jest
```

이미 `package.json`이 있다면 `npm init -y`는 생략하고 설치 명령만 실행합니다. `test` 명령을 등록합니다.

```sh
npm pkg set scripts.test="jest"
```

DOM 테스트를 추가할 때만 아래 패키지도 설치합니다.

```sh
npm install --save-dev jest-environment-jsdom @testing-library/dom
```

## 3. Jest 환경 설정

프로젝트 루트에 `jest.config.cjs` 파일을 만들고 아래 설정을 넣습니다.

```js
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  clearMocks: true,
};
```

순수 게임 로직 테스트는 Node 환경에서 동작합니다. DOM 테스트 파일에는 `/** @jest-environment jsdom */` 주석을 추가해 해당 파일만 `jsdom` 환경에서 실행할 수 있습니다. `jsdom`은 실제 브라우저가 아니므로 화면 레이아웃, Canvas 렌더링, WebAudio 재생은 Jest로 검증하지 않습니다.

## 4. 게임 로직을 모듈로 분리

`game-logic.js`는 `rotate(piece, collides)`와 `getDropInterval(level)`을 내보내며, 브라우저에서는 `game.html`이 이 파일을 먼저 불러옵니다. Jest는 같은 모듈을 `require`해 블록 회전·벽 밀기와 레벨별 낙하 간격을 검사합니다. 새 게임 규칙도 화면 코드와 분리된 순수 함수로 이 모듈에 추가하면 단위 테스트를 작성하기 쉽습니다.

```js
const { rotate } = require("../game-logic");
```

브라우저 코드는 이 함수를 전역 `TetrisLogic.rotate`로 호출하고, Node/Jest에서는 CommonJS 모듈로 불러옵니다.

## 5. 첫 단위 테스트 작성

회전 테스트는 `tests/rotate.test.js`, 속도 테스트는 `tests/speed.test.js`에 있습니다. 회전 테스트는 행렬 회전, 충돌 시 벽 밀기, 모든 후보 위치에서 충돌할 때 원본 상태 유지를 검사합니다. 속도 테스트는 레벨 1~10에서 간격이 `[800, 704, 620, 545, 480, 422, 372, 327, 288, 253]`ms로 줄어드는지, 최소 110ms 제한과 잘못된 레벨의 기본 처리를 확인합니다.

```js
const { rotate } = require("../game-logic");

test("블록을 시계 방향으로 회전한다", () => {
  const piece = { matrix: [[1, 0], [1, 1]], x: 4, y: 7 };

  expect(rotate(piece, () => false)).toBe(true);
  expect(piece.matrix).toEqual([[1, 1], [1, 0]]);
});
```

Jest를 실행합니다.

```sh
npm test
```

파일을 감시하며 수정할 때마다 실행하려면:

```sh
npm test -- --watch
```

테스트 파일 이름은 `*.test.js` 또는 `*.spec.js`로 지정합니다. 첫 테스트를 만들기 전에는 Jest가 실행할 테스트를 찾지 못해 실패하는 것이 정상입니다.

## 6. 저장소에 포함할 파일

`package.json`, `package-lock.json`, Jest 설정, 테스트 파일은 Git에 커밋합니다. `node_modules`와 테스트 결과 폴더는 커밋하지 않습니다. `.gitignore`에 다음 항목을 추가합니다.

```gitignore
node_modules/
coverage/
```

GitHub Pages의 정적 앱 실행에는 Node.js가 필요하지 않습니다. Node.js와 Jest는 개발·테스트 용도이며, Pages에는 `index.html`과 `game.html` 같은 앱 파일을 계속 배포하면 됩니다.
