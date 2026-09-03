import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

import { signIn, signInAsGuest } from '../services/authService';
import { colors, spacing } from '../theme';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter email and password");
            return;
        }

        try {
            setLoading(true);
            await signIn(email.trim(), password);
            navigation.replace("Main");
        } catch (error) {
            Alert.alert("Sign in failed", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGuest = async () => {
        try {
            setLoading(true);
            await signInAsGuest();
            navigation.replace("Main");
        } catch (error) {
            Alert.alert("Guest access unavailable", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <Text style={styles.title}>UrbanLens</Text>
                    <Text style={styles.subtitle}>Modern Civic Utility</Text>
                </View>

                <Card style={styles.loginCard}>
                    <Text style={styles.cardTitle}>Sign In</Text>
                    <Text style={styles.cardSubtitle}>Enter your details to continue</Text>

                    <Input
                        placeholder="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Input
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <Button
                        title={loading ? "Signing in..." : "Sign In"}
                        onPress={handleLogin}
                        style={styles.loginBtn}
                    />

                    <TouchableOpacity
                        style={styles.forgotLink}
                        onPress={() => navigation.navigate("Forgot")}
                    >
                        <Text style={styles.linkText}>Forgot Password?</Text>
                    </TouchableOpacity>
                </Card>

                <View style={styles.footer}>
                    <Button
                        title="Continue as Guest"
                        onPress={handleGuest}
                        style={styles.guestBtn}
                        textStyle={styles.guestBtnText}
                    />

                    <View style={styles.signupContainer}>
                        <Text style={styles.noAccountText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                            <Text style={styles.signupLink}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: spacing.lg,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xl * 1.5,
    },
    title: {
        fontSize: 48,
        fontWeight: '900',
        color: colors.text,
        letterSpacing: -1.5,
    },
    subtitle: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '700',
        letterSpacing: 3,
        textTransform: 'uppercase',
        marginTop: 4,
    },
    loginCard: {
        padding: spacing.xl,
        borderRadius: 24,
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 15,
        color: colors.textSecondary,
        marginBottom: spacing.lg,
    },
    loginBtn: {
        marginTop: spacing.md,
    },
    forgotLink: {
        alignItems: 'center',
        marginTop: spacing.lg,
    },
    linkText: {
        color: colors.textSecondary,
        fontWeight: '600',
        fontSize: 14,
    },
    footer: {
        marginTop: spacing.xl,
        paddingHorizontal: spacing.md,
    },
    guestBtn: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary,
        elevation: 0,
        shadowOpacity: 0,
    },
    guestBtnText: {
        color: colors.primary,
        fontWeight: '700',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: spacing.xl,
    },
    noAccountText: {
        color: colors.textSecondary,
        fontSize: 15,
        fontWeight: '500',
    },
    signupLink: {
        color: colors.primary,
        fontWeight: '700',
        fontSize: 15,
    },
});
