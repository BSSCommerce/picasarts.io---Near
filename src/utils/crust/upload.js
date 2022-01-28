import { create } from 'ipfs-http-client'

const ipfsGateway = 'https://crustwebsites.net';

const upload = async (authHeader, content) => {

    const ipfs = create({
        url: ipfsGateway + '/api/v0',
        headers: {
            authorization: 'Basic ' + authHeader
        }
    });
    const { cid } = await ipfs.add(content);
    console.log(cid.toString());
    const fileStat = await ipfs.files.stat("/ipfs/" + cid.toString());

    return {
        cid: cid.toString(),
        size: fileStat.cumulativeSize,
        path: `${ipfsGateway}/ipfs/${cid.toString()}`
    };
}

export default upload;