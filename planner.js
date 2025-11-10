//--------------------------- Flashcards ---------------------------
let flashcardSets = JSON.parse(localStorage.getItem('flashcardSets') || '{}');
let setName = "";
let currentIdx = 0;

function addSet() {
  const userInput = prompt("Enter your set name:");
  if (!userInput) return;
  if (flashcardSets[userInput]) {
    alert("Set already exist");
    return;
  }

  setName = userInput;
  document.getElementById("setBtn").style.display = "none";
  document.getElementById("message").value = "";
  document.getElementById("iconGrid").style.display = "none";
  document.getElementById("note-card").style.display = "block";
  document.getElementById("edBtn").style.display = "block";
  document.getElementById("cdBtn").style.display = "none";
}

function addMessage() {
  const textarea = document.getElementById('message');
  const answerarea = document.getElementById('answer');
  const text = textarea.value.trim();
  const answer = answerarea.value.trim();

  if (!setName || !text || !answer) {
    alert("Set name and flashcard text cannot be empty!");
    return;
  }

  if (!flashcardSets[setName]) flashcardSets[setName] = [];
  flashcardSets[setName].push({ text }, { answer });
  localStorage.setItem('flashcardSets', JSON.stringify(flashcardSets));

  textarea.value = "";
  answerarea.value = "";
  alert(`Flashcard saved to "${setName}"!`);
}

function saveSet() {
  const textarea = document.getElementById('message');
  document.getElementById("setBtn").style.display = "block";
  document.getElementById("titletext").style.display = "none";
  document.getElementById("note-card").style.display = "none";
  document.getElementById("iconGrid").style.display = "grid";
  textarea.readOnly = false;
  textarea.style.outline = "";
  populateIconGrid();
}

function openSet(id) {
  setName = id;
  const textarea = document.getElementById('message');
  document.getElementById("setBtn").style.display = "none";
  document.getElementById("iconGrid").style.display = "none";
  document.getElementById("note-card").style.display = "block";
  textarea.readOnly = false;
  textarea.style.outline = "";
}

function openFlash(id) {
  setName = id;
  currentIdx = 0;
  const textarea = document.getElementById('message');
  document.getElementById("titletext").style.display = "block";
  document.getElementById("setBtn").style.display = "none";
  document.getElementById("iconGrid").style.display = "none";
  document.getElementById("note-card").style.display = "block";
  document.getElementById("edBtn").style.display = "none";
  document.getElementById("cdBtn").style.display = "block";
  textarea.readOnly = true;
  textarea.style.outline = "none";
  showFlashcard();
}

function showFlashcard() {
  const flashcards = flashcardSets[setName];
  const textarea = document.getElementById('message');
  const titletext = document.getElementById('titletext');

  if (!flashcards || flashcards.length === 0) {
    textarea.value = "(No flashcards in this set)";
    return;
  }

  if (currentIdx < 0) currentIdx = flashcards.length - 1;
  if (currentIdx >= flashcards.length) currentIdx = 0;

  if (currentIdx % 2 === 1) {
    titletext.textContent = `Answer ${(1 + currentIdx) / 2}`;
    textarea.value = flashcards[currentIdx].answer;
  } else {
    titletext.textContent = `Question ${1 + currentIdx / 2}`;
    textarea.value = flashcards[currentIdx].text;
  }
}

function prevCard() {
  currentIdx = currentIdx % 2 === 1 ? currentIdx - 1 : currentIdx - 2;
  showFlashcard();
}

function nextCard() {
  currentIdx = currentIdx % 2 === 1 ? currentIdx + 1 : currentIdx + 2;
  showFlashcard();
}

function showAnswer() {
  currentIdx = currentIdx % 2 === 1 ? currentIdx - 1 : currentIdx + 1;
  showFlashcard();
}

function populateIconGrid() {
  const iconGrid = document.getElementById('iconGrid');
  iconGrid.innerHTML = '';

  Object.keys(flashcardSets).forEach(set => {
    const card = document.createElement('div');
    card.className = 'iconCard';
    card.id = set;
    card.onclick = () => openFlash(set);

    const icon = document.createElement('div');
    icon.className = 'icon';
    icon.textContent = "📒";

    const label = document.createElement('div');
    label.className = 'iconLabel';
    label.textContent = set;

    card.append(icon, label);
    iconGrid.appendChild(card);
  });
}

//--------------------------- Timers ---------------------------
const timers = [
  { label: "t1", duration: 1 * 60 },
  { label: "t2", duration: 2 * 60 },
  { label: "t3", duration: 5 * 60 },
  { label: "t4", duration: 10 * 60 }
];

let timerStates = timers.map(t => ({
  timeLeft: t.duration,
  interval: null
}));

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function updateTimerDisplay(index) {
  const display = document.querySelector(`#timer-${index} .timer-circle`);
  display.textContent = formatTime(timerStates[index].timeLeft);

  const image = document.querySelector(`#timer-${index} .timer-image`);
  if (image) {
    const total = timers[index].duration;
    const remaining = Math.max(timerStates[index].timeLeft, 0); // clamp to 0
    const percent = 1 - (remaining / total);
    const maxRadius = 80; // half of 160px image
    const radius = Math.min(Math.floor(percent * maxRadius), maxRadius);
    image.style.clipPath = `circle(${radius}px at 50% 50%)`;
  }
}

function startTimer(index) {
  clearInterval(timerStates[index].interval);
  timerStates[index].interval = setInterval(() => {
    if (timerStates[index].timeLeft > 0) {
      timerStates[index].timeLeft--;
      updateTimerDisplay(index);
    } else {
      clearInterval(timerStates[index].interval);
      alert(`${timers[index].label} finished!`);
    }
  }, 1000);
}

function pauseTimer(index) {
  clearInterval(timerStates[index].interval);
}

function resetTimer(index) {
  clearInterval(timerStates[index].interval);
  timerStates[index].timeLeft = timers[index].duration;
  updateTimerDisplay(index);
}

function initTimers() {
  const container = document.getElementById("timer-container");
  container.innerHTML = "";

  timers.forEach((t, i) => {
    const box = document.createElement("div");
    box.className = "timer-box";
    box.id = `timer-${i}`;

    const label = document.createElement("div");
    label.className = "timer-label";
    label.textContent = t.label;

    const circleWrapper = document.createElement("div");
    circleWrapper.className = "timer-circle-wrapper";

    const image = document.createElement("div");
    image.className = "timer-image";
    image.style.backgroundImage = `url('https://tse4.mm.bing.net/th/id/OIP.EqwxYWSvVTCr-irEY3LgRwHaEK?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3')`;
    image.style.clipPath = `circle(0px at 50% 50%)`;

    const countdown = document.createElement("div");
    countdown.className = "timer-circle";

    circleWrapper.appendChild(image);
    circleWrapper.appendChild(countdown);

    const controls = document.createElement("div");
    controls.className = "timer-controls";

    const startBtn = document.createElement("button");
    startBtn.className = "timer-btn";
    startBtn.textContent = "Start";
    startBtn.onclick = () => startTimer(i);

    const pauseBtn = document.createElement("button");
    pauseBtn.className = "timer-btn";
    pauseBtn.textContent = "Pause";
    pauseBtn.onclick = () => pauseTimer(i);

    const resetBtn = document.createElement("button");
    resetBtn.className = "timer-btn";
    resetBtn.textContent = "Reset";
    resetBtn.onclick = () => resetTimer(i);

    controls.append(startBtn, pauseBtn, resetBtn);
    box.append(label, circleWrapper, controls);
    container.appendChild(box);

    updateTimerDisplay(i);
  });
}
//--------------------------- Sidebar View Switching ---------------------------
function showView(viewId) {
  const views = ["calendarView", "notesView", "checklistsView", "timerView", "settingsView"];
  views.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = (id === viewId) ? "block" : "none";
  });

  document.querySelectorAll(".icon-button").forEach(btn => btn.classList.remove("active"));
  const activeBtn = Array.from(document.querySelectorAll(".icon-button")).find(btn =>
    btn.getAttribute("onclick")?.includes(viewId)
  );
  if (activeBtn) activeBtn.classList.add("active");

  if (viewId === "calendarView") renderCalendar();
  if (viewId === "notesView") populateIconGrid();
  if (viewId === "timerView") initTimers();
}

//--------------------------- Calendar ---------------------------
const tasks = [
  { date: "2025-11-06", title: "Math homework" },
  { date: "2025-11-07", title: "Read history" },
  { date: "2025-11-10", title: "Biology quiz" },
  { date: "2025-11-15", title: "Group project" }
];

let currentView = 'monthly';
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let currentWeekStart = getStartOfWeek(new Date());

function getStartOfWeek(date) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

function setView(view) {
  currentView = view;
  const today = new Date();
  currentMonth = today.getMonth();
  currentYear = today.getFullYear();
  currentWeekStart = getStartOfWeek(today);
  renderCalendar();
}

function changePeriod(offset) {
  if (currentView === 'monthly') {
    currentMonth += offset;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    } else if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
  } else if (currentView === 'weekly') {
    currentWeekStart.setDate(currentWeekStart.getDate() + offset * 7);
  }
  renderCalendar();
}

function renderCalendar() {
  const calendar = document.getElementById('calendar');
  const dayLabels = document.getElementById('day-labels');
  calendar.innerHTML = '';
  dayLabels.innerHTML = '';

  if (currentView === 'weekly') {
    const startOfWeek = new Date(currentWeekStart);

    const spacer = document.createElement('div');
    spacer.className = 'day-label-spacer';
    dayLabels.appendChild(spacer);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);

      const label = document.createElement('div');
      label.textContent = date.toLocaleDateString(undefined, {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });
      label.className = 'day-label';
      dayLabels.appendChild(label);
    }

    renderWeeklyView();
  } else if (currentView === 'monthly') {
    renderMonthlyView();
  }
}

function renderWeeklyView() {
  const calendar = document.getElementById('calendar');
  const startOfWeek = new Date(currentWeekStart);
  const monthName = startOfWeek.toLocaleString('default', { month: 'long' });

  document.getElementById('calendar-title').textContent =
    `${monthName} ${startOfWeek.getFullYear()}`;

  const container = document.createElement('div');
  container.className = 'week-grid';

  const timeColumn = document.createElement('div');
  timeColumn.className = 'time-column';

  for (let hour = 0; hour < 24; hour++) {
    const timeCell = document.createElement('div');
    const displayHour = ((hour + 11) % 12 + 1);
    const period = hour < 12 ? 'AM' : 'PM';
    timeCell.textContent = `${displayHour}:00 ${period}`;
    timeCell.className = 'hour-row';
    timeColumn.appendChild(timeCell);
  }

  container.appendChild(timeColumn);

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    const column = document.createElement('div');
    column.className = 'week-column';

    for (let hour = 0; hour < 24; hour++) {
      const hourBlock = document.createElement('div');
      hourBlock.className = 'hour-row';

      const dayTasks = tasks.filter(t => t.date === dateStr);
      dayTasks.forEach(t => {
        const task = document.createElement('div');
        task.textContent = t.title;
        task.style.fontSize = '0.85em';
        task.style.padding = '2px 0';
        task.style.wordWrap = 'break-word';
        hourBlock.appendChild(task);
      });

      column.appendChild(hourBlock);
    }

    container.appendChild(column);
  }

  calendar.appendChild(container);
}

function renderMonthlyView() {
  const calendar = document.getElementById('calendar');
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();

  document.getElementById('calendar-title').textContent =
    `${firstDay.toLocaleString('default', { month: 'long' })} ${currentYear}`;

  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(7, 1fr)';
  grid.style.gridAutoRows = '80px';
  grid.style.gap = '0px';

  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(day => {
    const cell = document.createElement('div');
    cell.textContent = day;
    cell.style.fontWeight = 'bold';
    cell.style.fontSize = '24px';
    cell.style.textAlign = 'center';
    cell.style.marginTop = 'auto';
    cell.style.paddingBottom = '4px';
    cell.style.boxSizing = 'border-box';
    grid.appendChild(cell);
  });

  for (let i = 0; i < firstDay.getDay(); i++) {
    grid.appendChild(document.createElement('div'));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    const dateStr = date.toISOString().split('T')[0];
    const cell = document.createElement('div');
    cell.className = 'calendar-cell';
    if (dateStr === new Date().toISOString().split('T')[0]) {
      cell.classList.add('today');
    }

    const header = document.createElement('div');
    header.textContent = day;
    header.style.fontWeight = 'bold';
    header.style.marginBottom = '4px';
    cell.appendChild(header);

    const dayTasks = tasks.filter(t => t.date === dateStr);
    dayTasks.forEach(t => {
      const task = document.createElement('div');
      task.textContent = t.title;
      task.style.fontSize = '0.85em';
      task.style.padding = '2px 0';
      task.style.wordWrap = 'break-word';
      cell.appendChild(task);
    });

    grid.appendChild(cell);
  }

  calendar.appendChild(grid);
}

//--------------------------- Clock ---------------------------
function updateClock() {
  const now = new Date();
  let hr = now.getHours();
  const min = now.getMinutes();

  const ampm = hr >= 12 ? 'PM' : 'AM';
  hr = hr % 12;
  hr = hr === 0 ? 12 : hr; // Convert 0 to 12 for 12-hour format

  const minDeg = min * 6;
  const hrDeg = hr * 30 + min * 0.5;

  document.querySelector('.minute').style.transform = `rotate(${minDeg}deg)`;
  document.querySelector('.hour').style.transform = `rotate(${hrDeg}deg)`;

  const pad = n => String(n).padStart(2, '0');
  document.getElementById('digitalClock').textContent =
    `${pad(hr)}:${pad(min)} ${ampm}`;

  requestAnimationFrame(updateClock);
}

requestAnimationFrame(updateClock);

//--------------------------- Init ---------------------------
window.onload = () => {
  showView("calendarView");
};