const fs = require('fs');
// import fs from 'fs';
// const request = require('request');
const request = '';
const path = require('path');
// import path from 'path';
const filePath = path.resolve('./src'); // 提取翻译字段的目录
const rg = /tr\('(\w*|\W*|[\u4e00-\u9fa5]*)'\)/g; // 正则匹配tr包裹的字段

const args = process.argv.splice(2);
const lang = args[0];

//#region  google翻译相关

const _TTK = '442182.965842172'; // 这玩意是从谷歌官网爬下来的
const _URL =
	'https://translate.google.cn/translate_a/single?client=webapp&sl=zh-CN&tl=en&hl=zh-CN&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=sos&dt=ss&dt=t&otf=1&ssel=3&tsel=3&xid=45662847&kc=1';
const coding = function (a, b) {
	for (let d = 0; d < b.length - 2; d += 3) {
		let c = b.charAt(d + 2);
		c = 'a' <= c ? c.charCodeAt(0) - 87 : Number(c);
		c = '+' == b.charAt(d + 1) ? a >>> c : a << c;
		a = '+' == b.charAt(d) ? (a + c) & 4294967295 : a ^ c;
	}
	return a;
};
const getGoogleTK = function (a, TKK = _TTK) {
	const e = TKK.split('.');
	const h = Number(e[0]) || 0;
	const g = [];
	let d;
	let f = 0;
	for (; f < a.length; f++) {
		let c = a.charCodeAt(f);
		128 > c
			? (g[d++] = c)
			: (2048 > c
					? (g[d++] = (c >> 6) | 192)
					: (55296 == (c & 64512) && f + 1 < a.length && 56320 == (a.charCodeAt(f + 1) & 64512)
							? ((c = 65536 + ((c & 1023) << 10) + (a.charCodeAt(++f) & 1023)), (g[d++] = (c >> 18) | 240), (g[d++] = ((c >> 12) & 63) | 128))
							: (g[d++] = (c >> 12) | 224),
					  (g[d++] = ((c >> 6) & 63) | 128)),
			  (g[d++] = (c & 63) | 128));
	}
	a = h;
	for (d = 0; d < g.length; d++) (a += g[d]), (a = coding(a, '+-a^+6'));
	a = coding(a, '+-3^+b+-f');
	a ^= Number(e[1]) || 0;
	0 > a && (a = (a & 2147483647) + 2147483648);
	a %= 1e6;
	return a.toString() + '.' + (a ^ h);
};

const googleTr = (text) => {
	const tk = getGoogleTK(text);
	const api = `${_URL}&tk=${tk}&q=${encodeURI(text)}`;
	return new Promise((resolve, reject) => {
		request.get(api, {}, (error, response, body) => {
			const bodyObj = JSON.parse(body);
			resolve(bodyObj[0][0][0]);
		});
	});
};

//#endregion

const getKeys = (filePath) => {
	const data = fs.readFileSync(filePath);
	const str = data.toString();
	return str.match(rg);
};

const fileDisplay = (filePath) => {
	const files = fs.readdirSync(filePath);
	let keyMap = {};
	files.forEach((filename) => {
		const filedir = path.join(filePath, filename);
		const stats = fs.statSync(filedir);
		const isFile = stats.isFile();
		const isDir = stats.isDirectory();
		if (isFile && filename.match(/tsx|ts|js|jsx|vue/)) {
			console.log(`匹配文件:${filedir}`);
			const keys = getKeys(filedir);
			if (keys && keys.length) {
				keys.forEach((element) => {
					const key = element.replace('tr(', '').replace(/'/g, '').replace(')', '');
					if (key) {
						keyMap[key] = key;
					}
				});
			}
		} else if (isDir && filedir.indexOf('node_modules') === -1 && filedir.indexOf('build') === -1) {
			keyMap = {
				...keyMap,
				...fileDisplay(filedir),
			};
		}
	});
	return keyMap;
};

// 调用文件遍历方法
const trKeyMap = fileDisplay(filePath);

let jsonPath = '';
if (!lang || lang === 'zh_CH') {
	jsonPath = path.resolve('./src/i18n/jsons/zh_CH.json'); // 中文目录
} else {
	// console.log('英文版本,准备翻译..');
	// const googleTrGenerator = function* () {
	//   for (const key in trKeyMap) {
	//     if (trKeyMap.hasOwnProperty(key)) {
	//       const element = trKeyMap[key];
	//       yield googleTr(element);
	//     }
	//   }
	// };
	// const gen = googleTrGenerator();
	// console.log(gen.next().value.then());

	jsonPath = path.resolve('./src/locales/jsons/en_US.json'); // 英文目录
}
console.log('匹配完成,准备写入文件..');
fs.writeFileSync(jsonPath, JSON.stringify(trKeyMap));
console.log('文件写入成功');
