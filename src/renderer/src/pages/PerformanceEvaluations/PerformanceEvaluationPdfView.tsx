import { PDFViewer } from '@react-pdf/renderer';
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { trpc } from '@renderer/trpc';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';

const borderRadius = 3;

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#2d3748'
  },
  // ヘッダー（会社名と書類種別）
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 20,
    marginBottom: 30
  },
  headerLeft: {
    flexDirection: 'column'
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a365d',
    letterSpacing: 1
  },
  documentTitle: {
    fontSize: 18,
    marginTop: 5,
    color: '#4a5568',
    textTransform: 'uppercase'
  },
  // 評価概要（スコアを強調）
  summaryGrid: {
    flexDirection: 'row',
    marginBottom: 30,
    gap: 20
  },
  scoreCard: {
    width: '30%',
    backgroundColor: '#ebf4ff',
    padding: 20,
    borderRadius,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scoreLabel: {
    fontSize: 8,
    color: '#2b6cb0',
    marginBottom: 5,
    textTransform: 'uppercase'
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2b6cb0'
  },
  detailsBox: {
    flex: 1,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f7fafc'
  },
  label: {
    width: 100,
    color: '#718096',
    fontSize: 9
  },
  value: {
    flex: 1,
    fontWeight: 'bold'
  },
  // 評価コメントセクション
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a365d',
    borderLeftWidth: 2,
    borderLeftColor: '#2b6cb0',
    paddingLeft: 10,
    marginBottom: 10,
    marginTop: 20
  },
  descriptionContent: {
    lineHeight: 1.6,
    padding: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius
  },
  // フッター
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#a0aec0'
  }
});

const PerformanceEvaluationPdfView = () => {
  const params = useParams();
  const id = Number(params.id);
  const { data } = trpc.performanceEvaluations.findPerformanceEvaluationById.useQuery(id);

  if (!data) return null;

  return (
    <PDFViewer style={{ width: '100%', height: '70vh' }}>
      <Document title={data.title}>
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.companyName}>GLOBAL TALENT MANAGEMENT</Text>
              <Text style={styles.documentTitle}>Performance Evaluation</Text>
            </View>
            <View style={{ textAlign: 'right' }}>
              <Text style={{ fontSize: 9 }}>Report ID: #{data.id}</Text>
              <Text style={{ fontSize: 9 }}>Date: {format(data.evaluatedAt, 'yyyy/MM/dd')}</Text>
            </View>
          </View>

          {/* Summary Section */}
          <View style={styles.summaryGrid}>
            {/* Score Card */}
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>Final Rating</Text>
              <Text style={styles.scoreValue}>{data.score}</Text>
            </View>

            {/* Evaluation Metadata */}
            <View style={styles.detailsBox}>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Employee Name</Text>
                <Text style={styles.value}>{data.evaluatedEmployee}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Evaluator</Text>
                <Text style={styles.value}>{data.evaluatorEmployee}</Text>
              </View>
              <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.label}>Subject</Text>
                <Text style={styles.value}>{data.title}</Text>
              </View>
            </View>
          </View>

          {/* Evaluation Content */}
          <Text style={styles.sectionTitle}>Detailed Assessment & Feedback</Text>
          <View style={styles.descriptionContent}>
            <Text>{data.description}</Text>
          </View>

          {/* Footer */}
          <View style={styles.footer} fixed>
            <Text>© 2026 Global HR Systems - Internal Use Only</Text>
            <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} />
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default PerformanceEvaluationPdfView;
