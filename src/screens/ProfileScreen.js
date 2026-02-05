import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, Alert } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import { useAuth } from "../context/AuthContext";
import { COLORS, SPACING, RADIUS } from "../styles/theme";

export default function ProfileScreen() {
  const { user, signOut, updateUser } = useAuth();
  const name = user?.name || "Administrator";
  const role = user?.role || "Administrator";
  const initial = name.trim().charAt(0).toUpperCase() || "A";
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || ""
  });

  const startEdit = () => {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || ""
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const saveEdit = () => {
    updateUser({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim()
    });
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View style={styles.meta}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.role}>{role}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionTitle}>Profil</Text>
          {!isEditing ? (
            <Pressable onPress={startEdit} style={styles.linkButton}>
              <Text style={styles.linkText}>Edit</Text>
            </Pressable>
          ) : null}
        </View>

        <Text style={styles.label}>Nama</Text>
        {isEditing ? (
          <TextInput
            value={form.name}
            onChangeText={(value) => setForm((prev) => ({ ...prev, name: value }))}
            style={styles.input}
            placeholder="Nama"
          />
        ) : (
          <Text style={styles.value}>{user?.name || "-"}</Text>
        )}

        <Text style={styles.label}>Email</Text>
        {isEditing ? (
          <TextInput
            value={form.email}
            onChangeText={(value) => setForm((prev) => ({ ...prev, email: value }))}
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
          />
        ) : (
          <Text style={styles.value}>{user?.email || "-"}</Text>
        )}

        <Text style={styles.label}>No. Telepon</Text>
        {isEditing ? (
          <TextInput
            value={form.phone}
            onChangeText={(value) => setForm((prev) => ({ ...prev, phone: value }))}
            style={styles.input}
            placeholder="No. Telepon"
            keyboardType="phone-pad"
          />
        ) : (
          <Text style={styles.value}>{user?.phone || "-"}</Text>
        )}

        {isEditing ? (
          <View style={styles.editActions}>
            <Pressable onPress={cancelEdit} style={styles.secondaryButton}>
              <Text style={styles.secondaryText}>Batal</Text>
            </Pressable>
            <PrimaryButton title="Simpan" onPress={saveEdit} />
          </View>
        ) : null}
      </View>

      <Pressable
        onPress={() =>
          Alert.alert("Keluar", "Yakin ingin keluar?", [
            { text: "Batal", style: "cancel" },
            { text: "Ya", style: "destructive", onPress: signOut }
          ])
        }
        style={styles.logout}
      >
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
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.l,
    padding: SPACING.m,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.l,
    borderWidth: 1,
    borderColor: "#EEF1F6"
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E9F7EF",
    alignItems: "center",
    justifyContent: "center"
  },
  avatarText: {
    color: "#0E9F4B",
    fontSize: 22,
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.s
  },
  sectionTitle: {
    fontWeight: "700",
    color: COLORS.text
  },
  linkButton: {
    paddingVertical: 4,
    paddingHorizontal: 8
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: "600"
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
  input: {
    borderWidth: 1,
    borderColor: "#D7DBE3",
    borderRadius: RADIUS.m,
    paddingHorizontal: SPACING.m,
    paddingVertical: 12,
    backgroundColor: "#F9FAFB",
    marginTop: 6
  },
  editActions: {
    marginTop: SPACING.m,
    gap: SPACING.s
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: SPACING.m,
    borderRadius: RADIUS.l,
    alignItems: "center"
  },
  secondaryText: {
    color: COLORS.primary,
    fontWeight: "600"
  },
  logout: {
    marginTop: SPACING.l,
    alignItems: "center"
  },
  logoutText: {
    color: COLORS.danger,
    fontWeight: "700",
    letterSpacing: 0.3
  }
});
