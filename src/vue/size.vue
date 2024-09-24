<template lang="pug">
	div.simulator__selector.simulator__size
		div.top_placehilder
		div.simulator__size__wrap
			div.simulator__size__group(v-for='(item2,key2) in selectparts')
				div.size_container
					div.title_container
						span.size_title {{nameArray[item2].name}}
							small のサイズ
					div.size_group(v-for="(item,key) in partsArray[item2]" v-if='item in sizeAdjs')
						div.size_group__title {{sizeAdjs[item].name}}
						div.size_group__title 基準値
						div.size_group__title 補正値
						div.size_group__total_value
							span {{$parent.sessions.ordersheet[item]}}
							small cm
						div.size_group__default_value
							span {{$parent.selected.size[sizeAdjs[item].junle][item]}}
							small cm
						div.size_group__customize_value
							div.custom_select
								div.custom_select__input
									div.selected_value
										span {{$parent.selected.sessions.ordersheet[item] - $parent.selected.size[sizeAdjs[item].junle][item] | round}}
										small cm
									button.arrow(v-on:click="openSelect($event)")
								div.custom_select__layer(v-on:click="closeSelect($event)")
								div.custom_select__options
									div.custom_select__option(
										v-for="size in getListFromSize(sizeAdjs[item], $parent.selected.size[sizeAdjs[item].junle][item])",
										v-on:click="selectSizeItem($event, size, item)",
										:class="{'active': $parent.sessions.ordersheet[item] == size.value}"
									)
										span {{ size.adjust > 0 ? '+' : '' }}{{ size.adjust }}
										small cm
						p.size_message(v-if="((item2 == 'pants' && item == 'waist_1') || (item2 == 'pants2' && item == 'waist_2')) && $parent.selected.gender == 'men'")
							span ウエストサイズ75.0cm以下はウエストアジャスターを付けることは出来ません。75.5cmから付けることが可能です。
						p.size_message(v-if="(item2 == 'pants' && item == 'watarihaba1') || (item2 == 'pants2' && item == 'watarihaba2')")
							span
								|渡り幅・裾幅の補正は「渡り幅プラス・裾幅プラス」もしくは、「マイナス」の補正になります。
								br
								|「渡り幅プラス・裾幅マイナス」「渡り幅マイナス・裾幅プラス」の補正はできません。
						p.size_message(v-if="(item2 == 'pants' && item == 'susohaba1') || (item2 == 'pants2' && item == 'susohaba2')")
							span
								|渡り幅・裾幅の補正は「渡り幅プラス・裾幅プラス」もしくは、「マイナス」の補正になります。
								br
								|「渡り幅プラス・裾幅マイナス」「渡り幅マイナス・裾幅プラス」の補正はできません。
				div.size_container(v-if='item2 == "pants" || item2 == "pants2"')
					div.size_group_container
						div.size_group(v-if='item2 == "pants"')
							div.size_group__title 股下（左）
							div.matashita
								input.matashitaInputer(type='number' v-model='$parent.selected.sessions.ordersheet.crotch_main1' step='0.5' min='0' max='120' v-on:input='$parent.selected.sessions.ordersheet.crotch_main1 = matashitaChecker($parent.selected.sessions.ordersheet.crotch_main1,$event)')
								small cm
						div.size_group(v-if='item2 == "pants"')
							div.size_group__title 股下（右）
							div.matashita
								input.matashitaInputer(type='number' v-model='$parent.selected.sessions.ordersheet.crotch_right1' step='0.5' min='0' max='120' v-on:input='$parent.selected.sessions.ordersheet.crotch_right1 = matashitaChecker($parent.selected.sessions.ordersheet.crotch_right1,$event)')
								small cm
						div.size_group(v-if='item2 == "pants2"')
							div.size_group__title 股下（左）
							div.matashita
								input.matashitaInputer(type='number' v-model='$parent.selected.sessions.ordersheet.crotch_main2' step='0.5' min='0' max='120' v-on:input='$parent.selected.sessions.ordersheet.crotch_main2 = matashitaChecker($parent.selected.sessions.ordersheet.crotch_main2,$event)')
								small cm
						div.size_group(v-if='item2 == "pants2"')
							div.size_group__title 股下（右）
							div.matashita
								input.matashitaInputer(type='number' v-model='$parent.selected.sessions.ordersheet.crotch_right2' step='0.5' min='0' max='120' v-on:input='$parent.selected.sessions.ordersheet.crotch_right2 = matashitaChecker($parent.selected.sessions.ordersheet.crotch_right2,$event)')
								small cm
						div.size_message.padding_start
							|裾口を「ハーフ」で選択する場合は股下の入力を「0」で入力してください。
</template>
<style>
.size_container {
	padding: 0 20px;
}

.simulator__size__wrap .title_container {
	position: sticky;
	z-index: 2;
	top: -20px;
	background-color: #e3e3e3;
}

.size_title {
	font-size: 1.6rem;
	font-weight: 600
}

.size_title small {
	font-size: 1.2rem;
}

.size_group {
	display: grid;
	grid-template-columns: 1.5fr 120px 1fr;
	gap: 5px 10px;
	border-bottom: 1px solid #ccc;
	padding: 15px 20px;
}

.size_message {
	padding-block-start: 10px;
	font-size: .8rem;
	color: #999;
	grid-column: 1 / span 3;
}

.size_message.padding_start {
	padding-inline-start: 20px;
}

.size_group_container {
	border-bottom: 1px solid #ccc;
	padding: 10px 0px;
}

.size_group_container .size_group {
	border-bottom: none;
	padding: 5px 20px;
}

.size_group__title {
	font-size: 1rem;
}

.size_group__total_value span {
	font-size: 1.5rem;
	font-weight: 600;
}

.size_group__default_value {
	font-size: 1rem;
}

.size_group__total_value small,
.size_group__default_value small,
.matashita small {
	font-size: .8rem;
}

.matashita {
	grid-column: span 2;
	display: flex;
	justify-content: flex-start;
	align-items: flex-end;
	gap: 10px;
}
.matashita input {
	width: 150px;
	height: 32px;
	border: 1px solid #777;
	padding: 0 10px;
	font-size: .9rem;
}

</style>
<script>

// コンポーネントのtemplateは、一つのタグですべて囲われていなければならん。注意。
//アロー関数では値が取れなくなる場合がある。　hoge:function(){}としろ。
module.exports = {
	data:function(){
		return {
			//ジャケット１、ベスト２、パンツ３、スカート４
			// targetJunle:1,
			courseNo:this.$parent.selected.code.course,
			partsArray:{
				jacket:['kitake','sodetake_left','sodetake_right','waist'],
				pants:['waist_1','watarihaba1','susohaba1'],
				pants2:['waist_2','watarihaba2','susohaba2'],
				skirt:['wo_skirt_1','wo_waist_1'],
				skirt2:['wo_skirt_2','wo_waist_2'],
				vest:['bestsetake'],
			},
			nameArray:{
				jacket:{
					name:'ジャケット',
					en:'jacket'
				},
				vest:{
					name:'ベスト',
					en:'vest'
				},
				pants:{
					name:'パンツ',
					en:'pants'
				},
				pants2:{
					name:'パンツ２',
					en:'pants2'
				},
				skirt:{
					name:'スカート',
					en:'skirt'
				},
				skirt2:{
					name:'スカート２',
					en:'skirt2'
				},
			}
		}
	},
    props: ["uploadpass"],
    computed: {
		selectparts:function(){
			var result ='';
			$.each(this.$parent.selected.parts,function(key,item){
				result = item;
			})
			//console.log('parts');
			//console.log(result.designParts);
			// console.log('DESIGN_PARTS', JSON.parse(JSON.stringify(result.designParts)));
			return result.designParts;
		},
		gender:function(){
			if(this.$parent.selected.gb){
				return 3;
			}else{
				return this.$parent.selected.sessions.ordersheet.sex;
			}
		},
		sizeAdjs:function(){
			// console.log('SIZE_ADJS', JSON.parse(JSON.stringify(this.$parent.size.adj)));
			// console.log('SELECTED_SIZES', JSON.parse(JSON.stringify(this.$parent.selected.size)));
			return this.$parent.size.adj;
		},
		//men 1 women 2 gb 3
		getSex:function(){
			if(this.$parent.selected.gb){
				return 3;
			}else{
				return this.$parent.selected.sessions.ordersheet.sex;
			}
		},

    },
    mounted: function () {
		var thista = this;
		targetJunle = [];

		Vue.set(this.$parent.size,"adj",{});
		if(this.$parent.sessions.ordersheet.jacket_dno != "" && this.$parent.sessions.ordersheet.jacket_dno != null){
			this.$parent.setSizer(1,this.$parent,"jacket",1);
		}
		if(this.$parent.sessions.ordersheet.best_dno != ""){
			//ベスト
			this.$parent.setSizer(2,this.$parent,"vest",1);
			targetJunle.push("2");
		}
		if(this.$parent.sessions.ordersheet.slacks_dno1 != "" && this.$parent.sessions.ordersheet.slacks_dno1 != null){
			//パンツ
			this.$parent.setSizer(3,this.$parent,"pants",1);
		}
		if(this.$parent.sessions.ordersheet.slacks_dno2 != "" && this.$parent.sessions.ordersheet.slacks_dno2 != null){
			//パンツ
			this.$parent.setSizer(3,this.$parent,"pants2",2);
		}
		if(this.$parent.sessions.ordersheet.wo_sk_d1 != "" && this.$parent.sessions.ordersheet.wo_sk_d1 != null){
			//スカート
			this.$parent.setSizer(4,this.$parent,"skirt",1);
		}
		if(this.$parent.sessions.ordersheet.wo_sk_d2 != "" && this.$parent.sessions.ordersheet.wo_sk_d2 != null){
			//スカート
			this.$parent.setSizer(4,this.$parent,"skirt2",2);
		}

		if(this.$parent.sessions.ordersheet.wo_sk_d1 != "" || this.$parent.sessions.ordersheet.wo_sk_d2 != ""){
			targetJunle.push("4");
		}
		resultArray = [];

		//ジャケット
		// if(this.$parent.sessions.ordersheet.jacket_dno != ""){
		// $.each(resultArray,function(key,item){
		// 		Vue.set(thista.$parent.size.adj,item.interface,{
		// 			name:item.name,
		// 			min:item.min,
		// 			max:item.max,
		// 			step:item.tick,
		// 			value:5
		// 		});
		// });
		// }
		//console.log(this.getSex);
		//console.log("調整可能なサイズ部分取得");
        // Vue.nextTick(function () {
        //     thista.sliderInits();
        // });

		// console.log('SELECTED::SIZE', JSON.parse(JSON.stringify(this.$parent.selected)));
    },
    methods: {
		openSelect(event) {
			$(event.target).parent().parent().toggleClass('active');

			var element = $(event.target)[0];
			var rect = element.getBoundingClientRect();
			var elementScreenY = rect.top;
			if (elementScreenY > window.innerHeight / 2) {
				$(event.target).parent().parent().addClass('position_top');
			} else {
				$(event.target).parent().parent().removeClass('position_top');
			}
			setTimeout(() => {
				const elem = $(event.target).parent().parent().find('.custom_select__option.active')[0];
				const popupContainer = $(event.target).parent().parent().find('.custom_select__options')[0];
				// if (elem) elem.scrollIntoView({ block: 'center', behavior: 'instant' });
				if (elem && popupContainer) this.scrollIntoViewInPopup(elem, popupContainer);
			}, 0);
		},
		scrollIntoViewInPopup(elem, popupContainer) {
			const elemRect = elem.getBoundingClientRect();
			const containerRect = popupContainer.getBoundingClientRect();
			const offset = elemRect.top - containerRect.top + popupContainer.scrollTop - (containerRect.height / 2 - elemRect.height / 2);

			popupContainer.scrollTop = offset;
		},
		closeSelect(event) {
			$(event.target).parent().removeClass('active');
		},
		selectSizeItem(event, size, target) {
			$(event.target).parent().parent().removeClass('active');
			this.$parent.sessions.ordersheet[target] = size.value;
		},
		matashitaChecker:function(val,e){
			var nums = e.target.value;
			var tv = e.target.value;
			if(String(e.target.value).indexOf('.') > -1){
			tv = String(e.target.value).split('.')[1];
			if((tv != '0' && tv != '')){
				tv = parseFloat(String(e.target.value).split('.')[0]+'.5');
			}else{
				tv = e.target.value;
			}
			}
			if(nums > 120){
				return 120;
			}else if(nums < 0){
				return 0;
			}else{
				return tv;
			}

		},
		getListFromSize(size, value) {
			// console.log('SIZE', JSON.parse(JSON.stringify(size)), value);
			const list = [];
			const min = Number(size.min);
			const max = Number(size.max);
			const step = Number(size.step);

			const roundIfNonIntegerFloat = (num) => {
				if (typeof num === 'number' && !isNaN(num) && num % 1 !== 0) {
					return Math.round(num * 10) / 10;
				}
				return num;
			}

			for(let i = min; i <= max; i += step) {
				list.push({
					value: roundIfNonIntegerFloat(i),
					adjust: roundIfNonIntegerFloat(i - value)
				});
			}

			// console.log(list, value);

			return list
		},
		sliderPlus:function(target,thista){
			if(parseFloat(this.$parent.size.adj[target].value) < parseFloat(this.$parent.size.adj[target].max)){
				this.$parent.size.adj[target].value = (parseFloat(this.$parent.size.adj[target].value) + parseFloat(this.$parent.size.adj[target].step)).toFixed(1);
				this.$parent.sessions.ordersheet[target] = this.$parent.size.adj[target].value;
				$(thista.target).closest(".simulator__size__item__slider__wrap").find(".simulator__size__item__slider").slider("value",this.$parent.size.adj[target].value);
				$(thista.target).closest(".simulator__size__item__slider__wrap").find(".slider__value").html(this.$parent.size.adj[target].value+"cm");
			}
		},
		sliderMinus:function(target,thista){
			// console.log(parseFloat(this.$parent.size.adj[target].value));
			// console.log(parseFloat(this.$parent.size.adj[target].step));
			// console.log(this.$parent.size.adj[target].min);
			// console.log((parseFloat(this.$parent.size.adj[target].value) - parseFloat(this.$parent.size.adj[target].step)).toFixed(1));
			if(parseFloat(this.$parent.size.adj[target].value) > parseFloat(this.$parent.size.adj[target].min)){
				// console.log('ここは通過');
			this.$parent.size.adj[target].value = (parseFloat(this.$parent.size.adj[target].value) - parseFloat(this.$parent.size.adj[target].step)).toFixed(1);
			this.$parent.sessions.ordersheet[target] = this.$parent.size.adj[target].value;
			$(thista.target).closest(".simulator__size__item__slider__wrap").find(".simulator__size__item__slider").slider("value",this.$parent.size.adj[target].value);
			$(thista.target).closest(".simulator__size__item__slider__wrap").find(".slider__value").html(this.$parent.size.adj[target].value+"cm");
			}
		},
		sliderInits:function(){
			sliderInit(this);
		}
    }
};

function sliderInit(target) {
    $(".simulator__size__item__slider").each(function(key,item){
		var min = 1 * parseFloat($(item).attr("data-min")).toFixed(1);
		var max = 1 * parseFloat($(item).attr("data-max")).toFixed(1);
		var step = 1 * parseFloat($(item).attr("data-step")).toFixed(1);
		var vals = 1 * parseFloat($(item).attr("data-value")).toFixed(1);
		var targetAdj = $(item).attr("data-target");

	$(item).slider({
        min: min,
        max: max,
        step: step,
        value: vals,
        slide: function (event, ui) {
			$(ui.handle).find(".slider__value").html(ui.value+"cm");
			target.$parent.size.adj[targetAdj].value = ui.value;
			target.$parent.sessions.ordersheet[targetAdj] = ui.value;
		}
    });
	$(item).find(".ui-slider-handle").append("<span class='slider__value'>"+vals+"cm</span>");
	});

}
</script>
