import { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  StatusBar,
} from "react-native";

const categories = ["Semua", "Baju", "Celana", "Sepatu", "Hijab", "Aksesori"];

export default function App() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [search, setSearch] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F7F2" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>otpit.</Text>
            <Text style={styles.subtitle}>Lemari digital kamu</Text>
          </View>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>O</Text>
          </View>
        </View>

        <View style={styles.greeting}>
          <Text style={styles.greetingTitle}>Isi lemari, kenali gayamu.</Text>
          <Text style={styles.greetingSubtitle}>
            Semua koleksi favoritmu dalam satu tempat.
          </Text>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsLabel}>KOLEKSI SAYA</Text>
          <Text style={styles.statsNumber}>0 barang</Text>
          <Text style={styles.statsDescription}>
            Yuk, mulai catat isi lemarimu!
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Lemari saya</Text>
          <Text style={styles.itemCount}>0 item</Text>
        </View>

        <TextInput
          style={styles.search}
          placeholder="Cari baju, sepatu, hijab..."
          placeholderTextColor="#92948D"
          value={search}
          onChangeText={setSearch}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {categories.map((category) => (
            <Pressable
              key={category}
              onPress={() => setActiveCategory(category)}
              style={[
                styles.categoryButton,
                activeCategory === category && styles.categoryButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>👕</Text>
          <Text style={styles.emptyTitle}>Lemarimu masih kosong</Text>
          <Text style={styles.emptyDescription}>
            Tambahkan pakaian pertamamu dan mulai bangun koleksi digitalmu.
          </Text>

          <Pressable
            style={styles.addButton}
            onPress={() =>
              alert("Fitur tambah barang akan kita buat berikutnya!")
            }
          >
            <Text style={styles.addButtonText}>+ Tambah barang pertama</Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>Otpit · Semua koleksi, satu lemari.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F7F2",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: 32,
    fontWeight: "800",
    color: "#344C3D",
    letterSpacing: -1.5,
  },
  subtitle: {
    fontSize: 13,
    color: "#777C72",
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E1E8DA",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#344C3D",
  },
  greeting: {
    paddingHorizontal: 24,
    marginTop: 30,
    marginBottom: 22,
  },
  greetingTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: "#29372E",
    letterSpacing: -0.7,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: "#777C72",
    marginTop: 8,
    lineHeight: 21,
  },
  statsCard: {
    marginHorizontal: 24,
    padding: 22,
    borderRadius: 20,
    backgroundColor: "#344C3D",
  },
  statsLabel: {
    color: "#D4E0D2",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  statsNumber: {
    fontSize: 30,
    color: "#FFFFFF",
    fontWeight: "800",
    marginTop: 10,
  },
  statsDescription: {
    color: "#E0E7DD",
    fontSize: 13,
    marginTop: 6,
  },
  sectionHeader: {
    marginHorizontal: 24,
    marginTop: 30,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#29372E",
  },
  itemCount: {
    fontSize: 13,
    color: "#777C72",
  },
  search: {
    marginHorizontal: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8E7E0",
    borderRadius: 13,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: "#29372E",
  },
  categoryList: {
    paddingHorizontal: 24,
    paddingVertical: 18,
    gap: 9,
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: "#E3E4DB",
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: "#FFFFFF",
  },
  categoryButtonActive: {
    backgroundColor: "#344C3D",
    borderColor: "#344C3D",
  },
  categoryText: {
    color: "#646B61",
    fontSize: 13,
    fontWeight: "600",
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },
  emptyState: {
    marginHorizontal: 24,
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EAE9E2",
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#29372E",
    textAlign: "center",
  },
  emptyDescription: {
    marginTop: 9,
    fontSize: 13,
    color: "#777C72",
    lineHeight: 20,
    textAlign: "center",
  },
  addButton: {
    marginTop: 20,
    backgroundColor: "#344C3D",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  footer: {
    textAlign: "center",
    color: "#92948D",
    fontSize: 12,
    marginTop: 28,
    marginBottom: 30,
  },
});
