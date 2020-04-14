import * as React from 'react';
import { NavigationAction } from '@react-navigation/routers';

type Props = {
  onError: () => void;
  onUnhandledAction: (action: NavigationAction) => void;
  children: React.ReactNode;
};

/**
 * Context which exposes a handler for unhandled actions.
 */
export const UnhandledActionContext = React.createContext<
  ((action: NavigationAction) => void) | undefined
>(undefined);

export default class UnhandledActionBoundary extends React.Component<Props> {
  componentDidCatch(e) {
    console.log('an error occurred', e);
    this.props.onError(e);
  }

  private handleUnhandledAction = (action: NavigationAction) => {
    this.props.onUnhandledAction(action);
  };

  render() {
    return (
      <UnhandledActionContext.Provider value={this.handleUnhandledAction}>
        {this.props.children}
      </UnhandledActionContext.Provider>
    );
  }
}
