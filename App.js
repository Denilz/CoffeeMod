import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import Dashboard from './screens/Dashboard';
import { auth, db } from './firebase'; // Import your Firebase auth and firestore instances

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRouteName, setInitialRouteName] = useState('Login');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docRef = db.doc(`test/${user.uid}`);
          const docSnap = await docRef.get();
          if (docSnap.exists()) {
            // Check if daily limit data exists in the document
            const data = docSnap.data();
            if (data && data.dailyLimit !== undefined) {
              setInitialRouteName('Dashboard');
            } else {
              setInitialRouteName('Home');
            }
          } else {
            setInitialRouteName('Home');
          }
        } catch (error) {
          console.error('Error fetching document:', error);
          setInitialRouteName('Home');
        }
      }
    });

    return unsubscribe;
  }, []);

  const handleLogin = async (email, password, navigate) => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      // Fetch the user data after sign in to determine initial route
      const user = auth.currentUser;
      if (user) {
        const docRef = db.doc(`test/${user.uid}`);
        const docSnap = await docRef.get();
        if (docSnap.exists()) {
          // Check if daily limit data exists in the document
          const data = docSnap.data();
          if (data && data.dailyLimit !== undefined) {
            navigate('Dashboard');
          } else {
            navigate('Home');
          }
        } else {
          navigate('Home');
        }
      }
    } catch (error) {
      console.error('Error signing in:', error);
      // Handle sign-in error, e.g., display an alert
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
        <Stack.Screen options={{ headerShown: false }} name="Login">
          {props => <LoginScreen {...props} onLogin={handleLogin} />}
        </Stack.Screen>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
