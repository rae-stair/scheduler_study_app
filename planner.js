const tasks = [
  { date: "2025-11-06", title: "Math homework"},
  { date: "2025-11-07", title: "Read history" },
  { date: "2025-11-10", title: "Biology quiz" },
  { date: "2025-11-15", title: "Group project" }
];

let currentView = 'weekly';
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
  const displayHour = ((hour + 11) % 12 + 1); // converts 0–23 to 1–12
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
  grid.style.gridAutoRows = '120px';
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

window.onload = () => {
  renderCalendar();
};