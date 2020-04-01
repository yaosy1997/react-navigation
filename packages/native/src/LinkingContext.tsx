import * as React from 'react';

type LinkingContextType = {
  linkTo: (link: string) => void;
};

const LinkingContext = React.createContext<LinkingContextType>({
  linkTo: () => {
    throw new Error(
      "Couldn't find a linking context. Have you wrapped your app with 'NavigationContainer'?"
    );
  },
});

export default LinkingContext;
