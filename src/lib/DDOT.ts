import { DIDDocumentObject, DIDDocKeyMaterial, DIDDocKey, DIDDocKeyType, DIDDocRelationship, DIDDocRelationshipType, DIDDocService, DIDDocument } from "@blobaa/did-document-ts";


export default class DDOT {
    public static create = async (
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


        return {ddot: document.publish(), keyMaterial: await key.exportKeyMaterial() };
    }

}