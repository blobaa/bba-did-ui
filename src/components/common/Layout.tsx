import { Container } from "react-bootstrap";
import Footer from "./Footer";
import Header from "./Header";


interface Props {
    children?: JSX.Element[] | JSX.Element;
}


const Layout: React.FC<Props> = (props) => {
    return (
        <div className="content">
            <Header/>
                <Container style={{ minHeight: "90vh" }}>
                    <div style={{ marginBottom: "2.5rem" }}/>
                    <div style={{ margin: "0 1.5rem" }}>
                        {props.children}
                    </div>
                </Container>
                <div style={{ marginBottom: "30px" }}/>
            <Footer/>
        </div>
    );
};


export default Layout;
