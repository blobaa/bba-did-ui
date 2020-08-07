import { Alert } from "react-bootstrap";


interface Props {
    title: string;
}


const Success: React.FC<Props> = (props) => {
    return (
        <Alert variant="success" style={{ paddingTop: "1.5rem", paddingBottom: "1.5rem", textAlign: "center" }}>
            <Alert.Heading>{props.title}</Alert.Heading>
        </Alert>
    );
};

export default Success;