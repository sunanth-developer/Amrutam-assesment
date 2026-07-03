export type ConsultationStackParamList = {
  DoctorList: undefined;
  DoctorDetail: { doctorId: string };
  UpcomingConsultations: undefined;
};

export type ShopStackParamList = {
  ProductList: undefined;
  ProductDetail: { productId: string };
  Cart: undefined;
  Checkout: undefined;
  Wishlist: undefined;
};

export type HealthRecordsStackParamList = {
  RecordsList: undefined;
  RecordDetail: { recordId: string };
};

export type RootTabParamList = {
  Consultation: undefined;
  Shop: undefined;
  HealthRecords: undefined;
  Settings: undefined;
};
