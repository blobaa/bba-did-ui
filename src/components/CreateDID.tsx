import { account } from "@blobaa/ardor-ts";
import { bbaMethodHandler, CreateDIDResponse, Error as _Error } from "@blobaa/bba-did-method-handler-ts";
import { DIDDocKeyMaterial } from "@blobaa/did-document-ts";
import fileDownload from "js-file-download";
import { FormEvent, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import config from "../../config";
import DDOT from "../lib/DDOT";
import Funds from "../lib/Funds";
import Time from "./../lib/Time";
import Error from "./lib/Error";
import Success from "./lib/Success";
import TextArea from "./lib/TextArea";


const CreateDID: React.FC= () => {
    const [ isTestnet, setIsTestnet ] = useState(true);
    const [ resultFragment, setResultFragment ] = useState(<div/> as React.ReactFragment);


    const handleNetwork = (): void => {
        setIsTestnet(!isTestnet);
    };


    const handleSubmitForm = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        event.stopPropagation();

        /*eslint-disable @typescript-eslint/no-explicit-any*/
        const passphrase = (event.currentTarget.elements.namedItem("formPassphrase") as any).value as string;
        const keyType = (event.currentTarget.elements.namedItem("formKeyType") as any).value as string;
        const relationship = (event.currentTarget.elements.namedItem("formKeyRelationship") as any).value as string;
        const serviceName = (event.currentTarget.elements.namedItem("formServiceName") as any).value as string;
        const serviceType = (event.currentTarget.elements.namedItem("formServiceType") as any).value as string;
        const serviceUrl = (event.currentTarget.elements.namedItem("formServiceUrl") as any).value as string;
        /*eslint-enable @typescript-eslint/no-explicit-any*/

        if (config.isDev) {
            const devResp = {
                did: config.devDid.did,
                keyMaterial: config.devDid.keyMaterial,
                controller: config.devDid.account
            };
            setResultFragment(createdDIDFragment(devResp));
        } else {
            createDID(keyType, relationship, serviceName, serviceType, serviceUrl, passphrase, isTestnet)
            .then((resp) => {
                setResultFragment(createdDIDFragment(resp));
            })
            .catch((e) => {
                console.log(e);
                const error = e as _Error;
                const title = "Couldn't create DID :(";
                setResultFragment(<Error title={title} message={error.description} />);
            });
        }
    };


    return (
        <div>
            <div style={{ paddingTop: "1rem" }}/>
            <Form onSubmit={handleSubmitForm}>
                <Form.Row>
                    <Form.Group as={Col} sm="8" controlId="formPassphrase">
                        <Form.Label>DID Controller Passphrase:</Form.Label>
                        <Form.Control type="password" placeholder="Enter passphrase" />
                        <Form.Text className="text-muted">
                            Your Ardor account passphrase. Your passphrase never leaves the browser.
                        </Form.Text>
                    </Form.Group>
                </Form.Row>
                <div style={{ paddingTop: config.formSpacing }}/>
                <Form.Row>
                    <Form.Group controlId="formNetwork">
                        <Form.Label>Network:</Form.Label>
                        <Form.Group>
                            <Form.Check
                                inline
                                type="radio"
                                checked={isTestnet}
                                onChange={handleNetwork}
                                label="Testnet" />
                            <Form.Check
                                inline
                                type="radio"
                                checked={!isTestnet}
                                onChange={handleNetwork}
                                label="Mainnet" />
                        </Form.Group>
                    </Form.Group>
                </Form.Row>
                <div style={{ paddingTop: config.formSpacing }}/>
                <Form.Group>
                    <Form.Label>DID Document Key</Form.Label>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formKeyType">
                            <Form.Label>Key Type:</Form.Label>
                            <Form.Control as="select">
                                <option>RSA</option>
                                <option>ED25519</option>
                            </Form.Control>
                            <Form.Text className="text-muted">
                                Your DID Document Key Type
                            </Form.Text>
                        </Form.Group>
                        <Form.Group as={Col} controlId="formKeyRelationship">
                            <Form.Label>Relationship:</Form.Label>
                            <Form.Control as="select">
                                <option>None</option>
                                <option>Authentication</option>
                                <option>Assertion Method</option>
                                <option>Key Agreement</option>
                                <option>Capability Invocation</option>
                                <option>Capability Delegation</option>
                            </Form.Control>
                            <Form.Text className="text-muted">
                                Your verification relationship the key will be used for. Select None if the key should be generic.
                            </Form.Text>
                        </Form.Group>
                    </Form.Row>
                </Form.Group>
                <div style={{ paddingTop: config.formSpacing }}/>
                <Form.Group>
                    <Form.Label>DID Document Service</Form.Label>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formServiceName">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control type="text" placeholder="Enter service name"/>
                            <Form.Text className="text-muted">
                                The name of your service. Required for service creation
                            </Form.Text>
                        </Form.Group>
                        <Form.Group as={Col} controlId="formServiceType">
                            <Form.Label>Type:</Form.Label>
                            <Form.Control type="text" placeholder="Enter service type"/>
                            <Form.Text className="text-muted">
                                The type of your service. Required for service creation
                            </Form.Text>
                        </Form.Group>
                        <Form.Group as={Col} controlId="formServiceUrl">
                            <Form.Label>URL:</Form.Label>
                            <Form.Control type="text" placeholder="Enter service endpoint URL"/>
                            <Form.Text className="text-muted">
                                The endpoint of your service. Required for service creation
                            </Form.Text>
                        </Form.Group>
                    </Form.Row>
                </Form.Group>
                <div style={{ paddingTop: "1rem" }}/>
                <Button
                    variant="outline-primary"
                    type="submit">
                    Create DID
                </Button>
            </Form>
            <div style={{ paddingTop: "3rem" }}/>
            {resultFragment}
        </div>
    );
};


const createDID = async(
                        keyType: string,
                        relationship: string,
                        serviceName: string,
                        serviceType: string,
                        serviceUrl: string,
                        passphrase: string,
                        isTestnet: boolean
                    ): Promise<{keyMaterial: DIDDocKeyMaterial; did: CreateDIDResponse; controller: string}> => {

    const url = isTestnet ? config.url.testnet : config.url.mainnet;
    const accountRs = account.convertPassphraseToAccountRs(passphrase);
    const minBalance = isTestnet ? config.minIgnisBalance.testnet : config.minIgnisBalance.mainnet;

    await Funds.checkFunds(url, accountRs, minBalance);


    const createDDOTReturn = await DDOT.create(keyType, relationship, serviceName, serviceType, serviceUrl);
    const createDIDResponse = await bbaMethodHandler.createDID(url, {
        didDocumentTemplate: createDDOTReturn.ddot,
        passphrase,
        isTestnetDid: isTestnet
    });

    return { keyMaterial:  createDDOTReturn.keyMaterial, did: createDIDResponse, controller: accountRs };
};

const createdDIDFragment = (params: {did: CreateDIDResponse; keyMaterial: DIDDocKeyMaterial; controller: string}): React.ReactFragment => {

    const handleDownloadClicked = (): void => {
        const didInfo = {
            did: params.did.did,
            didDoc: params.did.didDocument,
            key: params.keyMaterial,
            controller: params.controller,
            timestamp: Time.getUnixTime()
        };
        fileDownload(JSON.stringify(didInfo, undefined, 2), didInfo.did + ".created.json");
    };


    return (
        <div>
            <Success title="DID successfully created :)"/>
            <div style={{ paddingTop: "1rem" }}/>
            <p style={{ fontSize: "1.8rem" }}>Results</p>
           <Form.Row>
                <Form.Group as={Col} sm="8">
                    <Form.Label>DID:</Form.Label>
                    <Form.Control
                        type="text"
                        readOnly
                        style={{ backgroundColor: "rgba(4, 159, 173, 0.05)" }}
                        value={params.did.did}/>
                    <Form.Text className="text-muted">
                        Your decentralized identifier (DID)
                    </Form.Text>
                </Form.Group>
            </Form.Row>
            <div style={{ paddingTop: config.formSpacing }}/>
            <Form.Row>
                <Form.Group as={Col} sm="8">
                    <Form.Label>DID Controller:</Form.Label>
                    <Form.Control
                        type="text"
                        readOnly
                        style={{ backgroundColor: "rgba(4, 159, 173, 0.05)" }}
                        value={params.controller}/>
                    <Form.Text className="text-muted">
                        Your DID controller account
                    </Form.Text>
                </Form.Group>
            </Form.Row>
            <div style={{ paddingTop: config.formSpacing }}/>
            <Form.Row>
                <Form.Group as={Col} sm="12">
                    <Form.Label>DID Document:</Form.Label>
                    <TextArea
                        value={JSON.stringify(params.did.didDocument, undefined, 2)}
                    />
                    <Form.Text className="text-muted">
                        The information linked to your DID
                    </Form.Text>
                </Form.Group>
            </Form.Row>
            <div style={{ paddingTop: config.formSpacing }}/>
            <Form.Row>
                <Form.Group as={Col} sm="12">
                    <Form.Label>DID Document Key:</Form.Label>
                    <TextArea
                        height="15rem"
                        value={JSON.stringify(params.keyMaterial, undefined, 2)}
                    />
                    <Form.Text className="text-muted">
                        Your key inside your DID Document. CAUTION: Save the key for later DID authentication. This key links you to the DID.
                    </Form.Text>
                </Form.Group>
            </Form.Row>
            <div style={{ paddingTop: "2rem" }} />
            <Form.Row>
                <Form.Group as={Col} sm="12">
                    <Button
                        onClick={handleDownloadClicked}
                        variant="outline-primary"
                        size="lg">
                        Save Created DID
                    </Button>
                    <Form.Text className="text-muted">
                        Save the DID information shown above in a &lt;did&gt;.created.json file.
                    </Form.Text>
                </Form.Group>
            </Form.Row>
        </div>
    );
};

export default CreateDID;