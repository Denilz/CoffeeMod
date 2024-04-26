import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import Dashboard from './screens/Dashboard';
import { auth } from './firebase'; // Import your Firebase auth instance

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRouteName, setInitialRouteName] = useState('Login');
  const [dailyLimit, setDailyLimit] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // User is signed in, check if daily limit is available
        // Retrieve daily limit from storage or wherever it's saved
        const savedDailyLimit = 4; // Example: Retrieve from storage or database
        if (savedDailyLimit !== null) {
          // Daily limit exists, navigate to Dashboard screen
          setDailyLimit(savedDailyLimit);
          setInitialRouteName('Dashboard');
        } else {
          // Daily limit doesn't exist, navigate to HomeScreen
          setInitialRouteName('Home');
        }
      }
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Dashboard">
          {props => <Dashboard {...props} dailyLimit={dailyLimit} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
