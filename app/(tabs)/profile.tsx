import { BiometricAuth } from "@/services/biometricAuth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

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
  
  // Biometric states
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState<string[]>([]);

  // Check biometric status on mount
  useEffect(() => {
    checkBiometricStatus();
  }, []);

  const checkBiometricStatus = async () => {
    const available = await BiometricAuth.isAvailable();
    setBiometricAvailable(available);
    
    if (available) {
      const enabled = await BiometricAuth.isBiometricEnabled();
      setBiometricEnabled(enabled);
      
      const types = await BiometricAuth.getSupportedTypes();
      setBiometricType(types);
    }
  };

  const handleToggleBiometric = async () => {
    if (biometricEnabled) {
      // Disable biometric
      Alert.alert(
        'Disable Biometric Login',
        'Are you sure you want to disable biometric login?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: async () => {
              await BiometricAuth.disableBiometric();
              setBiometricEnabled(false);
              Alert.alert('Success', 'Biometric login disabled');
            },
          },
        ]
      );
    } else {
      // Enable biometric - need to re-authenticate
      Alert.alert(
        'Enable Biometric Login',
        'Please enter your password to enable biometric login',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Continue',
            onPress: () => {
              Alert.prompt(
                'Enter Password',
                'Confirm your password to enable biometric login',
                async (password) => {
                  if (!password) {
                    Alert.alert('Error', 'Password is required');
                    return;
                  }
                  try {
                    setLoading(true);
                    // Verify password by attempting to change it to itself
                    if (user?.email) {
                      await changePassword(password, password);
                      await BiometricAuth.enableBiometric(user.email, password);
                      setBiometricEnabled(true);
                      Alert.alert('Success', `${biometricType.join(' or ')} login enabled`);
                    }
                  } catch (error) {
                    Alert.alert('Error', 'Invalid password. Please try again.');
                  } finally {
                    setLoading(false);
                  }
                },
                'secure-text'
              );
            },
          },
        ]
      );
    }
  };

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
      
      // If biometric is enabled, update stored password
      if (biometricEnabled && user?.email) {
        await BiometricAuth.enableBiometric(user.email, newPassword);
      }
      
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
              await BiometricAuth.disableBiometric(); // Clear biometric data
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

        {/* Email Verification Section */}
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

        {/* Security Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Security</Text>
          </View>

          {/* Biometric Authentication */}
          {biometricAvailable && (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleToggleBiometric}
                disabled={loading}
              >
                <Ionicons 
                  name={biometricType.includes('Face ID') ? 'scan' : 'finger-print'} 
                  size={20} 
                  color="#007AFF" 
                />
                <Text style={styles.actionButtonText}>
                  {biometricType.join(' or ')} Login
                </Text>
                <View style={styles.toggle}>
                  <View style={[styles.toggleTrack, biometricEnabled && styles.toggleTrackActive]}>
                    <View style={[styles.toggleThumb, biometricEnabled && styles.toggleThumbActive]} />
                  </View>
                </View>
              </TouchableOpacity>
              
              <Text style={styles.biometricInfo}>
                {biometricEnabled 
                  ? `${biometricType.join(' or ')} is enabled for quick and secure login`
                  : `Enable ${biometricType.join(' or ')} for faster login`
                }
              </Text>
            </>
          )}

          {/* Change Password */}
          <TouchableOpacity
            style={[styles.actionButton, biometricAvailable && { marginTop: 12 }]}
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
  toggle: {
    marginLeft: 'auto',
  },
  toggleTrack: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E5E7EB',
    padding: 2,
    justifyContent: 'center',
  },
  toggleTrackActive: {
    backgroundColor: '#007AFF',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    transform: [{ translateX: 20 }],
  },
  biometricInfo: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: -8,
    marginBottom: 12,
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  footer: { alignItems: "center", marginTop: 32, marginBottom: 20 },
  footerText: { fontSize: 12, color: "#999" },
});