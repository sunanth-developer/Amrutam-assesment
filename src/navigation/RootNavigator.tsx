import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../design-system/theme/ThemeProvider';
import { useTranslation } from '../localization/i18n';
import { DoctorListScreen } from '../modules/consultation/screens/DoctorListScreen';
import { DoctorDetailScreen } from '../modules/consultation/screens/DoctorDetailScreen';
import { UpcomingConsultationsScreen } from '../modules/consultation/screens/UpcomingConsultationsScreen';
import { ProductListScreen } from '../modules/shop/screens/ProductListScreen';
import { ProductDetailScreen } from '../modules/shop/screens/ProductDetailScreen';
import { CartScreen } from '../modules/shop/screens/CartScreen';
import { CheckoutScreen } from '../modules/shop/screens/CheckoutScreen';
import { WishlistScreen } from '../modules/shop/screens/WishlistScreen';
import { HealthRecordsScreen } from '../modules/health-records/screens/HealthRecordsScreen';
import { HealthRecordDetailScreen } from '../modules/health-records/screens/HealthRecordDetailScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { FloatingTabBar } from './FloatingTabBar';
import { getStackScreenOptions } from './screenOptions';
import type {
  ConsultationStackParamList,
  HealthRecordsStackParamList,
  RootTabParamList,
  ShopStackParamList,
} from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();
const ConsultationStack = createNativeStackNavigator<ConsultationStackParamList>();
const ShopStack = createNativeStackNavigator<ShopStackParamList>();
const HealthRecordsStack = createNativeStackNavigator<HealthRecordsStackParamList>();

function TabIcon({ name, color, focused }: { name: keyof typeof Ionicons.glyphMap; color: string; focused: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.tabIconWrap, focused && { backgroundColor: colors.primary + '18' }]}>
      <Ionicons name={name} size={18} color={color} />
    </View>
  );
}

function ConsultationNavigator() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <ConsultationStack.Navigator screenOptions={getStackScreenOptions(colors)}>
      <ConsultationStack.Screen name="DoctorList" component={DoctorListScreen} options={{ headerShown: false }} />
      <ConsultationStack.Screen name="DoctorDetail" component={DoctorDetailScreen} options={{ title: t('doctorDetails') }} />
      <ConsultationStack.Screen name="UpcomingConsultations" component={UpcomingConsultationsScreen} options={{ title: t('upcomingTitle') }} />
    </ConsultationStack.Navigator>
  );
}

function ShopNavigator() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <ShopStack.Navigator screenOptions={getStackScreenOptions(colors)}>
      <ShopStack.Screen name="ProductList" component={ProductListScreen} options={{ headerShown: false }} />
      <ShopStack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: t('product') }} />
      <ShopStack.Screen name="Cart" component={CartScreen} options={{ title: t('yourCart') }} />
      <ShopStack.Screen name="Checkout" component={CheckoutScreen} options={{ title: t('checkoutTitle') }} />
      <ShopStack.Screen name="Wishlist" component={WishlistScreen} options={{ title: t('wishlistTitle') }} />
    </ShopStack.Navigator>
  );
}

function HealthRecordsNavigator() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <HealthRecordsStack.Navigator screenOptions={getStackScreenOptions(colors)}>
      <HealthRecordsStack.Screen name="RecordsList" component={HealthRecordsScreen} options={{ headerShown: false }} />
      <HealthRecordsStack.Screen name="RecordDetail" component={HealthRecordDetailScreen} options={{ title: t('recordDetails') }} />
    </HealthRecordsStack.Navigator>
  );
}

export function RootNavigator() {
  const { colors } = useTheme();
  const { t, locale } = useTranslation();

  return (
    <Tab.Navigator
      key={locale}
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, focused }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Consultation: focused ? 'medical' : 'medical-outline',
            Shop: focused ? 'bag-handle' : 'bag-handle-outline',
            HealthRecords: focused ? 'pulse' : 'pulse-outline',
            Settings: focused ? 'person-circle' : 'person-circle-outline',
          };
          return <TabIcon name={icons[route.name]} color={color} focused={focused} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginTop: -4 },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen name="Consultation" component={ConsultationNavigator} options={{ title: t('consult') }} />
      <Tab.Screen name="Shop" component={ShopNavigator} options={{ title: t('shop') }} />
      <Tab.Screen name="HealthRecords" component={HealthRecordsNavigator} options={{ title: t('records') }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: t('profile') }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIconWrap: {
    width: 36,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
