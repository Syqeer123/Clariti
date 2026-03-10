// Global App State
const AppState = {
    currentUser: null,
    currentPage: 'dashboard',
    data: {
        schools: [],
        users: [],
        courses: [],
        schedules: [],
        assignments: [],
        submissions: []
    }
};

// Load data from JSON files
async function loadData() {
    // Check if data already exists in localStorage
    const hasLocalData = localStorage.getItem('schools') !== null;

    if (hasLocalData) {
        // Use existing localStorage data (preserves user changes)
        console.log('Loading data from localStorage (preserving changes)');
        loadFromLocalStorage();
    } else {
        // First time: load from JSON files
        console.log('First load: Loading data from JSON files');
        try {
            const [schools, users, courses, schedules, assignments, submissions] = await Promise.all([
                fetch('data/schools.json').then(r => r.json()),
                fetch('data/users.json').then(r => r.json()),
                fetch('data/courses.json').then(r => r.json()),
                fetch('data/schedules.json').then(r => r.json()),
                fetch('data/assignments.json').then(r => r.json()),
                fetch('data/submissions.json').then(r => r.json())
            ]);

            AppState.data.schools = schools;
            AppState.data.users = users;
            AppState.data.courses = courses;
            AppState.data.schedules = schedules;
            AppState.data.assignments = assignments;
            AppState.data.submissions = submissions;

            // Save to localStorage for future use
            localStorage.setItem('schools', JSON.stringify(schools));
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('courses', JSON.stringify(courses));
            localStorage.setItem('schedules', JSON.stringify(schedules));
            localStorage.setItem('assignments', JSON.stringify(assignments));
            localStorage.setItem('submissions', JSON.stringify(submissions));
        } catch (error) {
            console.error('Error loading data:', error);
            // If fetch fails, try localStorage anyway
            loadFromLocalStorage();
        }
    }
}

function loadFromLocalStorage() {
    AppState.data.schools = JSON.parse(localStorage.getItem('schools') || '[]');
    AppState.data.users = JSON.parse(localStorage.getItem('users') || '[]');
    AppState.data.courses = JSON.parse(localStorage.getItem('courses') || '[]');
    AppState.data.schedules = JSON.parse(localStorage.getItem('schedules') || '[]');
    AppState.data.assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    AppState.data.submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('schools', JSON.stringify(AppState.data.schools));
    localStorage.setItem('users', JSON.stringify(AppState.data.users));
    localStorage.setItem('courses', JSON.stringify(AppState.data.courses));
    localStorage.setItem('schedules', JSON.stringify(AppState.data.schedules));
    localStorage.setItem('assignments', JSON.stringify(AppState.data.assignments));
    localStorage.setItem('submissions', JSON.stringify(AppState.data.submissions));
}

// Navigation System
const ROLE_NAVIGATION = {
    admin: [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
        { id: 'schools', label: 'Schools', icon: 'school' },
        { id: 'users', label: 'Users', icon: 'users' }
    ],
    headmaster: [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
        { id: 'teachers', label: 'Teachers', icon: 'users' },
        { id: 'students', label: 'Students', icon: 'users' },
        { id: 'courses', label: 'Courses', icon: 'book' }
    ],
    teacher: [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
        { id: 'calendar', label: 'Calendar', icon: 'calendar' },
        { id: 'schedules', label: 'Schedule List', icon: 'list' },
        { id: 'courses', label: 'My Courses', icon: 'book' },
        { id: 'assignments', label: 'Assignments', icon: 'assignment' },
        { id: 'forums', label: 'Forums', icon: 'forum' },
        { id: 'scores', label: 'Scores', icon: 'grade' }
    ],
    student: [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
        { id: 'calendar', label: 'Calendar', icon: 'calendar' },
        { id: 'schedules', label: 'Schedule List', icon: 'list' },
        { id: 'courses', label: 'My Courses', icon: 'book' },
        { id: 'assignments', label: 'Assignments', icon: 'assignment' },
        { id: 'forums', label: 'Forums', icon: 'forum' },
        { id: 'scores', label: 'My Grades', icon: 'grade' }
    ]
};

function renderNavigation() {
    const nav = document.getElementById('sidebarNav');
    const role = AppState.currentUser.role;
    const navItems = ROLE_NAVIGATION[role] || [];

    nav.innerHTML = navItems.map(item => `
        <button class="nav-item ${AppState.currentPage === item.id ? 'active' : ''}"
                onclick="navigateTo('${item.id}')">
            ${getIcon(item.icon)}
            <span>${item.label}</span>
        </button>
    `).join('');
}

function navigateTo(page) {
    AppState.currentPage = page;
    renderNavigation();
    renderPage(page);

    // Auto-close sidebar on mobile devices after navigating
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('sidebarOverlay').classList.remove('open');
    }
}

function renderPage(page) {
    const contentArea = document.getElementById('contentArea');

    // Trigger page transition animation
    contentArea.classList.remove('page-enter');
    void contentArea.offsetWidth; // Force a DOM reflow
    contentArea.classList.add('page-enter');

    switch (page) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'schools':
            renderSchools();
            break;
        case 'users':
            renderUsers();
            break;
        case 'students':
            renderStudents();
            break;
        case 'teachers':
            renderTeachers();
            break;
        case 'courses':
            renderCourses();
            break;
        case 'calendar':
            renderCalendar();
            break;
        case 'schedules':
            renderSchedules();
            break;
        case 'assignments':
            renderAssignments();
            break;
        case 'forums':
            renderForums();
            break;
        case 'scores':
            renderScores();
            break;
        default:
            contentArea.innerHTML = '<div class="empty-state"><h3>Page not found</h3></div>';
    }
}

// Icon Helper
function getIcon(name) {
    const icons = {
        dashboard: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
        school: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
        users: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
        book: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
        calendar: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
        assignment: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
        forum: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
        grade: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9" y1="15" x2="15" y2="15"></line></svg>',
        list: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>'
    };
    return icons[name] || '';
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Modal System
function showModal(title, content, actions = '') {
    const modal = document.getElementById('modalContainer');
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal(event)">
            <div class="modal" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                ${actions ? `<div class="modal-footer">${actions}</div>` : ''}
            </div>
        </div>
    `;
}

function closeModal(event) {
    if (!event || event.target.classList.contains('modal-overlay')) {
        document.getElementById('modalContainer').innerHTML = '';
    }
}

// Toggle Sidebar (Mobile)
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('open');
}

// Initialize App
async function initApp() {
    await loadData();
    checkAuth();
    initMobileDrag();
}

// Mobile Swipe Drag Logic
function initMobileDrag() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    let touchStartX = 0;
    let touchCurrentX = 0;
    let isDragging = false;
    let isSidebarInitiallyOpen = false;
    const sidebarWidth = 240; // var(--sidebar-width)

    document.addEventListener('touchstart', (e) => {
        // Only active on mobile viewport
        if (window.innerWidth > 768) return;

        // Prevent swipe starting if clicking deep inside a scrollable table or modal
        if (e.target.closest('.table-wrapper') || e.target.closest('.modal')) return;

        touchStartX = e.touches[0].clientX;
        isSidebarInitiallyOpen = sidebar.classList.contains('open');

        // Only allow opening swipe from the far left edge (< 30px)
        if (!isSidebarInitiallyOpen && touchStartX > 30) return;

        isDragging = true;
        sidebar.classList.add('dragging');
        overlay.style.display = 'block'; // Ensure overlay is available for opacity transitions
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;

        touchCurrentX = e.touches[0].clientX;
        let deltaX = touchCurrentX - touchStartX;

        let targetX = isSidebarInitiallyOpen ? deltaX : -sidebarWidth + deltaX;

        // Constrain movement bounds
        targetX = Math.max(-sidebarWidth, Math.min(0, targetX));

        // Calculate progress matching opacity (0 to 1)
        let openPercentage = 1 - (Math.abs(targetX) / sidebarWidth);

        sidebar.style.transform = `translateX(${targetX}px)`;
        overlay.style.opacity = openPercentage;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;

        sidebar.classList.remove('dragging');
        sidebar.style.transform = '';
        overlay.style.opacity = '';
        overlay.style.display = '';

        let deltaX = touchCurrentX - touchStartX;
        const threshold = 60; // minimum swipe distance to trigger state change

        if (isSidebarInitiallyOpen) {
            // Swiped left enough to close
            if (deltaX < -threshold) {
                sidebar.classList.remove('open');
                overlay.classList.remove('open');
            } else {
                sidebar.classList.add('open');
                overlay.classList.add('open');
            }
        } else {
            // Swiped right enough to open
            if (deltaX > threshold) {
                sidebar.classList.add('open');
                overlay.classList.add('open');
            } else {
                sidebar.classList.remove('open');
                overlay.classList.remove('open');
            }
        }
    }, { passive: true });
}

// Reset data to original state (useful for testing)
function resetData() {
    if (confirm('This will reset all data to original state. All changes will be lost. Are you sure?')) {
        localStorage.clear();
        location.reload();
    }
}

// Make resetData available globally for debugging
window.resetData = resetData;

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
