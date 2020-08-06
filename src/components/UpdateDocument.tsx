import { account } from "@blobaa/ardor-ts";
import { bbaMethodHandler, UpdateDIDDocumentResponse } from "@blobaa/bba-did-method-handler-ts";
import { DIDDocKey, DIDDocKeyMaterial, DIDDocKeyType, DIDDocRelationship, DIDDocRelationshipType, DIDDocService, DIDDocument, DIDDocumentObject } from "@blobaa/did-document-ts";
import fileDownload from "js-file-download";
import { FormEvent, useState } from "react";
import { Alert, Button, Col, Form } from "react-bootstrap";
import config from "../../config";
import Funds from "../lib/Funds";
import Time from "../lib/Time";
import Error from "./lib/Error";
import TextArea from "./lib/TextArea";



interface Props {
    test?: string;
}


const UpdateDDOT: React.FC<Props> = (props) => {
    const [ resultFragment, setResultFragment ] = useState(<div/> as React.ReactFragment);
    

    const handleSubmitForm = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const did = (event.currentTarget.elements.namedItem("formDid") as any).value as string;
        const passphrase = (event.currentTarget.elements.namedItem("formPassphrase") as any).value as string;
        const keyType = (event.currentTarget.elements.namedItem("formKeyType") as any).value as string;
        const relationship = (event.currentTarget.elements.namedItem("formKeyRelationship") as any).value as string;
        const serviceName = (event.currentTarget.elements.namedItem("formServiceName") as any).value as string;
        const serviceType = (event.currentTarget.elements.namedItem("formServiceType") as any).value as string;
        const serviceUrl = (event.currentTarget.elements.namedItem("formServiceUrl") as any).value as string;

        if (config.isDev) {
            const newDidObj = {
                did: config.devDid.did.did,
                newDidDocument: config.devDid.did.didDocument
            }
            setResultFragment(updatedDocFragment(newDidObj, config.devDid.keyMaterial, passphrase))
        } else {
            updateDocument(did, keyType, relationship, serviceName, serviceType, serviceUrl, passphrase)
            .then((resp) => {
                setResultFragment(updatedDocFragment(resp.did, resp.keyMaterial, passphrase))
            })
            .catch((error) => {
                setResultFragment(<Error message={error} />);
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
                            Your bba DID you want to update.
                        </Form.Text>
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    <Form.Group as={Col} sm="8" controlId="formPassphrase">
                        <Form.Label>DID Controller Passphrase:</Form.Label>
                        <Form.Control type="password" placeholder="Enter passphrase" />
                        <Form.Text className="text-muted">
                            Your Ardor account passphrase. Your passphrase never leaves the browser.
                        </Form.Text>
                    </Form.Group>
                </Form.Row>

                
                <Form.Group>
                    <Form.Label>New DID Document Key</Form.Label>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formKeyType">
                            <Form.Label>Key Type:</Form.Label>
                            <Form.Control as="select">
                                <option>RSA</option>
                                <option>ED25519</option>
                            </Form.Control>
                            <Form.Text className="text-muted">
                                Your new DID Document Key Type
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
                                Your new verification relationship the key will be used for. Select None if the key should be generic.
                            </Form.Text>
                        </Form.Group>
                    </Form.Row>
                </Form.Group>

                <Form.Group>
                    <Form.Label>New DID Document Service</Form.Label>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formServiceName">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control type="text" placeholder="Enter service name"/>
                            <Form.Text className="text-muted">
                                The name of your new service. Required for service creation
                            </Form.Text>
                        </Form.Group>
                        <Form.Group as={Col} controlId="formServiceType">
                            <Form.Label>Type:</Form.Label>
                            <Form.Control type="text" placeholder="Enter service type"/>
                            <Form.Text className="text-muted">
                                The type of your new service. Required for service creation
                            </Form.Text>
                        </Form.Group>
                        <Form.Group as={Col} controlId="formServiceUrl">
                            <Form.Label>URL:</Form.Label>
                            <Form.Control type="text" placeholder="Enter service endpoint URL"/>
                            <Form.Text className="text-muted">
                                The endpoint of your new service. Required for service creation
                            </Form.Text>
                        </Form.Group>
                    </Form.Row>
                </Form.Group>

                <Button 
                    variant="outline-primary"
                    type="submit">
                    Update DID Document
                </Button>
            </Form>
            <div style={{paddingTop: "2rem"}}/>
            {resultFragment}
        </div>
    );
}


const updateDocument = async(
                        did: string,
                        keyType: string, 
                        relationship: string, 
                        serviceName: string, 
                        serviceType: string, 
                        serviceUrl: string,
                        passphrase: string,
                    ): Promise<{keyMaterial: DIDDocKeyMaterial, did: UpdateDIDDocumentResponse}> => {

    const didElements = did.split(":");
    const isTestnet = didElements[2] === "t";

    const url = isTestnet ? config.url.testnet : config.url.mainnet;
    const accountRs = account.convertPassphraseToAccountRs(passphrase);
    const minBalance = isTestnet ? config.minIgnisBalance.testnet : config.minIgnisBalance.mainnet;

    await Funds.checkFunds(url, accountRs, minBalance);


    const createDDOTReturn = await createDDOT(keyType, relationship, serviceName, serviceType, serviceUrl);
    const updateDocumentResponse = await bbaMethodHandler.updateDIDDocument(url, {
        did: did,
        newDidDocumentTemplate: createDDOTReturn.ddot,
        passphrase: passphrase,    
    });
    
    return { keyMaterial:  createDDOTReturn.keyMaterial, did: updateDocumentResponse}
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

const updatedDocFragment = (did: UpdateDIDDocumentResponse, keyMaterial: DIDDocKeyMaterial, passphrase: string): React.ReactFragment => {
    const controller = account.convertPassphraseToAccountRs(passphrase);
    
    const handleDownloadClicked = () => {
        const didInfo = {
            did: did.did,
            didDoc: did.newDidDocument,
            key: keyMaterial,
            controller: controller,
            timestamp: Time.getUnixTime()
        }
        fileDownload(JSON.stringify(didInfo, undefined, 2), didInfo.did + ".updatedDoc.json");
    }


    return (
        <div>
            <Alert variant="success">DID Document successfully updated :)</Alert>
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
            <Form.Row>
                <Form.Group as={Col} sm="12">
                    <Form.Label>New DID Document:</Form.Label>
                    <TextArea 
                        value={JSON.stringify(did.newDidDocument, undefined, 2)}
                    />
                    <Form.Text className="text-muted">
                        The new information linked to your DID
                    </Form.Text>
                </Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group as={Col} sm="12">
                    <Form.Label>DID Document Key:</Form.Label>
                    <TextArea
                        height="15rem"
                        value={JSON.stringify(keyMaterial, undefined, 2)}
                    />
                    <Form.Text className="text-muted">
                        Your key inside your new DID Document. CAUTION: Save the key for later DID authentication. This key links you to the DID.
                    </Form.Text>
                </Form.Group>
            </Form.Row>

            <div style={{paddingTop: "1rem"}} />
            <Form.Row>
                <Form.Group as={Col} sm="12">
                    <Button
                        onClick={handleDownloadClicked}
                        variant="outline-primary"
                        size="lg">
                        Save Updated DID
                    </Button>
                    <Form.Text className="text-muted">
                        Save the DID information shown above in a &lt;did&gt;.updatedDoc.json file.
                    </Form.Text>

                </Form.Group>
            </Form.Row>
        </div>
    )
}

export default UpdateDDOT;