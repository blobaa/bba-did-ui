import { bbaMethodHandler, Error as _Error, ResolveDIDResponse } from "@blobaa/bba-did-method-handler-ts";
import fileDownload from "js-file-download";
import { FormEvent, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { FORM_SPACING } from "../constants";
import dev from "../dev";
import DotEnv from "../lib/DotEnv";
import Time from "./../lib/Time";
import Error from "./lib/Error";
import Success from "./lib/Success";
import TextArea from "./lib/TextArea";


const ResolveDID: React.FC = () => {
    const [ resultFragment, setResultFragment ] = useState(<div/> as React.ReactFragment);
    const [ isLoading, setIsLoading ] = useState(false);


    const handleSubmitForm = (event: FormEvent<HTMLFormElement>): void => {
        setIsLoading(true);
        event.preventDefault();
        event.stopPropagation();

        /*eslint-disable @typescript-eslint/no-explicit-any*/
        const did = (event.currentTarget.elements.namedItem("formDid") as any).value as string;
        /*eslint-enable @typescript-eslint/no-explicit-any*/

        if (DotEnv.isDev) {
            const devResp = {
                did: dev.devDid.did.did,
                didDocument: dev.devDid.did.didDocument
            };
            setTimeout(() => {
                setResultFragment(resolvedDIDFragment(devResp));
                setIsLoading(false);
            }, dev.processMsec);
        } else {
            resolveDID(did)
            .then((resp) => {
                setResultFragment(resolvedDIDFragment(resp));
            })
            .catch((e) => {
                console.log(e);
                const error = e as _Error;
                const title = "Couldn't resolve DID :(";
                setResultFragment(<Error title={title} message={error.description} />);
            }).finally(() => {
                setIsLoading(false);
            });
        }
    };


    return (
        <div>
            <div style={{ paddingTop: "1rem" }}/>
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
                <div style={{ paddingTop: "1rem" }}/>
                <Button
                    variant="outline-primary"
                    type="submit">
                    {isLoading ? "Resolving..." : "Resolve DID"}
                </Button>
            </Form>
            <div style={{ paddingTop: "3rem" }}/>
            {resultFragment}
        </div>
    );
};

const resolveDID = async( did: string): Promise<ResolveDIDResponse> => {
    const didElements = did.split(":");
    const url = didElements[2] === "t" ? DotEnv.testnetUrl : DotEnv.mainnetUrl;
    return bbaMethodHandler.resolveDID(url, { did });
};

const resolvedDIDFragment = (params: ResolveDIDResponse): React.ReactFragment => {

    const handleDownloadClicked = (): void => {
        const didInfo = { ...params, timestamp: Time.getUnixTime() };
        fileDownload(JSON.stringify(didInfo, undefined, 2), didInfo.did + ".resolved.json");
    };


    return (
        <div>
            <Success title="DID successfully resolved :)"/>
            <div style={{ paddingTop: "1rem" }}/>
            <p style={{ fontSize: "1.8rem" }}>Results</p>
           <Form.Row>
                <Form.Group as={Col} sm="8">
                    <Form.Label>DID:</Form.Label>
                    <Form.Control
                        type="text"
                        readOnly
                        style={{ backgroundColor: "rgba(4, 159, 173, 0.05)" }}
                        value={params.did}/>
                    <Form.Text className="text-muted">
                        The resolved decentralized identifier (DID)
                    </Form.Text>
                </Form.Group>
            </Form.Row>
            <div style={{ paddingTop: FORM_SPACING }}/>
            <Form.Row>
                <Form.Group as={Col} sm="12">
                    <Form.Label>DID Document:</Form.Label>
                    <TextArea
                        value={JSON.stringify(params.didDocument, undefined, 2)}
                    />
                    <Form.Text className="text-muted">
                        The information linked to the DID
                    </Form.Text>
                </Form.Group>
            </Form.Row>

            <div style={{ paddingTop: "2rem" }}/>
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
    );
};

export default ResolveDID;