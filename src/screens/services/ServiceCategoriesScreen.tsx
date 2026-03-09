import React from 'react';
import { View, StyleSheet, FlatList, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../types';
import { SERVICE_CATEGORIES } from '../../utils/constants';
import { COLORS, SPACING } from '../../utils/theme';
import Header from '../../components/common/Header';
import CategoryCard from '../../components/service/CategoryCard';

type Props = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'ServiceCategories'>;
};

const ServiceCategoriesScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <Header title="Our Services" subtitle="What do you need today?" showBack />
      <FlatList
        data={SERVICE_CATEGORIES}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CategoryCard
            category={item as any}
            onPress={() =>
              navigation.navigate('ServiceList', {
                categoryId: item.id,
                categoryName: item.name,
              })
            }
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: SPACING.xl },
});

export default ServiceCategoriesScreen;
