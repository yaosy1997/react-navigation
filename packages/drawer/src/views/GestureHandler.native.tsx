import * as React from 'react';
import {
  PanGestureHandler as PanGestureHandlerNative,
  PanGestureHandlerProperties,
} from 'react-native-gesture-handler';
import DrawerGestureContext from '../utils/DrawerGestureContext';

export function PanGestureHandler(props: PanGestureHandlerProperties) {
  const gestureRef = React.useRef<PanGestureHandlerNative>(null);

  return (
    <DrawerGestureContext.Provider value={gestureRef}>
      <PanGestureHandler {...props} />
    </DrawerGestureContext.Provider>
  );
}

export {
  GestureHandlerRootView,
  TapGestureHandler,
  State as GestureState,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
