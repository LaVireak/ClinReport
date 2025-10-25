import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import ProductScreen from './src/screens/ProductScreen';
import DemoScreen from './src/screens/DemoScreen';
import ContactScreen from './src/screens/ContactScreen';
import PricingScreen from './src/screens/PricingScreen';
import AboutScreen from './src/screens/AboutScreen';
import LoginScreen from './src/screens/LoginScreen';
import DoctorDashboard from './src/screens/DoctorDashboard';
import PatientDashboard from './src/screens/PatientDashboard';

import { colors } from './src/styles/colors';
import { PatientDataProvider } from './src/context/PatientDataContext';

const Stack = createStackNavigator();

const HomeHeader = ({ navigation }) => (
  <SafeAreaView style={styles.homeHeaderSafeArea}>
    <View style={styles.homeHeaderContent}>
      <View style={styles.homeHeaderLeft}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>C</Text>
        </View>
        <Text style={styles.headerTitleText}>ClinReport</Text>
      </View>
      <View style={styles.homeHeaderActions}>
        <TouchableOpacity
          style={[styles.menuButton, styles.signInButton, styles.headerButtonFirst]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={[styles.menuButtonText, styles.signInButtonText]}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuButton, styles.headerButton]}
          onPress={() => navigation.navigate('Contact')}
        >
          <Text style={styles.menuButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  </SafeAreaView>
);

export default function App() {
  return (
    <PatientDataProvider>
      <NavigationContainer>
        <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.white,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: colors.textDark,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
            color: colors.textDark,
          },
          headerTitleAlign: 'left',
          headerRightContainerStyle: { paddingRight: 16 },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={({ navigation }) => ({
            header: () => <HomeHeader navigation={navigation} />,
          })}
        />
        <Stack.Screen 
          name="Product" 
          component={ProductScreen} 
          options={({ navigation }) => ({
            title: 'Product Features',
            headerRight: () => (
              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={[styles.menuButton, styles.headerButtonFirst]}
                  onPress={() => navigation.navigate('Contact')}
                >
                  <Text style={styles.menuButtonText}>Get Started</Text>
                </TouchableOpacity>
              </View>
            ),
          })}
        />
        <Stack.Screen 
          name="Demo" 
          component={DemoScreen} 
          options={({ navigation }) => ({
            title: 'Live Demo',
            headerRight: () => (
              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={[styles.menuButton, styles.headerButtonFirst]}
                  onPress={() => navigation.navigate('Contact')}
                >
                  <Text style={styles.menuButtonText}>Get Started</Text>
                </TouchableOpacity>
              </View>
            ),
          })}
        />
        <Stack.Screen name="Contact" component={ContactScreen} options={{ title: 'Contact Us' }} />
        <Stack.Screen 
          name="Pricing" 
          component={PricingScreen} 
          options={({ navigation }) => ({
            title: 'Pricing Plans',
            headerRight: () => (
              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={[styles.menuButton, styles.headerButtonFirst]}
                  onPress={() => navigation.navigate('Contact')}
                >
                  <Text style={styles.menuButtonText}>Get Started</Text>
                </TouchableOpacity>
              </View>
            ),
          })}
        />
        <Stack.Screen 
          name="About" 
          component={AboutScreen} 
          options={({ navigation }) => ({
            title: 'About Us',
            headerRight: () => (
              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={[styles.menuButton, styles.headerButtonFirst]}
                  onPress={() => navigation.navigate('Contact')}
                >
                  <Text style={styles.menuButtonText}>Get Started</Text>
                </TouchableOpacity>
              </View>
            ),
          })}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ 
            title: 'Sign In',
            headerBackTitle: 'Back',
          }} 
        />
        <Stack.Screen 
          name="DoctorDashboard" 
          component={DoctorDashboard} 
          options={{ 
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="PatientDashboard" 
          component={PatientDashboard} 
          options={{ 
            headerShown: false,
          }} 
        />
      </Stack.Navigator>
      </NavigationContainer>
    </PatientDataProvider>
  );
}

const styles = StyleSheet.create({
  logoContainer: { marginLeft: 0 },
  logo: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    textAlign: 'center',
    lineHeight: 40,
    borderRadius: 10,
    overflow: 'hidden',
  },
  menuButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: 'center',
  },
  signInButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  menuButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  signInButtonText: {
    color: colors.primary,
  },
  headerTitleText: {
    fontWeight: '700',
    fontSize: 18,
    color: colors.textDark,
    marginLeft: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
  },
  homeHeaderSafeArea: {
    backgroundColor: colors.white,
  },
  homeHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0,
    backgroundColor: colors.white,
  },
  homeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButtonFirst: {
    marginLeft: 0,
  },
  headerButton: {
    marginLeft: 8,
  },
});
