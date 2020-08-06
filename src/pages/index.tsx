import { Row, Tabs, Tab } from 'react-bootstrap';
import Layout from '../components/common/Layout';
import Page from '../components/common/Page';
import CreateDID from '../components/CreateDID';
import UpdateDDOT from '../components/UpdateDocument';
import UpdateController from '../components/UpdateController';
import DeactivateDID from '../components/DeactivateDID';
import ResolveDID from '../components/ResolveDID';


const formSpacing = "0.4rem";


const DemoHome: React.FC = () => {
    return (
        <Page>
            <Layout>
                <h2 style={{textAlign: "center"}}>BBA DID Method</h2>
                <div style={{paddingTop: "1rem"}}/>
                <Row>
                    <div style={{textAlign: "center", margin: "auto", paddingBottom: "1rem", color: "#666", fontSize: "large"}}>
                        This is the BBA DID Method UI
                    </div>
                </Row>
                <Tabs defaultActiveKey="create"  id="noanim-tab-example">
                    <Tab eventKey="create" title="Create DID">
                        <div style={{paddingTop: "1rem"}}/>
                        <CreateDID formSpacing={formSpacing}/>
                    </Tab>
                    <Tab eventKey="resolve" title="Resolve DID">
                        <div style={{paddingTop: "1rem"}}/>
                        <ResolveDID />
                    </Tab>
                    <Tab eventKey="updateDDOT" title="Update DID Document">
                        <div style={{paddingTop: "1rem"}}/>
                        <UpdateDDOT formSpacing={formSpacing}/>
                    </Tab>
                    <Tab eventKey="updateController" title="Update DID Controller">
                        <div style={{paddingTop: "1rem"}}/>
                        <UpdateController formSpacing={formSpacing}/>
                    </Tab>
                    <Tab eventKey="deactivate" title="Deactivate DID">
                        <div style={{paddingTop: "1rem"}}/>
                        <DeactivateDID formSpacing={formSpacing}/>
                    </Tab>
                </Tabs>
            </Layout>
        </Page>
    );
}

export default DemoHome;