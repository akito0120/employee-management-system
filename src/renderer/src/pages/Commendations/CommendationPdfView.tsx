import { Document, Page, PDFViewer, StyleSheet, Text, View } from '@react-pdf/renderer';
import { trpc } from '@renderer/trpc';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#333'
  },
  // ヘッダー部分
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#1e293b',
    paddingBottom: 10,
    marginBottom: 20
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b'
  },
  documentType: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'right'
  },
  // メインタイトル
  mainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    textTransform: 'uppercase',
    letterSpacing: 2
  },
  // インフォメーションセクション
  infoSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 4
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5
  },
  label: {
    width: 100,
    fontWeight: 'bold',
    color: '#1e293b'
  },
  value: {
    flex: 1
  },
  // 説明文
  descriptionBox: {
    marginVertical: 15,
    lineHeight: 1.5
  },
  // テーブル
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginVertical: 15
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    fontWeight: 'bold'
  },
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#cbd5e1'
  },
  tableCol: {
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#cbd5e1'
  },
  footerContainer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10
  },
  footerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#64748b'
  },
  confidentialText: {
    marginTop: 8,
    fontSize: 7,
    color: '#64748b',
    textAlign: 'center',
    fontStyle: 'italic'
  },
  pageNumber: {
    fontSize: 8,
    color: '#64748b'
  }
});

const CommendationPdfView = () => {
  const params = useParams();
  const id = Number(params.id);
  const { data: me } = trpc.auth.getMe.useQuery();
  const { data } = trpc.commendations.findCommendationById.useQuery(id);

  if (!data || !me) return null;

  const isCommendation = data.category === 'COMMENDATION';
  const accentColor = isCommendation ? '#2b6cb0' : '#c53030';
  const categoryLabel = isCommendation ? 'Commendation' : 'Sanction';

  return (
    <PDFViewer style={{ width: '100%', height: '70vh' }}>
      <Document title={data.title}>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <View>
              <Text style={styles.brandTitle}>CORPORATE HR SYSTEMS</Text>
              <Text>Internal Affairs Division</Text>
            </View>
            <View>
              <Text style={styles.documentType}>Ref No: {data.id}</Text>
              <Text style={styles.documentType}>Date: {format(data.issuedAt, 'yyyy/MM/dd')}</Text>
            </View>
          </View>

          <Text style={[styles.mainTitle, { color: accentColor }]}>Notice of {categoryLabel}</Text>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Subject:</Text>
              <Text style={[styles.value]}>{data.title}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Category:</Text>
              <Text style={styles.value}>{categoryLabel}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Adjustment:</Text>
              <Text style={[styles.value, { color: accentColor }]}>
                {isCommendation ? '+ ' : '- '}
                {data.adjustment} Months
              </Text>
            </View>
          </View>

          <View style={styles.descriptionBox}>
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Statement of Fact:</Text>
            <Text>{data.description}</Text>
          </View>

          <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Affected Employees:</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <View style={[styles.tableCol, { width: '30%' }]}>
                <Text>Employee Code</Text>
              </View>
              <View style={[styles.tableCol, { width: '70%' }]}>
                <Text>Full Name</Text>
              </View>
            </View>
            {data.employees?.map((emp) => (
              <View key={emp.id} style={styles.tableRow}>
                <View style={[styles.tableCol, { width: '30%' }]}>
                  <Text>{emp.code}</Text>
                </View>
                <View style={[styles.tableCol, { width: '70%' }]}>
                  <Text>{`${emp.firstName} ${emp.lastName}`}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.footerContainer} fixed>
            <View style={styles.footerInfo}>
              <View>
                <Text>Global HR Operations Center</Text>
                <Text>Contact: {me.email}</Text>
              </View>
              <View style={{ textAlign: 'right' }}>
                <Text>System Generated Document</Text>
                <Text
                  render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
                />
              </View>
            </View>

            <Text style={styles.confidentialText}>
              CONFIDENTIAL: This document contains sensitive personnel information. Unauthorized
              disclosure or reproduction is strictly prohibited under the Code of Conduct.
            </Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default CommendationPdfView;
