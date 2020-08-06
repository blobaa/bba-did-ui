import { Alert } from "react-bootstrap";


interface Props {
    message: string;
}


const Success: React.FC<Props> = (props) => {
    return (
        <Alert variant="success" style={{paddingTop: "1.5rem", paddingBottom: "1.5rem", textAlign: "center"}}>
            {props.message}
        </Alert>
    );
}

export default Success;