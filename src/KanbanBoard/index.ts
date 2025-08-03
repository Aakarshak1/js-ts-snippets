import styles from './kanbanStyle.module.css';

import { createColumn } from './column';
import { setupDialog } from './dialog';

const COL_NAMES = ['todo', 'in-progress', 'done'];

const app = document.getElementById('app');

if (app) {
  const board = document.createElement('div');
  board.className = styles.board;

  COL_NAMES.forEach((column) => {
    board.appendChild(createColumn(column));
  });

  app.appendChild(board);
  setupDialog();
}
