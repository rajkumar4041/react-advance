import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import ReactDOM from 'react-dom';

export interface AddTaskModalRef {
  focusInput: () => void;
}

type AddTaskModalProps = {
  open: boolean;
  onClose: () => void;
  onAdd: (text: string) => void;
};

const AddTaskModal = forwardRef<AddTaskModalRef, AddTaskModalProps>(
  ({ open, onClose, onAdd }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focusInput: () => {
        inputRef.current && inputRef.current.focus();
      },
    }));

    useEffect(() => {
      if (open) {
        inputRef.current && inputRef.current.focus();
      }
    }, [open]);

    if (!open) return null;

    return ReactDOM.createPortal(
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={onClose}
      >
        <div
          style={{ background: '#fff', padding: 20, borderRadius: 8 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2>Add Task</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (inputRef.current) {
                onAdd(inputRef.current.value);
                inputRef.current.value = '';
              }
              onClose();
            }}
          >
            <input ref={inputRef} type="text" required />
            <button type="submit">Add</button>
          </form>
          <button onClick={onClose}>Close</button>
        </div>
      </div>,
      document.body
    );
  }
);

export default AddTaskModal;
