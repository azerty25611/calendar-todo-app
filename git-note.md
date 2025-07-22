git과 VS Code를 연동해서 프로젝트를 버전 관리하려면 다음 순서로 진행하면 됨.
한 번만 설정해두면 이후에 매우 편하게 사용 가능.

처음에 TERMINAL (Ctrl+` 또는 위의 메뉴에서 Terminal 생성)에서 Command Prompt로 들어가기.

1. Git 설치 확인
git --version

버전이 나오면 설치 완료
안 나올 경우 https://git-scm.com에서 Git 설치

2. Git 초기화
git init

현재 폴더에 .git이라는 숨김 폴더가 생김 ( 이 폴더가 Git 저장소 역할)

3. 사용자 정보 설정 (처음 한 번만)
git config --global user.name "당신의 이름"
git config --global user.email "당신의 이메일"

Git 커밋할 때 작성자로 등록됨.
--global을 붙이면 컴퓨터 전체에서 동일한 정보를 씀.

4. VS Code 연동 방법

옵션 A: VS Code에서 Git UI 사용
--1 VS Code 열기
--2 왼쪽 사이드바의 소스 제어 (Source Control) 탭 클릭 (🔃 모양)
--3 "변경 사항" 목록에 파일이 뜨면 Git이 연동된 것

옵션 B: 터미널에서 직접 명령어 사용
git add .
git commit -m "첫 커밋"

.은 모든 파일을 Git에 추가하겠다는 뜻
-m은 커밋 메시지를 붙이는 옵션

5. GitHub와 연결하고 싶을 경우 (선택)

--1 GitHub에 새 레포지토리 생성
--2 아래 명령어로 원격 저장소 연결

git remote add origin https://github.com/사용자명/저장소이름.git
git push -u origin main

※main대신 master일 수도 있으니 오류 나면 git branch로 확인


★ 마무리 예시 ★
git init
git add .
git commit -m "처음 커밋"

#원격 저장소 연결할 경우 ↓
git remote add origin https://github.com/사용자명/저장소명.git
git push -u origin main


★★ 추가적인 내용 ★★
변경된 파일 상태 확인   git status
특정 파일만 추가       git add 파일이름
이전 커밋 기록 보기     git log
파일 변경 내역 보기     git diff


만약 GitHub에서 기본 브랜치를 main으로 바꾸고 싶다면?
git branch -m master main         # 브랜치 이름 변경
git push -u origin main           # 새 이름으로 푸시
git push origin --delete master   # (선택) 기존 master 삭제

--------------------------------------------------------------------

★★★ 만약 "원격(GitHub) 저장소에 로컬에 없는 내용이 이미 있으므로, 강제로 push할 수 없습니다" 라는 에러 메시지가 뜰 경우, GitHub 저장소에 이미 README 같은 파일이 있거나, 누군가가 먼저 커밋을 했기 때문에 로컬 커밋을 그냥 푸시하면 충돌 위험이 있어서 Git이 막는 것임.


해결 방법 2가지 (상황에 따라 선택)

● ● ● 방법 1.pull 해서 병합한 후 푸시 (권장)

git pull origin main --rebase
git push -u origin main

이 방식은 GitHub에 이미 있는 커밋(ex: README.md)을 로컬에 병합한 후 push하는 안전한 방법.

● ● ● 방법 2.강제로 덮어쓰기 (--force)
GitHub에 있는 파일이 완전히 사라짐. (예: README.md 초기화됨)

git push -u origin main --force

강제로 로컬 상태를 GitHub 저장소에 덮어쓰기 함.
GitHub에서 만들었던 README 같은 게 있다면 사라짐.