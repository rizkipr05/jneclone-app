import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert
} from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import { createShipment } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { COLORS, SPACING, RADIUS } from "../styles/theme";

const initialState = {
  sender_name: "",
  sender_phone: "",
  sender_address: "",
  receiver_name: "",
  receiver_phone: "",
  receiver_address: "",
  origin: "",
  destination: "",
  weight_kg: "",
  content: "",
  service: "REG",
  notes: ""
};

export default function ShipmentFormScreen({ navigation }) {
  const { token } = useAuth();
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const required = [
      "sender_name",
      "sender_phone",
      "sender_address",
      "receiver_name",
      "receiver_phone",
      "receiver_address",
      "origin",
      "destination",
      "weight_kg",
      "content"
    ];
    for (const key of required) {
      if (!String(form[key]).trim()) {
        return `Field ${key.replace("_", " ")} wajib diisi.`;
      }
    }
    const weight = Number(form.weight_kg);
    if (Number.isNaN(weight) || weight <= 0) {
      return "Berat harus berupa angka dan lebih dari 0.";
    }
    return null;
  };

  const onSubmit = async () => {
    const error = validate();
    if (error) {
      Alert.alert("Validasi", error);
      return;
    }

    try {
      setError("");
      setLoading(true);
      const payload = {
        ...form,
        weight_kg: Number(form.weight_kg)
      };
      const data = await createShipment(payload, token);
      Alert.alert("Berhasil", "Data pengiriman tersimpan.");
      setForm(initialState);
      navigation.navigate("ShipmentDetail", { id: data.shipment.id });
    } catch (err) {
      setError(err.message || "Gagal menyimpan data.");
      console.error("Create shipment error:", err);
      Alert.alert("Gagal", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Input Data Pengiriman</Text>

      <Text style={styles.sectionTitle}>Pengirim</Text>
      <TextInput
        style={styles.input}
        placeholder="Nama pengirim"
        value={form.sender_name}
        onChangeText={(v) => onChange("sender_name", v)}
      />
      <TextInput
        style={styles.input}
        placeholder="No. HP pengirim"
        keyboardType="phone-pad"
        value={form.sender_phone}
        onChangeText={(v) => onChange("sender_phone", v)}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Alamat pengirim"
        multiline
        value={form.sender_address}
        onChangeText={(v) => onChange("sender_address", v)}
      />

      <Text style={styles.sectionTitle}>Penerima</Text>
      <TextInput
        style={styles.input}
        placeholder="Nama penerima"
        value={form.receiver_name}
        onChangeText={(v) => onChange("receiver_name", v)}
      />
      <TextInput
        style={styles.input}
        placeholder="No. HP penerima"
        keyboardType="phone-pad"
        value={form.receiver_phone}
        onChangeText={(v) => onChange("receiver_phone", v)}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Alamat penerima"
        multiline
        value={form.receiver_address}
        onChangeText={(v) => onChange("receiver_address", v)}
      />

      <Text style={styles.sectionTitle}>Detail Paket</Text>
      <TextInput
        style={styles.input}
        placeholder="Asal (kota/agen)"
        value={form.origin}
        onChangeText={(v) => onChange("origin", v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Tujuan (kota/agen)"
        value={form.destination}
        onChangeText={(v) => onChange("destination", v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Berat (kg)"
        keyboardType="decimal-pad"
        value={form.weight_kg}
        onChangeText={(v) => onChange("weight_kg", v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Isi paket"
        value={form.content}
        onChangeText={(v) => onChange("content", v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Layanan (REG/YES/OKE)"
        value={form.service}
        onChangeText={(v) => onChange("service", v)}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Catatan (opsional)"
        multiline
        value={form.notes}
        onChangeText={(v) => onChange("notes", v)}
      />

      <PrimaryButton
        title={loading ? "Menyimpan..." : "Simpan & Generate Resi"}
        onPress={onSubmit}
        disabled={loading}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
  sectionTitle: {
    fontWeight: "700",
    color: COLORS.text,
    marginTop: SPACING.m,
    marginBottom: SPACING.s
  },
  input: {
    borderWidth: 1,
    borderColor: "#D7DBE3",
    borderRadius: RADIUS.m,
    paddingHorizontal: SPACING.m,
    paddingVertical: 12,
    backgroundColor: "#F9FAFB",
    marginBottom: SPACING.s
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top"
  },
  errorText: {
    color: COLORS.danger,
    marginTop: SPACING.s
  }
});
