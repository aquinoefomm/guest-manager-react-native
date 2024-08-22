import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AddGuestScreen from './src/screens/AddGuestScreen';
import GuestListScreen from './src/screens/GuestListScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="GuestList">
        <Stack.Screen name="GuestList" component={GuestListScreen} />
        <Stack.Screen name="AddGuest" component={AddGuestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
