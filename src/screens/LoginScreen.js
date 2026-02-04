import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator
} from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import { login } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { COLORS, RADIUS, SPACING } from "../styles/theme";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const onSubmit = async () => {
    if (!username || !password) {
      Alert.alert("Validasi", "Username dan password wajib diisi.");
      return;
    }

    try {
      setLoading(true);
      const data = await login({ username, password });
      signIn(data.user, data.token);
    } catch (err) {
      Alert.alert("Login gagal", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Admin</Text>
      <Text style={styles.subtitle}>Masuk untuk kelola pengiriman</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Masukkan username"
          autoCapitalize="none"
          style={styles.input}
        />

        <Text style={[styles.label, styles.labelSpacing]}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Masukkan password"
          secureTextEntry
          style={styles.input}
        />

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={COLORS.primary} />
          </View>
        ) : (
          <PrimaryButton title="Masuk" onPress={onSubmit} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: "center",
    padding: SPACING.l
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text
  },
  subtitle: {
    marginTop: 6,
    marginBottom: SPACING.l,
    color: COLORS.muted
  },
  card: {
    backgroundColor: COLORS.white,
    padding: SPACING.l,
    borderRadius: RADIUS.l,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2
  },
  label: {
    color: COLORS.text,
    marginBottom: 6
  },
  labelSpacing: {
    marginTop: SPACING.m
  },
  input: {
    borderWidth: 1,
    borderColor: "#D7DBE3",
    borderRadius: RADIUS.m,
    paddingHorizontal: SPACING.m,
    paddingVertical: 12,
    backgroundColor: "#F9FAFB"
  },
  loadingWrap: {
    paddingVertical: SPACING.m,
    alignItems: "center"
  }
});
