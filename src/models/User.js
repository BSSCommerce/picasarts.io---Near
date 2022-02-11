import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let user = new Schema({
    account_id: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: false
    },
    banner: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    twitter: {
        type: String,
        required: false
    },
    instagram: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false
    },
    wallet_address: {
        type: String,
        required: false
    },
    collection_name: {
        type: String,
        required: false
    }

});
mongoose.models = {};
let User = mongoose.model('User', user);

export default User;