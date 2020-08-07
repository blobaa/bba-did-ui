import { Modal, ProgressBar } from "react-bootstrap";


interface Props {
    show: boolean;
    percentage: number;
    title: string;
}


const WaitingModal: React.FC<Props> = (props) => {
    return (
        <Modal
            centered
            show={props.show}>
            <Modal.Header>
                <Modal.Title>
                    {props.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ProgressBar animated now={props.percentage} />
            </Modal.Body>
        </Modal>
    );
};

export default WaitingModal;