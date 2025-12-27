import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  coverPage: {
    padding: 30,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverImage: {
    width: '100%',
    height: '90%',
    objectFit: 'contain',
  },
  coverTitle: {
    fontSize: 32,
    marginTop: 40,
    marginHorizontal: 40,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 10,
    marginTop: 5,
    fontWeight: 'bold',
    color: '#000000',
  },
  text: {
    fontSize: 11,
    lineHeight: 1.4,
    textAlign: 'left',
    whiteSpace: 'pre-wrap',
  },
  boldText: {
    fontSize: 11,
    lineHeight: 1.4,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  headingText: {
    fontSize: 13,
    lineHeight: 1.4,
    textAlign: 'left',
    fontWeight: 'bold',
    marginTop: 10,
  },
  table: {
    marginTop: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#374151',
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
  },
  tableCell: {
    flex: 1,
    fontSize: 11,
    paddingHorizontal: 8,
  },
  tableCellHeader: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
  additionalImage: {
    marginVertical: 15,
    maxWidth: '100%',
    maxHeight: 350,
    objectFit: 'contain',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
});

interface PatternPDFProps {
  title: string;
  content: string;
  image: string;
  language: string;
}

// Identifiera om en rad är en stor rubrik (versaler)
function isMainHeading(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;

  // Rad i versaler (minst 2 tecken och innehåller bokstäver) och är ensam på raden
  if (trimmed.length >= 2 && trimmed === trimmed.toUpperCase() && /[A-ZÅÄÖÆØÉÈÊËÀÂÔÛÎÏÜÖÄÑÇŞĞ]/.test(trimmed)) {
    // Kolla om raden slutar med kolon - då är det en label, inte rubrik
    if (trimmed.endsWith(':')) {
      return false;
    }
    return true;
  }

  return false;
}

// Kolla om raden innehåller ett kolon
function hasLabel(line: string): boolean {
  const trimmed = line.trim();
  // Matcha om raden innehåller kolon (oavsett om det finns text efter eller inte)
  // Men undvik om hela raden är versaler (då är det en rubrik)
  if (trimmed.includes(':')) {
    // Om hela raden är versaler och inga gemener finns, är det en rubrik, inte label
    if (trimmed === trimmed.toUpperCase() && /[A-ZÅÄÖÆØÉÈÊËÀÂÔÛÎÏÜÖÄÑÇŞĞ]/.test(trimmed) && !/[a-zåäöæøéèêëàâôûîïüöäñçşğ]/.test(trimmed)) {
      return false;
    }
    return true;
  }
  return false;
}

// Rendera en rad med label (t.ex. "Garn: Drops Fabel" eller "Garnåtgång:")
function renderLabelLine(line: string, index: number) {
  const colonIndex = line.indexOf(':');
  if (colonIndex === -1) {
    return <Text key={index} style={styles.text}>{line}{'\n'}</Text>;
  }

  const label = line.substring(0, colonIndex + 1); // Inkludera kolonet
  const value = line.substring(colonIndex + 1);

  // Om det finns värde efter kolonet, visa både label (bold) och värde
  // Om det inte finns värde, visa bara label (bold) ensamt
  return (
    <Text key={index} style={styles.text}>
      <Text style={styles.boldText}>{label}</Text>
      {value}{'\n'}
    </Text>
  );
}

// Rendera textinnehåll med korrekt formatering
function renderContent(content: string) {
  const lines = content.split('\n');

  return lines.map((line, index) => {
    const trimmed = line.trim();

    // Tom rad
    if (!trimmed) {
      return <Text key={index} style={styles.text}>{'\n'}</Text>;
    }

    // Stor rubrik (versaler, inte label)
    if (isMainHeading(line)) {
      return <Text key={index} style={styles.headingText}>{line}{'\n'}</Text>;
    }

    // Label-rad (t.ex. "Garn: Drops Fabel")
    if (hasLabel(line)) {
      return renderLabelLine(line, index);
    }

    // Vanlig text
    return <Text key={index} style={styles.text}>{line}{'\n'}</Text>;
  });
}

export default function PatternPDFTemplate({
  title,
  content,
  image,
  language,
}: PatternPDFProps) {
  return (
    <Document>
      {/* Förstasida med stor bild (precis som SIBELLE) */}
      {image && (
        <Page size="A4" style={styles.coverPage}>
          <Image src={image} style={styles.coverImage} />
        </Page>
      )}

      {/* Innehållssida */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{title}</Text>

        {/* Mönstertext */}
        {content && (
          <View style={styles.section}>
            {renderContent(content)}
          </View>
        )}

        <Text style={styles.footer}>
          Prettyknit.se {new Date().getFullYear()}
        </Text>
      </Page>
    </Document>
  );
}

