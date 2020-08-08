#!/bin/bash


###################################################################################################
# DEFAULT CONFIGURATION
###################################################################################################

GITHUB_USER="<github user>"
DEPLOY_REPO_NAME="<deploy repo name>"
DOMAIN=""


###################################################################################################
# PARAMETER PARSING
###################################################################################################

while getopts "d:u:r:" opt; do
    case "$opt" in
    h|\?)
        echo "Parameter:"
        echo "-h  (help)"
        echo "-r  deploy repo name"
        echo "-d  domain"
        echo "-u  github user"
        exit 0
        ;;
    d)  DOMAIN=$OPTARG
        ;;
    u)  GITHUB_USER=$OPTARG
        ;;
    r)  DEPLOY_REPO_NAME=$OPTARG
        ;;
    esac
done


###################################################################################################
# DEFINES
###################################################################################################

GH_PAGES_FOLDER="./../gh-pages"
GH_PAGES_FOLDER_PATH="$(pwd)/${GH_PAGES_FOLDER}"


###################################################################################################
# MAIN
###################################################################################################

echo "[INFO] prepare project..."
mv ../.env ../.env-orig
mv ../.env-production ../.env


echo "[INFO] building static project..."
cd ..
rm -rf .next
rm -rf out
npm run build
npm run export
cd scripts


echo "" && echo "[INFO] cloning deploy repository..."
rm -rf ${DEPLOY_REPO_NAME}
git clone "git@github.com:${GITHUB_USER}/${DEPLOY_REPO_NAME}.git"


echo "" && echo "[INFO] overwriting cloned repository..."
cp -a ${DEPLOY_REPO_NAME}/.git .
rm -rf ${DEPLOY_REPO_NAME}/
mkdir ${DEPLOY_REPO_NAME}
mv .git ${DEPLOY_REPO_NAME}/.git

cp -r ../out/* ./${DEPLOY_REPO_NAME}


echo "" && echo "[INFO] adding nojekyll file..."
cd ${DEPLOY_REPO_NAME}
touch .nojekyll


echo "" && echo "[INFO] adding README file..."
cp ${GH_PAGES_FOLDER_PATH}/readme/README.md .


echo "" && echo "[INFO] adding .gitignore file..."
cp ${GH_PAGES_FOLDER_PATH}/git/gitignore .gitignore


if [ -n "${DOMAIN}" ]; then
    echo "" && echo "[INFO] adding CNAME file..."
    echo "${DOMAIN}" > CNAME
fi


echo "" && echo "[INFO] committing changes..."
git add .
git commit -m "updated $(date)"
git push


echo "" && echo "[INFO] cleaning up..."
cd ..
rm -rf ${DEPLOY_REPO_NAME}
mv ../.env ../.env-production
mv ../.env-orig ../.env


echo "" && echo "[INFO] done."