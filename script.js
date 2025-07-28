// 현재 날짜를 기준으로 달력 표시하기
const currentDate = new Date(); //오늘 날짜 정보 가져오기
const currentMonthElement = document.getElementById('current-month');   // 연/월 보여주는 부분 선택
const calendarGrid = document.getElementById('calendar-grid');  //달력 날짜를 넣을 영역 선택
const todoInput = document.getElementById('todo-input');    //할 일 입력란 선택
const addButton = document.getElementById('add-todo');  //추가 버튼 선택

//현재 표시할 연도와 월 저장 (월은 0부터 시작해서 1을 더해 표시)
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

//선택된 날짜와 수정중인 할 일 인덱스 저장용 변수 (초기에는 아무것도 선택 안 함)
let selectedDate = null; // 현재 선택된 날짜
let editIndex = null; // 수정 중인 TODO의 인덱스 (null이면 새 TODO 추가)

// 달력 화면을 그려주는 함수
function drawCalendar() {
    // 현재 연도와 월을 화면에 표시
    currentMonthElement.innerHTML = `${currentYear}年 ${currentMonth + 1}月`;

    // 이번 달 1일의 요일(0=일요일, 1=월요일 ...)을 구함
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    // 이번 달의 마지막 날짜(몇일까지 있는지) 구함
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

    // 달력 그리드 영역 초기화(내용 비우기)
    calendarGrid.innerHTML = '';

    // 이번 달 시작하기 전에 빈 칸(빈 <div>)을 요일 수만큼 추가
    for (let i = 0; i < firstDay; i++) {
        calendarGrid.innerHTML += '<div></div>';    //빈칸으로 요일 맞춤
    }

    // 날짜 숫자 칸들을 생성해서 달력에 추가
    for (let i = 1; i <= lastDate; i++) {
        const dateString = `${currentYear}-${currentMonth + 1}-${i}`;
        calendarGrid.innerHTML += `<div class="date" data-date="${dateString}">${i}</div>`;
    }

    // 각 날짜 칸에 클릭 이벤트를 등록해서 선택 가능하게 함
    document.querySelectorAll('.date').forEach(dateElement => {
        dateElement.addEventListener('click', (event) => {
            selectedDate = event.target.dataset.date;   //클릭된 날짜 저장
            editIndex = null; // 날짜 변경 시 수정 모드 해제
            todoInput.value = ''; // 입력란 초기화
            addButton.textContent = '追加'; // 추가 버튼 텍스트 초기화
            showTodoList(selectedDate); //선택한 날짜의 할 일 목록 표시
            todoInput.focus();  //입력란에 커서 자동 위치
            console.log(`Selected date: ${selectedDate}`); // 개발용: 선택도니 날짜 출력
        });
    });

    // 달력 높이에 따라 TODO 리스트(할 일 목록) 위치 동적 조정
    const calendarContainer = document.querySelector('.calendar-container');
    if (calendarContainer) {
        const calendarHeight = calendarContainer.offsetHeight;  //달력 높이 계산
        const todoListContainer = document.querySelector('.todo-list-container');
        if (todoListContainer) {
            //달력 아래쪽에 일정 간격을 두고 할 일 목록을 위치시킴
            todoListContainer.style.top = `${calendarHeight + 120}px`; // 달력 높이 + 상단 여백(100px) + 간격(20px)
        } else {
            console.error('todo-list-container not found for positioning');
        }
    } else {
        console.error('calendar-container not found for positioning');
    }
}

// 이전 월 버튼 클릭 시 실행되는 함수
document.getElementById('prev-month').addEventListener('click', () => {
    currentMonth--; // 월을 1 감소
    if (currentMonth < 0) { // 1월에서 이전 달 누르면 12월로 넘어가고 연도도 1년 감소
        currentMonth = 11;
        currentYear--;
    }
    drawCalendar(); //달력 다시 그림
});

// 다음 달 버튼 클릭 시 실행되는 함수
document.getElementById('next-month').addEventListener('click', () => {
    currentMonth++; // 월을 1 증가
    if (currentMonth > 11) {    // 12월에서 다음 달 누르면 1월로 넘어가고 연도 1 증가
        currentMonth = 0;
        currentYear++;
    }
    drawCalendar(); //달력 다시 그림
});

// 할일을 추가하거나 수정하는(TODO 추가/수정) 함수
function addTodo() {
    const newTodo = todoInput.value.trim(); //입력값 앞뒤 공백 제거
    if (newTodo && selectedDate) {  //입력값과 날짜가 있으면 실행
        const todos = getTodos(selectedDate);   //해당 날짜의 할 일 목록 불러오기
        if (editIndex !== null) {   //수정 모드인 경우
            todos[editIndex] = newTodo; //선택한 할 일 내용을 수정
            localStorage.setItem(`todos-${selectedDate}`, JSON.stringify(todos));   //저장
            editIndex = null; // 수정 모드 해제
            addButton.textContent = '追加'; // 버튼 텍스트 복원
        } else {    //추가 모드인 경우
            todos.push(newTodo);    // 새 할 일을 목록에 추가
            localStorage.setItem(`todos-${selectedDate}`, JSON.stringify(todos));   //저장
        }
        console.log(`Added/Updated todo for ${selectedDate}:`, todos); // 개발용: 할 일 저장 확인
        showTodoList(selectedDate); //목록 다시 표시
        todoInput.value = ''; // 입력란 초기화
        todoInput.focus();  //커서 다시 위치시키기
    } else {
        console.log('No todo or date selected'); // 입력 또는 날짜가 없을 때
    }
}

// 입력란에서 엔터키를 누르면 할 일 추가
todoInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addTodo();
    }
});

// 추가 버튼 클릭 시 할 일 추가/수정 함수 호출
addButton.addEventListener('click', addTodo);

// 선택한 날짜의 할 일 목록을(TODO 리스트) 화면에 보여주는 함수
function showTodoList(date) {
    const todoListContainer = document.getElementById('todo-list-container');
    if (!todoListContainer) {
        console.error('todo-list-container not found'); // 할 일 목록 영역이 없을 때
        return;
    }
    todoListContainer.innerHTML = ''; // 이전 목록 초기화

    const todos = getTodos(date);   //날짜별 할 일 목록 가져오기
    console.log(`Showing todos for ${date}:`, todos); // 개발용: 표시할 할 일 목록 출력
    
    //할 일마다 화면에 표시 및 수정, 삭제 버튼 추가
    todos.forEach((todo, index) => {
        const todoItem = document.createElement('div'); //할 일 항목 박스 생성
        todoItem.className = 'todo-item';   //CSS 클래스 지정

        const todoText = document.createElement('span');    //할 일 텍스트 영역 생성
        todoText.textContent = todo;    //텍스트 입력

        //수정, 삭제 버튼을 담을 컨테이너 생성
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'todo-buttons'; // 버튼 컨테이너 스타일 적용

        //수정 버튼 생성
        const editButton = document.createElement('button');
        editButton.className = 'edit-button';
        editButton.textContent = '修正';
        editButton.addEventListener('click', () => {
            todoInput.value = todo; //입력란에 수정할 내용 넣기
            editIndex = index;  //수정 중인 인덱스 저장
            addButton.textContent = '修正'; // 수정 모드에서 버튼 텍스트 변경
            todoInput.focus();  //입력란에 커서 위치
            console.log(`Editing todo at index ${index}: ${todo}`); // 개발용 로그
        });

        //삭제 버튼 생성
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = '削除';
        deleteButton.addEventListener('click', () => {
            console.log(`Attempting to delete todo at index ${index} for date ${date}`); // 삭제 시도 로그
            deleteTodo(date, index); // 삭제 함수 호출
            showTodoList(date); // 삭제 후 목록(TODO 리스트) 다시 갱신
        });

        // 버튼들 컨테이너에 추가
        buttonContainer.appendChild(editButton); // 수정 버튼 추가
        buttonContainer.appendChild(deleteButton); // 삭제 버튼 추가

        //할 일 텍스트와 버튼들을 할 일 항목에 추가
        todoItem.appendChild(todoText); // 텍스트 추가
        todoItem.appendChild(buttonContainer); // 버튼 컨테이너 추가

        //할 일 목록 컨테이너에 항목 추가
        todoListContainer.appendChild(todoItem); // TODO 항목 추가
    });
}

//로컬 저장소에서 날짜별 할 일 목록(TODO 목록)을 가져오는 함수
function getTodos(date) {
    const todos = localStorage.getItem(`todos-${date}`);    //저장된 문자열 가져오기
    return todos ? JSON.parse(todos) : [];  //없으면 빈 배열 반환
}

// 날짜별 할 일을 삭제(TODO 삭제하기)하는 함수
function deleteTodo(date, index) {
    const todos = getTodos(date);   //현재 할 일 목록 불러오기
    if (index >= 0 && index < todos.length) { // 인덱스 유효성 확인
        todos.splice(index, 1); // 해당 인덱스 항목(선택된 TODO) 제거
        localStorage.setItem(`todos-${date}`, JSON.stringify(todos)); // 수정된 목록 저장
        console.log(`Deleted todo at index ${index} for date ${date}. New todos:`, todos); // 삭제 후 로그
    } else {
        console.error(`Invalid index ${index} for date ${date}`); // 인덱스가 잘못된 경우 오류 출력
    }
}

// 페이지가 처음 열릴 때 달력 표시 함수 호출
drawCalendar();