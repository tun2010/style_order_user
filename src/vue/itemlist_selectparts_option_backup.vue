<template lang="pug">
	div.simulator__selector(v-if="optionLoad")
		div.selector_design__category
				ul(v-if="$parent.selected.gender == 'men'")
					li.buttons(:class="{'buttons-line':c3Category == 2,'buttons-black':c3Category != 2}" v-on:click="c3CateChanger(2,'')" v-if="courseNo == '001' || courseNo == '002' || courseNo == '003' || courseNo == '004'") JACKET
					li.buttons(:class="{'buttons-line':c3Category == 4 && sub != 'pants2','buttons-black':c3Category != 4}" v-on:click="c3CateChanger(4,'')" v-if="courseNo == '001' || courseNo == '002' || courseNo == '003' || courseNo == '006'") SLACKS
					li.buttons(:class="{'buttons-line':c3Category == 4 && sub == 'pants2','buttons-black':c3Category != 4 && sub != 'pants2'}" v-on:click="c3CateChanger(4,'pants2')" v-if="courseNo == '002' || courseNo == '2'") SLACKS2
					li.buttons(:class="{'buttons-line':c3Category == 3,'buttons-black':c3Category != 3}" v-on:click="c3CateChanger(3,'')" v-if="courseNo == '003' || courseNo == '005'") VEST
				ul(v-if="$parent.selected.gender == 'women'")
					li.buttons(:class="{'buttons-line':c3Category == 5,'buttons-black':c3Category != 5}" v-on:click="c3CateChanger(5,'')" v-if="courseNo.indexOf('011') > -1") JACKET
					li.buttons(:class="{'buttons-line':c3Category == 6 && sub != 'pants2','buttons-black':c3Category != 6}" v-on:click="c3CateChanger(6,'')" v-if="courseNo.indexOf('012') > -1") SLACKS
					li.buttons(:class="{'buttons-line':c3Category == 6 && sub == 'pants2','buttons-black':c3Category != 6 && sub != 'pants2'}" v-on:click="c3CateChanger(6,'pants2')" v-if="courseNos[2] == '012'") SLACKS2
					li.buttons(:class="{'buttons-line':c3Category == 7 && sub != 'skirt2','buttons-black':c3Category != 7}" v-on:click="c3CateChanger(7,'')" v-if="courseNo.indexOf('013') > -1") SKIRT
					li.buttons(:class="{'buttons-line':c3Category == 7 && sub == 'skirt2','buttons-black':c3Category != 7 && sub != 'skirt2'}" v-on:click="c3CateChanger(7,'skirt2')" v-if="(courseNos[2] == '013' && courseNos[1] == '013') || (courseNos[0] == '013' && courseNos[1] == '013')") SKIRT2
		transition(name="slide" mode="out-in")
			div.product__list_selectparts.product__list_selectparts_option(v-if="disp == 1" key="category")
				ul
					li(v-for="(parts,key) in optionData.fabricOption" v-if="hiddenChecker(parts) && katagamiIzonChecker(parts,'fabricOption') && key != ''" :data-target="key" v-on:click="partsClicker(key,'fabricOption',$event,parts.api_field,parts.input_type)" :class="{'active':$parent.selected.sessions.ordersheet[api_fielder(parts)] != null && $parent.selected.sessions.ordersheet[api_fielder(parts)] != '' && defaultChecker($parent.selected.sessions.ordersheet[api_fielder(parts)],parts)}")
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
								p.selectparts__selected_item(v-if="api_fielder(parts) != null") {{selectedItemCheck('fabricOption',key,$parent.selected.sessions.ordersheet[api_fielder(parts)])["option_field"]}}
					li(v-for="(parts,key) in optionData.katagamiOption" :data-target="key" v-on:click="partsClicker(key,'katagamiOption',$event,parts.api_field,parts.input_type)" v-if="hiddenChecker(parts) && powerChecker(parts)" :class="{'active':$parent.selected.sessions.ordersheet[api_fielder(parts)] != null && $parent.selected.sessions.ordersheet[api_fielder(parts)] != '' && defaultChecker($parent.selected.sessions.ordersheet[api_fielder(parts)],parts)}")
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
								p.selectparts__selected_item(v-if="api_fielder(parts) != null") {{selectedItemCheck('katagamiOption',key,$parent.selected.sessions.ordersheet[api_fielder(parts)])["option_field"]}}
								//女性のボタンで有料の物を使っている場合
								p.selectparts__selected_item(v-if='parts.api_field == "button_cno" && $parent.selected.gender == "women"') {{selectedItemCheck('katagamiOption',67,$parent.selected.sessions.ordersheet.colorcustoms_button_cno)["option_field"]}}
					//ゲスト用の型紙依存オプション全部出し
					li(v-for="(parts,key) in optionData.katagamiAllOption" :data-target="key" v-on:click="partsClicker(key,'katagamiAllOption',$event,parts.api_field,parts.input_type)" v-if="hiddenChecker2(parts) && $parent.katagamiNaiUser" :class="{'active':$parent.selected.sessions.ordersheet[api_fielder(parts)] != null && $parent.selected.sessions.ordersheet[api_fielder(parts)] != '' && defaultChecker($parent.selected.sessions.ordersheet[api_fielder(parts)],parts)}")
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
								p.selectparts__selected_item(v-if="api_fielder(parts) != null") {{selectedItemCheck('katagamiOption',key,$parent.selected.sessions.ordersheet[api_fielder(parts)])["option_field"]}}
								//女性のボタンで有料の物を使っている場合
								p.selectparts__selected_item(v-if='parts.api_field == "button_cno" && $parent.selected.gender == "women"') {{selectedItemCheck('katagamiOption',67,$parent.selected.sessions.ordersheet.colorcustoms_button_cno)["option_field"]}}


					li(v-for="(parts,key) in optionData.hyoujunOption" :data-target="key" v-on:click="partsClicker(key,'hyoujunOption',$event,parts.api_field,parts.input_type)" v-if="vestUraziChecker(parts) && hiddenChecker(parts) && katagamiIzonChecker(parts,'hyoujunOption')" :class="{'active':$parent.selected.sessions.ordersheet[api_fielder(parts)] != null && $parent.selected.sessions.ordersheet[api_fielder(parts)] != '' && defaultChecker($parent.selected.sessions.ordersheet[api_fielder(parts)],parts)}")
						div
							figure
								img( v-bind:src="$parent.uploadPass+parts.images")
							div
								p(v-if="$parent.debug") [debug]標準のオプション
								p(v-if="$parent.debug")
									span [debug]対応API:
									span(v-if="parts.api_field != null") {{parts.api_field}}
									span(v-else) 登録されていない
								p.selectparts__en {{parts.option_name_en}}
								p.selectparts__ja {{parts.option_name}}
								p.selectparts__selected_item(v-if="api_fielder(parts) != null") {{selectedItemCheck('hyoujunOption',key,$parent.selected.sessions.ordersheet[api_fielder(parts)])["option_field"]}}
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
					li(v-for="product in optionData[selectedOptionType][selectedCategory].optionitems" v-bind:data-optionid="product.option_id" v-on:click="selectOptionPocket(product)" v-if="optionItemHiddenChecker(product)" :class="{'active':product.option_code ==  selectedOptionCode}")
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
				div.urazinames(v-if="uraziNamaeDekiruka")
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
			selectSentakuMackin2:0
		}
	},
	watch:{
		'$parent.selected.sessions.ordersheet.suso_d1':function(){
			var mk1pro = '';
		var mk2pro = '';
		var mk1 = 0;
		// console.log('裾１が変更されたのでマッキン初期化');
		// console.log(this.mackinOptionData);
		$.each(this.mackinOptionData.optionitems,function(key,item){
			if(item.option_code == mk1){
				mk1pro = item;
			}
		});
		// console.log(mk1pro);
		// console.log(mk2pro);
		Vue.set(this,"selectSentakuMackin1",mk1pro);
		},
		'$parent.selected.sessions.ordersheet.suso_d2':function(){
		var mk2pro = '';
		var mk2 = 0;
		// console.log('裾2が変更されたのでマッキン初期化');
		// console.log(this.mackinOptionData);
		$.each(this.mackinOptionData.optionitems,function(key,item){
			if(item.option_code == mk2){
				mk2pro = item;
			}
		});
		// console.log(mk2pro);
		Vue.set(this,"selectSentakuMackin2",mk2pro);
		},
	},
	props:["tantouflg","uploadpass"],
	computed:{
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
			// console.log("courseNos:::");
			// console.log(courses);
			return courses;
		},
		gender:function(){
			return this.$parent.selected.gender;
		},
		selectedSelect:function(){
			// console.log(this.$parent.selected.parts);
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
			// console.log("selectedOptionCode:"+result);
			if(result == null){
				result = 0;
			}
			return result;
		},
		//dpuraziの有料カラーデータ
		uradpColorOptionData(){
			if(65 in this.optionData["fabricOption"]){
			return this.optionData["fabricOption"][65];
			}else{
				return false;
			}
		},
		//切羽配色の有料カラーデータ
		seppaColorOptionData(){
			return this.optionData["fabricOption"][35];
		},
		//マッキンのでーた
		mackinOptionData(){
			return this.optionData["hyoujunOption"][63];
		},
		//flowerhallの有料カラーデータ
		flowerColorOptionData(){
			// console.log(this.optionData);
			return this.optionData["fabricOption"][36];
		},
		//カラークロスの有料カラーデータ
		colorCrossColorOptionData(){
			return this.optionData["fabricOption"][34];
		},
		//AMFステッチの有料カラーデータ
		amfColorOptionData(){
			return this.optionData["fabricOption"][46];
		},
		womenYuryouButton(){
			// // console.log(this.optionData);
			return this.optionData["fabricOption"][67];
		},
		//ネーム刺繍書式データ
		nameSyosiki(){
			return this.optionData["hyoujunOption"][31];
		}
	},
	methods:{
		//選択されているオプションがデフォルト値か
		defaultChecker:function(target,parts){
			var checker = true;

			if('optionitems' in parts){
				if(Object.keys(parts['optionitems']).length > 0){
					$.each(parts['optionitems'],function(key,item){
						if(target == item['option_code']){
							if(item['option_default'] == '1'){
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
				// console.log("cooooourse");
				// console.log(course);
				// console.log(parts);
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
			// console.log('オプションアイテム');
			// console.log(item);

			//パワーフィットの場合は裏仕様のクロスバックは使えない
			// 52はパワーフィット　裏仕様は57
			if(item.option_id == 52){

				if(this.$parent.selected.sessions.ordersheet.ext_specification_normal == 3 && item.option_code == 1){
					// console.log('裏仕様がクロスバックなんでパワーフィットはつかえない');
					checker = false;
				}
			}
			if(item.option_id == 57){

				if(this.$parent.selected.sessions.ordersheet.ext_specification == 1 && item.option_code == 3){
					// console.log('パワーフィット適用されてるんでクロスバックはつかえない');
					checker = false;
				}
			}

			//袖口本切羽がなしの場合は切羽配色のカラーは選択できない
			// 切羽配色は55 袖口本切羽は47
			if(item.option_id == 55){
				if(this.$parent.selected.sessions.ordersheet.sode_honseppa == 0 && item.option_code == 999999){
					// console.log('袖口本切羽がなしになっているのでカラーは選べない');
					checker = false;
				}
			}

			if(item.option_id == 47){
				if(this.$parent.selected.sessions.ordersheet.colorcustoms_seppa_hall_normal == 999999 && item.option_code == 0){
					// console.log('切羽配色がカラーになっているので袖口本切羽を無しにはできない');
					alert('袖口本切羽を無しにする場合は、切羽配色を[表地と同色]にしてください');
					checker = false;
				}
			}

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
						// console.log("工場だめ："+item.item_id);
						checker = false;
						return false;
					}
				});
			}
			//スーティストチェック
			if(item.option_tq == "1"){
				if(thista.$parent.selected.suitist){

				}else{
					// console.log(thista.$parent.selected.suitist);
					// console.log("スーティストではないから出さない："+item.item_id);
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
			if(this.c3Category != 2 && this.c3Category != 5){
				targetarray.push('button_cno');
			}
			if(targetarray.indexOf(target.api_field) > -1){
				return false;
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
			if(this.c3Category != 2 && this.c3Category != 5){
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
			// console.log("selectedOptionCode("+kotei+"):"+result);
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
			// console.log(targetOption);
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
				// console.log("２枚目のものを選択");
				// console.log(this.sub);

			}else{
				this.sub = "";
				Vue.set(this.$parent.selected,'optionSub','');
				// this.$parent.sub = sub;
			}
			this.c3Category = target;
			Vue.set(this.$parent,'optionC3Category',this.henkankun2(target));
			// console.log("表示するオプションカテゴリーを変更した:"+target);
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
			// console.log("選択されたオプションカテゴリ：");
			// console.log(this.targetApiField);
			// console.log(this.selectedOptionType);
			// console.log(this.selectedCategory);
			// console.log(this.optionData);
			 // console.log(this.optionData[this.selectedOptionType][this.selectedCategory]);
			}
		},
		selectOption:function(option){
			// Vue.set(this.$parent.selected.options,option.option_id,{});
			// Vue.set(this.$parent.selected.options[option.option_id],option.item_id,option);
			// Vue.set(this.$parent.selected.sessions[option.option_id],option.item_id,option);
			// console.log(this.c3Category);

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
			// console.log("オプションが変更・追加されました");
			// console.log(this.$parent.selected.sessions);
		},
		selectOptionWomenButtonNormal:function(option){
			// console.log(this.c3Category);
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
			// console.log("オプションが変更・追加されました");
			// console.log(this.$parent.selected.sessions);
		},
		selectOptionWomenButton:function(option){
			// console.log(this.c3Category);

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
			// console.log("オプションが変更・追加されました");
			// console.log(this.$parent.selected.sessions);
		},
		selectOptionPocket:function(option){
			// Vue.set(this.$parent.selected.options,option.option_id,{});
			// Vue.set(this.$parent.selected.options[option.option_id],option.item_id,option);
			// Vue.set(this.$parent.selected.sessions[option.option_id],option.item_id,option);
			// console.log(this.c3Category);

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
				// console.log('チェンジポケットを有効化');
				Vue.set(this.$parent.selected.sessions.ordersheet,'change_pocket',1);
			}else{
				// console.log('チェンジポケットをnullに');
				Vue.set(this.$parent.selected.sessions.ordersheet,'change_pocket',null);
			}
			//ポケット
			if(option.option_code == '1'){
				// console.log('パッチポケットを有効化');
				Vue.set(this.$parent.selected.sessions.ordersheet,'patch_pocket',1);
			}else{
				// console.log('パッチポケットをnullに');
				Vue.set(this.$parent.selected.sessions.ordersheet,'patch_pocket',null);
			}

			var thista = this;
			setTimeout(function(){
			thista.checkOptionCourse();
			},500);
			// console.log("オプションが変更・追加されました");
			// console.log(this.$parent.selected.sessions);
		},
		selectOptionKotei:function(option,kotei){
			// Vue.set(this.$parent.selected.options,option.option_id,{});
			// Vue.set(this.$parent.selected.options[option.option_id],option.item_id,option);
			// Vue.set(this.$parent.selected.sessions[option.option_id],option.item_id,option);
			// console.log(this.c3Category);

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
			// console.log("オプションが変更・追加されました");
			// console.log(this.$parent.selected.sessions);
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
			// console.log(this.$parent.selected.course);
			$.each(this.$parent.selected.course,function(key,item){
				if(Object.keys(item).length > 0){
					// console.log("型紙検知："+key);
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
					parts:this.$parent.selected.parts,
					factory:this.$parent.selectedProductData.factory,
					gb:gb,
				}
			};
			var thista = this;
			return new Promise(function (resolve, reject) {
			axios.get("/ajaxTool/getOptionKumiawase.php", query).then(res => {
				// // console.log(res.data);
				thista.optionData = res.data;
				thista.optionLoad = true;
				// console.log(thista.optionData);
				resolve('ok');
			})
			})
		},
		checkOptionCourse:function(){
			// console.log("checkOptionCourse");
			// console.log(this.optionData);
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
			axios.get("/ajaxTool/getOptionCourse.php", query).then(res => {
				// // console.log(res.data);
				data = res.data;
				Vue.set(thista.$parent.selected.code,"optionCourse",data);
				// console.log("オプションコース特定した selected.code.optionCourse："+thista.$parent.selected.code.optionCourse);
			})
		}
	},
	mounted:function(){
		var kumiawaseIds = this.$parent.selectedProductData.type;
		// console.log(kumiawaseIds);
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
		// console.log('ここやで');
		// console.log(this.mackinOptionData);
		$.each(this.mackinOptionData.optionitems,function(key,item){
			if(item.option_code == mk1){
				mk1pro = item;
			}else if(item.option_code == mk2){
				mk2pro = item;
			}
		});
		// console.log(mk1pro);
		// console.log(mk2pro);
		Vue.set(this,"selectSentakuMackin1",mk1pro);
		Vue.set(this,"selectSentakuMackin2",mk2pro);
		});
		if(this.$parent.selected.gender == "women"){
			this.c3Category = 5;
		}

		Vue.nextTick(function(){
			// console.log('カテゴリの一つ目をクリックします');
			setTimeout(function(){
			$('.selector_design__category li').eq(0).click();
			},500);
		})

	},
	beforeDestroy:function(){
		// Vue.set(this.$parent,'view2','');
	}

};
</script>