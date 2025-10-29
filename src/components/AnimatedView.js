import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

// Fade In Animation
export const FadeInView = ({ children, duration = 600, delay = 0, style }) => {
  const opacity = useSharedValue(0);
  const isFocused = useIsFocused(); // restart animation only when the hosting screen is active

  useEffect(() => {
    if (!isFocused) {
      cancelAnimation(opacity);
      opacity.value = 0;
      return;
    }

    opacity.value = 0;
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration,
        easing: Easing.out(Easing.ease),
      })
    );

    return () => cancelAnimation(opacity);
  }, [delay, duration, isFocused, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
};

// Slide In From Bottom
export const SlideInView = ({ children, duration = 500, delay = 0, style }) => {
  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);
  const isFocused = useIsFocused(); // avoid animating while the screen is blurred

  useEffect(() => {
    if (!isFocused) {
      cancelAnimation(translateY);
      cancelAnimation(opacity);
      translateY.value = 50;
      opacity.value = 0;
      return;
    }

    translateY.value = 50;
    opacity.value = 0;
    translateY.value = withDelay(
      delay,
      withSpring(0, {
        damping: 15,
        stiffness: 100,
      })
    );
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration,
        easing: Easing.out(Easing.ease),
      })
    );

    return () => {
      cancelAnimation(translateY);
      cancelAnimation(opacity);
    };
  }, [delay, duration, isFocused, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
};

// Scale In Animation
export const ScaleInView = ({ children, duration = 400, delay = 0, style }) => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const isFocused = useIsFocused(); // keep spring work offscreen

  useEffect(() => {
    if (!isFocused) {
      cancelAnimation(scale);
      cancelAnimation(opacity);
      scale.value = 0.8;
      opacity.value = 0;
      return;
    }

    scale.value = 0.8;
    opacity.value = 0;
    scale.value = withDelay(
      delay,
      withSpring(1, {
        damping: 12,
        stiffness: 120,
      })
    );
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration,
        easing: Easing.out(Easing.ease),
      })
    );

    return () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
    };
  }, [delay, duration, isFocused, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
};

// Pressable with Scale Animation
export const AnimatedPressable = ({ children, onPress, style, activeScale = 0.95 }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(activeScale, {
      damping: 15,
      stiffness: 150,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
  };

  return (
    <Animated.View
      style={[style, animatedStyle]}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
      onTouchCancel={handlePressOut}
    >
      <View onTouchEnd={onPress}>{children}</View>
    </Animated.View>
  );
};

// Stagger Children Animation
export const StaggerView = ({ children, staggerDelay = 100, style }) => {
  return (
    <View style={style}>
      {React.Children.map(children, (child, index) => (
        <SlideInView delay={index * staggerDelay}>{child}</SlideInView>
      ))}
    </View>
  );
};
