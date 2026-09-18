import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { colors, spacing } from "../theme";
import { updateIssue } from "../services/issueService";

export default function IssueDetailScreen({ route }) {
  const { issue } = route.params;
  const [status, setStatus] = useState(issue.status);

  const formatTime = (timestamp) => {
    if (!timestamp) return "just now";
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return "just now";
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;

    return `${Math.floor(diff / 86400)} day ago`;
  };

  const updateStatus = async (newStatus) => {
    try {
      await updateIssue(issue.id, { status: newStatus });

      setStatus(newStatus);
    } catch (e) {
      console.error("STATUS UPDATE ERROR:", e);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{issue.category?.toUpperCase()}</Text>

      <Text style={styles.label}>Description</Text>
      <Text style={styles.value}>{issue.description}</Text>

      <Text style={styles.label}>Severity</Text>
      <Text style={styles.value}>{issue.severity}</Text>

      <Text style={styles.label}>Reports</Text>
      <Text style={styles.value}>{issue.report_count}</Text>

      <Text style={styles.label}>Status</Text>
      <Text style={styles.value}>{status}</Text>

      {/* STATUS BUTTONS */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.btn, styles.open]}
          onPress={() => updateStatus("open")}
        >
          <Text style={styles.btnText}>Open</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.progress]}
          onPress={() => updateStatus("in_progress")}
        >
          <Text style={styles.btnText}>In Progress</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.resolved]}
          onPress={() => updateStatus("resolved")}
        >
          <Text style={styles.btnText}>Resolved</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Time</Text>
      <Text style={styles.value}>{formatTime(issue.created_at)}</Text>

      <Text style={styles.label}>Location</Text>
      <Text style={styles.value}>
        {issue.location?.lat}, {issue.location?.lng}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: spacing.md,
    color: colors.text,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: spacing.md,
    color: colors.textSecondary,
  },

  value: {
    fontSize: 16,
    marginTop: 4,
    color: colors.text,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },

  btn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },

  open: {
    backgroundColor: "#ccc",
  },

  progress: {
    backgroundColor: "#f0ad4e",
  },

  resolved: {
    backgroundColor: "#5cb85c",
  },

  btnText: {
    color: "#fff",
    fontWeight: "700",
  },
});