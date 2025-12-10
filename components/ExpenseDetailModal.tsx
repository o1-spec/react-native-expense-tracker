import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Expense } from '../types';

interface ExpenseDetailModalProps {
  expense: Expense | null;
  visible: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ExpenseDetailModal({
  expense,
  visible,
  onClose,
  onEdit,
  onDelete,
}: ExpenseDetailModalProps) {
  if (!expense) return null;

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      Food: 'restaurant',
      Transport: 'car',
      Bills: 'receipt',
      Shopping: 'cart',
      Subscriptions: 'card',
      Others: 'ellipsis-horizontal',
    };
    return icons[category] || 'ellipsis-horizontal';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Food: '#EF4444',
      Transport: '#3B82F6',
      Bills: '#F59E0B',
      Shopping: '#8B5CF6',
      Subscriptions: '#10B981',
      Others: '#6B7280',
    };
    return colors[category] || '#6B7280';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Expense Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Amount Card */}
            <View style={styles.amountCard}>
              <Text style={styles.amountLabel}>Amount</Text>
              <Text style={styles.amount}>₦{expense.amount.toFixed(2)}</Text>
            </View>

            {/* Title */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="pricetag" size={20} color="#6B7280" />
                <Text style={styles.sectionTitle}>Title</Text>
              </View>
              <Text style={styles.sectionText}>{expense.title}</Text>
            </View>

            {/* Description (only if exists) */}
            {expense.description && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="document-text" size={20} color="#6B7280" />
                  <Text style={styles.sectionTitle}>Description</Text>
                </View>
                <Text style={styles.sectionText}>{expense.description}</Text>
              </View>
            )}

            {/* Category */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="albums" size={20} color="#6B7280" />
                <Text style={styles.sectionTitle}>Category</Text>
              </View>
              <View style={styles.categoryBadge}>
                <Ionicons
                  name={getCategoryIcon(expense.category) as any}
                  size={18}
                  color={getCategoryColor(expense.category)}
                />
                <Text style={[styles.categoryText, { color: getCategoryColor(expense.category) }]}>
                  {expense.category}
                </Text>
              </View>
            </View>

            {/* Date */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="calendar" size={20} color="#6B7280" />
                <Text style={styles.sectionTitle}>Date</Text>
              </View>
              <Text style={styles.sectionText}>
                {new Date(expense.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>

            {/* Notes (only if exists) */}
            {expense.notes && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="chatbox-ellipses" size={20} color="#6B7280" />
                  <Text style={styles.sectionTitle}>Notes</Text>
                </View>
                <Text style={styles.sectionText}>{expense.notes}</Text>
              </View>
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actions}>
            {onEdit && (
              <TouchableOpacity style={styles.editButton} onPress={onEdit}>
                <Ionicons name="create-outline" size={20} color="white" />
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
                <Ionicons name="trash-outline" size={20} color="white" />
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  amountCard: {
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  amountLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
    fontWeight: '500',
  },
  amount: {
    fontSize: 36,
    fontWeight: '700',
    color: 'white',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionText: {
    fontSize: 16,
    color: '#111827',
    lineHeight: 24,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});