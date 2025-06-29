import { useCallback, useContext } from 'react';
import TaskContext from '../context/TaskContext';

export default function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within a TaskProvider');
  const { state, dispatch } = context;

  const addTask = useCallback(
    (text: string) => {
      dispatch({
        type: 'ADD_TASK',
        task: { id: Date.now(), text, done: false },
      });
    },
    [dispatch]
  );

  const toggleTask = useCallback(
    (id: number) => {
      dispatch({ type: 'TOGGLE_TASK', id });
    },
    [dispatch]
  );

  return {
    tasks: state.tasks,
    addTask,
    toggleTask,
  };
}
