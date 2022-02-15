import { State } from '../utils/state';

import { initNear } from './near';

const initialState = {
	app: {
		mounted: false,
		tab: 1,
		sort: 2,
		filter: 1,
		nearToUsd: 0
	},
	near: {
		initialized: false,
	},
	views: {
		marketStoragePaid: '0',
		tokens: [],
		sales: [],
		allTokens: [],
		currentToken: null,
		offerErrorMessage: "",
		isLoadingTokens: true
	}
};
let snackTimeout;

export const { appStore, AppProvider } = State(initialState, 'app');

export const onAppMount = () => async ({ update, getState, dispatch }) => {
	let nearToUsdReq = await fetch("https://api.diadata.org/v1/foreignQuotation/CoinMarketCap/NEAR");
	let nearToUsdRes = await nearToUsdReq.json();
	update('app', { mounted: true, nearToUsd: nearToUsdRes.Price });
	dispatch(initNear());
};

export const snackAttack = (msg) => async ({ update, getState, dispatch }) => {
	console.log('Snacking on:', msg);
	update('app.snack', msg);
	if (snackTimeout) clearTimeout(snackTimeout);
	snackTimeout = setTimeout(() => update('app.snack', null), 3000);
};