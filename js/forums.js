// Forums Management

function renderForums() {
    const contentArea = document.getElementById('contentArea');
    const role = AppState.currentUser.role;

    contentArea.innerHTML = `
        <div class="dashboard-header">
            <h1>Discussion Forums</h1>
            <p>${role === 'teacher' ? 'Manage course forums' : 'Participate in discussions'}</p>
        </div>

        <div class="table-container">
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <h3>Forums Coming Soon</h3>
                <p>This feature will allow teachers and students to discuss course topics</p>
            </div>
        </div>
    `;
}
