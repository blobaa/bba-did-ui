import { account, chainCurrency, ChainCurrencyType, ChainId, GetBalanceResponse, request } from "@blobaa/ardor-ts";
import { bbaMethodHandler, CreateDIDResponse } from "@blobaa/bba-did-method-handler-ts";
import { DIDDocKey, DIDDocKeyMaterial, DIDDocKeyType, DIDDocRelationship, DIDDocRelationshipType, DIDDocService, DIDDocument, DIDDocumentObject } from "@blobaa/did-document-ts";
import fileDownload from "js-file-download";
import { FormEvent, useState } from "react";
import { Button, Col, Form, Alert } from "react-bootstrap";
import config from "../../config";
import Error from "./Error";
import TextArea from "./TextArea";


interface Props {
    test?: string;
}


const CreateDID: React.FC<Props> = (props) => {
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

        const resp = {
            did: {
                did: "did:bba:t:f4abd8c31f9c9d5ccef04122f0374d2164956adb912f2ac8dda282401877d6c6",
                didDocument: {
                    "@context": [
                        "https://www.w3.org/ns/did/v1",
                        "https://w3id.org/security/v1"
                    ],
                    id: "did:bba:t:f4abd8c31f9c9d5ccef04122f0374d2164956adb912f2ac8dda282401877d6c6",
                    publicKey: [
                        {
                            id: "did:bba:t:f4abd8c31f9c9d5ccef04122f0374d2164956adb912f2ac8dda282401877d6c6#zAHd7eezx43UGxJA7uH34W3GbF15RAfCTAjMp761LcEQXyTZs",
                            type: "RsaVerificationKey2018",
                            publicKeyPem: "-----BEGIN PUBLIC KEY-----\r\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6L1CkoMP8rcltj1o/MHm\r\ncYRsyOq7Y1BoJ0h/z3brT/6bYhT9kW0jiDmYtLfNZ75rYdmm8SghH8UodQWZ2BFJ\r\n8xfpphOXu7c91FBXI7/Zx3Ai+nHxuNlTxPYvV7prapB4kEdw0tqBRW6kG/P3rkoL\r\nQL1Ndme2eDpn0y57OnY9NlgBYXiCEaCiQYt9Ej1d2YcK5AuRgG//FfU0PHsDwAv4\r\nNC4oBP8xOHDwV4Gp2/Kr4lzTsLLSUoAuEnCfALNmVpaB6BraEmtsLSlQ7GwFaDel\r\noQPII+BNs2jTwcjWOTK94IGUHXmPwzHekQPzthmwOwiSdbXvfvA5/jtZhJeiSH4P\r\n6QIDAQAB\r\n-----END PUBLIC KEY-----\r\n"
                        }
                    ]
                },
            },
            keyMaterial: {
                id: "#zAHd7eezx43UGxJA7uH34W3GbF15RAfCTAjMp761LcEQXyTZs",
                type: "RsaVerificationKey2018",
                publicKeyPem: "-----BEGIN PUBLIC KEY-----\r\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6L1CkoMP8rcltj1o/MHm\r\ncYRsyOq7Y1BoJ0h/z3brT/6bYhT9kW0jiDmYtLfNZ75rYdmm8SghH8UodQWZ2BFJ\r\n8xfpphOXu7c91FBXI7/Zx3Ai+nHxuNlTxPYvV7prapB4kEdw0tqBRW6kG/P3rkoL\r\nQL1Ndme2eDpn0y57OnY9NlgBYXiCEaCiQYt9Ej1d2YcK5AuRgG//FfU0PHsDwAv4\r\nNC4oBP8xOHDwV4Gp2/Kr4lzTsLLSUoAuEnCfALNmVpaB6BraEmtsLSlQ7GwFaDel\r\noQPII+BNs2jTwcjWOTK94IGUHXmPwzHekQPzthmwOwiSdbXvfvA5/jtZhJeiSH4P\r\n6QIDAQAB\r\n-----END PUBLIC KEY-----\r\n",
                privateKeyPem: "-----BEGIN RSA PRIVATE KEY-----\r\nMIIEowIBAAKCAQEA6L1CkoMP8rcltj1o/MHmcYRsyOq7Y1BoJ0h/z3brT/6bYhT9\r\nkW0jiDmYtLfNZ75rYdmm8SghH8UodQWZ2BFJ8xfpphOXu7c91FBXI7/Zx3Ai+nHx\r\nuNlTxPYvV7prapB4kEdw0tqBRW6kG/P3rkoLQL1Ndme2eDpn0y57OnY9NlgBYXiC\r\nEaCiQYt9Ej1d2YcK5AuRgG//FfU0PHsDwAv4NC4oBP8xOHDwV4Gp2/Kr4lzTsLLS\r\nUoAuEnCfALNmVpaB6BraEmtsLSlQ7GwFaDeloQPII+BNs2jTwcjWOTK94IGUHXmP\r\nwzHekQPzthmwOwiSdbXvfvA5/jtZhJeiSH4P6QIDAQABAoIBAASHG5xrIHxUBN3w\r\nR/YfFXXNSSOAf/4Ji1WfMuw7WmPBJqQaF7dSwPouY48dJfRtXZ/vu3dWhpqqmEeI\r\n+eMx2HczMwhfSF+K4VD4Die1lZTzVI7fzeMH7ADrL7n8cQiyY6dk6GgFuGC1R9oZ\r\nB91s9rqUZDcmWIs5Zv1nzFalS4Flv3WBMhvG7Po95bfFUb6fNdiFWGwRtNKDToPS\r\nPET4oKa5KrrT0v7BdK2XNezpFiJt87UKgPIjPtq90cHjaCbbBv3E2I5FoDyVklCV\r\n4qnrn+2+HC5Xk3NvyV2MB31BlmC2gXb69MKjZq6s63err79Ce5f69jpvsZtkS+iM\r\nyaJNEm0CgYEA9dj+S+hI0kJ7Kt19vMeU70nJzJeLY9He9VcU4kMplPZgAaUwVvg5\r\nzVYY3GXYc5SzzVG7i6FAKkydPdzFQKzvIc6mqELjvhDD2nKVB21T1r2FW6iWpBWx\r\nrfD6R3cvVtniTgbcA1q2e77J6VUiJH3nySuYp50Syhyc6jKd6C6a3O0CgYEA8lmw\r\nwM/Bqo9sKBWyab91YUH4zhoQ5Yk7ke+BV39eyP4/XuROemzVcxmGwBWmIfqpULsp\r\n5luhizlchiCfkcBfuBBAEy2I/qKbN2K26SMSx0TBzFFOBWVyZ/smWc3LUnDEmJCq\r\njSoZXsdlp86MyZNlXN2N/MHwQgMGY4EnqkElG20CgYAvJlu3ASieMqPel7Yas4hL\r\n0DIEq/fOwBxrnzThJBJggFPvXNgFhfvH9sAz3NCDcjx9nzRB1j4xHpp1l9a4zbHb\r\nIP/ze0ikViDJz3nnf785iwV9i7rAY2y9OF83v5LzrDvrzQL7HbWry+57cplmuELw\r\n4QyY8NX+rzgk7mo8clu/DQKBgQCab6NeS0ZrzTesF595GePQFX1awWuRCjGm3sw6\r\nmNUrGjIB41VLWL1wuoyPLXyP3K823f5maG/6S5R1eKaW99NHdTuPvQ22zqJA2iwb\r\nRxl5WIxzCkDA2ZPdRUN8KNNvdqMhYdb9XB2Ms15JYCuBbOdEFX+c2W2kc08H687+\r\nBMODxQKBgFN6rCEdjl2zKFFOgf48C0bjyxAJ9oeFK/y4s+J5jzDb2Xb5ILA/xiLg\r\nqNNlFZaLbWbJKEp/Oc1KDFCZdDZ9P6aMCg/SoYOOIHU96PGONUhmtCvttQzG8mRD\r\nGJ32Q8Jr1SLk7R6BXgWiAxHtCUefZbMZPPgxNZivQq1Gr6WC1L49\r\n-----END RSA PRIVATE KEY-----\r\n"
            }
        }
        setResultFragment(didFragment(resp.did, resp.keyMaterial, passphrase))

        // createDID(keyType, relationship, serviceName, serviceType, serviceUrl, passphrase, isTestnet)
        // .then((resp) => {
        //     console.log(resp);
        //     setResultFragment(didFragment(resp.did, resp.keyMaterial, passphrase))
        // })
        // .catch((error) => {
        //     setResultFragment(<Error message={error} />);
        // })
    }

    
    return (
        <div>
            <Form onSubmit={handleSubmitForm}>
                <Form.Row>
                    <Form.Group as={Col} sm="8" controlId="formPassphrase">
                        <Form.Label>DID Controller Passphrase:</Form.Label>
                        <Form.Control type="password" placeholder="Enter passphrase" />
                        <Form.Text className="text-muted">
                            Your Ardor account passphrase. The passphrase will never leave the browser.
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
                            <Form.Text className="text-muted">
                                The DID Document Key Type
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
                                The verification relationship the key will be used for. Select None if the key should be generic.
                            </Form.Text>
                        </Form.Group>
                    </Form.Row>
                </Form.Group>

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

                <Button 
                    variant="outline-primary"
                    type="submit">
                    Create DID
                </Button>
            </Form>
            <div style={{paddingTop: "2rem"}}/>
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
    
    await checkFunds(isTestnet, passphrase);

    const createDDOTReturn = await createDDOT(keyType, relationship, serviceName, serviceType, serviceUrl);

    const url = isTestnet ? config.url.testnet : config.url.mainnet;
    const createDIDResponse = await bbaMethodHandler.createDID(url, {
        didDocumentTemplate: createDDOTReturn.ddot,
        passphrase: passphrase,
        isTestnetDid: isTestnet
    });
    
    return { keyMaterial:  createDDOTReturn.keyMaterial, did: createDIDResponse}
}

const checkFunds = async(isTestnet: boolean, passphrase: string): Promise<void> => {
    const acc = account.convertPassphraseToAccountRs(passphrase);
    let balance = {} as GetBalanceResponse;
    let minBalance = 0;

    if (isTestnet) {
        balance = await request.getBalance(config.url.testnet, { account: acc, chain: ChainId.IGNIS });
        minBalance = config.minIgnisBalance.testnet;
    } else {
        balance = await request.getBalance(config.url.mainnet, { account: acc, chain: ChainId.IGNIS });
        minBalance = config.minIgnisBalance.mainnet;
    }

    const ignis = chainCurrency.convertFromBaseUnit(parseInt(balance.balanceNQT), ChainCurrencyType.IGNIS);

    if (ignis < minBalance) {
        return Promise.reject("You need at least " + minBalance + " IGNIS to cover the fees");
    }
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


const didFragment = (did: CreateDIDResponse, keyMaterial: DIDDocKeyMaterial, passphrase: string): React.ReactFragment => {
    const controller = account.convertPassphraseToAccountRs(passphrase);
    
    const handleDownloadClicked = () => {
        const didInfo = {
            did: did.did,
            didDoc: did.didDocument,
            key: keyMaterial,
            controller: controller
        }
        fileDownload(JSON.stringify(didInfo, undefined, 2), did.did + ".info.json");
    }


    return (
        <div>
            <Alert variant="success">DID successfully created</Alert>
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
                        The DID controller account
                    </Form.Text>
                </Form.Group>
            </Form.Row>
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

            <Form.Row>
                <Form.Group as={Col} sm="12">
                    <Form.Label>DID Document Key:</Form.Label>
                    <TextArea
                        height="15rem"
                        value={JSON.stringify(keyMaterial, undefined, 2)}
                    />
                    <Form.Text className="text-muted">
                        The key inside your DID Document. CAUTION: Save the key for later DID authentication. This key links you to the DID.
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
                        Save DID Info
                    </Button>
                    <Form.Text className="text-muted">
                        Save the DID information shown above in a *.json file
                    </Form.Text>

                </Form.Group>
            </Form.Row>
        </div>
    )
}

export default CreateDID;