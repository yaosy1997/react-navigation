import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Headline, useTheme } from 'react-native-paper';
import {
  ParamListBase,
  UnhandledActionBoundary,
} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';

type SimpleStackParams = {
  First: undefined;
  Second: undefined;
};

type SimpleStackNavigation = StackNavigationProp<SimpleStackParams>;

const TestScreen = ({ navigation }: { navigation: SimpleStackNavigation }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={() => navigation.push('First')}
        style={styles.button}
      >
        Push first
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.push('Second')}
        style={styles.button}
      >
        Push second
      </Button>
      <Button
        mode="contained"
        color={colors.error}
        onPress={() => {
          // @ts-ignore
          navigation.push('Invalid');
        }}
        style={styles.button}
      >
        Push invalid screen
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.pop()}
        style={styles.button}
      >
        Pop screen
      </Button>
    </View>
  );
};

const NotFound = ({ goBack }: { goBack: () => void }) => {
  return (
    <View style={styles.container}>
      <Headline style={styles.title}>Oops!</Headline>
      <Button mode="outlined" onPress={goBack} style={styles.button}>
        Go back
      </Button>
    </View>
  );
};

const SimpleStack = createStackNavigator<SimpleStackParams>();

type Props = Partial<React.ComponentProps<typeof SimpleStack.Navigator>> & {
  navigation: StackNavigationProp<ParamListBase>;
};

export default function SimpleStackScreen({ navigation, ...rest }: Props) {
  const [is404, setIs404] = React.useState(false);

  navigation.setOptions({
    headerShown: false,
  });

  if (is404) {
    return <NotFound goBack={() => setIs404(false)} />;
  }

  return (
    <UnhandledActionBoundary
      onUnhandledAction={(action) => {
        switch (action.type) {
          case 'PUSH':
            setIs404(true);
            break;
        }
      }}
    >
      <SimpleStack.Navigator {...rest}>
        <SimpleStack.Screen name="First" component={TestScreen} />
        <SimpleStack.Screen name="Second" component={TestScreen} />
      </SimpleStack.Navigator>
    </UnhandledActionBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 8,
  },
  title: {
    textAlign: 'center',
  },
  button: {
    margin: 8,
  },
});
