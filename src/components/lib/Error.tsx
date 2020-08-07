import { Alert } from "react-bootstrap";


interface Props {
    title: string;
    message: string;
}


const Error: React.FC<Props> = (props) => {
    return (
        <Alert variant="danger" style={{ paddingTop: "1.5rem", paddingBottom: "1.5rem", textAlign: "center" }}>
            <Alert.Heading>{props.title}</Alert.Heading>
            <p>{props.message}</p>
        </Alert>
    );
};

export default Error;