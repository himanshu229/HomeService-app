import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, StatusBar, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../types';
import { COLORS, SPACING } from '../../utils/theme';
import Header from '../../components/common/Header';
import CategoryCard from '../../components/service/CategoryCard';
import { useServices } from '../../hooks/useServices';

type Props = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'ServiceCategories'>;
};

const ServiceCategoriesScreen: React.FC<Props> = ({ navigation }) => {
  const { categories, isLoading, error, loadCategories } = useServices();

  useEffect(() => {
    if (categories.length === 0) loadCategories();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <Header title="Our Services" subtitle="What do you need today?" showBack />

      {isLoading && categories.length === 0 ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
      ) : error && categories.length === 0 ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>Failed to load services. Pull down to retry.</Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={loadCategories}
          refreshing={isLoading}
          renderItem={({ item }) => (
            <CategoryCard
              category={item}
              onPress={() =>
                navigation.navigate('ServiceList', {
                  categoryId: item.id,
                  categoryName: item.name,
                })
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
  list:       { padding: SPACING.xl },
  loader:     { marginTop: 60 },
  errorBox:   { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
  errorText:  { color: COLORS.textSecondary, textAlign: 'center' },
});

export default ServiceCategoriesScreen;
