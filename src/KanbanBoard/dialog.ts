import styles from './kanbanStyle.module.css';

let dialog: HTMLDialogElement;
let input: HTMLInputElement;
let onConfirm: ((taskName: string) => void) | null = null;

export function setupDialog() {
  dialog = document.createElement('dialog');
  dialog.className = styles['task-dialog'];
  dialog.innerHTML = `
    <form method="dialog" class="${styles['task-form']}">
      <label>
        Task Name:
        <input type="text" id="task-input" />
      </label>
      <div class="${styles.buttons}">
        <button value="default" type="submit">Add</button>
        <button value="cancel" type="button" id="cancel-btn">Cancel</button>
      </div>
    </form>
  `;
  document.body.appendChild(dialog);

  input = dialog.querySelector('#task-input') as HTMLInputElement;

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || (e.target as HTMLElement).id === 'cancel-btn') dialog.close();
  });

  dialog.addEventListener('close', () => {
    if (dialog.returnValue === 'default') {
      const name = input.value.trim();
      if (name && onConfirm) onConfirm(name);
      input.value = '';
    }
    onConfirm = null;
  });

  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    dialog.close();
  });
}

export function openTaskDialog(confirmCb: (taskName: string) => void) {
  onConfirm = confirmCb;
  if (dialog && input) {
    dialog.showModal();
    input.focus();
  }
}
