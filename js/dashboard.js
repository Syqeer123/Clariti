// Dashboard Rendering

function renderDashboard() {
    const contentArea = document.getElementById('contentArea');
    const role = AppState.currentUser.role;

    switch(role) {
        case 'admin':
            renderAdminDashboard();
            break;
        case 'headmaster':
            renderHeadmasterDashboard();
            break;
        case 'teacher':
            renderTeacherDashboard();
            break;
        case 'student':
            renderStudentDashboard();
            break;
    }
}

function renderAdminDashboard() {
    const contentArea = document.getElementById('contentArea');
    const schools = AppState.data.schools;
    const users = AppState.data.users;

    const totalSchools = schools.length;
    const totalStudents = users.filter(u => u.role === 'student').length;
    const totalTeachers = users.filter(u => u.role === 'teacher').length;
    const totalCourses = AppState.data.courses.length;

    contentArea.innerHTML = `
        <div class="dashboard-header">
            <h1>Welcome back, ${AppState.currentUser.name}!</h1>
            <p>Here's what's happening with your system today</p>
        </div>

        <!-- Metrics -->
        <div class="metrics-grid">
            <div class="metric-card clickable" onclick="navigateTo('schools')">
                <div class="metric-icon" style="background-color: #E0E7FF;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                </div>
                <div class="metric-content">
                    <div class="metric-label">Total Schools</div>
                    <div class="metric-value">${totalSchools}</div>
                </div>
                <div class="metric-change positive">+5%</div>
            </div>

            <div class="metric-card clickable" onclick="navigateTo('users')">
                <div class="metric-icon" style="background-color: #D1FAE5;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    </svg>
                </div>
                <div class="metric-content">
                    <div class="metric-label">Total Students</div>
                    <div class="metric-value">${totalStudents}</div>
                </div>
                <div class="metric-change positive">+8%</div>
            </div>

            <div class="metric-card clickable" onclick="navigateTo('users')">
                <div class="metric-icon" style="background-color: #FEF3C7;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                    </svg>
                </div>
                <div class="metric-content">
                    <div class="metric-label">Total Teachers</div>
                    <div class="metric-value">${totalTeachers}</div>
                </div>
                <div class="metric-change positive">+5%</div>
            </div>

            <div class="metric-card clickable" onclick="navigateTo('schools')">
                <div class="metric-icon" style="background-color: #E0E7FF;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                </div>
                <div class="metric-content">
                    <div class="metric-label">Total Courses</div>
                    <div class="metric-value">${totalCourses}</div>
                </div>
                <div class="metric-change positive">+6%</div>
            </div>
        </div>

        <!-- Dashboard Grid -->
        <div class="dashboard-grid">
            <!-- Recent Activities -->
            <div class="activity-card">
                <div class="card-header">
                    <h3>Recent Activities</h3>
                    <a href="#" class="view-all" onclick="event.preventDefault(); showAllActivities()">View All</a>
                </div>
                <div class="activity-list">
                    <div class="activity-item">
                        <div class="activity-icon success">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <div class="activity-content">
                            <div class="activity-text">New school registered: Madison Prep</div>
                            <div class="activity-time">2 hours ago</div>
                        </div>
                    </div>
                    <div class="activity-item">
                        <div class="activity-icon primary">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="8.5" cy="7" r="4"></circle>
                                <line x1="20" y1="8" x2="20" y2="14"></line>
                                <line x1="23" y1="11" x2="17" y2="11"></line>
                            </svg>
                        </div>
                        <div class="activity-content">
                            <div class="activity-text">5 new teachers added to Lincoln High</div>
                            <div class="activity-time">5 hours ago</div>
                        </div>
                    </div>
                    <div class="activity-item">
                        <div class="activity-icon warning">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        </div>
                        <div class="activity-content">
                            <div class="activity-text">Jefferson Middle School pending approval</div>
                            <div class="activity-time">1 day ago</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="quick-actions-card">
                <div class="card-header">
                    <h3>Quick Actions</h3>
                </div>
                <div class="quick-actions-list">
                    <button class="quick-action-btn" onclick="navigateTo('schools')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        <span>Add New School</span>
                    </button>
                    <button class="quick-action-btn" onclick="navigateTo('users')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="8.5" cy="7" r="4"></circle>
                            <line x1="20" y1="8" x2="20" y2="14"></line>
                            <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                        <span>Manage Users</span>
                    </button>
                    <button class="quick-action-btn" onclick="showAccountInfo()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                        <span>Account Info</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Schools Table -->
        <div id="schoolsTableContainer"></div>
    `;

    // Render schools table
    renderSchoolsTable();
}

function renderHeadmasterDashboard() {
    const contentArea = document.getElementById('contentArea');
    const schoolId = AppState.currentUser.school_id;

    const teachers = AppState.data.users.filter(u => u.role === 'teacher' && u.school_id === schoolId);
    const students = AppState.data.users.filter(u => u.role === 'student' && u.school_id === schoolId);
    const courses = AppState.data.courses.filter(c => c.school_id === schoolId);
    const assignments = AppState.data.assignments.filter(a => {
        const course = AppState.data.courses.find(c => c.id === a.course_id);
        return course && course.school_id === schoolId;
    });

    contentArea.innerHTML = `
        <div class="dashboard-header">
            <h1>Welcome back, ${AppState.currentUser.name}!</h1>
            <p>Manage your school effectively</p>
        </div>

        <div class="metrics-grid">
            <div class="metric-card clickable" onclick="navigateTo('teachers')">
                <div class="metric-icon" style="background-color: #D1FAE5;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                    </svg>
                </div>
                <div class="metric-content">
                    <div class="metric-label">Teachers</div>
                    <div class="metric-value">${teachers.length}</div>
                </div>
                <div class="metric-change positive">+3%</div>
            </div>

            <div class="metric-card clickable" onclick="navigateTo('students')">
                <div class="metric-icon" style="background-color: #E0E7FF;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                    </svg>
                </div>
                <div class="metric-content">
                    <div class="metric-label">Students</div>
                    <div class="metric-value">${students.length}</div>
                </div>
                <div class="metric-change positive">+8%</div>
            </div>

            <div class="metric-card clickable" onclick="navigateTo('courses')">
                <div class="metric-icon" style="background-color: #FEF3C7;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                </div>
                <div class="metric-content">
                    <div class="metric-label">Courses</div>
                    <div class="metric-value">${courses.length}</div>
                </div>
                <div class="metric-change positive">+2%</div>
            </div>

            <div class="metric-card">
                <div class="metric-icon" style="background-color: #FECACA;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                </div>
                <div class="metric-content">
                    <div class="metric-label">Active Assignments</div>
                    <div class="metric-value">${assignments.length}</div>
                </div>
            </div>
        </div>

        <!-- Dashboard Grid -->
        <div class="dashboard-grid">
            <!-- Recent Activities -->
            <div class="activity-card">
                <div class="card-header">
                    <h3>Recent Activities</h3>
                </div>
                <div class="activity-list">
                    <div class="activity-item">
                        <div class="activity-icon success">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="8.5" cy="7" r="4"></circle>
                                <line x1="20" y1="8" x2="20" y2="14"></line>
                                <line x1="23" y1="11" x2="17" y2="11"></line>
                            </svg>
                        </div>
                        <div class="activity-content">
                            <div class="activity-text">New teacher added to staff</div>
                            <div class="activity-time">3 hours ago</div>
                        </div>
                    </div>
                    <div class="activity-item">
                        <div class="activity-icon primary">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                            </svg>
                        </div>
                        <div class="activity-content">
                            <div class="activity-text">New course added: ${courses.length > 0 ? courses[courses.length-1].name : 'Computer Science'}</div>
                            <div class="activity-time">1 day ago</div>
                        </div>
                    </div>
                    <div class="activity-item">
                        <div class="activity-icon success">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <div class="activity-content">
                            <div class="activity-text">${students.length} students enrolled this semester</div>
                            <div class="activity-time">2 days ago</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="quick-actions-card">
                <div class="card-header">
                    <h3>Quick Actions</h3>
                </div>
                <div class="quick-actions-list">
                    <button class="quick-action-btn" onclick="navigateTo('teachers')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="8.5" cy="7" r="4"></circle>
                            <line x1="20" y1="8" x2="20" y2="14"></line>
                            <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                        <span>Manage Teachers</span>
                    </button>
                    <button class="quick-action-btn" onclick="navigateTo('students')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                        </svg>
                        <span>Manage Students</span>
                    </button>
                    <button class="quick-action-btn" onclick="navigateTo('courses')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                        <span>Manage Courses</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Show all activities in a modal
function showAllActivities() {
    const allActivities = [
        { icon: 'success', text: 'New school registered: Madison Prep', time: '2 hours ago' },
        { icon: 'primary', text: '5 new teachers added to Lincoln High', time: '5 hours ago' },
        { icon: 'warning', text: 'Jefferson Middle School pending approval', time: '1 day ago' },
        { icon: 'success', text: 'Roosevelt Academy approved and activated', time: '2 days ago' },
        { icon: 'primary', text: 'System backup completed successfully', time: '3 days ago' },
        { icon: 'success', text: '15 new students enrolled across all schools', time: '4 days ago' },
        { icon: 'warning', text: 'Database maintenance scheduled for next week', time: '5 days ago' },
        { icon: 'primary', text: 'New feature: Student portal launched', time: '1 week ago' },
        { icon: 'success', text: '3 new courses added to curriculum', time: '1 week ago' },
        { icon: 'primary', text: 'Monthly performance report generated', time: '2 weeks ago' }
    ];

    const activitiesHTML = allActivities.map(activity => {
        const iconSVG = activity.icon === 'success' 
            ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
            : activity.icon === 'warning'
            ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>'
            : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>';

        return `
            <div class="activity-item">
                <div class="activity-icon ${activity.icon}">
                    ${iconSVG}
                </div>
                <div class="activity-content">
                    <div class="activity-text">${activity.text}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `;
    }).join('');

    const content = `
        <div class="all-activities-content">
            <div class="activity-list">
                ${activitiesHTML}
            </div>
        </div>
    `;

    const actions = `
        <button class="btn btn-secondary" onclick="closeModal()">Close</button>
    `;

    showModal('All Recent Activities', content, actions);
}

// Show account information
function showAccountInfo() {
    const user = AppState.currentUser;
    
    const content = `
        <div class="account-info-content">
            <div class="account-info-section">
                <h3>Your Account Information</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <label>Name:</label>
                        <span>${user.name}</span>
                    </div>
                    <div class="info-item">
                        <label>Email:</label>
                        <span>${user.email}</span>
                    </div>
                    <div class="info-item">
                        <label>Role:</label>
                        <span class="badge badge-primary">${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                    </div>
                    <div class="info-item">
                        <label>User ID:</label>
                        <span>${user.id}</span>
                    </div>
                </div>
            </div>

            <div class="account-info-section">
                <h3>How to Reset Your Password</h3>
                <ol class="reset-instructions">
                    <li>Click the "Logout" button in the sidebar</li>
                    <li>On the login page, click "Forgot Password?" (if available)</li>
                    <li>Enter your registered email address</li>
                    <li>Check your email for a password reset link</li>
                    <li>Click the link and follow the instructions to create a new password</li>
                </ol>
                <div class="info-note">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <p><strong>Note:</strong> If you need assistance with your account, please contact your system administrator at <strong>admin@edu.com</strong></p>
                </div>
            </div>

            <div class="account-info-section">
                <h3>Security Tips</h3>
                <ul class="security-tips">
                    <li>Use a strong password with at least 8 characters</li>
                    <li>Include uppercase, lowercase, numbers, and special characters</li>
                    <li>Never share your password with anyone</li>
                    <li>Change your password regularly (every 3-6 months)</li>
                    <li>Log out when using shared computers</li>
                </ul>
            </div>
        </div>
    `;

    const actions = `
        <button class="btn btn-secondary" onclick="closeModal()">Close</button>
    `;

    showModal('Account Information', content, actions);
}

function renderTeacherDashboard() {
    const contentArea = document.getElementById('contentArea');
    const teacherId = AppState.currentUser.id;

    const courses = AppState.data.courses.filter(c => c.teacher_id === teacherId);
    const schedules = AppState.data.schedules.filter(s => s.teacher_id === teacherId);
    const assignments = AppState.data.assignments.filter(a => a.created_by === teacherId);
    const submissions = AppState.data.submissions;
    const pendingSubmissions = submissions.filter(s => s.status === 'submitted');

    contentArea.innerHTML = `
        <div class="dashboard-header">
            <h1>Welcome back, ${AppState.currentUser.name}!</h1>
            <p>Manage your classes and students</p>
        </div>

        <div class="metrics-grid">
            <div class="metric-card clickable" onclick="navigateTo('courses')">
                <div class="metric-icon" style="background-color: #E0E7FF;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                </div>
                <div class="metric-content">
                    <div class="metric-label">My Courses</div>
                    <div class="metric-value">${courses.length}</div>
                </div>
            </div>

            <div class="metric-card clickable" onclick="navigateTo('schedules')">
                <div class="metric-icon" style="background-color: #D1FAE5;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                </div>
                <div class="metric-content">
                    <div class="metric-label">Classes This Week</div>
                    <div class="metric-value">${schedules.length}</div>
                </div>
            </div>

            <div class="metric-card clickable" onclick="navigateTo('assignments')">
                <div class="metric-icon" style="background-color: #FEF3C7;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                </div>
                <div class="metric-content">
                    <div class="metric-label">Active Assignments</div>
                    <div class="metric-value">${assignments.length}</div>
                </div>
            </div>

            <div class="metric-card clickable" onclick="navigateTo('submissions')">
                <div class="metric-icon" style="background-color: #FECACA;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2">
                        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path>
                        <path d="M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V3H9v2z"></path>
                    </svg>
                </div>
                <div class="metric-content">
                    <div class="metric-label">Pending Grading</div>
                    <div class="metric-value">${pendingSubmissions.length}</div>
                </div>
            </div>
        </div>

        <!-- Dashboard Grid -->
        <div class="dashboard-grid">
            <!-- Upcoming Classes -->
            <div class="activity-card">
                <div class="card-header">
                    <h3>Upcoming Classes</h3>
                    <a href="#" class="view-all" onclick="event.preventDefault(); navigateTo('schedules')">View All</a>
                </div>
                <div class="activity-list">
                    ${schedules.length > 0 ? schedules.slice(0, 3).map(schedule => {
                        const course = AppState.data.courses.find(c => c.id === schedule.course_id);
                        return `
                            <div class="activity-item">
                                <div class="activity-icon primary">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-text">${course ? course.name : 'Class'} - Room ${schedule.room}</div>
                                    <div class="activity-time">${schedule.day}, ${schedule.start_time} - ${schedule.end_time}</div>
                                </div>
                            </div>
                        `;
                    }).join('') : '<div class="empty-state"><p>No upcoming classes</p></div>'}
                </div>
            </div>

            <!-- Recent Assignments -->
            <div class="activity-card">
                <div class="card-header">
                    <h3>Recent Assignments</h3>
                    <a href="#" class="view-all" onclick="event.preventDefault(); navigateTo('assignments')">View All</a>
                </div>
                <div class="activity-list">
                    ${assignments.length > 0 ? assignments.slice(0, 3).map(assignment => {
                        const course = AppState.data.courses.find(c => c.id === assignment.course_id);
                        return `
                            <div class="activity-item">
                                <div class="activity-icon warning">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                    </svg>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-text">${assignment.title}</div>
                                    <div class="activity-time">${course ? course.name : 'Unknown'} - Due: ${assignment.due_date}</div>
                                </div>
                            </div>
                        `;
                    }).join('') : '<div class="empty-state"><p>No assignments yet</p></div>'}
                </div>
            </div>
        </div>
    `;
}

function renderStudentDashboard() {
    const contentArea = document.getElementById('contentArea');
    const studentId = AppState.currentUser.id;
    const schoolId = AppState.currentUser.school_id;

    const courses = AppState.data.courses.filter(c => c.school_id === schoolId);
    const assignments = AppState.data.assignments.filter(a => {
        const course = AppState.data.courses.find(c => c.id === a.course_id);
        return course && course.school_id === schoolId;
    });
    const schedules = AppState.data.schedules.filter(s => {
        const course = AppState.data.courses.find(c => c.id === s.course_id);
        return course && course.school_id === schoolId;
    });
    const mySubmissions = AppState.data.submissions.filter(s => s.student_id === studentId);
    const gradedSubmissions = mySubmissions.filter(s => s.status === 'graded');

    contentArea.innerHTML = `
        <div class="dashboard-header">
            <h1>Welcome back, ${AppState.currentUser.name}!</h1>
            <p>Keep up with your studies</p>
        </div>

        <div class="metrics-grid">
            <div class="metric-card clickable" onclick="navigateTo('courses')">
                <div class="metric-icon" style="background-color: #E0E7FF;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                </div>
                <div class="metric-content">
                    <div class="metric-label">Enrolled Courses</div>
                    <div class="metric-value">${courses.length}</div>
                </div>
            </div>

            <div class="metric-card clickable" onclick="navigateTo('assignments')">
                <div class="metric-icon" style="background-color: #FEF3C7;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                </div>
                <div class="metric-content">
                    <div class="metric-label">Pending Assignments</div>
                    <div class="metric-value">${assignments.length}</div>
                </div>
            </div>

            <div class="metric-card clickable" onclick="navigateTo('schedules')">
                <div class="metric-icon" style="background-color: #D1FAE5;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                    </svg>
                </div>
                <div class="metric-content">
                    <div class="metric-label">Classes This Week</div>
                    <div class="metric-value">${schedules.length}</div>
                </div>
            </div>

            <div class="metric-card clickable" onclick="navigateTo('scores')">
                <div class="metric-icon" style="background-color: #C7D2FE;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                </div>
                <div class="metric-content">
                    <div class="metric-label">Graded Work</div>
                    <div class="metric-value">${gradedSubmissions.length}</div>
                </div>
            </div>
        </div>

        <!-- Dashboard Grid -->
        <div class="dashboard-grid">
            <!-- Upcoming Assignments -->
            <div class="activity-card">
                <div class="card-header">
                    <h3>Upcoming Assignments</h3>
                    <a href="#" class="view-all" onclick="event.preventDefault(); navigateTo('assignments')">View All</a>
                </div>
                <div class="activity-list">
                    ${assignments.length > 0 ? assignments.slice(0, 3).map(assignment => {
                        const course = AppState.data.courses.find(c => c.id === assignment.course_id);
                        const dueDate = new Date(assignment.due_date);
                        const today = new Date();
                        const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                        const isUrgent = daysUntilDue <= 3;
                        return `
                            <div class="activity-item">
                                <div class="activity-icon ${isUrgent ? 'warning' : 'primary'}">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                    </svg>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-text">${assignment.title}</div>
                                    <div class="activity-time">${course ? course.name : 'Unknown'} - Due: ${assignment.due_date} ${isUrgent ? '(Urgent!)' : ''}</div>
                                </div>
                            </div>
                        `;
                    }).join('') : '<div class="empty-state"><p>No pending assignments</p></div>'}
                </div>
            </div>

            <!-- Upcoming Classes -->
            <div class="activity-card">
                <div class="card-header">
                    <h3>Upcoming Classes</h3>
                    <a href="#" class="view-all" onclick="event.preventDefault(); navigateTo('schedules')">View All</a>
                </div>
                <div class="activity-list">
                    ${schedules.length > 0 ? schedules.slice(0, 3).map(schedule => {
                        const course = AppState.data.courses.find(c => c.id === schedule.course_id);
                        const teacher = AppState.data.users.find(u => u.id === schedule.teacher_id);
                        return `
                            <div class="activity-item">
                                <div class="activity-icon success">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-text">${course ? course.name : 'Class'} - ${teacher ? teacher.name : 'Teacher'}</div>
                                    <div class="activity-time">${schedule.day}, ${schedule.start_time} - ${schedule.end_time}, Room ${schedule.room}</div>
                                </div>
                            </div>
                        `;
                    }).join('') : '<div class="empty-state"><p>No upcoming classes</p></div>'}
                </div>
            </div>
        </div>
    `;
}
