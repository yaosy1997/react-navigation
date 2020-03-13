import * as React from 'react';

type LinkingContextType = {
  push: (link: string) => void;
  replace: (link: string) => void;
};

const LinkingContext = React.createContext<LinkingContextType>({
  push: () => {
    throw new Error('No context');
  },
  replace: () => {
    throw new Error('No context');
  },
});

export default LinkingContext;
