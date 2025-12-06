//--------------------------- Flashcards ---------------------------
let flashcardSets = JSON.parse(localStorage.getItem('flashcardSets') || '{}');
let setName = "";
let currentIdx = 0;
let showingAnswer = false;

function addSet() {
  const userInput = prompt("Enter your set name:");
  if (!userInput) return;
  if (flashcardSets[userInput]) {
    alert("Set already exist");
    return;
  }

  setName = userInput;
  flashcardSets[setName] = [];
  localStorage.setItem('flashcardSets', JSON.stringify(flashcardSets));
  populateIconGrid();
  document.getElementById("setBtn").style.display = "none";
  document.getElementById("message").value = "";
  document.getElementById("iconGrid").style.display = "none";
  document.getElementById("note-card").style.display = "block";
  document.getElementById("edBtn").style.display = "block";
  document.getElementById("cdBtn").style.display = "none";
}

function addMessage() {
  const question = document.getElementById("message").value.trim();
  const answer = document.getElementById("answer").value.trim();

  if (!setName || !question || !answer) {
    alert("Question and answer cannot be empty.");
    return;
  }

  if (!flashcardSets[setName]) flashcardSets[setName] = [];

  flashcardSets[setName].push({
    question: question,
    answer: answer
  });

  localStorage.setItem("flashcardSets", JSON.stringify(flashcardSets));

  document.getElementById("message").value = "";
  document.getElementById("answer").value = "";

  alert("Flashcard added!");
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
  showingAnswer = false;

  document.getElementById("titletext").style.display = "block";
  document.getElementById("iconGrid").style.display = "none";
  document.getElementById("note-card").style.display = "block";
  document.getElementById("edBtn").style.display = "none";
  document.getElementById("cdBtn").style.display = "block";

  showFlashcard();
}

function showFlashcard() {
  const flashcards = flashcardSets[setName];
  const textarea = document.getElementById("message");
  const title = document.getElementById("titletext");

  if (!flashcards || flashcards.length === 0) {
    textarea.value = "(No flashcards in this set)";
    return;
  }

  if (currentIdx < 0) currentIdx = flashcards.length - 1;
  if (currentIdx >= flashcards.length) currentIdx = 0;

  const card = flashcards[currentIdx];

  if (!card || !card.question || !card.answer) {
    textarea.value = "(This card is corrupted — delete and remake it)";
    return;
  }

  textarea.readOnly = false;

  if (showingAnswer) {
    title.innerText = `Answer ${currentIdx + 1}`;
    textarea.value = card.answer;
  } else {
    title.innerText = `Question ${currentIdx + 1}`;
    textarea.value = card.question;
  }

  textarea.readOnly = true;
}

function prevCard() {
  currentIdx--;
  showingAnswer = false;
  showFlashcard();
}

function nextCard() {
  currentIdx++;
  showingAnswer = false;
  showFlashcard();
}

function showAnswer() {
  showingAnswer = !showingAnswer;
  showFlashcard();
}

function deleteSet() {
  if (!setName) return;

  const confirmDelete = confirm(`Are you sure you want to delete the set "${setName}"? This cannot be undone.`);
  if (!confirmDelete) return;

  delete flashcardSets[setName];

  localStorage.setItem("flashcardSets", JSON.stringify(flashcardSets));

  document.getElementById("note-card").style.display = "none";
  document.getElementById("iconGrid").style.display = "grid";
  document.getElementById("setBtn").style.display = "block";

  populateIconGrid();

  alert("Set deleted successfully.");
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

// Load timers from localStorage if available, otherwise use defaults
let timers = JSON.parse(localStorage.getItem('timers') || '[]');
if (timers.length === 0) {
  timers = [
    { label: "Default", duration: 1 * 60 }
  ];
}

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
    const remaining = Math.max(timerStates[index].timeLeft, 0);
    const percent = 1 - (remaining / total);
    const maxRadius = 80;
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
      showNotification(`${timers[index].label} finished!`);
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

// Delete a timer
function deleteTimer(index) {
  clearInterval(timerStates[index].interval);
  timers.splice(index, 1);
  timerStates.splice(index, 1);
  localStorage.setItem('timers', JSON.stringify(timers));
  initTimers();
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

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "timer-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deleteTimer(i);

    controls.append(startBtn, pauseBtn, resetBtn, deleteBtn);
    box.append(label, circleWrapper, controls);
    container.appendChild(box);

    updateTimerDisplay(i);
  });
}

// Create a custom timer using modal overlay
function createTimer() {
  openModal("Enter timer name:", data => {
    if (!data.name || isNaN(data.minutes) || data.minutes <= 0) {
      showNotification("Invalid timer input.");
      return;
    }

    timers.push({ label: data.name, duration: data.minutes * 60 });
    timerStates.push({ timeLeft: data.minutes * 60, interval: null });
    localStorage.setItem('timers', JSON.stringify(timers));
    initTimers();
  });
}

//--------------------------- Modal ---------------------------
let modalCallback = null;
let modalStep = 0;
let modalData = {};
let modalIsNotification = false; // flag for notification mode

function openModal(title, callback) {
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalInput").value = "";
  document.getElementById("modalInput").style.display = "block";
  document.getElementById("modalButtons").querySelector("button:last-child").style.display = "inline-block";
  document.getElementById("modalOverlay").style.display = "flex";

  modalIsNotification = false; // default mode
  if (callback) modalCallback = callback;
}

function confirmModal() {
  // Notification mode: just close on OK
  if (modalIsNotification) {
    const cb = modalCallback;
    if (cb) cb();        // callback closes modal
    else closeModal();
    modalIsNotification = false;
    modalCallback = null;
    modalStep = 0;
    modalData = {};
    return;
  }

  // Normal two-step input flow
  const input = document.getElementById("modalInput").value.trim();
  if (!input) return;

  if (modalStep === 0) {
    modalData.name = input;
    modalStep = 1;
    document.getElementById("modalTitle").textContent = "Enter duration in minutes:";
    document.getElementById("modalInput").value = "";
  } else {
    modalData.minutes = parseInt(input, 10);

    // Call the callback BEFORE closing (closeModal clears modalCallback)
    const cb = modalCallback;
    const data = { ...modalData };
    if (cb) cb(data);
    closeModal();

    modalCallback = null;
    modalStep = 0;
    modalData = {};
  }
}

function closeModal() {
  document.getElementById("modalOverlay").style.display = "none";
  modalCallback = null;
  modalStep = 0;
  modalData = {};
  modalIsNotification = false;
}

function showNotification(message) {
  openModal(message, () => closeModal());
  document.getElementById("modalInput").style.display = "none";
  document.getElementById("modalButtons").querySelector("button:last-child").style.display = "none";
  modalIsNotification = true; // mark notification mode
  modalStep = 0;
  modalData = {};
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

// ===== Data =====
let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let events = JSON.parse(localStorage.getItem('events') || '[]');

// ===== Calendar state =====
let currentView = 'monthly';
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let currentWeekStart = getStartOfWeek(new Date());

// ===== Utilities =====
function getStartOfWeek(date) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay()); // Sunday start
  d.setHours(0, 0, 0, 0);
  return d;
}

function saveTasks() { localStorage.setItem('tasks', JSON.stringify(tasks)); }
function saveEvents() { localStorage.setItem('events', JSON.stringify(events)); }

function parseTimeToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function minutesToHourIndexRange(startTime, endTime) {
  const startMin = parseTimeToMinutes(startTime);
  const endMin = parseTimeToMinutes(endTime);
  const startHour = Math.floor(startMin / 60);
  const endHour = Math.max(startHour, Math.floor((endMin - 1) / 60));
  const hours = [];
  for (let h = startHour; h <= endHour; h++) hours.push(h);
  return hours;
}

function isoDate(dateObj) {
  return dateObj.toISOString().split('T')[0];
}

function isTodayISO(iso) {
  return iso === isoDate(new Date());
}

// ===== Modal State =====
let calendarModal = { type: null };

// ===== Modal Helpers =====
function openCalendarModal(type) {
  calendarModal.type = type;
  document.getElementById('calendarModalTitle').textContent =
    type === 'task' ? 'New Task' : 'New Event';
  document.getElementById('calendarModalOverlay').style.display = 'flex';

  // reset fields
  document.getElementById('calendarModalTitleInput').value = '';
  document.getElementById('calendarModalDate').value = isoDate(new Date());
  document.getElementById('calendarModalStart').value = '';
  document.getElementById('calendarModalEnd').value = '';
  document.getElementById('calendarModalRepeat').value = 'none';

  const linkContainer = document.getElementById('calendarModalEventLinkContainer');
  const select = document.getElementById('calendarModalEventLink');

  if (type === 'task') {
    linkContainer.style.display = 'block';
    select.innerHTML = '<option value="">None</option>';
    events.forEach(e => {
      const opt = document.createElement('option');
      opt.value = e.id;
      opt.textContent = `${e.title} (${e.date})`;
      select.appendChild(opt);
    });
  } else {
    linkContainer.style.display = 'none'; // hide for events
  }
}


function confirmCalendarModal() {
  const title = document.getElementById('calendarModalTitleInput').value.trim();
  const date = document.getElementById('calendarModalDate').value;
  const startTime = document.getElementById('calendarModalStart').value;
  const endTime = document.getElementById('calendarModalEnd').value;
  const repeat = document.getElementById('calendarModalRepeat').value;

  if (!title || !date || !startTime || !endTime) {
    alert('Fill out all fields');
    return;
  }

  if (calendarModal.type === 'task') {
  const eventId = document.getElementById('calendarModalEventLink').value || null;
  const newTask = { id: Date.now(), title, date, startTime, endTime, checked: false, eventId };
  tasks.push(newTask);
  saveTasks();
  renderCalendar();
  renderChecklist();
} else if (calendarModal.type === 'event') {
  const newEvent = { id: Date.now(), title, date, startTime, endTime, repeat };
  events.push(newEvent);
  saveEvents();
  renderCalendar();
}

  closeCalendarModal();
}

function closeCalendarModal() {
  document.getElementById('calendarModalOverlay').style.display = 'none';
  calendarModal.type = null;
}

// ===== Tasks =====
function createTask() {
  openCalendarModal('task');
}


function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.checked = !task.checked;
  saveTasks();
  renderCalendar();
  renderChecklist();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderCalendar();
  renderChecklist();
}

// ===== Events =====
function addEvent() {
  openCalendarModal('event');
}

function deleteEvent(id) {
  events = events.filter(e => e.id !== id);
  saveEvents();
  renderCalendar();
}

function expandRepeatingEventsForDate(targetISO, baseEvents) {
  const target = new Date(targetISO);
  const targetDow = target.getDay();
  const targetDayNum = target.getDate();

  const out = [];
  baseEvents.forEach(e => {
    const base = new Date(e.date);
    const sameDay = e.date === targetISO;

    if (e.repeat === 'none') {
      if (sameDay) out.push({ ...e });
      return;
    }

    if (e.repeat === 'daily') {
      if (target >= base) out.push({ ...e, date: targetISO });
      return;
    }

    if (e.repeat === 'weekly') {
      if (target >= base && targetDow === base.getDay()) {
        out.push({ ...e, date: targetISO });
      }
      return;
    }

    if (e.repeat === 'monthly') {
      if (target >= base && targetDayNum === base.getDate()) {
        out.push({ ...e, date: targetISO });
      }
      return;
    }
  });

  return out;
}

// ===== Navigation =====
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
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    else if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  } else if (currentView === 'weekly') {
    currentWeekStart.setDate(currentWeekStart.getDate() + offset * 7);
  }
  renderCalendar();
}

// ===== Rendering orchestrator =====
function renderCalendar() {
  const calendar = document.getElementById('calendar');
  const dayLabels = document.getElementById('day-labels');
  if (!calendar || !dayLabels) return;

  calendar.innerHTML = '';
  dayLabels.innerHTML = '';

  if (currentView === 'weekly') {
    renderWeeklyView();
  } else {
    renderMonthlyView();
  }
}

// ===== Weekly View =====
function renderWeeklyView() {
  const calendar = document.getElementById('calendar');
  if (!calendar) return;
  calendar.innerHTML = '';

  const startOfWeek = new Date(currentWeekStart);

  // Title
  const monthName = startOfWeek.toLocaleString('default', { month: 'long' });
  const titleEl = document.getElementById('calendar-title');
  if (titleEl) titleEl.textContent = `${monthName} ${startOfWeek.getFullYear()}`;

  // Day labels
  const dayLabels = document.getElementById('day-labels');
  if (dayLabels) {
    dayLabels.innerHTML = '';
    const spacer = document.createElement('div');
    spacer.className = 'day-label-spacer';
    dayLabels.appendChild(spacer);

    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const label = document.createElement('div');
      label.className = 'day-label';
      label.textContent = d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
      dayLabels.appendChild(label);
    }
  }

  // Container + time column
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

  const ROW_HEIGHT = 25; // matches your CSS

  // Build 7 day columns
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    const dateStr = isoDate(d);

    const column = document.createElement('div');
    column.className = 'week-column';

    // Background grid rows (24 rows)
    for (let hour = 0; hour < 24; hour++) {
      const hourBlock = document.createElement('div');
      hourBlock.className = 'hour-row';
      column.appendChild(hourBlock);
    }

    // === TASKS ===
    tasks.filter(t => t.date === dateStr).forEach(t => {
      const [hStart, hStartMin] = t.startTime.split(':').map(Number);
      const [endHour, endMin] = t.endTime.split(':').map(Number);

      const startRow = hStart + 1; // grid rows are 1-based
      const durationHours = (endHour + endMin / 60) - (hStart + hStartMin / 60);
      const spanRows = Math.max(1, Math.ceil(durationHours));
      const height = durationHours * ROW_HEIGHT;

      const el = document.createElement('div');
      el.textContent = `${t.title} (${t.startTime}-${t.endTime})`;

      if (t.eventId) {
        const linkedEvent = events.find(e => e.id == t.eventId);
        if (linkedEvent) el.textContent += ` → ${linkedEvent.title}`;
      }

      el.style.gridRow = `${startRow} / span ${spanRows}`;
      el.style.height = `${height}px`;
      el.style.background = '#fff';
      el.style.border = '1px solid #ccc';
      el.style.borderRadius = '4px';
      el.style.padding = '2px';
      el.style.fontSize = '0.75em';
      el.style.wordWrap = 'break-word';
      el.style.boxSizing = 'border-box';
      el.style.marginLeft = '6px';
      el.style.marginRight = '6px';
      if (t.checked) el.style.textDecoration = 'line-through';
      el.onclick = () => toggleTask(t.id);

      const del = document.createElement('button');
      del.innerHTML = '🗑️';
      del.style.marginLeft = '4px';
      del.style.fontSize = '0.8em';
      del.style.padding = '2px 4px';
      del.style.border = 'none';
      del.style.background = 'transparent';
      del.style.cursor = 'pointer';
      del.onclick = ev => { ev.stopPropagation(); deleteTask(t.id); };
      el.appendChild(del);

      const spanHours = minutesToHourIndexRange(t.startTime, t.endTime);
      if (spanHours.length > 1) {
        el.style.borderLeft = '3px solid #003d66';
        el.style.paddingLeft = '6px';
      }

      column.appendChild(el);
    });

    // === EVENTS ===
    const dayEvents = expandRepeatingEventsForDate(dateStr, events);
    dayEvents.forEach(e => {
      if (!e.startTime || !e.endTime) return;
      const [hStart, hStartMin] = e.startTime.split(':').map(Number);
      const [endHour, endMin] = e.endTime.split(':').map(Number);

      const startRow = hStart + 1;
      const durationHours = (endHour + endMin / 60) - (hStart + hStartMin / 60);
      const spanRows = Math.max(1, Math.ceil(durationHours));
      const height = durationHours * ROW_HEIGHT;

      const el = document.createElement('div');
      el.textContent = `${e.title} (${e.startTime}-${e.endTime})`;
      el.style.gridRow = `${startRow} / span ${spanRows}`;
      el.style.height = `${height}px`;
      el.style.background = '#bfe3f39f';
      el.style.border = '1px solid #ccc';
      el.style.borderRadius = '4px';
      el.style.padding = '2px';
      el.style.fontSize = '0.75em';
      el.style.wordWrap = 'break-word';
      el.style.boxSizing = 'border-box';
      el.style.marginLeft = '6px';
      el.style.marginRight = '6px';

      const del = document.createElement('button');
      del.innerHTML = '🗑️';
      del.style.marginLeft = '4px';
      del.style.fontSize = '0.8em';
      del.style.padding = '2px 4px';
      del.style.border = 'none';
      del.style.background = 'transparent';
      del.style.cursor = 'pointer';
      del.onclick = ev => { ev.stopPropagation(); deleteEvent(e.id); };
      el.appendChild(del);

      const spanHours = minutesToHourIndexRange(e.startTime, e.endTime);
      if (spanHours.length > 1) {
        el.style.borderLeft = '3px solid #003d66';
        el.style.paddingLeft = '6px';
      }

      column.appendChild(el);
    });

    container.appendChild(column);
  }

  calendar.appendChild(container);
}

// ===== Monthly View =====
function renderMonthlyView() {
  const calendar = document.getElementById('calendar');

  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();

  const titleEl = document.getElementById('calendar-title');
  if (titleEl) {
    titleEl.textContent = `${firstDay.toLocaleString('default', { month: 'long' })} ${currentYear}`;
  }

  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(7, 1fr)';
  grid.style.gridAutoRows = '100px';
  grid.style.gap = '0';

  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
    const cell = document.createElement('div');
    cell.textContent = day;
    cell.style.fontWeight = 'bold';
    cell.style.textAlign = 'center';
    cell.style.paddingBottom = '4px';
    grid.appendChild(cell);
  });

  for (let i = 0; i < firstDay.getDay(); i++) {
    grid.appendChild(document.createElement('div'));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(currentYear, currentMonth, day);
    const dateStr = isoDate(d);

    const cell = document.createElement('div');
    cell.className = 'calendar-cell';
    cell.style.padding = '6px';

    if (isTodayISO(dateStr)) {
      cell.classList.add('today');
    }

    const header = document.createElement('div');
    header.textContent = day;
    header.style.fontWeight = 'bold';
    header.style.marginBottom = '4px';
    cell.appendChild(header);

    // Tasks
    tasks.filter(t => t.date === dateStr).forEach(t => {
      const el = document.createElement('div');
      el.textContent = `${t.title} (${t.startTime}-${t.endTime})`;

      // show linked event
      if (t.eventId) {
        const linkedEvent = events.find(e => e.id == t.eventId);
        if (linkedEvent) {
          el.textContent += ` → ${linkedEvent.title}`;
        }
      }

      el.style.fontSize = '0.75em';
      el.style.wordWrap = 'break-word';
      if (t.checked) el.style.textDecoration = 'line-through';
      el.onclick = () => toggleTask(t.id);

      const del = document.createElement('button');
      del.innerHTML = '🗑️';
      del.style.marginLeft = '4px';
      del.style.fontSize = '0.8em';
      del.style.padding = '2px 4px';
      del.style.border = 'none';
      del.style.background = 'transparent';
      del.style.cursor = 'pointer';
      del.onclick = ev => { 
        ev.stopPropagation(); 
        deleteTask(t.id); 
      };
      el.appendChild(del);

      cell.appendChild(el);
    });

    // Events
    const dayEvents = expandRepeatingEventsForDate(dateStr, events);
    dayEvents.forEach(e => {
      if (!e.startTime || !e.endTime) return;

      const el = document.createElement('div');
      el.textContent = `${e.title} (${e.startTime}-${e.endTime})`;
      el.style.background = '#bfe3f39f';
      el.style.padding = '2px';
      el.style.margin = '2px 0';
      el.style.fontSize = '0.75em';
      el.style.border = '1px solid #ccc';
      el.style.borderRadius = '4px';

      const del = document.createElement('button');
      del.innerHTML = '🗑️';
      del.style.marginLeft = '4px';
      del.style.fontSize = '0.8em';
      del.style.padding = '2px 4px';
      del.style.border = 'none';
      del.style.background = 'transparent';
      del.style.cursor = 'pointer';
      del.onclick = ev => { 
        ev.stopPropagation(); 
        deleteEvent(e.id); 
      };
      el.appendChild(del);

      cell.appendChild(el);
    });

    grid.appendChild(cell);
  }

  calendar.appendChild(grid);
}

// ===== Checklist View =====
function renderChecklist() {
  const container = document.getElementById('checklistsView');
  if (!container) return;
  container.innerHTML = '';

  const list = document.createElement('div');
  list.style.padding = '10px';

  tasks.forEach(t => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.justifyContent = 'space-between';
    row.style.margin = '6px 0';

    const left = document.createElement('div');
    left.style.display = 'flex';
    left.style.alignItems = 'center';
    left.style.gap = '8px';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = t.checked;
    checkbox.onchange = () => toggleTask(t.id);

    const label = document.createElement('span');
    label.textContent = `${t.title} — ${t.date} ${t.startTime}-${t.endTime}`;
    if (t.checked) label.style.textDecoration = 'line-through';

    left.appendChild(checkbox);
    left.appendChild(label);

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => deleteTask(t.id);

    row.appendChild(left);
    row.appendChild(delBtn);
    list.appendChild(row);
  });

  container.appendChild(list);
}

// ===== Initial render =====
document.addEventListener('DOMContentLoaded', () => {
  renderCalendar();
  renderChecklist();
});





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