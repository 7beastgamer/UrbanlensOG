import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './src/navigation/MainNavigator';
import { getUser } from './src/services/authService';
import { View, ActivityIndicator } from 'react-native';

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const user = await getUser();
      setInitialRoute(user ? "Home" : "Login");
    } catch (e) {
      setInitialRoute("Login");
    }
  };

  if (initialRoute === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <MainNavigator initialRoute={initialRoute} />
    </NavigationContainer>
  );
}