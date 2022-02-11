import connectDB from 'src/middleware/mongodb';
import User from "src/models/User";

const handler = async (req, res) => {
    if (req.method === 'GET') {
        // Check if name, logo or description is provided
        const { accountId } = req.query
        try {
            let user = await User.findOne({
                account_id: accountId
            });
            if (!user) {
                user = {};
            }
            return res.status(200).send(user);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    } else {
        res.status(422).send('req_method_not_supported');
    }
};

export default connectDB(handler);