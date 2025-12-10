import { BiometricAuth } from '@/services/biometricAuth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState<string[]>([]);
  const { login, signup, resetPassword } = useAuth();
  const router = useRouter();

  // Check biometric availability on mount
  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const available = await BiometricAuth.isAvailable();
    setBiometricAvailable(available);
    
    if (available) {
      const enabled = await BiometricAuth.isBiometricEnabled();
      setBiometricEnabled(enabled);
      
      const types = await BiometricAuth.getSupportedTypes();
      setBiometricType(types);
    }
  };

  const getErrorMessage = (error: any): string => {
    if (!error) return 'An unknown error occurred';
    
    const errorCode = error.code || '';
    
    const errorMessages: Record<string, string> = {
      'auth/invalid-email': 'Invalid email address format.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/email-already-in-use': 'An account already exists with this email.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Check your internet connection.',
      'auth/invalid-credential': 'Invalid email or password.',
      'auth/operation-not-allowed': 'This sign-in method is not enabled.',
      'auth/requires-recent-login': 'Please login again to complete this action.',
    };

    return errorMessages[errorCode] || error.message || 'An error occurred. Please try again.';
  };

  const handleBiometricLogin = async () => {
    try {
      // Authenticate with biometrics
      const authenticated = await BiometricAuth.authenticate();
      
      if (authenticated) {
        // Get stored credentials
        const credentials = await BiometricAuth.getStoredCredentials();
        
        if (credentials) {
          setLoading(true);
          await login(credentials.email, credentials.password);
          router.replace('/(tabs)');
        } else {
          Alert.alert('Error', 'No stored credentials found. Please login with email and password.');
          await BiometricAuth.disableBiometric();
          setBiometricEnabled(false);
        }
      }
    } catch (error) {
      const message = getErrorMessage(error);
      Alert.alert('Login Failed', message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.prompt(
      'Reset Password',
      'Enter your email address to receive a password reset link',
      async (inputEmail) => {
        if (!inputEmail || !inputEmail.includes('@')) {
          Alert.alert('Invalid Email', 'Please enter a valid email address');
          return;
        }

        try {
          await resetPassword(inputEmail);
          Alert.alert(
            'Success',
            'Password reset email sent! Check your inbox.',
            [{ text: 'OK' }]
          );
        } catch (error) {
          const message = getErrorMessage(error);
          Alert.alert('Error', message);
        }
      },
      'plain-text',
      email
    );
  };

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        
        // After successful login, ask if user wants to enable biometric
        if (biometricAvailable && !biometricEnabled) {
          Alert.alert(
            'Enable Biometric Login?',
            `Would you like to use ${biometricType.join(' or ')} for faster login next time?`,
            [
              {
                text: 'No, thanks',
                style: 'cancel',
                onPress: () => router.replace('/(tabs)'),
              },
              {
                text: 'Enable',
                onPress: async () => {
                  await BiometricAuth.enableBiometric(email, password);
                  setBiometricEnabled(true);
                  router.replace('/(tabs)');
                },
              },
            ]
          );
        } else {
          router.replace('/(tabs)');
        }
      } else {
        await signup(email, password);
        Alert.alert(
          'Account Created!',
          'A verification email has been sent to ' + email + '. Please verify your email to access all features.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(tabs)'),
            },
          ]
        );
      }
    } catch (error) {
      const message = getErrorMessage(error);
      Alert.alert(isLogin ? 'Login Failed' : 'Signup Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expense Tracker</Text>
      <Text style={styles.subtitle}>{isLogin ? 'Login to your account' : 'Create new account'}</Text>
      
      {/* Biometric Login Button - Only show on login and if enabled */}
      {isLogin && biometricAvailable && biometricEnabled && (
        <TouchableOpacity
          style={styles.biometricButton}
          onPress={handleBiometricLogin}
          disabled={loading}
        >
          <Ionicons
            name={biometricType.includes('Face ID') ? 'scan' : 'finger-print'}
            size={24}
            color="#007AFF"
          />
          <Text style={styles.biometricText}>
            Login with {biometricType.join(' or ')}
          </Text>
        </TouchableOpacity>
      )}

      {/* Divider */}
      {isLogin && biometricAvailable && biometricEnabled && (
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>
      )}
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        editable={!loading}
      />
      
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoComplete="password"
          editable={!loading}
        />
        <TouchableOpacity 
          style={styles.eyeIcon} 
          onPress={() => setShowPassword(!showPassword)}
          disabled={loading}
        >
          <Ionicons 
            name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
            size={22} 
            color="#666" 
          />
        </TouchableOpacity>
      </View>

      {isLogin && (
        <TouchableOpacity 
          onPress={handleForgotPassword}
          disabled={loading}
          style={styles.forgotPasswordContainer}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleAuth}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => setIsLogin(!isLogin)} disabled={loading}>
        <Text style={styles.switchText}>
          {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f5f5f5' },
  title: { fontSize: 36, fontWeight: 'bold', textAlign: 'center', marginBottom: 8, color: '#007AFF' },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 40, color: '#666' },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#DBEAFE',
    gap: 12,
  },
  biometricText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    padding: 16, 
    marginBottom: 16, 
    borderRadius: 12, 
    backgroundColor: '#fff', 
    fontSize: 16 
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  passwordInput: {
    borderWidth: 1, 
    borderColor: '#ddd', 
    padding: 16, 
    paddingRight: 50, 
    borderRadius: 12, 
    backgroundColor: '#fff', 
    fontSize: 16 
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 4,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  button: { 
    backgroundColor: '#007AFF', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginBottom: 16,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '600' },
  switchText: { textAlign: 'center', color: '#007AFF', fontSize: 16 },
});