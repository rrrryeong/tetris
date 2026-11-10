# GitHub Pages 배포 가이드

이 프로젝트는 빌드 과정 없이 정적 HTML로 동작합니다. 랜딩 페이지 `index.html`과 게임 `game.html`을 저장소 루트에 올리면 GitHub Pages에서 바로 서비스할 수 있습니다.

## 1. 앱 파일을 `~/work/tetris`로 복사

아래 명령은 현재 프로젝트 폴더(`/Users/ryeong/work/vibe/day11/tetris`)에서 실행합니다. 앱과 실행 안내만 복사합니다.

```sh
mkdir -p ~/work/tetris
cp index.html game.html game-logic.js README.md JEST.md GITHUB_PAGES.md jest.config.cjs ~/work/tetris/
cp -R tests ~/work/tetris/
cd ~/work/tetris
```

`index.html`, `game.html`, `game-logic.js`는 서로 상대 경로로 연결되어 있으므로 같은 폴더에 둡니다. `AGENTS.md`와 `WORKFLOW.md`는 대화 기록과 작업 지침이므로 공개 저장소에 복사하지 않습니다.

## 2. SSH 키로 GitHub 인증

이미 GitHub에 등록한 SSH 키가 있으면 키 생성 단계를 건너뛰고 `ssh -T`로 연결을 확인합니다. 새 키가 필요한 경우 기존 키를 덮어쓰지 않도록 먼저 확인합니다.

```sh
ls -l ~/.ssh/id_ed25519 ~/.ssh/id_ed25519.pub
```

키가 없으면 macOS 터미널에서 새 키를 만듭니다.

```sh
ssh-keygen -t ed25519 -C "GitHub SSH key"
```

저장 위치를 물으면 기본값 `~/.ssh/id_ed25519`를 사용합니다. 같은 경로에 키가 이미 있다면 새 키를 덮어쓰지 말고 기존 키를 사용하거나 다른 파일명을 지정합니다.

SSH 에이전트에 키를 등록하고 공개 키를 클립보드에 복사합니다.

```sh
eval "$(ssh-agent -s)"
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
pbcopy < ~/.ssh/id_ed25519.pub
```

GitHub에서 **Settings → SSH and GPG keys → New SSH key**로 이동해 복사한 공개 키를 등록합니다. 공개 키 파일(`.pub`)만 등록하고 개인 키 파일은 공유하거나 업로드하지 않습니다.

연결을 확인합니다.

```sh
ssh -T git@github.com
```

처음 연결할 때 GitHub 호스트 키 지문을 확인하라는 메시지가 나오면 GitHub의 공식 SSH 안내에 게시된 지문과 비교한 뒤 진행합니다. 정상 인증 시 `Hi rrrryeong! You've successfully authenticated...`와 비슷한 응답이 나옵니다. GitHub SSH는 셸 접속을 제공하지 않으므로 셸이 없다는 뒤쪽 안내는 정상입니다.

## 3. GitHub 저장소와 연결하고 푸시

GitHub 계정 `rrrryeong`으로 로그인해 `tetris`라는 새 저장소를 만듭니다. 아래 첫 푸시 절차를 그대로 따를 경우 저장소 초기화 옵션(README, `.gitignore`, 라이선스)은 선택하지 않아야 로컬 저장소와 충돌하지 않습니다.

프로젝트 폴더에서 Git 저장소를 초기화하고 첫 커밋을 푸시합니다.

```sh
cd ~/work/tetris
git init -b main
git add index.html game.html game-logic.js README.md GITHUB_PAGES.md JEST.md jest.config.cjs tests/
git commit -m "Prepare Tetris for GitHub Pages"
git remote add origin git@github.com:rrrryeong/tetris.git
git push -u origin main
```

`origin`이 이미 설정되어 있으면 `git remote add` 대신 주소를 확인하거나 갱신합니다.

```sh
git remote -v
git remote set-url origin git@github.com:rrrryeong/tetris.git
```

저장소에 이미 커밋이 들어 있다면 푸시 전에 기존 내용을 가져와 병합해야 할 수 있습니다. 인증 오류가 나면 SSH 공개 키 등록과 `git remote -v`의 주소가 `git@github.com:rrrryeong/tetris.git`인지 확인합니다.

## 4. GitHub Pages 켜기

GitHub의 `rrrryeong/tetris` 저장소에서 **Settings → Pages**를 엽니다.

1. **Build and deployment**의 **Source**에서 **Deploy from a branch**를 선택합니다.
2. Branch를 `main`, 폴더를 `/(root)`로 지정합니다.
3. **Save**를 누릅니다.
4. 저장소의 **Actions** 탭에서 Pages 배포 작업이 완료될 때까지 기다립니다.

배포가 완료되면 사이트 주소는 다음과 같습니다.

```text
https://rrrryeong.github.io/tetris/
```

사이트에 접속하면 랜딩 페이지가 열립니다. **플레이 시작**을 누르면 같은 Pages 사이트의 `game.html`로 이동합니다. 반영까지 몇 분 걸릴 수 있습니다.

## 5. 이후 변경사항 배포

`~/work/tetris`에서 파일을 수정한 뒤 변경된 파일을 커밋하고 푸시합니다.

```sh
cd ~/work/tetris
git add index.html game.html game-logic.js README.md GITHUB_PAGES.md JEST.md jest.config.cjs tests/
git commit -m "Update Tetris app"
git push
```

GitHub Actions의 Pages 배포 작업이 완료되면 같은 사이트 주소에 변경사항이 반영됩니다. GitHub Pages에 올라간 저장소와 사이트는 공개될 수 있으므로 비밀 키나 개인 정보를 커밋하지 않습니다.
