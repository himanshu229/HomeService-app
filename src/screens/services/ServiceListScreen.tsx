import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, StatusBar, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../../types';
import { COLORS, FONTS, SPACING } from '../../utils/theme';
import Header from '../../components/common/Header';
import ServiceCard from '../../components/service/ServiceCard';
import EmptyState from '../../components/common/EmptyState';
import { useServices } from '../../hooks/useServices';

type Props = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'ServiceList'>;
  route: RouteProp<HomeStackParamList, 'ServiceList'>;
};

const ServiceListScreen: React.FC<Props> = ({ navigation, route }) => {
  const { categoryId, categoryName } = route.params;
  const { categories, servicesByCategory, isLoading, loadByCategory } = useServices();

  const services = servicesByCategory[categoryId] ?? [];
  const category = categories.find(c => c.id === categoryId);

  useEffect(() => {
    if (!servicesByCategory[categoryId]) loadByCategory(categoryId);
  }, [categoryId]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <Header title={categoryName} subtitle={`${services.length} services available`} showBack />

      {category && (
        <View style={[styles.catBanner, { backgroundColor: category.bgColor }]}>
          <Text style={styles.catEmoji}>{category.emoji}</Text>
          <View>
            <Text style={[styles.catTitle, { color: category.color }]}>{category.name}</Text>
            <Text style={styles.catSub}>Expert technicians at your doorstep</Text>
          </View>
        </View>
      )}

      {isLoading && services.length === 0 ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={services}
          keyExtractor={s => s.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={() => loadByCategory(categoryId)}
          refreshing={isLoading}
          ListEmptyComponent={
            <EmptyState emoji="🔧" title="No services found" subtitle="Check back soon for more services" />
          }
          renderItem={({ item }) => (
            <ServiceCard
              service={item}
              horizontal
              onPress={() =>
                navigation.navigate('ServiceDetail', { serviceId: item.id, service: item })
              }
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  catBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.md,
    padding: SPACING.base,
    borderRadius: 16,
    gap: SPACING.md,
  },
  catEmoji: { fontSize: 36 },
  catTitle: { fontSize: FONTS.sizes.lg, fontWeight: '800' },
  catSub:   { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 2 },
  list:     { padding: SPACING.xl },
  loader:   { marginTop: 60 },
});

export default ServiceListScreen;
