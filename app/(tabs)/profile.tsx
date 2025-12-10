import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user, logout, updateUserProfile, changePassword, deleteAccount, sendVerificationEmail } =
    useAuth();
  const router = useRouter();
  
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const handleUpdateProfile = async () => {
    if (!displayName.trim()) {
      Alert.alert("Error", "Display name cannot be empty");
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile(displayName);
      Alert.alert("Success", "Profile updated successfully");
      setEditingName(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all password fields");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      Alert.alert("Success", "Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setChangingPassword(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to change password";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await deleteAccount();
              router.replace("/login");
            } catch (error) {
              const message =
                error instanceof Error
                  ? error.message
                  : "Failed to delete account";
              Alert.alert("Error", message);
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color="#007AFF" />
          </View>
          <Text style={styles.email}>{user?.email}</Text>
          <Text style={styles.memberSince}>
            Member since{" "}
            {user?.metadata?.creationTime
              ? new Date(user.metadata.creationTime).toLocaleDateString()
              : "N/A"}
          </Text>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Email Verification</Text>
            <Ionicons
              name={user?.emailVerified ? "checkmark-circle" : "alert-circle"}
              size={24}
              color={user?.emailVerified ? "#10B981" : "#F59E0B"}
            />
          </View>

          <View
            style={[
              styles.infoCard,
              user?.emailVerified ? styles.verifiedCard : styles.unverifiedCard,
            ]}
          >
            <Text style={styles.infoText}>
              {user?.emailVerified ? "Email Verified ✓" : "Email Not Verified"}
            </Text>
            {!user?.emailVerified && (
              <TouchableOpacity
                style={[styles.button, { marginTop: 12 }]}
                onPress={async () => {
                  setLoading(true);
                  try {
                    await sendVerificationEmail();
                    Alert.alert("Success", "Verification email sent!");
                  } catch (error) {
                    Alert.alert("Error", "Failed to send email");
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Send Verification Email</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        {/* Display Name Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Display Name</Text>
            <TouchableOpacity onPress={() => setEditingName(!editingName)}>
              <Ionicons
                name={editingName ? "close" : "pencil"}
                size={20}
                color="#007AFF"
              />
            </TouchableOpacity>
          </View>

          {editingName ? (
            <View>
              <TextInput
                style={styles.input}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Enter display name"
                editable={!loading}
              />
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleUpdateProfile}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>{displayName || "Not set"}</Text>
            </View>
          )}
        </View>

        {/* Change Password Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Security</Text>
          </View>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setChangingPassword(!changingPassword)}
          >
            <Ionicons name="lock-closed-outline" size={20} color="#007AFF" />
            <Text style={styles.actionButtonText}>Change Password</Text>
            <Ionicons
              name={changingPassword ? "chevron-up" : "chevron-down"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>

          {changingPassword && (
            <View style={styles.passwordSection}>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Current Password"
                secureTextEntry
                editable={!loading}
              />
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="New Password"
                secureTextEntry
                editable={!loading}
              />
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm New Password"
                secureTextEntry
                editable={!loading}
              />
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleChangePassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Update Password</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>

          <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#007AFF" />
            <Text style={styles.actionButtonText}>Logout</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.dangerButton]}
            onPress={handleDeleteAccount}
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
            <Text style={[styles.actionButtonText, styles.dangerText]}>
              Delete Account
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Expense Tracker v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f5f5" },
  container: { padding: 20 },
  header: { alignItems: "center", marginBottom: 32 },
  avatarContainer: { marginBottom: 12 },
  email: { fontSize: 18, fontWeight: "600", color: "#333", marginBottom: 4 },
  memberSince: { fontSize: 14, color: "#666" },
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#333" },
  infoCard: { backgroundColor: "#f9f9f9", padding: 16, borderRadius: 12 },
  infoText: { fontSize: 16, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600" },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginBottom: 12,
  },
  actionButtonText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: "#FEE2E2",
    backgroundColor: "#FEF2F2",
  },
  verifiedCard: { borderColor: "#D1FAE5", backgroundColor: "#ECFDF5" },
  unverifiedCard: {
    borderColor: "#FDE68A",
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
  },
  dangerText: { color: "#EF4444" },
  passwordSection: { marginTop: 16 },
  footer: { alignItems: "center", marginTop: 32, marginBottom: 20 },
  footerText: { fontSize: 12, color: "#999" },
});
