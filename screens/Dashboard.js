import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

const Dashboard = ({ route }) => {
  const { dailyLimit } = route.params;
  const [coffeeAmount, setCoffeeAmount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      setCurrentUser(user);
      if (user) {
        await fetchDataFromFirestore(user);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchDataFromFirestore = async (user) => {
    try {
      const docRef = doc(db, 'test', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && data.TodayCoffee !== undefined) {
          setCoffeeAmount(data.TodayCoffee);
        }
      } else {
        // Only create the document if it doesn't exist
        await setDoc(docRef, { TodayCoffee: 0 });
      }
    } catch (error) {
      console.error('Error fetching document:', error);
    }
  };

  const handleAddCoffee = async () => {
    if (currentUser) {
      const newCoffeeAmount = coffeeAmount + 1;
      if (newCoffeeAmount <= dailyLimit) {
        try {
          const docRef = doc(db, 'test', auth.currentUser.uid);
          await updateDoc(docRef, { TodayCoffee: newCoffeeAmount });
          setCoffeeAmount(newCoffeeAmount);
          setLimitReached(false);
        } catch (error) {
          console.error('Error updating document:', error);
        }
      } else {
        setLimitReached(true);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Daily coffee limit: {dailyLimit}</Text>
      <Text style={styles.text}>Today coffee amount: {coffeeAmount}</Text>
      {limitReached && <Text style={styles.limitReachedText}>Daily coffee limit reached!</Text>}
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
  limitReachedText: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
  },
});
// test