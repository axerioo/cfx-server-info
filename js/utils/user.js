export const getSteamId = (ids) => {
	const filteredIdentifiers = ids.filter((identifier) => identifier.startsWith('steam:'));
	if (filteredIdentifiers.length > 0) {
		return hexToDecimal(filteredIdentifiers[0].substring(filteredIdentifiers[0].indexOf(':') + 1));
	}
};

export const getDiscordId = (ids) => {
	const filteredIdentifiers = ids.filter((identifier) => identifier.startsWith('discord:'));
	if (filteredIdentifiers.length > 0) {
		return filteredIdentifiers[0].substring(filteredIdentifiers[0].indexOf(':') + 1);
	}
};

export const hexToDecimal = (s) => {
	let i;
	let j;
	let digits = [0];
	let carry;

	for (i = 0; i < s.length; i++) {
		carry = parseInt(s.charAt(i), 16);

		for (j = 0; j < digits.length; j++) {
			digits[j] = digits[j] * 16 + carry;
			carry = (digits[j] / 10) | 0;
			digits[j] %= 10;
		}

		while (carry > 0) {
			digits.push(carry % 10);
			carry = (carry / 10) | 0;
		}
	}
	return digits.reverse().join('');
};
