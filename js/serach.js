import { getPlayers, getResources, renderPlayers, renderResources, resourcesVisible } from './fetch.js';

let search;
let searching = false;

export const initializeSearch = () => {
	search = document.querySelector('#search-input');
	search.addEventListener('keyup', (event) => searchElements());
};

export const searchElements = () => {
	const value = search.value;
	if (resourcesVisible) {
		let resources = getResources();
		if (value.length < 1) {
			searching = false;
			return renderResources(resources, true);
		}

		searching = true;
		resources = resources.filter((resource) => resource.toLowerCase().includes(value.toLowerCase()));
		renderResources(resources, true);
	} else {
		let players = getPlayers();
		if (value.length < 1) {
			searching = false;
			return renderPlayers(players, true);
		}

		searching = true;
		players = players.filter(
			(player) => player.id.toString().startsWith(value) || player.name.toLowerCase().includes(value.toLowerCase())
		);
		renderPlayers(players, true);
	}
}

export const isSearching = () => searching;