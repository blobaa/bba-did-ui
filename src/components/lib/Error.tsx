import { Alert } from "react-bootstrap";


interface Props {
    message: string;
}


const Error: React.FC<Props> = (props) => {
    return (
        <Alert variant="danger" style={{ paddingTop: "1.5rem", paddingBottom: "1.5rem", textAlign: "center" }}>
            {props.message}
        </Alert>
    );
};

export default Error;