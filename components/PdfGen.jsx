import dynamic from "next/dynamic";
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { getDateWithFRFormat } from "@/utils/formatNumber";
import {Table, TR, TH, TD} from '@ag-media/react-pdf-table';

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false
  },
);

const baseStyles = {
  text: {
    fontSize: 10
  },
  textBold: {
    fontSize: 15
  }
};

// Create styles
const styles = StyleSheet.create({
  text: {
    fontSize: '11px'
  },
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF'
  },
  section: {
    margin: 10,
    padding: 10,
  },
  grow: {
    flexGrow: 1
  },
  sectionHead: {
    flexDirection: 'row',
    margin: 10,
    padding: 10,
  },
  viewBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  viewCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%'
  },
  viewEnd: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%'
  },
  directionRow: {
    flexDirection: 'row'
  },
  cellule: {
    ...baseStyles.text,
    borderBottomStyle: 'solid',
    borderWidth: '2px',
    paddingBottom: '3px',
    paddingHorizontal: '10px',
    borderColor: 'black'
  },
});

// Create Document Component
const PdfGen = ({data, date}) => {
  const employer = ['HOUOT Pascal', 'DENIS DESCAT'];
  
  if (data && data.length > 0) {

    const options = {
      month: 'long',
      year: 'numeric'
    };

    const dateOfPDF = date.from.toLocaleDateString('fr-FR', options);

    return (
      <PDFViewer className="w-[95vw] min-h-[80vh]">
        <Document file="commission.pdf">
          { data.map((commercial, index) => {
            const { acompte, facture, repres } = commercial;
            const { nom } = repres;
            
            const sumAcompte = acompte.reduce(
              (accumulator, currentValue) => accumulator + currentValue.pu,
              0,
            );
            const sumFacture = facture.reduce(
              (accumulator, currentValue) => accumulator + currentValue.totHT,
              0,
            );

            const sumCommissionAcompte = acompte.reduce(
              (accumulator, currentValue) => accumulator + currentValue.Commission,
              0,
            );
            const sumCommissionFacture = facture.reduce(
              (accumulator, currentValue) => accumulator + currentValue.Commission,
              0,
            );

            return (
              <Page key={index} orientation="landscape" size="A4" style={styles.page}>
              
                <View style={styles.sectionHead}>
                  <View style={styles.viewBetween}>
                    <Text>FERMETURES</Text>
                    <Text>FACTURE CLIENT</Text>
                    <Text>{dateOfPDF.toUpperCase()}</Text>
                  </View>
                </View>
    
                <View style={{...styles.section, ...styles.viewCenter}}>
                  <Text>{nom}</Text>
                </View>
    
                <View style={styles.section}>
                <Table tdStyle={{padding: '2px'}} style={{fontSize: 8}} 
                weightings={[0.07, 0.08, 0.2, 0.2, 0.08, 0.08, 0.08, 0.05, 0.05, 0.05, 0.08, 0.05]} >
                  <TH>
                    <TD>Numero</TD>
                    <TD>Date</TD>
                    <TD>Client</TD>
                    <TD>Reference</TD>
                    <TD>HT</TD>
                    <TD>TVA</TD>
                    <TD>TTC</TD>
                    <TD>Port</TD>
                    { !employer.find(item => item === nom) && 
                    <>              
                    <TD>Remise</TD>
                    <TD>Tx com</TD>
                    <TD>HT ss port</TD>
                    <TD>Commission</TD>
                    </>  
                    }
                  </TH>

                
                  {facture.map((item, index) => 
                    <TR key={`facture-${nom}${index}`}>
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >
                        {item.invoicenum ? item.invoicenum : item.nfacture < 1000 ? `113000${item.nfacture}` : `11300${item.nfacture}`}
                      </TD> 
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{getDateWithFRFormat(item.date)}</TD> 
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.nom}</TD> 
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.reference}</TD> 
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.totHT}</TD> 
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.TVA}</TD> 
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.totTTC}</TD> 
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.fraisport}</TD> 

                      { !employer.find(item => item === nom) && 
                      <>             
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.rempose}</TD> 
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.Com}</TD> 
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.MontHTssPort}</TD> 
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.Commission}</TD> 
                      </> 
                      }
                    </ TR>
                    )}

                  {/* {facPart.map((item, index) => 
                    <TR key={`factPart-${nom}${index}`}>
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.invoicenum}</TD> 
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{getDateWithFRFormat(item.date)}</TD> 
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.nom}</TD> 
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.reference}</TD> 
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.totHT}</TD> 
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.TVA}</TD> 
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.totTTC}</TD> 
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >0</TD> 

                      { !employer.find(item => item === nom) && 
                      <>
                      <TD style={{ backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined }}>{item.rempose}</TD>
                      <TD style={{ backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined }}>{item.Com}</TD>
                      <TD style={{ backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined }}>{item.totHT}</TD>
                      <TD style={{ backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined }}>{item.Commission}</TD>
                      </> 
                      }
                    </ TR>
                  )} */}

                  {/* {avoir.map((item, index) => 
                    <TR key={`avoir-${nom}${index}`}>
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.invoicenum}</TD> 
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{getDateWithFRFormat(item.date)}</TD> 
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.client}</TD> 
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.reference}</TD> 
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.HT}</TD> 
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.tva}</TD> 
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.totTTC}</TD> 
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} ></TD> 
                      
                      { !employer.find(item => item === nom) && 
                      <>
                      <TD style={{ backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined }}>{item.rempose}</TD>
                      <TD style={{ backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined }}>{item.Com}</TD>
                      <TD style={{ backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined }}>{item.MontHTssPort}</TD>
                      <TD style={{ backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined }}></TD>
                      </> 
                      }
                    </ TR>
                  )} */}

                  </Table>


                {acompte.length > 0 &&
                <>
                  <Text style={{textAlign:'center', paddingVertical: '10px'}} >{"Facture d'Acomptes"}</Text>
                  <Table tdStyle={{padding: '2px'}} style={{fontSize: 8}} 
                weightings={[0.07, 0.08, 0.1, 0.2, 0.2, 0.08, 0.08, 0.05, 0.05, 0.05, 0.08, 0.05, 0.05]} >
                  <TH>
                    <TD>Acompte</TD>
                    <TD>Facture</TD>
                    <TD>Date</TD>
                    <TD>Client</TD>
                    <TD>Reference</TD>
                    <TD>HT</TD>
                    <TD>TVA</TD>
                    <TD>TTC</TD>
                    <TD>Port</TD>
                    { !employer.find(item => item === nom) &&
                    <>
                      <TD>Remise</TD>
                      <TD>Tx com</TD>
                      <TD>HT ss port</TD>
                      <TD>Commission</TD>
                    </>
                    }
                  </TH>

                
                  {acompte.map((item, index) => 
                    <TR key={`acompte-${nom}${index}`}>
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.invoicenum}</TD> 
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.nfacture}</TD> 
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{getDateWithFRFormat(item.dateacp)}</TD> 
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.nom}</TD> 
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.reference}</TD> 
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.pu}</TD> 
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.tva}</TD> 
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.net}</TD> 
                      <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.fraisport}</TD> 

                      { !employer.find(item => item === nom) &&
                      <>
                        <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.rempose}</TD> 
                        <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.Com}</TD> 
                        <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.MontHTssPort}</TD> 
                        <TD style={{backgroundColor: index % 2 === 0 ? '#F0F8FF' : undefined}} >{item.Commission}</TD> 
                      </>
                      }
                    </ TR>
                    )}

                  </Table>
                </>
                }

                </View>
    
                <View style={{...styles.section, ...styles.directionRow, justifyContent: 'center'}}>
                  <Table tdStyle={{padding: '2px'}} style={{fontSize: 12, width:'50%'}} >
                    <TH>
                      <TD>Total HT</TD>
                      { !employer.find(item => item === nom) && 
                      <TD>Total comm</TD>
                      }
                    </TH>
                    <TR>
                      <TD>{(sumAcompte + sumFacture).toFixed(2)}</TD>
                      { !employer.find(item => item === nom) && 
                      <TD>{(sumCommissionAcompte + sumCommissionFacture).toFixed(2)}</TD>
                      }
                    </TR>
                  </Table>
                </View>
            
              </Page>

            )}
          )}     
        </Document>
      </PDFViewer>
  )}

};

export default PdfGen;