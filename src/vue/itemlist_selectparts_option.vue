<!-- <template lang="pug">
div.simulator__selector.simulator__selector_option
	div.sorter_flexer
		div.placeholder
		div.product__list__sorter2(v-if="selectedOption")
			div.sorter2__flexer
				input(type='text' v-model='searchKey' :placeholder="inputPlaceHolder")
				span.search_icon
	transition(name="fade" mode="out-in")
		div.simulator__option__wrap(v-if="!optionLoad" key="loading")

		div.simulator__option__wrap(v-else-if="!$parent.selectedPartOption" key="options")
			div(v-for="design in designList" v-if="design.gender == $parent.selected.gender && design.is(design.gender == 'men' ? courseNo : courseNos)" :key="design.id")
				div.title_container
					div.design_title {{design.name}}
						small を選ぶ
				div.simulator__option_list
					ul.option--option_list
						li.option--option(v-for="option in optionList(design)")
							div.option--option_name(:data-id="option.option_id") {{ option.option_name }}
							div.option--option_items(v-if="option.option_id == 44")
								p.option_message.name 文字数制限：半角・全角20文字なります。
								ul.option--option_items__list
									li.option--option_items__item(
										v-for="item in optionItems(nameSyosiki.optionitems)",
										v-if="optionItemHiddenChecker(item)"
										v-on:click="selectOptionItem(item, nameSyosiki, design)",
										v-bind:data-optionid="item.option_id",
										v-bind:data-optioncode="item.option_code",
										:class="{'active': getApiFieldValue(nameSyosiki, design) == item.option_code}"
									)
										div {{  item.option_field }}
								p.option_infostring 文字を入力してください
								p.name_attensiion(v-if='nameNyuryokuChecker() == false') 文字が入力されていません
								p.product__textinput
									input(type="text" v-model="$parent.selected.sessions.ordersheet[option.api_field]")

							div.option--option_item__button(v-else-if="isCustomViewOptions(option)")
								button.option_detail__open(v-on:click="openOption(option, design)") {{ option.option_name }} を選択
								div.option_item__selected_result 選択中: {{ getOptionItem(option, design) }}
								div.urazinames(v-if="isUraziNamaeDekiruka(option)")
									p.option_infostring 裏地に名前を入れる場合は、文字を入力してください。
									p.product__textinput
										input(type="text" v-model="$parent.selected.sessions.ordersheet['digital_name']")

							div.option--option_item__button(v-else-if="isCustomOptions(option)")
								p.option_message.name(v-if="option.option_id == 55 && design.gender == 'men'")
									|切羽配色(表地合わせではなくカラー)を選択すると本切羽仕様になります。
								ul.option--option_items__list.option--lining_items__list
									li.option--option_items__item(
										v-for="item in optionCustomItems(option)",
										v-if="optionItemHiddenChecker(item)"
										v-on:click="selectOptionItem(item, option, design)",
										v-bind:data-optionid="item.option_id",
										v-bind:data-optioncode="item.option_code",
										:class="{'active': getApiFieldValue(option, design, '00') == item.option_code}"
									)
										figure(v-if="item.option_image")
											img.cover(v-bind:src="$parent.uploadPass + item.option_image")
										div.option_item--flex
											div {{ item.option_code }}
											div {{  item.option_field }}

							div.option--option_items(v-else-if="isAmfStitch(option)")
								ul.option--option_items__list.option--lining_items__list
									li.option--option_items__item(
										v-for="item in optionItems(option.optionitems)",
										v-if="optionItemHiddenChecker(item)"
										v-on:click="selectOptionItem(item, option, design)",
										v-bind:data-optionid="item.option_id",
										v-bind:data-optioncode="item.option_code",
										:class="{'active': getApiFieldValue(option, design) == item.option_code}"
									)
										figure(v-if="item.option_image")
											img.cover(v-bind:src="$parent.uploadPass + item.option_image")
										div.option_item--flex
											div {{ item.option_code }}
											div {{  item.option_field }}
								ul.option--option_items__list.option--lining_items__list.padding_top(v-if="getApiFieldValue(option, design) != '0'")
									li.option--option_items__item(
										v-for="item in optionItems(amfColorOptionData.optionitems)",
										v-if="optionItemHiddenChecker(item)"
										v-on:click="selectOptionItem(item, amfColorOptionData, design)",
										v-bind:data-optionid="item.option_id",
										v-bind:data-optioncode="item.option_code",
										:class="{'active': getApiFieldValue(amfColorOptionData, design) == item.option_code}"
									)
										figure(v-if="item.option_image")
											img.cover(v-bind:src="$parent.uploadPass + item.option_image")
										div.option_item--flex
											div {{ item.option_code }}
											div {{  item.option_field }}
							div.option--option_items(v-else)
								p.option_message.name(v-if="option.option_id == 26")
									|ウエストサイズ75.0cm以下はウエストアジャスターを付けることは出来ません。75.5cmから付けることが可能です。
								ul.option--option_items__list(:class="{'option--lining_items__list': isAmfStitch(option)}")
									li.option--option_items__item(
										v-for="item in optionItems(option.optionitems)",
										v-if="optionItemHiddenChecker(item)"
										v-on:click="selectOptionItem(item, option, design)",
										v-bind:data-optionid="item.option_id",
										v-bind:data-optioncode="item.option_code",
										:class="{'active': getApiFieldValue(option, design) == item.option_code}"
									)
										div {{  item.option_field }}
								p.option_infostring(
									v-if="option.api_field == 'suso_d' && getApiFieldValue(option, design) == 2"
								) マッキン巾を選択してください。

								div.custom_select(v-if="option.api_field == 'suso_d' && getApiFieldValue(option, design) == 2")
									div.custom_select__input
										div.selected_value
											span {{ getSelectValue(design) }}
										button.arrow(v-on:click="openSelect($event)")
									div.custom_select__layer(v-on:click="closeSelect($event)")
									div.custom_select__options
										div.custom_select__option(
											v-for="product in mackinOptionList()",
											v-if="optionItemHiddenChecker(product)",
											v-on:click="selectSizeItem($event, design, product)",
											:class="{'active': getSelectValue(design) == product.option_field}"
										)
											span {{ product.option_field }}

							// p.option_message.full(v-if="option.option_id == 55")
							// 	|切羽配色(表地合わせではなくカラー)を選択すると本切羽仕様になります。
							// p.option_message.full(v-if="option.option_id == 26")
							// 	|ウエストサイズ75.0cm以下はウエストアジャスターを付けることは出来ません。75.5cmから付けることが可能です。
		div.simulator__option__wrap(v-else key="option_items")
			ul.option--option_items__list(:class="selectedOption.option_id == uradpColorOptionId ? 'option--lining_items__list' : 'option--button_items__list'")
				li.option--option_items__item(
					v-for="item in optionItems(selectedOption.optionitems, searchKey)",
					v-if="optionItemHiddenChecker(item)"
					v-on:click="selectOptionItem(item, selectedOption, selectedDesign)",
					v-bind:data-optionid="item.option_id",
					v-bind:data-optioncode="item.option_code",
					:class="{'active': getApiFieldValue(selectedOption, selectedDesign) == item.option_code}"
				)
					figure(v-if="!['19', '99'].includes(item.option_code) && item.option_image")
						img.cover(v-bind:src="$parent.uploadPass + item.option_image")
					div.no_image(v-if="!['19', '99'].includes(item.option_code) && !item.option_image")
					div.option_item--flex
						div(v-if="selectedOption.option_id != uradpColorOptionId") {{ item.option_code }}
						div {{  item.option_field }}
</template> -->

<template>
	<div class="options-container" v-if="optionLoad">
		<div class="options-scroll vertical-scroll">
			<template v-for="design in designList">
				<template v-if="design.gender == $parent.selected.gender && design.is(design.gender == 'men' ? courseNo : courseNos)">
					<div class="sticky-title" :key="'title' + design.id">
						<h3>
							{{ design.name }}<small>を選ぶ</small>
						</h3>
					</div>
					<ul class="options-list" :key="'list' + design.id">
						<li class="option-grid" v-for="option in optionList(design)" :key="option.option_id">
							{{ option.option_id }} | {{ option.option_name }}
						</li>
					</ul>
				</template>
			</template>
		</div>
	</div>
</template>

<script>
// コンポーネントのtemplateは、一つのタグですべて囲われていなければならん。注意。
//アロー関数では値が取れなくなる場合がある。　hoge:function(){}としろ。
module.exports = {
	data: function () {
		return {
			// パンツ２枚目かスカート２枚目んときつかう
			sub: "",
			optionData: null,
			optionLoad: false,
			c3Category: '',
			disp: 1,
			//tsukaeruOption,hyoujunOption とか
			selectedOptionType: "",
			selectedCategory: "",
			targetApiField: "",
			//選択式かテキスト入力か
			inputtype: "",
			targetApiField: "",
			courseNo: this.$parent.selected.code.course,
			//インスタント的に使うセレクトの値　毎回リセットされる
			selectSentakuMackin1: 0,
			selectSentakuMackin2: 0,
			//工場によっては値が無い可能性がある危険因子
			wanted: [],
			katagamiKesuOption: {},
			katagami: {},
			searchKey: '',
			designList: [
				{
					id: 1,
					gender: 'men',
					name: 'ジャケット',
					styles: [1, 2, 3],
					categoryId: 2,
					sub: '',
					is: (courseNo) => {
						return courseNo == '001' || courseNo == '002' || courseNo == '003' || courseNo == '004'
					}
				},
				{
					id: 4,
					gender: 'men',
					name: 'ベスト',
					styles: [1],
					categoryId: 3,
					sub: '',
					is: (courseNo) => {
						return courseNo == '003' || courseNo == '005'
					}
				},
				{
					id: 2,
					gender: 'men',
					name: 'スラックス',
					styles: [1, 2, 3],
					categoryId: 4,
					sub: '',
					is: (courseNo) => {
						return courseNo == '001' || courseNo == '002' || courseNo == '003' || courseNo == '006'
					}
				},
				{
					id: 3,
					gender: 'men',
					name: 'スラックス2',
					styles: [1, 2, 3],
					categoryId: 4,
					sub: 'pants2',
					is: (courseNo) => {
						return courseNo == '002' || courseNo == '2'
					}
				},
				{
					id: 6,
					gender: 'women',
					name: 'ジャケット',
					styles: [1],
					categoryId: 5,
					sub: '',
					is: (courseNos) => {
						return courseNos.indexOf('011') > -1
					}
				},
				{
					id: 7,
					gender: 'women',
					name: 'スラックス',
					styles: [1],
					categoryId: 6,
					sub: '',
					is: (courseNos) => {
						return courseNos.indexOf('012') > -1
					}
				},
				{
					id: 8,
					gender: 'women',
					name: 'スラックス2',
					styles: [1],
					categoryId: 6,
					sub: 'pants2',
					is: (courseNos) => {
						return courseNos[2] == '012' || (courseNos[0] == '012' && courseNos[1] == '012')
					}
				},
				{
					id: 9,
					gender: 'women',
					name: 'スカート',
					styles: [1],
					categoryId: 7,
					sub: '',
					is: (courseNos) => {
						return courseNos.indexOf('013') > -1
					}
				},
				{
					id: 10,
					gender: 'women',
					name: 'スカート2',
					styles: [1],
					categoryId: 7,
					sub: 'skirt2',
					is: (courseNos) => {
						return (courseNos[2] == '013' && courseNos[1] == '013') || (courseNos[0] == '013' && courseNos[1] == '013')
					}
				},
			],
			scrollTop: 0,
			selectedOption: null,
			selectedDesign: null,
			uradpColorOptionId: '48',
			buttonOptionId: '49',
			uradpColorOption:  null,
		}
	},
	watch: {
		'$parent.selected.sessions.ordersheet.suso_d1': function () {
			var mk1pro = '';
			var mk2pro = '';
			var mk1 = 0;
			//console.log('裾１が変更されたのでマッキン初期化');
			// console.log('mackinOptionData', this.mackinOptionData);
			$.each(this.mackinOptionData.optionitems, function (key, item) {
				if (item.option_code == mk1) {
					mk1pro = item;
				}
			});
			//console.log(mk1pro);
			//console.log(mk2pro);
			Vue.set(this, "selectSentakuMackin1", mk1pro);
		},
		'$parent.selected.sessions.ordersheet.suso_d2': function () {
			var mk2pro = '';
			var mk2 = 0;
			//console.log('裾2が変更されたのでマッキン初期化');
			//console.log(this.mackinOptionData);
			$.each(this.mackinOptionData.optionitems, function (key, item) {
				if (item.option_code == mk2) {
					mk2pro = item;
				}
			});
			//console.log(mk2pro);
			Vue.set(this, "selectSentakuMackin2", mk2pro);
		},
		'$parent.selectedPartOption': function (newVal) {
			if (!newVal) {
				this.selectedOption = null;
				this.selectedDesign = null;
				this.searchKey = '';
				setTimeout(() => {
					$('.simulator__option__wrap').scrollTop(this.scrollTop);
				}, 200);
			} else {
				setTimeout(() => {
					$('.simulator__option__wrap').scrollTop(0);
				}, 200);
			}
		},
		'$parent.selected.sessions.ordersheet.colorcustoms_color_cross_normal':function (newVal) {
			Vue.set(this.$parent.selected.sessions.ordersheet, "colorcustoms_color_cross", newVal);
		},
		'$parent.selected.sessions.ordersheet.colorcustoms_flower_hall_normal':function (newVal) {
			Vue.set(this.$parent.selected.sessions.ordersheet, "colorcustoms_flower_hall", newVal);
		},
		'$parent.selected.sessions.ordersheet.colorcustoms_seppa_hall_normal':function (newVal) {
			Vue.set(this.$parent.selected.sessions.ordersheet, "colorcustoms_seppa_hall", newVal);
		},
	},
	props: ["tantouflg", "uploadpass"],
	computed: {
		inputPlaceHolder() {
			return `${this.selectedOption && this.selectedOption.option_id == this.uradpColorOptionId ? '裏生地' : 'ボタン'}NO検索`;
		},
		selectCourse: function () {
			var parts = this.$parent.selected.parts;
			var styleNo = '';
			$.each(parts, function (key, item) {
				styleNo = item.styleNo;
			});
			return styleNo;
		},
		selectCourseZenbu: function () {
			var parts = this.$parent.selected.parts;
			var styleNo = '';
			$.each(parts, function (key, item) {
				styleNo = item;
			});
			return styleNo;
		},
		orded: function () {
			// console.log('表示するオプションリスト');
			// console.log(this.optionData.mazemaze);
			return _.orderBy(this.optionData.mazemaze, 'rank');
		},
		ordedReverse: function () {
			return _.reverse(this.orded);
		},
		uraziNamaeDekiruka: function () {
			const urazino = this.$parent.selected.sessions.ordersheet.colorcustoms_ura_cno;
			if (urazino) {
				const urazinoNum = parseInt(urazino);
				if (urazinoNum >= 301 && urazinoNum <= 310) {
					return true;
				}
			}
			return false;
		},
		//女性用
		courseNos: function () {
			var course = this.$parent.selected.code.course;
			var courses = [];
			if (course.indexOf(",") > -1) {
				courses = course.split(",");
			} else {
				courses[0] = course;
			}
			//console.log("courseNos:::");
			//console.log(courses);
			return courses;
		},
		gender: function () {
			return this.$parent.selected.gender;
		},
		selectedSelect: function () {
			//console.log(this.$parent.selected.parts);
			return this.$parent.selected.parts;
		},
		partsdata: function () {
			return this.$parent.selectparts;
		},
		selectedOptionCode() {
			var targetSessionCode = this.targetApiField;
			var targetSessionCodePlus = this.targetApiField;
			var result = "";
			if ((this.c3Category == 6 || this.c3Category == 7 || this.c3Category == 4) && this.sub == "") {
				targetSessionCodePlus = targetSessionCode + "1";
			} else if ((this.c3Category == 6 || this.c3Category == 7 || this.c3Category == 4) && this.sub != "") {
				targetSessionCodePlus = targetSessionCode + "2";
			}
			if (targetSessionCodePlus in this.$parent.selected.sessions.ordersheet) {
				result = this.$parent.selected.sessions.ordersheet[targetSessionCodePlus];
			} else {
				result = this.$parent.selected.sessions.ordersheet[targetSessionCode];
			}
			//console.log("selectedOptionCode:"+result);
			if (result == null) {
				result = 0;
			}
			return result;
		},

		//dpuraziの有料カラーデータ
		uradpColorOptionData() {
			if (65 in this.optionData["AllAll"]) {
				return this.optionData["AllAll"][65];
			} else {
				return false;
			}
		},
		//切羽配色の有料カラーデータ
		seppaColorOptionData() {
			return this.optionData["AllAll"][35];
		},
		//マッキンのでーた
		mackinOptionData() {
			return this.optionData["AllAll"][63];
		},
		//flowerhallの有料カラーデータ
		flowerColorOptionData() {
			//console.log(this.optionData);
			return this.optionData["AllAll"][36];
		},
		//カラークロスの有料カラーデータ
		colorCrossColorOptionData() {
			return this.optionData["AllAll"][34];
		},
		//AMFステッチの有料カラーデータ
		amfColorOptionData() {
			return this.optionData["AllAll"][46];
		},
		womenYuryouButton() {
			// //console.log(this.optionData);
			return this.optionData["AllAll"][67];
		},
		//ネーム刺繍書式データ
		nameSyosiki() {
			return this.optionData["AllAll"][31];
		},
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
		},
		closeSelect(event) {
			$(event.target).parent().removeClass('active');
		},
		getSelectValue(design) {
			if (design.sub) {
				return this.selectSentakuMackin2 ? this.selectSentakuMackin2.option_field : 'なし'
			} else {
				return this.selectSentakuMackin1 ? this.selectSentakuMackin1.option_field : 'なし'
			}
		},
		selectSizeItem(event, design, item) {
			if (event) {
				$(event.target).parent().parent().removeClass('active');
			}
			if (design.sub) {
				this.selectSentakuMackin2 = item;
			} else {
				this.selectSentakuMackin1 = item;
			}
			this.selectOptionItem(item, this.mackinOptionData, design);
		},
		mackinOptionList() {
			let nullOption = null;
			const list = [];
			Object.values(this.mackinOptionData.optionitems).forEach(item => {
				if (item.option_code == '0') {
					nullOption = item;
				} else {
					list.push(item);
				}
			});

			return list;
		},
		isUraziNamaeDekiruka(option) {
			const urazino = this.$parent.selected.sessions.ordersheet.colorcustoms_ura_cno;
			// console.log('CHECK::urazino', urazino, option.option_id, this.uradpColorOptionId);
			// console.log('ORDERSHEET', JSON.parse(JSON.stringify(this.$parent.selected.sessions.ordersheet)));
			if (!(urazino && option.option_id == this.uradpColorOptionId)) return false;

			const urazinoNum = parseInt(urazino);

			// console.log('CHECK::urazinoNum', urazinoNum);

			return urazinoNum >= 301 && urazinoNum <= 310;
		},
		setUradpColorOption() {
			if (!this.optionData) return null;
			const option = this.optionData.mazemaze[this.uradpColorOptionId];
			const colorOption = this.optionData["AllAll"][65];
			if (!(option && colorOption)) return null;

			option.optionitems = [ ...this.optionItems(option.optionitems), ...this.optionItems(colorOption.optionitems) ];

			// Object.entries(colorOption.optionitems).forEach(([key, value]) => {
			// 	option.optionitems[key] = value;
			// });

			// this.uradpColorOption = option;

			// console.log('OPTION_DATA', JSON.parse(JSON.stringify(this.optionData)));
			// console.log('URAD_COLOR_OPTION', JSON.parse(JSON.stringify(this.uradpColorOption)));
		},
		openOption(parts, design) {
			this.scrollTop = $('.simulator__option__wrap').scrollTop();
			Vue.set(this.$parent, "selectedPartOption", parts.option_id);
			this.selectedOption = parts;
			this.selectedDesign = design;
		},
		closeOption() {
			Vue.set(this.$parent, "selectedPartOption", null);
		},
		isCustomOptions(parts) {
			const excludes = ['55', '56', '64'];
			return excludes.includes(parts.option_id);
		},
		isCustomViewOptions(parts) {
			const excludes = ['48', '49', '50'];
			return excludes.includes(parts.option_id);
		},
		isAmfStitch(parts) {
			return parts.option_id == '45';
		},
		getApiFieldName(api_field, design) {
			let apiFieid = api_field;
			let apiFieldPlus = api_field;

			if ([4, 6, 7].includes(design.categoryId)) {
				apiFieldPlus += design.sub ? "2" : "1";
			}

			if (apiFieldPlus in this.$parent.selected.sessions.ordersheet) {
				return apiFieldPlus
			} else {
				return apiFieid
			}
		},
		getCustomOption(option) {
			const options = {
				'colorcustoms_color_cross_normal': 34,
				'colorcustoms_seppa_hall_normal': 35,
				'colorcustoms_flower_hall_normal': 36,
			}
			return this.optionData["AllAll"][options[option.api_field]];
		},
		getApiFieldValue(option, design, defaultValue = '0') {
			const apiFieldName = this.getApiFieldName(option.api_field, design);

			if (apiFieldName == 'colorcustoms_ura_cno_normal') {
				return this.$parent.selected.sessions.ordersheet[apiFieldName]
					|| this.$parent.selected.sessions.ordersheet["colorcustoms_ura_cno"]
					|| defaultValue
				;
			}
			// if (apiFieldName && !this.$parent.selected.sessions.ordersheet[apiFieldName]) {
			// 	Vue.set(this.$parent.selected.sessions.ordersheet, apiFieldName, defaultValue);
			// }
			return this.$parent.selected.sessions.ordersheet[apiFieldName] || defaultValue;
		},
		getOptionItem(option, design) {
			const value = this.getApiFieldValue(option, design);
			const data = Object.values(option.optionitems).find(item => item.option_code == value);
			if (data) return `${value} ${data.option_field}`
			return '';
		},
		optionList(design) {
			const options = [];

			const removeButtonAndFabric = (parts) => {
				return !["48", "49", "50"].includes(parts.option_id);
			}

			const isFabric = (parts) => {
				return (
					parts.option_shiwake=='fabric'
					&& this.hiddenChecker(parts, design.categoryId, design.sub)
					&& this.typeChecker(parts)
					&& parts.option_id != ''
				);
			}
			const isShape = (parts) => {
				return (
					parts.option_shiwake == 'katagami'
					&& this.hiddenChecker(parts, design.categoryId, design.sub)
					&& this.powerChecker(parts, design.categoryId)
					// && this.katagamiTsukaenChecker(parts)
				);
			}
			const isNotShape = (parts) => {
				return (
					parts.option_shiwake == 'katagaminai'
					&& this.hiddenChecker2(parts, design.categoryId, design.sub)
					&& this.$parent.katagamiNaiUser
				)
			}
			const isStandard = (parts) => {
				return (
					parts.option_shiwake == 'hyoujun'
					&& this.vestUraziChecker(parts, design.categoryId)
					&& this.hiddenChecker(parts, design.categoryId, design.sub)
					&& this.typeChecker(parts)
				);
			}

			for (let option of Object.values(this.optionData.mazemaze)) {
				if (
					removeButtonAndFabric(option)
					&& (isFabric(option) || isShape(option) || isNotShape(option) || isStandard(option))
				) {
					options.push(option);
				}
			}

			const list = _.orderBy(options, 'rank', 'desc');
			// console.log('OPTION_LIST', JSON.parse(JSON.stringify(list)));
			return list;
		},
		optionItems(optionitems, filter = '') {
			let list = [];
			if (Array.isArray(optionitems)) list = optionitems;
			list = Object.values(optionitems);

			if (filter) {
				return list.filter(item => item.option_code.includes(filter));
			}
			return list;
		},
		optionCustomItems(option) {
			const item = Object.values(option.optionitems).find(item => item.option_default == '1');
			const customOption = this.getCustomOption(option)

			return [ item, ...this.optionItems(customOption.optionitems) ];
		},
		katagamiTsukaenChecker: function (option) {
			if (option.option_id in this.katagamiKesuOption) {
				return true;
			} else {
				return false;
			}
		},
		hiddenChecker(target, category, sub) {
			let targetCate = category;
			if (category == 3) {
				targetCate = 4;
			} else if (category == 4) {
				targetCate = 3;
			}
			if (!target.option_item.includes(String(targetCate))) {
				return false;
			}

			let targetarray = [
				'colorcustoms_seppa_hall',
				'change_pocket',
				'colorcustoms_amf_stitch',
				'colorcustoms_flower_hall',
				'colorcustoms_ura_cno',
				'colorcustoms_button_cno',
				'colorcustoms_color_cross',
				'mackin_width',
				'digital_name',
				'washable',
				'style_name'
			];
			if (this.$parent.selected.sessions.ordersheet.washable == 1) {
				targetarray.push('w_adjuster');
				targetarray.push('daiba');
				Vue.set(this.$parent.selected.sessions.ordersheet, 'w_adjuster1', null);
				Vue.set(this.$parent.selected.sessions.ordersheet, 'w_adjuster2', null);
			}
			if (
				(
					this.selectCourse != 3
					&& this.selectCourse != 2
					&& (
						(
							this.selectCourse == 13
							&& sub != ''
						)
						|| this.selectCourse != 13
					)
					&& (
						(
							this.selectCourse == 12
							&& sub != ''
						)
						|| this.selectCourse != 12
					)
					&& this.selectCourse != 8
					&& (
						category != 2
						&& category != 5
					)
				)
			) {
				targetarray.push('button_cno');
			}
			if (targetarray.includes(target.api_field)) {
				return false;
			}
			if (target.api_field == 'daiba' && this.$parent.selected.sessions.ordersheet.daiba == null) {
				Vue.set(this.$parent.selected.sessions.ordersheet, 'daiba', '0');
			}
			return true;
		},
		hiddenChecker2(target, category, sub){
			let targetCate = category;
			if(category == 3 ){
				targetCate = 4;
			}else if(category == 4){
				targetCate = 3;
			}
			if (!target.option_item.includes(String(targetCate))) {
				return false;
			}

			// その他固定でけすやつ
			targetarray = [];

			let targetarray = [
				'colorcustoms_seppa_hall',
				'change_pocket',
				'colorcustoms_amf_stitch',
				'colorcustoms_flower_hall',
				'colorcustoms_ura_cno',
				'colorcustoms_button_cno',
				'colorcustoms_color_cross',
				'mackin_width',
				'digital_name',
				'washable',
				'style_name'
			];
			if (this.$parent.selected.sessions.ordersheet.washable == 1) {
				targetarray.push('w_adjuster');
				targetarray.push('daiba');
				Vue.set(this.$parent.selected.sessions.ordersheet, 'w_adjuster1', null);
				Vue.set(this.$parent.selected.sessions.ordersheet, 'w_adjuster2', null);
			}

			if(this.$parent.selected.sessions.ordersheet.washable == 1){
				targetarray.push('w_adjuster');
				targetarray.push('daiba');
				Vue.set(this.$parent.selected.sessions.ordersheet,'w_adjuster1',null);
				Vue.set(this.$parent.selected.sessions.ordersheet,'w_adjuster2',null);
			}

			if(
				(
					this.selectCourse != 3
					&& this.selectCourse != 2
					&& (
						(
							this.selectCourse == 13
							&& sub != ''
						)
						|| this.selectCourse != 13
					)
					&& (
						(
							this.selectCourse == 12
							&& sub != ''
						)
						|| this.selectCourse != 12
					)
					&& this.selectCourse != 8
					&& (
						category != 2
						&& category != 5
					)
				)
			) {
				targetarray.push('button_cno');
			}
			if (targetarray.includes(target.api_field)) {
				return false;
			}

			return true;
		},
		typeChecker: function(parts) {
			if (parts.option_shiwake == 'hyoujun' && parts.katagami_flg == 1) {
				return false;
			} else if (parts.option_shiwake == 'fabric' && parts.katagami_flg == 1) {
				return false;
			} else {
				return true;
			}
		},
		powerChecker: function(parts, category) {
			var checker = true;
			var item = {};
			var course = this.$parent.selected.parts;
			$.each(course, function (key, item2) {
				item = item2;
			});
			if (parts.api_field == 'ext_specification') {

				if (
					(category == 2 && [1, 4, 5, 6].includes(item.styleNo))
					|| (category == 4 && item.styleNo == 3)
					|| (category == 5 && [7, 10, 11, 15, 16, 17].includes(item.styleNo))
				) {
					checker = true;
				} else {
					checker = false;
				}
			}
			return checker;
		},
		vestUraziChecker(parts, category){
			var checker = true;
			if(category == 3){
				var course = this.$parent.selected.parts;
				$.each(course,function(key,item){
					if(item.code == "003" && parts.api_field == 'colorcustoms_ura_cno_normal'){
						checker = false;
					}
				});
			}
			return checker;
		},
		checkKatagamiOption: function (katagami) {
			const query = {
				headers: {
					"content-Type": "application/json;charset=UTF-8"
				},
				params: {
					katagami: katagami,

				}
			};
			var thista = this;
			axios.get("/sandbox/ajaxTool/checkKatagamiOption.php", query).then(res => {
				// console.log('型紙で使えないオプション');
				// console.log(res.data);
				Vue.set(thista, "katagamiKesuOption", {});
				$.each(res.data['kesuOption'], function (key, item) {
					Vue.set(thista.katagamiKesuOption, item['option_id'], item);
				});
				// console.log(thista.katagamiKesuOption);
			})

		},
		//型紙が対象オプションに対応しているか
		// katagamiTsukaenChecker: function (option) {
		// 	if (option.option_id in this.katagamiKesuOption) {
		// 		// console.log(option.option_name+'は対応していないので消す');
		// 		// if(this.sub == '' && option.option_id == 26 && (this.$parent.selected.sessions.ordersheet.w_adjuster1 != null && this.$parent.selected.sessions.ordersheet.w_adjuster1 != '')){
		// 		// 	console.log('w_adjuster1 消す');
		// 		// 	Vue.set(this.$parent.selected.sessions.ordersheet,'w_adjuster1',null);
		// 		// }
		// 		// if(this.sub != '' && option.option_id == 26 && (this.$parent.selected.sessions.ordersheet.w_adjuster2 != null && this.$parent.selected.sessions.ordersheet.w_adjuster2 != '')){
		// 		// 	console.log('w_adjuster2 消す');
		// 		// 	Vue.set(this.$parent.selected.sessions.ordersheet,'w_adjuster2',null);
		// 		// }
		// 		return false;
		// 	} else {
		// 		// console.log(option.option_name+'は対応している');
		// 		// if(this.sub == '' && option.option_id == 26 && (this.$parent.selected.sessions.ordersheet.w_adjuster1 == null || this.$parent.selected.sessions.ordersheet.w_adjuster1 == '')){
		// 		// 	console.log('w_adjuster1 初期値つける');
		// 		// 	Vue.set(this.$parent.selected.sessions.ordersheet,'w_adjuster1',"0");
		// 		// }
		// 		// if(this.sub != '' && option.option_id == 26 && (this.$parent.selected.sessions.ordersheet.w_adjuster2 == null || this.$parent.selected.sessions.ordersheet.w_adjuster2 == '')){
		// 		// 	console.log('w_adjuster2 初期値つける');
		// 		// 	Vue.set(this.$parent.selected.sessions.ordersheet,'w_adjuster2',"0");
		// 		// }
		// 		return true;
		// 	}
		// },
		//裏地ノーマルが選択されてなくてもDPが選択されてたらactive付けるため用
		uraziDPChecker: function (parts) {
			if (parts.api_field == 'colorcustoms_ura_cno_normal') {
				if (this.$parent.selected.sessions.ordersheet.colorcustoms_ura_cno_normal == null) {
					if (this.$parent.selected.sessions.ordersheet.colorcustoms_ura_cno == null || this.$parent.selected.sessions.ordersheet.colorcustoms_ura_cno == '0') {
						return false;
					} else {
						return true;
					}
				}
			} else {
				return false;
			}
		},
		//選択されているオプションがデフォルト値か
		defaultChecker: function (target, parts) {
			var checker = true;

			if ('optionitems' in parts) {
				if (Object.keys(parts['optionitems']).length > 0) {
					$.each(parts['optionitems'], function (key, item) {
						if (target == item['option_code']) {
							if (item['option_default'] >= 1) {
								checker = false;
							}
						}
					});
				}
			}
			return checker;
		},
		// powerChecker: function (parts) {
		// 	var checker = true;
		// 	var item = '';
		// 	var course = this.$parent.selected.parts;
		// 	$.each(course, function (key, item2) {
		// 		item = item2;
		// 	});
		// 	if (parts.api_field == 'ext_specification') {

		// 		if ((this.c3Category == 2 && (item.styleNo == 4 || item.styleNo == 5 || item.styleNo == 6 || item.styleNo == 1)) || (this.c3Category == 4 && (item.styleNo == 3)) || (this.c3Category == 5 && (item.styleNo == 11 || item.styleNo == 10 || item.styleNo == 15 || item.styleNo == 17 || item.styleNo == 16 || item.styleNo == 7))) {
		// 			checker = true;
		// 		} else {
		// 			checker = false;
		// 		}
		// 	}
		// 	return checker;
		// },
		// vestUraziChecker: function (parts) {
		// 	var checker = true;
		// 	if (this.c3Category == 3) {
		// 		var course = this.$parent.selected.parts;
		// 		$.each(course, function (key, item) {
		// 			if (item.code == "003" && parts.api_field == 'colorcustoms_ura_cno_normal') {
		// 				checker = false;
		// 			}
		// 		});
		// 		//console.log("cooooourse");
		// 		//console.log(course);
		// 		//console.log(parts);
		// 	}
		// 	return checker;
		// },
		henkankun2: function (target) {
			var result = '';
			switch (target) {
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
		nameNyuryokuChecker: function () {
			var mozi = this.$parent.selected.sessions.ordersheet.enter_name;
			var type = this.$parent.selected.sessions.ordersheet.style_name;
			if (type >= 1) {
				if (mozi == '' || mozi == null) {
					Vue.set(this.$parent, 'clickLocker', true);
					return false;
				}
			}
			Vue.set(this.$parent, 'clickLocker', false);
			return true;
		},
		koteiEnter: function () {
			setTimeout(function () {
				if ($('.koteiul').find('li.active').length <= 0) {
					$('.koteiul').find('li').eq(0).click();
				}
			}, 500)
			return true;
		},
		optionItemHiddenChecker: function (item) {
			var checker = true;
			var thista = this;
			//console.log('オプションアイテム');
			//console.log(item);

			//パワーフィットの場合は裏仕様のクロスバックは使えない
			// 52はパワーフィット　裏仕様は57
			if (item.option_id == 52) {

				if (this.$parent.selected.sessions.ordersheet.ext_specification_normal == 3 && item.option_code == 1) {
					//console.log('裏仕様がクロスバックなんでパワーフィットはつかえない');
					checker = false;
				}
			}
			//裏仕様
			if (item.option_id == 57) {
				//ゲスト系の人は出してOKなんで
				if (this.$parent.guest == false && this.$parent.katagamiNaiUser == false) {
					//裏仕様は型紙に依存するのでそのチェック
					var targetGenderNum = 1;
					if (this.$parent.selected.gender == 'women') {
						targetGenderNum = 5;
					}
					var targetUrashiyo = '';
					$.each(this.$parent.selected.katagami[targetGenderNum], function (key22, item22) {
						targetUrashiyo = item22.urashiyo;
					})
					// console.log(this.$parent.selected.katagami);
					// console.log(targetUrashiyo);
					if (targetUrashiyo.length > 0) {
						if (targetUrashiyo.indexOf(item.option_code) == -1) {
							checker = false;
						}
					} else {
						checker = false;
					}
					//クロスバックとパワーフィットのチェック
					if (this.$parent.selected.sessions.ordersheet.ext_specification == 1 && item.option_code == 3) {
						//console.log('パワーフィット適用されてるんでクロスバックはつかえない');
						checker = false;
					}
				}
			}

			//袖口本切羽がなしの場合は切羽配色のカラーは選択できない
			// 切羽配色は55 袖口本切羽は47
			// if(item.option_id == 55){
			// 	if(this.$parent.selected.sessions.ordersheet.sode_honseppa == 0 && item.option_code == 999999){
			// 		//console.log('袖口本切羽がなしになっているのでカラーは選べない');
			// 		checker = false;
			// 	}
			// }

			// if(item.option_id == 47){
			// 	if(this.$parent.selected.sessions.ordersheet.colorcustoms_seppa_hall_normal == 999999 && item.option_code == 0){
			// 		//console.log('切羽配色がカラーになっているので袖口本切羽を無しにはできない');
			// 		alert('袖口本切羽を無しにする場合は、切羽配色を[表地と同色]にしてください');
			// 		checker = false;
			// 	}
			// }

			//期限チェックはsc_helper_optionでやってる
			//工場チェック
			if (item.option_factory != "" && item.option_factory != null) {
				var factoryList = [];
				if (item.option_factory.indexOf(",") > -1) {
					factoryList = item.option_factory.split(",");
				} else {
					factoryList[0] = item.option_factory;
				}

				$.each(factoryList, function (key2, item2) {
					if (item2 == thista.$parent.selectedProductData.factory) {
						//console.log("工場だめ："+item.item_id);
						checker = false;
						return false;
					}
				});
			}
			//スーティストチェック
			if (item.option_tq == "1") {
				if (thista.$parent.selected.suitist) {

				} else {
					//console.log(thista.$parent.selected.suitist);
					//console.log("スーティストではないから出さない："+item.item_id);
					checker = false;
				}
			}
			return checker;
		},
		//カテゴリで表示しないオプションチェック（カラーのやつとか）
		// hiddenChecker: function (target) {
		// 	// 表示チェックされている箇所チェック
		// 	targetCate = this.c3Category;
		// 	// なんかべストとパンツ逆番号で登録されているんで直す…
		// 	if (targetCate == 3) {
		// 		targetCate = 4;
		// 	} else if (targetCate == 4) {
		// 		targetCate = 3;
		// 	}
		// 	if (target.option_item.indexOf('' + targetCate) < 0) {
		// 		return false;
		// 	}



		// 	// その他固定でけすやつ
		// 	targetarray = [];
		// 	if (this.$parent.selected.sessions.ordersheet.washable == 1) {
		// 		targetarray.push('w_adjuster');
		// 		targetarray.push('daiba');
		// 		Vue.set(this.$parent.selected.sessions.ordersheet, 'w_adjuster1', null);
		// 		Vue.set(this.$parent.selected.sessions.ordersheet, 'w_adjuster2', null);
		// 	}
		// 	targetarray.push('colorcustoms_seppa_hall');
		// 	targetarray.push('change_pocket');
		// 	targetarray.push('colorcustoms_amf_stitch');
		// 	targetarray.push('colorcustoms_flower_hall');
		// 	targetarray.push('colorcustoms_ura_cno');
		// 	targetarray.push('colorcustoms_button_cno');
		// 	targetarray.push('colorcustoms_color_cross');
		// 	targetarray.push('mackin_width');
		// 	targetarray.push('digital_name');
		// 	targetarray.push('washable');
		// 	targetarray.push('style_name');
		// 	var activer = $('.selector_design__category ul li').index('.selector_design__category ul li.buttons-line');
		// 	// console.log(this.selectCourse);
		// 	if ((this.selectCourse != 3 && this.selectCourse != 2 && ((this.selectCourse == 13 && this.sub != '') || this.selectCourse != 13) && ((this.selectCourse == 12 && this.sub != '') || this.selectCourse != 12) && this.selectCourse != 8 && (this.c3Category != 2 && this.c3Category != 5))) {
		// 		targetarray.push('button_cno');
		// 	}
		// 	if (targetarray.indexOf(target.api_field) > -1) {
		// 		return false;
		// 	}
		// 	if (target.api_field == 'daiba' && this.$parent.selected.sessions.ordersheet.daiba == null) {
		// 		Vue.set(this.$parent.selected.sessions.ordersheet, 'daiba', '0');
		// 	}
		// 	return true;
		// },
		//カテゴリで表示しないオプションチェック型紙ないユーザ用
		// hiddenChecker2: function (target) {
		// 	// 表示チェックされている箇所チェック
		// 	targetCate = this.c3Category;
		// 	// なんかべストとパンツ逆番号で登録されているんで直す…
		// 	if (targetCate == 3) {
		// 		targetCate = 4;
		// 	} else if (targetCate == 4) {
		// 		targetCate = 3;
		// 	}
		// 	if (target.option_item.indexOf('' + targetCate) < 0) {
		// 		return false;
		// 	}



		// 	// その他固定でけすやつ
		// 	targetarray = [];
		// 	if (this.$parent.selected.sessions.ordersheet.washable == 1) {
		// 		targetarray.push('w_adjuster');
		// 		targetarray.push('daiba');
		// 		Vue.set(this.$parent.selected.sessions.ordersheet, 'w_adjuster1', null);
		// 		Vue.set(this.$parent.selected.sessions.ordersheet, 'w_adjuster2', null);
		// 	}
		// 	targetarray.push('colorcustoms_seppa_hall');
		// 	targetarray.push('change_pocket');
		// 	targetarray.push('colorcustoms_amf_stitch');
		// 	targetarray.push('colorcustoms_flower_hall');
		// 	targetarray.push('colorcustoms_ura_cno');
		// 	targetarray.push('colorcustoms_button_cno');
		// 	targetarray.push('colorcustoms_color_cross');
		// 	targetarray.push('mackin_width');
		// 	targetarray.push('digital_name');
		// 	targetarray.push('washable');
		// 	targetarray.push('style_name');
		// 	if ((this.selectCourse != 3 && this.selectCourse != 2 && ((this.selectCourse == 13 && this.sub != '') || this.selectCourse != 13) && ((this.selectCourse == 12 && this.sub != '') || this.selectCourse != 12) && this.selectCourse != 8 && (this.c3Category != 2 && this.c3Category != 5))) {
		// 		targetarray.push('button_cno');
		// 	}
		// 	if (targetarray.indexOf(target.api_field) > -1) {
		// 		return false;
		// 	}
		// 	return true;
		// },
		katagamiIzonChecker(parts, optionCate) {
			if (optionCate == 'hyoujunOption' && parts.katagami_flg == 1) {
				return false;
			} else if (optionCate == 'fabricOption' && parts.katagami_flg == 1) {
				return false;
			} else {
				return true;
			}
		},
		selectedOptionCodeKotei(kotei) {
			var targetSessionCode = kotei;
			var targetSessionCodePlus = kotei;
			var result = "";
			if ((this.c3Category == 6 || this.c3Category == 7 || this.c3Category == 4) && this.sub == "") {
				targetSessionCodePlus = targetSessionCode + "1";
			} else if ((this.c3Category == 6 || this.c3Category == 7 || this.c3Category == 4) && this.sub != "") {
				targetSessionCodePlus = targetSessionCode + "2";
			}
			if (targetSessionCodePlus in this.$parent.selected.sessions.ordersheet) {
				result = this.$parent.selected.sessions.ordersheet[targetSessionCodePlus];
			} else {
				result = this.$parent.selected.sessions.ordersheet[targetSessionCode];
			}
			//console.log("selectedOptionCode("+kotei+"):"+result);
			if (result == null) {
				result = 0;
			}
			return result;
		},
		//カテゴリの１と２わかれるのチェックのために
		api_fielder: function (parts) {
			var targetSessionCode = parts.api_field;
			var targetSessionCodePlus = parts.api_field;
			var result = "";
			if ((this.c3Category == 6 || this.c3Category == 7 || this.c3Category == 4) && this.sub == "") {
				targetSessionCodePlus = targetSessionCode + "1";
			} else if ((this.c3Category == 6 || this.c3Category == 7 || this.c3Category == 4) && this.sub != "") {
				targetSessionCodePlus = targetSessionCode + "2";
			}

			if (targetSessionCodePlus in this.$parent.selected.sessions.ordersheet) {
				result = targetSessionCodePlus;
			} else {
				result = targetSessionCode;
			}
			return result;
		},
		//カテゴリ一覧にて選択されている子アイテムを取得
		selectedItemCheck: function (type, key, sessionId) {
			if (this.optionData != '') {
				if (type == 'hyoujunOption' && key == 48) {

				}
				if (type in this.optionData) {
					if (key in this.optionData[type]) {
						if ('optionitems' in this.optionData[type][key]) {
							var options = this.optionData[type][key].optionitems;
							// var targetOption = "該当なし："+key+":"+sessionId;
							var targetOption = "";
							$.each(options, function (key2, item2) {
								if (item2.option_code == sessionId) {
									targetOption = item2;
									return false;
								}
							});
							//console.log(targetOption);
							if (type == 'hyoujunOption' && key == 48 && targetOption == "") {
								if (65 in this.optionData['AllAll']) {
									if ('optionitems' in this.optionData['AllAll'][65]) {
										var options = this.optionData['AllAll'][65].optionitems;
										var sessionId = this.$parent.selected.sessions.ordersheet.colorcustoms_ura_cno;
										$.each(options, function (key2, item2) {
											if (item2.option_code == sessionId) {
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
		c3CateChanger: function (target, sub) {
			if (this.$parent.clickLocker == false) {
				this.disp = 1;
				if (sub != "") {
					this.sub = sub;
					Vue.set(this.$parent.selected, 'optionSub', sub);
					// this.$parent.sub = sub;
					//console.log("２枚目のものを選択");
					//console.log(this.sub);

				} else {
					this.sub = "";
					Vue.set(this.$parent.selected, 'optionSub', '');
					// this.$parent.sub = sub;
				}
				this.c3Category = target;
				Vue.set(this.$parent, 'optionC3Category', this.henkankun2(target));
				//console.log("表示するオプションカテゴリーを変更した:"+target);
				var target2;
				if (target == "2") {
					target2 = "1";
				} else if (target == "3") {
					target2 = '2'
				} else if (target == "4") {
					target2 = '3'
				}
				var targetParts = target2 + sub;
				if (Object.keys(this.$parent.selected.katagami[targetParts]).length >= 1) {
					// console.log('対象の箇所');
					var targetKatagamiOptions = {};
					$.each(this.$parent.selected.katagami[targetParts], function (key, item) {
						targetKatagamiOptions = item;
					});
					// console.log(targetParts);
					// console.log(targetKatagamiOptions);
					this.checkKatagamiOption(JSON.stringify(targetKatagamiOptions));
				}

			} else {
				alert('入力されていない項目があります。お確かめください。');
			}
		},
		backs: function () {
			if (this.$parent.clickLocker == false) {
				this.disp = 1;
			} else {
				alert('入力されていない項目があります。お確かめください。');
			}
		},
		partsClicker: function (target, type, event, apifield, inputtype) {
			if (apifield === null || apifield == "") {
				alert("こちらのオプションはapi_fieldが設定されていないため使えません。");
			} else {
				this.selectedCategory = target;
				this.selectedOptionType = type;
				this.targetApiField = apifield;
				this.inputtype = inputtype;
				this.disp = 2;
				//console.log("選択されたオプションカテゴリ：");
				//console.log(this.targetApiField);
				//console.log(this.selectedOptionType);
				//console.log(this.selectedCategory);
				//console.log(this.optionData);
				//console.log(this.optionData[this.selectedOptionType][this.selectedCategory]);
			}
		},
		// selectOption: function (option) {
		// 	// Vue.set(this.$parent.selected.options,option.option_id,{});
		// 	// Vue.set(this.$parent.selected.options[option.option_id],option.item_id,option);
		// 	// Vue.set(this.$parent.selected.sessions[option.option_id],option.item_id,option);
		// 	//console.log(this.c3Category);

		// 	var targetSessionCode = this.optionData[this.selectedOptionType][this.selectedCategory].api_field;
		// 	var targetSessionCodePlus = this.optionData[this.selectedOptionType][this.selectedCategory].api_field;
		// 	if ((this.c3Category == 6 || this.c3Category == 7 || this.c3Category == 4) && this.sub == "") {
		// 		targetSessionCodePlus = targetSessionCode + "1";
		// 	} else if ((this.c3Category == 6 || this.c3Category == 7 || this.c3Category == 4) && this.sub != "") {
		// 		targetSessionCodePlus = targetSessionCode + "2";
		// 	}
		// 	if (targetSessionCodePlus in this.$parent.selected.sessions.ordersheet) {
		// 		Vue.set(this.$parent.selected.sessions.ordersheet, targetSessionCodePlus, option.option_code);
		// 	} else {
		// 		Vue.set(this.$parent.selected.sessions.ordersheet, targetSessionCode, option.option_code);
		// 	}
		// 	var thista = this;
		// 	setTimeout(function () {
		// 		thista.checkOptionCourse();
		// 	}, 500);
		// 	//console.log("オプションが変更・追加されました");
		// 	//console.log(this.$parent.selected.sessions);
		// },
		selectOptionWomenButtonNormal: function (option) {
			//console.log(this.c3Category);
			Vue.set(this.$parent.selected.sessions.ordersheet, 'colorcustoms_button_cno', null);
			var targetSessionCode = this.optionData[this.selectedOptionType][this.selectedCategory].api_field;
			var targetSessionCodePlus = this.optionData[this.selectedOptionType][this.selectedCategory].api_field;
			if ((this.c3Category == 6 || this.c3Category == 7 || this.c3Category == 4) && this.sub == "") {
				targetSessionCodePlus = targetSessionCode + "1";
			} else if ((this.c3Category == 6 || this.c3Category == 7 || this.c3Category == 4) && this.sub != "") {
				targetSessionCodePlus = targetSessionCode + "2";
			}
			if (targetSessionCodePlus in this.$parent.selected.sessions.ordersheet) {
				Vue.set(this.$parent.selected.sessions.ordersheet, targetSessionCodePlus, option.option_code);
			} else {
				Vue.set(this.$parent.selected.sessions.ordersheet, targetSessionCode, option.option_code);
			}
			var thista = this;
			setTimeout(function () {
				thista.checkOptionCourse();
			}, 500);
			//console.log("オプションが変更・追加されました");
			//console.log(this.$parent.selected.sessions);
		},
		selectOptionWomenButton: function (option) {
			//console.log(this.c3Category);

			var targetSessionCode = "colorcustoms_button_cno";
			var targetSessionCodePlus = "colorcustoms_button_cno";
			if ((this.c3Category == 6 || this.c3Category == 7 || this.c3Category == 4) && this.sub == "") {
				targetSessionCodePlus = targetSessionCode + "1";
			} else if ((this.c3Category == 6 || this.c3Category == 7 || this.c3Category == 4) && this.sub != "") {
				targetSessionCodePlus = targetSessionCode + "2";
			}
			if (targetSessionCodePlus in this.$parent.selected.sessions.ordersheet) {
				Vue.set(this.$parent.selected.sessions.ordersheet, targetSessionCodePlus, option.option_code);
				Vue.set(this.$parent.selected.sessions.ordersheet, 'button_cno', option.option_code);
			} else {
				Vue.set(this.$parent.selected.sessions.ordersheet, targetSessionCode, option.option_code);
				Vue.set(this.$parent.selected.sessions.ordersheet, 'button_cno', option.option_code);
			}
			var thista = this;
			setTimeout(function () {
				thista.checkOptionCourse();
			}, 500);
			//console.log("オプションが変更・追加されました");
			//console.log(this.$parent.selected.sessions);
		},
		selectOptionPocket: function (option) {
			// Vue.set(this.$parent.selected.options,option.option_id,{});
			// Vue.set(this.$parent.selected.options[option.option_id],option.item_id,option);
			// Vue.set(this.$parent.selected.sessions[option.option_id],option.item_id,option);
			//console.log(this.c3Category);

			var targetSessionCode = this.optionData[this.selectedOptionType][this.selectedCategory].api_field;
			var targetSessionCodePlus = this.optionData[this.selectedOptionType][this.selectedCategory].api_field;
			if ((this.c3Category == 6 || this.c3Category == 7 || this.c3Category == 4) && this.sub == "") {
				targetSessionCodePlus = targetSessionCode + "1";
			} else if ((this.c3Category == 6 || this.c3Category == 7 || this.c3Category == 4) && this.sub != "") {
				targetSessionCodePlus = targetSessionCode + "2";
			}

			Vue.set(this.$parent.selected.sessions.ordersheet, targetSessionCodePlus, option.option_code);


			//ポケット
			if (option.option_code == '2') {
				//console.log('チェンジポケットを有効化');
				Vue.set(this.$parent.selected.sessions.ordersheet, 'change_pocket', 1);
			} else {
				//console.log('チェンジポケットをnullに');
				Vue.set(this.$parent.selected.sessions.ordersheet, 'change_pocket', null);
			}
			//ポケット
			if (option.option_code == '1') {
				//console.log('パッチポケットを有効化');
				Vue.set(this.$parent.selected.sessions.ordersheet, 'patch_pocket', 1);
			} else {
				//console.log('パッチポケットをnullに');
				Vue.set(this.$parent.selected.sessions.ordersheet, 'patch_pocket', null);
			}

			var thista = this;
			setTimeout(function () {
				thista.checkOptionCourse();
			}, 500);
			//console.log("オプションが変更・追加されました");
			//console.log(this.$parent.selected.sessions);
		},
		selectOptionItem(item, option, design) {
			const apiFieldName = this.getApiFieldName(option.api_field, design);
			if (apiFieldName) {
				if (apiFieldName == 'colorcustoms_ura_cno_normal') {
					const urazino = parseInt(item.option_code);
					if (urazino >= 301) {
						Vue.set(this.$parent.selected.sessions.ordersheet, "colorcustoms_ura_cno", item.option_code);
					} else {
						Vue.set(this.$parent.selected.sessions.ordersheet, apiFieldName, item.option_code);
					}
					if(!(urazino >= 301 && urazino <= 310)){
						Vue.set(this.$parent.selected.sessions.ordersheet,'digital_name','');
					}
				} else if (apiFieldName == 'customselect_pocket') {
					Vue.set(this.$parent.selected.sessions.ordersheet, apiFieldName, item.option_code);
					if (item.option_code == '2') {
						Vue.set(this.$parent.selected.sessions.ordersheet, "change_pocket", 1);
					} else {
						Vue.set(this.$parent.selected.sessions.ordersheet, "change_pocket", null);
					}
					if (item.option_code == '1') {
						Vue.set(this.$parent.selected.sessions.ordersheet, "patch_pocket", 1);
					} else {
						Vue.set(this.$parent.selected.sessions.ordersheet, "patch_pocket", null);
					}
				} else {
					Vue.set(this.$parent.selected.sessions.ordersheet, apiFieldName, item.option_code);
					if (option.api_field == 'suso_d' && item.option_code == 2) {
						const items = this.mackinOptionList();
						if (items[0]) {
							setTimeout(() => {
								this.selectSizeItem(null, design, items[0]);
							}, 10);
						}
					}
				}
			}

			setTimeout(() => {
				this.checkOptionCourse();
			}, 500);

			// console.log('OPTION_CODE', item.option_code, apiFieldName, design);
			// console.log('ORDERSHEET', JSON.parse(JSON.stringify(this.$parent.selected.sessions.ordersheet)));
		},
		selectOptionKotei: function (option, kotei) {
			// Vue.set(this.$parent.selected.options,option.option_id,{});
			// Vue.set(this.$parent.selected.options[option.option_id],option.item_id,option);
			// Vue.set(this.$parent.selected.sessions[option.option_id],option.item_id,option);
			//console.log(this.c3Category);

			var targetSessionCode = kotei;
			var targetSessionCodePlus = kotei;
			if ((this.c3Category == 6 || this.c3Category == 7 || this.c3Category == 4) && this.sub == "") {
				targetSessionCodePlus = targetSessionCode + "1";
			} else if ((this.c3Category == 6 || this.c3Category == 7 || this.c3Category == 4) && this.sub != "") {
				targetSessionCodePlus = targetSessionCode + "2";
			}
			if (targetSessionCodePlus in this.$parent.selected.sessions.ordersheet)  {
				Vue.set(this.$parent.selected.sessions.ordersheet, targetSessionCodePlus, option.option_code);
			} else {
				Vue.set(this.$parent.selected.sessions.ordersheet, targetSessionCode, option.option_code);
			}
			var thista = this;
			setTimeout(function () {
				thista.checkOptionCourse();
			}, 500);
			//console.log("オプションが変更・追加されました");
			//console.log(this.$parent.selected.sessions);
		},
		ivModalOpen: function (target, type) {
			Vue.set(this.$parent, "imageAndVideoModalFlg", true);
			Vue.set(this.$parent, "ivModalType", type);
			if (type == "image") {
				Vue.set(this.$parent, "modalImage", target);
			} else if (type == "video") {
				Vue.set(this.$parent, "modalVideo", target);
			}
		},
		isMenPantsAndNotWashable(pants, wrist) {
			const gender = this.$parent.selected.gender;
			const designs = this.selectCourseZenbu.designParts;
			const wristAdjuster = this.$parent.selected.sessions.ordersheet[wrist];
			const washable = this.$parent.selected.sessions.ordersheet.washable;
			return (
				gender == 'men'
				&& designs.includes(pants)
				&& (wristAdjuster == null || wristAdjuster == '')
				&& washable != 1
			)
		},
		isPantsAndWristAdjuster() {
			const designs = this.selectCourseZenbu.designParts;
			const wristAdjuster = this.$parent.selected.sessions.ordersheet[wrist];
			return (
				designs.includes(pants)
				&& wristAdjuster != null
				&& wristAdjuster != ''
			);
		},
		getOptions: function (kumiawaseId, gender) {
			var gb = "";
			if (this.$parent.selected.gb) {
				gb = 1;
			}
			var katagami = {};
			//console.log(this.$parent.selected.course);
			$.each(this.$parent.selected.course, function (key, item) {
				if (Object.keys(item).length > 0) {
					//console.log("型紙検知："+key);
					$.each(item, function (key2, item2) {
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
					katagami: katagami,
					gender: gender,
					katagamiNaiUser: this.$parent.katagamiNaiUser,
					parts: this.$parent.selected.parts,
					factory: this.$parent.selectedProductData.factory,
					gb: gb,
				}
			};
			var thista = this;
			return new Promise(function (resolve, reject) {
				axios.get("/sandbox/ajaxTool/getOptionKumiawase.php", query).then(res => {
					// console.log('オプションデータ');
					// console.log(res.data);
					thista.optionData = res.data;
					thista.$parent.optionData = res.data;
					thista.optionLoad = true;
					// console.log('thista.$parent.optionData', JSON.parse(JSON.stringify(thista.$parent.optionData)));
					// console.log('thista.selectCourseZenbu', thista.selectCourseZenbu);
					if (26 in thista.optionData.mazemaze) {
						if (thista.isMenPantsAndNotWashable('pants', 'w_adjuster1')) {
							Vue.set(thista.$parent.selected.sessions.ordersheet, 'w_adjuster1', "0");
						}
						if (thista.isMenPantsAndNotWashable('pants2', 'w_adjuster2')) {
							Vue.set(thista.$parent.selected.sessions.ordersheet, 'w_adjuster2', "0");
						}
						// // console.log('ウェストアジャスタ含まれてるんで初期値０つける');
						// if (thista.$parent.selected.gender == 'men' && thista.selectCourseZenbu.designParts.indexOf('pants') && (thista.$parent.selected.sessions.ordersheet.w_adjuster1 == null || thista.$parent.selected.sessions.ordersheet.w_adjuster1 == '') && thista.$parent.selected.sessions.ordersheet.washable != 1) {
						// 	Vue.set(thista.$parent.selected.sessions.ordersheet, 'w_adjuster1', "0");
						// }
						// if (thista.$parent.selected.gender == 'men' && thista.selectCourseZenbu.designParts.indexOf('pants2') && (thista.$parent.selected.sessions.ordersheet.w_adjuster2 == null || thista.$parent.selected.sessions.ordersheet.w_adjuster2 == '') && thista.$parent.selected.sessions.ordersheet.washable != 1) {
						// 	Vue.set(thista.$parent.selected.sessions.ordersheet, 'w_adjuster2', "0");
						// }
					} else {
						if (thista.isPantsAndWristAdjuster('pants', 'w_adjuster1')) {
							Vue.set(thista.$parent.selected.sessions, 'w_adjuster1', null);
						}
						if (thista.isPantsAndWristAdjuster('pants2', 'w_adjuster2')) {
							Vue.set(thista.$parent.selected.sessions, 'w_adjuster2', null);
						}
						// // console.log('ウェストアジャスタ含まれてないんでnullに');
						// if (thista.selectCourseZenbu.designParts.indexOf('pants') && (thista.$parent.selected.sessions.w_adjuster1 != null && thista.$parent.selected.sessions.w_adjuster1 != '')) {
						// 	Vue.set(thista.$parent.selected.sessions, 'w_adjuster1', null);
						// }
						// if (thista.selectCourseZenbu.designParts.indexOf('pants2') && (thista.$parent.selected.sessions.w_adjuster2 != null && thista.$parent.selected.sessions.w_adjuster2 != '')) {
						// 	Vue.set(thista.$parent.selected.sessions, 'w_adjuster2', null);
						// }
					}
					resolve('ok');
				})
			})
		},
		// index.jsにもある　両方修正せよ
		checkOptionCourse: function () {
			//console.log("checkOptionCourse");
			//console.log(this.optionData);
			const query = {
				headers: {
					"content-Type": "application/json;charset=UTF-8"
				},
				params: {
					sessions: JSON.stringify(this.$parent.selected.sessions.ordersheet),
					factory: this.$parent.selectedProductData.factory,
					gender: this.$parent.selected.gender,
					gb: this.$parent.selected.gb,
					selectedOptionset: this.optionData.fabricOptionSetId,
					fabricTourokuOption: this.$parent.selectedProductData.specification
				}
			};
			var thista = this;
			axios.get("/sandbox/ajaxTool/getOptionCourse.php", query).then(res => {
				// console.log(res.data);
				data = res.data;
				Vue.set(thista.$parent.selected.code, "optionCourse", data);
				Vue.set(thista.$parent.selected.sessions.ordersheet, 'course_no', data);
				// console.log("オプションコース特定した selected.code.optionCourse："+thista.$parent.selected.code.optionCourse);
				if (thista.$parent.selected.sessions.ordersheet.course_no != 'none' && thista.$parent.selected.sessions.ordersheet.course_no != '' && thista.$parent.selected.sessions.ordersheet.course_no != null) {
					// console.log('optioncourseチェック');
					// console.log(thista.$parent.selected.sessions.ordersheet.course_no);
					thista.$parent.getOptionCourseDetail(thista.$parent.selected.sessions.ordersheet.course_no);
				}
			})
		},
		optionNaiChecker: function () {
			var dame = [];
			var thista = this;
			// console.log(this.wanted);
			$.each(this.wanted, function (key, item) {
				// console.log(item);
				if (thista.$parent.selected.sessions.ordersheet[item.api_field] == '' || thista.$parent.selected.sessions.ordersheet[item.api_field] == null) {
					if (key == 'colorcustoms_ura_cno_normal') {
						if (thista.$parent.selected.sessions.ordersheet.colorcustoms_ura_cno == null || thista.$parent.selected.sessions.ordersheet.colorcustoms_ura_cno == '0') {
							dame.push(item.name);
						} else {
							// console.log('裏地はDPのものをつかっている');
						}
					} else {
						dame.push(item.name);
					}

				}
			});
			if (dame.length > 0) {
				var string = '';
				$.each(dame, function (key, item) {
					string = string + item + 'を選択してください\n';
				});
				alert(string);
				Vue.set(this.$parent, 'step', 5);
			}
		},
		async getOptionsData() {
			const katagami = {};
			Object.entries(this.katagami).forEach(([key, value]) => {
				if (value) {
					katagami[key] = value.pattern_id;
				}
			})

			const query = {
				headers: {
					"content-Type": "application/json;charset=UTF-8"
				},
				params: {
					kumiawaseId: this.$parent.selectedProductData.type,
					katagami: katagami,
					gender: this.$parent.selected.gender,
					katagamiNaiUser: this.$parent.katagamiNaiUser,
					parts: this.$parent.selected.parts,
					factory: this.$parent.selectedProductData.factory,
					gb: this.$parent.selected.gb ? 1 : '',
				}
			};
			try {
				const result = await axios.get("/sandbox/ajaxTool/getOptionKumiawase.php", query);

				if (!result.data) throw new Error('Error');
				this.$parent.optionData = result.data;
				this.optionData = result.data;

				if (26 in this.$parent.optionData.mazemaze) {
					if (this.isMenPantsAndNotWashable('pants', 'w_adjuster1')) {
						Vue.set(this.$parent.selected.sessions.ordersheet, 'w_adjuster1', "0");
					}
					if (this.isMenPantsAndNotWashable('pants2', 'w_adjuster2')) {
						Vue.set(this.$parent.selected.sessions.ordersheet, 'w_adjuster2', "0");
					}
				} else {
					if (this.isPantsAndWristAdjuster('pants', 'w_adjuster1')) {
						Vue.set(this.$parent.selected.sessions, 'w_adjuster1', null);
					}
					if (this.isPantsAndWristAdjuster('pants2', 'w_adjuster2')) {
						Vue.set(this.$parent.selected.sessions, 'w_adjuster2', null);
					}
				}

				return true;
			} catch(error) {
				return false;
			}
		},
		updateKitagami() {
			this.katagami = {};
			Object.entries(this.$parent.selected.course).forEach(([key, katagami]) => {
				Object.values(katagami).forEach(value => {
					this.katagami[key] = value;
				});
			});
		},
		async getKatagamiOption(katagami) {
			const query = {
				headers: {
					"content-Type": "application/json;charset=UTF-8"
				},
				params: { katagami }
			};

			try {
				const result = await axios.get("/sandbox/ajaxTool/checkKatagamiOption.php", query);

				if (!result.data) throw new Error('Error');
				return result.data;
			} catch(error) {
				return null;
			}
		},
		async processKitagami() {
			this.katagamiKesuOption = {}
			for (const [key, value] of Object.entries(this.katagami)) {
				const result = await this.getKatagamiOption(JSON.stringify(value));
				if (result) {
					Object.values(result['kesuOption']).forEach(item => {
						this.katagamiKesuOption[item['option_id']] = item;
					});
				}
			}
			// console.log('this.katagamiKesuOption::::::::::', JSON.parse(JSON.stringify(this.katagamiKesuOption)));
		},
		updateMkPro() {
			const mk1 = this.$parent.selected.sessions.ordersheet.mackin_width1 ?? 0;
			const mk2 = this.$parent.selected.sessions.ordersheet.mackin_width2 ?? 0;

			let mk1pro = '';
			let mk2pro = '';
			Object.values(this.mackinOptionData.optionitems).forEach(item => {
				if (item.option_code == mk1) mk1pro = item;
				else if (item.option_code == mk2) mk2pro = item;
			});
			this.selectSentakuMackin1 = mk1pro;
			this.selectSentakuMackin2 = mk2pro;
		},
		checkEriflg() {
			let eriFlg = false;
			if (this.$parent.selected.gender == 'men') {
				if (Object.keys(this.$parent.selected.katagami[1]).length > 0) {
					$.each(this.$parent.selected.katagami[1], function (key, item) {
						if (42 in item.option_id) {
							eriFlg = true;
						}
					});
				}
			} else {
				if (Object.keys(this.$parent.selected.katagami[5]).length > 0) {
					$.each(this.$parent.selected.katagami[5], function (key, item) {
						if (42 in item.option_id) {
							eriFlg = true;
						}
					});
				}
			}
			if (this.$parent.guest == true) {
				eriFlg = true;
			}
			if (eriFlg == true && this.$parent.selected.sessions.ordersheet['sh_eri'] == null) {
				Vue.set(this.$parent.selected.sessions.ordersheet, 'sh_eri', 1);
			} else if (eriFlg == false) {
				Vue.set(this.$parent.selected.sessions.ordersheet, 'sh_eri', null);
			}
		},
		addWanteded() {
			let wanted = {};
			console.log('js__data_target', $('.simulator__option__wrap .js__data_target'));
			$('.simulator__option__wrap .js__data_target').each((key, item) => {
				if (this.$parent.selected.gender == 'men' && $(item).attr('data-target') == 2) {
					wanted['colorcustoms_flower_hall_normal'] = { 'api_field': 'colorcustoms_flower_hall_normal', 'name': 'フラワーホール' };
					wanted['colorcustoms_seppa_hall_normal'] = { 'api_field': 'colorcustoms_seppa_hall_normal', 'name': '切羽配色' };
				}
				if ($(item).attr('data-target') == 2 || $(item).attr('data-target') == 3 || $(item).attr('data-target') == 4 || $(item).attr('data-target') == 5 || $(item).attr('data-target') == 6) {
					wanted['button_cno'] = { 'api_field': 'button_cno', 'name': 'ボタン' };
				}
				if ($(item).attr('data-target') == 2 || $(item).attr('data-target') == 5 || $(item).attr('data-target') == 3) {
					wanted['colorcustoms_ura_cno_normal'] = { 'api_field': 'colorcustoms_ura_cno_normal', 'name': '裏地' };
				};
			});

			Vue.set(this, 'wanted', wanted);
		},
		updateHalls() {
			if (!this.$parent.selected.sessions.ordersheet['colorcustoms_flower_hall_normal']) {
				Vue.set(this.$parent.selected.sessions.ordersheet, 'colorcustoms_flower_hall_normal', '00');
				Vue.set(this.$parent.selected.sessions.ordersheet, 'flower_hall', '00');
			}
			if (!this.$parent.selected.sessions.ordersheet['colorcustoms_seppa_hall_normal']) {
				Vue.set(this.$parent.selected.sessions.ordersheet, 'colorcustoms_seppa_hall_normal', '00');
				Vue.set(this.$parent.selected.sessions.ordersheet, 'seppa_hall', '00');
			}

            if ("colorcustoms_amf_stitch_normal" in this.$parent.selected.sessions.ordersheet) {
                if (this.$parent.selected.sessions.ordersheet.colorcustoms_amf_stitch_normal != "0" && this.$parent.selected.sessions.ordersheet.colorcustoms_amf_stitch_normal != null) {
                    amf = true;
					Vue.set(this.$parent.selected.sessions.ordersheet, "amf_stitch", (parseFloat(this.$parent.selected.sessions.ordersheet.colorcustoms_amf_stitch) || 0) + parseFloat(this.$parent.selected.sessions.ordersheet.colorcustoms_amf_stitch_normal));
                } else {
					Vue.set(this.$parent.selected.sessions.ordersheet, "colorcustoms_amf_stitch", "");
					Vue.set(this.$parent.selected.sessions.ordersheet, "amf_stitch", "0");
				}
            }
		}
	},
	async mounted () {
		Vue.set(this.$parent, 'loading', true);
		this.updateKitagami();
		this.optionData = this.$parent.optionData;
		await this.processKitagami();

		this.updateMkPro();
		this.checkEriflg();
		this.setUradpColorOption();

		Vue.set(this.$parent, 'loading', false);
		this.optionLoad = true;

		Vue.nextTick(() => {
			setTimeout(() => {
				this.updateHalls();
				this.addWanteded();
			}, 500);
		});

		console.log('ORDERSHEET::OPTIONS', JSON.parse(JSON.stringify(this.$parent.selected.sessions.ordersheet)));
	},
	beforeDestroy: function () {
		if (this.$parent.step > 5) {
			this.optionNaiChecker();
		}
		// Vue.set(this.$parent,'view2','');
	}

};
</script>