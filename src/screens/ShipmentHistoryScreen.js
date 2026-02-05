import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { listShipments } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { COLORS, SPACING, RADIUS } from "../styles/theme";

export default function ShipmentHistoryScreen({ navigation }) {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const activeTab = "riwayat";

  const load = async (keyword = "") => {
    try {
      setLoading(true);
      const data = await listShipments(
        keyword ? { search: keyword } : {},
        token
      );
      setItems(data.items || []);
    } catch (err) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Riwayat Pengiriman</Text>
      <View style={styles.searchRow}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Cari resi / nama"
          style={styles.searchInput}
        />
        <Pressable
          onPress={() => load(search)}
          style={styles.searchButton}
          disabled={loading}
        >
          <Text style={styles.searchText}>
            {loading ? "..." : "Cari"}
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {loading ? "Memuat..." : "Data belum tersedia."}
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              navigation.navigate("ShipmentDetail", { id: item.id })
            }
            style={styles.listItem}
          >
            <View>
              <Text style={styles.listTitle}>{item.resi_number}</Text>
              <Text style={styles.listSubtitle}>
                {item.sender_name} → {item.receiver_name}
              </Text>
              <Text style={styles.listMeta}>
                {item.origin} → {item.destination}
              </Text>
            </View>
            <Text style={styles.status}>{item.status}</Text>
          </Pressable>
        )}
      />

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
          style={[
            styles.navItem,
            activeTab === "riwayat" && styles.navItemActive
          ]}
        >
          {activeTab === "riwayat" ? <View style={styles.navIndicator} /> : null}
          <View style={styles.navIcon}>
            <Text style={styles.navIconText}>R</Text>
          </View>
          <Text style={styles.navText}>Lihat{"\n"}Riwayat</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("Profile")}
          style={styles.navItem}
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
    padding: SPACING.l
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.m
  },
  searchRow: {
    flexDirection: "row",
    gap: SPACING.s,
    marginBottom: SPACING.m
  },
  listContent: {
    paddingBottom: 140
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D7DBE3",
    borderRadius: RADIUS.m,
    paddingHorizontal: SPACING.m,
    paddingVertical: 10,
    backgroundColor: "#F9FAFB"
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.m,
    borderRadius: RADIUS.m,
    justifyContent: "center"
  },
  searchText: {
    color: COLORS.white,
    fontWeight: "600"
  },
  listItem: {
    backgroundColor: COLORS.white,
    padding: SPACING.m,
    borderRadius: RADIUS.m,
    marginBottom: SPACING.s,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  listTitle: {
    fontWeight: "700",
    color: COLORS.text
  },
  listSubtitle: {
    color: COLORS.muted,
    marginTop: 4
  },
  listMeta: {
    color: COLORS.muted,
    marginTop: 4,
    fontSize: 12
  },
  status: {
    color: COLORS.primary,
    fontWeight: "600"
  },
  emptyText: {
    color: COLORS.muted
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
