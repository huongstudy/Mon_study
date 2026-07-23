// 1. Tự động đổi lời chào theo giờ
const greetingElement = document.getElementById('greeting');
const currentHour = new Date().getHours();

if (currentHour >= 5 && currentHour < 12) {
  greetingElement.innerText = "☀️ Chào buổi sáng, Hương!";
} else if (currentHour >= 12 && currentHour < 18) {
  greetingElement.innerText = "🌤️ Chào buổi chiều, Hương!";
} else {
  greetingElement.innerText = "🌙 Chào buổi tối, Hương!";
}

// 2. Điểm danh
const checkinBtn = document.querySelector('.checkin-btn');
checkinBtn.addEventListener('click', function() {
  alert('🎉 Chúc mừng Hương đã điểm danh thành công ngày hôm nay!');
  this.innerText = '✅ Đã điểm danh';
  this.style.background = '#22c55e';
  this.disabled = true;
});

// 3. Quản lý Ghi chú + Bộ nhớ Trình duyệt (LocalStorage)
const noteInput = document.getElementById('noteInput');
const addNoteBtn = document.getElementById('addNoteBtn');
const notesList = document.getElementById('notesList');

let savedNotes = JSON.parse(localStorage.getItem('mon_notes')) || [];

function renderNotes() {
  notesList.innerHTML = '';
  savedNotes.forEach((note, index) => {
    const li = document.createElement('li');
    if (note.completed) li.classList.add('completed');
    
    li.innerHTML = `
      <span>${note.text}</span>
      <div class="note-actions">
        <button class="btn-done" onclick="toggleDone(${index})">✓</button>
        <button class="btn-del" onclick="deleteNote(${index})">✕</button>
      </div>
    `;
    notesList.appendChild(li);
  });
  localStorage.setItem('mon_notes', JSON.stringify(savedNotes));
}

addNoteBtn.addEventListener('click', function() {
  const noteText = noteInput.value.trim();
  if (noteText === '') {
    alert('Hương ơi, nhập nội dung ghi chú trước nhé!');
    return;
  }
  savedNotes.push({ text: noteText, completed: false });
  noteInput.value = '';
  renderNotes();
});

function toggleDone(index) {
  savedNotes[index].completed = !savedNotes[index].completed;
  renderNotes();
}

function deleteNote(index) {
  savedNotes.splice(index, 1);
  renderNotes();
}

renderNotes();

// 4. Cập nhật % tiến độ học tập
function updateProgress(percentId, barId) {
  let newPercent = prompt("Nhập số % mới (từ 0 đến 100):");
  if (newPercent !== null && newPercent !== "" && !isNaN(newPercent)) {
    if (newPercent < 0) newPercent = 0;
    if (newPercent > 100) newPercent = 100;
    
    document.getElementById(percentId).innerText = newPercent;
    document.getElementById(barId).style.width = newPercent + '%';
  }
}
// 5. Tính năng Đồng hồ Pomodoro
let timeLeft = 30 * 60; // 30 phút đổi ra giây
let timerId = null;

const timerDisplay = document.getElementById('timer');
const startTimerBtn = document.getElementById('startTimerBtn');
const pauseTimerBtn = document.getElementById('pauseTimerBtn');
const resetTimerBtn = document.getElementById('resetTimerBtn');

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  // Định dạng hiển thị 00:00
  timerDisplay.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

startTimerBtn.addEventListener('click', function() {
  if (timerId !== null) return; // Nếu đang chạy thì không bấm trùng
  
  timerId = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimerDisplay();
    } else {
      clearInterval(timerId);
      timerId = null;
      // 🔔 Tạo âm thanh tinh ting báo hết giờ
  let alarmSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
  alarmSound.play();
      alert('🎉 Hết 30 phút rồi! Hương hãy nghỉ ngơi 5 phút nhé!');
    }
  }, 1000);
});

pauseTimerBtn.addEventListener('click', function() {
  clearInterval(timerId);
  timerId = null;
});

resetTimerBtn.addEventListener('click', function() {
  clearInterval(timerId);
  timerId = null;
  timeLeft = 30*60;
  updateTimerDisplay();
});
// 6. Tính năng Đổi giao diện Sáng / Tối (Dark Mode)
const themeToggleBtn = document.getElementById('themeToggleBtn');

// Kiểm tra xem trước đó Hương có lưu trạng thái tối/sáng không
const currentTheme = localStorage.getItem('mon_theme');
if (currentTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  themeToggleBtn.innerText = '☀️ Chế độ sáng';
}

themeToggleBtn.addEventListener('click', function() {
  let theme = document.documentElement.getAttribute('data-theme');
  
  if (theme === 'dark') {
    document.documentElement.removeAttribute('data-theme');
    themeToggleBtn.innerText = '🌙 Chế độ tối';
    localStorage.setItem('mon_theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggleBtn.innerText = '☀️ Chế độ sáng';
    localStorage.setItem('mon_theme', 'dark');
  }
});
// 7. Tính năng Lịch & Công việc hôm nay
const currentDateElem = document.getElementById('currentDate');
const today = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };
currentDateElem.innerText = today.toLocaleDateString('vi-VN', options);

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

let savedTasks = JSON.parse(localStorage.getItem('mon_tasks')) || [];

function renderTasks() {
  taskList.innerHTML = '';
  savedTasks.forEach((task, index) => {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('done');
    
    li.innerHTML = `
      <span>${task.text}</span>
      <div class="note-actions">
        <button class="btn-done" onclick="toggleTaskDone(${index})">✓</button>
        <button class="btn-del" onclick="deleteTask(${index})">✕</button>
      </div>
    `;
    taskList.appendChild(li);
  });
  localStorage.setItem('mon_tasks', JSON.stringify(savedTasks));
}

addTaskBtn.addEventListener('click', function() {
  const taskText = taskInput.value.trim();
  if (taskText === '') {
    alert('Hương ơi, nhập công việc trước nhé!');
    return;
  }
  savedTasks.push({ text: taskText, completed: false });
  taskInput.value = '';
  renderTasks();
});

function toggleTaskDone(index) {
  savedTasks[index].completed = !savedTasks[index].completed;
  renderTasks();
}

function deleteTask(index) {
  savedTasks.splice(index, 1);
  renderTasks();
}

renderTasks();
// 8. Tính năng Trích dẫn truyền cảm hứng
const quotes = [
  '"Hành trình vạn dặm bắt đầu từ một bước chân." – Lão Tử',
  '"Thành công không phải là chìa khóa mở cửa hạnh phúc. Hạnh phúc là chìa khóa dẫn tới thành công."',
  '"Kỷ luật là cầu nối giữa mục tiêu và thành tựu."',
  '"Mỗi ngày tiến bộ 1% thì sau 1 năm bạn sẽ giỏi hơn gấp 37 lần."',
  '"Đừng mong mọi việc dễ dàng hơn, hãy mong bản thân giỏi giang hơn."',
  '"Việc học như thuyền đi ngược nước, không tiến ắt sẽ lùi."',
  '"Cách duy nhất để làm nên sự nghiệp vĩ đại là yêu những gì bạn làm."'
];

const quoteText = document.getElementById('quoteText');
const newQuoteBtn = document.getElementById('newQuoteBtn');

function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteText.innerText = quotes[randomIndex];
}

newQuoteBtn.addEventListener('click', getRandomQuote);

// Tự động đổi 1 câu ngẫu nhiên khi mới mở trang
getRandomQuote();