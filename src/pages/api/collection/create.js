import connectDB from 'src/middleware/mongodb';
import NftCollection from "src/models/NftCollection";

const handler = async (req, res) => {
    if (req.method === 'POST') {
        // Check if name, logo or description is provided
        const { name, logo, banner, description, account_id, collection_id } = req.body;
        if (name && logo && description) {
            try {
                // Hash password to store it in DB
                let collection = new NftCollection({
                    name,
                    logo,
                    banner,
                    description,
                    account_id,
                    collection_id
                });
                // Create new user
                let createdCollection = await collection.save();
                return res.status(200).send(createdCollection);
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