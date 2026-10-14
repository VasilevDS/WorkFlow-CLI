const fs = require('node:fs');
const path = require('node:path');

const tasksFile = path.join(__dirname, '..', 'tasks.json');

function listTasks() {
  if (!fs.existsSync(tasksFile)) {
    return [];
  }

  const content = fs.readFileSync(tasksFile, 'utf8');
  const tasks = JSON.parse(content);

  if (!Array.isArray(tasks) || tasks.some((task) => typeof task !== 'string')) {
    throw new Error('Файл tasks.json должен содержать JSON-массив строк.');
  }

  return tasks;
}

function addTask(title) {
  const tasks = listTasks();
  tasks.push(title);
  fs.writeFileSync(tasksFile, `${JSON.stringify(tasks, null, 2)}\n`);
  return tasks;
}

module.exports = { addTask, listTasks };
