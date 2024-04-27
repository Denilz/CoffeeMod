import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

// Import the coffee blur image
import coffeeBlurImage from '../images/coffeeblur.png';

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
    <View style={[styles.container, { backgroundColor: '#FFFEFF' }]}>
      <Image source={coffeeBlurImage} style={styles.image} />
      <Text style={styles.text}>You've drank today:</Text>
      <Text style={styles.bigText}>{`${coffeeAmount}/${dailyLimit}`} <Text style={styles.smallText}>coffees.</Text></Text>
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
  image: {
    width: 200,
    height: 200,
    // marginBottom: 40,
  },
  text: {
    marginTop: 40,
    marginBottom: 10,
    fontSize: 32,
  },
  bigText: {
    fontSize: 140,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2E0E02',
  },
  smallText: {
    fontSize: 12,
  },
  addButton: {
    backgroundColor: '#2E0E02',
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
    // marginTop: 10,
    marginBottom: 20,
  },
});
