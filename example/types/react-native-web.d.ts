declare module 'react-native-web' {
  export const AppRegistry: {
    registerComponent(
      name: string,
      callback: () => React.ComponentType<any>
    ): void;

    getApplication(
      name: string,
      { initialProps: object }
    ): {
      element: React.ReactElement;
      getStyleElement(): React.ReactElement;
    };
  };
}
