// Students Management (for HeadMaster)

function renderStudents() {
    const contentArea = document.getElementById('contentArea');
    const schoolId = AppState.currentUser.school_id;
    const students = AppState.data.users.filter(u => u.role === 'student' && u.school_id === schoolId);

    contentArea.innerHTML = `
        <div class="dashboard-header">
            <h1>Students Management</h1>
            <p>Manage students in your school</p>
        </div>

        <div class="table-container">
            <div class="table-header">
                <h2>All Students</h2>
                <div class="table-actions">
                    <button class="btn btn-primary" onclick="showAddStudentModal()">
                        Add Student
                    </button>
                </div>
            </div>

            <div class="table-wrapper">
                ${students.length > 0 ? `
                    <table>
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Email</th>
                                <th>Joined Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${students.map(student => `
                                <tr>
                                    <td>
                                        <div class="user-info-cell">
                                            <div class="user-avatar-cell">${student.avatar}</div>
                                            <div>
                                                <div class="school-name">${student.name}</div>
                                                <div class="school-id">ID: ${student.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>${student.email}</td>
                                    <td>${student.created_at}</td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="btn-icon btn-delete" onclick="removeStudent('${student.id}')" title="Remove">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : `
                    <div class="empty-state">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                        </svg>
                        <h3>No students yet</h3>
                        <p>Add students to get started</p>
                    </div>
                `}
            </div>
        </div>
    `;
}

function showAddStudentModal() {
    const content = `
        <form id="addStudentForm">
            <div class="form-grid">
                <div class="form-group form-grid-full">
                    <label for="studentName">Full Name <span class="required">*</span></label>
                    <input type="text" id="studentName" required>
                </div>
                <div class="form-group form-grid-full">
                    <label for="studentEmail">Email <span class="required">*</span></label>
                    <input type="email" id="studentEmail" required>
                </div>
                <div class="form-group form-grid-full">
                    <label for="studentPassword">Password <span class="required">*</span></label>
                    <input type="password" id="studentPassword" value="student123" required>
                </div>
            </div>
        </form>
    `;

    const actions = `
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="addStudent()">Add Student</button>
    `;

    showModal('Add New Student', content, actions);
}

function addStudent() {
    // Get DOM elements with null checks
    const nameElement = document.getElementById('studentName');
    const emailElement = document.getElementById('studentEmail');
    const passwordElement = document.getElementById('studentPassword');

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

    const newStudent = {
        id: `USR${String(maxId + 1).padStart(3, '0')}`,
        name,
        email,
        password,
        role: 'student',
        school_id: AppState.currentUser.school_id,
        avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
        created_at: new Date().toISOString().split('T')[0]
    };

    AppState.data.users.push(newStudent);
    saveData();
    closeModal();
    renderStudents();
    showToast('Student added successfully!', 'success');
}

function removeStudent(id) {
    if (confirm('Are you sure you want to remove this student?')) {
        const userIndex = AppState.data.users.findIndex(u => u.id === id);
        if (userIndex !== -1) {
            AppState.data.users.splice(userIndex, 1);
            saveData();
            renderStudents();
            showToast('Student removed successfully!', 'success');
        }
    }
}
