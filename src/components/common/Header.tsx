import { Col, Container, Image, Navbar } from "react-bootstrap";
import ServerUrl from "../../lib/ServerUrl";


const Header: React.FC = () => {
    return (
        <Navbar style={{ backgroundColor: "#fafbfc", boxShadow: "0px 0px 5px 2px #f0f0f0" }}>
        {/* <Navbar style={{backgroundColor: "#04A0AD", boxShadow: "0px 0px 5px 2px #50505088"}}> */}
            <Container>
                <Col lg="4">
                    <Navbar.Brand>
                        <a href={ServerUrl.get("")}>
                            <Image
                                src={ServerUrl.get("/assets/common/blobaa-ico.svg")}
                                height="40rem"
                                alt="BBA DID Method"/>
                        </a>
                    </Navbar.Brand>
                </Col>
                <Col lg="4" style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "1.5rem", color: "#444" }}>BBA DID Method</div>
                </Col>
                <Col lg="4"/>
            </Container>
        </Navbar>
    );
};


export default Header;