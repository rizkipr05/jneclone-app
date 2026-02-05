import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useAuth } from "../context/AuthContext";
import { COLORS, SPACING, RADIUS } from "../styles/theme";

export default function ProfileScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const name = user?.name || "Administrator";
  const role = user?.role || "Administrator";
  const initial = name.trim().charAt(0).toUpperCase() || "A";
  const activeTab = "profil";

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

      <View style={styles.navBar}>
        <Pressable
          onPress={() => navigation.navigate("Home")}
          style={styles.navItem}
        >
          {activeTab === "home" ? <View style={styles.navIndicator} /> : null}
          <View style={styles.navIcon}>
            <Text style={styles.navIconText}>H</Text>
          </View>
          <Text style={styles.navText}>Home</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("ShipmentForm")}
          style={styles.navItem}
        >
          {activeTab === "input" ? <View style={styles.navIndicator} /> : null}
          <View style={styles.navIcon}>
            <Text style={styles.navIconText}>I</Text>
          </View>
          <Text style={styles.navText}>Input{"\n"}Pengiriman</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("ShipmentHistory")}
          style={styles.navItem}
        >
          {activeTab === "riwayat" ? <View style={styles.navIndicator} /> : null}
          <View style={styles.navIcon}>
            <Text style={styles.navIconText}>R</Text>
          </View>
          <Text style={styles.navText}>Lihat{"\n"}Riwayat</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("Profile")}
          style={[styles.navItem, activeTab === "profil" && styles.navItemActive]}
        >
          {activeTab === "profil" ? <View style={styles.navIndicator} /> : null}
          <View style={styles.navIcon}>
            <Text style={styles.navIconText}>P</Text>
          </View>
          <Text style={styles.navText}>Profil</Text>
        </Pressable>
      </View>
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
  },
  navBar: {
    position: "absolute",
    left: SPACING.l,
    right: SPACING.l,
    bottom: SPACING.l,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
    shadowColor: "#0B1220",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
    borderRadius: 14
  },
  navItemActive: {
    backgroundColor: "#F0F6FF"
  },
  navIndicator: {
    position: "absolute",
    top: 4,
    width: 20,
    height: 3,
    borderRadius: 999,
    backgroundColor: "#0E9F4B"
  },
  navIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E9F7EF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4
  },
  navIconText: {
    color: "#0E9F4B",
    fontWeight: "700",
    fontSize: 12
  },
  navText: {
    fontSize: 10,
    color: COLORS.text,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 12
  }
});
