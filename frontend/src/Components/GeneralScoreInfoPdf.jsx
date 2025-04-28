import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Font kaydı
Font.register({
  family: 'Open Sans',
  src: '/fonts/OpenSans-Regular.ttf',
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Open Sans',
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    textDecoration: 'underline',
    backgroundColor: '#e0e0e0',
    padding: 5,
    fontFamily: 'Open Sans',
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    fontFamily: 'Open Sans',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
  },
  cellHeader: {
    width: '40%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    fontWeight: 'bold',
    textAlign: 'left',
    fontFamily: 'Open Sans',
  },
  cell: {
    width: '60%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    textAlign: 'left',
    fontFamily: 'Open Sans',
  },
  subTitle: {
    fontSize: 14,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#e0e0e0',
    padding: 5,
    fontFamily: 'Open Sans',
  },
  checkboxSection: {
    marginTop: 10,
    paddingLeft: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  checkboxText: {
    fontSize: 11,
    flex: 1,
    textAlign: 'left',
    fontFamily: 'Open Sans',
  },
  checkbox: {
    width: 15,
    height: 15,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#000',
    textAlign: 'center',
    marginRight: 5,
    fontFamily: 'Open Sans',
  },
  checked: {
    backgroundColor: '#000',
    color: '#fff',
    fontFamily: 'Open Sans',
  },
  articleText: {
    fontSize: 11,
    marginLeft: 10,
    marginBottom: 5,
    fontFamily: 'Open Sans',
  },
});

const GeneralScoreInfoPdf = ({ profile }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>GENEL PUANLAMA BİLGİLERİ</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.cellHeader}>ADI SOYADI (ÜNVANI):</Text>
            <Text style={styles.cell}>{profile?.ad} {profile?.soyad}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellHeader}>TARİH:</Text>
            <Text style={styles.cell}>24 Nisan 2025</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellHeader}>BULUNDUĞU KURUM:</Text>
            <Text style={styles.cell}>Kocaeli Üniversitesi</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellHeader}>BAŞVURDUĞU AKADEMİK KADRO:</Text>
            <Text style={styles.cell}>Doçent</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellHeader}>İMZA:</Text>
            <Text style={styles.cell}>[İmza]</Text>
          </View>
        </View>

        <Text style={styles.subTitle}>PUANLANAN FAALİYET DÖNEMİ</Text>
        <View style={styles.checkboxSection}>
          <View style={styles.checkboxContainer}>
            <View style={[styles.checkbox, styles.checked]}>
              <Text>✓</Text>
            </View>
            <Text style={styles.checkboxText}>
              PROFESÖR (Doçent unvanını aldıktan sonraki faaliyetleri esas alınacaktır)
            </Text>
          </View>
          <View style={styles.checkboxContainer}>
            <View style={styles.checkbox} />
            <Text style={styles.checkboxText}>
              DOÇENT (Doktora/Sanatta yeterlik/ tıp diş uzmanlık unvanını aldıktan sonraki faaliyetleri esas alınacaktır)
            </Text>
          </View>
          <View style={styles.checkboxContainer}>
            <View style={styles.checkbox} />
            <Text style={styles.checkboxText}>
              Dr. Öğr. Üyesi (Yeniden Atama: Son atama tarihinden başvuru tarihine kadar dönem faaliyetleri esas alınacaktır)
            </Text>
          </View>
          <View style={styles.checkboxContainer}>
            <View style={styles.checkbox} />
            <Text style={styles.checkboxText}>
              Dr. Öğr. Üyesi (İlk Atama)
            </Text>
          </View>
        </View>

        <Text style={styles.subTitle}>ETKİNLİK</Text>
        <Text style={styles.subTitle}>
          A. Makaleler (Başvurulan bilim alanı ile ilgili tam araştırma ve derleme makaleleri)
        </Text>
        <Text style={styles.articleText}>1. Yapay Zeka ile Görüntü İşleme Teknikleri</Text>
        <Text style={styles.articleText}>2. Derin Öğrenme Modellerinde Optimizasyon Yöntemleri</Text>
      </View>
    </Page>
  </Document>
);

export default GeneralScoreInfoPdf;