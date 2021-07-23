import {Keypair, Server, TransactionBuilder, Networks, Operation} from "stellar-sdk";

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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function RequestToSign(code, user_publicKey, medium_threshold, weight) {
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
        .then((status, data) => {
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
                    fetch('/api/transaction-signed', requestOptions)
                }
                resolved = true;
                return true
            }
            else if (status == 226) {
                await sleep(2000);
            }
            else if (status == 406) {
                return false
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
        } 
        return false   
    }
    else {
        return transaction.toXDR();
    }
}


// export async function GetAccountDetails() {
//     await server.loadAccount((account) => this.state.account_details = JSON.parse(account));   
// }

