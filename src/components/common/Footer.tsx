import { CSSProperties } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import ServerUrl from "../../lib/ServerUrl";


const Footer: React.FC = () => {
    return (
        <div style={footerMargin}>
             <Container className="justify-content-center" style={footerInner}>
                <Row>
                </Row>
                <Row style={rowMargin}>
                    <Col lg="1"/>
                    <Col>
                        <p style={{ fontSize: "small", textAlign: "center" }}>
                            <a href="https://github.com/blobaa/"><Image src={ServerUrl.get("/assets/common/github.png")} height="40rem"/></a>
                        </p>
                    </Col>
                     <Col>
                        <p style={{ fontSize: "small", textAlign: "center" }}>
                           hosted with <a href="https://pages.github.com"><Image src={ServerUrl.get("/assets/common/github-pages.png")} height="20rem"/></a>
                        </p>
                    </Col>
                    <Col lg="1"/>
                </Row>
            </Container>
        </div>
    );
};


const rowMargin: CSSProperties = {
    alignItems: "center"
};


const footerMargin: CSSProperties = {
    marginTop: "6rem",
    paddingTop: "1rem",
    borderTop: "1px solid #00000029"
};

const footerInner: CSSProperties = {
    marginTop: "1rem",
    marginBottom: "1rem"
};

export default Footer;