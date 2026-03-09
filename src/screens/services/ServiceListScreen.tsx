import React, { useMemo } from 'react';
import { View, StyleSheet, FlatList, StatusBar, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList, ServiceItem } from '../../types';
import { SERVICE_CATEGORIES } from '../../utils/constants';
import { COLORS, FONTS, SPACING } from '../../utils/theme';
import Header from '../../components/common/Header';
import ServiceCard from '../../components/service/ServiceCard';
import EmptyState from '../../components/common/EmptyState';

type Props = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'ServiceList'>;
  route: RouteProp<HomeStackParamList, 'ServiceList'>;
};

const ServiceListScreen: React.FC<Props> = ({ navigation, route }) => {
  const { categoryId, categoryName } = route.params;

  const category = useMemo(
    () => SERVICE_CATEGORIES.find(c => c.id === categoryId),
    [categoryId]
  );

  const services: ServiceItem[] = useMemo(() => {
    if (!category) return [];
    return category.services.map(s => ({
      ...s,
      category: category.name,
      rating: parseFloat((4.2 + Math.random() * 0.8).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 1500) + 100,
      isPopular: Math.random() > 0.6,
      description: `Professional ${s.name} by certified technicians. All major brands covered with warranty on parts & labour.`,
    }));
  }, [category]);

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

      <FlatList
        data={services}
        keyExtractor={s => s.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
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
  catSub: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 2 },
  list: { padding: SPACING.xl },
});

export default ServiceListScreen;
