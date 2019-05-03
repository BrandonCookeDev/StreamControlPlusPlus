'use strict';

function register(){
	$(document).ready(function(){
		function swap(el, otherEl){
			let temp = $(el).val()
			$(el).val($(otherEl).val())
			$(otherEl).val(temp)
		}
		
		function clear(el){
			$(el).val('')
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

		function setClearListener(el, targets){
			el.click(() => {
				for(var i in targets){
					let target = targets[i]
					clear(target)
				}
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

			let clearList = $(this).attr('clear')
			if(clearList){
				let idList = clearList.split(',').filter(id=>id != null || id != '').map(id =>(id))
				setClearListener($(this), idList.map(id => document.getElementById(id)))
			}
		})
		
		// templating convenience 
		$('row').each(function(){
			let content = $(this).html()
			$(this).replaceWith('<div class="row">'+content+'</div>')
		})

		$('column').each(function(){
			let content = $(this).html()
			$(this).replaceWith('<div class="col">'+content+'</div>')
		})
		
		// functions
		$('swap').each(function(){
			let a = $(this).attr('a')
			let b = $(this).attr('b')
			let content = $(this).html()
			$(this).replaceWith(`<button swap-a="${a}" swap-b="${b}">${content}</button>`)
		})

		$('clear').each(function(){
			let list = $(this).attr('list')
			let content = $(this).html()
			$(this).replaceWith(`<button clear="${list}">${content}</button>`)
		})

		// text
		$('text').each(function(){
			let content = $(this).html()
			let id = $(this).attr('id')
			let ph = $(this).attr('placeholder')
			$(this).replaceWith(`<input type="text" id="${id}" name="${id}" placeholder="${ph}" />`)
		})

		// numbers
		$('num').each(function(){
			let id = $(this).attr('id')
			let val = $(this).attr('val')
			$(this).replaceWith(`<input type="number" id="${id}" name="${id}" value=${val} />`)
		})
		$('number').each(function(){
			let id = $(this).attr('id')
			let val = $(this).attr('val')
			$(this).replaceWith(`<input type="number" id="${id}" name="${id}" value=${val} />`)
		})

		// selects
		$('characters').each(function(){
			let id = $(this).attr('id')
			let listId = $(this).attr('list')
			$(this).replaceWith(`<select id="${id}" name="${id}" ${listId}></select>`)
		})
	})

}