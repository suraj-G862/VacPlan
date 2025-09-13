import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <Stack>
          <Stack.Screen 
            name="index" 
            options={{ 
              title: 'Weekendly',
              headerLargeTitle: true,
            }} 
          />
          <Stack.Screen 
            name="weekend-plan" 
            options={{ 
              title: 'Plan Your Weekend',
              presentation: 'card',
            }} 
          />
          <Stack.Screen 
            name="(modals)/activity-list" 
            options={{ 
              title: 'Choose Activities',
              presentation: 'modal',
            }} 
          />
        </Stack>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
