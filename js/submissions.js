// Submissions Management

// Show assignment submission page
function showSubmissionPage(assignmentId) {
    const assignment = AppState.data.assignments.find(a => a.id === assignmentId);
    if (!assignment) return;

    const course = AppState.data.courses.find(c => c.id === assignment.course_id);
    const userId = AppState.currentUser.id;
    const existingSubmission = AppState.data.submissions.find(s =>
        s.assignment_id === assignmentId && s.student_id === userId
    );

    const dueDate = new Date(assignment.due_date);
    const now = new Date();
    const isOverdue = now > dueDate;
    const timeRemaining = getTimeRemaining(dueDate);

    const content = `
        <div class="assignment-submission-page">
            <!-- Back Button -->
            <button class="btn btn-secondary" onclick="navigateTo('assignments')" style="margin-bottom: 20px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back to Assignments
            </button>

            <!-- Assignment Details Section -->
            <section class="card" style="margin-bottom: 20px;">
                <div class="assignment-header" style="margin-bottom: 20px;">
                    <h1>${assignment.title}</h1>
                    <div style="display: flex; gap: 10px; margin-top: 10px;">
                        <span class="badge badge-${assignment.status === 'published' ? 'success' : 'warning'}">${assignment.status}</span>
                        ${existingSubmission ?
                            `<span class="badge badge-${existingSubmission.status === 'graded' ? 'success' : 'warning'}">${existingSubmission.status}</span>` :
                            `<span class="badge badge-danger">Not Submitted</span>`
                        }
                    </div>
                </div>

                <div class="assignment-info-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                    <div>
                        <label style="font-weight: 600; color: #6B7280;">Course</label>
                        <p>${course ? course.name : 'N/A'}</p>
                    </div>
                    <div>
                        <label style="font-weight: 600; color: #6B7280;">Due Date</label>
                        <p class="${isOverdue ? 'text-danger' : ''}">${formatDate(assignment.due_date)} ${isOverdue ? '(Overdue)' : ''}</p>
                    </div>
                    <div>
                        <label style="font-weight: 600; color: #6B7280;">Max Score</label>
                        <p>${assignment.max_score} points</p>
                    </div>
                    <div>
                        <label style="font-weight: 600; color: #6B7280;">Submission Type</label>
                        <p>${formatSubmissionType(assignment.submission_type)}</p>
                    </div>
                </div>

                <div class="assignment-instructions">
                    <h3>Description</h3>
                    <p>${assignment.description}</p>
                </div>

                ${assignment.instructions ? `
                    <div class="assignment-instructions" style="margin-top: 20px;">
                        <h3>Instructions</h3>
                        <p>${assignment.instructions}</p>
                    </div>
                ` : ''}

                ${assignment.allowed_file_types && assignment.allowed_file_types.length > 0 ? `
                    <div style="margin-top: 15px; padding: 10px; background: #F9FAFB; border-radius: 8px;">
                        <small style="color: #6B7280;">
                            <strong>Accepted file types:</strong> ${assignment.allowed_file_types.join(', ').toUpperCase()}
                            (Max ${assignment.max_file_size}MB per file)
                        </small>
                    </div>
                ` : ''}
            </section>

            <!-- Submission Section -->
            <section class="card">
                <h2>Your Submission</h2>

                ${existingSubmission ? `
                    <div class="alert alert-info" style="margin: 20px 0;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                        You submitted this assignment on ${formatDateTime(existingSubmission.submitted_at)}
                        ${existingSubmission.is_late ? ' <span class="badge badge-danger">LATE</span>' : ''}
                    </div>

                    ${existingSubmission.status === 'graded' ? `
                        <div class="alert alert-success" style="margin: 20px 0;">
                            <h3>Grade: ${existingSubmission.score}/${assignment.max_score}</h3>
                            <p><strong>Feedback:</strong></p>
                            <p>${existingSubmission.feedback || 'No feedback provided'}</p>
                        </div>
                    ` : ''}

                    <div class="submitted-content" style="margin: 20px 0;">
                        ${existingSubmission.text_content ? `
                            <h4>Your Text Answer</h4>
                            <div style="padding: 15px; background: #F9FAFB; border-radius: 8px; white-space: pre-wrap;">
                                ${existingSubmission.text_content}
                            </div>
                        ` : ''}

                        ${existingSubmission.files && existingSubmission.files.length > 0 ? `
                            <h4 style="margin-top: 20px;">Uploaded Files</h4>
                            <div class="uploaded-files-list">
                                ${existingSubmission.files.map(file => `
                                    <div class="file-item" style="display: flex; align-items: center; padding: 10px; background: #F9FAFB; border-radius: 8px; margin: 5px 0;">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                                            <polyline points="13 2 13 9 20 9"></polyline>
                                        </svg>
                                        <span style="margin-left: 10px; flex: 1;">${file.file_name}</span>
                                        <span style="color: #6B7280; margin-right: 10px;">${formatFileSize(file.file_size)}</span>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>

                    ${existingSubmission.status !== 'graded' && !isOverdue ? `
                        <button class="btn btn-secondary" onclick="enableEditSubmission('${assignmentId}')">Edit Submission</button>
                    ` : ''}
                ` : `
                    <!-- Submission Form -->
                    <form id="submissionForm" style="margin-top: 20px;">
                        ${assignment.submission_type === 'text' || assignment.submission_type === 'both' ? `
                            <div class="form-group">
                                <label for="textAnswer">Text Answer ${assignment.submission_type === 'text' ? '<span class="required">*</span>' : ''}</label>
                                <textarea
                                    id="textAnswer"
                                    class="form-control"
                                    rows="10"
                                    placeholder="Type your answer here..."
                                    ${assignment.submission_type === 'text' ? 'required' : ''}
                                ></textarea>
                                <span class="char-count" style="font-size: 12px; color: #6B7280;">0 / 5000 characters</span>
                            </div>
                        ` : ''}

                        ${assignment.submission_type === 'file' || assignment.submission_type === 'both' ? `
                            <div class="form-group">
                                <label>Upload Files ${assignment.submission_type === 'file' ? '<span class="required">*</span>' : ''}</label>
                                <div class="file-upload-area" id="fileUploadArea" style="border: 2px dashed #D1D5DB; border-radius: 8px; padding: 40px; text-align: center; cursor: pointer; background: #F9FAFB;">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin: 0 auto;">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="17 8 12 3 7 8"></polyline>
                                        <line x1="12" y1="3" x2="12" y2="15"></line>
                                    </svg>
                                    <p>Drag and drop files here or click to browse</p>
                                    <span style="font-size: 12px; color: #6B7280;">
                                        Accepted: ${assignment.allowed_file_types.join(', ').toUpperCase()} (Max ${assignment.max_file_size}MB each)
                                    </span>
                                </div>
                                <input
                                    type="file"
                                    id="fileInput"
                                    multiple
                                    accept="${assignment.allowed_file_types.map(t => '.' + t).join(',')}"
                                    hidden
                                />
                                <div id="filesPreview" style="margin-top: 15px;"></div>
                            </div>
                        ` : ''}

                        <div class="submission-actions" style="margin-top: 20px; display: flex; gap: 10px;">
                            <button type="submit" class="btn btn-primary">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                                Submit Assignment
                            </button>
                        </div>
                    </form>
                `}
            </section>
        </div>
    `;

    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = content;

    // Initialize form handlers if submission form exists
    if (!existingSubmission) {
        initializeSubmissionForm(assignment);
    }
}

// Initialize submission form handlers
function initializeSubmissionForm(assignment) {
    const form = document.getElementById('submissionForm');
    const textAnswer = document.getElementById('textAnswer');
    const fileInput = document.getElementById('fileInput');
    const fileUploadArea = document.getElementById('fileUploadArea');
    const filesPreview = document.getElementById('filesPreview');

    let uploadedFiles = [];

    // Character counter for text answer
    if (textAnswer) {
        textAnswer.addEventListener('input', function() {
            const charCount = this.value.length;
            const counter = this.parentElement.querySelector('.char-count');
            counter.textContent = `${charCount} / 5000 characters`;

            if (charCount > 5000) {
                this.value = this.value.substring(0, 5000);
            }
        });
    }

    // File upload handlers
    if (fileUploadArea && fileInput) {
        fileUploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = '#6366F1';
            fileUploadArea.style.background = '#EEF2FF';
        });

        fileUploadArea.addEventListener('dragleave', () => {
            fileUploadArea.style.borderColor = '#D1D5DB';
            fileUploadArea.style.background = '#F9FAFB';
        });

        fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = '#D1D5DB';
            fileUploadArea.style.background = '#F9FAFB';
            handleFiles(Array.from(e.dataTransfer.files));
        });

        fileInput.addEventListener('change', (e) => {
            handleFiles(Array.from(e.target.files));
        });
    }

    function handleFiles(files) {
        files.forEach(file => {
            if (validateFile(file, assignment)) {
                uploadedFiles.push(file);
                addFilePreview(file);
            }
        });
    }

    function validateFile(file, assignment) {
        const maxSize = (assignment.max_file_size || 10) * 1024 * 1024;
        const allowedTypes = assignment.allowed_file_types || [];
        const fileExtension = file.name.split('.').pop().toLowerCase();

        if (file.size > maxSize) {
            showToast(`${file.name} is too large. Maximum size is ${assignment.max_file_size}MB.`, 'error');
            return false;
        }

        if (allowedTypes.length > 0 && !allowedTypes.includes(fileExtension)) {
            showToast(`${file.name} is not an allowed file type.`, 'error');
            return false;
        }

        return true;
    }

    function addFilePreview(file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-preview-item';
        fileItem.style.cssText = 'display: flex; align-items: center; padding: 10px; background: #F9FAFB; border-radius: 8px; margin: 5px 0;';
        fileItem.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                <polyline points="13 2 13 9 20 9"></polyline>
            </svg>
            <span style="margin-left: 10px; flex: 1;">${file.name}</span>
            <span style="color: #6B7280; margin-right: 10px;">${formatFileSize(file.size)}</span>
            <button type="button" class="btn-icon btn-remove" onclick="removeFile('${file.name}')" style="background: none; border: none; cursor: pointer; color: #EF4444;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </button>
        `;
        filesPreview.appendChild(fileItem);
    }

    window.removeFile = function(fileName) {
        uploadedFiles = uploadedFiles.filter(f => f.name !== fileName);
        const previews = filesPreview.querySelectorAll('.file-preview-item');
        previews.forEach(preview => {
            if (preview.querySelector('span').textContent.includes(fileName)) {
                preview.remove();
            }
        });
    };

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const textContent = textAnswer ? textAnswer.value.trim() : '';

        if (assignment.submission_type === 'text' && !textContent) {
            showToast('Please provide a text answer.', 'error');
            return;
        }

        if (assignment.submission_type === 'file' && uploadedFiles.length === 0) {
            showToast('Please upload at least one file.', 'error');
            return;
        }

        if (assignment.submission_type === 'both' && !textContent && uploadedFiles.length === 0) {
            showToast('Please provide either a text answer or upload files.', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line></svg> Submitting...';

        try {
            const filesData = await Promise.all(
                uploadedFiles.map(file => convertFileToBase64(file))
            );

            const dueDate = new Date(assignment.due_date);
            const submittedDate = new Date();
            const isLate = submittedDate > dueDate;

            const maxId = AppState.data.submissions.reduce((max, sub) => {
                const idNum = parseInt(sub.id.replace('SUB', ''));
                return idNum > max ? idNum : max;
            }, 0);

            const submission = {
                id: `SUB${String(maxId + 1).padStart(3, '0')}`,
                assignment_id: assignment.id,
                student_id: AppState.currentUser.id,
                submission_date: submittedDate.toISOString(),
                submission_type: assignment.submission_type,
                text_content: textContent,
                files: filesData,
                status: 'submitted',
                is_late: isLate,
                submitted_at: submittedDate.toISOString(),
                updated_at: submittedDate.toISOString()
            };

            AppState.data.submissions.push(submission);
            saveData();

            showToast('Assignment submitted successfully!', 'success');

            setTimeout(() => {
                showSubmissionPage(assignment.id);
            }, 1000);

        } catch (error) {
            showToast('Error submitting assignment: ' + error.message, 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> Submit Assignment';
        }
    });
}

// Convert file to base64
function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve({
                file_name: file.name,
                file_type: file.type,
                file_size: file.size,
                file_data: reader.result,
                uploaded_at: new Date().toISOString()
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Helper functions
function formatSubmissionType(type) {
    if (type === 'text') return 'Text Only';
    if (type === 'file') return 'File Upload Only';
    if (type === 'both') return 'Text & File Upload';
    return type;
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
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

function getTimeRemaining(dueDate) {
    const now = new Date();
    const diff = dueDate - now;

    if (diff < 0) return 'Overdue';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return 'Less than an hour';
}

function enableEditSubmission(assignmentId) {
    // Reload page in edit mode
    const userId = AppState.currentUser.id;
    const submission = AppState.data.submissions.find(s =>
        s.assignment_id === assignmentId && s.student_id === userId
    );

    if (submission && submission.status !== 'graded') {
        const index = AppState.data.submissions.findIndex(s => s.id === submission.id);
        if (index !== -1) {
            AppState.data.submissions.splice(index, 1);
            saveData();
            showSubmissionPage(assignmentId);
            showToast('You can now edit your submission', 'info');
        }
    }
}
