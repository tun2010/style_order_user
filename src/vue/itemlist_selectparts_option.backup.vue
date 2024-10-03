<template lang="pug">
	div.simulator__selector(v-if="optionLoad")
		div.selector_design__category
				ul(v-if="$parent.selected.gender == 'men'")
					li.buttons(data-target='2' :class="{'buttons-line':c3Category == 2,'buttons-black':c3Category != 2}" v-on:click="c3CateChanger(2,'')" v-if="courseNo == '001' || courseNo == '002' || courseNo == '003' || courseNo == '004'") JACKET
					li.buttons(data-target='4' :class="{'buttons-line':c3Category == 4 && sub != 'pants2','buttons-black':c3Category != 4}" v-on:click="c3CateChanger(4,'')" v-if="courseNo == '001' || courseNo == '002' || courseNo == '003' || courseNo == '006'") SLACKS
					li.buttons(data-target='4pants2' :class="{'buttons-line':c3Category == 4 && sub == 'pants2','buttons-black':c3Category != 4 && sub != 'pants2'}" v-on:click="c3CateChanger(4,'pants2')" v-if="courseNo == '002' || courseNo == '2'") SLACKS2
					li.buttons(data-target='3' :class="{'buttons-line':c3Category == 3,'buttons-black':c3Category != 3}" v-on:click="c3CateChanger(3,'')" v-if="courseNo == '003' || courseNo == '005'") VEST
				ul(v-if="$parent.selected.gender == 'women'")
					li.buttons(data-target='5' :class="{'buttons-line':c3Category == 5,'buttons-black':c3Category != 5}" v-on:click="c3CateChanger(5,'')" v-if="courseNo.indexOf('011') > -1") JACKET
					li.buttons(data-target='6' :class="{'buttons-line':c3Category == 6 && sub != 'pants2','buttons-black':c3Category != 6}" v-on:click="c3CateChanger(6,'')" v-if="courseNo.indexOf('012') > -1") SLACKS
					li.buttons(data-target='6pants2' :class="{'buttons-line':c3Category == 6 && sub == 'pants2','buttons-black':c3Category != 6 && sub != 'pants2'}" v-on:click="c3CateChanger(6,'pants2')" v-if="courseNos[2] == '012' || (courseNos[0] == '012' && courseNos[1] == '012')") SLACKS2
					li.buttons(data-target='7' :class="{'buttons-line':c3Category == 7 && sub != 'skirt2','buttons-black':c3Category != 7}" v-on:click="c3CateChanger(7,'')" v-if="courseNo.indexOf('013') > -1") SKIRT
					li.buttons(data-target='7skirt2' :class="{'buttons-line':c3Category == 7 && sub == 'skirt2','buttons-black':c3Category != 7 && sub != 'skirt2'}" v-on:click="c3CateChanger(7,'skirt2')" v-if="(courseNos[2] == '013' && courseNos[1] == '013') || (courseNos[0] == '013' && courseNos[1] == '013')") SKIRT2
		transition(name="slide" mode="out-in")
			div.product__list_selectparts.product__list_selectparts_option(v-if="disp == 1 && c3Category != ''" key="category")
				ul
					template(v-for="(parts,key) in ordedReverse")
						li(v-bind:key='parts.rank' :data-rank='parts.rank' v-if="parts.option_shiwake=='fabric' && hiddenChecker(parts) && katagamiIzonChecker(parts,'fabricOption') && parts.option_id != ''" :data-target="parts.option_id" v-on:click="partsClicker(parts.option_id,'fabricOption',$event,parts.api_field,parts.input_type)" :class="{'active':$parent.selected.sessions.ordersheet[api_fielder(parts)] != null && $parent.selected.sessions.ordersheet[api_fielder(parts)] != '' && defaultChecker($parent.selected.sessions.ordersheet[api_fielder(parts)],parts)}")
							div
								figure
									img( v-bind:src="$parent.uploadPass+parts.images")
								div
									p(v-if="$parent.debug") [debug]生地のオプション
									p(v-if="$parent.debug")
										span [debug]対応API:
										span(v-if="parts.api_field != null") {{parts.api_field}}
										span(v-else) 登録されていない
									p.selectparts__en {{parts.option_name_en}}
									p.selectparts__ja {{parts.option_name}}
									p.selectparts__selected_item(v-if="api_fielder(parts) != null") {{selectedItemCheck('fabricOption',parts.option_id,$parent.selected.sessions.ordersheet[api_fielder(parts)])["option_field"]}}
						li(v-bind:key='parts.rank' :data-rank='parts.rank' :data-target="parts.option_id" v-on:click="partsClicker(parts.option_id,'katagamiOption',$event,parts.api_field,parts.input_type)" v-if="parts.option_shiwake=='katagami' && hiddenChecker(parts) && powerChecker(parts) && katagamiTsukaenChecker(parts)" :class="{'active':$parent.selected.sessions.ordersheet[api_fielder(parts)] != null && $parent.selected.sessions.ordersheet[api_fielder(parts)] != '' && defaultChecker($parent.selected.sessions.ordersheet[api_fielder(parts)],parts)}")
							div
								figure
									img( v-bind:src="$parent.uploadPass+parts.images")
								div
									p(v-if="$parent.debug") [debug]型紙依存オプション
									p(v-if="$parent.debug")
										span [debug]対応API:
										span(v-if="parts.api_field != null") {{parts.api_field}}
										span(v-else) 登録されていない
									p.selectparts__en {{parts.option_name_en}}
									p.selectparts__ja {{parts.option_name}}
									p.selectparts__selected_item(v-if="api_fielder(parts) != null") {{selectedItemCheck('katagamiOption',parts.option_id,$parent.selected.sessions.ordersheet[api_fielder(parts)])["option_field"]}}
									//女性のボタンで有料の物を使っている場合
									p.selectparts__selected_item(v-if='parts.api_field == "button_cno" && $parent.selected.gender == "women"') {{selectedItemCheck('katagamiOption',67,$parent.selected.sessions.ordersheet.colorcustoms_button_cno)["option_field"]}}
						//ゲスト用の型紙依存オプション全部出し
						li(v-bind:key='parts.rank' :data-rank='parts.rank' :data-target="parts.option_id" v-on:click="partsClicker(parts.option_id,'katagamiAllOption',$event,parts.api_field,parts.input_type)" v-if="parts.option_shiwake=='katagaminai' && hiddenChecker2(parts) && $parent.katagamiNaiUser" :class="{'active':$parent.selected.sessions.ordersheet[api_fielder(parts)] != null && $parent.selected.sessions.ordersheet[api_fielder(parts)] != '' && defaultChecker($parent.selected.sessions.ordersheet[api_fielder(parts)],parts)}")
							div
								figure
									img( v-bind:src="$parent.uploadPass+parts.images")
								div
									p(v-if="$parent.debug") [debug]型紙依存全だしオプション
									p(v-if="$parent.debug")
										span [debug]対応API:
										span(v-if="parts.api_field != null") {{parts.api_field}}
										span(v-else) 登録されていない
									p.selectparts__en {{parts.option_name_en}}
									p.selectparts__ja {{parts.option_name}}
									p.selectparts__selected_item(v-if="api_fielder(parts) != null") {{selectedItemCheck('katagamiAllOption',parts.option_id,$parent.selected.sessions.ordersheet[api_fielder(parts)])["option_field"]}}
									//女性のボタンで有料の物を使っている場合
									p.selectparts__selected_item(v-if='parts.api_field == "button_cno" && $parent.selected.gender == "women"') {{selectedItemCheck('katagamiAllOption',67,$parent.selected.sessions.ordersheet.colorcustoms_button_cno)["option_field"]}}


						li(v-bind:key='parts.rank' :data-rank='parts.rank' :data-target="parts.option_id" v-on:click="partsClicker(parts.option_id,'hyoujunOption',$event,parts.api_field,parts.input_type)" v-if="parts.option_shiwake=='hyoujun' && vestUraziChecker(parts) && hiddenChecker(parts) && katagamiIzonChecker(parts,'hyoujunOption')" :class="{'active':($parent.selected.sessions.ordersheet[api_fielder(parts)] != null && $parent.selected.sessions.ordersheet[api_fielder(parts)] != '' && defaultChecker($parent.selected.sessions.ordersheet[api_fielder(parts)],parts)) || uraziDPChecker(parts)}")
							div
								figure
									img( v-bind:src="$parent.uploadPass+parts.images")
								div
									p(v-if="$parent.debug") [debug]標準のオプション
									p(v-if="$parent.debug") [debug]{{parts.option_id}}
									p(v-if="$parent.debug")
										span [debug]対応API:
										span(v-if="parts.api_field != null") {{parts.api_field}}
										span(v-else) 登録されていない
									p.selectparts__en {{parts.option_name_en}}
									p.selectparts__ja {{parts.option_name}}
									p.selectparts__selected_item(v-if="api_fielder(parts) != null") {{selectedItemCheck('hyoujunOption',parts.option_id,$parent.selected.sessions.ordersheet[api_fielder(parts)])["option_field"]}}
									//名前
									p.selectparts__selected_item(v-if='parts.api_field == "enter_name"') {{selectedItemCheck('hyoujunOption',31,$parent.selected.sessions.ordersheet.style_name)["option_field"]}}
									p.selectparts__selected_item(v-if='parts.api_field == "enter_name"') {{$parent.selected.sessions.ordersheet.enter_name}}

			//ここからオプションアイテム
			div.product__list(v-if="disp == 2 && inputtype == 1 && targetApiField.indexOf('colorcustoms_') == -1 && targetApiField.indexOf('suso_d') == -1  && targetApiField.indexOf('customselect_') == -1 && ($parent.selected.gender == 'women' && targetApiField.indexOf('button_cno') > -1) == false" key="item")
				ul
					li(v-for="product in optionData[selectedOptionType][selectedCategory].optionitems" v-bind:data-optionid="product.option_id" v-on:click="selectOption(product)" v-if="optionItemHiddenChecker(product)" :class="{'active':product.option_code ==  selectedOptionCode}")
						figure
							img(v-if="product.option_image",v-bind:src="uploadpass+product.option_image")
						div.product__list__data
							p.product__list__data__code {{product.option_code}}
							p.product__list__data__name {{product.option_field}}
							// プライスはいらない
				div.product__list_selectparts__backer
					p(v-on:click="backs()").buttons.buttons-black.buttons-small 一覧へ戻る
			//女性ボタン
			div.product__list(v-if="disp == 2 && ($parent.selected.gender == 'women' && targetApiField.indexOf('button_cno') > -1)" key="item")
				ul
					li(v-for="product in optionData[selectedOptionType][selectedCategory].optionitems" v-bind:data-optionid="product.option_id" v-on:click="selectOptionWomenButtonNormal(product)" v-if="optionItemHiddenChecker(product)" :class="{'active':product.option_code ==  selectedOptionCode}")
						figure
							img(v-if="product.option_image",v-bind:src="uploadpass+product.option_image")
						div.product__list__data
							p.product__list__data__code {{product.option_code}}
							p.product__list__data__name {{product.option_field}}
							// プライスはいらない
					li(v-for="product in womenYuryouButton.optionitems" v-bind:data-optionid="product.option_id" v-on:click="selectOptionWomenButton(product)" v-if="optionItemHiddenChecker(product)" :class="{'active':product.option_code ==  selectedOptionCode}")
						figure
							img(v-if="product.option_image",v-bind:src="uploadpass+product.option_image")
						div.product__list__data
							p.product__list__data__code {{product.option_code}}
							p.product__list__data__name {{product.option_field}}
							// プライスはいらない
				div.product__list_selectparts__backer
					p(v-on:click="backs()").buttons.buttons-black.buttons-small 一覧へ戻る
			//ポケット
			div.product__list(v-if="disp == 2 && targetApiField.indexOf('customselect_pocket') > -1" key="item")
				ul
					li(v-for="product in optionData[selectedOptionType][selectedCategory].optionitems" v-bind:data-optionid="product.option_id" v-on:click="selectOptionPocket(product)" v-if="optionItemHiddenChecker(product) &&((product.option_code == 1 && $parent.selected.gender == 'men') || product.option_code != 1)" :class="{'active':product.option_code ==  selectedOptionCode}")
						figure
							img(v-if="product.option_image",v-bind:src="uploadpass+product.option_image")
						div.product__list__data
							p.product__list__data__code {{product.option_code}}
							p.product__list__data__name {{product.option_field}}
							// プライスはいらない
				div.product__list_selectparts__backer
					p(v-on:click="backs()").buttons.buttons-black.buttons-small 一覧へ戻る
			//裾口とまっきん
			div.product__list(v-else-if="disp == 2 && targetApiField.indexOf('suso_d') > -1" key="item")
				ul
					li(v-for="product in optionData[selectedOptionType][selectedCategory].optionitems" v-bind:data-optionid="product.option_id" v-on:click="selectOption(product)" v-if="optionItemHiddenChecker(product)" :class="{'active':product.option_code ==  selectedOptionCode}")
						figure
							img(v-if="product.option_image",v-bind:src="uploadpass+product.option_image")
						div.product__list__data
							p.product__list__data__code {{product.option_code}}
							p.product__list__data__name {{product.option_field}}
							// プライスはいらない
				//マッキン
				p.option_infostring(v-if="targetApiField.indexOf('suso_d') > -1 && selectedOptionCode == 2 && selectedCategory in optionData[selectedOptionType]" :data-methods='koteiEnter()') マッキン巾を選択してください。
				select.koteiul.koteiselect(v-if="targetApiField.indexOf('suso_d') > -1 && selectedOptionCode == 2 && sub == ''  && selectedCategory in optionData[selectedOptionType]" :data-methods='koteiEnter()' v-model="selectSentakuMackin1" v-on:change='selectOptionKotei(selectSentakuMackin1,"mackin_width")')
					option(v-for="product in mackinOptionData.optionitems" v-bind:data-optionid="product.option_id" v-if="optionItemHiddenChecker(product)" :class="{'active':product.option_code ==  selectedOptionCodeKotei('mackin_width')}" :value="product") {{product.option_field}}
				select.koteiul.koteiselect(v-if="targetApiField.indexOf('suso_d') > -1 && selectedOptionCode == 2 && sub != ''  && selectedCategory in optionData[selectedOptionType]" :data-methods='koteiEnter()' v-model="selectSentakuMackin2" v-on:change='selectOptionKotei(selectSentakuMackin2,"mackin_width")')
					option(v-for="product in mackinOptionData.optionitems" v-bind:data-optionid="product.option_id" v-if="optionItemHiddenChecker(product)" :class="{'active':product.option_code ==  selectedOptionCodeKotei('mackin_width')}" :value="product") {{product.option_field}}
				// ul.koteiul(v-if="targetApiField.indexOf('suso_d') > -1 && selectedOptionCode == 2  && selectedCategory in optionData[selectedOptionType]" :data-methods='koteiEnter()')
				// 	li(v-for="product in mackinOptionData.optionitems" v-bind:data-optionid="product.option_id" v-on:click="selectOptionKotei(product,'mackin_width')" v-if="optionItemHiddenChecker(product)" :class="{'active':product.option_code ==  selectedOptionCodeKotei('mackin_width')}")
				// 		figure
				// 			img(v-if="product.option_image",v-bind:src="uploadpass+product.option_image")
				// 		div.product__list__data
				// 			p.product__list__data__code {{product.option_code}}
				// 			p.product__list__data__name {{product.option_field}}
				// //マッキン2
				// ul.koteiul(v-if="targetApiField.indexOf('suso_d') > -1 && $parent.selected.sessions.ordersheet.suso_d2 == '2' && selectedCategory in optionData[selectedOptionType]" :data-methods='koteiEnter()')
				// 	li(v-for="product in mackinOptionData.optionitems" v-bind:data-optionid="product.option_id" v-on:click="selectOptionKotei(product,'mackin_width2')" v-if="optionItemHiddenChecker(product)" :class="{'active':product.option_code ==  selectedOptionCodeKotei('mackin_width2')}")
				// 		figure
				// 			img(v-if="product.option_image",v-bind:src="uploadpass+product.option_image")
				// 		div.product__list__data
				// 			p.product__list__data__code {{product.option_code}}
				// 			p.product__list__data__name {{product.option_field}}

				div.product__list_selectparts__backer
					p(v-on:click="backs()").buttons.buttons-black.buttons-small 一覧へ戻る
			//カラーがあるやつ
			div.product__list(v-else-if="disp == 2 && inputtype == 1 && targetApiField.indexOf('colorcustoms_') >= 0" key="itemcolor")
				ul(v-if='selectedCategory in optionData[selectedOptionType] && selectedCategory != ""')
					template(v-if='"optionitems" in optionData[selectedOptionType][selectedCategory]')
						li(v-for="product in optionData[selectedOptionType][selectedCategory].optionitems" v-bind:data-optionid="product.option_id" v-on:click="selectOption(product)" v-if="optionItemHiddenChecker(product) && 'optionitems' in optionData[selectedOptionType][selectedCategory]" :class="{'active':product.option_code ==  selectedOptionCode}")
							figure
								img(v-if="product.option_image",v-bind:src="uploadpass+product.option_image")
							div.product__list__data
								p.product__list__data__code {{product.option_code}}
								p.product__list__data__name {{product.option_field}}
								// プライスはいらない
						//urazi
					template(v-if='uradpColorOptionData')
						li(v-for="product in uradpColorOptionData.optionitems" v-bind:data-optionid="product.option_id" v-on:click="selectOptionKotei(product,'colorcustoms_ura_cno')" v-if="optionItemHiddenChecker(product) && targetApiField == 'colorcustoms_ura_cno_normal'" :class="{'active':product.option_code ==  selectedOptionCodeKotei('ura_cno')}")
							figure
								img(v-if="product.option_image",v-bind:src="uploadpass+product.option_image")
							div.product__list__data
								p.product__list__data__code {{product.option_code}}
								p.product__list__data__name {{product.option_field}}
				div.urazinames(v-if="uraziNamaeDekiruka && targetApiField.indexOf('colorcustoms_ura_cno') >= 0")
					p.option_infostring 裏地に名前を入れる場合は、文字を入力してください。
					p.product__textinput
						input(type="text" v-model="$parent.selected.sessions.ordersheet['digital_name']")
				//seppa
				ul.koteiul(v-if="targetApiField == 'colorcustoms_seppa_hall_normal' && $parent.selected.sessions.ordersheet.colorcustoms_seppa_hall_normal == '999999' && selectedCategory in optionData[selectedOptionType]" :data-methods='koteiEnter()')
					li(v-for="product in seppaColorOptionData.optionitems" v-bind:data-optionid="product.option_id" v-on:click="selectOptionKotei(product,'colorcustoms_seppa_hall')" v-if="optionItemHiddenChecker(product)" :class="{'active':product.option_code ==  selectedOptionCodeKotei('colorcustoms_seppa_hall')}")
						figure
							img(v-if="product.option_image",v-bind:src="uploadpass+product.option_image")
						div.product__list__data
							p.product__list__data__code {{product.option_code}}
							p.product__list__data__name {{product.option_field}}

				//flowerhall
				ul.koteiul(v-if="targetApiField == 'colorcustoms_flower_hall_normal' && $parent.selected.sessions.ordersheet.colorcustoms_flower_hall_normal == '999999'" :data-methods='koteiEnter()')
					li(v-for="product in flowerColorOptionData.optionitems" v-bind:data-optionid="product.option_id" v-on:click="selectOptionKotei(product,'colorcustoms_flower_hall')" v-if="optionItemHiddenChecker(product)" :class="{'active':product.option_code ==  selectedOptionCodeKotei('colorcustoms_flower_hall')}")
						figure
							img(v-if="product.option_image",v-bind:src="uploadpass+product.option_image")
						div.product__list__data
							p.product__list__data__code {{product.option_code}}
							p.product__list__data__name {{product.option_field}}
				//color cross
				ul.koteiul(v-if="targetApiField == 'colorcustoms_color_cross_normal' && $parent.selected.sessions.ordersheet.colorcustoms_color_cross_normal == '999999'" :data-methods='koteiEnter()')
					li(v-for="product in colorCrossColorOptionData.optionitems" v-bind:data-optionid="product.option_id" v-on:click="selectOptionKotei(product,'colorcustoms_color_cross')" v-if="optionItemHiddenChecker(product)" :class="{'active':product.option_code ==  selectedOptionCodeKotei('colorcustoms_color_cross')}")
						figure
							img(v-if="product.option_image",v-bind:src="uploadpass+product.option_image")
						div.product__list__data
							p.product__list__data__code {{product.option_code}}
							p.product__list__data__name {{product.option_field}}
				//amfstitch
				ul.koteiul(v-if="targetApiField == 'colorcustoms_amf_stitch_normal' && ($parent.selected.sessions.ordersheet.colorcustoms_amf_stitch_normal == '0.2' || $parent.selected.sessions.ordersheet.colorcustoms_amf_stitch_normal == '0.7')" :data-methods='koteiEnter()')
					li(v-for="product in amfColorOptionData.optionitems" v-bind:data-optionid="product.option_id" v-on:click="selectOptionKotei(product,'colorcustoms_amf_stitch')" v-if="optionItemHiddenChecker(product)" :class="{'active':product.option_code ==  selectedOptionCodeKotei('colorcustoms_amf_stitch')}")
						figure
							img(v-if="product.option_image",v-bind:src="uploadpass+product.option_image")
						div.product__list__data
							p.product__list__data__code {{product.option_code}}
							p.product__list__data__name {{product.option_field}}
							// プライスはいらない
				div.product__list_selectparts__backer
					p(v-on:click="backs()").buttons.buttons-black.buttons-small 一覧へ戻る
			// name
			div.product__list(v-else-if="disp == 2 && targetApiField == 'enter_name'" key="name")
				p.option_infostring 刺繍書式を選択してください
				ul()
					li(v-for="product in nameSyosiki.optionitems" v-bind:data-optionid="product.option_id" v-on:click="selectOptionKotei(product,'style_name')" v-if="optionItemHiddenChecker(product)" :class="{'active':product.option_code ==  selectedOptionCodeKotei('style_name')}")
						figure
							img(v-if="product.option_image",v-bind:src="uploadpass+product.option_image")
						div.product__list__data
							p.product__list__data__code {{product.option_code}}
							p.product__list__data__name {{product.option_field}}
				p.option_infostring 文字を入力してください
				p.name_attensiion(v-if='nameNyuryokuChecker() == false') 文字が入力されていません
				p.product__textinput
					input(type="text" v-model="$parent.selected.sessions.ordersheet[targetApiField]")
				div.product__list_selectparts__backer
					p(v-on:click="backs()").buttons.buttons-black.buttons-small 一覧へ戻る
			div.product__list(v-else-if="disp == 2 && inputtype == 2" key="input")
				p.option_infostring 文字を入力してください
				p.product__textinput
					input(type="text" v-model="$parent.selected.sessions.ordersheet[targetApiField]")
				div.product__list_selectparts__backer
					p(v-on:click="backs()").buttons.buttons-black.buttons-small 一覧へ戻る
</template>
<style>
	.koteiselect{
		padding:0.5em;
		box-sizing:border-box;
		width:100%;
	}
</style>
<script>
// コンポーネントのtemplateは、一つのタグですべて囲われていなければならん。注意。
//アロー関数では値が取れなくなる場合がある。　hoge:function(){}としろ。
module.exports = {
	data:function(){
		return {
			// パンツ２枚目かスカート２枚目んときつかう
			sub:"",
			optionData:"",
			optionLoad:false,
			c3Category:'',
			disp:1,
			//tsukaeruOption,hyoujunOption とか
			selectedOptionType:"",
			selectedCategory: "",
			targetApiField:"",
			//選択式かテキスト入力か
			inputtype:"",
			targetApiField:"",
			courseNo:this.$parent.selected.code.course,
			//インスタント的に使うセレクトの値　毎回リセットされる
			selectSentakuMackin1:0,
			selectSentakuMackin2:0,
			//工場によっては値が無い可能性がある危険因子
			wanted:[],
			katagamiKesuOption:{}
		}
	},
	watch:{
		'$parent.selected.sessions.ordersheet.suso_d1':function(){
			var mk1pro = '';
		var mk2pro = '';
		var mk1 = 0;
		//// console.log('裾１が変更されたのでマッキン初期化');
		//// console.log(this.mackinOptionData);
		$.each(this.mackinOptionData.optionitems,function(key,item){
			if(item.option_code == mk1){
				mk1pro = item;
			}
		});
		//// console.log(mk1pro);
		//// console.log(mk2pro);
		Vue.set(this,"selectSentakuMackin1",mk1pro);
		},
		'$parent.selected.sessions.ordersheet.suso_d2':function(){
		var mk2pro = '';
		var mk2 = 0;
		//// console.log('裾2が変更されたのでマッキン初期化');
		//// console.log(this.mackinOptionData);
		$.each(this.mackinOptionData.optionitems,function(key,item){
			if(item.option_code == mk2){
				mk2pro = item;
			}
		});
		//// console.log(mk2pro);
		Vue.set(this,"selectSentakuMackin2",mk2pro);
		},
	},
	props:["tantouflg","uploadpass"],
	computed:{
		selectCourse:function(){
			var parts = this.$parent.selected.parts;
			var styleNo = '';
			$.each(parts,function(key,item){
				styleNo = item.styleNo;
			});
			return styleNo;
		},
		selectCourseZenbu:function(){
			var parts = this.$parent.selected.parts;
			var styleNo = '';
			$.each(parts,function(key,item){
				styleNo = item;
			});
			return styleNo;
		},
		orded: function () {
			// // console.log('表示するオプションリスト');
			// // console.log(this.optionData.mazemaze);
    return _.orderBy(this.optionData.mazemaze, 'rank');
		},
		ordedReverse:function(){
			return _.reverse(this.orded);
		},
		uraziNamaeDekiruka:function(){
			var urazino = this.$parent.selected.sessions.ordersheet.colorcustoms_ura_cno;
			if(urazino != '' && urazino != null){
				urazino = parseInt(urazino);
				if(urazino >= 301 && urazino <= 310){
					return true;
				}else{
					Vue.set(this.$parent.selected.sessions.ordersheet,'digital_name','');
				}
			}else{
					Vue.set(this.$parent.selected.sessions.ordersheet,'digital_name','');
				}
		},
		//女性用
		courseNos:function(){
			var course = this.$parent.selected.code.course;
			var courses = [];
			if(course.indexOf(",") > -1){
				courses = course.split(",");
			}else{
				courses[0] = course;
			}
			//// console.log("courseNos:::");
			//// console.log(courses);
			return courses;
		},
		gender:function(){
			return this.$parent.selected.gender;
		},
		selectedSelect:function(){
			//// console.log(this.$parent.selected.parts);
			return this.$parent.selected.parts;
		},
		partsdata:function(){
			return this.$parent.selectparts;
		},
		selectedOptionCode(){
			var targetSessionCode = this.targetApiField;
			var targetSessionCodePlus = this.targetApiField;
			var result = "";
			if((this.c3Category == 6 || this.c3Category == 7 || this.c3Category == 4) && this.sub == ""){
				targetSessionCodePlus = targetSessionCode + "1";
			}else if((this.c3Category == 6 || this.c3Category == 7 || this.c3Category == 4) && this.sub != ""){
				targetSessionCodePlus = targetSessionCode + "2";
			}
			if(targetSessionCodePlus in this.$parent.selected.sessions.ordersheet){
			result = this.$parent.selected.sessions.ordersheet[targetSessionCodePlus];
			}else{
				result = this.$parent.selected.sessions.ordersheet[targetSessionCode];
			}
			//// console.log("selectedOptionCode:"+result);
			if(result == null){
				result = 0;
			}
			return result;
		},

		//dpuraziの有料カラーデータ
		uradpColorOptionData(){
			if(65 in this.optionData["AllAll"]){
			return this.optionData["AllAll"][65];
			}else{
				return false;
			}
		},
		//切羽配色の有料カラーデータ
		seppaColorOptionData(){
			return this.optionData["AllAll"][35];
		},
		//マッキンのでーた
		mackinOptionData(){
			return this.optionData["AllAll"][63];
		},
		//flowerhallの有料カラーデータ
		flowerColorOptionData(){
			//// console.log(this.optionData);
			return this.optionData["AllAll"][36];
		},
		//カラークロスの有料カラーデータ
		colorCrossColorOptionData(){
			return this.optionData["AllAll"][34];
		},
		//AMFステッチの有料カラーデータ
		amfColorOptionData(){
			return this.optionData["AllAll"][46];
		},
		womenYuryouButton(){
			// //// console.log(this.optionData);
			return this.optionData["AllAll"][67];
		},
		//ネーム刺繍書式データ
		nameSyosiki(){
			return this.optionData["AllAll"][31];
		}
	},
	methods:{
		checkKatagamiOption:function(katagami){
			const query = {
			headers: {
				"content-Type": "application/json;charset=UTF-8"
			},
			params: {
					katagami:katagami,

				}
			};
			var thista = this;
			axios.get("/sandbox/ajaxTool/checkKatagamiOption.php", query).then(res => {
				// // console.log('型紙で使えないオプション');
				// // console.log(res.data);
				Vue.set(thista,"katagamiKesuOption",{});
				$.each(res.data['kesuOption'],function(key,item){
					Vue.set(thista.katagamiKesuOption,item['option_id'],item);
				});
				// // console.log(thista.katagamiKesuOption);
			})

		},
		//型紙が対象オプションに対応しているか
		katagamiTsukaenChecker:function(option){
			if(option.option_id in this.katagamiKesuOption){
				// // console.log(option.option_name+'は対応していないので消す');
				// if(this.sub == '' && option.option_id == 26 && (this.$parent.selected.sessions.ordersheet.w_adjuster1 != null && this.$parent.selected.sessions.ordersheet.w_adjuster1 != '')){
				// 	// console.log('w_adjuster1 消す');
				// 	Vue.set(this.$parent.selected.sessions.ordersheet,'w_adjuster1',null);
				// }
				// if(this.sub != '' && option.option_id == 26 && (this.$parent.selected.sessions.ordersheet.w_adjuster2 != null && this.$parent.selected.sessions.ordersheet.w_adjuster2 != '')){
				// 	// console.log('w_adjuster2 消す');
				// 	Vue.set(this.$parent.selected.sessions.ordersheet,'w_adjuster2',null);
				// }
				return false;
			}else{
				// // console.log(option.option_name+'は対応している');
				// if(this.sub == '' && option.option_id == 26 && (this.$parent.selected.sessions.ordersheet.w_adjuster1 == null || this.$parent.selected.sessions.ordersheet.w_adjuster1 == '')){
				// 	// console.log('w_adjuster1 初期値つける');
				// 	Vue.set(this.$parent.selected.sessions.ordersheet,'w_adjuster1',"0");
				// }
				// if(this.sub != '' && option.option_id == 26 && (this.$parent.selected.sessions.ordersheet.w_adjuster2 == null || this.$parent.selected.sessions.ordersheet.w_adjuster2 == '')){
				// 	// console.log('w_adjuster2 初期値つける');
				// 	Vue.set(this.$parent.selected.sessions.ordersheet,'w_adjuster2',"0");
				// }
			return true;
			}
		},
		//裏地ノーマルが選択されてなくてもDPが選択されてたらactive付けるため用
		uraziDPChecker:function(parts){
			if(parts.api_field == 'colorcustoms_ura_cno_normal'){
				if(this.$parent.selected.sessions.ordersheet.colorcustoms_ura_cno_normal == null){
					if(this.$parent.selected.sessions.ordersheet.colorcustoms_ura_cno == null || this.$parent.selected.sessions.ordersheet.colorcustoms_ura_cno == '0'){
						return false;
					}else{
						return true;
					}
				}
			}else{
				return false;
			}
		},
		//選択されているオプションがデフォルト値か
		defaultChecker:function(target,parts){
			var checker = true;

			if('optionitems' in parts){
				if(Object.keys(parts['optionitems']).length > 0){
					$.each(parts['optionitems'],function(key,item){
						if(target == item['option_code']){
							if(item['option_default'] >= 1){
								checker = false;
							}
						}
					});
				}
			}
			return checker;
		},
		powerChecker:function(parts){
			var checker = true;
			var item = '';
			var course = this.$parent.selected.parts;
			$.each(course,function(key,item2){
					item = item2;
				});
			if(parts.api_field == 'ext_specification'){

				if((this.c3Category == 2 && (item.styleNo == 4 || item.styleNo == 5 || item.styleNo == 6 || item.styleNo == 1)) || (this.c3Category == 4 && (item.styleNo == 3)) || (this.c3Category == 5 && (item.styleNo == 11 || item.styleNo == 10 || item.styleNo == 15 || item.styleNo == 17 || item.styleNo == 16 || item.styleNo == 7))){
					checker = true;
				}else{
					checker = false;
				}
			}
			return checker;
		},
		vestUraziChecker:function(parts){
			var checker = true;
			if(this.c3Category == 3){
				var course = this.$parent.selected.parts;
				$.each(course,function(key,item){
					if(item.code == "003" && parts.api_field == 'colorcustoms_ura_cno_normal'){
						checker = false;
					}
				});
				//// console.log("cooooourse");
				//// console.log(course);
				//// console.log(parts);
			}
			return checker;
		},
		henkankun2:function(target){
			var result = '';
			switch(target){
				case 2:
				result = 1;
				break;
				case 3:
				result = 2;
				break;
				case 4:
				result = 3;
				break;
				default:
				result = target;
				break;
			}
			return result;
		},
		nameNyuryokuChecker:function(){
			var mozi = this.$parent.selected.sessions.ordersheet.enter_name;
			var type = this.$parent.selected.sessions.ordersheet.style_name;
			if(type >= 1){
				if(mozi == '' || mozi == null){
					Vue.set(this.$parent,'clickLocker',true);
					return false;
				}
			}
			Vue.set(this.$parent,'clickLocker',false);
			return true;
		},
		koteiEnter:function(){
			setTimeout(function(){
				if($('.koteiul').find('li.active').length <= 0){
				$('.koteiul').find('li').eq(0).click();
				}
			},500)
			return true;
		},
		optionItemHiddenChecker:function(item){
			var checker = true;
			var thista = this;
			//// console.log('オプションアイテム');
			//// console.log(item);

			//パワーフィットの場合は裏仕様のクロスバックは使えない
			// 52はパワーフィット　裏仕様は57
			if(item.option_id == 52){

				if(this.$parent.selected.sessions.ordersheet.ext_specification_normal == 3 && item.option_code == 1){
					//// console.log('裏仕様がクロスバックなんでパワーフィットはつかえない');
					checker = false;
				}
			}
			//裏仕様
			if(item.option_id == 57){
				//ゲスト系の人は出してOKなんで
				if(this.$parent.guest ==false && this.$parent.katagamiNaiUser ==false){
				//裏仕様は型紙に依存するのでそのチェック
				var targetGenderNum = 1;
				if(this.$parent.selected.gender == 'women'){
					targetGenderNum = 5;
				}
				var targetUrashiyo = '';
				$.each(this.$parent.selected.katagami[targetGenderNum],function(key22,item22){
					targetUrashiyo = item22.urashiyo;
				})
				// // console.log(this.$parent.selected.katagami);
				// // console.log(targetUrashiyo);
				if(targetUrashiyo.length > 0){
				if(targetUrashiyo.indexOf(item.option_code) == -1){
					checker = false;
				}
				}else{
					checker = false;
				}
				//クロスバックとパワーフィットのチェック
				if(this.$parent.selected.sessions.ordersheet.ext_specification == 1 && item.option_code == 3){
					//// console.log('パワーフィット適用されてるんでクロスバックはつかえない');
					checker = false;
				}
			}
			}

			//袖口本切羽がなしの場合は切羽配色のカラーは選択できない
			// 切羽配色は55 袖口本切羽は47
			// if(item.option_id == 55){
			// 	if(this.$parent.selected.sessions.ordersheet.sode_honseppa == 0 && item.option_code == 999999){
			// 		//// console.log('袖口本切羽がなしになっているのでカラーは選べない');
			// 		checker = false;
			// 	}
			// }

			// if(item.option_id == 47){
			// 	if(this.$parent.selected.sessions.ordersheet.colorcustoms_seppa_hall_normal == 999999 && item.option_code == 0){
			// 		//// console.log('切羽配色がカラーになっているので袖口本切羽を無しにはできない');
			// 		alert('袖口本切羽を無しにする場合は、切羽配色を[表地と同色]にしてください');
			// 		checker = false;
			// 	}
			// }

			//期限チェックはsc_helper_optionでやってる
			//工場チェック
			if(item.option_factory != "" && item.option_factory != null){
				var factoryList = [];
				if(item.option_factory.indexOf(",") > -1){
					factoryList = item.option_factory.split(",");
				}else{
					factoryList[0] = item.option_factory;
				}

				$.each(factoryList,function(key2,item2){
					if(item2 == thista.$parent.selectedProductData.factory){
						//// console.log("工場だめ："+item.item_id);
						checker = false;
						return false;
					}
				});
			}
			//スーティストチェック
			if(item.option_tq == "1"){
				if(thista.$parent.selected.suitist){

				}else{
					//// console.log(thista.$parent.selected.suitist);
					//// console.log("スーティストではないから出さない："+item.item_id);
					checker = false;
				}
			}
			return checker;
		},
		//カテゴリで表示しないオプションチェック（カラーのやつとか）
		hiddenChecker:function(target){
			// 表示チェックされている箇所チェック
			targetCate = this.c3Category;
			// なんかべストとパンツ逆番号で登録されているんで直す…
			if(targetCate == 3 ){
				targetCate =4;
			}else if(targetCate == 4){
				targetCate =3;
			}
			if(target.option_item.indexOf(''+targetCate) < 0){
				return false;
			}



			// その他固定でけすやつ
			targetarray = [];
			if(this.$parent.selected.sessions.ordersheet.washable == 1){
				targetarray.push('w_adjuster');
				targetarray.push('daiba');
				Vue.set(this.$parent.selected.sessions.ordersheet,'w_adjuster1',null);
				Vue.set(this.$parent.selected.sessions.ordersheet,'w_adjuster2',null);
			}
			targetarray.push('colorcustoms_seppa_hall');
			targetarray.push('change_pocket');
			targetarray.push('colorcustoms_amf_stitch');
			targetarray.push('colorcustoms_flower_hall');
			targetarray.push('colorcustoms_ura_cno');
			targetarray.push('colorcustoms_button_cno');
			targetarray.push('colorcustoms_color_cross');
			targetarray.push('mackin_width');
			targetarray.push('digital_name');
			targetarray.push('washable');
			targetarray.push('style_name');
			var activer = $('.selector_design__category ul li').index('.selector_design__category ul li.buttons-line');
			// // console.log(this.selectCourse);
			if((this.selectCourse != 3 && this.selectCourse != 2 && ((this.selectCourse == 13 && this.sub != '') || this.selectCourse != 13) && ((this.selectCourse == 12 && this.sub != '') || this.selectCourse != 12) && this.selectCourse != 8 && (this.c3Category != 2 && this.c3Category != 5))){
				targetarray.push('button_cno');
			}
			if(targetarray.indexOf(target.api_field) > -1){
				return false;
			}
			if(target.api_field == 'daiba' && this.$parent.selected.sessions.ordersheet.daiba == null){
				Vue.set(this.$parent.selected.sessions.ordersheet,'daiba','0');
			}
			return true;
		},
		//カテゴリで表示しないオプションチェック型紙ないユーザ用
		hiddenChecker2:function(target){
			// 表示チェックされている箇所チェック
			targetCate = this.c3Category;
			// なんかべストとパンツ逆番号で登録されているんで直す…
			if(targetCate == 3 ){
				targetCate =4;
			}else if(targetCate == 4){
				targetCate =3;
			}
			if(target.option_item.indexOf(''+targetCate) < 0){
				return false;
			}



			// その他固定でけすやつ
			targetarray = [];
			if(this.$parent.selected.sessions.ordersheet.washable == 1){
				targetarray.push('w_adjuster');
				targetarray.push('daiba');
				Vue.set(this.$parent.selected.sessions.ordersheet,'w_adjuster1',null);
				Vue.set(this.$parent.selected.sessions.ordersheet,'w_adjuster2',null);
			}
			targetarray.push('colorcustoms_seppa_hall');
			targetarray.push('change_pocket');
			targetarray.push('colorcustoms_amf_stitch');
			targetarray.push('colorcustoms_flower_hall');
			targetarray.push('colorcustoms_ura_cno');
			targetarray.push('colorcustoms_button_cno');
			targetarray.push('colorcustoms_color_cross');
			targetarray.push('mackin_width');
			targetarray.push('digital_name');
			targetarray.push('washable');
			targetarray.push('style_name');
			if((this.selectCourse != 3 && this.selectCourse != 2 && ((this.selectCourse == 13 && this.sub != '') || this.selectCourse != 13) && ((this.selectCourse == 12 && this.sub != '') || this.selectCourse != 12) && this.selectCourse != 8 && (this.c3Category != 2 && this.c3Category != 5))){
				targetarray.push('button_cno');
			}
			if(targetarray.indexOf(target.api_field) > -1){
				return false;
			}
			return true;
		},
		katagamiIzonChecker(parts,optionCate){
			if(optionCate == 'hyoujunOption' && parts.katagami_flg == 1){
				return false;
			}else if(optionCate == 'fabricOption' && parts.katagami_flg == 1){
				return false;
			}else{
				return true;
			}
		},
		selectedOptionCodeKotei(kotei){
			var targetSessionCode = kotei;
			var targetSessionCodePlus = kotei;
			var result = "";
			if((this.c3Category == 6 || this.c3Category == 7 || this.c3Category == 4) && this.sub == ""){
				targetSessionCodePlus = targetSessionCode + "1";
			}else if((this.c3Category == 6 || this.c3Category == 7 || this.c3Category == 4) && this.sub != ""){
				targetSessionCodePlus = targetSessionCode + "2";
			}
			if(targetSessionCodePlus in this.$parent.selected.sessions.ordersheet){
			result = this.$parent.selected.sessions.ordersheet[targetSessionCodePlus];
			}else{
				result = this.$parent.selected.sessions.ordersheet[targetSessionCode];
			}
			//// console.log("selectedOptionCode("+kotei+"):"+result);
			if(result == null){
				result = 0;
			}
			return result;
		},
		//カテゴリの１と２わかれるのチェックのために
		api_fielder:function(parts){
			var targetSessionCode = parts.api_field;
			var targetSessionCodePlus = parts.api_field;
			var result = "";
			if((this.c3Category == 6 || this.c3Category == 7 || this.c3Category == 4) && this.sub == ""){
				targetSessionCodePlus = targetSessionCode + "1";
			}else if((this.c3Category == 6 || this.c3Category == 7 || this.c3Category == 4) && this.sub != ""){
				targetSessionCodePlus = targetSessionCode + "2";
			}

			if(targetSessionCodePlus in this.$parent.selected.sessions.ordersheet){
			result = targetSessionCodePlus;
			}else{
				result = targetSessionCode;
			}
			return result;
		},
		//カテゴリ一覧にて選択されている子アイテムを取得
		selectedItemCheck:function(type,key,sessionId){
			if(this.optionData != ''){
				if(type == 'hyoujunOption' && key == 48){

				}
				if(type in this.optionData){
				if(key in this.optionData[type]){
			if('optionitems' in this.optionData[type][key]){
			var options = this.optionData[type][key].optionitems;
			// var targetOption = "該当なし："+key+":"+sessionId;
			var targetOption = "";
			$.each(options,function(key2,item2){
				if(item2.option_code == sessionId){
					targetOption = item2;
					return false;
				}
			});
			//// console.log(targetOption);
			if(type == 'hyoujunOption' && key == 48 && targetOption == ""){
					if(65 in this.optionData['AllAll']){
					if('optionitems' in this.optionData['AllAll'][65]){
						var options = this.optionData['AllAll'][65].optionitems;
						var sessionId = this.$parent.selected.sessions.ordersheet.colorcustoms_ura_cno;
						$.each(options,function(key2,item2){
				if(item2.option_code == sessionId){
					targetOption = item2;
					return false;
				}
			});
					}
					}
				}
			return targetOption;
			}
			}
			}
			}
			return false;
		},
		c3CateChanger:function(target,sub){
			if(this.$parent.clickLocker == false){
			this.disp = 1;
			if(sub != ""){
				this.sub = sub;
				Vue.set(this.$parent.selected,'optionSub',sub);
				// this.$parent.sub = sub;
				//// console.log("２枚目のものを選択");
				//// console.log(this.sub);

			}else{
				this.sub = "";
				Vue.set(this.$parent.selected,'optionSub','');
				// this.$parent.sub = sub;
			}
			this.c3Category = target;
			Vue.set(this.$parent,'optionC3Category',this.henkankun2(target));
			//// console.log("表示するオプションカテゴリーを変更した:"+target);
			var target2 ;
			if(target == "2"){
				target2 = "1";
			}else if(target == "3"){
				target2 = '2'
			}else if(target == "4"){
				target2 = '3'
			}
			var targetParts = target2 + sub;
			if(Object.keys(this.$parent.selected.katagami[targetParts]).length >= 1){
			// // console.log('対象の箇所');
			var targetKatagamiOptions = {};
			$.each(this.$parent.selected.katagami[targetParts],function(key,item){
				targetKatagamiOptions = item;
			});
			// // console.log(targetParts);
			// // console.log(targetKatagamiOptions);
			this.checkKatagamiOption(JSON.stringify(targetKatagamiOptions));
				}

			}else{
				alert('入力されていない項目があります。お確かめください。');
			}
		},
		backs:function(){
			if(this.$parent.clickLocker == false){
			this.disp = 1;
			}else{
				alert('入力されていない項目があります。お確かめください。');
			}
		},
		partsClicker:function(target,type,event,apifield,inputtype){
			if(apifield === null || apifield == ""){
				alert("こちらのオプションはapi_fieldが設定されていないため使えません。");
			}else{
			this.selectedCategory = target;
			this.selectedOptionType = type;
			this.targetApiField = apifield;
			this.inputtype = inputtype;
			this.disp = 2;
			//// console.log("選択されたオプションカテゴリ：");
			//// console.log(this.targetApiField);
			//// console.log(this.selectedOptionType);
			//// console.log(this.selectedCategory);
			//// console.log(this.optionData);
			 //// console.log(this.optionData[this.selectedOptionType][this.selectedCategory]);
			}
		},
		selectOption:function(option){
			// Vue.set(this.$parent.selected.options,option.option_id,{});
			// Vue.set(this.$parent.selected.options[option.option_id],option.item_id,option);
			// Vue.set(this.$parent.selected.sessions[option.option_id],option.item_id,option);
			//// console.log(this.c3Category);

			var targetSessionCode = this.optionData[this.selectedOptionType][this.selectedCategory].api_field;
			var targetSessionCodePlus = this.optionData[this.selectedOptionType][this.selectedCategory].api_field;
			if((this.c3Category == 6 || this.c3Category == 7 || this.c3Category == 4) && this.sub == ""){
				targetSessionCodePlus = targetSessionCode + "1";
			}else if((this.c3Category == 6 || this.c3Category == 7 || this.c3Category == 4) && this.sub != ""){
				targetSessionCodePlus = targetSessionCode + "2";
			}
			if(targetSessionCodePlus in this.$parent.selected.sessions.ordersheet){
			Vue.set(this.$parent.selected.sessions.ordersheet,targetSessionCodePlus,option.option_code);
			}else{
				Vue.set(this.$parent.selected.sessions.ordersheet,targetSessionCode,option.option_code);
			}
			var thista = this;
			setTimeout(function(){
			thista.checkOptionCourse();
			},500);
			//// console.log("オプションが変更・追加されました");
			//// console.log(this.$parent.selected.sessions);
		},
		selectOptionWomenButtonNormal:function(option){
			//// console.log(this.c3Category);
			Vue.set(this.$parent.selected.sessions.ordersheet,'colorcustoms_button_cno',null);
			var targetSessionCode = this.optionData[this.selectedOptionType][this.selectedCategory].api_field;
			var targetSessionCodePlus = this.optionData[this.selectedOptionType][this.selectedCategory].api_field;
			if((this.c3Category == 6 || this.c3Category == 7 || this.c3Category == 4) && this.sub == ""){
				targetSessionCodePlus = targetSessionCode + "1";
			}else if((this.c3Category == 6 || this.c3Category == 7 || this.c3Category == 4) && this.sub != ""){
				targetSessionCodePlus = targetSessionCode + "2";
			}
			if(targetSessionCodePlus in this.$parent.selected.sessions.ordersheet){
			Vue.set(this.$parent.selected.sessions.ordersheet,targetSessionCodePlus,option.option_code);
			}else{
				Vue.set(this.$parent.selected.sessions.ordersheet,targetSessionCode,option.option_code);
			}
			var thista = this;
			setTimeout(function(){
			thista.checkOptionCourse();
			},500);
			//// console.log("オプションが変更・追加されました");
			//// console.log(this.$parent.selected.sessions);
		},
		selectOptionWomenButton:function(option){
			//// console.log(this.c3Category);

			var targetSessionCode = "colorcustoms_button_cno";
			var targetSessionCodePlus = "colorcustoms_button_cno";
			if((this.c3Category == 6 || this.c3Category == 7 || this.c3Category == 4) && this.sub == ""){
				targetSessionCodePlus = targetSessionCode + "1";
			}else if((this.c3Category == 6 || this.c3Category == 7 || this.c3Category == 4) && this.sub != ""){
				targetSessionCodePlus = targetSessionCode + "2";
			}
			if(targetSessionCodePlus in this.$parent.selected.sessions.ordersheet){
			Vue.set(this.$parent.selected.sessions.ordersheet,targetSessionCodePlus,option.option_code);
			Vue.set(this.$parent.selected.sessions.ordersheet,'button_cno',option.option_code);
			}else{
				Vue.set(this.$parent.selected.sessions.ordersheet,targetSessionCode,option.option_code);
				Vue.set(this.$parent.selected.sessions.ordersheet,'button_cno',option.option_code);
			}
			var thista = this;
			setTimeout(function(){
			thista.checkOptionCourse();
			},500);
			//// console.log("オプションが変更・追加されました");
			//// console.log(this.$parent.selected.sessions);
		},
		selectOptionPocket:function(option){
			// Vue.set(this.$parent.selected.options,option.option_id,{});
			// Vue.set(this.$parent.selected.options[option.option_id],option.item_id,option);
			// Vue.set(this.$parent.selected.sessions[option.option_id],option.item_id,option);
			//// console.log(this.c3Category);

			var targetSessionCode = this.optionData[this.selectedOptionType][this.selectedCategory].api_field;
			var targetSessionCodePlus = this.optionData[this.selectedOptionType][this.selectedCategory].api_field;
			if((this.c3Category == 6 || this.c3Category == 7 || this.c3Category == 4) && this.sub == ""){
				targetSessionCodePlus = targetSessionCode + "1";
			}else if((this.c3Category == 6 || this.c3Category == 7 || this.c3Category == 4) && this.sub != ""){
				targetSessionCodePlus = targetSessionCode + "2";
			}

			Vue.set(this.$parent.selected.sessions.ordersheet,targetSessionCodePlus,option.option_code);


			//ポケット
			if(option.option_code == '2'){
				//// console.log('チェンジポケットを有効化');
				Vue.set(this.$parent.selected.sessions.ordersheet,'change_pocket',1);
			}else{
				//// console.log('チェンジポケットをnullに');
				Vue.set(this.$parent.selected.sessions.ordersheet,'change_pocket',null);
			}
			//ポケット
			if(option.option_code == '1'){
				//// console.log('パッチポケットを有効化');
				Vue.set(this.$parent.selected.sessions.ordersheet,'patch_pocket',1);
			}else{
				//// console.log('パッチポケットをnullに');
				Vue.set(this.$parent.selected.sessions.ordersheet,'patch_pocket',null);
			}

			var thista = this;
			setTimeout(function(){
			thista.checkOptionCourse();
			},500);
			//// console.log("オプションが変更・追加されました");
			//// console.log(this.$parent.selected.sessions);
		},
		selectOptionKotei:function(option,kotei){
			// Vue.set(this.$parent.selected.options,option.option_id,{});
			// Vue.set(this.$parent.selected.options[option.option_id],option.item_id,option);
			// Vue.set(this.$parent.selected.sessions[option.option_id],option.item_id,option);
			//// console.log(this.c3Category);

			var targetSessionCode = kotei;
			var targetSessionCodePlus = kotei;
			if((this.c3Category == 6 || this.c3Category == 7 || this.c3Category == 4) && this.sub == ""){
				targetSessionCodePlus = targetSessionCode + "1";
			}else if((this.c3Category == 6 || this.c3Category == 7 || this.c3Category == 4) && this.sub != ""){
				targetSessionCodePlus = targetSessionCode + "2";
			}
			if(targetSessionCodePlus in this.$parent.selected.sessions.ordersheet){
			Vue.set(this.$parent.selected.sessions.ordersheet,targetSessionCodePlus,option.option_code);
			}else{
				Vue.set(this.$parent.selected.sessions.ordersheet,targetSessionCode,option.option_code);
			}
			var thista = this;
			setTimeout(function(){
			thista.checkOptionCourse();
			},500);
			//// console.log("オプションが変更・追加されました");
			//// console.log(this.$parent.selected.sessions);
		},
		ivModalOpen:function(target,type){
			Vue.set(this.$parent,"imageAndVideoModalFlg",true);
			Vue.set(this.$parent,"ivModalType",type);
			if(type == "image"){
			Vue.set(this.$parent,"modalImage",target);
			}else if(type == "video"){
				Vue.set(this.$parent,"modalVideo",target);
			}
		},
		getOptions:function(kumiawaseId,gender){
			var gb = "";
			if(this.$parent.selected.gb){
				gb = 1;
			}
			var katagami = {};
			//// console.log(this.$parent.selected.course);
			$.each(this.$parent.selected.course,function(key,item){
				if(Object.keys(item).length > 0){
					//// console.log("型紙検知："+key);
					$.each(item,function(key2,item2){
					katagami[key] = item2.pattern_id;
					})
				}
			});
			const query = {
			headers: {
				"content-Type": "application/json;charset=UTF-8"
			},
			params: {
					kumiawaseId: kumiawaseId,
					katagami:katagami,
					gender:gender,
					katagamiNaiUser:this.$parent.katagamiNaiUser,
					parts:this.$parent.selected.parts,
					factory:this.$parent.selectedProductData.factory,
					gb:gb,
				}
			};
			var thista = this;
			return new Promise(function (resolve, reject) {
			axios.get("/sandbox/ajaxTool/getOptionKumiawase.php", query).then(res => {
				// // console.log('オプションデータ');
				// // console.log(res.data);
				thista.optionData = res.data;
				thista.$parent.optionData = res.data;
				thista.optionLoad = true;
				// // console.log(thista.selectCourseZenbu);
				if(26 in thista.optionData.mazemaze){
					// // console.log('ウェストアジャスタ含まれてるんで初期値０つける');
					if(thista.$parent.selected.gender == 'men' && thista.selectCourseZenbu.designParts.indexOf('pants') && (thista.$parent.selected.sessions.ordersheet.w_adjuster1 == null || thista.$parent.selected.sessions.ordersheet.w_adjuster1 == '') && thista.$parent.selected.sessions.ordersheet.washable != 1){
						Vue.set(thista.$parent.selected.sessions.ordersheet,'w_adjuster1',"0");
					}
					if(thista.$parent.selected.gender == 'men' && thista.selectCourseZenbu.designParts.indexOf('pants2') && (thista.$parent.selected.sessions.ordersheet.w_adjuster2 == null || thista.$parent.selected.sessions.ordersheet.w_adjuster2 == '') && thista.$parent.selected.sessions.ordersheet.washable != 1){
						Vue.set(thista.$parent.selected.sessions.ordersheet,'w_adjuster2',"0");
					}
				}else{
					// // console.log('ウェストアジャスタ含まれてないんでnullに');
					if(thista.selectCourseZenbu.designParts.indexOf('pants') && (thista.$parent.selected.sessions.w_adjuster1 != null && thista.$parent.selected.sessions.w_adjuster1 != '')){
						Vue.set(thista.$parent.selected.sessions,'w_adjuster1',null);
					}
					if(thista.selectCourseZenbu.designParts.indexOf('pants2') && (thista.$parent.selected.sessions.w_adjuster2 != null && thista.$parent.selected.sessions.w_adjuster2 != '')){
						Vue.set(thista.$parent.selected.sessions,'w_adjuster2',null);
					}
				}
				resolve('ok');
			})
			})
		},
		// index.jsにもある　両方修正せよ
		checkOptionCourse:function(){
			//// console.log("checkOptionCourse");
			//// console.log(this.optionData);
			const query = {
			headers: {
				"content-Type": "application/json;charset=UTF-8"
			},
			params: {
					sessions:JSON.stringify(this.$parent.selected.sessions.ordersheet),
					factory:this.$parent.selectedProductData.factory,
					gender:this.$parent.selected.gender,
					gb:this.$parent.selected.gb,
					selectedOptionset:this.optionData.fabricOptionSetId,
					fabricTourokuOption:this.$parent.selectedProductData.specification
				}
			};
			var thista = this;
			axios.get("/sandbox/ajaxTool/getOptionCourse.php", query).then(res => {
				// // console.log(res.data);
				data = res.data;
				Vue.set(thista.$parent.selected.code,"optionCourse",data);
				Vue.set(thista.$parent.selected.sessions.ordersheet,'course_no',data);
				// // console.log("オプションコース特定した selected.code.optionCourse："+thista.$parent.selected.code.optionCourse);
				if(thista.$parent.selected.sessions.ordersheet.course_no != 'none' && thista.$parent.selected.sessions.ordersheet.course_no != '' && thista.$parent.selected.sessions.ordersheet.course_no != null){
					// // console.log('optioncourseチェック');
					// // console.log(thista.$parent.selected.sessions.ordersheet.course_no);
        thista.$parent.getOptionCourseDetail(thista.$parent.selected.sessions.ordersheet.course_no);
        }
			})
		},
		optionNaiChecker:function(){
			var dame = [];
			var thista = this;
			// // console.log(this.wanted);
			$.each(this.wanted,function(key,item){
				// // console.log(item);
				if(thista.$parent.selected.sessions.ordersheet[item.api_field] == '' || thista.$parent.selected.sessions.ordersheet[item.api_field] == null){
					if(key == 'colorcustoms_ura_cno_normal'){
						if(thista.$parent.selected.sessions.ordersheet.colorcustoms_ura_cno == null || thista.$parent.selected.sessions.ordersheet.colorcustoms_ura_cno == '0'){
							dame.push(item.name);
						}else{
							// // console.log('裏地はDPのものをつかっている');
						}
					}else{
						dame.push(item.name);
					}

				}
			});
			if(dame.length > 0){
				var string = '';
				$.each(dame,function(key,item){
					string = string+item+'を選択してください\n';
				});
				alert(string);
				Vue.set(this.$parent,'step',5);
			}
		}
	},
	mounted:function(){

		var kumiawaseIds = this.$parent.selectedProductData.type;
		//// console.log(kumiawaseIds);
		this.getOptions(kumiawaseIds,this.$parent.selected.gender).then(res =>{
		var mk1 = this.$parent.selected.sessions.ordersheet.mackin_width1;
		var mk2 = this.$parent.selected.sessions.ordersheet.mackin_width2;
		if(mk1 == null ){
			mk1 = 0;
		}
		if(mk2 == null ){
			mk2 = 0;
		}
		var mk1pro = '';
		var mk2pro = '';
		//// console.log('ここやで');
		//// console.log(this.mackinOptionData);
		$.each(this.mackinOptionData.optionitems,function(key,item){
			if(item.option_code == mk1){
				mk1pro = item;
			}else if(item.option_code == mk2){
				mk2pro = item;
			}
		});
		//// console.log(mk1pro);
		//// console.log(mk2pro);
		Vue.set(this,"selectSentakuMackin1",mk1pro);
		Vue.set(this,"selectSentakuMackin2",mk2pro);
		});
		if(this.$parent.selected.gender == "women"){
			this.c3Category = 5;
		}
		var thista = this;
		Vue.nextTick(function(){
			//// console.log('カテゴリの一つ目をクリックします');
			setTimeout(function(){
				//ここに追加する場合、getOptionSyokitiもなおしてね
				var wanted = {};
		$('.selector_design__category li').each(function(key,item){
			if(thista.$parent.selected.gender == 'men' && $(item).attr('data-target') == 2){
				wanted['colorcustoms_flower_hall_normal'] = {'api_field':'colorcustoms_flower_hall_normal','name':'フラワーホール'};
				wanted['colorcustoms_seppa_hall_normal'] = {'api_field':'colorcustoms_seppa_hall_normal','name':'切羽配色'};
			}
			if($(item).attr('data-target') == 2 || $(item).attr('data-target') == 3 || $(item).attr('data-target') == 4 || $(item).attr('data-target') == 5 || $(item).attr('data-target') == 6){
				wanted['button_cno'] = {'api_field':'button_cno','name':'ボタン'};
			}
			if($(item).attr('data-target') == 2 || $(item).attr('data-target') == 5 || $(item).attr('data-target') == 3){

				wanted['colorcustoms_ura_cno_normal'] = {'api_field':'colorcustoms_ura_cno_normal','name':'裏地'};
			};
		});

		Vue.set(thista,'wanted',wanted);
		// // console.log(thista.wanted);




		//衿が使える場合で衿がNULLんときにデフォルト値つける
			var eriFlg = false;
        if(thista.$parent.selected.gender == 'men'){
			if(Object.keys(thista.$parent.selected.katagami[1]).length > 0){
          $.each(thista.$parent.selected.katagami[1],function(key,item){
            if(42 in item.option_id){
              eriFlg = true;
            }
          });
			}
        }else{
			if(Object.keys(thista.$parent.selected.katagami[5]).length > 0){
          $.each(thista.$parent.selected.katagami[5],function(key,item){
            if(42 in item.option_id){
              eriFlg = true;
            }
          });
			}
        }
		if(thista.$parent.guest == true){
			eriFlg = true;
			// // console.log('ゲストです');
		}else{
			// // console.log('ゲストではない');
		}
        if(eriFlg == true && thista.$parent.selected.sessions.ordersheet['sh_eri'] == null){
          Vue.set(thista.$parent.selected.sessions.ordersheet,'sh_eri',1);
        }else if(eriFlg == false){
			Vue.set(thista.$parent.selected.sessions.ordersheet,'sh_eri',null);
		}


			},500);
			setTimeout(function(){
				$('.selector_design__category li').eq(0).click();
				thista.checkOptionCourse();
			},1500);
		})
		// // console.log('セッション情報↓');
		// // console.log(this.$parent.selected.sessions);
	},
	beforeDestroy:function(){
		if(this.$parent.step > 5){
			this.optionNaiChecker();
		}
		// Vue.set(this.$parent,'view2','');
	}

};
</script>