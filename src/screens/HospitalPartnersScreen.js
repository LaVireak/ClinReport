import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { AIAnalysisService } from '../services/AIAnalysisService';
import { colors } from '../styles/colors';

const HospitalPartnersScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // all, meetdoctors, emergency, icu

  // Get all hospitals from AI service
  const allHospitals = AIAnalysisService.HOSPITALS;

  // Filter hospitals based on search and filters
  const filteredHospitals = allHospitals.filter(hospital => {
    // Search filter
    const matchesSearch = hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hospital.address.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    let matchesFilter = true;
    if (selectedFilter === 'meetdoctors') {
      matchesFilter = hospital.meetDoctorsPartner;
    } else if (selectedFilter === 'emergency') {
      matchesFilter = hospital.hasEmergency;
    } else if (selectedFilter === 'icu') {
      matchesFilter = hospital.hasICU;
    }

    return matchesSearch && matchesFilter;
  });

  // Filter options
  const filters = [
    { id: 'all', label: 'All Hospitals', icon: '🏥' },
    { id: 'meetdoctors', label: 'MeetDoctors', icon: '🤝' },
    { id: 'emergency', label: '24/7 Emergency', icon: '🚨' },
    { id: 'icu', label: 'ICU Available', icon: '🏥' },
  ];

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
        <Text style={styles.headerTitle}>🏥 Hospital Partners</Text>
        <Text style={styles.headerSubtitle}>
          {allHospitals.length} partner hospitals in Phnom Penh
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search hospitals..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textLight}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {filters.map(filter => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                selectedFilter === filter.id && styles.filterChipActive
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text style={styles.filterChipIcon}>{filter.icon}</Text>
              <Text style={[
                styles.filterChipText,
                selectedFilter === filter.id && styles.filterChipTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* MeetDoctors Partnership Banner */}
        <View style={styles.partnerBanner}>
          <Text style={styles.partnerBannerIcon}>🤝</Text>
          <View style={styles.partnerBannerContent}>
            <Text style={styles.partnerBannerTitle}>MeetDoctors Partnership</Text>
            <Text style={styles.partnerBannerText}>
              Book appointments directly with our partner hospitals and get priority access to top doctors
            </Text>
          </View>
        </View>

        {/* Results Count */}
        <View style={styles.resultsBar}>
          <Text style={styles.resultsText}>
            {filteredHospitals.length} {filteredHospitals.length === 1 ? 'hospital' : 'hospitals'} found
          </Text>
        </View>

        {/* Hospital List */}
        {filteredHospitals.map((hospital, index) => (
          <TouchableOpacity
            key={index}
            style={styles.hospitalCard}
            onPress={() => navigation.navigate('HospitalDetail', { hospital })}
          >
            {/* MeetDoctors Badge */}
            {hospital.meetDoctorsPartner && (
              <View style={styles.partnerBadge}>
                <Text style={styles.partnerBadgeText}>🤝 MeetDoctors Partner</Text>
              </View>
            )}

            <View style={styles.hospitalHeader}>
              <Text style={styles.hospitalIcon}>🏥</Text>
              <View style={styles.hospitalInfo}>
                <Text style={styles.hospitalName}>{hospital.name}</Text>
                <Text style={styles.hospitalAddress}>{hospital.address}</Text>
                {hospital.distance && (
                  <Text style={styles.hospitalDistance}>📍 {hospital.distance}</Text>
                )}
              </View>
            </View>

            {/* Services */}
            <View style={styles.servicesRow}>
              {hospital.hasEmergency && (
                <View style={styles.serviceTag}>
                  <Text style={styles.serviceTagText}>🚨 24/7 Emergency</Text>
                </View>
              )}
              {hospital.hasICU && (
                <View style={styles.serviceTag}>
                  <Text style={styles.serviceTagText}>🏥 ICU</Text>
                </View>
              )}
              {hospital.hasAmbulance && (
                <View style={styles.serviceTag}>
                  <Text style={styles.serviceTagText}>🚑 Ambulance</Text>
                </View>
              )}
            </View>

            {/* Specialties */}
            {hospital.specialties && hospital.specialties.length > 0 && (
              <View style={styles.specialtiesRow}>
                <Text style={styles.specialtiesLabel}>Specialties:</Text>
                <Text style={styles.specialtiesText}>
                  {hospital.specialties.slice(0, 3).join(', ')}
                  {hospital.specialties.length > 3 && ` +${hospital.specialties.length - 3} more`}
                </Text>
              </View>
            )}

            {/* Available Doctors */}
            {hospital.doctorCount && (
              <View style={styles.doctorsRow}>
                <Text style={styles.doctorsIcon}>👨‍⚕️</Text>
                <Text style={styles.doctorsText}>
                  {hospital.doctorCount} {hospital.doctorCount === 1 ? 'doctor' : 'doctors'} available
                </Text>
              </View>
            )}

            {/* Action Button */}
            <TouchableOpacity 
              style={styles.viewButton}
              onPress={() => navigation.navigate('HospitalDetail', { hospital })}
            >
              <Text style={styles.viewButtonText}>View Details →</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        {/* Empty State */}
        {filteredHospitals.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🔍</Text>
            <Text style={styles.emptyStateTitle}>No hospitals found</Text>
            <Text style={styles.emptyStateText}>
              Try adjusting your search or filters
            </Text>
          </View>
        )}

        {/* Info Section */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>ℹ️ About Our Hospital Partners</Text>
          <Text style={styles.infoText}>
            ClinReport partners with leading hospitals in Phnom Penh to provide you with:
          </Text>
          <View style={styles.infoBullet}>
            <Text style={styles.infoBulletIcon}>✅</Text>
            <Text style={styles.infoBulletText}>Direct appointment booking</Text>
          </View>
          <View style={styles.infoBullet}>
            <Text style={styles.infoBulletIcon}>✅</Text>
            <Text style={styles.infoBulletText}>AI-powered doctor recommendations</Text>
          </View>
          <View style={styles.infoBullet}>
            <Text style={styles.infoBulletIcon}>✅</Text>
            <Text style={styles.infoBulletText}>Priority access for Premium members</Text>
          </View>
          <View style={styles.infoBullet}>
            <Text style={styles.infoBulletIcon}>✅</Text>
            <Text style={styles.infoBulletText}>Seamless health data sharing</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  backButton: {
    marginBottom: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    margin: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textDark,
  },
  clearIcon: {
    fontSize: 20,
    color: colors.textLight,
    padding: 4,
  },
  filtersContainer: {
    marginBottom: 10,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  filterChipText: {
    fontSize: 14,
    color: colors.textDark,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: colors.white,
  },
  partnerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  partnerBannerIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  partnerBannerContent: {
    flex: 1,
  },
  partnerBannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  partnerBannerText: {
    fontSize: 13,
    color: colors.textDark,
    lineHeight: 18,
  },
  resultsBar: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  resultsText: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '600',
  },
  hospitalCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  partnerBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  partnerBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
  },
  hospitalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  hospitalIcon: {
    fontSize: 36,
    marginRight: 12,
  },
  hospitalInfo: {
    flex: 1,
    paddingRight: 100, // Space for badge
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  hospitalAddress: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 18,
    marginBottom: 4,
  },
  hospitalDistance: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  servicesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  serviceTag: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  serviceTagText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  specialtiesRow: {
    marginBottom: 12,
  },
  specialtiesLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 4,
  },
  specialtiesText: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 18,
  },
  doctorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  doctorsIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  doctorsText: {
    fontSize: 13,
    color: colors.textDark,
    fontWeight: '600',
  },
  viewButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
    marginBottom: 12,
  },
  infoBullet: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  infoBulletIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  infoBulletText: {
    flex: 1,
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
});

export default HospitalPartnersScreen;
