// src/componentes/PerfilModal.tsx
// Modal de perfil do usuário com dados e opção de sair

import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Modal, Alert, ScrollView,
} from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

interface PerfilModalProps {
  visible: boolean;
  onClose: () => void;
  nome: string;
  email: string;
  usuarioId: string | null;
  onSair: () => void;
}

export default function PerfilModal({
  visible, onClose, nome, email, usuarioId, onSair,
}: PerfilModalProps) {

  const iniciais = nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');

  const confirmarSaida = () => {
    Alert.alert(
      'Sair da conta',
      'Deseja realmente sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: onSair,
        },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>

          {/* Alça */}
          <View style={styles.handle} />

          {/* Cabeçalho */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Meu Perfil</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>

            {/* Avatar + nome */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{iniciais}</Text>
              </View>
              <Text style={styles.nomeText}>{nome}</Text>
              <Text style={styles.emailText}>{email}</Text>
            </View>

            {/* Dados do perfil */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Informações da conta</Text>

              <View style={styles.infoRow}>
                <View style={styles.infoIconBox}>
                  <FontAwesome5 name="user" size={14} color="#3B82F6" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Nome completo</Text>
                  <Text style={styles.infoValue}>{nome}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.infoIconBox}>
                  <FontAwesome5 name="envelope" size={14} color="#3B82F6" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>E-mail</Text>
                  <Text style={styles.infoValue}>{email}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.infoIconBox}>
                  <FontAwesome5 name="id-badge" size={14} color="#3B82F6" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>ID do usuário</Text>
                  <Text style={styles.infoValue}>#{usuarioId ?? '—'}</Text>
                </View>
              </View>
            </View>

            {/* Botão Sair */}
            <TouchableOpacity style={styles.sairBtn} onPress={confirmarSaida} activeOpacity={0.8}>
              <FontAwesome5 name="sign-out-alt" size={16} color="#EF4444" style={{ marginRight: 10 }} />
              <Text style={styles.sairText}>Sair da conta</Text>
            </TouchableOpacity>

            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    minHeight: '65%',
    borderWidth: 1,
    borderColor: '#334155',
  },
  handle: {
    width: 40, height: 4,
    backgroundColor: '#334155',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeBtn: {
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Avatar
  avatarSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarCircle: {
    width: 80, height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#60A5FA',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  nomeText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emailText: {
    color: '#94A3B8',
    fontSize: 14,
  },

  // Card de informações
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoIconBox: {
    width: 36, height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  infoContent: { flex: 1 },
  infoLabel: {
    color: '#64748B',
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#1E293B',
    marginVertical: 2,
  },

  // Botão sair
  sairBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  sairText: {
    color: '#EF4444',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
