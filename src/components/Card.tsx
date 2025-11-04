import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type CardProps = {
  title: string;
  value: string;
  subtitle: string;
  color: string;
};

export const Card: React.FC<CardProps> = ({ title, value, subtitle, color }) => {
  return (
    <View style={[styles.card, { borderColor: color }]}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={[styles.cardValue, { color }]}>{value}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '47%',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    color: '#555',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
});
