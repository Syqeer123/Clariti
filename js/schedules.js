// Schedules Management

function renderSchedules() {
    const contentArea = document.getElementById('contentArea');
    const role = AppState.currentUser.role;
    const userId = AppState.currentUser.id;
    const schoolId = AppState.currentUser.school_id;

    // Only teachers and students can access schedules
    if (role !== 'teacher' && role !== 'student') {
        contentArea.innerHTML = `
            <div class="dashboard-header">
                <h1>Access Denied</h1>
                <p>Only teachers and students can view schedules</p>
            </div>
        `;
        return;
    }

    let schedules = [];

    if (role === 'teacher') {
        // Teachers only see their own teaching schedule
        schedules = AppState.data.schedules.filter(s => s.teacher_id === userId);
    } else if (role === 'student') {
        // Students see all schedules for courses in their school
        schedules = AppState.data.schedules.filter(s => {
            const course = AppState.data.courses.find(c => c.id === s.course_id);
            return course && course.school_id === schoolId;
        });
    }

    contentArea.innerHTML = `
        <div class="dashboard-header">
            <h1>Schedule</h1>
            <p>${role === 'teacher' ? 'Your teaching schedule' : 'Class schedule'}</p>
        </div>

        <div class="table-container">
            <div class="table-header">
                <h2>Class Schedule</h2>
            </div>

            <div class="table-wrapper">
                ${schedules.length > 0 ? `
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Course</th>
                                <th>Teacher</th>
                                <th>Room</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${schedules.map(schedule => {
                                const course = AppState.data.courses.find(c => c.id === schedule.course_id);
                                const teacher = AppState.data.users.find(u => u.id === schedule.teacher_id);
                                return `
                                    <tr>
                                        <td><span class="badge badge-primary">${schedule.date}</span></td>
                                        <td>${schedule.start_time} - ${schedule.end_time}</td>
                                        <td>${course ? course.name : 'N/A'}</td>
                                        <td>${teacher ? teacher.name : 'N/A'}</td>
                                        <td>${schedule.room}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                ` : `
                    <div class="empty-state">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <h3>No schedules yet</h3>
                        <p>Schedules will appear here once added</p>
                    </div>
                `}
            </div>
        </div>
    `;
}

function showAddScheduleModal() {
    const schoolId = AppState.currentUser.school_id;
    const courses = AppState.data.courses.filter(c => c.school_id === schoolId);
    const teachers = AppState.data.users.filter(u => u.role === 'teacher' && u.school_id === schoolId);

    const content = `
        <form id="addScheduleForm">
            <div class="form-grid">
                <div class="form-group">
                    <label for="scheduleCourse">Course <span class="required">*</span></label>
                    <select id="scheduleCourse" required>
                        <option value="">Select Course</option>
                        ${courses.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="scheduleTeacher">Teacher <span class="required">*</span></label>
                    <select id="scheduleTeacher" required>
                        <option value="">Select Teacher</option>
                        ${teachers.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="scheduleDate">Date <span class="required">*</span></label>
                    <input type="date" id="scheduleDate" required>
                </div>
                <div class="form-group">
                    <label for="scheduleRoom">Room <span class="required">*</span></label>
                    <input type="text" id="scheduleRoom" required>
                </div>
                <div class="form-group">
                    <label for="scheduleStart">Start Time <span class="required">*</span></label>
                    <input type="time" id="scheduleStart" required>
                </div>
                <div class="form-group">
                    <label for="scheduleEnd">End Time <span class="required">*</span></label>
                    <input type="time" id="scheduleEnd" required>
                </div>
            </div>
        </form>
    `;

    const actions = `
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="addSchedule()">Add Schedule</button>
    `;

    showModal('Add Schedule', content, actions);
}

function addSchedule() {
    // Get DOM elements with null checks
    const courseElement = document.getElementById('scheduleCourse');
    const teacherElement = document.getElementById('scheduleTeacher');
    const dateElement = document.getElementById('scheduleDate');
    const roomElement = document.getElementById('scheduleRoom');
    const startElement = document.getElementById('scheduleStart');
    const endElement = document.getElementById('scheduleEnd');

    // Check if elements exist
    if (!courseElement || !teacherElement || !dateElement || !roomElement || !startElement || !endElement) {
        showToast('Form elements not found. Please try again.', 'error');
        return;
    }

    const courseId = courseElement.value.trim();
    const teacherId = teacherElement.value.trim();
    const date = dateElement.value.trim();
    const room = roomElement.value.trim();
    const startTime = startElement.value.trim();
    const endTime = endElement.value.trim();

    if (!courseId || !teacherId || !date || !room || !startTime || !endTime) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    // Validate time
    if (startTime >= endTime) {
        showToast('End time must be after start time', 'error');
        return;
    }

    // Generate unique ID by finding max ID and adding 1
    const maxId = AppState.data.schedules.reduce((max, schedule) => {
        const idNum = parseInt(schedule.id.replace('SCH_', ''));
        return idNum > max ? idNum : max;
    }, 0);

    const newSchedule = {
        id: `SCH_${String(maxId + 1).padStart(3, '0')}`,
        course_id: courseId,
        class_id: 'CLASS001',
        teacher_id: teacherId,
        date,
        start_time: startTime,
        end_time: endTime,
        room
    };

    AppState.data.schedules.push(newSchedule);
    saveData();
    closeModal();
    renderSchedules();
    showToast('Schedule added successfully!', 'success');
}
