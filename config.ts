const config = {
    isDev: true,
    url: {
        testnet: "https://testardor.jelurida.com",
        mainnet: "https://ardor.jelurida.com"
    },
    minIgnisBalance: {
        testnet: 10,
        mainnet: 2
    },
    devDid: {
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
        },
        account: "Alice",
        newAccount: "Bob",
    },
    formSpacing: "0.4rem"
}

export default config;