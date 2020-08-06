import { bbaMethodHandler, ResolveDIDResponse } from "@blobaa/bba-did-method-handler-ts";
import fileDownload from "js-file-download";
import { FormEvent, useState } from "react";
import { Alert, Button, Col, Form } from "react-bootstrap";
import config from "../../config";
import Time from "./../lib/Time";
import Error from "./lib/Error";
import TextArea from "./lib/TextArea";


interface Props {
    test?: string;
}


const ResolveDID: React.FC<Props> = (props) => {
    const [ resultFragment, setResultFragment ] = useState(<div/> as React.ReactFragment);

    
    const handleSubmitForm = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const did = (event.currentTarget.elements.namedItem("formDid") as any).value as string;

        if(config.isDev) {
            setResultFragment(resolvedDIDFragment({did: config.devDid.did.did, didDocument: config.devDid.did.didDocument}))
        } else {
            resolveDID(did)
            .then((resp) => {
                setResultFragment(resolvedDIDFragment(resp))
            })
            .catch((error) => {
                console.log(error)
                setResultFragment(<Error message={"Couldn't resolve DID :("} />);
            })
        }
    }

    
    return (
        <div>
            <Form onSubmit={handleSubmitForm}>
                <Form.Row>
                    <Form.Group as={Col} sm="8" controlId="formDid">
                        <Form.Label>DID:</Form.Label>
                        <Form.Control type="text" placeholder="Enter bba did" />
                        <Form.Text className="text-muted">
                            The bba DID you want to resolve.
                        </Form.Text>
                    </Form.Group>
                </Form.Row>

                <Button 
                    variant="outline-primary"
                    type="submit">
                    Resolve DID
                </Button>
            </Form>
            <div style={{paddingTop: "2rem"}}/>
            {resultFragment}
        </div>
    );
}

const resolveDID = async( did: string): Promise<ResolveDIDResponse> => {
    const didElements = did.split(":");
    const url = didElements[2] === "t" ? config.url.testnet : config.url.mainnet;
    return bbaMethodHandler.resolveDID(url, { did });
}

const resolvedDIDFragment = (resolveResponse: ResolveDIDResponse): React.ReactFragment => {
    
    const handleDownloadClicked = () => {
        const didInfo = {...resolveResponse, timestamp: Time.getUnixTime()};
        fileDownload(JSON.stringify(didInfo, undefined, 2), didInfo.did + ".resolved.json");
    }


    return (
        <div>
            <Alert variant="success">DID successfully resolved :)</Alert>
           <Form.Row>
                <Form.Group as={Col} sm="8">
                    <Form.Label>DID:</Form.Label>
                    <Form.Control 
                        type="text"
                        readOnly 
                        style={{backgroundColor: "rgba(4, 159, 173, 0.05)"}}
                        value={resolveResponse.did}/>
                    <Form.Text className="text-muted">
                        The resolved decentralized identifier (DID)
                    </Form.Text>
                </Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group as={Col} sm="12">
                    <Form.Label>DID Document:</Form.Label>
                    <TextArea 
                        value={JSON.stringify(resolveResponse.didDocument, undefined, 2)}
                    />
                    <Form.Text className="text-muted">
                        The information linked to the DID
                    </Form.Text>
                </Form.Group>
            </Form.Row>

            <div style={{paddingTop: "1rem"}} />
            <Form.Row>
                <Form.Group as={Col} sm="12">
                    <Button
                        onClick={handleDownloadClicked}
                        variant="outline-primary">
                        Save Resolved DID
                    </Button>
                    <Form.Text className="text-muted">
                        Save the DID information shown above in a &lt;did&gt;.resolved.json file.
                    </Form.Text>

                </Form.Group>
            </Form.Row>
        </div>
    )
}

export default ResolveDID;