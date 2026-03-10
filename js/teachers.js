// Teachers Management (for HeadMaster)

function renderTeachers() {
    const contentArea = document.getElementById('contentArea');
    const schoolId = AppState.currentUser.school_id;
    const teachers = AppState.data.users.filter(u => u.role === 'teacher' && u.school_id === schoolId);

    contentArea.innerHTML = `
        <div class="dashboard-header">
            <h1>Teachers Management</h1>
            <p>Manage teachers in your school</p>
        </div>

        <div class="table-container">
            <div class="table-header">
                <h2>All Teachers</h2>
                <div class="table-actions">
                    <button class="btn btn-primary" onclick="showAddTeacherModal()">
                        Add Teacher
                    </button>
                </div>
            </div>

            <div class="table-wrapper">
                ${teachers.length > 0 ? `
                    <table>
                        <thead>
                            <tr>
                                <th>Teacher</th>
                                <th>Email</th>
                                <th>Courses</th>
                                <th>Joined Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${teachers.map(teacher => {
                                const teacherCourses = AppState.data.courses.filter(c => c.teacher_id === teacher.id);
                                return `
                                    <tr>
                                        <td>
                                            <div class="user-info-cell">
                                                <div class="user-avatar-cell">${teacher.avatar}</div>
                                                <div>
                                                    <div class="school-name">${teacher.name}</div>
                                                    <div class="school-id">ID: ${teacher.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>${teacher.email}</td>
                                        <td>${teacherCourses.length} courses</td>
                                        <td>${teacher.created_at}</td>
                                        <td>
                                            <div class="action-buttons">
                                                <button class="btn-icon btn-delete" onclick="removeTeacher('${teacher.id}')" title="Remove">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                ` : `
                    <div class="empty-state">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                        </svg>
                        <h3>No teachers yet</h3>
                        <p>Add teachers to get started</p>
                    </div>
                `}
            </div>
        </div>
    `;
}

function showAddTeacherModal() {
    const content = `
        <form id="addTeacherForm">
            <div class="form-grid">
                <div class="form-group form-grid-full">
                    <label for="teacherName">Full Name <span class="required">*</span></label>
                    <input type="text" id="teacherName" required>
                </div>
                <div class="form-group form-grid-full">
                    <label for="teacherEmail">Email <span class="required">*</span></label>
                    <input type="email" id="teacherEmail" required>
                </div>
                <div class="form-group form-grid-full">
                    <label for="teacherPassword">Password <span class="required">*</span></label>
                    <input type="password" id="teacherPassword" value="teacher123" required>
                </div>
            </div>
        </form>
    `;

    const actions = `
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="addTeacher()">Add Teacher</button>
    `;

    showModal('Add New Teacher', content, actions);
}

function addTeacher() {
    // Get DOM elements with null checks
    const nameElement = document.getElementById('teacherName');
    const emailElement = document.getElementById('teacherEmail');
    const passwordElement = document.getElementById('teacherPassword');

    // Check if elements exist
    if (!nameElement || !emailElement || !passwordElement) {
        showToast('Form elements not found. Please try again.', 'error');
        return;
    }

    const name = nameElement.value.trim();
    const email = emailElement.value.trim();
    const password = passwordElement.value.trim();

    if (!name || !email || !password) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    // Check if email already exists
    if (AppState.data.users.some(u => u.email === email)) {
        showToast('Email already exists', 'error');
        return;
    }

    // Generate unique ID by finding max ID and adding 1
    const maxId = AppState.data.users.reduce((max, user) => {
        const idNum = parseInt(user.id.replace('USR', ''));
        return idNum > max ? idNum : max;
    }, 0);

    const newTeacher = {
        id: `USR${String(maxId + 1).padStart(3, '0')}`,
        name,
        email,
        password,
        role: 'teacher',
        school_id: AppState.currentUser.school_id,
        avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
        created_at: new Date().toISOString().split('T')[0]
    };

    AppState.data.users.push(newTeacher);
    saveData();
    closeModal();
    renderTeachers();
    showToast('Teacher added successfully!', 'success');
}

function removeTeacher(id) {
    if (confirm('Are you sure you want to remove this teacher?')) {
        const userIndex = AppState.data.users.findIndex(u => u.id === id);
        if (userIndex !== -1) {
            AppState.data.users.splice(userIndex, 1);
            saveData();
            renderTeachers();
            showToast('Teacher removed successfully!', 'success');
        }
    }
}
