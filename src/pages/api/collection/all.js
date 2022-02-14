import connectDB from 'src/middleware/mongodb';
import User from "src/models/User";

const handler = async (req, res) => {
    if (req.method === 'GET') {
        const { limit } = req.query
        try {
            // One User - One Collection
            let collections = await User.find({
            }).limit(limit ? limit : 1000);
            return res.status(200).send(collections);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    } else {
        res.status(422).send('req_method_not_supported');
    }
};

export default connectDB(handler);