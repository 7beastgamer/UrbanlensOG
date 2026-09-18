import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet
} from 'react-native';
import { resetPassword } from '../services/authService';

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');

    const handleReset = async () => {
        if (!email.trim()) return;
        try {
            await resetPassword(email.trim());
            alert('Password reset link sent.');
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}>Reset Password</Text>

            <TextInput
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />

            <TouchableOpacity style={styles.btn} onPress={handleReset}>
                <Text style={styles.btnText}>Send Reset Link</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.link}>Back to Login</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },

    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },

    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10
    },

    btn: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 10
    },

    btnText: { color: '#fff', textAlign: 'center' },

    link: { textAlign: 'center', marginTop: 10 }
});