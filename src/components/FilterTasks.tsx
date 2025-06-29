type Task = { id: number; text: string; done: boolean };

type FilterTasksProps = {
  filter: Task[];
  children: (tasks: Task[]) => React.ReactNode;
};

export default function FilterTasks({ filter, children }: FilterTasksProps) {
  return <>{children(filter)}</>;
}
