import { Form } from "react-bootstrap";
import { FormEvent } from "react";


interface Props {
    onTextChange?: (text: string) => void;
    placeholder?: string;
    readonly?: boolean;
    value?: string;
    defaultValue?: string;
    height?: string;
}


const TextArea: React.FC<Props> = (props) => {

    const handleTextChange = (event: FormEvent<{value: string}>): void => {
        if (props.onTextChange) {
            props.onTextChange(event.currentTarget.value);
        }
    };

    return (
        <Form.Control
            style={{ textAlign: "start", maxHeight: props.height || "25rem", minHeight: props.height || "25rem", backgroundColor: "rgba(4, 159, 173, 0.05)" }}
            as="textarea"
            defaultValue={props.defaultValue}
            placeholder={props.placeholder}
            readOnly={props.readonly}
            value={props.value}
            wrap="off"
            onChange={handleTextChange}/>
    );
};


export default TextArea;