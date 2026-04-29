import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, typography, radius, spacing } from '../constants/designTokens';

// Button variants
export const Button = ({ 
  children, 
  onPress, 
  variant = 'primary', // primary, secondary, whatsapp, danger
  size = 'medium', // large, medium, small
  disabled = false,
  ...props 
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primary;
      case 'secondary':
        return styles.secondary;
      case 'whatsapp':
        return styles.whatsapp;
      case 'danger':
        return styles.danger;
      default:
        return styles.primary;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'whatsapp':
        return styles.whatsappText;
      case 'danger':
        return styles.dangerText;
      default:
        return styles.primaryText;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'large':
        return styles.sizeLarge;
      case 'small':
        return styles.sizeSmall;
      default: // medium
        return styles.sizeMedium;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.container,
        getButtonStyle(),
        getSizeStyle(),
        disabled && styles.disabled,
        props.style,
      ]}
    >
      <Text style={[styles.text, getTextStyle(), disabled && styles.disabledText]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  
  // Variants
  primary: {
    backgroundColor: colors.primaryGold,
  },
  secondary: {
    borderWidth: 1,
    borderColor: colors.deepNavy,
    backgroundColor: 'transparent',
  },
  whatsapp: {
    backgroundColor: colors.whatsappGreen,
  },
  danger: {
    backgroundColor: colors.errorRed,
  },
  
  // Text variants
  primaryText: {
    color: colors.deepNavy,
    fontWeight: typography.weights.semibold,
  },
  secondaryText: {
    color: colors.deepNavy,
    fontWeight: typography.weights.semibold,
  },
  whatsappText: {
    color: '#fff',
    fontWeight: typography.weights.semibold,
  },
  dangerText: {
    color: '#fff',
    fontWeight: typography.weights.semibold,
  },
  
  // Sizes
  sizeLarge: {
    height: 50, // Large: 50px
    paddingHorizontal: spacing.lg,
  },
  sizeMedium: {
    height: 44, // Medium: 44px
    paddingHorizontal: spacing.md,
  },
  sizeSmall: {
    height: 36, // Small: 36px
    paddingHorizontal: spacing.sm,
  },
  
  // Disabled states
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
  
  // Text base
  text: {
    textAlign: 'center',
    fontSize: typography.body.fontSize,
  },
});