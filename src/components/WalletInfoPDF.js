import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  body: {
    paddingTop: 32,
    paddingBottom: 48,
    paddingHorizontal: 32,
  },
  header: {
    fontSize: 12,
    marginBottom: 32,
    textAlign: 'center',
    color: 'grey',
  },
  title: {
    fontSize: 24,
    marginBottom: 12,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  box: {
    marginBottom: 12,
  },
  field: {
    fontSize: 14,
    marginBottom: 6,
    fontStyle: 'italic',
  },
  value: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 32,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
});

export const WalletInfoPDF = ({ firstName, lastName, name, type, address, privateKey }) => (
  <Document title={"Wallet Document"} author={`${lastName} ${firstName}`}>
    <Page style={styles.body}>
      <Text style={styles.header} fixed>
        {`~ Wallet Data for ${lastName} ${firstName} ~`}
      </Text>

      <Text style={styles.title}>Wallet Info</Text>

      <View style={styles.box}>
        <Text style={styles.field}>Name</Text>
        <Text style={styles.value}>{name}</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.field}>Address</Text>
        <Text style={styles.value}>{address}</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.field}>Private Key</Text>
        <Text style={styles.value}>{privateKey}</Text>
      </View>

      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        fixed
      />
    </Page>
  </Document>
);
