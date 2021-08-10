/*
Author: A.Apetrei

*/ 


import {Keypair, Server, TransactionBuilder, Networks, Operation, BASE_FEE, Asset} from "stellar-sdk";

const server = new Server('https://horizon-testnet.stellar.org')

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
    
    var resolved = false;

    while (!resolved) {
    
        var signRequest_response = await fetch('/api/request-to-sign', requestOptions);

        if (signRequest_response.status == 200) {
            var sign_data = await signRequest_response.json();
            var XDR = await Sign(sign_data.XDR, user_publicKey, medium_threshold, weight, sign_data.total_signature_weight);
            
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
                
                resolved  = true;
                
                let signed_response = await fetch('/api/transaction-signed', requestOptions);
                
                if (signed_response.status == 202) return true;
                
                return false;  
            } else {
                requestOptions = {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        code: code
                    }),
                };
                await fetch('/api/make-available', requestOptions);
                return false  
            };
        }

        else if (signRequest_response.status == 226) {
            await sleep(2000);
        }

        else if (signRequest_response.status == 208) {
            return "already_complete"
        }
        
        else if (signRequest_response.status == 406) {
            RejectTransaction()
            return "cannot_sign"
            
        }

    }
    
}



export async function Sign(XDR, user_publicKey, medium_threshold, weight, total_signature_weight) {
    try {
        const transaction = TransactionBuilder.fromXDR(XDR, Networks.TESTNET);
        const secret = JSON.parse(sessionStorage.getItem("stellar_keypair")).secret;
        const kp = Keypair.fromSecret(secret);

        transaction.sign(kp);

        if (weight + total_signature_weight == medium_threshold) {
                console.log("submitting transaction");
                await server.submitTransaction(transaction);             
        }
        return transaction.toXDR(); 
    }

    catch(e) {
        console.log(e)
        return false
    }
    
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
    const kp = Keypair.fromSecret(JSON.parse(sessionStorage.getItem("stellar_keypair")).secret);
    var XDR = "";
    
    try{
        await server.loadAccount(destination); 
    } catch(e) {
        return false
    }

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

    const response = await fetch('/api/create-transaction', requestOptions);
    
    if (response.status == 201) {
        return true
    }
    
}
