var fs = require('fs');
var jsonfile = require('jsonfile');

var englishFilePath = 'dota-english.json';
var vietnameseFilePath = 'dota-vietnamese.json';
var heroesList = 'heroes-list.json';
var abilitiestList = 'abilities.json';

var englishData = jsonfile.readFileSync(englishFilePath);
var vietnameseData = jsonfile.readFileSync(vietnameseFilePath);
var heroesListData = jsonfile.readFileSync(heroesList)['heroes'];
var abilitiesData = jsonfile.readFileSync(abilitiestList)['abilities'];


var abilitiesAll = [],
		abilitiesBarebone = [];
		abilitiesWithDesc = [];

var englishTooltips = englishData['lang']['Tokens'];
var vietnameseTooltips = vietnameseData['lang']['Tokens'];

function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}


Object.keys(englishTooltips).forEach(function (key) {
	var skill = "";
	abilitiesData.forEach(function (ability) {
		if (key.endsWith(ability.name + '_Description')) {
			skill = ability.name;
			abilitiesAll.push(skill);
		}
	});
});

heroesListData.forEach(function(hero) {
	abilitiesAll.forEach(function (ability) {
		if (ability.includes(hero.name)) {
			abilitiesBarebone.push(ability);
		}
	});
});

abilitiesBarebone = abilitiesBarebone.filter(function(elem, index, self) {
    return index == self.indexOf(elem);
})

abilitiesBarebone.forEach(function (ability) {
	heroesListData.forEach(function (hero) {
		if (ability.includes(hero.name)) {
			var abilityFull = {'hero': '', 'name': '', 'en': '', 'vn': ''};
			abilityFull.hero = hero.name;
			abilityFull.name = ability.slice(hero.name.length + 1);
			abilitiesWithDesc.push(abilityFull);
		}
	});
});

//console.log(abilitiesWithDesc);

Object.keys(englishTooltips).forEach(function (key, value) {
	abilitiesWithDesc.forEach(function (ability) {
		if (key.endsWith('DOTA_Tooltip_ability_' + ability.hero + '_' + ability.name + '_Description')) {
			ability.en = englishTooltips[key];
		}
	});
});

Object.keys(vietnameseTooltips).forEach(function (key, value) {
	abilitiesWithDesc.forEach(function (ability) {
		if (key === 'DOTA_Tooltip_ability_' + ability.hero + '_' + ability.name + '_Description') {
			ability.vn = vietnameseTooltips[key];
		}
	});
});




fs.writeFile('output.json', JSON.stringify(abilitiesWithDesc, null, 4), function(err){
    console.log('File successfully written! - Check your project directory for the output.json file');
});
