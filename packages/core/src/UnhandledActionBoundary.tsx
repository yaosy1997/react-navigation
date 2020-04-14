import * as React from 'react';
import { NavigationAction } from '@react-navigation/routers';

type Props = {
  onUnhandledAction: (action: NavigationAction) => void;
  children: React.ReactNode;
};

/**
 * Context which exposes a handler for unhandled actions.
 */
export const UnhandledActionContext = React.createContext<
  ((action: NavigationAction) => void) | undefined
>(undefined);

export default function UnhandledActionBoundary({
  onUnhandledAction,
  children,
}: Props) {
  const onUnhandledActionRef = React.useRef(onUnhandledAction);

  React.useEffect(() => {
    onUnhandledActionRef.current = onUnhandledAction;
  });

  const context = React.useCallback((action: NavigationAction) => {
    onUnhandledActionRef.current(action);
  }, []);

  return (
    <UnhandledActionContext.Provider value={context}>
      {children}
    </UnhandledActionContext.Provider>
  );
}
