import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
} from 'react-native';
import { colors, spacing } from '../theme';
import Card from '../components/Card';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getIssues, subscribeToIssues } from '../services/issueService';

export default function HomeScreen({ navigation }) {
    const [issues, setIssues] = useState([]);

    useEffect(() => {
        getIssues().then(setIssues).catch(console.error);
        const unsubscribe = subscribeToIssues(setIssues, console.error);

        return () => unsubscribe();
    }, []);

    const formatTime = (timestamp) => {
        try {
            if (!timestamp) return "just now";
            const date = new Date(timestamp);
            if (Number.isNaN(date.getTime())) return "just now";
            const now = new Date();

            const diff = Math.floor((now - date) / 1000);

            if (diff < 60) return "just now";
            if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
            if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;

            return `${Math.floor(diff / 86400)} day ago`;
        } catch {
            return "just now";
        }
    };

    const stats = [
        { label: "Potholes", value: issues.filter(i => i.category === "pothole").length, icon: "report-problem" },
        { label: "Garbage", value: issues.filter(i => i.category === "garbage").length, icon: "delete" },
        { label: "Traffic", value: issues.filter(i => i.category === "traffic").length, icon: "traffic" },
        { label: "Construction", value: issues.filter(i => i.category === "construction").length, icon: "engineering" },
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.title}>UrbanLens</Text>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => navigation.navigate("Profile")}
                >
                    <Icon name="person" size={22} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* OVERVIEW */}
                <Text style={styles.sectionTitle}>Overview</Text>

                <View style={styles.statsGrid}>
                    {stats.map((item, index) => (
                        <Card key={index} style={styles.statCard}>
                            <View style={styles.statIconContainer}>
                                <Icon name={item.icon} size={20} color={colors.primary} />
                            </View>
                            <Text style={styles.statNumber}>{item.value}</Text>
                            <Text style={styles.statLabel}>{item.label}</Text>
                        </Card>
                    ))}
                </View>

                {/* RECENT REPORTS */}
                <Text style={styles.sectionTitle}>Recent Reports</Text>

                {issues.length === 0 ? (
                    <Text style={styles.emptyText}>No reports yet</Text>
                ) : (
                    issues.slice(0, 3).map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.issueItem}
                            onPress={() => navigation.navigate("IssueDetail", { issue: item })}
                        >
                            <Text style={styles.issueTitle}>
                                {item.category?.toUpperCase() || "ISSUE"}
                            </Text>

                            <Text style={styles.issueDesc}>
                                {item.description || "No description"}
                            </Text>

                            <Text style={styles.issueTime}>
                                {formatTime(item.created_at)}
                            </Text>
                        </TouchableOpacity>
                    ))
                )}

                {/* QUICK ACTIONS */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>

                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate("Map")}
                >
                    <Card style={styles.actionCard}>
                        <View style={styles.actionIconContainer}>
                            <Icon name="map" size={26} color={colors.primary} />
                        </View>
                        <View style={styles.actionTextContainer}>
                            <Text style={styles.actionTitle}>Explore Map</Text>
                            <Text style={styles.actionDesc}>View reported issues in your area</Text>
                        </View>
                        <Icon name="chevron-right" size={22} color={colors.textSecondary} />
                    </Card>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate("Report")}
                >
                    <Card style={styles.actionCard}>
                        <View style={styles.actionIconContainer}>
                            <Icon name="add-a-photo" size={26} color={colors.primary} />
                        </View>
                        <View style={styles.actionTextContainer}>
                            <Text style={styles.actionTitle}>Report Issue</Text>
                            <Text style={styles.actionDesc}>Submit a new report with photos</Text>
                        </View>
                        <Icon name="chevron-right" size={22} color={colors.textSecondary} />
                    </Card>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.sm,
    },

    title: {
        fontSize: 26,
        fontWeight: '800',
        color: colors.text,
    },

    profileButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },

    scrollContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
        marginBottom: spacing.sm,
        marginTop: spacing.sm,
    },

    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },

    statCard: {
        width: '48%',
        alignItems: 'center',
        paddingVertical: spacing.md,
        marginBottom: spacing.sm,
    },

    statIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },

    statNumber: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.text,
    },

    statLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.textSecondary,
        textTransform: 'uppercase',
    },

    issueItem: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
        elevation: 2,
    },

    issueTitle: {
        fontWeight: '700',
        fontSize: 14,
        color: colors.text,
    },

    issueDesc: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },

    issueTime: {
        fontSize: 11,
        color: '#888',
        marginTop: 4,
    },

    emptyText: {
        color: colors.textSecondary,
        fontSize: 13,
        marginBottom: spacing.md,
    },

    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        marginBottom: spacing.sm,
    },

    actionIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 14,
        backgroundColor: colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },

    actionTextContainer: {
        flex: 1,
        marginLeft: spacing.md,
    },

    actionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
    },

    actionDesc: {
        fontSize: 13,
        color: colors.textSecondary,
        marginTop: 2,
    },
});