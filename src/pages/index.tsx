import { Row } from 'react-bootstrap';
import Layout from '../components/common/Layout';
import Page from '../components/common/Page';


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
            </Layout>
        </Page>
    );
}

export default DemoHome;