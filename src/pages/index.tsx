import { Row, Tab, Tabs } from 'react-bootstrap';
import Layout from '../components/common/Layout';
import Page from '../components/common/Page';
import CreateDID from '../components/CreateDID';
import DeactivateDID from '../components/DeactivateDID';
import ResolveDID from '../components/ResolveDID';
import UpdateController from '../components/UpdateController';
import UpdateDDOT from '../components/UpdateDocument';


const DemoHome: React.FC = () => {
    return (
        <Page>
            <Layout>
                <div style={{ paddingTop: "1rem" }}/>
                <h2 style={{ textAlign: "center" }}><b style={{ color:"#04A0AD" }}>W</b>eb <b style={{ color:"#04A0AD" }}>U</b>I for <b style={{ color:"#04A0AD" }}>B</b>BA <b style={{ color:"#04A0AD" }}>C</b>RUD <b style={{ color:"#04A0AD" }}>O</b>perations</h2>
                <div style={{ paddingTop: "1rem" }}/>
                <Row>
                    <div style={{ textAlign: "center", margin: "auto", color: "#666", fontSize: "large", paddingBottom: "3rem" }}>
                        <span>Welcome to the web user interface</span><br/><span>for handling the <a href="https://github.com/blobaa/bba-did-method-specification">bba DID method</a> operations</span>
                    </div>
                    <div style={{ color: "#666", fontSize: "large" }}>
                        <p>
                            This website wraps the <a href="https://github.com/blobaa/bba-did-method-handler-ts">bba DID method handler</a> to provide a human friendly access to the bba DID method. The bba DID method aims to enable the <a href="https://ardorplatform.org">Ardor</a> Blockchain to act as a <a href="https://www.weboftrust.info/downloads/dpki.pdf">DPKI</a> (Public Utility) within the <a href="https://trustoverip.org/wp-content/uploads/sites/98/2020/05/toip_introduction_050520.pdf">Trust over IP Stack</a> for Self-Sovereign Identity (<a href="https://www.manning.com/books/self-sovereign-identity">SSI</a>). Further information is available within the <a href="https://github.com/blobaa/bba-did-method-specification">bba DID specification repository</a>.
                        </p>
                         <p>
                             The website is a statically generated <a href="https://en.wikipedia.org/wiki/Single-page_application">SPA</a> and runs completely in your browser. This means that no private keys and passphrases are sent to any server and that transaction signing and key generation is done locally in your browser. The source code is available <a href="https://github.com/blobaa/bba-did-ui">here</a>.
                        </p>
                    </div>
                </Row>
                <div style={{ paddingTop: "4rem" }}/>
                <Tabs defaultActiveKey="create"  id="noanim-tab-example">
                    <Tab eventKey="create" title="Create DID">
                        <div style={{ paddingTop: "1rem" }}/>
                        <CreateDID/>
                    </Tab>
                    <Tab eventKey="resolve" title="Resolve DID">
                        <div style={{ paddingTop: "1rem" }}/>
                        <ResolveDID />
                    </Tab>
                    <Tab eventKey="updateDDOT" title="Update DID Document">
                        <div style={{ paddingTop: "1rem" }}/>
                        <UpdateDDOT/>
                    </Tab>
                    <Tab eventKey="updateController" title="Update DID Controller">
                        <div style={{ paddingTop: "1rem" }}/>
                        <UpdateController/>
                    </Tab>
                    <Tab eventKey="deactivate" title="Deactivate DID">
                        <div style={{ paddingTop: "1rem" }}/>
                        <DeactivateDID/>
                    </Tab>
                </Tabs>
            </Layout>
        </Page>
    );
};

export default DemoHome;