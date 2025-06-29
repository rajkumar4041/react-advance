import React from 'react';

type Task = { id: number; text: string; done: boolean };

type TaskItemProps = {
  task: Task;
  onToggle: (id: number) => void;
};

function TaskItem({ task, onToggle }: TaskItemProps) {
  return (
    <li>
      <label>
        <input type="checkbox" checked={task.done} onChange={() => onToggle(task.id)} />
        {task.text}
      </label>
    </li>
  );
}

export default React.memo(TaskItem);
