<!-- <template lang="pug">
div.simulator__productselect_modal.simulator__modal
	div.simulator__modal__back(v-on:click="modalCloser")
	div.simulator__modal__wrap(v-if="targetProductData")
		p.modal_closer(v-on:click="modalCloser")
		div.modal_table
			dl(v-if="targetProductData.color")
				dt カラー
				dd {{$parent.masters.colors[targetProductData.color].name}}
			dl(v-if="targetProductData.gara")
				dt 柄
				dd {{$parent.masters.gara[targetProductData.gara]}}
			dl.seasons(v-if="targetProductData.season")
				dt シーズン
				dd
					span(v-for="season in targetProductData.season") {{season.category_name}}
			dl(v-if="targetProductData.sosei")
				dt 生地特性
				dd {{$parent.masters.sosei[targetProductData.sosei]}}
		div.title
			h5 選択してください
		div.radios
			p
				label
					input(type="radio" name="selecttype" v-model="radioVal" value="1")
					span 標準
			// p(v-if="targetProductData.check_washable == true && katagamiWChecker()")
			p(v-if="targetProductData.check_washable == true")
				label
					input(type="radio" name="selecttype" v-model="radioVal" value="2")
					span ウォッシャブル
			p(v-if="targetProductData.check_pleats == true && $parent.selected.gender == 'men'")
				label
					input(type="radio" name="selecttype" v-model="radioVal" value="3")
					span プリーツ安定
		div.message
			p(v-if="radioVal == 2")
				|ご家庭の洗濯機で丸洗いが可能です。専用の芯地への交換と縫い目を防水加工にすることで、水はけも良く、アイロンがけもほとんどいりません。
			p(v-if="radioVal == 3")
				|肌に優しい自然由来の薬品を使い、折り目をキープする効果があります。シワや折り目が弱まった際は、裾側から逆さに吊るし、蒸気を与えることで自然回復してくれます。
		div.productselect__button.flex_centers
			p.buttons.buttons-black.buttons-next(v-on:click="submiter()") 次へ


</template> -->

<template>
	<div class="simulator-modal">
		<div class="simulator-modal__container" @click.self="modalCloser">
			<div class="simulator-modal__card">
				<header class="simulator-modal__header">
					<button class="modal-close" @click="modalCloser"></button>
				</header>
				<div class="simulator-modal__body">
					<div class="product-select">
						<div class="grid-table">
							<div class="grid-row" v-if="targetProductData.color">
								<div class="grid-header">カラー</div>
								<div class="grid-data">{{ $parent.masters.colors[targetProductData.color].name }}</div>
							</div>
							<div class="grid-row" v-if="targetProductData.gara">
								<div class="grid-header">柄</div>
								<div class="grid-data">{{ $parent.masters.gara[targetProductData.gara] }}</div>
							</div>
							<div class="grid-row" v-if="targetProductData.season">
								<div class="grid-header">シーズン</div>
								<div class="grid-data">
									<span v-for="(season, index) in targetProductData.season" :key="index">{{ season.category_name }}</span>
								</div>
							</div>
							<div class="grid-row" v-if="targetProductData.sosei">
								<div class="grid-header">生地特性</div>
								<div class="grid-data">{{ $parent.masters.sosei[targetProductData.sosei] }}</div>
							</div>
						</div>
						<div class="data-select">
							<div class="select-title">選択してください</div>
							<div class="radios">
								<label class="radio-box">
									<input type="radio" name="selecttype" v-model="radioVal" value="1">
									<div class="name">標準</div>
									<div class="box">無料</div>
								</label>
								<label class="radio-box" v-if="targetProductData.check_washable">
									<input type="radio" name="selecttype" v-model="radioVal" value="2">
									<div class="name">ウォッシャブル</div>
									<div class="box">有料</div>
								</label>
								<label class="radio-box" v-if="targetProductData.check_pleats == true && $parent.selected.gender == 'men'">
									<input type="radio" name="selecttype" v-model="radioVal" value="3">
									<div class="name">プリーツ安定</div>
									<div class="box">有料</div>
								</label>
							</div>
							<div class="message">
								<p v-if="radioVal == 2">
									ご家庭の洗濯機で丸洗いが可能です。専用の芯地への交換と縫い目を防水加工にすることで、水はけも良く、アイロンがけもほとんどいりません。
								</p>
								<p v-if="radioVal == 3">
									肌に優しい自然由来の薬品を使い、折り目をキープする効果があります。シワや折り目が弱まった際は、裾側から逆さに吊るし、蒸気を与えることで自然回復してくれます。
								</p>
							</div>
						</div>
					</div>
				</div>
				<footer class="simulator-modal__footer">
					<button class="simu-button simu-button--primary" @click="submiter">次へ</button>
				</footer>
			</div>
		</div>
	</div>
</template>

<script>
// コンポーネントのtemplateは、一つのタグですべて囲われていなければならん。注意。
//アロー関数では値が取れなくなる場合がある。　hoge:function(){}としろ。
module.exports = {
	props: ["uploadpass"],
	data: function () {
		return {
			quantity: 1,
			address: "",
			product_id: this.$parent.selected.fabric,
			radioVal: 1
		}
	},
	computed: {
		targetProductData: function () {
			return this.$parent.productData[this.product_id];
		},
		stocktani: function () {
			return this.$parent.masters.stocklimit[this.$parent.selected.gender];
		}
	},
	methods: {
		katagamiWChecker: function () {
			var katagamis = this.$parent.selected.katagami;
			var washableOKFlg = true;
			$.each(katagamis, function (key, item) {
				$.each(item, function (key2, item2) {
					if ('option_id' in item2) {
						if (61 in item2.option_id) {

						} else {
							washableOKFlg = false;
						}
					}
				})
			})
			return washableOKFlg;
		},
		//optionをリセットするのかチェックし、アラートを出す
		optionResetChecker: function () {
			if (this.$parent.firstCheckers.ResetedFlg == false || this.$parent.tantouFlg == true) {
				var washableChangeFlg = false;
				var firstfactory = this.$parent.firstCheckers.factory;
				var selectfactory = this.$parent.selectedProductData.factory;
				var factoryChangeFlg = false;
				var resetString = '';
				var washakanzenDame = false;
				var resetWAdj = false;
				var resetDaiba = false;
				var resetOptiondake = false;
				if (this.radioVal == 2) {
					//ウォッシャブルがオン
					if (this.$parent.firstCheckers.washable != true) {
						washableChangeFlg = true;
						// // console.log('washablechangeee');
					}

				}
				if (firstfactory != selectfactory) {
					factoryChangeFlg = true;
				}
				//工場がかわっているか
				// // console.log(this.targetProductData);
				// // console.log('工場かわってるか');
				// // console.log(firstfactory);
				// // console.log(selectfactory);
				// // console.log(this.$parent.selected.sessions);
				if (factoryChangeFlg == true) {
					//工場が変わっている。元々の工場はセンチュリー
					if (firstfactory == '7861') {
						//センチュリーがワキタに変わる場合リセット
						if (selectfactory == '3923') {
							// // console.log('センチュリーがワキタに変わるのでオプション全リセット');
							resetString = 'all';
						}
						//センチュリーが中国に変わるんでリセットするが、中国にも対応する型紙を使っている場合はオプションだけリセット
						if (selectfactory == '4423' && this.$parent.firstCheckers.katafactory != '' && this.$parent.firstCheckers.katafactory != null && this.$parent.firstCheckers.katafactory.indexOf('4423') > -1 && this.$parent.firstCheckers.katafactory.indexOf('7861') > -1) {

							// // console.log('センチュリーが中国に変わるんでリセットするが、中国にも対応する型紙を使っている場合はオプションだけリセット');
							resetOptiondake = true;

							//センチュリーが中国に変わるんでリセット　兼用できる生地ではない
						} else if (selectfactory == '4423') {
							// // console.log('センチュリーが中国に変わるんでリセット　兼用できる生地ではない');
							resetString = 'all';
						}

						//工場が変わっている。元々の工場は中国
					} else if (firstfactory == '4423') {
						//中国がセンチュリーに変わる場合オプションだけリセット
						// if(selectfactory == '7861' && this.$parent.firstCheckers.katafactory != '' && this.$parent.firstCheckers.katafactory != null && this.$parent.firstCheckers.katafactory.indexOf('4423') > -1 && this.$parent.firstCheckers.katafactory.indexOf('7861') > -1){
						// 	// console.log('中国がセンチュリーに変わるのでオプション全リセット');
						// 	resetOptiondake = true;
						// }else if(selectfactory == '7861'){
						// 	// console.log('中国がセンチュリーに変わるし対応してない型紙あるんで全リセット');
						// 	resetString = 'all';
						// }
						if (selectfactory == '7861') {
							// // console.log('中国がセンチュリーに変わるのでオプション全リセット');
							resetOptiondake = true;
						}
						//中国がワキタに変わる場合リセット
						if (selectfactory == '3923') {
							// // console.log('中国がワキタに変わるのでオプション全リセット');
							resetString = 'all';
						}
					}
					//工場が変わっている。元々の工場はワキタ
					else if (firstfactory == '3923') {
						//ワキタがワキタ以外に変わる場合リセット
						// // console.log('ワキタがワキタ以外に変わるのでオプション全リセット');
						resetString = 'all';
					}
				}
				//既にすべてがリセットされる予定の場合ウォッシャブルチェックはしない
				if (resetString != 'all') {
					//工場が変わっていない、そしてセンチュリーであり、ウォッシャブルはオフがオンになる時
					if (selectfactory == '7861' && washableChangeFlg == true) {
						//型紙がAJMCH-15,もしくはGBの場合はオプションオールリセット
						if (this.$parent.firstCheckers.jacket_dno == 'AJMCH-15' || this.$parent.firstCheckers.gb == true) {
							if (this.$parent.tantouFlg) {
								// // console.log('センチュリーで、ウォッシャブルがオンになり、前寸型紙がAJMCH-15　もしくは　GBのため　全リセット');
								resetString = 'all';
							} else {
								// // console.log('センチュリーで、ウォッシャブルがオンになり、前寸型紙がAJMCH-15　もしくは　GBのため　ユーザーは注文できない');
								washakanzenDame = true;
							}
						}
						//
					}
				}
				if (resetString != 'all' && resetOptiondake != true) {
					if (washableChangeFlg == true && (this.$parent.firstCheckers.w_adjuster == true || (this.$parent.selected.sessions.ordersheet.w_adjuster1 != null && this.$parent.selected.sessions.ordersheet.w_adjuster1 != '0') || (this.$parent.selected.sessions.ordersheet.w_adjuster2 != null && this.$parent.selected.sessions.ordersheet.w_adjuster2 != '0'))) {
						//ウォッシャブルオンで、元々ウェストアジャスターがついてるんでウェストアジャスターだけリセット
						// // console.log('ウォッシャブルオンで、元々ウェストアジャスターがついてるんでウェストアジャスターだけリセット');
						resetWAdj = true;
					}

					if (washableChangeFlg == true && (this.$parent.firstCheckers.daiba == true || (this.$parent.selected.sessions.ordersheet.daiba != null && this.$parent.selected.sessions.ordersheet.daiba != '0'))) {
						//ウォッシャブルオンで、元々台場がついてるんで台場だけリセット
						// // console.log('ウォッシャブルオンで、元々台場がついてるんで台場だけリセット');
						resetDaiba = true;
					}

				}

				if (resetString == 'all') {
					if (window.confirm('選択した生地は、前寸のデザイン・オプションが適応できません。\nデザインを変更して注文をしてください。')) {
						this.$parent.optionKatagamiSizeReseter();
						var thista = this;
						Vue.set(this.$parent.selected, 'gb', false);
						//firstcheckers をセットしなおす
						$.each(this.$parent.firstCheckers, function (key, item) {
							Vue.set(thista.$parent.firstCheckers, key, null);
						});
						Vue.set(this.$parent.firstCheckers, 'cloth_no', this.targetProductData.product_code_min);
						Vue.set(this.$parent.firstCheckers, 'factory', this.targetProductData.factory);
						Vue.set(this.$parent.firstCheckers, 'ResetedFlg', false);
						if (this.radioVal == 2) {
							Vue.set(this.$parent.firstCheckers, 'washable', true);
						}
						// // console.log(this.$parent.firstCheckers);
						//↑firstcheckers をセットしなおす

						return true;
					}
					else {
						return false;
					}
				}
				if (washakanzenDame == true) {
					alert('前寸送信された内容に\nウォッシャブル機能が選択できない項目があります。\nウォッシャブル以外を選択してください。');
					return false;
				}
				if (resetOptiondake == true) {
					if (window.confirm('選択した生地は、前寸のオプションが適応できません。\nオプション内容の変更が必要です')) {
						this.$parent.optionReseter();
						//firstcheckers をセットしなおす
						Vue.set(this.$parent.firstCheckers, 'cloth_no', this.targetProductData.product_code_min);
						Vue.set(this.$parent.firstCheckers, 'factory', this.targetProductData.factory);
						//↑firstcheckers をセットしなおす
						// Vue.set(this.$parent.firstCheckers,'ResetedFlg',true);
						return true;
					}
					else {
						return false;
					}
				}
				//firstcheckers をセットしなおす
				Vue.set(this.$parent.firstCheckers, 'cloth_no', this.targetProductData.product_code_min);
				Vue.set(this.$parent.firstCheckers, 'factory', this.targetProductData.factory);


				if ((resetWAdj == true || resetDaiba == true) && (this.$parent.firstCheckers.cloth_no != '' || this.$parent.firstCheckers.cloth_no != null)) {

					if (window.confirm('前寸送信された内容に\nウォッシャブル機能が選択できない項目があります。\nデザイン、又はオプション内容の変更が必要です。\n※デザイン変更の場合は前寸内容がクリアになります\n※オプション変更の場合はオプション内容のみクリアになります')) {
						Vue.set(this.$parent.firstCheckers, 'cloth_no', this.targetProductData.product_code_min);
						if (resetWAdj == true) {
							this.$parent.waistReseter();
						}
						if (resetDaiba == true) {
							this.$parent.daibaReseter();
						}
						return true;
					}
					else {
						return false;
					}
				}
				return true;
				// Vue.set(this.$parent.firstCheckers,'ResetedFlg',true);
			} else {
				return true;
			}

		},
		modalCloser: function () {
			Vue.set(this.$parent, "productSelectFlg", false);
		},
		submiter: function () {
			Vue.set(this.$parent, "loading", true);

			var checks = this.optionResetChecker();
			//// console.log("生地を変更した");
			//// console.log(this.$parent.selectedProductData);
			//// console.log(this.$parent.selected.sessions.ordersheet);
			if (checks == true) {
				if (this.$parent.selected.suitist == true && this.$parent.masters.line[this.$parent.selectedProductData["suitistline"]]) {
					this.$parent.selected.code.line = this.$parent.masters.line[this.$parent.selectedProductData["suitistline"]]["line_code"];
				} else if (this.$parent.selected.gender == "men" && this.$parent.masters.line[this.$parent.selectedProductData["mensline"]]) {
					this.$parent.selected.code.line = this.$parent.masters.line[this.$parent.selectedProductData["mensline"]]["line_code"];
				} else if (this.$parent.selected.gender == "women" && this.$parent.masters.line[this.$parent.selectedProductData["ladiesline"]]) {
					this.$parent.selected.code.line = this.$parent.masters.line[this.$parent.selectedProductData["ladiesline"]]["line_code"];
				}
				if (this.radioVal == 1) {
					Vue.set(this.$parent.selected.sessions.ordersheet, "washable", "");
					Vue.set(this.$parent.selected.sessions.ordersheet, "pleats_sta", "");
					//// console.log("生地タイプ標準：ウォッシャブルとプリーツ安定解除");
				}
				else if (this.radioVal == 2) {
					Vue.set(this.$parent.selected.sessions.ordersheet, "washable", "1");
					Vue.set(this.$parent.selected.sessions.ordersheet, "pleats_sta", "");
					//// console.log("生地タイプ：ウォッシャブル");
				}
				else if (this.radioVal == 3) {
					Vue.set(this.$parent.selected.sessions.ordersheet, "washable", "");
					Vue.set(this.$parent.selected.sessions.ordersheet, "pleats_sta", "1");
					//// console.log("生地タイプ：プリーツ安定");
				}
				//// console.log("janコード特定用ラインNO変更");
				//// console.log(this.$parent.selected.code);
				if (this.$parent.guest === false && this.$parent.katagamiNaiUser == false) {
					//一旦在庫確保
					let formdata = new URLSearchParams();
					var sessionJson = JSON.stringify(this.$parent.selected.sessions);
					formdata.append('quantity', this.quantity * this.stocktani.all);
					formdata.append('product_id', this.product_id);
					formdata.append("token", this.$parent.token);
					formdata.append('ordersheet', sessionJson);
					formdata.append('kakuhokizi', this.$parent.selected.kakuhokizi);
					axios.post("/ajaxTool/stepper_order_regist.php", formdata).then(res => {
						//// console.log(res.data);
						if (res.data == "no stock") {
							//// console.log("在庫確保失敗");
							alert("指定した生地の在庫がありません。別の生地を選択してください");
							Vue.set(this.$parent, "loading", false);
						} else {
							//// console.log("在庫確保OK");
							Vue.set(this.$parent, "step", 2);
							Vue.set(this.$parent, "loading", false);
							this.$parent.checkOptionCourse();
						}
					});
				} else {
					Vue.set(this.$parent, "step", 2);

					//// console.log('在庫の確保が必要ないユーザーなので確保しません');
				}
			}
			Vue.set(this.$parent, "loading", false);
			this.modalCloser();
		}
	},
	mounted() {
		if (!this.targetProductData) {
			alert('生地を選択してください');
			this.modalCloser();
		}
	},
};
</script>