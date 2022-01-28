import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let nftCollection = new Schema({
    name: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    banner: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    account_id: {
        type: String,
        required: true
    },
    collection_id: {
        type: String,
        required: true
    }
});
mongoose.models = {};
let NftCollection = mongoose.model('NftCollection', nftCollection);

export default NftCollection;