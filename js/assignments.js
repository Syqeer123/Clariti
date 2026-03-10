// Assignments Management

function renderAssignments() {
    const contentArea = document.getElementById('contentArea');
    const role = AppState.currentUser.role;
    const userId = AppState.currentUser.id;
    const schoolId = AppState.currentUser.school_id;
    let assignments = [];

    if (role === 'teacher') {
        // Teachers only see assignments they created
        assignments = AppState.data.assignments.filter(a => a.created_by === userId);
    } else if (role === 'student') {
        // Students see all assignments for courses in their school
        assignments = AppState.data.assignments.filter(a => {
            const course = AppState.data.courses.find(c => c.id === a.course_id);
            return course && course.school_id === schoolId;
        });
    } else if (role === 'headmaster') {
        // Headmaster sees all assignments in their school
        assignments = AppState.data.assignments.filter(a => {
            const course = AppState.data.courses.find(c => c.id === a.course_id);
            return course && course.school_id === schoolId;
        });
    } else if (role === 'admin') {
        // Admin sees all assignments
        assignments = AppState.data.assignments;
    }

    contentArea.innerHTML = `
        <div class="dashboard-header">
            <h1>Assignments</h1>
            <p>${role === 'teacher' ? 'Manage your assignments' : 'View your assignments'}</p>
        </div>

        <div class="table-container">
            <div class="table-header">
                <h2>All Assignments</h2>
                ${role === 'teacher' ? '<button class="btn btn-primary" onclick="showAddAssignmentModal()">Create Assignment</button>' : ''}
            </div>

            <div class="table-wrapper">
                ${assignments.length > 0 ? `
                    <table>
                        <thead>
                            <tr>
                                <th>Assignment</th>
                                <th>Course</th>
                                <th>Due Date</th>
                                <th>Max Score</th>
                                <th>Status</th>
                                ${role === 'student' || role === 'teacher' ? '<th>Action</th>' : ''}
                            </tr>
                        </thead>
                        <tbody>
                            ${assignments.map(assignment => {
                                const course = AppState.data.courses.find(c => c.id === assignment.course_id);
                                const dueDate = new Date(assignment.due_date);
                                const today = new Date();
                                const isPast = dueDate < today;

                                // For students: check submission status
                                let submissionStatus = '';
                                let actionButton = '';

                                if (role === 'student') {
                                    const submission = AppState.data.submissions.find(s =>
                                        s.assignment_id === assignment.id && s.student_id === userId
                                    );

                                    if (submission) {
                                        if (submission.status === 'graded') {
                                            submissionStatus = `<span class="badge badge-success">Graded: ${submission.score}/${assignment.max_score}</span>`;
                                            actionButton = `<button class="btn btn-sm btn-primary" onclick="showSubmissionPage('${assignment.id}')">View Grade</button>`;
                                        } else {
                                            submissionStatus = `<span class="badge badge-warning">Submitted</span>`;
                                            actionButton = `<button class="btn btn-sm btn-secondary" onclick="showSubmissionPage('${assignment.id}')">View Submission</button>`;
                                        }
                                    } else {
                                        submissionStatus = `<span class="badge badge-danger">Not Submitted</span>`;
                                        actionButton = `<button class="btn btn-sm btn-primary" onclick="showSubmissionPage('${assignment.id}')">Submit Now</button>`;
                                    }
                                } else if (role === 'teacher') {
                                    const assignmentSubmissions = AppState.data.submissions.filter(s => s.assignment_id === assignment.id);
                                    const ungradedCount = assignmentSubmissions.filter(s => s.status === 'submitted').length;

                                    submissionStatus = `<span class="badge badge-${ungradedCount > 0 ? 'warning' : 'success'}">${assignmentSubmissions.length} Submissions</span>`;
                                    if (ungradedCount > 0) {
                                        submissionStatus += ` <span class="badge badge-danger">${ungradedCount} Ungraded</span>`;
                                    }
                                    actionButton = `<button class="btn btn-sm btn-primary" onclick="showGradingPage('${assignment.id}')">Grade</button>`;
                                }

                                return `
                                    <tr>
                                        <td>
                                            <div class="school-name">${assignment.title}</div>
                                            <div class="school-id">${assignment.description}</div>
                                        </td>
                                        <td>${course ? course.name : 'N/A'}</td>
                                        <td>${assignment.due_date}</td>
                                        <td>${assignment.max_score} points</td>
                                        <td>
                                            <span class="badge badge-${isPast ? 'danger' : 'success'}">
                                                ${isPast ? 'Overdue' : 'Active'}
                                            </span>
                                            ${submissionStatus}
                                        </td>
                                        ${role === 'student' || role === 'teacher' ? `
                                            <td>${actionButton}</td>
                                        ` : ''}
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                ` : `
                    <div class="empty-state">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        <h3>No assignments yet</h3>
                        <p>Assignments will appear here once created</p>
                    </div>
                `}
            </div>
        </div>
    `;
}

function showAddAssignmentModal() {
    const teacherId = AppState.currentUser.id;
    const courses = AppState.data.courses.filter(c => c.teacher_id === teacherId);

    const content = `
        <form id="addAssignmentForm">
            <div class="form-grid">
                <div class="form-group form-grid-full">
                    <label for="assignmentTitle">Title <span class="required">*</span></label>
                    <input type="text" id="assignmentTitle" required>
                </div>
                <div class="form-group form-grid-full">
                    <label for="assignmentDesc">Description <span class="required">*</span></label>
                    <textarea id="assignmentDesc" rows="3" required></textarea>
                </div>
                <div class="form-group">
                    <label for="assignmentCourse">Course <span class="required">*</span></label>
                    <select id="assignmentCourse" required>
                        <option value="">Select Course</option>
                        ${courses.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="assignmentDue">Due Date <span class="required">*</span></label>
                    <input type="date" id="assignmentDue" required>
                </div>
                <div class="form-group form-grid-full">
                    <label for="assignmentScore">Max Score <span class="required">*</span></label>
                    <input type="number" id="assignmentScore" value="100" required min="1">
                </div>
            </div>
        </form>
    `;

    const actions = `
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="addAssignment()">Create Assignment</button>
    `;

    showModal('Create Assignment', content, actions);
}

function addAssignment() {
    // Get DOM elements with null checks
    const titleElement = document.getElementById('assignmentTitle');
    const descElement = document.getElementById('assignmentDesc');
    const courseElement = document.getElementById('assignmentCourse');
    const dueElement = document.getElementById('assignmentDue');
    const scoreElement = document.getElementById('assignmentScore');

    // Check if elements exist
    if (!titleElement || !descElement || !courseElement || !dueElement || !scoreElement) {
        showToast('Form elements not found. Please try again.', 'error');
        return;
    }

    const title = titleElement.value.trim();
    const description = descElement.value.trim();
    const courseId = courseElement.value.trim();
    const dueDate = dueElement.value.trim();
    const maxScore = parseInt(scoreElement.value);

    if (!title || !description || !courseId || !dueDate || !maxScore) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    // Validate max score
    if (maxScore <= 0) {
        showToast('Max score must be greater than 0', 'error');
        return;
    }

    // Generate unique ID by finding max ID and adding 1
    const maxId = AppState.data.assignments.reduce((max, assignment) => {
        const idNum = parseInt(assignment.id.replace('ASN', ''));
        return idNum > max ? idNum : max;
    }, 0);

    const newAssignment = {
        id: `ASN${String(maxId + 1).padStart(3, '0')}`,
        course_id: courseId,
        title,
        description,
        due_date: dueDate,
        max_score: maxScore,
        created_by: AppState.currentUser.id,
        created_at: new Date().toISOString().split('T')[0]
    };

    AppState.data.assignments.push(newAssignment);
    saveData();
    closeModal();
    renderAssignments();
    showToast('Assignment created successfully!', 'success');
}
