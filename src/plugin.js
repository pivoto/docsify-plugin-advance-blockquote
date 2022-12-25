// eslint-disable-next-line
import styles from './plugin.scss';

// const cheerio = require('cheerio');
import pkg from '../package.json';
const pluginName = pkg.name.replace(/^docsify-plugin-/, '');

export function fa(hook) {
	const faReg = /:(fa[\w -]+):/gm;

	hook.beforeEach(function (content) {
		content = content.replace(faReg, function (match, fa) {
			console.log('match: ' + fa)
			return `<i class="${fa}"></i>`;
		});
		return content;
	});

	hook.afterEach(function (html, next) {
		html = html.replace(faReg, function (match, fa) {
			console.log('match: ' + fa)
			return `<i class="${fa}"></i>`;
		});
		next(html);
	});

}
export function blockquote(hook, vm){


	function merge(obj1, obj2){
		for (const i in obj2) {
			if(obj1[i]){
				try {
					if (obj1[i].constructor === Object && obj2[i].constructor === Object) {
						obj1[i] = merge(obj1[i], obj2[i]);
					}else if(Array.isArray(obj1[i]) && obj2[i].isArray(obj2[i])){
						obj1[i] = merge(obj1[i], obj2[i]);
					} else {
						obj1[i] = obj2[i];
					}
				} catch(e) {
					obj1[i] = obj2[i];
				}
			}else{
				obj1[i] = obj2[i];
			}
		}
		return obj1;
	}
	function getSetting(settings, key, defaultVal, convertor) {
		if (settings) {
			const match = settings.match(new RegExp(`${key}(?::([^\\r\\n|]*))?`));
			if (match) {
				return convertor ? convertor(match[1]) : match[1];
			}
		}
		return convertor ? convertor(defaultVal) : defaultVal;
	}

	const CONFIG = {
		style: 'callout',//flat
		tag: {
			label: 'Note',
			labelVisible: "false",
			icon: 'fa fa-tag ',
			className: 'tag'
		},
		tip: {
			"label": {
				"en": "Tip",
				"zh": "提示"
			},
			icon: 'fa fa-lightbulb',
			className: 'tip'
		},
		question: {
			"label": {
				"en": "Question",
				"zh": "问题"
			},
			icon: 'fa fa-question-circle',
			className: 'question'
		},
		note: {
			"label": {
				"en": "Note",
				"zh": "注意"
			},
			icon: 'fa fa-info-circle',
			className: 'info'
		},
		warning: {
			"label": {
				"en": "Warning",
				"zh": "警示"
			},
			icon: 'fa fa-exclamation-triangle',
			className: 'warning'
		},
		danger: {
			"label": {
				"en": "Important",
				"zh": "重要"
			},
			"icon": "fa fa-bolt",
			"className": "danger"
		},
	};
	const options = merge(CONFIG, vm.config[pluginName]);


	hook.beforeEach(function (content) {
		return content;
	});
	hook.afterEach(function (html, next) {
		const origin = html;
		const reg = /<blockquote>\s*(<p>\s*)?\[!([!?\w]*)((?:\|\w*:[^|\]]*)*?)\]/g;
		let lastIndex = 0;
		let matches;
		const rs = [];
		while ((matches = reg.exec(origin)) !== null) {
			const index = matches.index;
			if (lastIndex < index) {
				rs.push(origin.substring(lastIndex, index));
			}
			lastIndex = reg.lastIndex;
			const match = matches[0];
			const p = matches[1]||'';
			let key = matches[2].trim().toLowerCase();
			const settings = matches[3];

			// alias
			key = ({
				'': 'tip', '?': 'question', '!': 'note', '!!': 'warning', '!!!': 'danger',
				'q': 'question', 'n': 'note',  'i': 'note', 'w': 'warning',
				'info': 'note', 'warn': 'warning', 'important': 'danger', 'error': 'danger'
			})[key] || key;

			const config = options[key];
			if (!config) {
				rs.push(match);
				continue;
			}

			// Style configuration
			const style = getSetting(settings, 'style', options.style);
			let iconVisible = getSetting(settings, 'iconVisible', config.iconVisible || 'true', (v) => v !== 'false');
			let labelVisible = getSetting(settings, 'labelVisible', config.labelVisible || 'true', (v) => v !== 'false');
			let label = getSetting(settings, 'label', config.label);
			const icon = getSetting(settings, 'icon', config.icon);
			const className = getSetting(settings, 'className', config.className);

			if (typeof label === 'object') {
				const language = navigator.language;
				if(language){
					if (Object.prototype.hasOwnProperty.call(label, language)) {
						label = label[language];
					}else{
						let languageBase = language.replace(/-.+$/g,'');
						if (Object.prototype.hasOwnProperty.call(label, languageBase)) {
							label = label[languageBase];
						}else {
							label = label['en'] || label['zh'];
						}
					}
				} else {
					label = label['en'] || label['zh'];
				}
			}
			if (!label) {
				labelVisible = false;
			}
			if (labelVisible) {
				const iconTag = iconVisible ? `<i class="${icon}"></i>` : '';
				rs.push(`<blockquote class="alert ${style} ${className}">
                <p class="title">${iconTag} ${label}</p>
                ${p}`);
			} else {
				const iconTag = iconVisible ? `<span class="title"><i class="${icon}"></i></span>` : '';
				rs.push(`<blockquote class="alert ${style} ${className}">${p}${iconTag} `);
			}
		}
		if (rs.length > 0) {
			if (lastIndex < origin.length) {
				rs.push(origin.substring(lastIndex));
			}
			const content = rs.join('');
			if (content !== origin) {
				html = content;
			}
		}
		next(html);
	});
}
