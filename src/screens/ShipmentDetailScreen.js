import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert
} from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import PrimaryButton from "../components/PrimaryButton";
import { getShipmentById, updateShipmentStatus } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { COLORS, SPACING, RADIUS } from "../styles/theme";

const STATUS_OPTIONS = ["Dibuat", "Diproses", "Dikirim", "Selesai"];

export default function ShipmentDetailScreen({ route }) {
  const { id } = route.params;
  const { token } = useAuth();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getShipmentById(id, token);
      setShipment(data.shipment);
    } catch (err) {
      Alert.alert("Gagal", err.message);
    } finally {
      setLoading(false);
    }
  };

  const onUpdateStatus = async (status) => {
    try {
      setUpdating(true);
      const data = await updateShipmentStatus(id, status, token);
      setShipment(data.shipment);
      Alert.alert("Status diperbarui", `Status: ${status}`);
    } catch (err) {
      Alert.alert("Gagal", err.message);
    } finally {
      setUpdating(false);
    }
  };

  const onPrint = async () => {
    if (!shipment) return;
    try {
      const html = `
        <html>
          <body style="font-family: Arial, sans-serif; padding: 16px;">
            <h2>Resi Pengiriman</h2>
            <p><strong>No Resi:</strong> ${shipment.resi_number}</p>
            <p><strong>Status:</strong> ${shipment.status}</p>
            <hr/>
            <h3>Pengirim</h3>
            <p>${shipment.sender_name}</p>
            <p>${shipment.sender_phone}</p>
            <p>${shipment.sender_address}</p>
            <h3>Penerima</h3>
            <p>${shipment.receiver_name}</p>
            <p>${shipment.receiver_phone}</p>
            <p>${shipment.receiver_address}</p>
            <h3>Detail Paket</h3>
            <p><strong>Asal:</strong> ${shipment.origin}</p>
            <p><strong>Tujuan:</strong> ${shipment.destination}</p>
            <p><strong>Berat:</strong> ${shipment.weight_kg} kg</p>
            <p><strong>Isi:</strong> ${shipment.content}</p>
            <p><strong>Layanan:</strong> ${shipment.service}</p>
            <p><strong>Catatan:</strong> ${shipment.notes || "-"}</p>
          </body>
        </html>
      `;

      const file = await Print.printToFileAsync({ html });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri);
      } else {
        Alert.alert("Info", "Sharing tidak tersedia di perangkat ini.");
      }
    } catch (err) {
      Alert.alert("Gagal", err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading || !shipment) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          {loading ? "Memuat data..." : "Data tidak ditemukan"}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Detail Pengiriman</Text>
      <View style={styles.resiBox}>
        <Text style={styles.resiLabel}>No Resi</Text>
        <Text style={styles.resiValue}>{shipment.resi_number}</Text>
        <Text style={styles.resiStatus}>{shipment.status}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pengirim</Text>
        <Text style={styles.field}>{shipment.sender_name}</Text>
        <Text style={styles.field}>{shipment.sender_phone}</Text>
        <Text style={styles.field}>{shipment.sender_address}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Penerima</Text>
        <Text style={styles.field}>{shipment.receiver_name}</Text>
        <Text style={styles.field}>{shipment.receiver_phone}</Text>
        <Text style={styles.field}>{shipment.receiver_address}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detail Paket</Text>
        <Text style={styles.field}>Asal: {shipment.origin}</Text>
        <Text style={styles.field}>Tujuan: {shipment.destination}</Text>
        <Text style={styles.field}>Berat: {shipment.weight_kg} kg</Text>
        <Text style={styles.field}>Isi: {shipment.content}</Text>
        <Text style={styles.field}>Layanan: {shipment.service}</Text>
        <Text style={styles.field}>
          Catatan: {shipment.notes || "-"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Update Status</Text>
        <View style={styles.statusRow}>
          {STATUS_OPTIONS.map((status) => (
            <Pressable
              key={status}
              onPress={() => onUpdateStatus(status)}
              disabled={updating}
              style={[
                styles.statusButton,
                shipment.status === status && styles.statusActive
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  shipment.status === status && styles.statusActiveText
                ]}
              >
                {status}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <PrimaryButton title="Cetak / Unduh Resi" onPress={onPrint} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg
  },
  content: {
    padding: SPACING.l
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.m
  },
  resiBox: {
    backgroundColor: COLORS.white,
    padding: SPACING.m,
    borderRadius: RADIUS.l,
    marginBottom: SPACING.m
  },
  resiLabel: {
    color: COLORS.muted
  },
  resiValue: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
    color: COLORS.text
  },
  resiStatus: {
    marginTop: 8,
    color: COLORS.primary,
    fontWeight: "600"
  },
  section: {
    marginBottom: SPACING.m
  },
  sectionTitle: {
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.s
  },
  field: {
    color: COLORS.text,
    marginBottom: 4
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.s
  },
  statusButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 999,
    paddingHorizontal: SPACING.m,
    paddingVertical: 6
  },
  statusActive: {
    backgroundColor: COLORS.primary
  },
  statusText: {
    color: COLORS.primary,
    fontWeight: "600"
  },
  statusActiveText: {
    color: COLORS.white
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.bg
  },
  loadingText: {
    color: COLORS.muted
  }
});
