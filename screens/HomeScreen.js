import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { auth } from '../firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [dailyLimit, setDailyLimit] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!auth.currentUser) {
          console.error('User not authenticated.');
          return;
        }

        const docRef = doc(db, 'test', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // If document exists, navigate to Dashboard with stored dailyLimit
          const data = docSnap.data();
          navigation.navigate('Dashboard', { dailyLimit: data.dailyLimit });
        } else {
          // If document doesn't exist, set loading to false
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (dailyLimit.trim() !== '') {
      try {
        if (!auth.currentUser) {
          console.error('User not authenticated.');
          return;
        }

        const docRef = doc(db, 'test', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          // If document doesn't exist, create a new one with dailyLimit and TodayCoffee both set to 0
          await setDoc(docRef, { dailyLimit: parseInt(dailyLimit.trim()), TodayCoffee: 0 });
        } else {
          // If document exists, update the dailyLimit
          const newDailyLimit = parseInt(dailyLimit.trim());
          await updateDoc(docRef, { dailyLimit: newDailyLimit });
        }

        navigation.navigate('Dashboard', { dailyLimit: parseInt(dailyLimit.trim()) });
      } catch (error) {
        console.error('Error setting document:', error);
      }
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to Coffee Mod</Text>
      <Text>Email: {auth.currentUser?.email}</Text>
      <Text style={styles.question}>What is your coffee daily limit?</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your daily limit"
        keyboardType="numeric"
        value={dailyLimit}
        onChangeText={text => setDailyLimit(text)}
      />
      <TouchableOpacity
        onPress={handleSubmit}
        style={styles.submitButton}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 10,
    width: '100%',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
