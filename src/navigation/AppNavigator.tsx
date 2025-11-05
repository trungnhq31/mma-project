import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Main App Screens
import HomeScreen from '../screens/HomeScreen';
import BookAppointmentScreen from '../screens/BookAppointmentScreen';
import BookingHistoryScreen from '../screens/history/BookingHistoryScreen';
import BookingDetailScreen from '../screens/history/BookingDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Types for navigation
import { RootStackParamList, MainTabParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'BookAppointment') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'BookingHistory') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
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
      <Tab.Screen 
        name="BookingHistory" 
        component={BookingHistoryScreen} 
        options={{ title: 'Lịch sử' }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Tôi' }} 
      />
    </Tab.Navigator>
  );
}

// Root Navigator
function AppNavigator() {
  // For demo purposes, we'll use a simple state
  // In a real app, this should come from your auth context/state management
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  
  // Function to handle successful login
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  
  // Function to handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    // Navigate to login screen when logging out
    // This will be handled by the navigation state change
  };

  // Expose a simple global setter so screens can trigger logout
  (global as any).__SET_LOGGED_IN__ = (val: boolean) => setIsLoggedIn(val);

  return (
    <Stack.Navigator>
        {!isLoggedIn ? (
          // Auth Screens
          <>
            <Stack.Screen 
              name="Login" 
              options={{ headerShown: false }}
            >
              {(props) => (
                <LoginScreen 
                  {...props}
                  onLoginSuccess={handleLogin}
                />
              )}
            </Stack.Screen>
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options={{ title: 'Đăng ký' }} 
            />
          </>
        ) : (
          // Main App
          <>
            <Stack.Screen 
              name="MainTabs" 
              component={MainTabs} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="BookingDetail" 
              component={BookingDetailScreen} 
              options={{ title: 'Chi tiết đơn đặt' }} 
            />
          </>
        )}
      </Stack.Navigator>
  );
}

export default AppNavigator;
