import connectDB from 'src/middleware/mongodb';
import User from "src/models/User";

const handler = async (req, res) => {
    if (req.method === 'POST') {
        // Check if name, logo or description is provided
        const { account_id, logo, banner, bio, email, twitter, instagram, website, walletAddress } = req.body;
        console.log(req.body);
        if (account_id && email) {
            try {
                let checkedUser = await User.findOneAndUpdate({
                    account_id: account_id
                }, {
                    account_id,
                    logo,
                    banner,
                    bio,
                    email,
                    twitter,
                    instagram,
                    website,
                    wallet_address: walletAddress
                }, {upsert: true});
                // Create new user
                return res.status(200).send(checkedUser);
            } catch (error) {
                return res.status(500).send(error.message);
            }
        } else {
            res.status(422).send('data_incomplete');
        }
    } else {
        res.status(422).send('req_method_not_supported');
    }
};

export default connectDB(handler);