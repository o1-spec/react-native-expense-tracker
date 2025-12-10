import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function EmailVerificationBanner() {
  const { user, sendVerificationEmail, reloadUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  if (!user || user.emailVerified) {
    return null; 
  }

  const handleResendEmail = async () => {
    setLoading(true);
    try {
      await sendVerificationEmail();
      Alert.alert(
        'Email Sent',
        'Verification email has been sent to ' + user.email,
        [{ text: 'OK' }]
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send email';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    setChecking(true);
    try {
      await reloadUser();
      if (user.emailVerified) {
        Alert.alert('Success', 'Email verified successfully!');
      } else {
        Alert.alert('Not Verified', 'Please check your email and click the verification link.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to check verification';
      Alert.alert('Error', message);
    } finally {
      setChecking(false);
    }
  };

  return (
    <View style={styles.banner}>
      <View style={styles.iconContainer}>
        <Ionicons name="mail-unread-outline" size={24} color="#F59E0B" />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.message}>
          Please verify your email address to access all features
        </Text>
        
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleCheckVerification}
            disabled={checking || loading}
          >
            {checking ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.primaryButtonText}>I've Verified</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleResendEmail}
            disabled={checking || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#F59E0B" />
            ) : (
              <Text style={styles.secondaryButtonText}>Resend Email</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#78350F',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#F59E0B',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  secondaryButtonText: {
    color: '#F59E0B',
    fontWeight: '600',
    fontSize: 14,
  },
});