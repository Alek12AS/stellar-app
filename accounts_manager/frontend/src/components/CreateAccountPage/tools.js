/*
Author: A.Apetrei

*/ 

import {Keypair, Server, TransactionBuilder, Networks, Operation} from "stellar-sdk";

const server = new Server('https://horizon-testnet.stellar.org')

export async function CreateAccount(creator, userList, low_thresh, med_thresh, high_thresh, account_name) {

    const userListpk = [];
    const usernameList = [];

    const masterKeypair = Keypair.random();
    
    await fetch('https://friendbot.stellar.org/?addr=' + masterKeypair.publicKey());

    for (const user of userList) {
        fetch('/api/get-publicKey' + '?username=' + user.username).then((response) => response.json()
        ).then((data) => {
            userListpk.push({publicKey: data.public_key,
            weight: user.weight})
        });
        usernameList.push(user.username);
    };

    userListpk.push({
        publicKey: creator.publicKey,
        weight: creator.weight
    });

    usernameList.push(creator.username);

    const thresholds = {
        masterWeight: 0,
        lowThreshold: low_thresh,
        medThreshold: med_thresh,
        highThreshold: high_thresh
    };


    const txOptions = {
        fee: await server.fetchBaseFee(),
        networkPassphrase: Networks.TESTNET
    };

    const masterAccount = await server.loadAccount(masterKeypair.publicKey());

    for (const user of userListpk) {
        var extraSigner = {
            signer: {
                ed25519PublicKey: user.publicKey,
                weight: user.weight
            }
        };

        const multiSigTx = new TransactionBuilder(masterAccount, txOptions)
        .addOperation(Operation.setOptions(extraSigner))
        .setTimeout(0)
        .build();

        multiSigTx.sign(masterKeypair);

        await server.submitTransaction(multiSigTx);

    }

    const multiSigTx = new TransactionBuilder(masterAccount, txOptions)
    .addOperation(Operation.setOptions(thresholds))
    .setTimeout(0)
    .build();

    multiSigTx.sign(masterKeypair);

    await server.submitTransaction(multiSigTx);

    await sendAccountToApi(masterKeypair.publicKey(), usernameList, account_name)

    return masterKeypair.publicKey();
}


async function sendAccountToApi(masterPK, usernameList, account_name) {

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            create_account:{public_key: masterPK, name: account_name},
            usernames: usernameList
        }),
    };
    
    await fetch('/api/create-account', requestOptions)

}