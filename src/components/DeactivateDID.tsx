import { account } from "@blobaa/ardor-ts";
import { bbaMethodHandler } from "@blobaa/bba-did-method-handler-ts";
import fileDownload from "js-file-download";
import { FormEvent, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import config from "../../config";
import Funds from "../lib/Funds";
import Time from "../lib/Time";
import Error from "./lib/Error";
import Success from "./lib/Success";


const DeactivateDID: React.FC = () => {
    const [ resultFragment, setResultFragment ] = useState(<div/> as React.ReactFragment);


    const handleSubmitForm = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        event.stopPropagation();

        /*eslint-disable @typescript-eslint/no-explicit-any*/
        const did = (event.currentTarget.elements.namedItem("formDid") as any).value as string;
        const passphrase = (event.currentTarget.elements.namedItem("formPassphrase") as any).value as string;
        /*eslint-enable @typescript-eslint/no-explicit-any*/

        if (config.isDev) {
            const devResp = {
                deactivatedDid: config.devDid.did.did,
                controller: config.devDid.account
            };
            setResultFragment(deactivatedDIDFragment(devResp));
        } else {
            deactivateDID(did, passphrase)
            .then((resp) => {
                setResultFragment(deactivatedDIDFragment(resp));
            })
            .catch((error) => {
                console.log(error);
                setResultFragment(<Error message={"Couldn't deactivate DID :("} />);
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
                            Your bba DID you want to deactivate.
                        </Form.Text>
                    </Form.Group>
                </Form.Row>
                <div style={{ paddingTop: config.formSpacing }}/>
                <Form.Row>
                    <Form.Group as={Col} sm="8" controlId="formPassphrase">
                        <Form.Label>DID Controller Passphrase:</Form.Label>
                        <Form.Control type="password" placeholder="Enter passphrase" />
                        <Form.Text className="text-muted">
                            Your Ardor account passphrase. Your passphrase never leaves the browser.
                        </Form.Text>
                    </Form.Group>
                </Form.Row>
                <div style={{ paddingTop: "1rem" }}/>
                <Button
                    variant="outline-primary"
                    type="submit">
                    Deactivate DID
                </Button>
            </Form>
            <div style={{ paddingTop: "3rem" }}/>
            {resultFragment}
        </div>
    );
};


const deactivateDID = async(did: string, passphrase: string): Promise<{deactivatedDid: string; controller: string}> => {

    const didElements = did.split(":");
    const isTestnet = didElements[2] === "t";

    const url = isTestnet ? config.url.testnet : config.url.mainnet;
    const accountRs = account.convertPassphraseToAccountRs(passphrase);
    const minBalance = isTestnet ? config.minIgnisBalance.testnet : config.minIgnisBalance.mainnet;

    await Funds.checkFunds(url, accountRs, minBalance);

    const response = await bbaMethodHandler.deactivateDID(url, {
        did,
        passphrase
    });

    return ({ deactivatedDid: response.deactivatedDid, controller: accountRs });
};

const deactivatedDIDFragment = (params: { deactivatedDid: string; controller: string }): React.ReactFragment => {

    const handleDownloadClicked = (): void => {
        const didInfo = {
            deactivatedDid: params.deactivatedDid,
            lastController: params.controller,
            timestamp: Time.getUnixTime()
        };
        fileDownload(JSON.stringify(didInfo, undefined, 2), didInfo.deactivatedDid + ".deactivated.json");
    };


    return (
        <div>
            <Success message="DID successfully deactivated :)"/>
            <div style={{ paddingTop: "1rem" }}/>
            <p style={{ fontSize: "1.8rem" }}>Results</p>
           <Form.Row>
                <Form.Group as={Col} sm="8">
                    <Form.Label>DID:</Form.Label>
                    <Form.Control
                        type="text"
                        readOnly
                        style={{ backgroundColor: "rgba(4, 159, 173, 0.05)" }}
                        value={params.deactivatedDid}/>
                    <Form.Text className="text-muted">
                        Your deactivated decentralized identifier (DID)
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
                        Your last DID controller account
                    </Form.Text>
                </Form.Group>
            </Form.Row>
            <div style={{ paddingTop: "2rem" }} />
            <Form.Row>
                <Form.Group as={Col} sm="12">
                    <Button
                        onClick={handleDownloadClicked}
                        variant="outline-primary">
                        Save Deactivated DID
                    </Button>
                    <Form.Text className="text-muted">
                        Save the DID information shown above in a &lt;did&gt;.deactivated.json file.
                    </Form.Text>
                </Form.Group>
            </Form.Row>
        </div>
    );
};

export default DeactivateDID;