import axios from 'axios';
import chalk from 'chalk';
import { printError } from './log.service.js';
import { getKeyValue, USER_DICT } from './storage.service.js';


function isEmptyObject(obj) {
	for (var i in obj) {
		if (obj.hasOwnProperty(i)) {
			return false;
		}
	}
	return true;
}

const getCryptoPrice = async (crypto) => {
	if (USER_DICT.cur == true) {
		var curr = (await getKeyValue(USER_DICT.cur)).toLowerCase();
	} else {
		var curr = 'usd';
	}
	try {
		const symbol = crypto.toLowerCase();

		const { data } = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=${curr}`);
		if (isEmptyObject(data) == true) {
			printError(`${symbol} не найдено \n${(chalk.bgRed(' ERROR '))}` + ' список наименований криптовалют: https://goo-gl.me/txG03 (к примеру bitcoin)');
		} else if ((data[symbol][curr]) == undefined) {
			printError(`валюты ${curr} несуществует. Задайте корректный международный код валюты через команду -cur`)
		} else {
			var newString = curr.toUpperCase();
			var newSymbol = symbol.toUpperCase();
			console.log(chalk.bgBlueBright('1 ' + newSymbol + ':') + chalk.bgGreen(` ${data[symbol][curr]} ${newString}`));
		};
	} catch (e) {
		printError(`${crypto} не найдено, убедитесь, что Вы задали валюту отображения через команду -cur`);
	}
};

const getCryptoDescription = async (crypto) => {
	if (!crypto.length) {
		return printError('Введите имя криптовалюты')
	}
	try {
		const symbol = crypto.toLowerCase();

		const { data } = await axios.get(`https://api.coingecko.com/api/v3/coins/${symbol}`);
		const description = chalk.greenBright.italic(data.description['en']);
		console.log(description);
	} catch (e) {
		printError(`Введите корректное наименование криптовалюты ${printError('список наименований криптовалют: https://goo-gl.me/txG03 (к примеру bitcoin)')}`)
	}
}

export { getCryptoPrice, isEmptyObject, getCryptoDescription };