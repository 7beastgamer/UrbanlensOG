import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';

import { signUp } from '../services/authService';

export default function SignupScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }

        try {
            const data = await signUp(email.trim(), password);
            if (data.session) {
                navigation.replace("Main");
            } else {
                Alert.alert("Check your email", "Confirm your email before signing in.");
                navigation.goBack();
            }
        } catch (error) {
            Alert.alert("Sign up failed", error.message);
        }
    };

    return (
        <View style={styles.container}>

            {/* 🔥 TITLE */}
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join UrbanLens</Text>

            {/* 🔥 INPUTS */}
            <TextInput
                placeholder="Email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
            />

            {/* 🔥 SIGNUP */}
            <TouchableOpacity style={styles.btn} onPress={handleSignup}>
                <Text style={styles.btnText}>Sign Up</Text>
            </TouchableOpacity>

            {/* 🔗 BACK */}
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.link}>Back to Login</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f7fb',
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    subtitle: {
        textAlign: 'center',
        marginBottom: 30,
        color: '#666',
    },

    input: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ddd',   // 🔥 ADD BORDER
        color: '#000',         // 🔥 ENSURE TEXT VISIBLE
    },
    btn: {
        backgroundColor: '#007bff',
        padding: 16,
        borderRadius: 12,
        marginTop: 10,
    },

    btnText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },

    link: {
        textAlign: 'center',
        marginTop: 15,
        color: '#007bff',
    },
});