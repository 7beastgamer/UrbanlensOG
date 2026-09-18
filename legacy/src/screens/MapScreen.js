import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from "react-native";
import { WebView } from "react-native-webview";
import { getIssues, subscribeToIssues } from "../services/issueService";

const DEFAULT_LOCATION = { lat: 12.9716, lng: 77.5946 };

export default function MapScreen() {
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState("all");
  const [location] = useState(DEFAULT_LOCATION);

  useEffect(() => {
    getIssues().then(setIssues).catch(console.error);
    const unsubscribe = subscribeToIssues(setIssues, console.error);

    return () => unsubscribe();
  }, []);

  const filteredIssues =
    filter === "all"
      ? issues
      : issues.filter(i => i.category === filter);

  const normalizedIssues = filteredIssues.filter(i => (
    Number.isFinite(Number(i.location?.lat)) && Number.isFinite(Number(i.location?.lng))
  )).map(i => ({
    lat: Number(i.location.lat) + (Math.random() - 0.5) * 0.001,
    lng: Number(i.location.lng) + (Math.random() - 0.5) * 0.001,
    category: i.category,
    description: i.description,
    severity: i.severity,
    reportCount: i.report_count,
  }));

  const buildHtml = (loc, issueList) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <style>
      html, body, #map { height: 100%; margin: 0; padding: 0; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script>
      var map = L.map('map').setView([${loc.lat}, ${loc.lng}], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      L.marker([${loc.lat}, ${loc.lng}]).addTo(map)
        .bindPopup("You are here");

      var issues = ${JSON.stringify(issueList)};

      issues.forEach(function(issue) {

        var color = "blue";

        if (issue.category === "pothole") color = "red";
        else if (issue.category === "garbage") color = "green";
        else if (issue.category === "traffic") color = "orange";
        else if (issue.category === "construction") color = "brown";
        else if (issue.category === "accident") color = "black";

        var marker = L.circleMarker([issue.lat, issue.lng], {
          color: color,
          fillColor: color,
          fillOpacity: 0.9,
          radius: 9
        }).addTo(map);

        marker.bindPopup(
          "<b>" + issue.category + "</b><br>" +
          issue.description + "<br>" +
          "Reports: " + issue.reportCount + "<br>" +
          "Severity: " + issue.severity
        );
      });
    </script>
  </body>
  </html>
  `;

  return (
    <View style={styles.container}>

      <ScrollView horizontal style={styles.filterBar}>
        {[
          { label: "All", value: "all" },
          { label: "🕳️", value: "pothole" },
          { label: "🗑️", value: "garbage" },
          { label: "🚗", value: "traffic" },
          { label: "🚧", value: "construction" },
          { label: "⚠️", value: "accident" },
        ].map(item => (
          <TouchableOpacity
            key={item.value}
            style={[
              styles.chip,
              filter === item.value && styles.activeChip
            ]}
            onPress={() => setFilter(item.value)}
          >
            <Text>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <WebView
        key={filter + JSON.stringify(normalizedIssues)}
        source={{ html: buildHtml(location, normalizedIssues) }}
        style={styles.map}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  filterBar: {
    position: "absolute",
    top: 40,
    zIndex: 10,
    paddingHorizontal: 10,
  },

  chip: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 20,
    marginRight: 8,
  },

  activeChip: {
    backgroundColor: "#007bff",
  },
});