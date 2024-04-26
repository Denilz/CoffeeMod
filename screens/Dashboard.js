import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Dashboard = ({ route }) => {
  const { dailyLimit } = route.params;
  const [coffeeAmount, setCoffeeAmount] = useState(0);

  useEffect(() => {
    fetchDataFromFirestore();
  }, []);

  const fetchDataFromFirestore = async () => {
    try {
      const docRef = doc(db, 'test', 'Hs3KpWP61OyMVaYfm1dc');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && data.TodayCoffee !== undefined) {
          setCoffeeAmount(data.TodayCoffee);
        }
      }
    } catch (error) {
      console.error('Error fetching document:', error);
    }
  };

  const handleAddCoffee = async () => {
    const newCoffeeAmount = coffeeAmount + 1;
    try {
      const docRef = doc(db, 'test', 'Hs3KpWP61OyMVaYfm1dc');
      await updateDoc(docRef, { TodayCoffee: newCoffeeAmount });
      setCoffeeAmount(newCoffeeAmount);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Daily coffee limit: {dailyLimit}</Text>
      <Text style={styles.text}>Today coffee amount: {coffeeAmount}</Text>
      <TouchableOpacity onPress={handleAddCoffee} style={styles.addButton}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#0782F9',
    borderRadius: 20,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
