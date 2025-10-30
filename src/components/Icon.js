import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '../styles/colors';

// Emoji mapping for each icon type
const emojiMap = {
  robot: '🤖',
  notes: '📝',
  hospital: '🏥',
  chat: '💬',
  lightning: '⚡',
  stethoscope: '🩺',
  money: '💰',
  document: '📄',
  rocket: '🚀',
};

export const Icon = ({ type, size = 40, color = colors.primary, style, useEmoji = true }) => {
  const iconSize = { width: size, height: size };
  const [shouldUseEmoji, setShouldUseEmoji] = useState(useEmoji && Platform.OS === 'web');

  // Try to use emoji first if enabled
  if (shouldUseEmoji && emojiMap[type]) {
    return (
      <Text 
        style={[
          { 
            fontSize: size, 
            fontFamily: Platform.OS === 'web' ? 'Noto Color Emoji, Apple Color Emoji, Segoe UI Emoji, sans-serif' : undefined,
          }, 
          style
        ]}
      >
        {emojiMap[type]}
      </Text>
    );
  }
  
  const renderIcon = () => {
    switch (type) {
      case 'robot':
        return (
          <View style={[styles.iconBase, iconSize, { backgroundColor: color }, style]}>
            <View style={[styles.robotEyes, { backgroundColor: '#fff' }]} />
            <View style={[styles.robotMouth, { backgroundColor: '#fff' }]} />
          </View>
        );
      case 'notes':
        return (
          <View style={[styles.iconBase, iconSize, { backgroundColor: color }, style]}>
            <View style={[styles.noteLine, { backgroundColor: '#fff' }]} />
            <View style={[styles.noteLine, { backgroundColor: '#fff', marginTop: 4 }]} />
            <View style={[styles.noteLine, { backgroundColor: '#fff', marginTop: 4, width: '60%' }]} />
          </View>
        );
      case 'hospital':
        return (
          <View style={[styles.iconBase, iconSize, { backgroundColor: color }, style]}>
            <View style={[styles.cross, { backgroundColor: '#fff' }]} />
          </View>
        );
      case 'chat':
        return (
          <View style={[styles.iconBase, iconSize, { backgroundColor: color }, style]}>
            <View style={[styles.chatBubble, { borderColor: '#fff' }]} />
          </View>
        );
      case 'lightning':
        return (
          <View style={[styles.iconBase, iconSize, { backgroundColor: color }, style]}>
            <View style={[styles.lightning, { backgroundColor: '#fff' }]} />
          </View>
        );
      case 'stethoscope':
        return (
          <View style={[styles.iconBase, iconSize, { backgroundColor: color }, style]}>
            <View style={[styles.circle, { borderColor: '#fff' }]} />
            <View style={[styles.line, { backgroundColor: '#fff' }]} />
          </View>
        );
      case 'money':
        return (
          <View style={[styles.iconBase, iconSize, { backgroundColor: color }, style]}>
            <Text style={[styles.symbolText, { color: '#fff' }]}>$</Text>
          </View>
        );
      case 'clipboard':
        return (
          <View style={[styles.iconBase, iconSize, { backgroundColor: color }, style]}>
            <View style={[styles.clipboardTop, { backgroundColor: '#fff' }]} />
            <View style={[styles.clipboardBody, { borderColor: '#fff' }]} />
          </View>
        );
      case 'rocket':
        return (
          <View style={[styles.iconBase, iconSize, { backgroundColor: color }, style]}>
            <View style={[styles.rocket, { backgroundColor: '#fff' }]} />
          </View>
        );
      case 'star':
        return (
          <Text style={[styles.starText, { fontSize: size / 2, color }]}>★</Text>
        );
      case 'email':
        return (
          <View style={[styles.iconBase, iconSize, { backgroundColor: color }, style]}>
            <View style={[styles.envelope, { borderColor: '#fff' }]} />
          </View>
        );
      case 'play':
        return (
          <View style={[styles.iconBase, iconSize, { backgroundColor: color }, style]}>
            <View style={[styles.playTriangle, { borderLeftColor: '#fff' }]} />
          </View>
        );
      default:
        return (
          <View style={[styles.iconBase, iconSize, { backgroundColor: color }, style]}>
            <Text style={{ color: '#fff', fontSize: size / 2 }}>?</Text>
          </View>
        );
    }
  };

  return renderIcon();
};

const styles = StyleSheet.create({
  iconBase: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  robotEyes: {
    width: '40%',
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
  },
  robotMouth: {
    width: '50%',
    height: 3,
    borderRadius: 2,
  },
  noteLine: {
    width: '70%',
    height: 2,
    borderRadius: 1,
  },
  cross: {
    width: '60%',
    height: '60%',
    position: 'relative',
  },
  chatBubble: {
    width: '60%',
    height: '50%',
    borderWidth: 3,
    borderRadius: 8,
  },
  lightning: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    marginBottom: 2,
  },
  line: {
    width: 2,
    height: 12,
  },
  symbolText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  clipboardTop: {
    width: '30%',
    height: 3,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    marginBottom: 2,
  },
  clipboardBody: {
    width: '70%',
    height: '60%',
    borderWidth: 2,
    borderRadius: 4,
  },
  rocket: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  envelope: {
    width: '70%',
    height: '50%',
    borderWidth: 2,
    borderRadius: 4,
  },
  playTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  starText: {
    fontWeight: 'bold',
  },
});

export default Icon;
