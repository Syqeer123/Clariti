// User Management

function renderUsers() {
    const contentArea = document.getElementById('contentArea');
    const users = AppState.data.users;

    contentArea.innerHTML = `
        <div class="dashboard-header">
            <h1>User Management</h1>
            <p>Manage all users in the system</p>
        </div>

        <div class="table-container">
            <div class="table-header">
                <h2>All Users</h2>
                <div class="table-actions">
                    <select class="table-filter" onchange="filterUsers(this.value)">
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="headmaster">Head Master</option>
                        <option value="teacher">Teacher</option>
                        <option value="student">Student</option>
                    </select>
                    <button class="btn btn-primary" onclick="showAddUserModal()">
                        Add User
                    </button>
                </div>
            </div>

            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>School ID</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="usersTableBody">
                        ${users.map(user => `
                            <tr data-role="${user.role}">
                                <td>
                                    <div class="user-info-cell">
                                        <div class="user-avatar-cell">${user.avatar}</div>
                                        <div>
                                            <div class="school-name">${user.name}</div>
                                            <div class="school-id">ID: ${user.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>${user.email}</td>
                                <td>
                                    <span class="badge badge-primary">
                                        ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                    </span>
                                </td>
                                <td>${user.school_id || 'N/A'}</td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="btn-icon btn-edit" onclick="editUser('${user.id}')" title="Edit">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                        </button>
                                        <button class="btn-icon btn-delete" onclick="deleteUser('${user.id}')" title="Delete">
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
            </div>
        </div>
    `;
}

function filterUsers(role) {
    const rows = document.querySelectorAll('#usersTableBody tr');
    rows.forEach(row => {
        if (role === 'all' || row.dataset.role === role) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function showAddUserModal() {
    const schools = AppState.data.schools;

    const content = `
        <form id="addUserForm">
            <div class="form-grid">
                <div class="form-group">
                    <label for="addUserName">Full Name <span class="required">*</span></label>
                    <input type="text" id="addUserName" required>
                </div>
                <div class="form-group">
                    <label for="addUserEmail">Email <span class="required">*</span></label>
                    <input type="email" id="addUserEmail" required>
                </div>
                <div class="form-group">
                    <label for="addUserPassword">Password <span class="required">*</span></label>
                    <input type="password" id="addUserPassword" required>
                </div>
                <div class="form-group">
                    <label for="addUserRole">Role <span class="required">*</span></label>
                    <select id="addUserRole" required>
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="headmaster">Head Master</option>
                        <option value="teacher">Teacher</option>
                        <option value="student">Student</option>
                    </select>
                </div>
                <div class="form-group form-grid-full">
                    <label for="addUserSchool">School</label>
                    <select id="addUserSchool">
                        <option value="">None</option>
                        ${schools.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                    </select>
                </div>
            </div>
        </form>
    `;

    const actions = `
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="addUser()">Add User</button>
    `;

    showModal('Add New User', content, actions);
}

function addUser() {
    // Get DOM elements with null checks
    const nameElement = document.getElementById('addUserName');
    const emailElement = document.getElementById('addUserEmail');
    const passwordElement = document.getElementById('addUserPassword');
    const roleElement = document.getElementById('addUserRole');
    const schoolElement = document.getElementById('addUserSchool');

    // Check if elements exist
    if (!nameElement || !emailElement || !passwordElement || !roleElement || !schoolElement) {
        showToast('Form elements not found. Please try again.', 'error');
        console.error('Missing form elements:', {
            nameElement: !!nameElement,
            emailElement: !!emailElement,
            passwordElement: !!passwordElement,
            roleElement: !!roleElement,
            schoolElement: !!schoolElement
        });
        return;
    }

    // Get values
    const name = nameElement.value.trim();
    const email = emailElement.value.trim();
    const password = passwordElement.value.trim();
    const role = roleElement.value.trim();
    const schoolValue = schoolElement.value;
    const school_id = schoolValue ? schoolValue.trim() : null;

    if (!name || !email || !password || !role) {
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

    const newUser = {
        id: `USR${String(maxId + 1).padStart(3, '0')}`,
        name,
        email,
        password,
        role,
        school_id,
        avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
        created_at: new Date().toISOString().split('T')[0]
    };

    AppState.data.users.push(newUser);
    saveData();
    closeModal();
    renderUsers();
    showToast('User added successfully!', 'success');
}

function editUser(id) {
    const user = AppState.data.users.find(u => u.id === id);
    if (!user) return;

    const schools = AppState.data.schools;

    const content = `
        <form id="editUserForm">
            <div class="form-grid">
                <div class="form-group">
                    <label for="editUserName">Full Name <span class="required">*</span></label>
                    <input type="text" id="editUserName" value="${user.name}" required>
                </div>
                <div class="form-group">
                    <label for="editUserEmail">Email <span class="required">*</span></label>
                    <input type="email" id="editUserEmail" value="${user.email}" required>
                </div>
                <div class="form-group">
                    <label for="editUserRole">Role <span class="required">*</span></label>
                    <select id="editUserRole" required>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                        <option value="headmaster" ${user.role === 'headmaster' ? 'selected' : ''}>Head Master</option>
                        <option value="teacher" ${user.role === 'teacher' ? 'selected' : ''}>Teacher</option>
                        <option value="student" ${user.role === 'student' ? 'selected' : ''}>Student</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="editUserSchool">School</label>
                    <select id="editUserSchool">
                        <option value="">None</option>
                        ${schools.map(s => `<option value="${s.id}" ${user.school_id === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}
                    </select>
                </div>
            </div>
        </form>
    `;

    const actions = `
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="updateUser('${id}')">Update User</button>
    `;

    showModal('Edit User', content, actions);
}

function updateUser(id) {
    // Get DOM elements with null checks (using edit-specific IDs)
    const nameElement = document.getElementById('editUserName');
    const emailElement = document.getElementById('editUserEmail');
    const roleElement = document.getElementById('editUserRole');
    const schoolElement = document.getElementById('editUserSchool');

    // Check if elements exist
    if (!nameElement || !emailElement || !roleElement || !schoolElement) {
        showToast('Form elements not found. Please try again.', 'error');
        console.error('Missing form elements:', {
            nameElement: !!nameElement,
            emailElement: !!emailElement,
            roleElement: !!roleElement,
            schoolElement: !!schoolElement
        });
        return;
    }

    // Get values
    const name = nameElement.value.trim();
    const email = emailElement.value.trim();
    const role = roleElement.value.trim();
    const schoolValue = schoolElement.value;
    const school_id = schoolValue ? schoolValue.trim() : null;

    if (!name || !email || !role) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    const userIndex = AppState.data.users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
        AppState.data.users[userIndex] = {
            ...AppState.data.users[userIndex],
            name,
            email,
            role,
            school_id,
            avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
        };

        saveData();
        closeModal();
        renderUsers();
        showToast('User updated successfully!', 'success');
    }
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        const userIndex = AppState.data.users.findIndex(u => u.id === id);
        if (userIndex !== -1) {
            AppState.data.users.splice(userIndex, 1);
            saveData();
            renderUsers();
            showToast('User deleted successfully!', 'success');
        }
    }
}
