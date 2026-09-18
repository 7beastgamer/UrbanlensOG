import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import { getCachedData, cacheData } from '../utils/cache';

export default function DashboardScreen() {
  const { signOut } = useContext(AuthContext);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // 1. Load from cache first for instant UI response
    const cached = await getCachedData('appData');
    if (cached) {
      setData(cached);
    } else {
      setLoading(true);
    }

    // 2. Fetch fresh data from backend
    try {
      const response = await apiClient.get('/appdata');
      setData(response.data);
      // 3. Update cache
      await cacheData('appData', response.data);
    } catch (error) {
      console.error('Failed to fetch data from backend', error);
      // Optional: Handle offline scenario or show toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Button title="Logout" onPress={signOut} color="red" />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text>{item.content}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={{ marginTop: 20, textAlign: 'center' }}>No data found.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: { padding: 15, backgroundColor: '#f9f9f9', marginBottom: 10, borderRadius: 5, elevation: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
});
