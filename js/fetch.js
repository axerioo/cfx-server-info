import { setServerInfo, setTitle } from './server.js';
import { getDiscordId, getSteamId } from './utils/user.js';
import { isSearching, searchElements } from './serach.js';
import { colorizePing } from './utils/color.js';

const STEAM_LINK = 'https://steamcommunity.com/profiles/%id%';
const DISCORD_LINK = 'https://discord.com/users/%id%';

const table = document.querySelector('table');
const searchInput = document.querySelector('#search-input');
const lastUpdate = document.querySelector('#last-update-text');
const timerIcon = document.querySelector('#refresh-timer');
const timer = document.querySelector('#refresh-timer-text');
const deleteButton = document.querySelector('#delete-data');
const resourcesButton = document.querySelector('#show-resources');
const refreshButton = document.querySelector('#refresh-button');
const timerControlButton = document.querySelector('#timer-control');
const resourcesContainer = document.querySelector('#resources-container');
const addServerId = document.querySelector('#add-server-id');
const serversButton = document.querySelector('#display-servers');
const servers = document.querySelector('#servers-container');

let seconds = 60;
let tempSeconds;
let fetcher;
let restartTimer = true;
let currentPlayers;
let resources;
export let resourcesVisible = false;

export const getPlayers = () => currentPlayers;
export const getResources = () => resources;

export const fetchServer = (serverId) => {
	refreshButton.onclick = () => {
		restartTimer = false;
		fetchServer(serverId);
	}
	deleteButton.onclick = clearStorage;
	resourcesButton.onclick = displayResources;
	timerControlButton.onclick = switchTimer;
	addServerId.onclick = addServer;
	serversButton.onclick = displayServers;

	let currentTime = new Date().toLocaleTimeString();
	resourcesContainer.style.display = 'none';
	servers.style.display = 'none';
	searchInput.placeholder = 'Search players';
	timerControlButton.querySelector('img').src = './img/pause.svg';
	timerIcon.querySelector('img').src = './img/refresh.svg';
	resourcesVisible = false;

	const url = `https://servers-frontend.fivem.net/api/servers/single/${serverId}`;
	console.info(`Fetching server data... - ID: ${serverId}`);
	fetch(url, {
		headers: {
			Accept: '*/*',
			'Content-Type': 'application/json',
			'User-Agent':
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
		},
	})
		.then((response) => response.json())
		.then((json) => {
			let players = json.Data.players;
			resources = json.Data.resources;

			setServerInfo(serverId, json.Data);
			startFetcher(serverId);
			players = formatPlayers(players);
			currentPlayers = players;
			renderPlayers(players);
			renderResources(resources);
			lastUpdate.textContent = currentTime;
			table.style.display = 'table';
		})
		.catch((error) => {
			console.error(error);
			lastUpdate.textContent = currentTime;
			setTitle('Error occurred while getting data');
		});
};

const startFetcher = (serverId) => {
	if (restartTimer) {
		clearInterval(fetcher);
		tempSeconds = seconds;
	}
	restartTimer = true;

	console.info(`Timer starting: ${tempSeconds}s`);
	if (fetcher) clearInterval(fetcher);
	fetcher = setInterval(() => {
		timer.textContent = tempSeconds + 's';
		if (tempSeconds === 1) {
			clearInterval(fetcher);
			fetchServer(serverId);
		}
		--tempSeconds;
	}, 1000);
};

const formatPlayers = (players) => {
	const formattedPlayers = [];
	players.forEach((player) => {
		const socials = {};

		if (player.identifiers) {
			const steamIdentifier = getSteamId(player.identifiers);
			if (steamIdentifier) socials.steam = steamIdentifier;

			const discordIdentifier = getDiscordId(player.identifiers);
			if (discordIdentifier) socials.discord = discordIdentifier;
		}

		formattedPlayers.push({
			name: player.name,
			id: player.id,
			socials,
			ping: player.ping,
			identifiers: player.identifiers,
		});
	});
	return formattedPlayers.sort((a, b) => a.id - b.id);
};

const addServer = () => {
	const id = prompt('Enter server ID');
	if (id.length != 6) {
		console.error('[Prompt] Server ID must be 6 characters long');
		return;
	} else if (!/^[a-zA-Z0-9]+$/.test(id)) {
		console.error('[Prompt] Server ID must contains a-z, A-Z, 0-9 characters');
		return;
	}
	localStorage.setItem('ids', localStorage.getItem('ids') + ';' + id);
}

const displayServers = () => {
	resetServers();
	if (localStorage.getItem('ids')) {
		const ids = localStorage.getItem('ids').split(';');
		const list = document.createElement('ul');

		if (servers.style.display === 'none') {
			if (ids.length > 0) {
				ids.forEach((id) => {
					if (id === 'null') return;
					const li = document.createElement('li');
					li.textContent = id;
					li.onclick = () => {
						fetchServer(id);
					}
					list.appendChild(li);
				});
				servers.appendChild(list);
				servers.style.display = 'flex';
			} else {
				console.error('You don\'t have any servers added');
			}
		} else {
			servers.style.display = 'none';
		}
	} else {
		console.error('You don\'t have any servers added');
	}
}

const switchTimer = () => {
	if (timerControlButton.querySelector('img').src.includes('pause')) {
		timerControlButton.querySelector('img').src = './img/play.svg';
		clearInterval(fetcher);
		document.querySelector('#refresh-timer').querySelector('img').src = './img/refresh-off.svg';
	} else {
		timerControlButton.querySelector('img').src = './img/pause.svg';
		restartTimer = false;
		startFetcher(localStorage.serverId);
		document.querySelector('#refresh-timer').querySelector('img').src = './img/refresh.svg';
	}
};

const CopyLicenses = (id) => () => {
	const licenses = currentPlayers.find((player) => player.id === id).identifiers;
	navigator.clipboard.writeText(licenses.join('\n'));
	console.info('All identifiers copied');
}

const clearStorage = () => {
	localStorage.clear();
	const url = new URL(window.location.href);
	url.searchParams.delete('serverId');
	window.history.replaceState(null, null, url);
	location.reload();
}

const displayResources = () => {
	if (resourcesContainer.style.display === 'none') {
		resourcesContainer.style.display = 'flex';
		table.style.display = 'none';
		resourcesVisible = true;
		searchInput.placeholder = 'Search resources';
	} else {
		resourcesContainer.style.display = 'none';
		table.style.display = 'table';
		resourcesVisible = false;
		searchInput.placeholder = 'Search players';
	}
}

const resetResources = () => {
	[...resourcesContainer.querySelectorAll('li')].forEach((li) => li.remove());
}

const resetServers = () => {
	[...servers.querySelectorAll('li')].forEach((li) => li.remove());
}

const resetTable = () => {
	[...table.querySelectorAll('tr')].filter((tr) => tr.id !== 'table-header').forEach((tr) => tr.remove());
};


export const renderResources = (resources, search = false) => {
	resetResources();

	const list = document.createElement('ul');
	resources = resources.sort();
	resources.forEach(resource => {
		const el = document.createElement('li');
		el.textContent = resource;
		list.appendChild(el);
	});
	console.info('Rendering resources:', resources.length);
	resourcesContainer.appendChild(list);
	if (isSearching() && !search) searchElements();
}

export const renderPlayers = (players, search = false) => {
	resetTable();

	console.info('Rendering players:', players.length);
	players.forEach((player) => {
		const tr = document.createElement('tr');

		const id = document.createElement('td');
		const name = document.createElement('td');
		const socials = document.createElement('td');
		const ping = document.createElement('td');
		const moreinfo = document.createElement('td');

		id.className = 'table-id';
		name.className = 'table-name';
		socials.className = 'table-socials';
		ping.className = 'table-ping';
		moreinfo.className = 'table-moreinfo';

		id.textContent = player.id;
		name.textContent = player.name;
		ping.innerHTML = colorizePing(player.ping);

		if (player.socials.steam) {
			const link = document.createElement('a');
			link.href = STEAM_LINK.replace('%id%', player.socials.steam);
			link.target = '_blank';
			link.innerHTML = '<img src="img/steam.svg" alt="Steam">';
			socials.appendChild(link);
		}
		if (player.socials.discord) {
			const link = document.createElement('a');
			link.href = DISCORD_LINK.replace('%id%', player.socials.discord);
			link.target = '_blank';
			link.innerHTML = '<img src="img/discord.svg" alt="Discord">';
			socials.appendChild(link);
		}

		if (player.identifiers) {
			const licenses = document.createElement('a');
			licenses.innerHTML = '<img src="img/text.svg" alt="More info">';
			licenses.onclick = CopyLicenses(player.id);
			moreinfo.appendChild(licenses);
		}

		tr.appendChild(id);
		tr.appendChild(name);
		tr.appendChild(socials);
		tr.appendChild(ping);
		tr.appendChild(moreinfo);

		table.appendChild(tr);
	});
	if (isSearching() && !search) searchElements();
};