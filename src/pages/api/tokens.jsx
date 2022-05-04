import connectDB from 'src/middleware/postgres';

const handler = async (req, res, pool) => {
    if (req.method === 'GET') {
        const { accountId } = req.query
        try {
            pool.query('SELECT assets__fungible_token_events.emitted_by_contract_account_id FROM assets__fungible_token_events WHERE assets__fungible_token_events.token_old_owner_account_id = $1 OR assets__fungible_token_events.token_new_owner_account_id = $1', 
            [accountId], (error, results) => {
                if (error) {
                    throw error
                }
                let result = [...new Set(results.rows.map(item => item.emitted_by_contract_account_id))];
                res.status(200).json(result)
            });
        } catch (error) {
            return res.status(500).send(error.message);
        }
    } else {
        res.status(422).send('req_method_not_supported');
    }
};

export default connectDB(handler);