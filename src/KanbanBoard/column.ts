import styles from './kanbanStyle.module.css';

import { addTask, createTaskElement } from './task';

export function createColumn(status: string) {
  const column = document.createElement('div');
  column.className = styles.column;
  column.dataset.status = status;

  const header = document.createElement('div');
  header.className = styles['column-header'];

  const title = document.createElement('h2');
  title.textContent = status.toLocaleUpperCase();

  const addTaskButton = document.createElement('button');
  addTaskButton.className = styles['add-task-btn'];
  addTaskButton.textContent = '+ Add Task';
  addTaskButton.onclick = () => addTask(status);

  header.appendChild(title);
  header.appendChild(addTaskButton);

  column.appendChild(header);

  const taskList = document.createElement('div');
  taskList.className = styles['task-list'];
  taskList.id = status;

  taskList.addEventListener('dragover', (e) => e.preventDefault());
  taskList.addEventListener('drop', (e) => {
    e.preventDefault();
    const taskName = e.dataTransfer?.getData('text/plain');
    const sourceListId = e.dataTransfer?.getData('status');
    const targetList = e.currentTarget as HTMLElement;

    if (taskName && sourceListId && targetList) {
      const sourceList = document.getElementById(sourceListId);
      const taskToMove = sourceList?.querySelector(`[data-task="${taskName}"]`);
      if (taskToMove) {
        taskToMove.remove();
        targetList.appendChild(createTaskElement(targetList.id, taskName));
      }
    }
  });

  column.appendChild(taskList);

  return column;
}
