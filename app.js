// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const rootElement = document.documentElement;

darkModeToggle.addEventListener('click', () => {
    rootElement.classList.toggle('dark');
    localStorage.setItem('theme', rootElement.classList.contains('dark') ? 'dark' : 'light');
});

// Initialize theme from localStorage
if (localStorage.getItem('theme') === 'dark') {
    rootElement.classList.add('dark');
} else {
    rootElement.classList.remove('dark');
}

// Task Logic
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const progressBar = document.getElementById('progressBar');
const filterButtons = document.querySelectorAll('.filter-btn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks(filter = 'all') {
    taskList.innerHTML = '';
    const filteredTasks = tasks.filter(task => {
        if (filter === 'pending') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true;
    });

    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded shadow ${task.completed ? 'opacity-50 line-through' : ''}`;
        li.innerHTML = `
        <div>
          <input type="checkbox" data-index="${index}" class="mr-2" ${task.completed ? 'checked' : ''}>
          ${task.title}
        </div>
        <button data-index="${index}" class="delete-btn text-red-500">&times;</button>
      `;
        taskList.appendChild(li);
    });

    updateProgress();
    saveTasks();
}



taskForm.onsubmit = e => {
    e.preventDefault();
    if (!taskInput.value.trim()) return;
    tasks.push({ title: taskInput.value.trim(), completed: false });
    taskInput.value = '';
    renderTasks();
};

taskList.onclick = e => {
    if (e.target.classList.contains('delete-btn')) {
        tasks.splice(e.target.dataset.index, 1);
    } else if (e.target.type === 'checkbox') {
        tasks[e.target.dataset.index].completed = e.target.checked;
    }
    renderTasks();
};

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateProgress() {
    const completed = tasks.filter(t => t.completed).length;
    const percent = tasks.length ? (completed / tasks.length) * 100 : 0;
    progressBar.style.width = `${percent}%`;
}

filterButtons.forEach(btn => {
    btn.onclick = () => {
        document.querySelector('.filter-btn.active').classList.remove('active', 'bg-purple-600', 'text-white');
        btn.classList.add('active', 'bg-purple-600', 'text-white');
        renderTasks(btn.dataset.filter);
    };
});

// Initial rendering
renderTasks();
