import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { auth } from '../firebase';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [dailyLimit, setDailyLimit] = useState('');
  const [coffeeToday, setCoffeeToday] = useState(0);

  const handleSubmit = () => {
    if (dailyLimit.trim() !== '') {
      setCoffeeToday(0); // Reset coffee count when daily limit is submitted
      navigation.navigate('Dashboard', { dailyLimit: parseInt(dailyLimit.trim()) });
    }
  }

  const handleAddCoffee = () => {
    if (coffeeToday < parseInt(dailyLimit)) {
      setCoffeeToday(coffeeToday + 1);
      if (coffeeToday + 1 === parseInt(dailyLimit)) {
        alert("Coffee limit reached");
      }
    } else {
      alert("Coffee limit reached");
    }
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
