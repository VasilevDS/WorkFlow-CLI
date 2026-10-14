#!/usr/bin/env node

const { addTask, listTasks } = require('./tasks');

function printHelp() {
  console.log(`TaskFlow — простой список задач

Использование:
  taskflow add "Название задачи"
  taskflow list
  taskflow --help`);
}

function main(args) {
  const [command, ...params] = args;

  if (command === '--help' || command === '-h' || command === undefined) {
    printHelp();
    return;
  }

  if (command === 'add') {
    const title = params.join(' ').trim();
    if (!title) {
      throw new Error('Укажите название задачи: taskflow add "Название задачи"');
    }

    const tasks = addTask(title);
    console.log(`Задача добавлена: ${title}`);
    console.log(`Всего задач: ${tasks.length}`);
    return;
  }

  if (command === 'list') {
    const tasks = listTasks();
    if (tasks.length === 0) {
      console.log('Список задач пуст.');
      return;
    }

    tasks.forEach((task, index) => console.log(`${index + 1}. ${task}`));
    return;
  }

  throw new Error(`Неизвестная команда: ${command}. Используйте --help.`);
}

try {
  main(process.argv.slice(2));
} catch (error) {
  console.error(`Ошибка: ${error.message}`);
  process.exitCode = 1;
}
