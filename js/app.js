/* =========================================================
   STUDYHUB - APP.JS
   Core application functionality
   ========================================================= */


/* =========================================================
   1. APPLICATION STATE
   ========================================================= */

const StudyHub = {

    /* -----------------------------------------------------
       Default User
       ----------------------------------------------------- */

    user: {
        name: "Student",
        initials: "S",
        subjects: [
            "Mathematics",
            "English",
            "Biology",
            "Physics"
        ],
        studyGoal: 20,
        studyMinutes: 8,
        streak: 5
    },


    /* -----------------------------------------------------
       Default Tasks
       ----------------------------------------------------- */

    tasks: [
        {
            id: 1,
            title: "Complete Mathematics revision",
            subject: "Mathematics",
            time: "30 minutes",
            priority: "high",
            completed: false
        },

        {
            id: 2,
            title: "Read English chapter",
            subject: "English",
            time: "25 minutes",
            priority: "medium",
            completed: false
        },

        {
            id: 3,
            title: "Review Biology notes",
            subject: "Biology",
            time: "20 minutes",
            priority: "low",
            completed: true
        },

        {
            id: 4,
            title: "Physics practice questions",
            subject: "Physics",
            time: "30 minutes",
            priority: "medium",
            completed: false
        }
    ],


    /* -----------------------------------------------------
       Notifications
       ----------------------------------------------------- */

    notifications: [
        {
            id: 1,
            title: "Mathematics revision due today",
            type: "deadline",
            read: false
        },

        {
            id: 2,
            title: "Your study streak is 5 days",
            type: "achievement",
            read: false
        }
    ],


    /* -----------------------------------------------------
       Subject Progress
       ----------------------------------------------------- */

    subjects: [
        {
            name: "Mathematics",
            progress: 72,
            colour: "mathematics"
        },

        {
            name: "English",
            progress: 64,
            colour: "english"
        },

        {
            name: "Biology",
            progress: 81,
            colour: "biology"
        },

        {
            name: "Physics",
            progress: 48,
            colour: "physics"
        }
    ]

};


/* =========================================================
   2. LOCAL STORAGE
   ========================================================= */

const STORAGE_KEY = "studyhub_data";


function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(StudyHub)
    );

}


function loadData() {

    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
        saveData();
        return;
    }

    try {

        const parsedData = JSON.parse(savedData);

        Object.assign(
            StudyHub,
            parsedData
        );

    } catch (error) {

        console.error(
            "StudyHub: Unable to load saved data.",
            error
        );

    }

}


/* =========================================================
   3. DOM HELPERS
   ========================================================= */

function getElement(selector) {

    return document.querySelector(selector);

}


function getElements(selector) {

    return document.querySelectorAll(selector);

}


function setText(selector, value) {

    const element = getElement(selector);

    if (element) {
        element.textContent = value;
    }

}


/* =========================================================
   4. DATE & TIME
   ========================================================= */

function getCurrentDate() {

    return new Date();

}


function getGreeting() {

    const hour = getCurrentDate().getHours();

    if (hour < 12) {
        return "Good morning";
    }

    if (hour < 18) {
        return "Good afternoon";
    }

    return "Good evening";

}


function formatDate(date) {

    return new Intl.DateTimeFormat(
        "en-AU",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    ).format(date);

}


function updateDate() {

    const dateElement =
        getElement("[data-current-date]");

    if (!dateElement) {
        return;
    }

    dateElement.textContent =
        formatDate(getCurrentDate());

}


function updateGreeting() {

    const greetingElement =
        getElement("[data-greeting]");

    if (!greetingElement) {
        return;
    }

    greetingElement.textContent =
        `${getGreeting()}, ${StudyHub.user.name}!`;

}


/* =========================================================
   5. SIDEBAR
   ========================================================= */

function openSidebar() {

    const sidebar =
        getElement(".sidebar");

    const overlay =
        getElement(".sidebar-overlay");

    if (sidebar) {
        sidebar.classList.add("open");
    }

    if (overlay) {
        overlay.classList.add("active");
    }

}


function closeSidebar() {

    const sidebar =
        getElement(".sidebar");

    const overlay =
        getElement(".sidebar-overlay");

    if (sidebar) {
        sidebar.classList.remove("open");
    }

    if (overlay) {
        overlay.classList.remove("active");
    }

}


function setupSidebar() {

    const menuButton =
        getElement(".menu-button");

    const closeButton =
        getElement(".sidebar-close");

    const overlay =
        getElement(".sidebar-overlay");

    if (menuButton) {

        menuButton.addEventListener(
            "click",
            openSidebar
        );

    }

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeSidebar
        );

    }

    if (overlay) {

        overlay.addEventListener(
            "click",
            closeSidebar
        );

    }


    /* Close sidebar after selecting mobile navigation */

    getElements(".navigation-link")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    if (
                        window.innerWidth <= 900
                    ) {

                        closeSidebar();

                    }

                }
            );

        });

}


/* =========================================================
   6. NAVIGATION
   ========================================================= */

function setupNavigation() {

    const links =
        getElements(".navigation-link");

    links.forEach(link => {

        link.addEventListener(
            "click",
            function () {

                links.forEach(
                    item =>
                        item.classList.remove("active")
                );

                this.classList.add("active");

            }
        );

    });

}


/* =========================================================
   7. PROFILE DROPDOWN
   ========================================================= */

function setupProfileDropdown() {

    const profileButton =
        getElement(".profile-button");

    const dropdown =
        profileButton?.closest(".dropdown");

    if (!profileButton || !dropdown) {
        return;
    }


    profileButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            dropdown.classList.toggle("active");

        }
    );


    document.addEventListener(
        "click",
        event => {

            if (
                !dropdown.contains(event.target)
            ) {

                dropdown.classList.remove(
                    "active"
                );

            }

        }
    );

}


/* =========================================================
   8. TASK SYSTEM
   ========================================================= */

function renderTasks() {

    const taskList =
        getElement(".task-list");

    if (!taskList) {
        return;
    }


    taskList.innerHTML = "";


    StudyHub.tasks.forEach(task => {

        const taskElement =
            document.createElement("label");

        taskElement.className =
            "task-item";


        taskElement.innerHTML = `

            <input
                type="checkbox"
                ${task.completed ? "checked" : ""}
                data-task-id="${task.id}"
            >

            <span class="task-check"></span>

            <span class="task-content">

                <span
                    class="task-name
                    ${task.completed ? "completed" : ""}"
                >
                    ${escapeHTML(task.title)}
                </span>

                <span class="task-meta">
                    ${escapeHTML(task.subject)}
                    •
                    ${escapeHTML(task.time)}
                </span>

            </span>

            <span class="
                task-priority
                priority-${task.priority}
            ">
                ${capitalize(task.priority)}
            </span>

        `;


        const checkbox =
            taskElement.querySelector(
                "input[type='checkbox']"
            );


        checkbox.addEventListener(
            "change",
            () => {

                toggleTask(
                    task.id,
                    checkbox.checked
                );

            }
        );


        taskList.appendChild(
            taskElement
        );

    });

}


function toggleTask(
    taskId,
    completed
) {

    const task =
        StudyHub.tasks.find(
            item => item.id === taskId
        );


    if (!task) {
        return;
    }


    task.completed = completed;


    saveData();

    renderTasks();

    updateDashboardStats();


    if (completed) {

        showToast(
            "Task completed!",
            "success"
        );

    }

}


/* =========================================================
   9. TASK STATISTICS
   ========================================================= */

function getCompletedTasks() {

    return StudyHub.tasks.filter(
        task => task.completed
    ).length;

}


function getTotalTasks() {

    return StudyHub.tasks.length;

}


function getTaskCompletionRate() {

    const total =
        getTotalTasks();

    if (total === 0) {
        return 0;
    }

    return Math.round(
        (getCompletedTasks() / total) * 100
    );

}


/* =========================================================
   10. DASHBOARD STATISTICS
   ========================================================= */

function updateDashboardStats() {

    const completed =
        getCompletedTasks();

    const total =
        getTotalTasks();

    const completionRate =
        getTaskCompletionRate();


    /* Study time */

    setText(
        "[data-study-minutes]",
        `${StudyHub.user.studyMinutes} min`
    );


    /* Tasks */

    setText(
        "[data-task-count]",
        `${completed}/${total}`
    );


    /* Completion */

    setText(
        "[data-completion-rate]",
        `${completionRate}%`
    );


    /* Streak */

    setText(
        "[data-streak]",
        `${StudyHub.user.streak} days`
    );


    /* Goal */

    const goal =
        StudyHub.user.studyGoal;

    const studied =
        StudyHub.user.studyMinutes;

    const goalPercentage =
        goal > 0
            ? Math.min(
                Math.round(
                    (studied / goal) * 100
                ),
                100
            )
            : 0;


    setText(
        "[data-goal-percentage]",
        `${goalPercentage}%`
    );


    setText(
        "[data-goal-time]",
        `${studied}/${goal} minutes`
    );


    const progress =
        getElement("[data-goal-progress]");


    if (progress) {

        progress.style.width =
            `${goalPercentage}%`;

    }

}


/* =========================================================
   11. SUBJECT PROGRESS
   ========================================================= */

function renderSubjects() {

    const subjectList =
        getElement(".subject-list");

    if (!subjectList) {
        return;
    }


    subjectList.innerHTML = "";


    StudyHub.subjects.forEach(subject => {

        const item =
            document.createElement("div");

        item.className =
            "subject-progress";


        item.innerHTML = `

            <div class="subject-progress-header">

                <div>

                    <span
                        class="
                            subject-colour
                            ${subject.colour}
                        "
                    ></span>

                    <strong>
                        ${escapeHTML(subject.name)}
                    </strong>

                </div>

                <span>
                    ${subject.progress}%
                </span>

            </div>

            <div class="progress-bar">

                <div
                    class="progress-fill"
                    style="width: ${subject.progress}%"
                ></div>

            </div>

        `;


        subjectList.appendChild(item);

    });

}


/* =========================================================
   12. NOTIFICATIONS
   ========================================================= */

function getUnreadNotifications() {

    return StudyHub.notifications.filter(
        notification => !notification.read
    );

}


function updateNotificationBadge() {

    const badge =
        getElement(".notification-badge");

    if (!badge) {
        return;
    }


    const unread =
        getUnreadNotifications().length;


    if (unread === 0) {

        badge.style.display =
            "none";

        return;

    }


    badge.style.display =
        "flex";


    badge.textContent =
        unread > 9
            ? "9+"
            : unread;

}


function markNotificationsAsRead() {

    StudyHub.notifications.forEach(
        notification => {

            notification.read = true;

        }
    );


    saveData();

    updateNotificationBadge();

}


/* =========================================================
   13. TOAST SYSTEM
   ========================================================= */

function showToast(
    message,
    type = "info"
) {

    let container =
        getElement(".toast-container");


    if (!container) {

        container =
            document.createElement("div");

        container.className =
            "toast-container";

        document.body.appendChild(
            container
        );

    }


    const toast =
        document.createElement("div");

    toast.className =
        `toast toast-${type}`;


    toast.innerHTML = `

        <div>
            ${escapeHTML(message)}
        </div>

    `;


    container.appendChild(
        toast
    );


    setTimeout(
        () => {

            toast.remove();

        },
        3500
    );

}


/* =========================================================
   14. SEARCH
   ========================================================= */

function setupSearch() {

    const searchInput =
        getElement(".search-input");

    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Enter"
            ) {

                return;

            }


            const query =
                searchInput.value.trim();


            if (!query) {
                return;
            }


            performSearch(query);

        }
    );

}


function performSearch(query) {

    const normalisedQuery =
        query.toLowerCase();


    const taskMatches =
        StudyHub.tasks.filter(
            task =>
                task.title
                    .toLowerCase()
                    .includes(normalisedQuery)
                ||
                task.subject
                    .toLowerCase()
                    .includes(normalisedQuery)
        );


    const subjectMatches =
        StudyHub.subjects.filter(
            subject =>
                subject.name
                    .toLowerCase()
                    .includes(normalisedQuery)
        );


    const totalMatches =
        taskMatches.length +
        subjectMatches.length;


    if (totalMatches === 0) {

        showToast(
            `No results found for "${query}".`,
            "info"
        );

        return;

    }


    showToast(
        `${totalMatches} result${totalMatches === 1 ? "" : "s"} found.`,
        "success"
    );

}


/* =========================================================
   15. KEYBOARD SEARCH SHORTCUT
   ========================================================= */

function setupSearchShortcut() {

    const searchInput =
        getElement(".search-input");

    if (!searchInput) {
        return;
    }


    document.addEventListener(
        "keydown",
        event => {

            const isShortcut =
                (
                    event.ctrlKey ||
                    event.metaKey
                )
                &&
                event.key.toLowerCase() === "k";


            if (!isShortcut) {
                return;
            }


            event.preventDefault();

            searchInput.focus();

        }
    );

}


/* =========================================================
   16. DARK MODE
   ========================================================= */

function setupTheme() {

    const savedTheme =
        localStorage.getItem(
            "studyhub_theme"
        );


    if (savedTheme) {

        document.documentElement.dataset.theme =
            savedTheme;

    }


    const themeButton =
        getElement("[data-theme-toggle]");


    if (!themeButton) {
        return;
    }


    themeButton.addEventListener(
        "click",
        toggleTheme
    );

}


function toggleTheme() {

    const currentTheme =
        document.documentElement.dataset.theme;


    const newTheme =
        currentTheme === "dark"
            ? "light"
            : "dark";


    document.documentElement.dataset.theme =
        newTheme;


    localStorage.setItem(
        "studyhub_theme",
        newTheme
    );

}


/* =========================================================
   17. QUICK ACTIONS
   ========================================================= */

function setupQuickActions() {

    getElements("[data-action]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const action =
                        button.dataset.action;


                    handleQuickAction(
                        action
                    );

                }
            );

        });

}


function handleQuickAction(action) {

    switch (action) {

        case "start-study":

            showToast(
                "Study session ready to start.",
                "info"
            );

            break;


        case "create-task":

            showToast(
                "Task creation will be available soon.",
                "info"
            );

            break;


        case "take-quiz":

            showToast(
                "Quiz system will be available soon.",
                "info"
            );

            break;


        case "add-note":

            showToast(
                "Note editor will be available soon.",
                "info"
            );

            break;


        default:

            console.log(
                "Unknown StudyHub action:",
                action
            );

    }

}


/* =========================================================
   18. WELCOME MESSAGE
   ========================================================= */

function updateWelcomeMessage() {

    const message =
        getElement("[data-welcome-message]");


    if (!message) {
        return;
    }


    const completed =
        getCompletedTasks();


    const total =
        getTotalTasks();


    if (total === 0) {

        message.textContent =
            "You have no tasks scheduled for today.";

        return;

    }


    if (completed === total) {

        message.textContent =
            "Great work! You have completed everything for today.";

        return;

    }


    const remaining =
        total - completed;


    message.textContent =
        `You have ${remaining} task${remaining === 1 ? "" : "s"} remaining today.`;

}


/* =========================================================
   19. PROFILE DATA
   ========================================================= */

function updateProfile() {

    setText(
        "[data-profile-name]",
        StudyHub.user.name
    );


    setText(
        "[data-profile-initials]",
        StudyHub.user.initials
    );

}


/* =========================================================
   20. RESPONSIVE WINDOW EVENTS
   ========================================================= */

function setupWindowEvents() {

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 900
            ) {

                closeSidebar();

            }

        }
    );

}


/* =========================================================
   21. SECURITY HELPER
   ========================================================= */

/*
    Prevent user-generated text from being inserted
    directly into HTML.
*/

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   22. STRING HELPERS
   ========================================================= */

function capitalize(value) {

    if (!value) {
        return "";
    }

    return value.charAt(0).toUpperCase()
        + value.slice(1);

}


/* =========================================================
   23. INITIALISE APPLICATION
   ========================================================= */

function initStudyHub() {

    console.log(
        "StudyHub is starting..."
    );


    /* Load saved data */

    loadData();


    /* Setup global interface */

    setupSidebar();

    setupNavigation();

    setupProfileDropdown();

    setupSearch();

    setupSearchShortcut();

    setupTheme();

    setupQuickActions();

    setupWindowEvents();


    /* Render dashboard */

    renderTasks();

    renderSubjects();

    updateDashboardStats();

    updateNotificationBadge();

    updateProfile();

    updateGreeting();

    updateDate();

    updateWelcomeMessage();


    console.log(
        "StudyHub loaded successfully."
    );

}


/* =========================================================
   24. START APPLICATION
   ========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initStudyHub
    );

} else {

    initStudyHub();

}


/* =========================================================
   END OF APP.JS
   ========================================================= */