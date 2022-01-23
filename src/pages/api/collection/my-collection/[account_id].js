import connectDB from 'src/middleware/mongodb';
import NftCollection from "src/models/NftCollection";

const handler = async (req, res) => {
    if (req.method === 'GET') {
        // Check if name, logo or description is provided

        try {
            let collections = await NftCollection.find({
                account_id: req.query.account_id
            });
            return res.status(200).send(collections);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    } else {
        res.status(422).send('req_method_not_supported');
    }
};

export default connectDB(handler);