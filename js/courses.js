// Courses Management

function renderCourses() {
    const contentArea = document.getElementById('contentArea');
    const role = AppState.currentUser.role;
    let courses = [];

    if (role === 'headmaster') {
        courses = AppState.data.courses.filter(c => c.school_id === AppState.currentUser.school_id);
    } else if (role === 'teacher') {
        courses = AppState.data.courses.filter(c => c.teacher_id === AppState.currentUser.id);
    } else if (role === 'student') {
        courses = AppState.data.courses.filter(c => c.school_id === AppState.currentUser.school_id);
    }

    contentArea.innerHTML = `
        <div class="dashboard-header">
            <h1>Courses</h1>
            <p>${role === 'headmaster' ? 'Manage all courses' : role === 'teacher' ? 'Your teaching courses' : 'Your enrolled courses'}</p>
        </div>

        <div class="table-container">
            <div class="table-header">
                <h2>All Courses</h2>
                <div class="table-actions">
                    ${role === 'headmaster' ? '<button class="btn btn-primary" onclick="showAddCourseModal()">Add Course</button>' : ''}
                </div>
            </div>

            <div class="table-wrapper">
                ${courses.length > 0 ? `
                    <table>
                        <thead>
                            <tr>
                                <th>Course Code</th>
                                <th>Course Name</th>
                                <th>Teacher</th>
                                <th>Students</th>
                                <th>Credits</th>
                                ${role === 'headmaster' ? '<th>Actions</th>' : ''}
                            </tr>
                        </thead>
                        <tbody>
                            ${courses.map(course => {
                                const teacher = AppState.data.users.find(u => u.id === course.teacher_id);
                                // Count students enrolled (all students in the same school)
                                const studentCount = AppState.data.users.filter(u => 
                                    u.role === 'student' && u.school_id === course.school_id
                                ).length;
                                
                                return `
                                    <tr>
                                        <td><span class="badge badge-primary">${course.code}</span></td>
                                        <td>
                                            <div class="course-name">${course.name}</div>
                                            <div class="course-desc">${course.description}</div>
                                        </td>
                                        <td>${teacher ? teacher.name : 'N/A'}</td>
                                        <td>
                                            <span class="badge badge-success">${studentCount} enrolled</span>
                                        </td>
                                        <td><span class="course-credits">${course.credits} credits</span></td>
                                        ${role === 'headmaster' ? `
                                            <td>
                                                <div class="action-buttons">
                                                    <button class="btn-icon btn-edit" onclick="editCourse('${course.id}')" title="Edit">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                        </svg>
                                                    </button>
                                                    <button class="btn-icon btn-delete" onclick="deleteCourse('${course.id}')" title="Delete">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                            <polyline points="3 6 5 6 21 6"></polyline>
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        ` : ''}
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                ` : `
                    <div class="empty-state">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                        <h3>No courses available</h3>
                        <p>Courses will appear here once added</p>
                    </div>
                `}
            </div>
        </div>
    `;
}

function showAddCourseModal() {
    const schoolId = AppState.currentUser.school_id;
    const teachers = AppState.data.users.filter(u => u.role === 'teacher' && u.school_id === schoolId);

    const content = `
        <form id="addCourseForm">
            <div class="form-grid">
                <div class="form-group">
                    <label for="addCourseName">Course Name <span class="required">*</span></label>
                    <input type="text" id="addCourseName" required>
                </div>
                <div class="form-group">
                    <label for="addCourseCode">Course Code <span class="required">*</span></label>
                    <input type="text" id="addCourseCode" required placeholder="e.g., MATH101">
                </div>
                <div class="form-group form-grid-full">
                    <label for="addCourseDesc">Description</label>
                    <textarea id="addCourseDesc" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label for="addCourseTeacher">Teacher <span class="required">*</span></label>
                    <select id="addCourseTeacher" required>
                        <option value="">Select Teacher</option>
                        ${teachers.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="addCourseCredits">Credits <span class="required">*</span></label>
                    <input type="number" id="addCourseCredits" required min="1" max="6" value="3">
                </div>
            </div>
        </form>
    `;

    const actions = `
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="addCourse()">Add Course</button>
    `;

    showModal('Add New Course', content, actions);
}

function addCourse() {
    // Get DOM elements with null checks
    const nameElement = document.getElementById('addCourseName');
    const codeElement = document.getElementById('addCourseCode');
    const descElement = document.getElementById('addCourseDesc');
    const teacherElement = document.getElementById('addCourseTeacher');
    const creditsElement = document.getElementById('addCourseCredits');

    // Check if elements exist
    if (!nameElement || !codeElement || !descElement || !teacherElement || !creditsElement) {
        showToast('Form elements not found. Please try again.', 'error');
        return;
    }

    const name = nameElement.value.trim();
    const code = codeElement.value.trim();
    const description = descElement.value.trim();
    const teacherId = teacherElement.value.trim();
    const credits = parseInt(creditsElement.value);

    if (!name || !code || !teacherId || !credits) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    // Check if course code already exists
    if (AppState.data.courses.some(c => c.code === code)) {
        showToast('Course code already exists', 'error');
        return;
    }

    // Generate unique ID by finding max ID and adding 1
    const maxId = AppState.data.courses.reduce((max, course) => {
        const idNum = parseInt(course.id.replace('CRS', ''));
        return idNum > max ? idNum : max;
    }, 0);

    const newCourse = {
        id: `CRS${String(maxId + 1).padStart(3, '0')}`,
        name,
        code,
        description,
        teacher_id: teacherId,
        school_id: AppState.currentUser.school_id,
        credits
    };

    AppState.data.courses.push(newCourse);
    saveData();
    closeModal();
    renderCourses();
    showToast('Course added successfully!', 'success');
}

function editCourse(id) {
    const course = AppState.data.courses.find(c => c.id === id);
    if (!course) return;

    const schoolId = AppState.currentUser.school_id;
    const teachers = AppState.data.users.filter(u => u.role === 'teacher' && u.school_id === schoolId);

    const content = `
        <form id="editCourseForm">
            <div class="form-grid">
                <div class="form-group">
                    <label for="editCourseName">Course Name <span class="required">*</span></label>
                    <input type="text" id="editCourseName" value="${course.name}" required>
                </div>
                <div class="form-group">
                    <label for="editCourseCode">Course Code <span class="required">*</span></label>
                    <input type="text" id="editCourseCode" value="${course.code}" required>
                </div>
                <div class="form-group form-grid-full">
                    <label for="editCourseDesc">Description</label>
                    <textarea id="editCourseDesc" rows="3">${course.description}</textarea>
                </div>
                <div class="form-group">
                    <label for="editCourseTeacher">Teacher <span class="required">*</span></label>
                    <select id="editCourseTeacher" required>
                        ${teachers.map(t => `<option value="${t.id}" ${course.teacher_id === t.id ? 'selected' : ''}>${t.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="editCourseCredits">Credits <span class="required">*</span></label>
                    <input type="number" id="editCourseCredits" value="${course.credits}" required min="1" max="6">
                </div>
            </div>
        </form>
    `;

    const actions = `
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="updateCourse('${id}')">Update Course</button>
    `;

    showModal('Edit Course', content, actions);
}

function updateCourse(id) {
    // Get DOM elements with null checks
    const nameElement = document.getElementById('editCourseName');
    const codeElement = document.getElementById('editCourseCode');
    const descElement = document.getElementById('editCourseDesc');
    const teacherElement = document.getElementById('editCourseTeacher');
    const creditsElement = document.getElementById('editCourseCredits');

    // Check if elements exist
    if (!nameElement || !codeElement || !descElement || !teacherElement || !creditsElement) {
        showToast('Form elements not found. Please try again.', 'error');
        return;
    }

    const name = nameElement.value.trim();
    const code = codeElement.value.trim();
    const description = descElement.value.trim();
    const teacherId = teacherElement.value.trim();
    const credits = parseInt(creditsElement.value);

    if (!name || !code || !teacherId || !credits) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    const courseIndex = AppState.data.courses.findIndex(c => c.id === id);
    if (courseIndex !== -1) {
        AppState.data.courses[courseIndex] = {
            ...AppState.data.courses[courseIndex],
            name,
            code,
            description,
            teacher_id: teacherId,
            credits
        };

        saveData();
        closeModal();
        renderCourses();
        showToast('Course updated successfully!', 'success');
    }
}

function deleteCourse(id) {
    if (confirm('Are you sure you want to delete this course?')) {
        const courseIndex = AppState.data.courses.findIndex(c => c.id === id);
        if (courseIndex !== -1) {
            AppState.data.courses.splice(courseIndex, 1);
            saveData();
            renderCourses();
            showToast('Course deleted successfully!', 'success');
        }
    }
}
