
# WARNING

This repository is a sample source code for NFT marketplace on NEAR. It's not ready and need improvements for production.   

# NFT Market Reference Implementation

A PoC backbone for NFT Marketplaces on NEAR Protocol.
- [NEP 171](https://nomicon.io/Standards/NonFungibleToken/README.html)
- [NFT Tutorial](https://github.com/near-examples/nft-tutorial)
- [NFT Market Tutorial](https://github.com/near-examples/nft-market)

# Changelog

[Changelog](changelog.md)

## Progress:
- [x] NFT & Market smart contracts following NEP-171
- [x] demo pay out royalties (FTs and NEAR)
- [x] test and determine standards for markets (best practice?) to buy/sell NFTs (finish standard) with FTs (already standard)
- [x] demo some basic auction types, secondary markets and
- [x] frontend with MUI (Material Design - React UI components )
- [x] first pass / internal audit
- [x] integrate with Crust dStorage Solution
- [x] integrate with DiaData - CoinMarketCap endpoint to convert NEAR to USD
- [x] integrate with Google Analytic to count page views for each NFT item.
- [x] use MongoDB to store extra profile data such as profile name, collection, banner, logo...
- [x] implement simple collection feature: each near wallet account has a collection name.
- [x] show collections & NFTs on home page
- [x] show related NFTs item on NFT detailed page.
- [ ] switch between chains (NEAR, Aurora, XRP, Ethereum...)
- [ ] connect with bridged tokens e.g. buy and sell with wETH/nDAI (or whatever we call these)

## Tech Stack
- [NextJS 11](https://nextjs.org/)
- [Mongo Atlas](https://www.mongodb.com/atlas/database)
- [MUI](https://mui.com/)
- Smart Contracts use [Rust](https://www.rust-lang.org/)
- IPFS uses [Crust](https://crust.network/)

## Installation

Beyond having npm and node (latest versions), you should have Rust installed. I recommend nightly because living on the edge is fun.

https://rustup.rs/

### Don't forget to install the wasm32 target:

`rustup target add wasm32-unknown-unknown`

Also recommend installing near-cli globally

`npm i -g near-cli`

Everything else can be installed via:
`yarn`
`cd server && yarn`

## NEAR Config

There is only one config.js file found in `src/config.js`, this is also used for running tests.

Using `src/config.js` you can set up your different environments. Use `REACT_APP_ENV` to switch environments e.g. in `package.json` script `deploy`.

## NEAR DEV account
You need create a NEAR wallet account for testing purpose.

Open neardev/dev-account.dev and change your dev account to build smart contracts. There are two accounts for NFT contract and Market contract.
NFT contract is built on main account, Market contract is built on sub-account. 

Read this [document](https://docs.near.org/docs/tools/near-cli#near-create-account) to create a sub-account

## Mongo Atlas Config

Open file `next.config.js` change mongoDB url.

## Google Analytic Config

For tracking page views, this app uses Google Analytic Api. Following steps below:
- Create a Google Analytic Account
- Create a project in Google Console based on this guide [Analytic Api](https://developers.google.com/analytics/devguides/reporting/core/v4/authorization)
- Change .env.example to .env and input information:
   - `GOOGGLE_ANALYTICS_TRACKING_ID`: Your tracking ID
   - `GOOGLE_ANALYTICS_VIEW_ID`: view id
   - `GOOGLE_CLIENT_EMAIL`: IAM user service account
   - `GOOGLE_CLIENT_ID`: client id
   - `GOOGLE_PRIVATE_KEY`: private key


## Working
**Build Smart Contract**:

- `source neardev/dev-account.dev`
- `npm run build-contract`

**Run Dev Mode for frontend**

- `npm run dev`

**Run Production Mode for frontend**
- `npm run build`
- `npm run start`

**App can be started by [PM2](https://pm2.keymetrics.io/)**
- `pm2 start npm --name "Your app name" -- run start`

   




