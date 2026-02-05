import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useAuth } from "../context/AuthContext";
import { COLORS, SPACING, RADIUS } from "../styles/theme";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const name = user?.name || "Administrator";
  const role = user?.role || "Administrator";
  const initial = name.trim().charAt(0).toUpperCase() || "A";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View style={styles.meta}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.role}>{role}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email || "-"}</Text>

        <Text style={styles.label}>No. Telepon</Text>
        <Text style={styles.value}>{user?.phone || "-"}</Text>
      </View>

      <Pressable onPress={signOut} style={styles.logout}>
        <Text style={styles.logoutText}>Keluar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    padding: SPACING.l,
    paddingBottom: 140
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.l
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#0E9F4B",
    alignItems: "center",
    justifyContent: "center"
  },
  avatarText: {
    color: "#F8FFF8",
    fontSize: 24,
    fontWeight: "700"
  },
  meta: {
    marginLeft: SPACING.m
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text
  },
  role: {
    color: COLORS.muted,
    marginTop: 4
  },
  card: {
    backgroundColor: COLORS.white,
    padding: SPACING.l,
    borderRadius: RADIUS.l,
    borderWidth: 1,
    borderColor: "#EEF1F6"
  },
  label: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: SPACING.s,
    textTransform: "uppercase",
    letterSpacing: 0.8
  },
  value: {
    color: COLORS.text,
    fontWeight: "600",
    marginTop: 6
  },
  logout: {
    marginTop: SPACING.l,
    alignItems: "center"
  },
  logoutText: {
    color: COLORS.danger,
    fontWeight: "600"
  }
});
