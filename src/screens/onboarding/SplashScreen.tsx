import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle, Polygon } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export const SplashScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  useEffect(() => {
    // Navigate to Welcome screen after 2.5 seconds
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigation]);

  const centerX = width / 2;
  const centerY = height / 2;
  const innerRadius = width * 0.55;
  const outerRadius = width * 0.95;

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#FFF5F7', '#FCF8FF', '#FFFFFF']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Decorative Circles and Particles */}
      <View style={StyleSheet.absoluteFillObject}>
        <Svg width={width} height={height}>
          {/* Inner Circle */}
          <Circle
            cx={centerX}
            cy={centerY}
            r={innerRadius}
            stroke="#EAEAEA"
            strokeWidth={1.5}
            fill="none"
          />
          {/* Outer Circle */}
          <Circle
            cx={centerX}
            cy={centerY}
            r={outerRadius}
            stroke="#EAEAEA"
            strokeWidth={1.5}
            fill="none"
          />

          {/* Top right pink triangle on outer circle */}
          <Polygon
            points="0,-6 6,5 -6,5"
            fill="#D660A7"
            x={centerX + outerRadius * Math.cos(-Math.PI / 3)}
            y={centerY + outerRadius * Math.sin(-Math.PI / 3)}
            rotation={45}
          />

          {/* Bottom purple dot on inner circle */}
          <Circle
            cx={centerX + innerRadius * Math.cos(Math.PI * 0.35)}
            cy={centerY + innerRadius * Math.sin(Math.PI * 0.35)}
            r={5}
            fill="#B344FF"
          />

          {/* Bottom left orange triangle on outer circle */}
          <Polygon
            points="0,-6 6,5 -6,5"
            fill="#FF8A65"
            x={centerX + outerRadius * Math.cos(Math.PI * 0.75)}
            y={centerY + outerRadius * Math.sin(Math.PI * 0.75)}
            rotation={-45}
          />
        </Svg>
      </View>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/logo/Logo-text.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logo: {
    width: 100,
    height: 100,
  },
});
