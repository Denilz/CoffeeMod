import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, ImageBackground } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase'; // Importing your Firebase auth instance

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(user => {
    if (user) {
      navigation.navigate("Home");
    }
  });

  return unsubscribe;
}, []);


  const handleSignUp = () => {
    createUserWithEmailAndPassword(getAuth(), email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('User signed up:', user.email);
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.error('Sign up error:', errorMessage);
      });
  };

  const handleLogin = () => {
      signInWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Logged in with:', user.email);
      })
      .catch(error => alert(error.message))
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
      <ImageBackground source={require('../images/background.png')} style={styles.backgroundImage}>
        <View style={styles.content}>
          {/* Nested ImageBackground for the secondary image */}
          <ImageBackground source={require('../images/coffeetime.png')} style={styles.secondaryImage} >
            <Text style={[styles.secondaryText, { fontFamily: 'Trebuchet MS' }]}>CoffeeMod</Text>
            <Text style={[styles.paragraph, { fontFamily: 'Avenir' }]}>Tracking your coffee daily intake</Text>
          </ImageBackground>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={text => setEmail(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={text => setPassword(text)}
              style={styles.input}
              secureTextEntry
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleLogin}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSignUp}
              style={[styles.button, styles.buttonOutline]}
            >
              <Text style={styles.buttonOutlineText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    width: '100%',
    alignItems: 'center',
  },
  content: {
    width: '80%',
    marginTop: 100, // Adjust as needed
    alignItems: 'center', // Center content horizontally
  },
  inputContainer: {
    width: '100%', // Make input container full width
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    width: '100%', // Make input full width
  },
  buttonContainer: {
    width: '100%', // Make button container full width
    alignItems: 'center', // Center content horizontally
  },
  button: {
    backgroundColor: '#0782F9',
    width: '60%', // Adjust button width as needed
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonOutline: {
    backgroundColor: 'white',
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryImage: {
    width: 280, // Adjust width and height according to your image
    height: 250,
    alignItems: 'center',
    marginBottom: 20, // Add space between the image and the text
  },
  secondaryText: {
    color: '#CBC5EA',
    fontSize: 52,
    fontWeight: 'bold',
    textAlign: 'center',
    bottom: 120,
    textShadowColor: '#ffffff', // Set text shadow color to white
    textShadowOffset: { width: 1, height: 1 }, // Set text shadow offset
    textShadowRadius: 5, // Set text shadow radius
  },  
  paragraph: {
    color: '#171717',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    bottom: 120,
  },
});

