<!-- <template lang="pug">
	div.simulator__selector.simulator__page_confirm
		div.top_placehilder
		div.confirm_scroll_container(v-if="productDataLoad && masterDataLoad")

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

</template> -->

<template>
	<div class="confirm-container">
		<div class="confirm-scroll vertical-scroll" v-if="!loading">
			<div class="main-message-container">
				<div class="persona"></div>
				<p v-if="$parent.katagamiNaiUser">以下の内容で承っております。来店予約を行う場合は、来店予約ボタンより、シミュレーション内容を保存する場合は、メールで送信をクリックしてください。</p>
				<p v-else>ご注文内容を最終確認いただき、カートへ入れるボタンを押して決算画面にお進みください。</p>
			</div>

			<div class="actions-group" v-if="$parent.katagamiNaiUser">
				<button class="simu-button simu-button--primary" @click="raitenyoyaku()">
					来店予約
				</button>
				<button class="simu-button simu-button--email" @click="emailOpen()">
					内容をメールで送信
				</button>
				<button class="fate-link" @click="reload">初めからやり直す</button>
			</div>
			<div class="actions-group only-large" v-else>
				<button class="simu-button simu-button--primary" @click="okyakusan()">
					カートへ入れる
				</button>
			</div>

			<div class="sticky-title">
				<h3>注文内容確認</h3>
			</div>

			<div class="option-confirm-group" v-if="selectedFabricer">
				<h4>生地</h4>
				<div class="label-group">
					<div class="label-row">
						<div class="label">生地</div>
						<div class="value">{{selectedFabricer.product_code_min}} / {{selectedFabricer.name}}</div>
					</div>
					<div class="label-row">
						<div class="label">生地特性</div>
						<div class="value">{{kizitokusei}}</div>
					</div>
				</div>
				<div class="action-container">
					<button class="style-button step-change" @click="stepChanger(1)">
						変更する
					</button>
				</div>
			</div>

			<div class="option-confirm-group">
				<h4>コース</h4>
				<div class="label-group">
					<div class="label-row">
						<div class="label">コース</div>
						<div class="value">{{selected02}}</div>
					</div>
				</div>
				<div class="action-container">
					<button class="style-button step-change" @click="stepChanger(2)">
						変更する
					</button>
				</div>
			</div>

			<div class="option-confirm-group" v-if="!this.$parent.katagamiNaiUser">
				<h4>デザイン</h4>
				<div class="label-group">
					<div class="label-row" v-if="$parent.selected.sessions.ordersheet.jacket_dno != null && $parent.selected.sessions.ordersheet.jacket_dno != '' && selectparts.indexOf('jacket') > -1">
						<div class="label">ジャケット</div>
						<div class="value">{{$parent.selected.sessions.ordersheet.jacket_dno}}</div>
					</div>
					<div class="label-row" v-if="$parent.selected.sessions.ordersheet.slacks_dno1 != null && $parent.selected.sessions.ordersheet.slacks_dno1 != '' && selectparts.indexOf('pants') > -1">
						<div class="label">スラックス</div>
						<div class="value">{{$parent.selected.sessions.ordersheet.slacks_dno1}}</div>
					</div>
					<div class="label-row" v-if="$parent.selected.sessions.ordersheet.slacks_dno2 != null && $parent.selected.sessions.ordersheet.slacks_dno2 != '' && selectparts.indexOf('pants2') > -1">
						<div class="label">スラックス(２本目)</div>
						<div class="value">{{$parent.selected.sessions.ordersheet.slacks_dno2}}</div>
					</div>
					<div class="label-row" v-if="$parent.selected.sessions.ordersheet.best_dno != null && $parent.selected.sessions.ordersheet.best_dno != '' && selectparts.indexOf('vest') > -1">
						<div class="label">ベスト</div>
						<div class="value">{{$parent.selected.sessions.ordersheet.best_dno}}</div>
					</div>
					<div class="label-row" v-if="$parent.selected.sessions.ordersheet.wo_sk_d1 != null && $parent.selected.sessions.ordersheet.wo_sk_d1 != '' && selectparts.indexOf('skirt') > -1">
						<div class="label">スカート</div>
						<div class="value">{{$parent.selected.sessions.ordersheet.wo_sk_d1}}</div>
					</div>
					<div class="label-row" v-if="$parent.selected.sessions.ordersheet.wo_sk_d2 != null && $parent.selected.sessions.ordersheet.wo_sk_d2 != '' && selectparts.indexOf('skirt2') > -1">
						<div class="label">スカート(２枚目)</div>
						<div class="value">{{$parent.selected.sessions.ordersheet.wo_sk_d2}}</div>
					</div>
				</div>
				<div class="action-container">
					<!-- <button class="style-button step-change" @click="stepChanger(3)">
						変更する
					</button> -->
				</div>
			</div>

			<div class="option-confirm-group"  v-if="!this.$parent.katagamiNaiUser">
				<h4>サイズ</h4>

				<div class="table-group-container">
					<div class="table-group" v-if="$parent.selected.sessions.ordersheet.jacket_dno != null && $parent.selected.sessions.ordersheet.jacket_dno != '' && selectparts.indexOf('jacket') > -1">
						<div class="table-row table-row--header">
							<div class="header header--title">
								ジャケット
								<strong>{{$parent.selected.sessions.ordersheet.jacket_size}} {{ $parent.selected.gender == "women" ? '号' : '' }}</strong>
							</div>
							<div class="header">基準値</div>
							<div class="header">補正値</div>
							<div class="header">上がり値</div>
						</div>
						<template v-for="(item,key) in sizeAdjs">
							<div class="table-row" v-if="item.junle == 'jacket'" :key="key">
								<div class="value value--title">{{item.name}}</div>
								<div class="value" data-title="基準値">{{$parent.selected.size[item.junle][key]}}cm</div>
								<div class="value" data-title="補正値">{{$parent.selected.sessions.ordersheet[key] - $parent.selected.size[item.junle][key] | round}}cm</div>
								<div class="value" data-title="上がり値">{{$parent.selected.sessions.ordersheet[key]}}cm</div>
							</div>
						</template>
					</div>

					<div class="table-group" v-if="$parent.selected.sessions.ordersheet.best_dno != null && $parent.selected.sessions.ordersheet.best_dno != '' && selectparts.indexOf('vest') > -1">
						<div class="table-row table-row--header">
							<div class="header header--title">
								ベスト
								<strong>{{$parent.selected.sessions.ordersheet.best_size}}</strong>
							</div>
							<div class="header">基準値</div>
							<div class="header">補正値</div>
							<div class="header">上がり値</div>
						</div>
						<template v-for="(item,key) in sizeAdjs">
							<div class="table-row" v-if="item.junle == 'vest'" :key="key">
								<div class="value value--title">{{item.name}}</div>
								<div class="value" data-title="基準値">{{$parent.selected.size[item.junle][key]}}cm</div>
								<div class="value" data-title="補正値">{{$parent.selected.sessions.ordersheet[key] - $parent.selected.size[item.junle][key] | round}}cm</div>
								<div class="value" data-title="上がり値">{{$parent.selected.sessions.ordersheet[key]}}cm</div>
							</div>
						</template>
					</div>

					<div class="table-group" v-if="$parent.selected.sessions.ordersheet.slacks_dno1 != null && $parent.selected.sessions.ordersheet.slacks_dno1 != '' && selectparts.indexOf('pants') > -1">
						<div class="table-row table-row--header">
							<div class="header header--title">
								スラックス
								<strong>{{$parent.selected.sessions.ordersheet.slacks_size1}} {{ $parent.selected.gender == "women" ? '号' : '' }}</strong>
							</div>
							<div class="header">基準値</div>
							<div class="header">補正値</div>
							<div class="header">上がり値</div>
						</div>
						<template v-for="(item,key) in sizeAdjs">
							<div class="table-row" v-if="item.junle == 'pants'" :key="key">
								<div class="value value--title">{{item.name}}</div>
								<div class="value" data-title="基準値">{{$parent.selected.size[item.junle][key]}}cm</div>
								<div class="value" data-title="補正値">{{$parent.selected.sessions.ordersheet[key] - $parent.selected.size[item.junle][key] | round}}cm</div>
								<div class="value" data-title="上がり値">{{$parent.selected.sessions.ordersheet[key]}}cm</div>
							</div>
						</template>
						<div class="table-row" v-if="$parent.selected.sessions.ordersheet.crotch_main1 != '' && $parent.selected.sessions.ordersheet.crotch_main1 != null">
							<div class="value value--title">股下(左)</div>
							<div class="value" data-title="基準値">-</div>
							<div class="value" data-title="補正値">-</div>
							<div class="value" data-title="上がり値">{{$parent.selected.sessions.ordersheet.crotch_main1}}cm</div>
						</div>
						<div class="table-row" v-if="$parent.selected.sessions.ordersheet.crotch_right1 != '' && $parent.selected.sessions.ordersheet.crotch_right1 != null">
							<div class="value value--title">股下(右)</div>
							<div class="value" data-title="基準値">-</div>
							<div class="value" data-title="補正値">-</div>
							<div class="value" data-title="上がり値">{{$parent.selected.sessions.ordersheet.crotch_right1}}cm</div>
						</div>
					</div>

					<div class="table-group" v-if="$parent.selected.sessions.ordersheet.slacks_dno2 != null && $parent.selected.sessions.ordersheet.slacks_dno2 != '' && selectparts.indexOf('pants2') > -1">
						<div class="table-row table-row--header">
							<div class="header header--title">
								スラックス(２本目)
								<strong>{{$parent.selected.sessions.ordersheet.slacks_size2}} {{ $parent.selected.gender == "women" ? '号' : '' }}</strong>
							</div>
							<div class="header">基準値</div>
							<div class="header">補正値</div>
							<div class="header">上がり値</div>
						</div>
						<template v-for="(item,key) in sizeAdjs">
							<div class="table-row" v-if="item.junle == 'pants2'" :key="key">
								<div class="value value--title">{{item.name}}</div>
								<div class="value" data-title="基準値">{{$parent.selected.size[item.junle][key]}}cm</div>
								<div class="value" data-title="補正値">{{$parent.selected.sessions.ordersheet[key] - $parent.selected.size[item.junle][key] | round}}cm</div>
								<div class="value" data-title="上がり値">{{$parent.selected.sessions.ordersheet[key]}}cm</div>
							</div>
						</template>
						<div class="table-row" v-if="$parent.selected.sessions.ordersheet.crotch_main2 != '' && $parent.selected.sessions.ordersheet.crotch_main2 != null">
							<div class="value value--title">股下(左)</div>
							<div class="value" data-title="基準値">-</div>
							<div class="value" data-title="補正値">-</div>
							<div class="value" data-title="上がり値">{{$parent.selected.sessions.ordersheet.crotch_main2}}cm</div>
						</div>
						<div class="table-row" v-if="$parent.selected.sessions.ordersheet.crotch_right2 != '' && $parent.selected.sessions.ordersheet.crotch_right2 != null">
							<div class="value value--title">股下(右)</div>
							<div class="value" data-title="基準値">-</div>
							<div class="value" data-title="補正値">-</div>
							<div class="value" data-title="上がり値">{{$parent.selected.sessions.ordersheet.crotch_right2}}cm</div>
						</div>
					</div>

					<div class="table-group" v-if="$parent.selected.sessions.ordersheet.wo_sk_d1 != null && $parent.selected.sessions.ordersheet.wo_sk_d1 != '' && selectparts.indexOf('skirt') > -1">
						<div class="table-row table-row--header">
							<div class="header header--title">
								スカート
								<strong>{{$parent.selected.sessions.ordersheet.wo_sk_d1}} {{ $parent.selected.gender == "women" ? '号' : '' }}</strong>
							</div>
							<div class="header">基準値</div>
							<div class="header">補正値</div>
							<div class="header">上がり値</div>
						</div>
						<template v-for="(item,key) in sizeAdjs">
							<div class="table-row" v-if="item.junle == 'skirt'" :key="key">
								<div class="value value--title">{{item.name}}</div>
								<div class="value" data-title="基準値">{{$parent.selected.size[item.junle][key]}}cm</div>
								<div class="value" data-title="補正値">{{$parent.selected.sessions.ordersheet[key] - $parent.selected.size[item.junle][key] | round}}cm</div>
								<div class="value" data-title="上がり値">{{$parent.selected.sessions.ordersheet[key]}}cm</div>
							</div>
						</template>
					</div>

					<div class="table-group" v-if="$parent.selected.sessions.ordersheet.wo_sk_d2 != null && $parent.selected.sessions.ordersheet.wo_sk_d2 != '' && selectparts.indexOf('skirt2') > -1">
						<div class="table-row table-row--header">
							<div class="header header--title">
								スカート(２本目)
								<strong>{{$parent.selected.sessions.ordersheet.wo_sk_d2}} {{ $parent.selected.gender == "women" ? '号' : '' }}</strong>
							</div>
							<div class="header">基準値</div>
							<div class="header">補正値</div>
							<div class="header">上がり値</div>
						</div>
						<template v-for="(item,key) in sizeAdjs">
							<div class="table-row" v-if="item.junle == 'skirt2'" :key="key">
								<div class="value value--title">{{item.name}}</div>
								<div class="value" data-title="基準値">{{$parent.selected.size[item.junle][key]}}cm</div>
								<div class="value" data-title="補正値">{{$parent.selected.sessions.ordersheet[key] - $parent.selected.size[item.junle][key] | round}}cm</div>
								<div class="value" data-title="上がり値">{{$parent.selected.sessions.ordersheet[key]}}cm</div>
							</div>
						</template>
					</div>
				</div>

				<div class="action-container">
					<!-- <button class="style-button step-change" @click="stepChanger(2)">
						変更する
					</button> -->
				</div>
			</div>

			<div class="sticky-title"  v-if="!this.$parent.katagamiNaiUser">
				<h3>オプション内容確認</h3>
			</div>

			<template v-if="!this.$parent.katagamiNaiUser">
				<template v-for="design in optionList">
					<div class="option-confirm-group" v-if="design.options.length" :key="design.id">
						<h4>{{ design.name }}</h4>
						<div class="label-group">
							<div class="label-row" v-for="item in design.options" :key="item.disp_name">
								<div class="label">{{item.disp_name}}</div>
								<div class="value" v-if="item.input_type == '2'">{{item.selectedOption}}</div>
								<div class="value" v-else>{{item.selectedOptionDetail.option_field}}</div>
							</div>
						</div>
						<div class="action-container">
							<button class="style-button step-change" @click="stepChanger(6)">
								変更する
							</button>
						</div>
					</div>
				</template>
			</template>
			<template v-else>
				<template v-for="design in optionList">
					<div class="option-confirm-group" v-if="design.options.length" :key="design.id">
						<h4>{{ design.name }}</h4>
						<div class="label-group">
							<template v-for="item in design.options">
								<div class="label-row" :key="item.disp_name" v-if="['48', '49', '50'].includes(item.option_id)">
									<div class="label">{{item.disp_name}}</div>
									<div class="value" v-if="item.input_type == '2'">{{item.selectedOption}}</div>
									<div class="value" v-else>{{item.selectedOptionDetail.option_field}}</div>
								</div>
							</template>
						</div>
						<div class="action-container">
							<!-- <button class="style-button step-change" @click="stepChanger(4)">
								変更する
							</button> -->
						</div>
					</div>
				</template>
			</template>

			<div class="delivery-date">
				<h5>納期: {{ $parent.deliveryDate }}</h5>
				<p>
					以下の内容で承っております。来店予約を行う場合は、来店予約ボタンより、シミュレーション内容を保存 する場合は、メールで送信をクリックしてください。
				</p>
			</div>

			<div class="actions-group" v-if="$parent.katagamiNaiUser">
				<button class="simu-button simu-button--primary" @click="raitenyoyaku()">
					来店予約
				</button>
				<button class="simu-button simu-button--email" @click="emailOpen()">
					内容をメールで送信
				</button>
				<button class="fate-link" @click="reload">初めからやり直す</button>
			</div>
			<div class="actions-group only-large" v-else>
				<button class="simu-button simu-button--primary" @click="okyakusan()">
					カートへ入れる
				</button>
			</div>

		</div>
	</div>
</template>

<script>
// コンポーネントのtemplateは、一つのタグですべて囲われていなければならん。注意。
//アロー関数では値が取れなくなる場合がある。　hoge:function(){}としろ。
module.exports = {
	data: function () {
		return {
			selected: this.$parent.selected.sessions.ordersheet,
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
			optionList: [],
			loading: true,
		}
	},
	props: ["uploadpass"],
	watch: {
		'$parent.productDataLoad': function (v, ov) {
			this.productDataLoad = v;
		},
		'$parent.masterDataLoad': function (v, ov) {
			this.masterDataLoad = v;
		},
		'$parent.selected.selectedOptions': function(v) {
			if (!this.loading) {
				this.updateDesignList(v);
			}
		}
	},
	computed: {
		selectedFabricer: function () {
			if (!this.$parent.productData) return null;

			return Object.values(this.$parent.productData).find(item => item.product_code_min == this.$parent.selected.sessions.ordersheet.cloth_no);
		},
		selectparts: function () {
			var result = '';
			$.each(this.$parent.selected.parts, function (key, item) {
				result = item;
			})
			// // console.log('parts');
			// // console.log(result.designParts);
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
			//// console.log("courseNos:::");
			//// console.log(courses);
			return courses;
		},
	},
	methods: {
		reload() {
			location.reload();
		},
		okyakusan: function () {
			var agent = window.navigator.userAgent.toLowerCase();
			if (agent.indexOf('firefox') !== -1) {
				window.open("", 'shinki').close();
			}
			window.open("", 'shinki');
			Vue.set(this.$parent, "loading", true);
			this.finalSheetCheck();
			let formdata = new URLSearchParams();
			this.kyouseiOptionChecker();
			var sessionData = this.$parent.selected.sessions;
			sessionData = this.$parent.iranaiChecker(sessionData);
			var sessionJson = JSON.stringify(sessionData);
			formdata.append('quantity', this.$parent.selected.quantity);
			formdata.append('product_id', this.$parent.selected.fabric);
			formdata.append('ordersheet', sessionJson);
			formdata.append('stock_flg', 2);
			formdata.append('token', this.$parent.token);
			formdata.append('deliveryDate', this.$parent.deliveryDate);
			if (Object.keys(this.$parent.selected.course).length > 0) {
				formdata.append('stylenocourse', JSON.stringify(this.$parent.selected.course));
			} else {
				formdata.append('stylenoid', '');
			}
			//console.log("同時購入："+this.$parent.douziChecker);

			axios.post("/ajaxTool/okyaku_final_order_update.php", formdata).then(res => {
				if (res.data == "no stock") {
					alert("在庫が足りないため確保できませんでした");
				} else {
					//console.log("注文を登録しました");
					// location.href=res.data;
					window.open(res.data, 'shinki');
					// location.reload();
					//console.log(res.data);
				}
				Vue.set(this.$parent, "loading", false);
			});
		},
		raitenyoyaku: function () {
			var agent = window.navigator.userAgent.toLowerCase();
			if (agent.indexOf('firefox') !== -1) {
				window.open("", 'shinki').close();
			}
			window.open("", 'shinki');
			this.finalSheetCheck();
			// var url = "https://online.taka-q.jp/stg/shop/orderreserve/orderreserve.aspx?url=";
			var url="https://online.taka-q.jp/shop/orderreserve/orderreserve.aspx?url=";

			let formdata = new URLSearchParams();
			this.kyouseiOptionChecker();
			var sessionData = this.$parent.selected.sessions;
			sessionData = this.$parent.iranaiChecker(sessionData);
			var sessionJson = JSON.stringify(sessionData.ordersheet);
			formdata.append('sessions', sessionJson);
			formdata.append('token', this.$parent.token);
			if (Object.keys(this.$parent.selected.course).length > 0) {
				formdata.append('stylenocourse', JSON.stringify(this.$parent.selected.course));
			} else {
				formdata.append('stylenoid', '');
			}
			formdata.append('url', url);

			axios.post("/ajaxTool/simuRaitenYoyakuSend.php", formdata).then(res => {
				//// console.log(res.data);
				window.open(res.data, 'shinki');
				// location.reload();
			});
		},
		// 最終的に残すセッション項目の選定
		finalSheetCheck: function () {
			var thista = this;
			var selectparts = '';
			$.each(thista.$parent.selected.parts, function (key, item) {
				selectparts = item;
			});
			var parts = selectparts.designParts;
			this.tokusyuOptionCheck();
			var target = this.$parent.selected.parts;
			var all = this.$parent.optionZentai;
			var sakujoTarget = [];
			var shiwake = this.$parent.optionsShiwake;
			var targetparts;
			var targetpartsArray = [];
			$.each(target, function (key, item) {
				targetparts = item['designParts'];
			});
			targetpartsArray = targetparts;

			$.each(all, function (key, item) {
				if (targetpartsArray.indexOf(item) >= 0) {

				} else {
					sakujoTarget.push(item);
				}
			});
			var apiSakujoTarget = [];
			$.each(sakujoTarget, function (key, item) {
				$.each(shiwake[item], function (key2, item2) {
					if (item == 'jacket') {
						if (thista.$parent.selected.gender == 'women' && item2 == 'specification') {
							apiSakujoTarget.push(item2);
						}
						else if ((parts.indexOf('pants') > -1 && (item2 == 'button_cno' || item2 == 'ext_specification' || item2 == 'specification')) || (parts.indexOf('vest') > -1 && (item2 == 'button_cno' || item2 == 'colorcustoms_ura_cno_normal' || item2 == 'ura_cno'))) {
						} else {
							apiSakujoTarget.push(item2);
						}
					} else {
						apiSakujoTarget.push(item2);
					}
				});
			});
			var partsc = '';
			var coursec = this.$parent.selected.parts;
			$.each(coursec, function (key23, item23) {
				partsc = item23;
			});
			if ((partsc.styleNo == 3 || partsc.styleNo == 12 || partsc.styleNo == 13 || partsc.styleNo == 8) && this.$parent.selected.sessions.ordersheet.specification < 10) {
				apiSakujoTarget.push('specification');
			}
			var thista = this;
			$.each(apiSakujoTarget, function (key, item) {
				// // console.log(item+'をnullにします');
				Vue.set(thista.$parent.selected.sessions.ordersheet, item, null);
			});
			//// console.log(thista.$parent.selected.sessions.ordersheet);
		},
		//強制的につけるオプションとか
		kyouseiOptionChecker: function () {
			$.each(this.$parent.selected.parts, function (key, item) {
				selectparts = item;
			});
			var parts = selectparts.designParts;
			if (this.$parent.selected.gender == 'men') {
				if (parts.indexOf('jacket') > -1) {
					Vue.set(this.$parent.selected.sessions.ordersheet, 'side_pat', "1");
				}
			}
		},
		//オプションで特殊効果が発動するやつの設定　送る前に使う
		tokusyuOptionCheck: function () {
			//// console.log('特殊なオプションチェック');
			//エアーフィットがつくと、ジャケットの型紙NOにAが付く
			if (this.$parent.selected.sessions.ordersheet.air_fit == '1' || this.$parent.selected.sessions.ordersheet.air_fit == 1) {
				//// console.log('エアーフィットオプションがついているので、jacket_dnoにAがつきます');
				var jacketdno = this.$parent.selected.sessions.ordersheet.jacket_dno;
				Vue.set(this.$parent.selected.sessions.ordersheet, 'jacket_dno', jacketdno + 'A');
			}

		},
		emailOpen:function(){
			Vue.set(this.$parent,"emailModalFlg",true)
		},
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
							&& this.checkAitFit(option)
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

			// // console.log('SELECTED_OPTIONS', JSON.parse(JSON.stringify(this.$parent.selected.selectedOptions)));
			this.optionList = designs;
		},
		checkAitFit(option) {
			if (["43", "69"].includes(option.option_id)) {
				const mOption = this.$parent.optionData.mazemaze[option.option_id];
				if (!mOption) return false;
				return mOption.option_shiwake == "katagami";
			}
			return true;
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
					// // console.log('工場だめ：' + items.option_id);
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
			const endsWithOneOrTwo = (str) => {
				return str.endsWith('1') || str.endsWith('2');
			}
			if ([ 4, 6, 7].includes(category) && endsWithOneOrTwo(option.target_api_field)) {
				const endNum = sub ? '2' : '1';
				return option.api_field.concat(endNum) == option.target_api_field;
			}
			return true;
		},
		getKitagami() {
			const katagamiData = {};
			Object.entries(this.$parent.selected.course).forEach(([key, katagami]) => {
				Object.values(katagami).forEach(value => {
					katagamiData[key] = value;
				});
			});

			return katagamiData;
		},
		async getOptionsData() {
			const katagamiObj = this.getKitagami();
			const katagami = {};
			Object.entries(katagamiObj).forEach(([key, value]) => {
				if (value && value.pattern_id) {
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
				const result = await axios.get("/ajaxTool/getOptionKumiawase.php", query);

				if (!result.data) throw new Error('Error');
				this.$parent.optionData = result.data;

				return true;
			} catch(error) {
				return false;
			}
		},
	},
	async mounted () {
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
		Vue.set(this.$parent, 'loading', true);
		await this.$parent.getSelectedOption();

		if (!this.$parent.optionData.mazemaze) {
			await this.getOptionsData();
		}
		this.loading = false;

		this.updateDesignList(this.$parent.selected.selectedOptions);
		Vue.set(this.$parent, 'loading', false);
	},
	beforeDestroy: function () {
		var thista = this;
		Vue.set(thista.$parent, 'view', '');
	}
};
</script>