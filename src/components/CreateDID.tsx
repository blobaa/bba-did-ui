import { DIDDocKey, DIDDocKeyMaterial, DIDDocKeyType, DIDDocRelationship, DIDDocRelationshipType, DIDDocService, DIDDocument, DIDDocumentObject } from "@blobaa/did-document-ts";
import { FormEvent, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";



interface Props {
    test?: string;
}


const CreateDID: React.FC<Props> = (props) => {
    const [isTestnet, setIsTestnet] = useState(true);

    
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

        createDDOT(keyType, relationship, serviceName, serviceType, serviceUrl)
        .then((resp) => {
            console.log(resp);
        })
        .catch(() => {

        })
    }

    
    return (
        <div>
            <Form onSubmit={handleSubmitForm}>
                <Form.Row>
                    <Form.Group as={Col} sm="6" controlId="formPassphrase">
                        <Form.Label>Ardor Account Passphrase</Form.Label>
                        <Form.Control type="password" placeholder="Enter passphrase" />
                        <Form.Text className="text-muted">
                            The passphrase will never leave your browser.
                        </Form.Text>
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    <Form.Group controlId="formNetwork">
                        <Form.Label>Network</Form.Label>
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
                
                <Form.Group>
                    <Form.Label>DID Document Key</Form.Label>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formKeyType">
                            <Form.Label>Key Type:</Form.Label>
                            <Form.Control as="select">
                                <option>RSA</option>
                                <option>ED25519</option>
                            </Form.Control>
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
                        </Form.Group>
                    </Form.Row>
                </Form.Group>

                <Form.Group>
                    <Form.Label>DID Document Service</Form.Label>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formServiceName">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control type="text" placeholder="Enter service name"/>
                        </Form.Group>
                        <Form.Group as={Col} controlId="formServiceType">
                            <Form.Label>Type:</Form.Label>
                            <Form.Control type="text" placeholder="Enter service type"/>
                        </Form.Group>
                        <Form.Group as={Col} controlId="formServiceUrl">
                            <Form.Label>URL:</Form.Label>
                            <Form.Control type="text" placeholder="Enter service endpoint URL"/>
                        </Form.Group>
                    </Form.Row>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
}

const createDDOT = async(
                        keyType: string, 
                        relationship: string, 
                        serviceName: string, 
                        serviceType: string, 
                        serviceUrl: string): Promise<{ ddoc: DIDDocumentObject, keyMaterial: DIDDocKeyMaterial}> => {

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


    return {ddoc: document.publish(), keyMaterial: await key.exportKeyMaterial()}
}

export default CreateDID;