import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '../styles/colors';

// Icon fallbacks for emojis
const IconFallback = ({ type, size = 40, color = colors.primary }) => {
  const iconSize = size;
  const iconColor = color;

  const icons = {
    robot: (
      <View style={[styles.iconContainer, { width: iconSize, height: iconSize }]}>
        <View style={[styles.robotHead, { borderColor: iconColor, borderWidth: 2 }]}>
          <View style={styles.robotEyes}>
            <View style={[styles.robotEye, { backgroundColor: iconColor }]} />
            <View style={[styles.robotEye, { backgroundColor: iconColor }]} />
          </View>
          <View style={[styles.robotMouth, { backgroundColor: iconColor }]} />
        </View>
      </View>
    ),
    note: (
      <View style={[styles.iconContainer, { width: iconSize, height: iconSize }]}>
        <View style={[styles.noteIcon, { borderColor: iconColor, borderWidth: 2 }]}>
          <View style={[styles.noteLine, { backgroundColor: iconColor }]} />
          <View style={[styles.noteLine, { backgroundColor: iconColor }]} />
          <View style={[styles.noteLine, { backgroundColor: iconColor }]} />
        </View>
      </View>
    ),
    hospital: (
      <View style={[styles.iconContainer, { width: iconSize, height: iconSize }]}>
        <View style={[styles.hospitalIcon, { borderColor: iconColor, borderWidth: 2 }]}>
          <View style={[styles.cross, { backgroundColor: iconColor }]} />
          <View style={[styles.crossHorizontal, { backgroundColor: iconColor }]} />
        </View>
      </View>
    ),
    stethoscope: (
      <View style={[styles.iconContainer, { width: iconSize, height: iconSize }]}>
        <View style={[styles.stethoscopeIcon, { borderColor: iconColor, borderWidth: 2 }]}>
          <View style={[styles.stethoscopeCircle, { borderColor: iconColor, borderWidth: 2 }]} />
        </View>
      </View>
    ),
    chat: (
      <View style={[styles.iconContainer, { width: iconSize, height: iconSize }]}>
        <View style={[styles.chatBubble, { borderColor: iconColor, borderWidth: 2 }]}>
          <View style={[styles.chatDot, { backgroundColor: iconColor }]} />
          <View style={[styles.chatDot, { backgroundColor: iconColor }]} />
          <View style={[styles.chatDot, { backgroundColor: iconColor }]} />
        </View>
      </View>
    ),
    lightning: (
      <View style={[styles.iconContainer, { width: iconSize, height: iconSize }]}>
        <View style={[styles.lightningIcon, { backgroundColor: iconColor }]} />
      </View>
    ),
    rocket: (
      <View style={[styles.iconContainer, { width: iconSize, height: iconSize }]}>
        <View style={[styles.rocketIcon, { backgroundColor: iconColor }]} />
      </View>
    ),
    money: (
      <View style={[styles.iconContainer, { width: iconSize, height: iconSize }]}>
        <View style={[styles.moneyIcon, { borderColor: iconColor, borderWidth: 2 }]}>
          <Text style={[styles.moneySymbol, { color: iconColor }]}>$</Text>
        </View>
      </View>
    ),
    document: (
      <View style={[styles.iconContainer, { width: iconSize, height: iconSize }]}>
        <View style={[styles.documentIcon, { borderColor: iconColor, borderWidth: 2 }]}>
          <View style={[styles.documentLine, { backgroundColor: iconColor }]} />
          <View style={[styles.documentLine, { backgroundColor: iconColor }]} />
        </View>
      </View>
    ),
  };

  return icons[type] || icons.robot;
};

const EmojiIcon = ({ emoji, fallbackType, size = 40, style, textStyle }) => {
  const [useEmoji, setUseEmoji] = useState(true);

  useEffect(() => {
    // On web, check if emojis are supported
    if (Platform.OS === 'web') {
      // Try to detect emoji support
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillText(emoji, 0, 0);
        const imageData = ctx.getImageData(0, 0, 1, 1).data;
        // If the emoji renders as all zeros, it's not supported
        const hasColor = imageData[0] !== 0 || imageData[1] !== 0 || imageData[2] !== 0;
        if (!hasColor) {
          setUseEmoji(false);
        }
      }
    }
  }, [emoji]);

  if (useEmoji) {
    return (
      <Text style={[{ fontSize: size, fontFamily: Platform.OS === 'web' ? 'Noto Color Emoji, Apple Color Emoji, Segoe UI Emoji, sans-serif' : undefined }, textStyle, style]}>
        {emoji}
      </Text>
    );
  }

  return <IconFallback type={fallbackType} size={size} />;
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Robot icon
  robotHead: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  robotEyes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 20,
    marginBottom: 4,
  },
  robotEye: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  robotMouth: {
    width: 12,
    height: 3,
    borderRadius: 2,
  },
  // Note icon
  noteIcon: {
    width: 30,
    height: 35,
    borderRadius: 4,
    padding: 6,
    justifyContent: 'space-around',
  },
  noteLine: {
    height: 2,
    width: '100%',
    borderRadius: 1,
  },
  // Hospital icon
  hospitalIcon: {
    width: 35,
    height: 35,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cross: {
    width: 3,
    height: 18,
    position: 'absolute',
  },
  crossHorizontal: {
    width: 18,
    height: 3,
    position: 'absolute',
  },
  // Stethoscope icon
  stethoscopeIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderBottomWidth: 0,
    borderLeftWidth: 3,
  },
  stethoscopeCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    bottom: -6,
    left: 7,
  },
  // Chat bubble icon
  chatBubble: {
    width: 32,
    height: 26,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  chatDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginHorizontal: 2,
  },
  // Lightning icon
  lightningIcon: {
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderTopWidth: 25,
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  // Rocket icon
  rocketIcon: {
    width: 20,
    height: 30,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  // Money icon
  moneyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moneySymbol: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  // Document icon
  documentIcon: {
    width: 26,
    height: 32,
    borderRadius: 4,
    padding: 6,
    justifyContent: 'center',
  },
  documentLine: {
    height: 2,
    width: '100%',
    marginVertical: 3,
    borderRadius: 1,
  },
});

export default EmojiIcon;
