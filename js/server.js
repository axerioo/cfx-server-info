import { fixColors } from './utils/color.js';

const serverName = document.querySelector('#server-name-text');
const serverIp = document.querySelector('#server-ip-text');
const serverPlayers = document.querySelector('#server-players-text');
const serverIdInput = document.querySelector('#server-id');

export const setServerInfo = (serverId, data) => {
	serverIdInput.value = serverId;
	let title = fixColors(data.hostname);
	setTitle(title);
	serverIp.textContent = data.connectEndPoints;
	serverPlayers.textContent = `${data.clients}/${data.svMaxclients ?? data.sv_maxclients ?? 0}`;
};

export const setTitle = (title) => {
	serverName.innerHTML = title;
};
