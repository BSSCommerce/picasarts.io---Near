import { KeyPair } from 'near-api-js';
import { u8aToHex } from '@polkadot/util'
import upload from './upload'
import pin from './pin'
const uploadToCrust = async (file) => {

    // 1. get authheader

    const keyPair = KeyPair.fromRandom('ed25519');

    // get address
    const addressRaw = keyPair.getPublicKey().toString();
    const address = addressRaw.substring(8);

    // get singature
    const {signature} = keyPair.sign(Buffer.from(address));
    const sig = u8aToHex(signature).substring(2);

    // Authorization: Bear <base64(ChainType-PubKey:SignedMsg)>
    // compile a authHeader
    const authHeaderRaw = `near-${address}:${sig}`;
    const authHeader = Buffer.from(authHeaderRaw).toString('base64');

    // 2. post files onto IPFS/Crust
    // const content = randomBytes(5000);
    // const contentHex = u8aToHex(await file.arrayBuffer());
    // let reader = new window.FileReader();
    // await reader.readAsArrayBuffer(file);
    let buffer =  Buffer.from(await file.arrayBuffer());
    const { cid, size, path } = await upload(authHeader, buffer);
    console.log(cid, size);

    const result = await pin(authHeader, cid, file.name);
    console.log(result);

    return { cid, path };
}

export default uploadToCrust;