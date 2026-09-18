import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  PermissionsAndroid,
  Platform,
} from "react-native";

import Icon from "react-native-vector-icons/MaterialIcons";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import Geolocation from "@react-native-community/geolocation";

import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";
import { colors, spacing } from "../theme";
import { reportIssue } from "../services/issueService";
import { getUser } from "../services/authService";

const categories = [
  { id: "pothole", label: "Pothole", icon: "report-problem" },
  { id: "garbage", label: "Garbage", icon: "delete" },
  { id: "traffic", label: "Traffic", icon: "traffic" },
  { id: "accident", label: "Accident", icon: "warning" },
  { id: "construction", label: "Construction", icon: "construction" },
];

const getSeverity = (category, description) => {
  const text = description.toLowerCase();

  if (category === "accident") return "high";
  if (text.includes("huge") || text.includes("very") || text.includes("danger"))
    return "high";
  if (category === "traffic") return "medium";

  return "low";
};

export default function ReportScreen({ navigation }) {
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImagePick = () => {
    Alert.alert("Select Image", "Choose source", [
      {
        text: "Camera",
        onPress: () => {
          launchCamera({ mediaType: "photo", quality: 0.8 }, (res) => {
            if (res.assets?.length) {
              setImage(res.assets[0].uri);
            }
          });
        },
      },
      {
        text: "Gallery",
        onPress: () => {
          launchImageLibrary({ mediaType: "photo", quality: 0.8 }, (res) => {
            if (res.assets?.length) {
              setImage(res.assets[0].uri);
            }
          });
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const getLocation = async () => {
    return new Promise(async (resolve) => {
      try {
        if (Platform.OS === "android") {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );

          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.warn("Location permission denied; using default location.");
            resolve({ lat: 12.9716, lng: 77.5946 });
            return;
          }
        }

        Geolocation.getCurrentPosition(
          (pos) => {
            resolve({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
          },
          (error) => {
            console.warn("Unable to determine device location; using default location.", error);
            resolve({ lat: 12.9716, lng: 77.5946 });
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } catch (error) {
        console.warn("Location lookup failed; using default location.", error);
        resolve({ lat: 12.9716, lng: 77.5946 });
      }
    });
  };

  const handleSubmit = async () => {
    if (!description || !selectedCategory) {
      Alert.alert("Error", "Fill all fields");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);

      const loc = await getLocation();
      const severity = getSeverity(selectedCategory, description);

      const user = await getUser();
      const result = await reportIssue({
        category: selectedCategory,
        description,
        image: image || null,
        location: loc,
        severity,
        user_id: user?.id,
      });

      Alert.alert(
        result?.report_count > 1 ? "Updated" : "Success",
        result?.report_count > 1 ? "Existing issue reinforced" : "New issue created"
      );

      setDescription("");
      setSelectedCategory(null);
      setImage(null);

      navigation.navigate("Home");

    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>Report Issue</Text>

        <Card>
          <TouchableOpacity style={styles.imageBox} onPress={handleImagePick}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <View style={styles.placeholder}>
                <Icon name="camera-alt" size={30} color={colors.primary} />
                <Text>Upload Photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </Card>

        <Card>
          <Text style={styles.section}>Category</Text>
          <View style={styles.grid}>
            {categories.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.cat,
                  selectedCategory === item.id && styles.catSelected,
                ]}
                onPress={() => setSelectedCategory(item.id)}
              >
                <Icon name={item.icon} size={20} />
                <Text>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card>
          <Text style={styles.section}>Description</Text>
          <Input
            placeholder="Describe issue"
            value={description}
            onChangeText={setDescription}
          />
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={loading ? "Submitting..." : "Submit Report"}
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md },
  header: { fontSize: 26, fontWeight: "bold", marginBottom: 10 },
  section: { fontWeight: "bold", marginBottom: 10 },

  imageBox: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
  },

  placeholder: { alignItems: "center" },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  cat: {
    width: "48%",
    padding: 10,
    margin: "1%",
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
  },

  catSelected: {
    borderColor: colors.primary,
    backgroundColor: "#eee",
  },

  footer: {
    padding: 10,
  },
});