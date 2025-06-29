import { useMemo } from 'react';
import TaskItem from './TaskItem';

type Task = { id: number; text: string; done: boolean };

type TaskListProps = {
  tasks: Task[];
  onToggle: (id: number) => void;
};

function TaskList({ tasks, onToggle }: TaskListProps) {
  const renderedTasks = useMemo(
    () => tasks.map((task) => <TaskItem key={task.id} task={task} onToggle={onToggle} />),
    [tasks, onToggle]
  );
  return <ul>{renderedTasks}</ul>;
}

export default TaskList;
