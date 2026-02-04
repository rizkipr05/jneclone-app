import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import { listShipments } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { COLORS, SPACING, RADIUS } from "../styles/theme";

export default function HomeScreen({ navigation }) {
  const { user, token, signOut } = useAuth();
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadRecent = async () => {
    try {
      setLoading(true);
      const data = await listShipments({ limit: 5 }, token);
      setRecent(data.items || []);
    } catch (err) {
      // ignore for now
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecent();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.bgCircle} />
      <View style={styles.bgCircleSmall} />

      <View style={styles.header}>
        <Text style={styles.kicker}>Dashboard Pengiriman</Text>
        <Text style={styles.title}>Selamat Datang</Text>
        <Text style={styles.subtitle}>{user?.name || "Admin"}</Text>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroRow}>
          <Text style={styles.heroLabel}>Ringkasan</Text>
          <Pressable onPress={loadRecent} disabled={loading}>
            <Text style={styles.linkText}>
              {loading ? "Memuat..." : "Refresh"}
            </Text>
          </Pressable>
        </View>
        <Text style={styles.heroTitle}>Kelola resi dengan cepat</Text>
        <Text style={styles.heroText}>
          Input data, validasi, hingga update status dalam satu layar.
        </Text>

        <View style={styles.heroActions}>
          <PrimaryButton
            title="Input Pengiriman"
            onPress={() => navigation.navigate("ShipmentForm")}
          />
          <Pressable
            onPress={() => navigation.navigate("ShipmentHistory")}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryText}>Lihat Riwayat</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pengiriman Terbaru</Text>
        <FlatList
          data={recent}
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>Belum ada data pengiriman.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                navigation.navigate("ShipmentDetail", { id: item.id })
              }
              style={styles.listItem}
            >
              <View style={styles.listMeta}>
                <Text style={styles.listTitle}>{item.resi_number}</Text>
                <Text style={styles.listSubtitle}>
                  {item.sender_name} → {item.receiver_name}
                </Text>
              </View>
              <View style={styles.statusPill}>
                <Text style={styles.statusBadge}>{item.status}</Text>
              </View>
            </Pressable>
          )}
        />
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
    padding: SPACING.l
  },
  bgCircle: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "#E7F0FF",
    top: -140,
    right: -80,
    opacity: 0.9
  },
  bgCircleSmall: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#F6F1E8",
    bottom: 40,
    left: -60,
    opacity: 0.8
  },
  header: {
    marginBottom: SPACING.m
  },
  kicker: {
    color: COLORS.muted,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontSize: 12
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 6
  },
  subtitle: {
    marginTop: 6,
    color: COLORS.muted
  },
  heroCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.l,
    borderRadius: RADIUS.l,
    shadowColor: "#0B1220",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3
  },
  heroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  heroLabel: {
    fontWeight: "700",
    color: COLORS.primary
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: SPACING.s,
    color: COLORS.text
  },
  heroText: {
    color: COLORS.muted,
    marginTop: 6,
    lineHeight: 20
  },
  heroActions: {
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
  section: {
    marginTop: SPACING.l
  },
  sectionTitle: {
    fontWeight: "700",
    color: COLORS.text
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: "600"
  },
  listItem: {
    backgroundColor: COLORS.white,
    padding: SPACING.m,
    borderRadius: RADIUS.m,
    marginBottom: SPACING.s,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEF1F6"
  },
  listMeta: {
    flex: 1,
    paddingRight: SPACING.s
  },
  listTitle: {
    fontWeight: "700",
    color: COLORS.text
  },
  listSubtitle: {
    color: COLORS.muted,
    marginTop: 4
  },
  statusPill: {
    backgroundColor: "#EAF1FF",
    paddingHorizontal: SPACING.s,
    paddingVertical: 6,
    borderRadius: 999
  },
  statusBadge: {
    color: COLORS.primary,
    fontWeight: "600"
  },
  emptyCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.m,
    borderRadius: RADIUS.m,
    borderWidth: 1,
    borderColor: "#EEF1F6"
  },
  emptyText: {
    color: COLORS.muted,
    marginTop: SPACING.s
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
