# bba-did-ui

The source code for [WUBCO](https://wubco.blobaa.dev).

This repository contains the source code for the **W**eb **U**I for **B**BA **C**RUD **O**perations website. It wraps the [bba DID method handler](https://github.com/blobaa/bba-did-method-handler-ts) to provide a human friendly access to the [bba DID method](https://github.com/blobaa/bba-did-method-specification).


## Install

Clone repository:

````
git clone https://github.com/blobaa/bba-did-ui.git
````


Install dependencies:

````
npm install
````


Create a `.env` file containing the following variables:

| Variable            | Description                                                                                                                                          | Brief                                                                                                                        |
|---------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| RUN_ENV             | The run environment                                                                                                                                  | `dev` for development, `prod` for production. Deploying the website automatically sets this variable to prod. Defaults to `dev` |
| MAINNET_URL         | The mainnet Ardor node url                                                                                                                           | Defaults to https://ardor.jelurida.com                                                                                      |
| TESTNET_URL         | The testnet Ardor node url                                                                                                                           | Defaults to https://testardor.jelurida.com                                                                                  |
| MIN_TESTNET_BALANCE | The minimum testnet IGNIS balance a DID controller must own to process a create, update or deactivate operation. The balance is used to pay the fees | Defaults to 10                                                                                                              |
| MIN_MAINNET_BALANCE | The minimum mainnet IGNIS balance a DID controller must own to process a create, update or deactivate operation. The balance is used to pay the fees | Defaults to 2                                                                                                               |


Use the `.env-sample` file as template.


## Usage


### Development

run server for development:

````
npm run dev
````

The website is now accessible at `http://localhost:3000`.

In dev environment mode (`RUN_ENV=dev`) no request is made to an Ardor node and a dummy DID is used wich is stored within the `./src/dev.ts` file. This mode is primarly used for UI development. If you want to use the website locally to process bba's DID method operations, set the RUN_ENV variable to prod `RUN_ENV=prod`.


### Production

There are two options to deploy WUBCO.


#### Self Hosted

Creating a static website which can be served by any static web server.

Lint project:

````
npm run lint
````


Build project:

````
npm run build
````


Create static website:

````
npm run export
````


WUBCO is now available within the `./out` folder.


#### GitHub Pages

There is an easy way to serve WUBCO with [GitHub Pages](https://pages.github.com). Follow the steps below to set up GitHub Pages to serve WUBCO from within this repository (source repository).

1. Create a separate repository (target repository) and configure GitHub Pages to serve files from the root folder of the master branch of the target repository.
2. Create a `.env-production` file within the source repository and configure your production environment settings.
3. [Authorize SSH access](https://docs.github.com/en/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account) to the target repository from the system containing your source repository.

You can now deploy WUBCO with the following commands:

````
cd scripts
./deploy-frontend.sh -u <github user> -r <repository name> -d <domain>
````

Replace `<github user>` with your GitHub user name and `<repository name>` with the target repository name. Replace `<domain>` if you serve WUBCO under a custom domain. Otherwise do not use this option.


## Contributing
PRs accepted.

If editing the Readme, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License
[MIT](./LICENSE) © Attila Aldemir