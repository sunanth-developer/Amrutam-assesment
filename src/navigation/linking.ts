import * as Linking from 'expo-linking';
import type { LinkingOptions } from '@react-navigation/native';
import type { RootTabParamList } from './types';

export const linking: LinkingOptions<RootTabParamList> = {
  prefixes: [Linking.createURL('/'), 'amrutam://'],
  config: {
    screens: {
      Consultation: {
        path: 'consult',
        screens: {
          DoctorList: '',
          DoctorDetail: 'doctor/:doctorId',
          UpcomingConsultations: 'upcoming',
        },
      },
      Shop: {
        path: 'shop',
        screens: {
          ProductList: '',
          ProductDetail: 'product/:productId',
          Cart: 'cart',
          Wishlist: 'wishlist',
        },
      },
      HealthRecords: {
        path: 'records',
        screens: {
          RecordsList: '',
          RecordDetail: 'record/:recordId',
        },
      },
      Settings: 'settings',
    },
  },
};
