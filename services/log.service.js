import chalk from 'chalk';
import dedent from 'dedent-js';

const printHelp = () => {
	console.log(
		dedent(`${chalk.bgCyan('ДОСТУПНЫЕ КОМАНДЫ ДЛЯ УПРАВЛЕНИЯ')}
		${chalk.bgGreen('Без параметров        ') + ' вывод сохраненных валют (условно в usd)'}
		${chalk.bgGreen('-cur [FIAT]           ')} для смены валюты отображения по умолчанию
		${chalk.bgGreen('-h                    ')} для вывода помощи
		${chalk.bgGreen('-t [API COINMARKET]   ')} для сохранения токена (только для airdrops)
		${chalk.bgGreen('-add [NAME1, NAME2..] ')} для добавления в список
		${chalk.bgGreen('-l                    ')} отображение сохраненных в списке криптовалют
		${chalk.bgGreen('-d [INDEX]            ')} удаление сохраненных криптовалют по номеру (от 1 до n)
		${chalk.bgGreen('-p [NAME]             ')} для чека стоимости криптовалюты
		${chalk.bgGreen('-air                  ')} для вывода действующих air-дропов (неактивно)
		${chalk.bgGreen('-desc [NAME]          ')} для вывода описания криптовалюты
		${chalk.bgCyan('cписок [NAME]         ')} ${chalk.underline('https://goo-gl.me/txG03')} 
		${chalk.bgCyan('ВСЕ СОХРАНЕННЫЕ ПАРАМЕТРЫ ХРАНЯТСЯ ЛОКАЛЬНО В ./user/crypto-check.json')}
		`)
	);
};

const printError = (error) => {
	console.log(chalk.bgRed(' ERROR ') + ' ' + error);
};

const printSucces = (message) => {
	console.log(chalk.bgGreen(' SUCCESS ') + ' ' + message);
};

export { printHelp, printError, printSucces };