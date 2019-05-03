'use strict';

function register(){
	$(document).ready(function(){
		function swap(el, otherEl){
			let temp = $(el).val()
			$(el).val($(otherEl).val())
			$(otherEl).val(temp)
		}
		
		function clear(el){
			$(el).empty()
		}

		// set button listener
		function setSwapListener(el, targets1, targets2){
			$(el).click(() => {
				for(var i in targets1){
					let target1 = targets1[i]
					for(var j in targets2){
						let target2 = targets2[j]
						if(i == j){
							swap(target1, target2)
						}
					}
				}
			})
		}

		function setClearListener(el, target){
			el.setOnClickListener(() => {
				clear(target)
			})
		}

		// get all custom attributes
		$('button').each(function(){
			let swapA = $(this).attr('swap-a')
			let swapB = $(this).attr('swap-b')
			if(swapA && swapB){
				let list1 = swapA.split(',').filter(id=>id!=null || id != '').map(id=>document.getElementById(id))
				let list2 = swapB.split(',').filter(id=>id!=null || id != '').map(id=>document.getElementById(id))
				if(list1.length > 0 && list2.length > 0)
					setSwapListener($(this), list1, list2)
			}

			let clearAttr = $(this).attr('clear')
			if(clearAttr)
				setClearListener($(this), clearAttr)
		})
		

	})
}