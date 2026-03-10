// Schools Management

function renderSchools() {
    const contentArea = document.getElementById('contentArea');

    contentArea.innerHTML = `
        <div class="dashboard-header">
            <h1>Schools Management</h1>
            <p>Manage all schools in the system</p>
        </div>
        <div id="schoolsTableContainer"></div>
    `;

    renderSchoolsTable();
}

function renderSchoolsTable() {
    const container = document.getElementById('schoolsTableContainer');
    const schools = AppState.data.schools;

    container.innerHTML = `
        <div class="table-container">
            <div class="table-header">
                <h2>All Schools</h2>
                <div class="table-actions">
                    <select class="table-filter" onchange="filterSchools(this.value)">
                        <option value="all">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                    </select>
                    <button class="btn btn-primary" onclick="showAddSchoolModal()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add School
                    </button>
                </div>
            </div>

            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>School Name</th>
                            <th>Location</th>
                            <th>Students</th>
                            <th>Teachers</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="schoolsTableBody">
                        ${schools.map(school => `
                            <tr data-status="${school.status}">
                                <td>
                                    <div class="school-info">
                                        <div class="school-icon">${school.name.substring(0, 2).toUpperCase()}</div>
                                        <div class="school-details">
                                            <div class="school-name">${school.name}</div>
                                            <div class="school-id">ID: ${school.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>${school.location}</td>
                                <td>${school.students_count}</td>
                                <td>${school.teachers_count}</td>
                                <td>
                                    <span class="badge badge-${school.status === 'Active' ? 'success' : 'warning'}">
                                        ${school.status}
                                    </span>
                                </td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="btn-icon btn-view" onclick="viewSchool('${school.id}')" title="View">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        </button>
                                        <button class="btn-icon btn-edit" onclick="editSchool('${school.id}')" title="Edit">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                        </button>
                                        <button class="btn-icon btn-delete" onclick="deleteSchool('${school.id}')" title="Delete">
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

function filterSchools(status) {
    const rows = document.querySelectorAll('#schoolsTableBody tr');
    rows.forEach(row => {
        if (status === 'all' || row.dataset.status === status) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function showAddSchoolModal() {
    const content = `
        <form id="addSchoolForm">
            <div class="form-grid">
                <div class="form-group form-grid-full">
                    <label for="schoolName">School Name <span class="required">*</span></label>
                    <input type="text" id="schoolName" required placeholder="Enter school name">
                </div>
                <div class="form-group form-grid-full">
                    <label for="schoolLocation">Location <span class="required">*</span></label>
                    <input type="text" id="schoolLocation" required placeholder="City, State">
                </div>
                <div class="form-group">
                    <label for="schoolStudents">Number of Students</label>
                    <input type="number" id="schoolStudents" value="0" min="0">
                </div>
                <div class="form-group">
                    <label for="schoolTeachers">Number of Teachers</label>
                    <input type="number" id="schoolTeachers" value="0" min="0">
                </div>
                <div class="form-group form-grid-full">
                    <label for="schoolStatus">Status</label>
                    <select id="schoolStatus">
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>
            </div>
        </form>
    `;

    const actions = `
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="addSchool()">Add School</button>
    `;

    showModal('Add New School', content, actions);
}

function addSchool() {
    // Get DOM elements with null checks
    const nameElement = document.getElementById('schoolName');
    const locationElement = document.getElementById('schoolLocation');
    const studentsElement = document.getElementById('schoolStudents');
    const teachersElement = document.getElementById('schoolTeachers');
    const statusElement = document.getElementById('schoolStatus');

    // Check if elements exist
    if (!nameElement || !locationElement || !studentsElement || !teachersElement || !statusElement) {
        showToast('Form elements not found. Please try again.', 'error');
        console.error('Missing form elements:', {
            nameElement: !!nameElement,
            locationElement: !!locationElement,
            studentsElement: !!studentsElement,
            teachersElement: !!teachersElement,
            statusElement: !!statusElement
        });
        return;
    }

    // Get values
    const name = nameElement.value.trim();
    const location = locationElement.value.trim();
    const students = parseInt(studentsElement.value) || 0;
    const teachers = parseInt(teachersElement.value) || 0;
    const status = statusElement.value.trim();

    if (!name || !location) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    // Generate unique ID by finding max ID and adding 1
    const maxId = AppState.data.schools.reduce((max, school) => {
        const idNum = parseInt(school.id.replace('SCH', ''));
        return idNum > max ? idNum : max;
    }, 0);

    const newSchool = {
        id: `SCH${String(maxId + 1).padStart(3, '0')}`,
        name: name,
        location: location,
        students_count: students,
        teachers_count: teachers,
        status: status,
        created_at: new Date().toISOString().split('T')[0]
    };

    AppState.data.schools.push(newSchool);
    saveData();
    closeModal();
    renderSchoolsTable();
    showToast('School added successfully!', 'success');
}

function editSchool(id) {
    const school = AppState.data.schools.find(s => s.id === id);
    if (!school) return;

    const content = `
        <form id="editSchoolForm">
            <div class="form-grid">
                <div class="form-group form-grid-full">
                    <label for="schoolName">School Name <span class="required">*</span></label>
                    <input type="text" id="schoolName" value="${school.name}" required>
                </div>
                <div class="form-group form-grid-full">
                    <label for="schoolLocation">Location <span class="required">*</span></label>
                    <input type="text" id="schoolLocation" value="${school.location}" required>
                </div>
                <div class="form-group">
                    <label for="schoolStudents">Number of Students</label>
                    <input type="number" id="schoolStudents" value="${school.students_count}" min="0">
                </div>
                <div class="form-group">
                    <label for="schoolTeachers">Number of Teachers</label>
                    <input type="number" id="schoolTeachers" value="${school.teachers_count}" min="0">
                </div>
                <div class="form-group form-grid-full">
                    <label for="schoolStatus">Status</label>
                    <select id="schoolStatus">
                        <option value="Active" ${school.status === 'Active' ? 'selected' : ''}>Active</option>
                        <option value="Pending" ${school.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    </select>
                </div>
            </div>
        </form>
    `;

    const actions = `
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="updateSchool('${id}')">Update School</button>
    `;

    showModal('Edit School', content, actions);
}

function updateSchool(id) {
    // Get DOM elements with null checks
    const nameElement = document.getElementById('schoolName');
    const locationElement = document.getElementById('schoolLocation');
    const studentsElement = document.getElementById('schoolStudents');
    const teachersElement = document.getElementById('schoolTeachers');
    const statusElement = document.getElementById('schoolStatus');

    // Check if elements exist
    if (!nameElement || !locationElement || !studentsElement || !teachersElement || !statusElement) {
        showToast('Form elements not found. Please try again.', 'error');
        console.error('Missing form elements:', {
            nameElement: !!nameElement,
            locationElement: !!locationElement,
            studentsElement: !!studentsElement,
            teachersElement: !!teachersElement,
            statusElement: !!statusElement
        });
        return;
    }

    // Get values
    const name = nameElement.value.trim();
    const location = locationElement.value.trim();
    const students = parseInt(studentsElement.value) || 0;
    const teachers = parseInt(teachersElement.value) || 0;
    const status = statusElement.value.trim();

    if (!name || !location) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    const schoolIndex = AppState.data.schools.findIndex(s => s.id === id);
    if (schoolIndex !== -1) {
        AppState.data.schools[schoolIndex] = {
            ...AppState.data.schools[schoolIndex],
            name,
            location,
            students_count: students,
            teachers_count: teachers,
            status
        };

        saveData();
        closeModal();
        renderSchoolsTable();
        showToast('School updated successfully!', 'success');
    }
}

function deleteSchool(id) {
    if (confirm('Are you sure you want to delete this school? This action cannot be undone.')) {
        const schoolIndex = AppState.data.schools.findIndex(s => s.id === id);
        if (schoolIndex !== -1) {
            AppState.data.schools.splice(schoolIndex, 1);
            saveData();
            renderSchoolsTable();
            showToast('School deleted successfully!', 'success');
        }
    }
}

function viewSchool(id) {
    const school = AppState.data.schools.find(s => s.id === id);
    if (!school) return;

    const content = `
        <div class="form-grid">
            <div class="form-group form-grid-full">
                <label>School Name</label>
                <p style="padding: 10px; background: #F9FAFB; border-radius: 8px;">${school.name}</p>
            </div>
            <div class="form-group form-grid-full">
                <label>Location</label>
                <p style="padding: 10px; background: #F9FAFB; border-radius: 8px;">${school.location}</p>
            </div>
            <div class="form-group">
                <label>Students</label>
                <p style="padding: 10px; background: #F9FAFB; border-radius: 8px;">${school.students_count}</p>
            </div>
            <div class="form-group">
                <label>Teachers</label>
                <p style="padding: 10px; background: #F9FAFB; border-radius: 8px;">${school.teachers_count}</p>
            </div>
            <div class="form-group">
                <label>Status</label>
                <p style="padding: 10px; background: #F9FAFB; border-radius: 8px;">
                    <span class="badge badge-${school.status === 'Active' ? 'success' : 'warning'}">${school.status}</span>
                </p>
            </div>
            <div class="form-group">
                <label>Created At</label>
                <p style="padding: 10px; background: #F9FAFB; border-radius: 8px;">${school.created_at}</p>
            </div>
        </div>
    `;

    const actions = `
        <button class="btn btn-secondary" onclick="closeModal()">Close</button>
    `;

    showModal('School Details', content, actions);
}
