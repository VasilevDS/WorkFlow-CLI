const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');

const sourceModule = path.join(__dirname, '..', 'src', 'tasks.js');
function createStore(t) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'taskflow-test-'));
  t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }));
  const tempSrcDir = path.join(tempDir, 'src');
  fs.mkdirSync(tempSrcDir);
  fs.copyFileSync(sourceModule, path.join(tempSrcDir, 'tasks.js'));
  return { tempDir, tasks: require(path.join(tempSrcDir, 'tasks.js')) };
}

test('добавляет задачу и возвращает обновлённый список', (t) => {
  const { tasks } = createStore(t);
  assert.deepEqual(tasks.addTask('Купить хлеб'), ['Купить хлеб']);
  assert.deepEqual(tasks.listTasks(), ['Купить хлеб']);
});

test('возвращает пустой список, если файл ещё не создан', (t) => {
  const { tasks } = createStore(t);
  assert.deepEqual(tasks.listTasks(), []);
});

test('позволяет добавить пустое название без дополнительной валидации', (t) => {
  const { tasks } = createStore(t);
  assert.deepEqual(tasks.addTask(''), ['']);
  assert.deepEqual(tasks.listTasks(), ['']);
});

test('сохраняет задачи в файл и загружает их при повторном чтении', (t) => {
  const { tempDir, tasks } = createStore(t);
  tasks.addTask('Первая задача');
  tasks.addTask('Вторая задача');

  const savedContent = fs.readFileSync(path.join(tempDir, 'tasks.json'), 'utf8');
  assert.deepEqual(JSON.parse(savedContent), ['Первая задача', 'Вторая задача']);

  delete require.cache[require.resolve(path.join(tempDir, 'src', 'tasks.js'))];
  const reloadedTasks = require(path.join(tempDir, 'src', 'tasks.js'));
  assert.deepEqual(reloadedTasks.listTasks(), ['Первая задача', 'Вторая задача']);
});
