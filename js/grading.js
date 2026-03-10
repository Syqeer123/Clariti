// Grading Management for Teachers

function showGradingPage(assignmentId) {
    const assignment = AppState.data.assignments.find(a => a.id === assignmentId);
    if (!assignment) return;

    const course = AppState.data.courses.find(c => c.id === assignment.course_id);
    const submissions = AppState.data.submissions.filter(s => s.assignment_id === assignmentId);

    const ungradedCount = submissions.filter(s => s.status === 'submitted').length;
    const gradedCount = submissions.filter(s => s.status === 'graded').length;
    const lateCount = submissions.filter(s => s.is_late).length;

    const content = `
        <div class="grading-page">
            <!-- Back Button -->
            <button class="btn btn-secondary" onclick="navigateTo('assignments')" style="margin-bottom: 20px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back to Assignments
            </button>

            <!-- Assignment Info Header -->
            <section class="card" style="margin-bottom: 20px;">
                <h1>Grade Assignment: ${assignment.title}</h1>
                <div style="display: flex; gap: 20px; margin-top: 15px; color: #6B7280;">
                    <span><strong>Course:</strong> ${course ? course.name : 'N/A'}</span>
                    <span><strong>Max Score:</strong> ${assignment.max_score}</span>
                    <span><strong>Submissions:</strong> ${submissions.length}</span>
                </div>
            </section>

            <!-- Grading Layout -->
            <div style="display: grid; grid-template-columns: 300px 1fr; gap: 20px;">
                <!-- Left Sidebar: Submissions List -->
                <aside class="card" style="height: fit-content;">
                    <div class="submissions-filters" style="display: flex; flex-direction: column; gap: 5px; margin-bottom: 15px;">
                        <button class="filter-btn active" data-filter="all" onclick="filterSubmissions('all', '${assignmentId}')" style="padding: 10px; border: 1px solid #E5E7EB; border-radius: 6px; background: #6366F1; color: white; cursor: pointer; text-align: left;">
                            All (${submissions.length})
                        </button>
                        <button class="filter-btn" data-filter="ungraded" onclick="filterSubmissions('ungraded', '${assignmentId}')" style="padding: 10px; border: 1px solid #E5E7EB; border-radius: 6px; background: white; cursor: pointer; text-align: left;">
                            Ungraded (${ungradedCount})
                        </button>
                        <button class="filter-btn" data-filter="graded" onclick="filterSubmissions('graded', '${assignmentId}')" style="padding: 10px; border: 1px solid #E5E7EB; border-radius: 6px; background: white; cursor: pointer; text-align: left;">
                            Graded (${gradedCount})
                        </button>
                        <button class="filter-btn" data-filter="late" onclick="filterSubmissions('late', '${assignmentId}')" style="padding: 10px; border: 1px solid #E5E7EB; border-radius: 6px; background: white; cursor: pointer; text-align: left;">
                            Late (${lateCount})
                        </button>
                    </div>

                    <div class="submissions-list" id="submissionsList">
                        ${submissions.length > 0 ? submissions.map(sub => {
                            const student = AppState.data.users.find(u => u.id === sub.student_id);
                            return `
                                <div class="submission-item" data-submission-id="${sub.id}" data-status="${sub.status}" data-late="${sub.is_late}" onclick="loadSubmissionForGrading('${sub.id}')" style="padding: 10px; border: 1px solid #E5E7EB; border-radius: 6px; margin-bottom: 10px; cursor: pointer;">
                                    <div style="display: flex; align-items: center; gap: 10px;">
                                        <div class="student-avatar" style="width: 40px; height: 40px; border-radius: 50%; background: #6366F1; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600;">
                                            ${student ? student.avatar : '?'}
                                        </div>
                                        <div style="flex: 1;">
                                            <h4 style="margin: 0; font-size: 14px;">${student ? student.name : 'Unknown'}</h4>
                                            <span style="font-size: 12px; color: #6B7280;">${formatDateTime(sub.submitted_at)}</span>
                                        </div>
                                    </div>
                                    <div style="margin-top: 5px;">
                                        ${sub.status === 'graded' ?
                                            `<span class="badge badge-success">Graded: ${sub.score}/${assignment.max_score}</span>` :
                                            `<span class="badge badge-warning">Not Graded</span>`
                                        }
                                        ${sub.is_late ? `<span class="badge badge-danger" style="margin-left: 5px;">Late</span>` : ''}
                                    </div>
                                </div>
                            `;
                        }).join('') : '<p style="text-align: center; color: #6B7280;">No submissions yet</p>'}
                    </div>
                </aside>

                <!-- Main Grading Area -->
                <main class="card" id="gradingMainArea">
                    <div style="text-align: center; padding: 60px 20px; color: #6B7280;">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="margin: 0 auto;">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        <h3>Select a submission to grade</h3>
                        <p>Choose a student submission from the list on the left to begin grading</p>
                    </div>
                </main>
            </div>
        </div>
    `;

    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = content;
}

function filterSubmissions(filter, assignmentId) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.style.background = 'white';
        btn.style.color = 'black';
    });

    const activeBtn = document.querySelector(`[data-filter="${filter}"]`);
    if (activeBtn) {
        activeBtn.style.background = '#6366F1';
        activeBtn.style.color = 'white';
    }

    const items = document.querySelectorAll('.submission-item');
    items.forEach(item => {
        const status = item.dataset.status;
        const isLate = item.dataset.late === 'true';

        let show = false;
        if (filter === 'all') show = true;
        else if (filter === 'ungraded') show = status === 'submitted';
        else if (filter === 'graded') show = status === 'graded';
        else if (filter === 'late') show = isLate;

        item.style.display = show ? 'block' : 'none';
    });
}

function loadSubmissionForGrading(submissionId) {
    const submission = AppState.data.submissions.find(s => s.id === submissionId);
    if (!submission) return;

    const assignment = AppState.data.assignments.find(a => a.id === submission.assignment_id);
    const student = AppState.data.users.find(u => u.id === submission.student_id);

    const gradingArea = document.getElementById('gradingMainArea');

    const content = `
        <!-- Student Info -->
        <div class="student-header" style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px; border-bottom: 1px solid #E5E7EB; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 15px;">
                <div class="student-avatar-large" style="width: 60px; height: 60px; border-radius: 50%; background: #6366F1; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 24px;">
                    ${student ? student.avatar : '?'}
                </div>
                <div>
                    <h2 style="margin: 0;">${student ? student.name : 'Unknown Student'}</h2>
                    <p style="margin: 5px 0 0 0; color: #6B7280;">Student ID: ${student ? student.id : 'N/A'} | ${student ? student.email : 'N/A'}</p>
                </div>
            </div>
            <div>
                <div><strong>Submitted:</strong> ${formatDateTime(submission.submitted_at)}</div>
                <div style="margin-top: 5px;">
                    ${submission.is_late ?
                        `<span class="badge badge-danger">Late Submission</span>` :
                        `<span class="badge badge-success">On Time</span>`
                    }
                </div>
            </div>
        </div>

        <!-- Submission Content -->
        <section class="submission-content-card" style="margin-bottom: 20px;">
            ${submission.text_content ? `
                <div class="content-section" style="margin-bottom: 20px;">
                    <h3>Text Answer</h3>
                    <div style="padding: 15px; background: #F9FAFB; border-radius: 8px; white-space: pre-wrap; margin-top: 10px;">
                        ${submission.text_content}
                    </div>
                </div>
            ` : ''}

            ${submission.files && submission.files.length > 0 ? `
                <div class="content-section">
                    <h3>Uploaded Files</h3>
                    <div class="files-list" style="margin-top: 10px;">
                        ${submission.files.map(file => `
                            <div class="file-item-grading" style="display: flex; align-items: center; padding: 15px; background: #F9FAFB; border-radius: 8px; margin-bottom: 10px;">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                                    <polyline points="13 2 13 9 20 9"></polyline>
                                </svg>
                                <div style="flex: 1; margin-left: 15px;">
                                    <div style="font-weight: 600;">${file.file_name}</div>
                                    <div style="font-size: 12px; color: #6B7280;">${formatFileSize(file.file_size)}</div>
                                </div>
                                <button class="btn btn-secondary" onclick="viewFile('${file.file_data}', '${file.file_name}')">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                    View
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </section>

        <!-- Grading Form -->
        <section class="grading-form-card">
            <h3>Grade & Feedback</h3>

            <form id="gradingForm" style="margin-top: 20px;">
                <!-- Score Input -->
                <div class="form-group">
                    <label for="gradeScore">Score <span class="required">*</span></label>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input
                            type="number"
                            id="gradeScore"
                            class="form-control"
                            min="0"
                            max="${assignment.max_score}"
                            placeholder="0"
                            required
                            value="${submission.score || ''}"
                            style="width: 100px;"
                        />
                        <span style="font-size: 18px; font-weight: 600;">/ ${assignment.max_score}</span>
                    </div>

                    <div style="margin-top: 10px;">
                        <span class="grade-letter" id="gradeLetter" style="font-size: 24px; font-weight: 700; color: #6366F1;">-</span>
                        <span class="grade-percentage" id="gradePercentage" style="margin-left: 10px; font-size: 18px; color: #6B7280;">0%</span>
                    </div>
                </div>

                <!-- Feedback Textarea -->
                <div class="form-group">
                    <label for="gradeFeedback">Feedback <span class="required">*</span></label>
                    <textarea
                        id="gradeFeedback"
                        class="form-control"
                        rows="8"
                        placeholder="Provide detailed feedback to the student..."
                        required
                    >${submission.feedback || ''}</textarea>
                    <span class="char-count" style="font-size: 12px; color: #6B7280;">0 / 2000 characters</span>
                </div>

                <!-- Quick Feedback Templates -->
                <div class="feedback-templates" style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 10px; font-weight: 600;">Quick Feedback Templates</label>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <button type="button" class="btn btn-secondary" onclick="insertFeedbackTemplate('excellent')">
                            Excellent Work
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="insertFeedbackTemplate('good')">
                            Good Job
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="insertFeedbackTemplate('needs_improvement')">
                            Needs Improvement
                        </button>
                    </div>
                </div>

                <!-- Grading Actions -->
                <div class="grading-actions" style="display: flex; gap: 10px;">
                    <button type="submit" class="btn btn-primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Submit Grade
                    </button>
                    <button type="button" class="btn btn-outline" onclick="loadNextSubmission('${submissionId}')">
                        Grade Next
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </button>
                </div>
            </form>
        </section>
    `;

    gradingArea.innerHTML = content;

    // Initialize grading form
    initializeGradingForm(submission, assignment);
}

function initializeGradingForm(submission, assignment) {
    const scoreInput = document.getElementById('gradeScore');
    const feedbackTextarea = document.getElementById('gradeFeedback');
    const form = document.getElementById('gradingForm');

    // Score change handler
    scoreInput.addEventListener('input', function() {
        const score = parseInt(this.value) || 0;
        const maxScore = assignment.max_score;
        const percentage = (score / maxScore) * 100;

        document.getElementById('gradePercentage').textContent = percentage.toFixed(1) + '%';
        document.getElementById('gradeLetter').textContent = getGradeLetter(percentage);
    });

    // Trigger initial calculation if there's a score
    if (scoreInput.value) {
        scoreInput.dispatchEvent(new Event('input'));
    }

    // Character counter for feedback
    feedbackTextarea.addEventListener('input', function() {
        const charCount = this.value.length;
        const counter = this.parentElement.querySelector('.char-count');
        counter.textContent = `${charCount} / 2000 characters`;

        if (charCount > 2000) {
            this.value = this.value.substring(0, 2000);
        }
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const score = parseInt(scoreInput.value);
        const feedback = feedbackTextarea.value.trim();

        if (score < 0 || score > assignment.max_score) {
            showToast(`Score must be between 0 and ${assignment.max_score}`, 'error');
            return;
        }

        if (!feedback) {
            showToast('Please provide feedback', 'error');
            return;
        }

        // Update submission
        const submissionIndex = AppState.data.submissions.findIndex(s => s.id === submission.id);
        if (submissionIndex !== -1) {
            AppState.data.submissions[submissionIndex].score = score;
            AppState.data.submissions[submissionIndex].feedback = feedback;
            AppState.data.submissions[submissionIndex].status = 'graded';
            AppState.data.submissions[submissionIndex].graded_at = new Date().toISOString();
            AppState.data.submissions[submissionIndex].graded_by = AppState.currentUser.id;
            AppState.data.submissions[submissionIndex].updated_at = new Date().toISOString();

            saveData();

            showToast('Grade submitted successfully!', 'success');

            // Refresh the grading page
            setTimeout(() => {
                showGradingPage(assignment.id);
            }, 1000);
        }
    });
}

function getGradeLetter(percentage) {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
}

const feedbackTemplates = {
    excellent: "Excellent work! Your submission demonstrates a thorough understanding of the topic. Your analysis is well-structured and supported with relevant examples. Keep up the great work!",
    good: "Good job on this assignment. You've shown a solid understanding of the concepts. Consider expanding on some of your points to provide more depth in future submissions.",
    needs_improvement: "Thank you for your submission. While you've made an effort, there are areas that need improvement. Please review the assignment guidelines and consider revising your work. I'm available during office hours if you need clarification."
};

function insertFeedbackTemplate(templateKey) {
    const feedbackTextarea = document.getElementById('gradeFeedback');
    if (feedbackTextarea) {
        feedbackTextarea.value = feedbackTemplates[templateKey];
        feedbackTextarea.dispatchEvent(new Event('input'));
    }
}

function loadNextSubmission(currentSubmissionId) {
    const submissionItems = document.querySelectorAll('.submission-item');
    const currentIndex = Array.from(submissionItems).findIndex(item =>
        item.dataset.submissionId === currentSubmissionId
    );

    if (currentIndex < submissionItems.length - 1) {
        const nextSubmission = submissionItems[currentIndex + 1];
        nextSubmission.click();
    } else {
        showToast('All submissions reviewed!', 'success');
    }
}

function viewFile(fileData, fileName) {
    // Open file in new window
    const newWindow = window.open();
    if (fileData.startsWith('data:image')) {
        newWindow.document.write(`<img src="${fileData}" style="max-width: 100%;" />`);
    } else if (fileData.startsWith('data:application/pdf')) {
        newWindow.document.write(`<iframe src="${fileData}" style="width: 100%; height: 100vh; border: none;"></iframe>`);
    } else {
        // For other file types, download them
        const link = document.createElement('a');
        link.href = fileData;
        link.download = fileName;
        link.click();
    }
}
