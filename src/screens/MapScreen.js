import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Dimensions,
} from 'react-native';
import { colors } from '../styles/colors';
import AIAnalysisService from '../services/AIAnalysisService';

const { width, height } = Dimensions.get('window');

const MapScreen = ({ navigation, route }) => {
  const [userLocation, setUserLocation] = useState({
    lat: 11.5564, // Default to central Phnom Penh
    lng: 104.9282,
  });
  const [selectedType, setSelectedType] = useState('all'); // all, hospitals, doctors
  const [nearbyPlaces, setNearbyPlaces] = useState([]);

  useEffect(() => {
    loadNearbyPlaces();
  }, [selectedType]);

  const loadNearbyPlaces = () => {
    const hospitals = AIAnalysisService.HOSPITALS.map(hospital => ({
      ...hospital,
      type: 'hospital',
      distance: calculateDistance(userLocation, hospital.location),
    }));

    const doctors = AIAnalysisService.DOCTORS.map(doctor => ({
      ...doctor,
      type: 'doctor',
      distance: Math.random() * 5, // Mock distance for doctors
    }));

    let places = [];
    if (selectedType === 'all') {
      places = [...hospitals, ...doctors];
    } else if (selectedType === 'hospitals') {
      places = hospitals;
    } else {
      places = doctors;
    }

    // Sort by distance
    places.sort((a, b) => a.distance - b.distance);
    setNearbyPlaces(places);
  };

  const calculateDistance = (point1, point2) => {
    // Simple distance calculation (Haversine formula simplified)
    const R = 6371; // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const openInMaps = (location, name) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
    Linking.openURL(url).catch(() => 
      Alert.alert('Error', 'Unable to open maps')
    );
  };

  const callPhone = (phone) => {
    const phoneUrl = `tel:${phone}`;
    Linking.openURL(phoneUrl).catch(() =>
      Alert.alert('Error', 'Unable to make call')
    );
  };

  const renderHospitalCard = (hospital) => (
    <View key={`hospital-${hospital.id}`} style={styles.placeCard}>
      <View style={styles.placeHeader}>
        <View style={styles.placeIconContainer}>
          <Text style={styles.placeIcon}>🏥</Text>
        </View>
        <View style={styles.placeInfo}>
          <Text style={styles.placeName}>{hospital.name}</Text>
          <Text style={styles.placeSubtitle}>
            {hospital.type === 'private' ? '🔵 Private' : '🟢 Public'} • {hospital.distance.toFixed(1)} km away
          </Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>⭐ {hospital.rating}</Text>
            {hospital.hasEmergency && (
              <View style={styles.emergencyBadge}>
                <Text style={styles.emergencyText}>🚨 24/7 Emergency</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>📍 {hospital.address}</Text>
        <Text style={styles.detailText}>📞 {hospital.phone}</Text>
        {hospital.specialties && (
          <View style={styles.specialtiesContainer}>
            {hospital.specialties.slice(0, 3).map((specialty, index) => (
              <View key={index} style={styles.specialtyTag}>
                <Text style={styles.specialtyText}>{specialty}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.directionsButton]}
          onPress={() => openInMaps(hospital.location, hospital.name)}
        >
          <Text style={styles.actionButtonText}>🗺️ Directions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.callButton]}
          onPress={() => callPhone(hospital.phone)}
        >
          <Text style={styles.actionButtonText}>📞 Call</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.detailsButton]}
          onPress={() => navigation.navigate('HospitalDetail', { hospital })}
        >
          <Text style={styles.actionButtonText}>ℹ️ Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDoctorCard = (doctor) => (
    <View key={`doctor-${doctor.id}`} style={styles.placeCard}>
      <View style={styles.placeHeader}>
        <View style={styles.placeIconContainer}>
          <Text style={styles.placeIcon}>👨‍⚕️</Text>
        </View>
        <View style={styles.placeInfo}>
          <Text style={styles.placeName}>{doctor.name}</Text>
          <Text style={styles.placeSubtitle}>
            {doctor.specialty} • {doctor.experience}
          </Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>⭐ {doctor.rating}</Text>
            {doctor.partnerId === 'meetdoctors' && (
              <View style={styles.partnerBadge}>
                <Text style={styles.partnerText}>🤝 MeetDoctors</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>🏥 {doctor.hospital}</Text>
        <Text style={styles.detailText}>💰 {doctor.consultationFee}</Text>
        <Text style={styles.detailText}>
          🗣️ {doctor.languages.join(', ')}
        </Text>
        <Text style={styles.detailText}>
          📅 {doctor.availability === 'online' ? 'Available Online' : 'Hospital Only'}
        </Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.bookButton]}
          onPress={() => handleBookDoctor(doctor)}
        >
          <Text style={styles.actionButtonText}>📅 Book Consultation</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.callButton]}
          onPress={() => handleCallDoctor(doctor)}
        >
          <Text style={styles.actionButtonText}>📞 Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleBookDoctor = (doctor) => {
    Alert.alert(
      'Book Consultation',
      `Book a consultation with ${doctor.name}?\n\nFee: ${doctor.consultationFee}\nType: ${doctor.availability === 'online' ? 'Online Video Call' : 'In-Person'}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Book Now',
          onPress: () => {
            Alert.alert(
              'Success! 🎉',
              `Your consultation with ${doctor.name} has been booked. You will receive a confirmation via email/SMS shortly.`
            );
          },
        },
      ]
    );
  };

  const handleCallDoctor = (doctor) => {
    Alert.alert(
      'Call Doctor',
      `Call ${doctor.name} for consultation?\n\nConsultation fee: ${doctor.consultationFee}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call Now',
          onPress: () => {
            // In real app, this would connect to doctor's line
            const phoneNumber = '+855 23 991 000'; // Hospital main line
            callPhone(phoneNumber);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🗺️ Nearby Medical Services</Text>
        <Text style={styles.headerSubtitle}>
          Find the nearest hospitals and doctors
        </Text>
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapPlaceholder}>
        <View style={styles.mapMarker}>
          <Text style={styles.mapMarkerText}>📍</Text>
          <Text style={styles.mapMarkerLabel}>Your Location</Text>
        </View>
        <Text style={styles.mapInfo}>
          📍 Phnom Penh, Cambodia
        </Text>
        <Text style={styles.mapNote}>
          Showing medical services within 10km radius
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <TouchableOpacity
          style={[styles.filterTab, selectedType === 'all' && styles.filterTabActive]}
          onPress={() => setSelectedType('all')}
        >
          <Text style={[styles.filterTabText, selectedType === 'all' && styles.filterTabTextActive]}>
            All ({nearbyPlaces.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, selectedType === 'hospitals' && styles.filterTabActive]}
          onPress={() => setSelectedType('hospitals')}
        >
          <Text style={[styles.filterTabText, selectedType === 'hospitals' && styles.filterTabTextActive]}>
            🏥 Hospitals
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, selectedType === 'doctors' && styles.filterTabActive]}
          onPress={() => setSelectedType('doctors')}
        >
          <Text style={[styles.filterTabText, selectedType === 'doctors' && styles.filterTabTextActive]}>
            👨‍⚕️ Doctors
          </Text>
        </TouchableOpacity>
      </View>

      {/* Results List */}
      <ScrollView style={styles.resultsContainer}>
        {nearbyPlaces.map(place => 
          place.type === 'hospital' ? renderHospitalCard(place) : renderDoctorCard(place)
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.white,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textLight,
  },
  mapPlaceholder: {
    backgroundColor: colors.gray100,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mapMarker: {
    alignItems: 'center',
    marginBottom: 10,
  },
  mapMarkerText: {
    fontSize: 48,
  },
  mapMarkerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    marginTop: 5,
  },
  mapInfo: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginTop: 10,
  },
  mapNote: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 5,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: colors.gray100,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
  },
  filterTabTextActive: {
    color: colors.white,
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  placeCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  placeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  placeIcon: {
    fontSize: 32,
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  placeSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.warning,
    marginRight: 8,
  },
  emergencyBadge: {
    backgroundColor: colors.error + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  emergencyText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.error,
  },
  partnerBadge: {
    backgroundColor: colors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  partnerText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.success,
  },
  detailsContainer: {
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailText: {
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 6,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  specialtyTag: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  specialtyText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    textTransform: 'capitalize',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  directionsButton: {
    backgroundColor: colors.primary,
  },
  callButton: {
    backgroundColor: colors.success,
  },
  detailsButton: {
    backgroundColor: colors.info,
  },
  bookButton: {
    backgroundColor: colors.primary,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default MapScreen;
