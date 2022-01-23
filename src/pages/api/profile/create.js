import connectDB from 'src/middleware/mongodb';
import User from "src/models/User";

const handler = async (req, res) => {
    if (req.method === 'POST') {
        // Check if name, logo or description is provided
        const { account_id, logo, banner, bio, email, twitter, instagram, website, wallet_address } = req.body;
        if (account_id && email) {
            try {
                // Hash password to store it in DB
                let user = new User({
                    account_id,
                    logo,
                    banner,
                    bio,
                    email,
                    twitter,
                    instagram,
                    website,
                    wallet_address
                });
                // Create new user
                let createdUser = await user.save();
                return res.status(200).send(createdUser);
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