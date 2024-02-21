import { fetchServer } from './fetch.js';
import { initializeSearch } from './serach.js';

window.addEventListener('DOMContentLoaded', () => {

	if (localStorage.getItem('lastId')) {
		localStorage.setItem('serverId', localStorage.getItem('lastId'));
		localStorage.removeItem('lastId');
		console.info('Old id fixed.');
	}

	initializeSearch();

	const serverIdSearch = document.querySelector('#server-id');
	serverIdSearch.addEventListener('keyup', (event) => {
		if (event.key === 'Enter' || event.keyCode === 13) {
			const value = serverIdSearch.value;

			if (value.length != 6) {
				console.error('Server ID must be 6 characters long');
				return;
			} else if (!/^[a-zA-Z0-9]+$/.test(value)) {
				console.error('Server ID must contains a-z, A-Z, 0-9 characters');
				return;
			}

			fetchServer(value);
			setId(value);
			console.info('ID taken from: input (ENTER pressed)');
		}
	});

	document.querySelector('#server-id-button').onclick = () => {
		const value = serverIdSearch.value;

		if (value.length != 6) {
			console.error('Server ID must be 6 characters long');
			return;
		} else if (!/^[a-zA-Z0-9]+$/.test(value)) {
			console.error('Server ID must contains a-z, A-Z, 0-9 characters');
			return;
		}

		fetchServer(value);
		setId(value);
		console.info('ID taken from: input (Button clicked)');
	};

	const url = new URL(window.location.href);
	if (url.searchParams.has('serverId')) {
		const serverId = url.searchParams.get('serverId');
		fetchServer(serverId);
		setId(serverId);
		console.info('ID taken from: URL');
		return;
	}

	const storageServerId = localStorage.getItem('serverId');
	if (storageServerId) {
		fetchServer(storageServerId);
		setId(storageServerId);
		console.info('ID taken from: localStorage');
	}

});

const serverIdInput = document.querySelector('#server-id');
const setId = (serverId) => {
	const url = new URL(window.location.href);
	url.searchParams.set('serverId', serverId);
	window.history.replaceState(null, null, url);
	serverIdInput.value = serverId;
	localStorage.setItem('serverId', serverId);
};