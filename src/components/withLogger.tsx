import React from 'react';

function withLogger<P extends object>(Component: React.ComponentType<P>) {
  return (props: P) => {
    console.log('Rendering', Component.name, 'with props', props);
    return <Component {...props} />;
  };
}

export default withLogger;
