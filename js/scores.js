// Scores Management

function renderScores() {
    const contentArea = document.getElementById('contentArea');
    const role = AppState.currentUser.role;
    const userId = AppState.currentUser.id;

    if (role === 'student') {
        renderStudentScores(userId);
    } else if (role === 'teacher') {
        renderTeacherScores();
    } else {
        contentArea.innerHTML = `
            <div class="dashboard-header">
                <h1>Scores</h1>
                <p>Grade management system</p>
            </div>
            <div class="table-container">
                <div class="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <h3>Access Restricted</h3>
                    <p>Only students and teachers can view scores</p>
                </div>
            </div>
        `;
    }
}

function renderStudentScores(studentId) {
    const contentArea = document.getElementById('contentArea');

    // Get all student submissions
    const submissions = AppState.data.submissions.filter(s => s.student_id === studentId);

    // Calculate statistics
    const gradedSubmissions = submissions.filter(s => s.status === 'graded');
    const totalScore = gradedSubmissions.reduce((sum, s) => sum + (s.score || 0), 0);
    const totalPossible = gradedSubmissions.length * 100; // Assuming max 100 per assignment
    const overallPercentage = gradedSubmissions.length > 0 ? (totalScore / totalPossible) * 100 : 0;
    const pendingCount = submissions.filter(s => s.status === 'submitted').length;

    // Get all assignments for the student's courses
    const schoolId = AppState.currentUser.school_id;
    const studentCourses = AppState.data.courses.filter(c => c.school_id === schoolId);
    const assignments = AppState.data.assignments.filter(a =>
        studentCourses.some(c => c.id === a.course_id)
    );

    const content = `
        <div class="dashboard-header">
            <h1>My Grades</h1>
            <p>View your academic performance</p>
        </div>

        <!-- Grade Summary Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
            <div class="card" style="text-align: center; padding: 30px;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" style="margin: 0 auto 15px;">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                <h2 style="font-size: 36px; margin: 10px 0; color: #6366F1;">${overallPercentage.toFixed(1)}%</h2>
                <p style="color: #6B7280; font-weight: 600;">Overall Grade</p>
                <span class="badge badge-${getGradeClass(overallPercentage)}" style="font-size: 18px; margin-top: 10px;">${getGradeLetter(overallPercentage)}</span>
            </div>

            <div class="card" style="text-align: center; padding: 30px;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" style="margin: 0 auto 15px;">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <h2 style="font-size: 36px; margin: 10px 0; color: #10B981;">${gradedSubmissions.length}</h2>
                <p style="color: #6B7280; font-weight: 600;">Graded Assignments</p>
            </div>

            <div class="card" style="text-align: center; padding: 30px;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" style="margin: 0 auto 15px;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <h2 style="font-size: 36px; margin: 10px 0; color: #F59E0B;">${pendingCount}</h2>
                <p style="color: #6B7280; font-weight: 600;">Pending Grades</p>
            </div>

            <div class="card" style="text-align: center; padding: 30px;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" stroke-width="2" style="margin: 0 auto 15px;">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <h2 style="font-size: 36px; margin: 10px 0; color: #8B5CF6;">${assignments.length}</h2>
                <p style="color: #6B7280; font-weight: 600;">Total Assignments</p>
            </div>
        </div>

        <!-- Grades Table -->
        <div class="card">
            <div style="padding: 20px; border-bottom: 1px solid #E5E7EB;">
                <h2>Assignment Grades</h2>
            </div>

            ${assignments.length > 0 ? `
                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Assignment</th>
                                <th>Course</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Score</th>
                                <th>Grade</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${assignments.map(assignment => {
                                const course = AppState.data.courses.find(c => c.id === assignment.course_id);
                                const submission = submissions.find(s => s.assignment_id === assignment.id);

                                let statusBadge = '<span class="badge badge-danger">Not Submitted</span>';
                                let scoreBadge = '<span style="color: #6B7280;">-</span>';
                                let gradeBadge = '<span style="color: #6B7280;">-</span>';
                                let actionButton = `<button class="btn btn-sm btn-primary" onclick="showSubmissionPage('${assignment.id}')">Submit</button>`;

                                if (submission) {
                                    if (submission.status === 'graded') {
                                        const percentage = (submission.score / assignment.max_score) * 100;
                                        statusBadge = '<span class="badge badge-success">Graded</span>';
                                        scoreBadge = `<strong>${submission.score}/${assignment.max_score}</strong>`;
                                        gradeBadge = `<span class="badge badge-${getGradeClass(percentage)}" style="font-size: 14px;">${getGradeLetter(percentage)}</span>`;
                                        actionButton = `<button class="btn btn-sm btn-secondary" onclick="viewGradeDetail('${submission.id}')">View Details</button>`;
                                    } else {
                                        statusBadge = '<span class="badge badge-warning">Pending Grade</span>';
                                        actionButton = `<button class="btn btn-sm btn-secondary" onclick="showSubmissionPage('${assignment.id}')">View Submission</button>`;
                                    }
                                }

                                return `
                                    <tr>
                                        <td>
                                            <div style="font-weight: 600;">${assignment.title}</div>
                                            <div style="font-size: 12px; color: #6B7280;">${assignment.description}</div>
                                        </td>
                                        <td>${course ? course.name : 'N/A'}</td>
                                        <td>${formatDate(assignment.due_date)}</td>
                                        <td>${statusBadge}</td>
                                        <td>${scoreBadge}</td>
                                        <td>${gradeBadge}</td>
                                        <td>${actionButton}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            ` : `
                <div class="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <h3>No Assignments Yet</h3>
                    <p>Assignments will appear here once created by your teachers</p>
                </div>
            `}
        </div>
    `;

    contentArea.innerHTML = content;
}

function renderTeacherScores() {
    const contentArea = document.getElementById('contentArea');
    const teacherId = AppState.currentUser.id;

    // Get teacher's courses
    const teacherCourses = AppState.data.courses.filter(c => c.teacher_id === teacherId);

    // Get assignments for teacher's courses
    const assignments = AppState.data.assignments.filter(a =>
        teacherCourses.some(c => c.id === a.course_id)
    );

    // Get all submissions for these assignments
    const allSubmissions = AppState.data.submissions.filter(s =>
        assignments.some(a => a.id === s.assignment_id)
    );

    const ungradedCount = allSubmissions.filter(s => s.status === 'submitted').length;
    const gradedCount = allSubmissions.filter(s => s.status === 'graded').length;

    const content = `
        <div class="dashboard-header">
            <h1>Grade Management</h1>
            <p>View and manage student grades</p>
        </div>

        <!-- Summary Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
            <div class="card" style="text-align: center; padding: 30px;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2" style="margin: 0 auto 15px;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h2 style="font-size: 36px; margin: 10px 0; color: #EF4444;">${ungradedCount}</h2>
                <p style="color: #6B7280; font-weight: 600;">Ungraded Submissions</p>
            </div>

            <div class="card" style="text-align: center; padding: 30px;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" style="margin: 0 auto 15px;">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <h2 style="font-size: 36px; margin: 10px 0; color: #10B981;">${gradedCount}</h2>
                <p style="color: #6B7280; font-weight: 600;">Graded Submissions</p>
            </div>

            <div class="card" style="text-align: center; padding: 30px;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" style="margin: 0 auto 15px;">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <h2 style="font-size: 36px; margin: 10px 0; color: #6366F1;">${assignments.length}</h2>
                <p style="color: #6B7280; font-weight: 600;">Total Assignments</p>
            </div>
        </div>

        <!-- Assignments Needing Grading -->
        <div class="card">
            <div style="padding: 20px; border-bottom: 1px solid #E5E7EB;">
                <h2>Assignments to Grade</h2>
            </div>

            ${assignments.length > 0 ? `
                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Assignment</th>
                                <th>Course</th>
                                <th>Submissions</th>
                                <th>Ungraded</th>
                                <th>Graded</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${assignments.map(assignment => {
                                const course = AppState.data.courses.find(c => c.id === assignment.course_id);
                                const assignmentSubmissions = allSubmissions.filter(s => s.assignment_id === assignment.id);
                                const ungraded = assignmentSubmissions.filter(s => s.status === 'submitted').length;
                                const graded = assignmentSubmissions.filter(s => s.status === 'graded').length;

                                return `
                                    <tr>
                                        <td>
                                            <div style="font-weight: 600;">${assignment.title}</div>
                                            <div style="font-size: 12px; color: #6B7280;">${assignment.description}</div>
                                        </td>
                                        <td>${course ? course.name : 'N/A'}</td>
                                        <td><span class="badge badge-primary">${assignmentSubmissions.length}</span></td>
                                        <td><span class="badge badge-${ungraded > 0 ? 'danger' : 'secondary'}">${ungraded}</span></td>
                                        <td><span class="badge badge-success">${graded}</span></td>
                                        <td>
                                            <button class="btn btn-sm btn-primary" onclick="showGradingPage('${assignment.id}')">
                                                ${ungraded > 0 ? 'Grade Now' : 'Review'}
                                            </button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            ` : `
                <div class="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <h3>No Assignments Yet</h3>
                    <p>Create assignments to start grading students</p>
                </div>
            `}
        </div>
    `;

    contentArea.innerHTML = content;
}

function viewGradeDetail(submissionId) {
    const submission = AppState.data.submissions.find(s => s.id === submissionId);
    if (!submission) return;

    const assignment = AppState.data.assignments.find(a => a.id === submission.assignment_id);
    const course = AppState.data.courses.find(c => c.id === assignment.course_id);
    const percentage = (submission.score / assignment.max_score) * 100;

    const content = `
        <div style="text-align: center; margin-bottom: 30px;">
            <h2>${assignment.title}</h2>
            <p style="color: #6B7280;">${course ? course.name : 'N/A'}</p>
        </div>

        <div style="text-align: center; padding: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white; margin-bottom: 30px;">
            <h1 style="font-size: 72px; margin: 0;">${submission.score}</h1>
            <p style="font-size: 24px; margin: 10px 0;">out of ${assignment.max_score}</p>
            <div style="font-size: 48px; margin-top: 20px;">
                <span class="badge" style="background: rgba(255,255,255,0.3); color: white; padding: 10px 30px; font-size: 32px;">${getGradeLetter(percentage)}</span>
            </div>
            <p style="margin-top: 10px; font-size: 18px;">${percentage.toFixed(1)}%</p>
        </div>

        <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3>Submission Details</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 15px;">
                <div>
                    <label style="font-weight: 600; color: #6B7280;">Submitted:</label>
                    <p>${formatDateTime(submission.submitted_at)}</p>
                </div>
                <div>
                    <label style="font-weight: 600; color: #6B7280;">Graded:</label>
                    <p>${formatDateTime(submission.graded_at)}</p>
                </div>
                <div>
                    <label style="font-weight: 600; color: #6B7280;">Status:</label>
                    <p>${submission.is_late ? '<span class="badge badge-danger">Late</span>' : '<span class="badge badge-success">On Time</span>'}</p>
                </div>
            </div>
        </div>

        <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3>Teacher Feedback</h3>
            <p style="white-space: pre-wrap; margin-top: 15px; line-height: 1.6;">${submission.feedback || 'No feedback provided'}</p>
        </div>

        ${submission.text_content ? `
            <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3>Your Answer</h3>
                <p style="white-space: pre-wrap; margin-top: 15px; line-height: 1.6;">${submission.text_content}</p>
            </div>
        ` : ''}

        ${submission.files && submission.files.length > 0 ? `
            <div style="background: #F9FAFB; padding: 20px; border-radius: 8px;">
                <h3>Submitted Files</h3>
                <div style="margin-top: 15px;">
                    ${submission.files.map(file => `
                        <div style="display: flex; align-items: center; padding: 10px; background: white; border-radius: 8px; margin-bottom: 10px;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                                <polyline points="13 2 13 9 20 9"></polyline>
                            </svg>
                            <span style="margin-left: 10px; flex: 1;">${file.file_name}</span>
                            <span style="color: #6B7280; margin-right: 10px;">${formatFileSize(file.file_size)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}
    `;

    const actions = `
        <button class="btn btn-secondary" onclick="closeModal()">Close</button>
        <button class="btn btn-primary" onclick="closeModal(); navigateTo('scores');">Back to Grades</button>
    `;

    showModal('Grade Details', content, actions);
}

function getGradeLetter(percentage) {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
}

function getGradeClass(percentage) {
    if (percentage >= 90) return 'success';
    if (percentage >= 80) return 'primary';
    if (percentage >= 70) return 'warning';
    if (percentage >= 60) return 'warning';
    return 'danger';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}
