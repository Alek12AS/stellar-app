import {Keypair, Server, TransactionBuilder, Networks, Operation, BASE_FEE, Asset} from "stellar-sdk";

const server = new Server('https://horizon-testnet.stellar.org')

export async function CreateAccount(creator, userList, low_thresh, med_thresh, high_thresh) {

    const userListpk = [];
    const usernameList = [];

    const masterKeypair = Keypair.random();
    console.log(masterKeypair.publicKey());
    console.log(masterKeypair.secret());
    
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

    sendAccountToApi(masterKeypair.publicKey(), usernameList)
}


export function sendAccountToApi(masterPK, usernameList) {

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            create_account:{public_key: masterPK},
            usernames: usernameList
        }),
    };
    
    fetch('/api/create-account', requestOptions)

}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function RequestToSign(code, user_publicKey, medium_threshold, weight) {
    // post user details and transaction code to identify transaction
    var requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            code: code,
            public_key: user_publicKey,
            medium_threshold: medium_threshold,
            weight: weight
        }),
    };
    
    const resolved = false;

    while (!resolved) {
        fetch('/api/request-to-sign', requestOptions)
        .then((response) => response.json())
        .then(async (status, data) => {
            if (status == 200) {
                XDR = Sign(data.XDR, user_publicKey, medium_threshold, weight, data.total_signature_weight);
                if (XDR) {
                    requestOptions = {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            code: code,
                            weight: weight,
                            public_key: user_publicKey,
                            medium_threshold: medium_threshold,
                            XDR: XDR
                        }),
                    };

                    fetch('/api/transaction-signed', requestOptions).then((status) => {
                        if (status == 202) return "success";})
                
                    }  
                    return "failed";

                }
            else if (status == 226) {
                await sleep(2000);
            }
            else if (status == 406) {
                RejectTransaction()
                return "completed"
            }
    
        });
    }
    
}



export async function Sign(XDR, user_publicKey, medium_threshold, weight, total_signature_weight) {
    const transaction = TransactionBuilder.fromXDR(XDR, Networks.TESTNET);
    const secret = JSON.parse(sessionStorage.getItem("stellar_keypairs")).secret;

    const kp = Keypair.fromSecret(secret);

    transaction.sign(kp);

    if (weight + total_signature_weight == medium_threshold) {
        try {
            await server.submitTransaction(transaction);  
        } catch (e) {
            console.log("Transaction Failed!")
            console.log(e)
            return false
        }    
    }
    
    return transaction.toXDR();
    
}


export function RejectTransaction(code, user_publicKey) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            code: code,
            public_key: user_publicKey
        }),
    };
    fetch('/api/transaction-rejected', requestOptions).then((status) => {
        if (status == 202) {
            return true
        } else {return false}
    })
}

export async function CreateTransaction(account_id, user_publicKey, user_weight, destination, 
    amount, asset_type, notes, completed) {
    const kp = Keypair.fromSecret(JSON.parse(sessionStorage.getItem("stellar_keypairs")).secret);
    var XDR = "";
    await server.loadAccount(account_id)
    .then((account) => {
        const transaction = new TransactionBuilder(account, {
            fee: BASE_FEE,
            networkPassphrase: Networks.TESTNET
        })
        .addOperation(Operation.payment({
            destination: destination,
            amount: amount,
            asset: Asset.native()
        }))
        .setTimeout(0)
        .build()
        transaction.sign(kp)
        XDR = transaction.toXDR();
    })
    
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            account_id: account_id,
            user_publicKey: user_publicKey,
            user_weight: user_weight,
            transaction: {
            XDR: XDR,
            destination: destination,
            amount: amount,
            asset_type: asset_type,
            notes: notes,
            total_signature_weight: user_weight,
            completed: completed,
            available_to_sign: true,
            }
        }),
    };

    fetch('/api/create-transaction', requestOptions).then((status) => {
        if (status == 201) {
            return true
        }
    })
}

