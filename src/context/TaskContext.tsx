import { createContext, useReducer } from 'react';
import type { Dispatch, ReactNode } from 'react';

type Task = { id: number; text: string; done: boolean };
type State = { tasks: Task[] };
type Action = { type: 'ADD_TASK'; task: Task } | { type: 'TOGGLE_TASK'; id: number };

const initialState: State = {
  tasks: [
    { id: 1, text: 'Learn React', done: false },
    { id: 2, text: 'Master Advanced Concepts', done: false },
  ],
};

function taskReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.task] };
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t)),
      };
    default:
      return state;
  }
}

type TaskContextType = {
  state: State;
  dispatch: Dispatch<Action>;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  return <TaskContext.Provider value={{ state, dispatch }}>{children}</TaskContext.Provider>;
}

export default TaskContext;
