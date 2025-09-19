const taskForm = document.querySelector('.todo-form');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');  

// Загрузка
function loadTasks() {
  fetch('/api/tasks')
    .then(res => res.json())
    .then(tasks => {
      taskList.innerHTML = '';

      tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-list_item';

        //чекбокс
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => {
          updateTask(task.id, { text: task.text, completed: checkbox.checked });
        });

        // текст задачи
        const span = document.createElement('span');
        span.textContent = task.text;
        if (task.completed) span.style.textDecoration = 'line-through';

        // кнопка редактирования
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Редактировать';
        editBtn.className = 'task-list_edit';
        editBtn.addEventListener('click', () => {
          const newText = prompt('Редактировать текст: ', task.text);
          if (newText) {
            updateTask(task.id, { text: newText, completed: task.completed });
          }
        });

        // кнопка удаления
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Удалить';
        deleteBtn.className = 'task-list_delete';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
      });
    });
}
// добавление
taskForm.addEventListener('submit', e => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (!text) return;

    fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    })
        .then(res => res.json())
        .then(() => {
            taskInput.value = '';
            loadTasks();
        });
});
// обновление
function updateTask(id, updatedData) {
    fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
    })
        .then(res => res.json())
        .then(() => loadTasks());
}
// удаление задачи
function deleteTask(id) {
    fetch(`/api/tasks/${id}`, { method: 'DELETE' })
        .then(() => loadTasks());
}
document.addEventListener('DOMContentLoaded', loadTasks);