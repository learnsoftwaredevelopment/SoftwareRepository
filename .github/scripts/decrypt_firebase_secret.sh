#!/bin/sh

# Script to decrypt firebase secret

# Create the environment and decrypt the file
mkdir $HOME/secrets
gpg --quiet --batch --yes --decrypt --passphrase="$DECRYPTION_PASSPHRASE" --output ./.github/ci/firebase_secret.json ./.github/ci/firebase.gpg