import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  Image
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
            {item.image_base64 ? (
              <Image
                source={{ uri: `data:image/jpeg;base64,${item.image_base64}` }}
                style={styles.thumb}
              />
            ) : (
              <View style={styles.thumbPlaceholder}>
                <Text style={styles.thumbText}>IMG</Text>
              </View>
            )}
            <View style={styles.listInfo}>
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
    alignItems: "center",
    gap: SPACING.s
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: "#EEF1F6"
  },
  thumbPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: "#EEF1F6",
    alignItems: "center",
    justifyContent: "center"
  },
  thumbText: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: "700"
  },
  listTitle: {
    fontWeight: "700",
    color: COLORS.text
  },
  listInfo: {
    flex: 1
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
  }
});
