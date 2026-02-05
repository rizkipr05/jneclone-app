import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { listShipments } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { COLORS, SPACING, RADIUS } from "../styles/theme";

const STATUS_LABELS = ["Dibuat", "Diproses", "Dikirim", "Selesai"];

export default function HomeScreen() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await listShipments({ limit: 100 }, token);
        setItems(data.items || []);
      } catch (err) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const chartData = useMemo(() => {
    const counts = STATUS_LABELS.reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {});
    items.forEach((item) => {
      const key = STATUS_LABELS.includes(item.status) ? item.status : "Dibuat";
      counts[key] = (counts[key] || 0) + 1;
    });
    return STATUS_LABELS.map((label) => ({
      label,
      value: counts[label] || 0
    }));
  }, [items]);

  const maxValue =
    chartData.reduce((max, item) => Math.max(max, item.value), 0) || 1;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Grafik Pengiriman</Text>
          <Text style={styles.subtitle}>
            {loading ? "Memuat data..." : "Ringkasan status pengiriman"}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total</Text>
            <Text style={styles.statValue}>{items.length}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Selesai</Text>
            <Text style={styles.statValue}>
              {items.filter((i) => i.status === "Selesai").length}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Proses</Text>
            <Text style={styles.statValue}>
              {items.filter((i) => i.status !== "Selesai").length}
            </Text>
          </View>
        </View>

        <View style={styles.chartCard}>
          {chartData.map((item) => (
            <View key={item.label} style={styles.chartRow}>
              <Text style={styles.chartLabel}>{item.label}</Text>
              <View style={styles.chartBarWrap}>
                <View
                  style={[
                    styles.chartBar,
                    { width: `${(item.value / maxValue) * 100}%` }
                  ]}
                />
              </View>
              <Text style={styles.chartValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg
  },
  content: {
    padding: SPACING.l,
    paddingBottom: 120
  },
  header: {
    marginBottom: SPACING.m
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 6
  },
  subtitle: {
    marginTop: 6,
    color: COLORS.muted
  },
  chartCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.l,
    borderRadius: RADIUS.l,
    borderWidth: 1,
    borderColor: "#EEF1F6"
  },
  statsRow: {
    flexDirection: "row",
    gap: SPACING.s,
    marginBottom: SPACING.m
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SPACING.m,
    borderRadius: RADIUS.l,
    borderWidth: 1,
    borderColor: "#EEF1F6"
  },
  statLabel: {
    color: COLORS.muted,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.6
  },
  statValue: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.s
  },
  chartLabel: {
    width: 90,
    color: COLORS.text,
    fontWeight: "600"
  },
  chartBarWrap: {
    flex: 1,
    height: 10,
    backgroundColor: "#EEF1F6",
    borderRadius: 999,
    overflow: "hidden",
    marginHorizontal: SPACING.s
  },
  chartBar: {
    height: 10,
    backgroundColor: "#0E9F4B",
    borderRadius: 999
  },
  chartValue: {
    width: 24,
    textAlign: "right",
    color: COLORS.muted,
    fontWeight: "600"
  }
});
