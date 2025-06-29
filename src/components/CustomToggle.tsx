import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type ToggleContextType = {
  on: boolean;
  toggle: () => void;
};

const ToggleContext = createContext<ToggleContextType | undefined>(undefined);

function Toggle({ children }: { children: ReactNode }) {
  const [on, setOn] = useState(false);
  const toggle = () => setOn((o) => !o);
  return <ToggleContext.Provider value={{ on, toggle }}>{children}</ToggleContext.Provider>;
}

function ToggleOn({ children }: { children: ReactNode }) {
  const context = useContext(ToggleContext);
  if (!context) throw new Error('Toggle.On must be used within Toggle');
  return context.on ? <>{children}</> : null;
}

function ToggleOff({ children }: { children: ReactNode }) {
  const context = useContext(ToggleContext);
  if (!context) throw new Error('Toggle.Off must be used within Toggle');
  return !context.on ? <>{children}</> : null;
}

function ToggleButton() {
  const context = useContext(ToggleContext);
  if (!context) throw new Error('Toggle.Button must be used within Toggle');
  return <button onClick={context.toggle}>{context.on ? 'ON' : 'OFF'}</button>;
}

Toggle.On = ToggleOn;
Toggle.Off = ToggleOff;
Toggle.Button = ToggleButton;

export default Toggle;
