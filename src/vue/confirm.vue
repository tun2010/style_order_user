<template lang="pug">
	div.simulator__selector.simulator__page_confirm
		div.top_placehilder
		div.confirm_scroll_container(v-if="productDataLoad && masterDataLoad")

			div.title_container.margin_block_start
				span.size_title 注文内容確認

			div.option_modal__group
				div.option_modal__header_group
					h4.header_title 生地
					button.buttons.buttons-small.icon-end(v-on:click="stepChanger(1)") 変更する
				div.label_value_group
					div.label_name 生地
					div.data_value {{selectedFabricer.product_code_min}} / {{selectedFabricer.name}}
				div.label_value_group
					div.label_name 生地特性
					div.data_value {{kizitokusei}}

			div.option_modal__group
				div.option_modal__header_group
					h4.header_title コース
					button.buttons.buttons-small.icon-end(v-on:click="stepChanger(2)") 変更する
				div.label_value_group
					div.label_name コース
					div.data_value {{selected02}}

			div.option_modal__group
				div.option_modal__header_group
					h4.header_title デザイン
					button.buttons.buttons-small.icon-end(v-on:click="stepChanger(3)") 変更する

				div.label_value_group(v-if="$parent.selected.sessions.ordersheet.jacket_dno != null && $parent.selected.sessions.ordersheet.jacket_dno != '' && selectparts.indexOf('jacket') > -1")
					div.label_name ジャケット
					div.data_value {{$parent.selected.sessions.ordersheet.jacket_dno}}
				div.label_value_group(v-if="$parent.selected.sessions.ordersheet.slacks_dno1 != null && $parent.selected.sessions.ordersheet.slacks_dno1 != '' && selectparts.indexOf('pants') > -1")
					div.label_name スラックス
					div.data_value {{$parent.selected.sessions.ordersheet.slacks_dno1}}
				div.label_value_group(v-if="$parent.selected.sessions.ordersheet.slacks_dno2 != null && $parent.selected.sessions.ordersheet.slacks_dno2 != '' && selectparts.indexOf('pants2') > -1")
					div.label_name スラックス(２本目)
					div.data_value {{$parent.selected.sessions.ordersheet.slacks_dno2}}
				div.label_value_group(v-if="$parent.selected.sessions.ordersheet.best_dno != null && $parent.selected.sessions.ordersheet.best_dno != '' && selectparts.indexOf('vest') > -1")
					div.label_name ベスト
					div.data_value {{$parent.selected.sessions.ordersheet.best_dno}}
				div.label_value_group(v-if="$parent.selected.sessions.ordersheet.wo_sk_d1 != null && $parent.selected.sessions.ordersheet.wo_sk_d1 != '' && selectparts.indexOf('skirt') > -1")
					div.label_name スカート
					div.data_value {{$parent.selected.sessions.ordersheet.wo_sk_d1}}
				div.label_value_group(v-if="$parent.selected.sessions.ordersheet.wo_sk_d2 != null && $parent.selected.sessions.ordersheet.wo_sk_d2 != '' && selectparts.indexOf('skirt2') > -1")
					div.label_name スカート(２枚目)
					div.data_value {{$parent.selected.sessions.ordersheet.wo_sk_d2}}

			div.option_modal__group
				div.option_modal__header_group
					h4.header_title サイズ
					button.buttons.buttons-small.icon-end(v-on:click="stepChanger(4)") 変更する

				div.size_table_group(v-if="$parent.selected.sessions.ordersheet.jacket_dno != null && $parent.selected.sessions.ordersheet.jacket_dno != '' && selectparts.indexOf('jacket') > -1")
					div.size_table_row
						div.table_header.table_header__start
							span ジャケット
							strong {{$parent.selected.sessions.ordersheet.jacket_size}} {{ $parent.selected.gender == "women" ? '号' : '' }}
						div.table_header 基準値
						div.table_header 補正値
						div.table_header 上がり値

					div.size_table_row(v-for="(item,key) in sizeAdjs" v-if="item.junle == 'jacket'")
						div.table_data.table_data__start {{item.name}}
						div.table_data {{$parent.selected.size[item.junle][key]}}cm
						div.table_data {{$parent.selected.sessions.ordersheet[key] - $parent.selected.size[item.junle][key] | round}}cm
						div.table_data {{$parent.selected.sessions.ordersheet[key]}}cm

				div.size_table_group(v-if="$parent.selected.sessions.ordersheet.best_dno != null && $parent.selected.sessions.ordersheet.best_dno != '' && selectparts.indexOf('vest') > -1")
					div.size_table_row
						div.table_header.table_header__start
							span ベスト
							strong {{$parent.selected.sessions.ordersheet.best_size}}
						div.table_header 基準値
						div.table_header 補正値
						div.table_header 上がり値

					div.size_table_row(v-for="(item,key) in sizeAdjs" v-if="item.junle == 'vest'")
						div.table_data.table_data__start {{item.name}}
						div.table_data {{$parent.selected.size[item.junle][key]}}cm
						div.table_data {{$parent.selected.sessions.ordersheet[key] - $parent.selected.size[item.junle][key] | round}}cm
						div.table_data {{$parent.selected.sessions.ordersheet[key]}}cm

				div.size_table_group(v-if="$parent.selected.sessions.ordersheet.slacks_dno1 != null && $parent.selected.sessions.ordersheet.slacks_dno1 != '' && selectparts.indexOf('pants') > -1")
					div.size_table_row
						div.table_header.table_header__start
							span スラックス
							strong {{$parent.selected.sessions.ordersheet.slacks_size1}} {{ $parent.selected.gender == "women" ? '号' : '' }}
						div.table_header 基準値
						div.table_header 補正値
						div.table_header 上がり値

					div.size_table_row(v-for="(item,key) in sizeAdjs" v-if="item.junle == 'pants'")
						div.table_data.table_data__start {{item.name}}
						div.table_data {{$parent.selected.size[item.junle][key]}}cm
						div.table_data {{$parent.selected.sessions.ordersheet[key] - $parent.selected.size[item.junle][key] | round}}cm
						div.table_data {{$parent.selected.sessions.ordersheet[key]}}cm
					div.size_table_row(v-if="$parent.selected.sessions.ordersheet.crotch_main1 != '' && $parent.selected.sessions.ordersheet.crotch_main1 != null")
						div.table_data.table_data__start 股下(左)
						div.table_data -
						div.table_data -
						div.table_data  {{$parent.selected.sessions.ordersheet.crotch_main1}}cm
					div.size_table_row(v-if="$parent.selected.sessions.ordersheet.crotch_right1 != '' && $parent.selected.sessions.ordersheet.crotch_right1 != null")
						div.table_data.table_data__start 股下(右)
						div.table_data -
						div.table_data -
						div.table_data  {{$parent.selected.sessions.ordersheet.crotch_right1}}cm

				div.size_table_group(v-if="$parent.selected.sessions.ordersheet.slacks_dno2 != null && $parent.selected.sessions.ordersheet.slacks_dno2 != '' && selectparts.indexOf('pants2') > -1")
					div.size_table_row
						div.table_header.table_header__start
							span スラックス(２本目)
							strong {{$parent.selected.sessions.ordersheet.slacks_size2}} {{ $parent.selected.gender == "women" ? '号' : '' }}
						div.table_header 基準値
						div.table_header 補正値
						div.table_header 上がり値

					div.size_table_row(v-for="(item,key) in sizeAdjs" v-if="item.junle == 'pants2'")
						div.table_data.table_data__start {{item.name}}
						div.table_data {{$parent.selected.size[item.junle][key]}}cm
						div.table_data {{$parent.selected.sessions.ordersheet[key] - $parent.selected.size[item.junle][key] | round}}cm
						div.table_data {{$parent.selected.sessions.ordersheet[key]}}cm
					div.size_table_row(v-if="$parent.selected.sessions.ordersheet.crotch_main2 != '' && $parent.selected.sessions.ordersheet.crotch_main2 != null")
						div.table_data.table_data__start 股下(左)
						div.table_data -
						div.table_data -
						div.table_data  {{$parent.selected.sessions.ordersheet.crotch_main2}}cm
					div.size_table_row(v-if="$parent.selected.sessions.ordersheet.crotch_right2 != '' && $parent.selected.sessions.ordersheet.crotch_right2 != null")
						div.table_data.table_data__start 股下(右)
						div.table_data -
						div.table_data -
						div.table_data  {{$parent.selected.sessions.ordersheet.crotch_right2}}cm

				div.size_table_group(v-if="$parent.selected.sessions.ordersheet.wo_sk_d1 != null && $parent.selected.sessions.ordersheet.wo_sk_d1 != '' && selectparts.indexOf('skirt') > -1")
					div.size_table_row
						div.table_header.table_header__start
							span スカート
							strong {{$parent.selected.sessions.ordersheet.wo_sk_d1}} {{ $parent.selected.gender == "women" ? '号' : '' }}
						div.table_header 基準値
						div.table_header 補正値
						div.table_header 上がり値

					div.size_table_row(v-for="(item,key) in sizeAdjs" v-if="item.junle == 'skirt'")
						div.table_data.table_data__start {{item.name}}
						div.table_data {{$parent.selected.size[item.junle][key]}}cm
						div.table_data {{$parent.selected.sessions.ordersheet[key] - $parent.selected.size[item.junle][key] | round}}cm
						div.table_data {{$parent.selected.sessions.ordersheet[key]}}cm

				div.size_table_group(v-if="$parent.selected.sessions.ordersheet.wo_sk_d2 != null && $parent.selected.sessions.ordersheet.wo_sk_d2 != '' && selectparts.indexOf('skirt2') > -1")
					div.size_table_row
						div.table_header.table_header__start
							span スカート(２本目)
							strong {{$parent.selected.sessions.ordersheet.wo_sk_d2}} {{ $parent.selected.gender == "women" ? '号' : '' }}
						div.table_header 基準値
						div.table_header 補正値
						div.table_header 上がり値

					div.size_table_row(v-for="(item,key) in sizeAdjs" v-if="item.junle == 'skirt2'")
						div.table_data.table_data__start {{item.name}}
						div.table_data {{$parent.selected.size[item.junle][key]}}cm
						div.table_data {{$parent.selected.sessions.ordersheet[key] - $parent.selected.size[item.junle][key] | round}}cm
						div.table_data {{$parent.selected.sessions.ordersheet[key]}}cm

			div.title_container.margin_block_start
				span.size_title オプション内容確認

			div.option_modal__group(
				v-for="design in optionList",
				v-if='design.options.length'
				:key="design.id"
			)
				div.option_modal__header_group
					h4.header_title {{ design.name }}
					button.buttons.buttons-small.icon-end(v-on:click="stepChanger(5)") 変更する
				div.label_value_group(v-for="item in design.options" :key="item.disp_name")
					div.label_name {{item.disp_name}}
					div.data_value.data_value__center(v-if='item.input_type == "2"') {{item.selectedOption}}
					div.data_value.data_value__center(v-else) {{item.selectedOptionDetail.option_field}}

			div.flex_center
				div.footer_delivery_date
					span 納期 :
					time  {{ $parent.deliveryDate }}

</template>

<script>
// コンポーネントのtemplateは、一つのタグですべて囲われていなければならん。注意。
//アロー関数では値が取れなくなる場合がある。　hoge:function(){}としろ。
module.exports = {
	data: function () {
		return {
			selected: this.$parent.selected.sessions.ordersheet,
			selectedFabricer: this.$parent.productData[this.$parent.selected.fabric],
			productDataLoad: this.$parent.productDataLoad,
			masterDataLoad: this.$parent.masterDataLoad,
			sizeAdjs: this.$parent.size.adj,
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
					},
					options: [],
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
					},
					options: [],
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
					},
					options: [],
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
					},
					options: [],
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
					},
					options: [],
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
					},
					options: [],
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
					},
					options: [],
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
					},
					options: [],
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
					},
					options: [],
				},
			],
			optionList: []
		}
	},
	watch: {
		'$parent.productDataLoad': function (v, ov) {
			this.productDataLoad = v;
		},
		'$parent.masterDataLoad': function (v, ov) {
			this.masterDataLoad = v;
		},
		'$parent.selected.selectedOptions': function(v) {
			this.updateDesignList(v);
		}
	},
	computed: {
		selectparts: function () {
			var result = '';
			$.each(this.$parent.selected.parts, function (key, item) {
				result = item;
			})
			// console.log('parts');
			// console.log(result.designParts);
			return result.designParts;
		},
		kizitokusei: function () {
			if (this.$parent.selected.sessions.ordersheet.washable == 1) {
				return "ウォッシャブル";
			} else if (this.$parent.selected.sessions.ordersheet.pleats_sta == 1) {
				return "プリーツ安定";
			} else {
				return "標準";
			}
		},
		axiosChecker: function () {

		},
		totalPrice: function () {
			return this.$parent.totalPriceCalc;
		},
		masters: function () {
			return this.$parent.masters.maker;
		},
		mastersLine: function () {
			return this.$parent.masters.line;
		},
		selectedFabric: function () {
			return this.$parent.selected.fabric;
		},
		productData: function () {
			return this.$parent.productData;
		},
		lineChecker: function () {
			return this.$parent.lineChecker;
		},
		selected02: function () {
			var result = "";
			$.each(this.$parent.selected.parts, function (key, item) {
				result = item.ja;
			})
			return result;
		},
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
	},
	methods: {
		updateDesignList(optionList) {
			const courseNo = this.$parent.selected.code.course
			const designs = [];
			const list = _.orderBy(optionList, 'rank', 'desc')

			// const selected = [];
			Object.values(this.designList).forEach(design => {
				if (design.gender == this.$parent.selected.gender && design.is(design.gender == 'men' ? courseNo : this.courseNos)) {
					design.options = list.filter(option => {
						if (
							(option.selectedOptionDetail != null || option.input_type == "2")
							&& this.optionHiddenChecker(option)
							&& option.disp_name != "チェンジポケット"
							&& this.hiddenChecker(option, design.categoryId)
							&& this.checkDoubleStyle(option, design.categoryId, design.sub)
							// && !selected.includes(option.target_api_field)
						) {
							// selected.push(option.target_api_field);
							return true;
						}
						return false;
					});
					designs.push(design);
				}
			});

			// console.log('SELECTED_OPTIONS', JSON.parse(JSON.stringify(this.$parent.selected.selectedOptions)));
			// console.log('DESIGNS', JSON.parse(JSON.stringify(designs)));
			this.optionList = designs;
		},
		stepChanger: function (target) {
			Vue.set(this.$parent, "step", target);
			// this.$parent.step = target;
		},
		janChecker: function () {
			var jancodes = this.$parent.selected.code.result;
			if (Object.keys(jancodes).length == 0) {
				alert('ジャンコードが算出されていません。選択内容をお確かめください。');
			}
		},
		optionHiddenChecker: function (items) {
			//工場チェック
			var thista = this;
			var checker = true;
			var optionData = this.$parent.optionData;
			if ('mazemaze' in optionData && 'option_id' in items) {
				if (items.option_id in optionData.mazemaze || items.api_field == 'digital_name' || items.api_field == 'enter_name') {

				} else {
					checker = false;
					// console.log('工場だめ：' + items.option_id);
				}
			}
			return checker;
		},
		hiddenChecker(target, category) {
			let targetCate = category;
			if (category == 3) {
				targetCate = 4;
			} else if (category == 4) {
				targetCate = 3;
			}
			if (!target.option_item.includes(String(targetCate))) {
				return false;
			}
			return true;
		},
		checkDoubleStyle(option, category, sub) {
			if ([ 4, 6, 7].includes(category)) {
				const endNum = sub ? '2' : '1';
				return option.api_field.concat(endNum) == option.target_api_field;
			}
			return true;
		},
	},
	mounted: function () {
		this.$parent.getJan();
		if (this.$parent.tantouFlg) {
			this.janChecker();
		}
		var thista = this;
		// setTimeout(function(){
		Vue.set(thista.$parent, 'view', thista.$parent.checkSkPt);
		// },400);
		if (this.$parent.productDataLoad) {
			this.productDataLoad = true;
		}
		if (this.$parent.productDataLoad) {
			this.masterDataLoad = true;
		}
		this.$parent.getSelectedOption();
		//console.log("現在のselected");
		// console.log('SELECTED::CONFIRM', JSON.parse(JSON.stringify(this.$parent.selected)));
		//console.log("sizeadj");
		//console.log(this.$parent.size.adj);

		this.updateDesignList(this.$parent.selected.selectedOptions);
	},
	beforeDestroy: function () {
		var thista = this;
		Vue.set(thista.$parent, 'view', '');
	}
};
</script>