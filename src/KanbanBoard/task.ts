import styles from './kanbanStyle.module.css';

import { openTaskDialog } from './dialog';

export function addTask(status: string) {
  openTaskDialog((taskName) => createTask(status, taskName));
}

export function createTask(status: string, name: string) {
  const taskList = document.getElementById(status);
  if (!taskList) return;

  taskList.appendChild(createTaskElement(status, name));
}

export function createTaskElement(status: string, name: string) {
  const task = document.createElement('div');
  task.className = styles.task;
  task.textContent = name;

  task.draggable = true;
  task.addEventListener('dragstart', (e) => {
    e.dataTransfer?.setData('text/plain', name);
    e.dataTransfer?.setData('status', status);
  });

  return task;
}
