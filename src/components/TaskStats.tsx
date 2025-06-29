import useTasks from '../hooks/useTasks';

export default function TaskStats() {
  const { tasks } = useTasks();
  const done = tasks.filter((t) => t.done).length;
  return (
    <div>
      <strong>
        {done} / {tasks.length} tasks completed
      </strong>
    </div>
  );
}
