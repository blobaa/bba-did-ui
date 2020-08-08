import { account } from "@blobaa/ardor-ts";
import { bbaMethodHandler, Error as _Error, UpdateDIDControllerResponse } from "@blobaa/bba-did-method-handler-ts";
import fileDownload from "js-file-download";
import { FormEvent, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { FORM_SPACING } from "../constants";
import dev from "../dev";
import DotEnv from "../lib/DotEnv";
import Funds from "../lib/Funds";
import Time from "../lib/Time";
import Error from "./lib/Error";
import Success from "./lib/Success";


const UpdateController: React.FC = () => {
    const [ resultFragment, setResultFragment ] = useState(<div/> as React.ReactFragment);
    const [ isLoading, setIsLoading ] = useState(false);


    const handleSubmitForm = (event: FormEvent<HTMLFormElement>): void => {
        setIsLoading(true);
        event.preventDefault();
        event.stopPropagation();

        /*eslint-disable @typescript-eslint/no-explicit-any*/
        const did = (event.currentTarget.elements.namedItem("formDid") as any).value as string;
        const currentPassphrase = (event.currentTarget.elements.namedItem("formCurrentPassphrase") as any).value as string;
        const newPassphrase = (event.currentTarget.elements.namedItem("formNewPassphrase") as any).value as string;
        /*eslint-enable @typescript-eslint/no-explicit-any*/

        if (DotEnv.isDev) {
            const devResp = {
                did: dev.devDid.did.did,
                oldControllerAccount: dev.devDid.account,
                newControllerAccount: dev.devDid.newAccount
            };
            setTimeout(() => {
                setResultFragment(updatedControllerFragment(devResp));
                setIsLoading(false);
            }, dev.processMsec);
        } else {
            updateController(did, currentPassphrase, newPassphrase)
            .then((resp) => {
                setResultFragment(updatedControllerFragment(resp));
            })
            .catch((e) => {
                console.log(e);
                const error = e as _Error;
                const title = "Couldn't update DID Controller :(";
                setResultFragment(<Error title={title} message={error.description} />);
            })
            .finally(() => {
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
                            Your bba DID you want to update.
                        </Form.Text>
                    </Form.Group>
                </Form.Row>
                <div style={{ paddingTop: FORM_SPACING }}/>
                <Form.Row>
                    <Form.Group as={Col} sm="8" controlId="formCurrentPassphrase">
                        <Form.Label>Current DID Controller Passphrase:</Form.Label>
                        <Form.Control type="password" placeholder="Enter passphrase" />
                        <Form.Text className="text-muted">
                            Your current Ardor account passphrase. Your passphrase never leaves the browser.
                        </Form.Text>
                    </Form.Group>
                </Form.Row>
                <div style={{ paddingTop: FORM_SPACING }}/>
                <Form.Row>
                    <Form.Group as={Col} sm="8" controlId="formNewPassphrase">
                        <Form.Label>New DID Controller Passphrase:</Form.Label>
                        <Form.Control type="password" placeholder="Enter passphrase" />
                        <Form.Text className="text-muted">
                            Your new Ardor account passphrase. This passphrase also never leaves the browser :).
                        </Form.Text>
                    </Form.Group>
                </Form.Row>
                <div style={{ paddingTop: "1rem" }}/>
                <Button
                    variant="outline-primary"
                    type="submit">
                    {isLoading ? "Updating Controller..." : "Update DID Controller"}
                </Button>
            </Form>
            <div style={{ paddingTop: "3rem" }}/>
            {resultFragment}
        </div>
    );
};


const updateController = async(
                        did: string,
                        currentPassphrase: string,
                        newPassphrase: string
                    ): Promise<UpdateDIDControllerResponse> => {

    const didElements = did.split(":");
    const isTestnet = didElements[2] === "t";

    const url = isTestnet ? DotEnv.testnetUrl : DotEnv.mainnetUrl;
    const currentAccountRs = account.convertPassphraseToAccountRs(currentPassphrase);
    const newAccountRs = account.convertPassphraseToAccountRs(newPassphrase);
    const minBalance = isTestnet ? DotEnv.minTestnetBalance : DotEnv.minMainnetBalance;

    await Funds.checkFunds(url, currentAccountRs, minBalance);
    await Funds.checkFunds(url, newAccountRs, minBalance);

    return bbaMethodHandler.updateDIDController(url, {
        did,
        passphrase: currentPassphrase,
        newPassphrase
    });
};

const updatedControllerFragment = (updateControllerResponse: UpdateDIDControllerResponse): React.ReactFragment => {

    const handleDownloadClicked = (): void => {
        const didInfo = {
            did: updateControllerResponse.did,
            oldController: updateControllerResponse.oldControllerAccount,
            newController: updateControllerResponse.newControllerAccount,
            timestamp: Time.getUnixTime()
        };
        fileDownload(JSON.stringify(didInfo, undefined, 2), didInfo.did + ".updatedController.json");
    };


    return (
        <div>
            <Success title="DID Controller successfully updated :)"/>
            <div style={{ paddingTop: "1rem" }}/>
            <p style={{ fontSize: "1.8rem" }}>Results</p>
           <Form.Row>
                <Form.Group as={Col} sm="8">
                    <Form.Label>DID:</Form.Label>
                    <Form.Control
                        type="text"
                        readOnly
                        style={{ backgroundColor: "rgba(4, 159, 173, 0.05)" }}
                        value={updateControllerResponse.did}/>
                    <Form.Text className="text-muted">
                        Your decentralized identifier (DID)
                    </Form.Text>
                </Form.Group>
            </Form.Row>
            <div style={{ paddingTop: FORM_SPACING }}/>
            <Form.Row>
                <Form.Group as={Col} sm="6">
                    <Form.Label>Old DID Controller:</Form.Label>
                    <Form.Control
                        type="text"
                        readOnly
                        style={{ backgroundColor: "rgba(4, 159, 173, 0.05)" }}
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
                        style={{ backgroundColor: "rgba(4, 159, 173, 0.05)" }}
                        value={updateControllerResponse.newControllerAccount}/>
                    <Form.Text className="text-muted">
                        Your new DID controller account
                    </Form.Text>
                </Form.Group>
            </Form.Row>
            <div style={{ paddingTop: "2rem" }} />
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
    );
};

export default UpdateController;