// Dark mode toggling
const darkModeToggle = document.getElementById('darkModeToggle');

darkModeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
});



// Task logic
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const progressBar = document.getElementById('progressBar');
const filterButtons = document.querySelectorAll('.filter-btn');
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Render tasks
function renderTasks(filter = 'all') {
    taskList.innerHTML = '';
    const filteredTasks = tasks.filter(task => {
        if (filter === 'pending') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true;
    });

    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `flex justify-between items-center p-3 rounded-lg shadow bg-white dark:bg-gray-800 transition transform hover:scale-105 ${task.completed ? 'opacity-50 line-through' : ''}`;
        li.innerHTML = `
      <span>
        <input type="checkbox" data-index="${index}" ${task.completed ? 'checked' : ''} class="mr-2 cursor-pointer">
        ${task.title}
      </span>
      <button data-index="${index}" class="delete-btn text-red-500 hover:text-red-700 transition">&times;</button>
    `;
        taskList.appendChild(li);
    });

    updateProgress();
    saveTasks();
}

// Add tasks
taskForm.onsubmit = e => {
    e.preventDefault();
    if (!taskInput.value.trim()) return;
    tasks.push({ title: taskInput.value.trim(), completed: false });
    taskInput.value = '';
    renderTasks();
};

// Delete and toggle completion
taskList.onclick = e => {
    if (e.target.classList.contains('delete-btn')) {
        tasks.splice(e.target.dataset.index, 1);
    } else if (e.target.type === 'checkbox') {
        const index = e.target.dataset.index;
        tasks[index].completed = e.target.checked;
    }
    renderTasks();
};

// Update and save tasks
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateProgress() {
    const completedCount = tasks.filter(task => task.completed).length;
    const percent = tasks.length ? (completedCount / tasks.length) * 100 : 0;
    progressBar.style.width = `${percent}%`;
}

// Task filtering
filterButtons.forEach(btn => {
    btn.onclick = () => {
        document.querySelector('.filter-btn.active').classList.remove('active', 'bg-purple-600', 'text-white');
        btn.classList.add('active', 'bg-purple-600', 'text-white');
        renderTasks(btn.dataset.filter);
    };
});

// Initialize
renderTasks();
