# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

# Advanced React Concepts Learned

## Topics

- **React Context API**
- **Custom Hooks**
- **React.lazy & Suspense (Code Splitting)**
- **Error Boundaries**
- **Refs and Imperative Handle**
- **Higher-Order Components (HOC)**
- **Compound Components Pattern**
- **startTransition (Concurrent Features)**
- **Render Props**

This project demonstrates several advanced React concepts. Below is a list of topics, a brief explanation of each, and where they are implemented in this application:

1. **React Context API**

   - **What:** Provides a way to share state globally across the component tree without prop drilling.
   - **Where:** Implemented via `TaskProvider` and accessed with the `useTasks` custom hook. (See `context/TaskContext` and `hooks/useTasks`).

2. **Custom Hooks**

   - **What:** Encapsulate reusable logic that can be shared across components.
   - **Where:** `useTasks` manages task state and logic. (See `hooks/useTasks`).

3. **React.lazy & Suspense (Code Splitting)**

   - **What:** Dynamically load components to optimize performance and reduce initial bundle size.
   - **Where:** `TaskStats` is loaded with `React.lazy` and rendered inside a `Suspense` boundary. (See `App.tsx`).

4. **Error Boundaries**

   - **What:** Catch JavaScript errors in child components and display a fallback UI.
   - **Where:** The `ErrorBoundary` component wraps `TaskStats` to handle errors gracefully. (See `components/ErrorBoundary` and `App.tsx`).

5. **Refs and Imperative Handle**

   - **What:** Access and control child components imperatively from parent components.
   - **Where:** `AddTaskModal` uses a `ref` to expose a `focusInput` method, allowing the parent to focus the input programmatically. (See `components/AddTaskModal` and `App.tsx`).

6. **Higher-Order Components (HOC)**

   - **What:** Functions that take a component and return a new component with enhanced behavior.
   - **Where:** `withLogger` wraps `TaskList` to add logging functionality. (See `components/withLogger` and `App.tsx`).

7. **Compound Components Pattern**

   - **What:** Components that work together via shared state/context, providing a flexible API.
   - **Where:** The `Toggle` component exposes `Toggle.On`, `Toggle.Off`, and `Toggle.Button` as compound components. (See `components/CustomToggle` and `App.tsx`).

8. **startTransition (Concurrent Features)**

   - **What:** Schedules state updates with lower priority to keep the UI responsive during heavy updates.
   - **Where:** Used in `handleFilter` to filter tasks without blocking the UI. (See `App.tsx`).

9. **Render Props**
   - **What:** A technique for sharing code between components using a function as a child.
   - **Where:** `FilterTasks` uses a render prop to pass filtered tasks to `TaskListWithLogger`. (See `components/FilterTasks` and `App.tsx`).
