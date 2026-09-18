import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { getUser, logout } from '../services/authService';

export default function ProfileScreen({ navigation }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const data = await getUser();
        setUser(data);
    };

    const handleLogout = async () => {
        await logout();
        navigation.replace("Login");
    };

    // 🔥 Get initials
    const getInitial = () => {
        if (user?.email) return user.email[0].toUpperCase();
        return "G"; // guest
    };

    return (
        <View style={styles.container}>

            {/* 🔥 HEADER */}
            <View style={styles.header}>
                <Text style={styles.title}>Profile</Text>
            </View>

            {/* 👤 AVATAR */}
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitial()}</Text>
            </View>

            {/* 📄 USER INFO */}
            <View style={styles.card}>
                <Text style={styles.label}>Account Type</Text>
                <Text style={styles.value}>{user?.type}</Text>

                {user?.email && (
                    <>
                        <Text style={styles.label}>Email</Text>
                        <Text style={styles.value}>{user.email}</Text>
                    </>
                )}
            </View>

            {/* 🚪 LOGOUT */}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fb',
        padding: 20,
    },

    header: {
        marginBottom: 20,
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },

    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#007bff',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 20,
    },

    avatarText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
    },

    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        elevation: 5,
        marginBottom: 30,
    },

    label: {
        color: '#666',
        marginTop: 10,
    },

    value: {
        fontSize: 16,
        fontWeight: '600',
    },

    logoutBtn: {
        backgroundColor: '#ff4d4d',
        padding: 15,
        borderRadius: 12,
    },

    logoutText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});