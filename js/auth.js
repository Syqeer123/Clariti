// Authentication System

function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
        AppState.currentUser = JSON.parse(currentUser);
        showMainApp();
    } else {
        showLoginPage();
    }
}

function showLoginPage() {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
}

function showMainApp() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('mainApp').style.display = 'flex';

    updateUserInfo();
    renderNavigation();
    renderPage(AppState.currentPage);
}

function updateUserInfo() {
    const user = AppState.currentUser;
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('userAvatar').textContent = user.avatar;
}

// Login Form Handler
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }
});

function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Find user in data (auto-detect role from credentials)
    const user = AppState.data.users.find(u =>
        u.email === email &&
        u.password === password
    );

    if (user) {
        // Store user info (excluding password)
        const userInfo = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            school_id: user.school_id,
            avatar: user.avatar
        };

        localStorage.setItem('currentUser', JSON.stringify(userInfo));
        AppState.currentUser = userInfo;

        showToast(`Login successful! Welcome ${user.name}`, 'success');
        showMainApp();
    } else {
        showToast('Invalid email or password', 'error');
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    AppState.currentUser = null;
    AppState.currentPage = 'dashboard';
    showLoginPage();
    showToast('Logged out successfully', 'success');
}

// Role-based permissions
const PERMISSIONS = {
    admin: ['school.crud', 'user.crud', 'user.manage_role', 'view.school_count'],
    headmaster: ['teacher.crud', 'class.crud', 'student.crud', 'course.crud', 'schedule.crud'],
    teacher: ['schedule.view', 'forum.create', 'student.view_answer', 'score.assign'],
    student: ['schedule.view', 'forum.reply', 'course.view', 'assignment.view', 'attendance.view']
};

function hasPermission(permission) {
    if (!AppState.currentUser) return false;
    const userPermissions = PERMISSIONS[AppState.currentUser.role] || [];
    return userPermissions.includes(permission);
}
