// Design tokens based on Diaspora App Design Spec
export const colors = {
  // Primary palette
  primaryGold: '#F2C206',
  primaryOrange: '#F27300',
  deepNavy: '#0A2758',
  forestGreen: '#297A45',
  
  // Neutrals
  lightGray: '#F5F5F5',
  textDark: '#1A1A1A',
  textLight: '#666666',
  
  // Semantic colors
  successGreen: '#10B981',
  errorRed: '#EF4444',
  border: '#E5E7EB',
  
  // WhatsApp green (from spec)
  whatsappGreen: '#25D366',
};

export const typography = {
  // Font sizes
  headline: {
    fontSize: 28, // Average of 24-32px
    lineHeight: 34, // 1.2x for headlines
  },
  subhead: {
    fontSize: 18, // Average of 16-20px
    lineHeight: 29, // 1.6x for body
  },
  body: {
    fontSize: 14,
    lineHeight: 22, // 1.6x for body
  },
  small: {
    fontSize: 12,
    lineHeight: 19, // 1.6x for body
  },
  caption: {
    fontSize: 10,
    lineHeight: 16, // 1.6x for body
  },
  
  // Font weights
  weights: {
    light: 300,
    regular: 400,
    semibold: 600,
    bold: 700,
  },
};

export const spacing = {
  // Based on 8px baseline grid
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  
  // Specific values from spec
  gutters: 20,
  cardPadding: 16,
  componentSpacing: 16,
  safeAreaBottom: 44,
};

export const radius = {
  sm: 6,
  md: 8,
  lg: 12,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 5,
  },
};