export type Booking = {
  id: string;
  customerName: string;
  serviceName: string;
  bookingDate: string;
  status: string;
  details: {
    phone: string;
    email: string;
    vehicleType: string;
    licensePlate: string;
    serviceType: string;
    address: string;
    notes?: string;
  };
};

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  BookingDetail: { booking: Booking };
};

export type MainTabParamList = {
  Home: undefined;
  BookAppointment: undefined;
  BookingHistory: undefined;
};
