// 현재 날짜를 기준으로 달력 표시하기
const currentDate = new Date();
const currentMonthElement = document.getElementById('current-month');
const calendarGrid = document.getElementById('calendar-grid');
const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('add-todo');

let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let selectedDate = null; // 현재 선택된 날짜
let editIndex = null; // 수정 중인 TODO의 인덱스 (null이면 새 TODO 추가)

// 달력 그리기
function drawCalendar() {
    // 현재 월과 년도 업데이트
    currentMonthElement.innerHTML = `${currentYear}年 ${currentMonth + 1}月`;

    // 첫 날과 마지막 날 계산
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

    // 그리드 초기화
    calendarGrid.innerHTML = '';

    // 첫 주 시작까지 빈 칸 추가
    for (let i = 0; i < firstDay; i++) {
        calendarGrid.innerHTML += '<div></div>';
    }

    // 날짜 추가
    for (let i = 1; i <= lastDate; i++) {
        const dateString = `${currentYear}-${currentMonth + 1}-${i}`;
        calendarGrid.innerHTML += `<div class="date" data-date="${dateString}">${i}</div>`;
    }

    // 날짜 클릭 이벤트 추가
    document.querySelectorAll('.date').forEach(dateElement => {
        dateElement.addEventListener('click', (event) => {
            selectedDate = event.target.dataset.date;
            editIndex = null; // 날짜 변경 시 수정 모드 해제
            todoInput.value = ''; // 입력란 초기화
            addButton.textContent = '追加'; // 추가 버튼 텍스트 초기화
            showTodoList(selectedDate);
            todoInput.focus();
            console.log(`Selected date: ${selectedDate}`); // 디버깅: 선택된 날짜
        });
    });

    // 달력 높이에 따라 TODO 리스트 위치 동적 조정
    const calendarContainer = document.querySelector('.calendar-container');
    if (calendarContainer) {
        const calendarHeight = calendarContainer.offsetHeight;
        const todoListContainer = document.querySelector('.todo-list-container');
        if (todoListContainer) {
            todoListContainer.style.top = `${calendarHeight + 120}px`; // 달력 높이 + 상단 여백(100px) + 간격(20px)
        } else {
            console.error('todo-list-container not found for positioning');
        }
    } else {
        console.error('calendar-container not found for positioning');
    }
}

// 이전 월, 다음 월 버튼 클릭 시
document.getElementById('prev-month').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    drawCalendar();
});

document.getElementById('next-month').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    drawCalendar();
});

// TODO 추가/수정 함수
function addTodo() {
    const newTodo = todoInput.value.trim();
    if (newTodo && selectedDate) {
        const todos = getTodos(selectedDate);
        if (editIndex !== null) {
            // 수정 모드
            todos[editIndex] = newTodo;
            localStorage.setItem(`todos-${selectedDate}`, JSON.stringify(todos));
            editIndex = null; // 수정 모드 해제
            addButton.textContent = '追加'; // 버튼 텍스트 복원
        } else {
            // 추가 모드
            todos.push(newTodo);
            localStorage.setItem(`todos-${selectedDate}`, JSON.stringify(todos));
        }
        console.log(`Added/Updated todo for ${selectedDate}:`, todos); // 디버깅: 저장된 TODO 확인
        showTodoList(selectedDate);
        todoInput.value = ''; // 입력란 초기화
        todoInput.focus();
    } else {
        console.log('No todo or date selected'); // 디버깅: 입력값 또는 날짜 누락
    }
}

// 엔터키 입력 이벤트
todoInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addTodo();
    }
});

// 추가 버튼 클릭 이벤트
addButton.addEventListener('click', addTodo);

// TODO 리스트 보여주기
function showTodoList(date) {
    const todoListContainer = document.getElementById('todo-list-container');
    if (!todoListContainer) {
        console.error('todo-list-container not found'); // 디버깅: 컨테이너 누락
        return;
    }
    todoListContainer.innerHTML = ''; // 기존 내용 지우기

    const todos = getTodos(date);
    console.log(`Showing todos for ${date}:`, todos); // 디버깅: 표시할 TODO 목록
    todos.forEach((todo, index) => {
        const todoItem = document.createElement('div');
        todoItem.className = 'todo-item';

        const todoText = document.createElement('span');
        todoText.textContent = todo;

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'todo-buttons'; // 버튼 컨테이너 스타일 적용

        const editButton = document.createElement('button');
        editButton.className = 'edit-button';
        editButton.textContent = '修正';
        editButton.addEventListener('click', () => {
            todoInput.value = todo;
            editIndex = index;
            addButton.textContent = '修正'; // 수정 모드에서 버튼 텍스트 변경
            todoInput.focus();
            console.log(`Editing todo at index ${index}: ${todo}`); // 디버깅: 수정 모드
        });

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = '削除';
        deleteButton.addEventListener('click', () => {
            console.log(`Attempting to delete todo at index ${index} for date ${date}`); // 디버깅: 삭제 시도
            deleteTodo(date, index); // 삭제 함수 호출
            showTodoList(date); // TODO 리스트 갱신
        });

        buttonContainer.appendChild(editButton); // 수정 버튼 추가
        buttonContainer.appendChild(deleteButton); // 삭제 버튼 추가
        todoItem.appendChild(todoText); // 텍스트 추가
        todoItem.appendChild(buttonContainer); // 버튼 컨테이너 추가
        todoListContainer.appendChild(todoItem); // TODO 항목 추가
    });
}

// 날짜별 TODO 목록 가져오기
function getTodos(date) {
    const todos = localStorage.getItem(`todos-${date}`);
    return todos ? JSON.parse(todos) : [];
}

// TODO 삭제하기
function deleteTodo(date, index) {
    const todos = getTodos(date);
    if (index >= 0 && index < todos.length) { // 인덱스 유효성 확인
        todos.splice(index, 1); // 선택된 TODO 제거
        localStorage.setItem(`todos-${date}`, JSON.stringify(todos)); // 갱신된 목록 저장
        console.log(`Deleted todo at index ${index} for date ${date}. New todos:`, todos); // 디버깅: 삭제 후 목록
    } else {
        console.error(`Invalid index ${index} for date ${date}`); // 디버깅: 잘못된 인덱스
    }
}

// 페이지 로드 시 달력 그리기
drawCalendar();