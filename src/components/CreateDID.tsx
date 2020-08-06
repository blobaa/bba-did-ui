import { account } from "@blobaa/ardor-ts";
import { bbaMethodHandler, CreateDIDResponse } from "@blobaa/bba-did-method-handler-ts";
import { DIDDocKey, DIDDocKeyMaterial, DIDDocKeyType, DIDDocRelationship, DIDDocRelationshipType, DIDDocService, DIDDocument, DIDDocumentObject } from "@blobaa/did-document-ts";
import fileDownload from "js-file-download";
import { FormEvent, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import config from "../../config";
import Funds from "../lib/Funds";
import Time from "./../lib/Time";
import Error from "./lib/Error";
import Success from "./lib/Success";
import TextArea from "./lib/TextArea";


const formSpace = "0.4rem";

const CreateDID: React.FC= () => {
    const [ isTestnet, setIsTestnet ] = useState(true);
    const [ resultFragment, setResultFragment ] = useState(<div/> as React.ReactFragment);

    
    const handleNetwork = () => {
        setIsTestnet(!isTestnet);
    }


    const handleSubmitForm = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const passphrase = (event.currentTarget.elements.namedItem("formPassphrase") as any).value as string;
        const keyType = (event.currentTarget.elements.namedItem("formKeyType") as any).value as string;
        const relationship = (event.currentTarget.elements.namedItem("formKeyRelationship") as any).value as string;
        const serviceName = (event.currentTarget.elements.namedItem("formServiceName") as any).value as string;
        const serviceType = (event.currentTarget.elements.namedItem("formServiceType") as any).value as string;
        const serviceUrl = (event.currentTarget.elements.namedItem("formServiceUrl") as any).value as string;

        if(config.isDev) {
            setResultFragment(createdDIDFragment(config.devDid.did, config.devDid.keyMaterial, passphrase))
        } else {
            createDID(keyType, relationship, serviceName, serviceType, serviceUrl, passphrase, isTestnet)
            .then((resp) => {
                setResultFragment(createdDIDFragment(resp.did, resp.keyMaterial, passphrase))
            })
            .catch((error) => {
                setResultFragment(<Error message={error} />);
            })
        }
    }

    
    return (
        <div>
            <div style={{paddingTop: "1rem"}}/>
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
                <div style={{paddingTop: formSpace}}/>
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
                <div style={{paddingTop: formSpace}}/>
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
                <div style={{paddingTop: formSpace}}/>
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
                <div style={{paddingTop: formSpace}}/>
                <Button 
                    variant="outline-primary"
                    type="submit">
                    Create DID
                </Button>
            </Form>
            <div style={{paddingTop: "3rem"}}/>
            {resultFragment}
        </div>
    );
}


const createDID = async(
                        keyType: string, 
                        relationship: string, 
                        serviceName: string, 
                        serviceType: string, 
                        serviceUrl: string,
                        passphrase: string,
                        isTestnet: boolean
                    ): Promise<{keyMaterial: DIDDocKeyMaterial, did: CreateDIDResponse}> => {
    
    const url = isTestnet ? config.url.testnet : config.url.mainnet;
    const accountRs = account.convertPassphraseToAccountRs(passphrase);
    const minBalance = isTestnet ? config.minIgnisBalance.testnet : config.minIgnisBalance.mainnet;

    await Funds.checkFunds(url, accountRs, minBalance);


    const createDDOTReturn = await createDDOT(keyType, relationship, serviceName, serviceType, serviceUrl);
    const createDIDResponse = await bbaMethodHandler.createDID(url, {
        didDocumentTemplate: createDDOTReturn.ddot,
        passphrase: passphrase,
        isTestnetDid: isTestnet
    });
    
    return { keyMaterial:  createDDOTReturn.keyMaterial, did: createDIDResponse}
}

const createDDOT = async(
                        keyType: string, 
                        relationship: string, 
                        serviceName: string, 
                        serviceType: string, 
                        serviceUrl: string
                    ): Promise<{ ddot: DIDDocumentObject, keyMaterial: DIDDocKeyMaterial}> => {

    let key = {} as DIDDocKey;

    if (keyType === "RSA") {
        key = new DIDDocKey({keyType: DIDDocKeyType.RSA})
    } else {
        key = new DIDDocKey({keyType: DIDDocKeyType.Ed25519})
    }

    await key.generate();
    const publicKey = key.publish();
    

    let _relationship: undefined | DIDDocRelationship;
    let relationshipType = DIDDocRelationshipType.ASSERTION_METHOD;

    if (relationship === "Authentication") {
        relationshipType = DIDDocRelationshipType.AUTHENTICATION
    }
    if (relationship === "Assertion Method") {
        relationshipType = DIDDocRelationshipType.ASSERTION_METHOD
    }
    if (relationship === "Capability Delegation") {
        relationshipType = DIDDocRelationshipType.CAPABILITY_DELEGATION
    }
    if (relationship === "Capability Invocation") {
        relationshipType = DIDDocRelationshipType.CAPABILITY_INVOCATION
    }
    if (relationship === "Key Agreement") {
        relationshipType = DIDDocRelationshipType.KEY_AGREEMENT
    }

    if (relationship !== "None") {
        _relationship = new DIDDocRelationship({
            relationshipType: relationshipType,
            publicKeys: [ publicKey ]
        })
    }


    let service: undefined | DIDDocService;
    if (serviceName && serviceType && serviceUrl) {
        service = new DIDDocService({
            name: serviceName,
            type: serviceType,
            serviceEndpoint: serviceUrl
        });
    }


    const document = new DIDDocument({
        publicKeys: _relationship ? undefined : [ publicKey ],
        relationships: _relationship ? [ _relationship ] : undefined,
        services: service ? [ service ] : undefined,
    });


    return {ddot: document.publish(), keyMaterial: await key.exportKeyMaterial()}
}

const createdDIDFragment = (did: CreateDIDResponse, keyMaterial: DIDDocKeyMaterial, passphrase: string): React.ReactFragment => {
    const controller = account.convertPassphraseToAccountRs(passphrase);
    
    const handleDownloadClicked = () => {
        const didInfo = {
            did: did.did,
            didDoc: did.didDocument,
            key: keyMaterial,
            controller: controller,
            timestamp: Time.getUnixTime()
        }
        fileDownload(JSON.stringify(didInfo, undefined, 2), didInfo.did + ".created.json");
    }


    return (
        <div>
            <Success message="DID successfully created :)"/>
            <div style={{paddingTop: "1rem"}}/>
            <p style={{fontSize: "1.8rem"}}>Results</p>
           <Form.Row>
                <Form.Group as={Col} sm="8">
                    <Form.Label>DID:</Form.Label>
                    <Form.Control 
                        type="text"
                        readOnly 
                        style={{backgroundColor: "rgba(4, 159, 173, 0.05)"}}
                        value={did.did}/>
                    <Form.Text className="text-muted">
                        Your decentralized identifier (DID)
                    </Form.Text>
                </Form.Group>
            </Form.Row>
            <div style={{paddingTop: formSpace}}/>
            <Form.Row>
                <Form.Group as={Col} sm="8">
                    <Form.Label>DID Controller:</Form.Label>
                    <Form.Control 
                        type="text"
                        readOnly 
                        style={{backgroundColor: "rgba(4, 159, 173, 0.05)"}}
                        value={controller}/>
                    <Form.Text className="text-muted">
                        Your DID controller account
                    </Form.Text>
                </Form.Group>
            </Form.Row>
            <div style={{paddingTop: formSpace}}/>
            <Form.Row>
                <Form.Group as={Col} sm="12">
                    <Form.Label>DID Document:</Form.Label>
                    <TextArea 
                        value={JSON.stringify(did.didDocument, undefined, 2)}
                    />
                    <Form.Text className="text-muted">
                        The information linked to your DID
                    </Form.Text>
                </Form.Group>
            </Form.Row>
            <div style={{paddingTop: formSpace}}/>
            <Form.Row>
                <Form.Group as={Col} sm="12">
                    <Form.Label>DID Document Key:</Form.Label>
                    <TextArea
                        height="15rem"
                        value={JSON.stringify(keyMaterial, undefined, 2)}
                    />
                    <Form.Text className="text-muted">
                        Your key inside your DID Document. CAUTION: Save the key for later DID authentication. This key links you to the DID.
                    </Form.Text>
                </Form.Group>
            </Form.Row>
            <div style={{paddingTop: "2rem"}} />
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
    )
}

export default CreateDID;