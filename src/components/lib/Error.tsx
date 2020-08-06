import { Alert } from "react-bootstrap";


interface Props {
    message: string;
}


const Error: React.FC<Props> = (props) => {
    return (
        <Alert variant="danger">
            {props.message}
        </Alert>
    );
}

export default Error;