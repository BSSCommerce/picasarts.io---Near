import BN from 'bn.js'
import { GAS, parseNearAmount, marketId, contractId } from '../state/near';
import { uploadToCrust } from "near-crust-ipfs";
export const handleMint = async (account, royalties, media, validMedia, title, description, setValidateTitleMessage, setIsRequireMediaMessage, setValidateRoyaltiesMessage, setIsLoading) => {
    setIsLoading(true);
    if (!title) {
        setValidateTitleMessage("Please enter item title")
        setIsLoading(false);
        return false;
    } else {
        setValidateTitleMessage("");
    }
    if (!media) {
        setIsRequireMediaMessage('Please enter a valid Image Link');
        setIsLoading(false);
        return false;
    } else {
        setIsRequireMediaMessage("");
    }

    const {cid, path} = await uploadToCrust( media );
    // shape royalties data for minting and check max is < 20%
    let perpetual_royalties = Object.entries(royalties).map(([receiver, royalty]) => ({
        [receiver]: royalty * 100
    })).reduce((acc, cur) => Object.assign(acc, cur), {});
    if (Object.values(perpetual_royalties).reduce((a, c) => a + c, 0) > 2000) {
        setValidateRoyaltiesMessage('Cannot add more than 20% in perpetual NFT royalties when minting');
        setIsLoading(false);
        return false;
    } else {
        setValidateRoyaltiesMessage("");
    }
    
    const metadata = {
        title: title,
        description: description,
        media: path,
        issued_at: Date.now()
    };
    const deposit = parseNearAmount('0.1');
    await account.functionCall(contractId, 'nft_mint', {
        token_id: 'token-' + Date.now(),
        metadata,
        perpetual_royalties,
        receiver_id: account.accountId
    }, GAS, deposit);
    setIsLoading(false);
};

export const handleAcceptOffer = async (account, token_id, ft_token_id) => {
    if (ft_token_id !== 'near') {
        return alert('currently only accepting NEAR offers');
    }
    await account.functionCall(marketId, 'accept_offer', {
        nft_contract_id: contractId,
        token_id,
        ft_token_id,
    }, GAS);
};

export const handleRegisterStorage = async (account) => {
    // WARNING this just pays for 10 "spots" to sell NFTs in marketplace vs. paying each time
    await account.functionCall(
        marketId,
        'storage_deposit',
        {},
        GAS,
        new BN(await account.viewFunction(marketId, 'storage_amount', {}, GAS)).mul(new BN('10'))
    )
};

export const handleSaleUpdate = async (account, token_id, newSaleConditions) => {
    const sale = await account.viewFunction(marketId, 'get_sale', { nft_contract_token: contractId + ":" + token_id }).catch(() => { });
    if (sale) {
        await account.functionCall(marketId, 'update_price', {
            nft_contract_id: contractId,
            token_id,
            ft_token_id: newSaleConditions[0].ft_token_id,
            price: newSaleConditions[0].price
        }, GAS);
    } else {
        await account.functionCall(contractId, 'nft_approve', {
            token_id,
            account_id: marketId,
            msg: JSON.stringify({ sale_conditions: newSaleConditions })
        }, GAS, parseNearAmount('0.01'));
    }
};