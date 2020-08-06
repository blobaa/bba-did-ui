import { account } from "@blobaa/ardor-ts";
import { bbaMethodHandler, UpdateDIDControllerResponse } from "@blobaa/bba-did-method-handler-ts";
import fileDownload from "js-file-download";
import { FormEvent, useState } from "react";
import { Alert, Button, Col, Form } from "react-bootstrap";
import config from "../../config";
import Funds from "../lib/Funds";
import Time from "../lib/Time";
import Error from "./lib/Error";


interface Props {
    test?: string;
}


const UpdateController: React.FC<Props> = (props) => {
    const [ resultFragment, setResultFragment ] = useState(<div/> as React.ReactFragment);
    

    const handleSubmitForm = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const did = (event.currentTarget.elements.namedItem("formDid") as any).value as string;
        const currentPassphrase = (event.currentTarget.elements.namedItem("formCurrentPassphrase") as any).value as string;
        const newPassphrase = (event.currentTarget.elements.namedItem("formNewPassphrase") as any).value as string;

        if (config.isDev) {
            const controllerResp = {
                did: config.devDid.did.did,
                oldControllerAccount: config.devDid.account,
                newControllerAccount: config.devDid.newAccount
            }
            setResultFragment(updatedControllerFragment(controllerResp));
        } else {
            updateController(did, currentPassphrase, newPassphrase)
            .then((resp) => {
                setResultFragment(updatedControllerFragment(resp));
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
                    <Form.Group as={Col} sm="8" controlId="formCurrentPassphrase">
                        <Form.Label>Current DID Controller Passphrase:</Form.Label>
                        <Form.Control type="password" placeholder="Enter passphrase" />
                        <Form.Text className="text-muted">
                            Your current Ardor account passphrase. Your passphrase never leaves the browser.
                        </Form.Text>
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    <Form.Group as={Col} sm="8" controlId="formNewPassphrase">
                        <Form.Label>New DID Controller Passphrase:</Form.Label>
                        <Form.Control type="password" placeholder="Enter passphrase" />
                        <Form.Text className="text-muted">
                            Your new Ardor account passphrase. This passphrase also never leaves the browser :).
                        </Form.Text>
                    </Form.Group>
                </Form.Row>

                <Button 
                    variant="outline-primary"
                    type="submit">
                    Update DID Controller
                </Button>
            </Form>
            <div style={{paddingTop: "2rem"}}/>
            {resultFragment}
        </div>
    );
}


const updateController = async( 
                        did: string, 
                        currentPassphrase: string, 
                        newPassphrase: string
                    ): Promise<UpdateDIDControllerResponse> => {

    const didElements = did.split(":");
    const isTestnet = didElements[2] === "t";

    const url = isTestnet ? config.url.testnet : config.url.mainnet;
    const currentAccountRs = account.convertPassphraseToAccountRs(currentPassphrase);
    const newAccountRs = account.convertPassphraseToAccountRs(newPassphrase);
    const minBalance = isTestnet ? config.minIgnisBalance.testnet : config.minIgnisBalance.mainnet;

    await Funds.checkFunds(url, currentAccountRs, minBalance);
    await Funds.checkFunds(url, newAccountRs, minBalance);

    return bbaMethodHandler.updateDIDController(url, {
        did: did,
        passphrase: currentPassphrase,
        newPassphrase: newPassphrase
    });
}

const updatedControllerFragment = (updateControllerResponse: UpdateDIDControllerResponse): React.ReactFragment => {
    
    const handleDownloadClicked = () => {
        const didInfo = {
            did: updateControllerResponse.did,
            oldController: updateControllerResponse.oldControllerAccount,
            newController: updateControllerResponse.newControllerAccount,
            timestamp: Time.getUnixTime()
        }
        fileDownload(JSON.stringify(didInfo, undefined, 2), didInfo.did + ".updatedController.json");
    }


    return (
        <div>
            <Alert variant="success">DID Controller successfully updated :)</Alert>
           <Form.Row>
                <Form.Group as={Col} sm="8">
                    <Form.Label>DID:</Form.Label>
                    <Form.Control 
                        type="text"
                        readOnly 
                        style={{backgroundColor: "rgba(4, 159, 173, 0.05)"}}
                        value={updateControllerResponse.did}/>
                    <Form.Text className="text-muted">
                        Your decentralized identifier (DID)
                    </Form.Text>
                </Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group as={Col} sm="6">
                    <Form.Label>Old DID Controller:</Form.Label>
                    <Form.Control 
                        type="text"
                        readOnly 
                        style={{backgroundColor: "rgba(4, 159, 173, 0.05)"}}
                        value={updateControllerResponse.oldControllerAccount}/>
                    <Form.Text className="text-muted">
                        Your old DID controller account
                    </Form.Text>
                </Form.Group>
                <Form.Group as={Col} sm="6">
                    <Form.Label>New DID Controller:</Form.Label>
                    <Form.Control 
                        type="text"
                        readOnly 
                        style={{backgroundColor: "rgba(4, 159, 173, 0.05)"}}
                        value={updateControllerResponse.newControllerAccount}/>
                    <Form.Text className="text-muted">
                        Your new DID controller account
                    </Form.Text>
                </Form.Group>
            </Form.Row>


            <div style={{paddingTop: "1rem"}} />
            <Form.Row>
                <Form.Group as={Col} sm="12">
                    <Button
                        onClick={handleDownloadClicked}
                        variant="outline-primary">
                        Save Updated DID
                    </Button>
                    <Form.Text className="text-muted">
                        Save the DID information shown above in a &lt;did&gt;.updatedController.json file.
                    </Form.Text>

                </Form.Group>
            </Form.Row>
        </div>
    )
}

export default UpdateController;