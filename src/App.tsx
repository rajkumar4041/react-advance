import React, { startTransition, Suspense, useRef, useState } from 'react';
import AddTaskModal, { type AddTaskModalRef } from './components/AddTaskModal';
import Toggle from './components/CustomToggle';
import { ErrorBoundary } from './components/ErrorBoundary';
import FilterTasks from './components/FilterTasks';
import TaskList from './components/TaskList';
import withLogger from './components/withLogger';
import { TaskProvider } from './context/TaskContext';
import useTasks from './hooks/useTasks';

const TaskStats = React.lazy(() => import('./components/TaskStats'));

const TaskListWithLogger = withLogger(TaskList);

function App() {
  const { tasks, addTask, toggleTask } = useTasks();
  const [showModal, setShowModal] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const modalRef = useRef<AddTaskModalRef>(null);

  React.useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  const handleFilter = (type: 'all' | 'done' | 'todo') => {
    startTransition(() => {
      if (type === 'all') setFilteredTasks(tasks);
      else if (type === 'done') setFilteredTasks(tasks.filter((t) => t.done));
      else setFilteredTasks(tasks.filter((t) => !t.done));
    });
  };

  return (
    <div className="app">
      <h1>Advanced React Task Manager</h1>
      <h3>
        A task manager built with React, TypeScript, and Tailwind CSS(practice while mastering
        advanced React concepts)
      </h3>
      <button
        onClick={() => {
          setShowModal(true);
          setTimeout(() => {
            modalRef.current?.focusInput();
          }, 100);
        }}
      >
        Add Task
      </button>
      <AddTaskModal
        ref={modalRef}
        open={showModal}
        onClose={() => setShowModal(false)}
        onAdd={addTask}
      />
      <ErrorBoundary>
        <Suspense fallback={<div>Loading stats...</div>}>
          <TaskStats />
        </Suspense>
      </ErrorBoundary>
      <div style={{ margin: '16px 0' }}>
        <button onClick={() => handleFilter('all')}>All</button>
        <button onClick={() => handleFilter('done')}>Done</button>
        <button onClick={() => handleFilter('todo')}>Todo</button>
      </div>
      <FilterTasks filter={filteredTasks}>
        {(tasks) => <TaskListWithLogger tasks={tasks} onToggle={toggleTask} />}
      </FilterTasks>
      <Toggle>
        <Toggle.On>
          <div style={{ color: 'green' }}>Toggle is ON</div>
        </Toggle.On>
        <Toggle.Off>
          <div style={{ color: 'red' }}>Toggle is OFF</div>
        </Toggle.Off>
        <Toggle.Button />
      </Toggle>
    </div>
  );
}

export default App;
