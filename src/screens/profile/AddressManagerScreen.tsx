import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  StatusBar,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../../utils/theme';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateUser } from '../../store/slices/authSlice';
import { Address } from '../../types';

const AddressManagerScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const addresses: Address[] = user?.addresses || [];

  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [form, setForm] = useState({ label: '', street: '', city: '', state: '', pincode: '' });

  const openAdd = () => {
    setEditingAddress(null);
    setForm({ label: 'Home', street: '', city: '', state: '', pincode: '' });
    setModalVisible(true);
  };

  const openEdit = (addr: Address) => {
    setEditingAddress(addr);
    setForm({
      label: addr.label,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!form.street.trim() || !form.city.trim() || !form.pincode.trim()) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }
    const newAddr: Address = {
      id: editingAddress?.id || `addr_${Date.now()}`,
      label: form.label || 'Home',
      street: form.street,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      isDefault: editingAddress?.isDefault || addresses.length === 0,
    };
    const updated = editingAddress
      ? addresses.map(a => (a.id === editingAddress.id ? newAddr : a))
      : [...addresses, newAddr];
    dispatch(updateUser({ addresses: updated }));
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Address', 'Remove this address?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          dispatch(updateUser({ addresses: addresses.filter(a => a.id !== id) }));
        },
      },
    ]);
  };

  const handleSetDefault = (id: string) => {
    dispatch(updateUser({ addresses: addresses.map(a => ({ ...a, isDefault: a.id === id })) }));
  };

  const renderAddress = ({ item }: { item: Address }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.labelRow}>
          <Text style={styles.labelEmoji}>{item.label === 'Home' ? '🏠' : item.label === 'Work' ? '🏢' : '📍'}</Text>
          <Text style={styles.labelText}>{item.label}</Text>
          {item.isDefault && <View style={styles.defaultBadge}><Text style={styles.defaultBadgeText}>Default</Text></View>}
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity onPress={() => openEdit(item)} style={styles.actionBtn}>
            <Text style={styles.actionEdit}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
            <Text style={styles.actionDelete}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.cardAddress}>{item.street}, {item.city}, {item.state} - {item.pincode}</Text>
      {!item.isDefault && (
        <TouchableOpacity onPress={() => handleSetDefault(item.id)}>
          <Text style={styles.setDefaultLink}>Set as default</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <Header title="Saved Addresses" />

      <FlatList
        data={addresses}
        keyExtractor={item => item.id}
        renderItem={renderAddress}
        contentContainerStyle={{ padding: SPACING.xl, gap: SPACING.md }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📍</Text>
            <Text style={styles.emptyTitle}>No Addresses Saved</Text>
            <Text style={styles.emptySubtitle}>Add your home or work address for faster booking</Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <Button title="+ Add New Address" onPress={openAdd} size="lg" />
      </View>

      {/* Add/Edit Modal */}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        style={styles.modal}
        avoidKeyboard
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{editingAddress ? 'Edit Address' : 'Add Address'}</Text>

          <Text style={styles.fieldLabel}>Label</Text>
          <View style={styles.labelPicker}>
            {['Home', 'Work', 'Other'].map(l => (
              <TouchableOpacity
                key={l}
                style={[styles.labelOption, form.label === l && styles.labelOptionActive]}
                onPress={() => setForm(f => ({ ...f, label: l }))}
              >
                <Text style={[styles.labelOptionText, form.label === l && styles.labelOptionTextActive]}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Street Address *</Text>
          <TextInput
            style={styles.input}
            value={form.street}
            onChangeText={v => setForm(f => ({ ...f, street: v }))}
            placeholder="House no, street, area"
            placeholderTextColor={COLORS.textLight}
          />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>City *</Text>
              <TextInput
                style={styles.input}
                value={form.city}
                onChangeText={v => setForm(f => ({ ...f, city: v }))}
                placeholder="City"
                placeholderTextColor={COLORS.textLight}
              />
            </View>
            <View style={{ width: SPACING.md }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>State</Text>
              <TextInput
                style={styles.input}
                value={form.state}
                onChangeText={v => setForm(f => ({ ...f, state: v }))}
                placeholder="State"
                placeholderTextColor={COLORS.textLight}
              />
            </View>
          </View>

          <Text style={styles.fieldLabel}>Pincode *</Text>
          <TextInput
            style={styles.input}
            value={form.pincode}
            onChangeText={v => setForm(f => ({ ...f, pincode: v }))}
            placeholder="Pin code"
            placeholderTextColor={COLORS.textLight}
            keyboardType="numeric"
            maxLength={6}
          />

          <View style={styles.modalActions}>
            <Button title="Cancel" onPress={() => setModalVisible(false)} variant="outline" size="md" />
            <Button title="Save Address" onPress={handleSave} size="md" />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    ...SHADOWS.sm,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.xs },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  labelEmoji: { fontSize: 18 },
  labelText: { fontSize: FONTS.sizes.base, fontWeight: '700', color: COLORS.text },
  defaultBadge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  defaultBadgeText: { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  cardActions: { flexDirection: 'row', gap: SPACING.md },
  actionBtn: {},
  actionEdit: { fontSize: FONTS.sizes.sm, color: COLORS.secondary, fontWeight: '600' },
  actionDelete: { fontSize: FONTS.sizes.sm, color: COLORS.error, fontWeight: '600' },
  cardAddress: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 20 },
  setDefaultLink: { fontSize: FONTS.sizes.xs, color: COLORS.primary, fontWeight: '600', marginTop: SPACING.xs },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 60, marginBottom: SPACING.md },
  emptyTitle: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.sm },
  emptySubtitle: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, textAlign: 'center' },
  footer: { padding: SPACING.xl, backgroundColor: COLORS.white, ...SHADOWS.sm },
  modal: { justifyContent: 'flex-end', margin: 0 },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
  },
  modalTitle: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.lg },
  fieldLabel: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs, marginTop: SPACING.sm },
  input: {
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    fontSize: FONTS.sizes.base,
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },
  row: { flexDirection: 'row' },
  labelPicker: { flexDirection: 'row', gap: SPACING.sm },
  labelOption: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    alignItems: 'center',
  },
  labelOptionActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  labelOptionText: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textSecondary },
  labelOptionTextActive: { color: COLORS.primary },
  modalActions: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.xl },
});

export default AddressManagerScreen;
