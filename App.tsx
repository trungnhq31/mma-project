import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import BookAppointmentScreen from './src/screens/BookAppointmentScreen';

// Types
import { TabIconProps } from './src/types';

const Tab = createBottomTabNavigator();

// Custom theme
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1e90ff',
    background: '#ffffff',
    card: '#ffffff',
    text: '#333333',
    border: '#e0e0e0',
    notification: '#ff3b30',
  },
};

// Tab bar icon component
const TabBarIcon = (name: string) => {
  return ({ color, size }: TabIconProps) => (
    <Ionicons name={name as any} size={size} color={color} />
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <NavigationContainer theme={MyTheme}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: string = 'home';

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'BookAppointment') {
                iconName = focused ? 'calendar' : 'calendar-outline';
              }

              return <Ionicons name={iconName as any} size={size} color={color} />;
            },
            tabBarActiveTintColor: MyTheme.colors.primary,
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
          })}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Trang chủ' }}
          />
          <Tab.Screen 
            name="BookAppointment" 
            component={BookAppointmentScreen} 
            options={{ title: 'Đặt lịch' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
