import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Image
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
      const createdDate = shipment.created_at
        ? new Date(shipment.created_at).toLocaleString("id-ID")
        : "-";
      const html = `
        <html>
          <head>
            <style>
              * { box-sizing: border-box; }
              body { font-family: Arial, sans-serif; padding: 16px; color: #111827; }
              .sheet { border: 1px solid #111827; padding: 12px; }
              .row { display: flex; gap: 12px; }
              .logo {
                width: 64px; height: 64px; border-radius: 32px;
                border: 2px solid #0E9F4B; display: flex; align-items: center;
                justify-content: center; font-weight: 700; color: #0E9F4B;
              }
              .barcode {
                width: 220px; height: 60px; border: 1px solid #111827;
                background: repeating-linear-gradient(
                  90deg,
                  #111827 0px,
                  #111827 2px,
                  #ffffff 2px,
                  #ffffff 4px
                );
              }
              .barcode-text { font-size: 12px; text-align: center; margin-top: 4px; }
              table { width: 100%; border-collapse: collapse; font-size: 12px; }
              td, th { border: 1px solid #111827; padding: 6px; vertical-align: top; }
              .label { color: #6B7280; font-size: 11px; text-transform: uppercase; letter-spacing: .5px; }
              .title { font-weight: 700; font-size: 14px; }
              .section-title { font-weight: 700; background: #F3F4F6; }
            </style>
          </head>
          <body>
            <div class="sheet">
              <div class="row" style="justify-content: space-between; margin-bottom: 10px;">
                <div class="row">
                  <div class="logo">JNE</div>
                  <div>
                    <div class="title">JNE Clone</div>
                    <div class="label">CONSIGNMENT NOTE</div>
                    <div style="font-size: 11px;">Tanggal: ${createdDate}</div>
                  </div>
                </div>
                <div>
                  <div class="barcode"></div>
                  <div class="barcode-text">${shipment.resi_number}</div>
                </div>
              </div>

              <table>
                <tr>
                  <th class="section-title" colspan="2">Data Pengirim</th>
                  <th class="section-title" colspan="2">Data Penerima</th>
                </tr>
                <tr>
                  <td class="label">Nama</td>
                  <td>${shipment.sender_name}</td>
                  <td class="label">Nama</td>
                  <td>${shipment.receiver_name}</td>
                </tr>
                <tr>
                  <td class="label">Telepon</td>
                  <td>${shipment.sender_phone}</td>
                  <td class="label">Telepon</td>
                  <td>${shipment.receiver_phone}</td>
                </tr>
                <tr>
                  <td class="label">Alamat</td>
                  <td>${shipment.sender_address}</td>
                  <td class="label">Alamat</td>
                  <td>${shipment.receiver_address}</td>
                </tr>
                <tr>
                  <th class="section-title" colspan="4">Detail Paket</th>
                </tr>
                <tr>
                  <td class="label">Asal</td>
                  <td>${shipment.origin}</td>
                  <td class="label">Tujuan</td>
                  <td>${shipment.destination}</td>
                </tr>
                <tr>
                  <td class="label">Berat</td>
                  <td>${shipment.weight_kg} kg</td>
                  <td class="label">Layanan</td>
                  <td>${shipment.service}</td>
                </tr>
                <tr>
                  <td class="label">Isi Paket</td>
                  <td>${shipment.content}</td>
                  <td class="label">Status</td>
                  <td>${shipment.status}</td>
                </tr>
                <tr>
                  <td class="label">Catatan</td>
                  <td colspan="3">${shipment.notes || "-"}</td>
                </tr>
              </table>
            </div>
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
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Detail Pengiriman</Text>
      <View style={styles.resiBox}>
        <Text style={styles.resiLabel}>No Resi</Text>
        <Text style={styles.resiValue}>{shipment.resi_number}</Text>
        <Text style={styles.resiStatus}>{shipment.status}</Text>
      </View>

      {shipment.image_base64 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Foto Pengiriman</Text>
          <Image
            source={{ uri: `data:image/jpeg;base64,${shipment.image_base64}` }}
            style={styles.photo}
          />
        </View>
      ) : null}

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
    paddingBottom: 140
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
  photo: {
    width: "100%",
    height: 220,
    borderRadius: RADIUS.m,
    backgroundColor: "#EEF1F6"
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
