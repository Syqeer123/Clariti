// Calendar Component

// Event color mapping
const EVENT_COLORS = {
    'class': '#06B6D4',      // Cyan - scheduled classes
    'assignment': '#EF4444',  // Red - assignments/deadlines
    'exam': '#EF4444',        // Red - exams
    'forum': '#6366F1',       // Indigo - forum sessions
    'meeting': '#6366F1',     // Indigo - meetings
    'pending': '#F59E0B',     // Amber - pending items
    'completed': '#10B981'    // Green - completed tasks
};

let currentCalendarDate = new Date();
let selectedDate = null;

function renderCalendar() {
    const contentArea = document.getElementById('contentArea');

    contentArea.innerHTML = `
        <div class="dashboard-header">
            <h1>Calendar</h1>
            <p>View your schedule and events</p>
        </div>

        <div class="calendar-container">
            <div class="calendar-header">
                <div class="calendar-nav">
                    <button onclick="previousMonth()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    <span class="calendar-month-year" id="monthYear"></span>
                    <button onclick="nextMonth()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>
                <button class="calendar-today-btn" onclick="goToToday()">Today</button>
            </div>

            <div class="calendar-grid" id="calendarGrid"></div>

            <div class="calendar-legend">
                <div class="legend-item">
                    <span class="legend-dot" style="background-color: #06B6D4;"></span>
                    <span>Classes</span>
                </div>
                <div class="legend-item">
                    <span class="legend-dot" style="background-color: #EF4444;"></span>
                    <span>Assignments/Exams</span>
                </div>
                <div class="legend-item">
                    <span class="legend-dot" style="background-color: #6366F1;"></span>
                    <span>Forums/Meetings</span>
                </div>
                <div class="legend-item">
                    <span class="legend-dot" style="background-color: #10B981;"></span>
                    <span>Completed</span>
                </div>
                <div class="legend-item">
                    <span class="legend-dot" style="background-color: #F59E0B;"></span>
                    <span>Pending</span>
                </div>
            </div>
        </div>
    `;

    renderCalendarGrid();
}

function renderCalendarGrid() {
    const grid = document.getElementById('calendarGrid');
    const monthYear = document.getElementById('monthYear');

    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();

    // Update month/year display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    monthYear.textContent = `${monthNames[month]} ${year}`;

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Get days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const daysFromPrevMonth = startingDayOfWeek;

    // Calculate total cells needed
    const totalCells = Math.ceil((daysInMonth + startingDayOfWeek) / 7) * 7;

    // Generate calendar HTML
    let calendarHTML = '';

    // Day headers
    const dayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    dayHeaders.forEach(day => {
        calendarHTML += `<div class="calendar-day-header">${day}</div>`;
    });

    // Generate cells
    for (let i = 0; i < totalCells; i++) {
        let day, cellMonth, cellYear;
        let isOtherMonth = false;
        let isWeekend = false;
        let isToday = false;

        if (i < daysFromPrevMonth) {
            // Previous month
            day = prevMonthLastDay - daysFromPrevMonth + i + 1;
            cellMonth = month - 1;
            cellYear = month === 0 ? year - 1 : year;
            isOtherMonth = true;
        } else if (i < daysFromPrevMonth + daysInMonth) {
            // Current month
            day = i - daysFromPrevMonth + 1;
            cellMonth = month;
            cellYear = year;

            // Check if today
            const today = new Date();
            isToday = day === today.getDate() &&
                     month === today.getMonth() &&
                     year === today.getFullYear();
        } else {
            // Next month
            day = i - daysFromPrevMonth - daysInMonth + 1;
            cellMonth = month + 1;
            cellYear = month === 11 ? year + 1 : year;
            isOtherMonth = true;
        }

        // Check if weekend
        const dayOfWeek = i % 7;
        isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        // Get events for this date
        const dateString = `${cellYear}-${String(cellMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const events = getEventsForDate(dateString);

        // Build cell classes
        let cellClasses = ['calendar-cell'];
        if (isOtherMonth) cellClasses.push('other-month');
        if (isWeekend) cellClasses.push('weekend');
        if (isToday) cellClasses.push('today');

        calendarHTML += `
            <div class="${cellClasses.join(' ')}" onclick="selectDate('${dateString}')" data-date="${dateString}">
                <span class="date-number">${day}</span>
                <div class="event-dots">
                    ${renderEventDots(events)}
                </div>
            </div>
        `;
    }

    grid.innerHTML = calendarHTML;
}

function renderEventDots(events) {
    if (!events || events.length === 0) return '';

    const maxDots = 3;
    let dotsHTML = '';

    for (let i = 0; i < Math.min(events.length, maxDots); i++) {
        dotsHTML += `<span class="dot event-${events[i].type}"></span>`;
    }

    return dotsHTML;
}

function getEventsForDate(dateString) {
    const events = [];
    const role = AppState.currentUser.role;
    const userId = AppState.currentUser.id;
    const schoolId = AppState.currentUser.school_id;

    // Parse date correctly to avoid timezone issues
    const dateParts = dateString.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed
    const day = parseInt(dateParts[2]);
    const date = new Date(year, month, day);

    // Add schedule events (classes) - only for teachers and students
    let schedules = [];

    if (role === 'teacher') {
        // Teachers only see their own teaching schedule
        schedules = AppState.data.schedules.filter(s =>
            s.teacher_id === userId && s.date === dateString
        );
    } else if (role === 'student') {
        // Students see all classes (they are enrolled in all classes of their school)
        // Filter by school through courses
        schedules = AppState.data.schedules.filter(s => {
            if (s.date !== dateString) return false;
            const course = AppState.data.courses.find(c => c.id === s.course_id);
            return course && course.school_id === schoolId;
        });
    }
    // Headmaster and admin do NOT see schedules

    schedules.forEach(schedule => {
        const course = AppState.data.courses.find(c => c.id === schedule.course_id);
        const teacher = AppState.data.users.find(u => u.id === schedule.teacher_id);
        const dayInfo = schedule.day ? schedule.day + ', ' : '';
        events.push({
            type: 'class',
            title: course ? course.name : 'Class',
            time: `${dayInfo}${schedule.start_time} - ${schedule.end_time}`,
            location: schedule.room,
            teacher: teacher ? teacher.name : 'Unknown',
            details: schedule
        });
    });

    // Add assignment deadlines based on role
    let assignments = [];

    if (role === 'teacher') {
        // Teachers see assignments they created
        assignments = AppState.data.assignments.filter(a =>
            a.due_date === dateString && a.created_by === userId
        );
    } else if (role === 'student') {
        // Students see all assignments for courses in their school
        assignments = AppState.data.assignments.filter(a => {
            if (a.due_date !== dateString) return false;
            const course = AppState.data.courses.find(c => c.id === a.course_id);
            return course && course.school_id === schoolId;
        });
    } else if (role === 'headmaster') {
        // Headmaster sees all assignments in their school
        assignments = AppState.data.assignments.filter(a => {
            if (a.due_date !== dateString) return false;
            const course = AppState.data.courses.find(c => c.id === a.course_id);
            return course && course.school_id === schoolId;
        });
    } else if (role === 'admin') {
        // Admin sees all assignments
        assignments = AppState.data.assignments.filter(a => a.due_date === dateString);
    }

    assignments.forEach(assignment => {
        const course = AppState.data.courses.find(c => c.id === assignment.course_id);

        // Check if assignment is past due using consistent date comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isPast = date < today;

        events.push({
            type: isPast ? 'completed' : 'assignment',
            title: assignment.title,
            time: '11:59 PM',
            location: 'Online Submission',
            course: course ? course.name : 'Unknown Course',
            details: assignment
        });
    });

    // Add sample forum/meeting events for teachers and students
    if (role === 'teacher' || role === 'student') {
        // Add some sample forums/meetings
        if (dateString === '2025-12-03') {
            events.push({
                type: 'forum',
                title: 'Math Study Group Forum',
                time: '14:00 - 15:30',
                location: 'Online - Zoom Link',
                course: 'Mathematics 101',
                details: { description: 'Weekly study group discussion' }
            });
        }
        if (dateString === '2025-12-06') {
            events.push({
                type: 'forum',
                title: 'Parent-Teacher Meeting',
                time: '15:00 - 17:00',
                location: 'Main Hall',
                course: 'All Courses',
                details: { description: 'Monthly parent-teacher conference' }
            });
        }
        if (dateString === '2025-12-09') {
            events.push({
                type: 'forum',
                title: 'Computer Science Workshop',
                time: '13:00 - 15:00',
                location: 'Computer Lab',
                course: 'Computer Science',
                details: { description: 'Hands-on Python programming workshop' }
            });
        }
        if (dateString === '2025-12-12') {
            events.push({
                type: 'pending',
                title: 'Project Proposal Review',
                time: 'TBD',
                location: 'To be confirmed',
                course: 'Computer Science',
                details: { description: 'Pending schedule confirmation' }
            });
        }
    }

    return events;
}

function selectDate(dateString) {
    selectedDate = dateString;
    const events = getEventsForDate(dateString);

    if (events.length === 0) {
        showToast('No events on this date', 'error');
        return;
    }

    // Show event details modal
    showEventDetailsModal(dateString, events);
}

function showEventDetailsModal(dateString, events) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    const eventsHTML = events.map(event => {
        const icon = getEventIcon(event.type);
        return `
            <div class="event-item event-${event.type}">
                <div class="event-icon">${icon}</div>
                <div class="event-details">
                    <div class="event-title">${event.title}</div>
                    <div class="event-time">${event.time}</div>
                    <div class="event-location">${event.location}</div>
                    ${event.teacher ? `<div class="event-location">Teacher: ${event.teacher}</div>` : ''}
                    ${event.course ? `<div class="event-location">${event.course}</div>` : ''}
                </div>
            </div>
        `;
    }).join('');

    const content = `
        <div class="event-modal-content">
            <div class="event-date-header">${formattedDate}</div>
            ${eventsHTML}
        </div>
    `;

    const actions = `
        <button class="btn btn-secondary" onclick="closeModal()">Close</button>
    `;

    showModal('Events', content, actions);
}

function getEventIcon(type) {
    const icons = {
        'class': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
        'assignment': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>',
        'forum': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
        'completed': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
    };
    return icons[type] || icons['class'];
}

function previousMonth() {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    renderCalendarGrid();
}

function nextMonth() {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    renderCalendarGrid();
}

function goToToday() {
    currentCalendarDate = new Date();
    renderCalendarGrid();
}
