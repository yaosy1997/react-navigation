import * as React from 'react';
import {
  BaseNavigationContainer,
  NavigationContainerProps,
  NavigationContainerRef,
  InitialState,
  getStateFromPath,
  getActionFromState,
} from '@react-navigation/core';
import ThemeProvider from './theming/ThemeProvider';
import DefaultTheme from './theming/DefaultTheme';
import LinkingContext from './LinkingContext';
import useLinking from './useLinking';
import useBackButton from './useBackButton';
import { Theme, LinkingOptions } from './types';

type Props = NavigationContainerProps & {
  theme?: Theme;
  linking?: LinkingOptions;
};

/**
 * Container component which holds the navigation state
 * designed for mobile apps.
 * This should be rendered at the root wrapping the whole app.
 *
 * @param props.initialState Initial state object for the navigation tree.
 * @param props.onStateChange Callback which is called with the latest navigation state when it changes.
 * @param props.theme Theme object for the navigators.
 * @param props.linking Options for deep linking.
 * @param props.children Child elements to render the content.
 * @param props.ref Ref object which refers to the navigation object containing helper methods.
 */
const NavigationContainer = React.forwardRef(function NavigationContainer(
  { theme = DefaultTheme, linking, ...rest }: Props,
  ref: React.Ref<NavigationContainerRef>
) {
  const [isReady, setIsReady] = React.useState(linking?.enabled ? true : false);
  const [initialState, setInitialState] = React.useState<
    InitialState | undefined
  >(linking?.enabled ? undefined : rest.initialState);

  const refContainer = React.useRef<NavigationContainerRef>(null);

  useBackButton(refContainer);

  const { getInitialState } = useLinking(refContainer, {
    enabled: false,
    prefixes: [],
    ...linking,
  });

  React.useImperativeHandle(ref, () => refContainer.current);

  React.useEffect(() => {
    Promise.race([
      getInitialState(),
      new Promise((resolve) =>
        // Timeout in 150ms if `getInitialState` doesn't resolve
        // Workaround for https://github.com/facebook/react-native/issues/25675
        setTimeout(resolve, 150)
      ),
    ])
      .catch((e) => {
        console.error(e);
      })
      .then((state) => {
        if (state !== undefined) {
          setInitialState(state as InitialState);
        }

        setIsReady(true);
      });
  }, [getInitialState]);

  const linkingOptionsRef = React.useRef(linking);

  React.useEffect(() => {
    linkingOptionsRef.current = linking;
  });

  const linkingContext = React.useMemo(
    () => ({
      linkTo: (path: string) => {
        const state = linkingOptionsRef.current?.getStateFromPath
          ? linkingOptionsRef.current.getStateFromPath(
              path,
              linkingOptionsRef.current.config
            )
          : getStateFromPath(path, linkingOptionsRef.current?.config);

        if (state) {
          const action = getActionFromState(state);

          const navigation = refContainer.current;

          if (action !== undefined) {
            navigation?.dispatch(action);
          } else {
            navigation?.resetRoot(state);
          }
        }
      },
    }),
    [linkingOptionsRef]
  );

  if (!isReady) {
    // TODO: render a placeholder here
    return null;
  }

  return (
    <LinkingContext.Provider value={linkingContext}>
      <ThemeProvider value={theme}>
        <BaseNavigationContainer
          {...rest}
          initialState={initialState}
          ref={refContainer}
        />
      </ThemeProvider>
    </LinkingContext.Provider>
  );
});

export default NavigationContainer;
