import * as React from 'react';

const UNINTIALIZED_STATE = {};

export default function useSyncState<T>(initialState?: (() => T) | T) {
  const [, forceUpdate] = React.useReducer(state => state + 1, 0);

  const stateRef = React.useRef<T>(UNINTIALIZED_STATE as any);

  if (stateRef.current === UNINTIALIZED_STATE) {
    stateRef.current =
      // @ts-ignore
      typeof initialState === 'function' ? initialState() : initialState;
  }

  const getState = React.useCallback(() => stateRef.current, []);

  const setState = React.useCallback((state: T) => {
    if (state === stateRef.current) {
      return;
    }

    stateRef.current = state;
    forceUpdate();
  }, []);

  const state = stateRef.current;

  return [state, getState, setState] as const;
}
