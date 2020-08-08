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
                <h2 style={{ textAlign: "center" }}><b style={{ color:"#04A0AD" }}>W</b>eb <b style={{ color:"#04A0AD" }}>U</b>I for <b style={{ color:"#04A0AD" }}>B</b>BA <b style={{ color:"#04A0AD" }}>C</b>RUD <b style={{ color:"#04A0AD" }}>O</b>perations</h2>
                <div style={{ paddingTop: "1rem" }}/>
                <Row>
                    <div style={{ textAlign: "center", margin: "auto", paddingBottom: "1rem", color: "#666", fontSize: "large" }}>
                        <p>Welcome to the Web UI for handling the <a href="https://github.com/blobaa/bba-did-method-specification">bba DID method</a>.</p>
                        <p>It wraps the <a href="https://github.com/blobaa/bba-did-method-handler-ts">reference implementation</a> into a user interface to give easy and convenient access to the bba DID method </p>
                    </div>
                </Row>
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