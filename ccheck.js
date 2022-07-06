#!/usr/bin/env node
import axios from 'axios';
import { getArgs } from './helpers/args.js';
import { getCryptoPrice, getCryptoDescription } from './services/api.service.js';
import { printHelp, printError, printSucces } from './services/log.service.js';
import { USER_DICT, saveKeyValue, getKeyValue } from './services/storage.service.js';



const saveToken = async (token) => {
	if (!token.length) {
		printError('Не передан токен!');
		return;
	}
	try {
		await saveKeyValue(USER_DICT.token, token);
		printSucces('Токен сохранен');
	} catch (e) {
		printError(e.message);
	}
};

const deleteList = async (index) => {
	try {
		const listIndex = Number(index) - 1
		let list = await getKeyValue(USER_DICT.table);
		const cryptoName = list[listIndex];
		if (cryptoName == undefined) {
			return printError('В портфеле нет криптовалют, добавьте криптовалюты через команду -add');
		}
		delete list[listIndex];
		const list2 = list.filter(function (val) { return val !== null; });
		printSucces(`${cryptoName} успешно удалено`);
		return await saveKeyValue(USER_DICT.table, list2);
	} catch (e) {
		printError(e.message);
	}
};

const getList = async () => {
	const list = await getKeyValue(USER_DICT.table);
	if (list == undefined) {
		return printError('В портфеле нет криптовалют, добавьте через -add');
	}
	console.log(list)
};

const savePort = async (value) => {
	if (!value.length) {
		printError('Не переданы криптоваюты для портфолио');
		return;
	};

	const saveTok = await getKeyValue(USER_DICT.table);
	const portfolio = value.split(',');
	if (saveTok != null) {
		const newPort = portfolio.concat(saveTok);
		const uniquePortfolio = [...new Set(newPort)];
		printSucces('Добавлено в портфель, для вызова введите -l');
		return await saveKeyValue(USER_DICT.table, uniquePortfolio);
	};
	printSucces('Добавлено в портфель, для вызова введите -l');
	await saveKeyValue(USER_DICT.table, portfolio);
};

const saveCurrency = async (cur) => {
	try {
		const { data } = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${cur}`);
		const currency = data.bitcoin[cur]
		if (!cur.length) {
			return printError('Не передана валюта отображения!');
		} else if (currency == undefined) {
			return printError(`валюты ${cur} несуществует. Задайте корректный международный код валюты `);
		} else {
			await saveKeyValue(USER_DICT.cur, cur);
			printSucces('Валюта отображения сохранена');
		};
	} catch (e) {
		printError('Не правильно задана валюта отображения, используйте международный коды!')
	};
};


const initCLI = async () => {
	const args = getArgs(process.argv);
	if (args.h) {
		return printHelp();
	};
	if (args.t) {
		return saveToken(args.t);
	};
	if (args.cur) {
		return saveCurrency(args.cur);
	};
	if (args.l) {
		return await getList();
	};
	if (args.d) {
		return await deleteList(args.d);
	};
	if (args.desc) {
		return getCryptoDescription(args.desc);
	};
	if (args.p) {
		if (args.p == true) {
			const curr = await getKeyValue(USER_DICT.cur);
			return printError(`Вы не ввели наименование криптовалюты, введите наименование, чтобы узнать цену в ${curr}`)
		} else {
			return await getCryptoPrice(args.p);
		};
	};
	if (args.add) {
		return savePort(args.add);
	} else {
		try {
			const port = await getKeyValue(USER_DICT.table);
			const l = port.length;
			for (let i = 0; i < l; i++) {
				await getCryptoPrice(port[i]);
			}
		} catch (e) {
			console.log(e.message);
			printError('Для вызова команд введите -h');
		};
	};
	const cryptoListed = await getKeyValue(USER_DICT.table);
	if (cryptoListed == undefined) {
		return printError('В списке нет криптовалют, для вызова списка команд введите -h');
	};
};

initCLI();