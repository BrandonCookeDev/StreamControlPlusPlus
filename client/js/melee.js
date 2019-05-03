
let meleeCharacters = [
	'Character',
	'Mario',
	'Bowser',
	'Peach',
	'Yoshi',
	'Donkey Kong',
	'Captain Falcon',
	'Fox',
	'Ness',
	'Ice Climbers',
	'Kirby',
	'Samus',
	'Zelda',
	'Link',
	'Pikachu',
	'Jigglypuff',
	'Dr. Mario',
	'Luigi',
	'Ganondorf',
	'Falco',
	'Young Link',
	'Pichu',
	'Mewtwo',
	'Mr. Game & Watch',
	'Marth',
	'Roy'
]

$(document).ready(function(){
	$('select').each(function(){
		if($(this).attr('melee-characters') != null){
			for(var i in meleeCharacters){
				let currentCharacter = meleeCharacters[i]
				let template = '<option>' + currentCharacter + '</option>'
				$(this).append(template)
			}
		}
	})
})
