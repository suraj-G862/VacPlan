import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import HomeScreen from './src/screens/HomeScreen';
import WeekendPlanScreen from './src/screens/WeekendPlanScreen';
import ActivityListScreen from './src/screens/ActivityListScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{ title: 'Weekendly' }}
            />
            <Stack.Screen 
              name="WeekendPlan" 
              component={WeekendPlanScreen}
              options={{ title: 'Your Weekend Plan' }}
            />
            <Stack.Screen 
              name="ActivityList" 
              component={ActivityListScreen}
              options={{ title: 'Choose Activities' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
