import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    textDecoration: 'underline',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  row: {
    flexDirection: 'row',
  },
  cellHeader: {
    backgroundColor: '#eeeeee',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    fontWeight: 'bold',
    width: '50%',
  },
  cell: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    width: '50%',
  },
});

const PersonalInfoPdf = ({ profile }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Genel Kişisel Bilgiler</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.cellHeader}>Adı Soyadı</Text>
            <Text style={styles.cell}>{profile?.ad} {profile?.soyad}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellHeader}>Doğum Yılı</Text>
            <Text style={styles.cell}>{profile?.dogumYili}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellHeader}>Rol</Text>
            <Text style={styles.cell}>{profile?.rol}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellHeader}>TC</Text>
            <Text style={styles.cell}>{profile?.tc}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellHeader}>Email</Text>
            <Text style={styles.cell}>{profile?.email}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default PersonalInfoPdf;
