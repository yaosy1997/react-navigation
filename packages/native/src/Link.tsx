import * as React from 'react';
import { Text, TextProps, GestureResponderEvent, Platform } from 'react-native';
import LinkingContext from './LinkingContext';

type TouchableProps = {
  href?: string;
  accessibilityRole?: any;
  onPress?: (e?: any) => void;
};

type Props = {
  to: string;
} & (
  | (TextProps & { children: React.ReactNode })
  | { children: (props: TouchableProps) => React.ReactNode }
);

export default function Link({ to, children, ...rest }: Props) {
  const { push } = React.useContext(LinkingContext);
  const onPress = (e: GestureResponderEvent | undefined) => {
    if ('onPress' in rest) {
      rest.onPress?.(e as GestureResponderEvent);
    }

    const event = (e?.nativeEvent as any) as
      | React.MouseEvent<HTMLAnchorElement, MouseEvent>
      | undefined;

    if (Platform.OS !== 'web' || !event) {
      push(to);
      return;
    }

    if (
      !event.defaultPrevented && // onClick prevented default
      event.button === 0 && // ignore everything but left clicks
      // @ts-ignore
      (!rest.target || rest.target === '_self') && // let browser handle "target=_blank" etc.
      !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) // ignore clicks with modifier keys
    ) {
      event.preventDefault();
      push(to);
    }
  };

  const props = {
    href: to,
    onPress,
    accessibilityRole: 'link' as const,
    ...rest,
  };

  if (typeof children === 'function') {
    return children(props);
  }

  return <Text {...props}>{children}</Text>;
}
