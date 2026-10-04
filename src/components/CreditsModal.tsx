import React from 'react';
import {
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { THEME } from '../theme/theme';

interface CreditsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function CreditsModal({ visible, onClose }: CreditsModalProps) {
  const handleOpenWebsite = () => {
    Linking.openURL(THEME.branding.website).catch(() => {});
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header Icon */}
          <View style={styles.logoBadge}>
            <Text style={styles.logoEmoji}>⌨️</Text>
          </View>

          <Text style={styles.appTitle}>{THEME.branding.name}</Text>
          <Text style={styles.appVersion}>v{THEME.branding.version} • Bluetooth HID Device</Text>

          {/* DigiBusTech info */}
          <View style={styles.card}>
            <Text style={styles.creditHeading}>DEVELOPED & MAINTAINED BY</Text>
            <Text style={styles.companyName}>{THEME.branding.company}</Text>
            <Text style={styles.companyTagline}>{THEME.branding.tagline}</Text>

            <TouchableOpacity
              style={styles.websiteButton}
              onPress={handleOpenWebsite}
              activeOpacity={0.8}>
              <Text style={styles.websiteButtonText}>
                Visit {THEME.branding.company} Website ↗
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.descriptionText}>
            Emulating standard USB HID composite peripheral without any server or
            driver needed on host PCs, Macs, TVs, and gaming consoles.
          </Text>

          {/* Close button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: THEME.colors.bgCard,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: THEME.colors.borderMedium,
    alignItems: 'center',
    elevation: 10,
    shadowColor: THEME.colors.accentCyan,
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: THEME.colors.bgCardElevated,
    borderWidth: 1.5,
    borderColor: THEME.colors.accentCyan,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoEmoji: {
    fontSize: 28,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  appVersion: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 2,
    marginBottom: 16,
  },
  card: {
    width: '100%',
    backgroundColor: THEME.colors.bgSurface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.borderSubtle,
    alignItems: 'center',
    marginBottom: 16,
  },
  creditHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.accentCyan,
    letterSpacing: 1.2,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    marginTop: 4,
  },
  companyTagline: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  websiteButton: {
    backgroundColor: THEME.colors.accentBlue,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  websiteButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  descriptionText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 16,
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: THEME.colors.bgCardElevated,
    borderWidth: 1,
    borderColor: THEME.colors.borderSubtle,
  },
  closeButtonText: {
    color: THEME.colors.textPrimary,
    fontWeight: '700',
    fontSize: 13,
  },
});
