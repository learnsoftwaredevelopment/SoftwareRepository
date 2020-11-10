#!/bin/sh

# Script to decrypt firebase secret

# Create the environment and decrypt the file
mkdir $HOME/secrets
gpg --quiet --batch --yes --decrypt --passphrase="$DECRYPTION_PASSPHRASE" --output $HOME/secrets/firebase_secret.json ./.github/ci/firebase.gpg