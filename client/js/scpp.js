'use strict';

$(document).ready(function(){
	function swap(el, otherEl){
		let temp = $(el).val()
		$(el).val($(otherEl).val())
		$(otherEl).val(temp)
	}
	
	function clear(el){
		$(el).empty()
	}
})