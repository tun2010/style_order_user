<template lang="pug">
div.simulator__controller.simulator__controller--end(v-if="$parent.selectedPartOption || $parent.kakuhoListFlg")
	//- div.flex_container
	//- 	p.cartin(v-on:click="openOptionModal()")
	//- 		button.buttons.icon-end
	//- 			span 注文内容を確認
	p.buttons.buttons-prev(v-on:click="closeOption()")
		span 戻る
div.simulator__controller(v-else :class="{ 'simulator__controller--center': $parent.staffstartFlg }")
	div.flex_container
		p.cartin(v-if="$parent.step < 6 && $parent.tantouFlg == true && $parent.staffstartFlg == false" v-on:click="openOptionModal()")
			button.buttons.icon-end.long_text
				span 注文内容を確認
		p.cartin(v-if='"optionset_name" in optionCourseDetails && $parent.step == 5' v-on:click='optionsetModalOpen')
			button.buttons.icon-end.long_text
				span 選択オプションを確認
	ul(v-if='$parent.staffstartFlg' style='justify-content:center;text-align:center;')
		li(v-if='staffstartLoading == true')
			p.button-loading loading ...
		li(v-on:click="staffstartClose()" v-else)
			p.buttons.buttons-next(v-bind:class="{'nonactive':$parent.step==$parent.stepLimit}")
				span 次へ
	ul(v-else)
		li(v-on:click="stepPrev")
			p.buttons.buttons-prev(v-bind:class="{'nonactive':$parent.step==0}")
				span 戻る
		li(v-if="$parent.step == 6" v-on:click="StaffFinalSubmiter()")
			p.buttons.icon-end
				span お客様情報入力へ
		li(v-else v-on:click="stepNext")
			p.buttons.buttons-next(v-bind:class="{'nonactive':$parent.step==$parent.stepLimit}")
				span 次へ
	// p.cartin(v-if="$parent.step == 6 && $parent.tantouFlg == true" v-on:click="orderSaver()")
	// 	span.buttons.buttons-brown 注文を追加する
	// p.cartin(v-if="$parent.step == 6 && $parent.tantouFlg == false && $parent.katagamiNaiUser == false" v-on:click="okyakusan()")
	// 	span.buttons.buttons-brown カートへ入れる
	// p.cartin(v-if="$parent.step == 7" v-on:click="StaffFinalSubmiter()")
	// 	span.buttons.buttons-brown お客様情報入力
	// p.cartin(v-if="$parent.step < 6 && ($parent.tantouFlg == false || $parent.debugFlg==true)" v-on:click="raitenyoyaku()")
	// 	span.buttons.buttons-brown 来店予約をする
	// p.cartin(v-if="$parent.step < 6 && ($parent.debugFlg==true)" v-on:click="raitenyoyaku()")
	// 	span.buttons.buttons-brown 来店予約をする(※デバッグ中のみ表示)
	// p.debuger(v-if='$parent.debug==true' v-on:click="staffStart()") スタッフスタート

</template>

<script>
// コンポーネントのtemplateは、一つのタグですべて囲われていなければならん。注意。
//アロー関数では値が取れなくなる場合がある。　hoge:function(){}としろ。
module.exports = {
	data: function () {
		return {
			quantity: 1,
			staffstartLoading: false,
		}
	},
	computed: {
		selectparts: function () {
			var result = '';
			$.each(this.$parent.selected.parts, function (key, item) {
				result = item;
			})

			return result.designParts;
		},
		product_id: function () {
			return this.$parent.selected.fabric;
		},
		stocktani: function () {
			return this.$parent.masters.stocklimit[this.$parent.selected.gender];
		},
		optionCourseDetails: function () {
			return this.$parent.selected.optionCourseDetails;
		}
	},
	methods: {
		closeOption() {
			if (this.$parent.kakuhoListFlg) {
				Vue.set(this.$parent, "kakuhoListFlg", null);
			} else {
				Vue.set(this.$parent, "selectedPartOption", null);
			}
		},
		openOptionModal:function(){
			Vue.set(this.$parent,"optionModalFlg",true)
		},
		optionsetModalOpen: function () {
			Vue.set(this.$parent, 'optionsetModalFlg', true);
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
		staffStart: function () {
			var thista = this;
			Vue.set(this, 'staffstartLoading', false);
			Vue.set(thista.$parent, 'staffstartFlg', true);
		},
		staffstartClose: function () {
			var targetProductId;
			var thista = this;
			$.each(thista.$parent.productData, function (key, item) {
				if (thista.$parent.selected.sessions.ordersheet.cloth_no == item.product_code_min) {
					targetProductId = item.product_id;
				}
			});
			if (thista.$parent.selected.suitist) {
				// console.log('dp スーティストです');
			} else {
				// console.log('dp スーティストではない');
				if (
					(
						thista.$parent.productData[targetProductId]
						&& thista.$parent.productData[targetProductId]['kiji_disp']
						&& thista.$parent.productData[targetProductId]['kiji_disp'].indexOf("3") > -1
					)
					|| (
						thista.$parent.productData[targetProductId]
						&& thista.$parent.productData[targetProductId]['kiji_disp']
						&& thista.$parent.productData[targetProductId]['kiji_disp'].indexOf("1") > -1
					)
				) { } else {
					// console.log('スーティストではないんでDP消します');
					Vue.set(thista.$parent.selected.sessions.ordersheet, 'digital_name', null);
					if (parseInt(thista.$parent.selected.sessions.ordersheet["ura_cno"]) > 300) {
						Vue.set(thista.$parent.selected.sessions.ordersheet, 'ura_cno', null);
						Vue.set(thista.$parent.selected.sessions.ordersheet, 'colorcustoms_ura_cno', null);
					};
				}
			}
			Vue.set(this, 'staffstartLoading', true);
			var thista = this;
			setTimeout(function () {
				Vue.set(thista.$parent, 'staffstartFlg', false);
				thista.$parent.texChanger(true);
				Vue.set(thista.$parent, 'step', 1);
			}, 500);

		},
		//オプションで特殊効果が発動するやつの設定　送る前に使う
		tokusyuOptionCheck: function () {
			//console.log('特殊なオプションチェック');
			//エアーフィットがつくと、ジャケットの型紙NOにAが付く
			if (this.$parent.selected.sessions.ordersheet.air_fit == '1' || this.$parent.selected.sessions.ordersheet.air_fit == 1) {
				//console.log('エアーフィットオプションがついているので、jacket_dnoにAがつきます');
				var jacketdno = this.$parent.selected.sessions.ordersheet.jacket_dno;
				Vue.set(this.$parent.selected.sessions.ordersheet, 'jacket_dno', jacketdno + 'A');
			}

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
				// console.log(item+'をnullにします');
				Vue.set(thista.$parent.selected.sessions.ordersheet, item, null);
			});
			//console.log(thista.$parent.selected.sessions.ordersheet);
		},
		selectedChecker: function () {
			var checker = true;

			//console.log('型紙が選択されているかチェックします');

			var checkList = this.selectparts;

			var os = this.$parent.selected.sessions.ordersheet;
			var courses = this.$parent.selected.course;
			var gender = this.$parent.selected.gender;
			if (this.$parent.step == 3 && this.$parent.katagamiNaiUser == false) {
				$.each(checkList, function (key, item) {
					switch (item) {
						case 'jacket':
							if ((os.jacket_size == '' || os.jacket_size == null) && (gender == 'men' && Object.keys(courses['1']).length == 0 || gender == 'women' && Object.keys(courses['5']).length == 0)) {
								//console.log(item+'が選択されていません');
								checker = false;
							}
							break;
						case 'pants':
							if ((os.slacks_size1 == '' || os.slacks_size1 == null) && (gender == 'men' && Object.keys(courses['3']).length == 0 || gender == 'women' && Object.keys(courses['6']).length == 0)) {
								//console.log(item+'が選択されていません');
								checker = false;
							}
							break;
						case 'pants2':
							if ((os.slacks_size2 == '' || os.slacks_size2 == null) && (gender == 'men' && Object.keys(courses['3pants2']).length == 0 || gender == 'women' && Object.keys(courses['6pants2']).length == 0)) {
								//console.log(item+'が選択されていません');
								checker = false;
							}
							break;
						case 'vest':
							if ((os.best_size == '' || os.best_size == null) && (gender == 'men' && Object.keys(courses['2']).length == 0)) {
								//console.log(item+'が選択されていません');
								checker = false;
							}
							break;
						case 'skirt':
							if ((os.wo_sk_size1 == '' || os.wo_sk_size1 == null) && (gender == 'women' && Object.keys(courses['7']).length == 0)) {
								//console.log(item+'が選択されていません');
								checker = false;
							}
							break;
						case 'skirt2':
							if ((os.wo_sk_size2 == '' || os.wo_sk_size2 == null) && (gender == 'women' && Object.keys(courses['7skirt2']).length == 0)) {
								//console.log(item+'が選択されていません');
								checker = false;
							}
							break;


					}
				})
			} else if (this.$parent.step == 3) {
				//型紙無いユーザーの場合
				$.each(checkList, function (key, item) {
					switch (item) {
						case 'jacket':
							if ((gender == 'men' && Object.keys(courses['1']).length == 0 || gender == 'women' && Object.keys(courses['5']).length == 0)) {
								//console.log(item+'が選択されていません');
								checker = false;
							}
							break;
						case 'pants':
							if ((gender == 'men' && Object.keys(courses['3']).length == 0 || gender == 'women' && Object.keys(courses['6']).length == 0)) {
								//console.log(item+'が選択されていません');
								checker = false;
							}
							break;
						case 'pants2':
							if ((gender == 'men' && Object.keys(courses['3pants2']).length == 0 || gender == 'women' && Object.keys(courses['6pants2']).length == 0)) {
								//console.log(item+'が選択されていません');
								checker = false;
							}
							break;
						case 'vest':
							if ((gender == 'men' && Object.keys(courses['2']).length == 0)) {
								//console.log(item+'が選択されていません');
								checker = false;
							}
							break;
						case 'skirt':
							if ((gender == 'women' && Object.keys(courses['7']).length == 0)) {
								//console.log(item+'が選択されていません');
								checker = false;
							}
							break;
						case 'skirt2':
							if ((gender == 'men' && Object.keys(courses['7skirt2']).length == 0)) {
								//console.log(item+'が選択されていません');
								checker = false;
							}
							break;


					}
				})
			}
			return checker;
		},
		raitenyoyaku: function () {
			var agent = window.navigator.userAgent.toLowerCase();
			if (agent.indexOf('firefox') !== -1) {
				window.open("", 'shinki').close();
			}
			window.open("", 'shinki');
			this.finalSheetCheck();
			var url = "https://online.taka-q.jp/stg/shop/orderreserve/orderreserve.aspx?url=";
			// var url="https://online.taka-q.jp/shop/orderreserve/orderreserve.aspx?url=";

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

			axios.post("/sandbox/ajaxTool/simuRaitenYoyakuSend.php", formdata).then(res => {
				//console.log(res.data);
				window.open(res.data, 'shinki');
				location.reload();
			});
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
			formdata.append('product_id', this.product_id);
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

			axios.post("/sandbox/ajaxTool/okyaku_final_order_update.php", formdata).then(res => {
				if (res.data == "no stock") {
					alert("在庫が足りないため確保できませんでした");
				} else {
					//console.log("注文を登録しました");
					// location.href=res.data;
					window.open(res.data, 'shinki');
					location.reload();
					//console.log(res.data);
				}
				Vue.set(this.$parent, "loading", false);
			});
		},
		StaffFinalSubmiter: function () {
			var agent = window.navigator.userAgent.toLowerCase();
			if (agent.indexOf('firefox') !== -1) {
				window.open("", 'shinki').close();
			}
			window.open("", 'shinki');
			this.finalSheetCheck();
			Vue.set(this.$parent, "loading", true);
			let formdata = new URLSearchParams();
			this.kyouseiOptionChecker();
			var sessionData = this.$parent.selected.sessions;
			sessionData = this.$parent.iranaiChecker(sessionData);
			var sessionJson = JSON.stringify(sessionData);
			formdata.append('quantity', this.$parent.selected.quantity);
			formdata.append('product_id', this.product_id);
			formdata.append('douzi', this.$parent.douziChecker);
			formdata.append('ordersheet', sessionJson);
			formdata.append('stock_flg', 2);
			formdata.append('token', this.$parent.token);
			formdata.append('shop_id', this.$parent.selected.sessions.base.customize_store);
			if (Object.keys(this.$parent.selected.course).length > 0) {
				formdata.append('stylenocourse', JSON.stringify(this.$parent.selected.course));
			} else {
				formdata.append('stylenoid', '');
			}
			formdata.append('tantou_id', this.$parent.selected.sessions.base.customize_employee);
			formdata.append('deliveryDate', this.$parent.deliveryDate);
			//console.log("同時購入："+this.$parent.douziChecker);

			axios.post("/sandbox/ajaxTool/staff_final_order_update.php", formdata).then(res => {
				if (res.data == "no stock") {
					alert("在庫が足りないため確保できませんでした");
				} else {
					//console.log("注文をデータベースに登録しました");

					window.open(res.data, 'shinki');
					location.reload();
				}
				Vue.set(this.$parent, "loading", false);
			});
		},
		orderSaver: function () {
			var data = this.$parent.selected.sessions;
			this.$parent.saveData.push(data);
			//console.log("saveしました。");
			this.tenpogaRenzokuSubmiter();

			// //console.log(this.$parent.saveData);
			// //console.log(this.$parent.defaultSessions);
			// var thista = this;

			// this.$parent.defaultSelectedRe();

			// setTimeout(function(){
			// 	Vue.set(thista.$parent,"selected",thista.$parent.defaultSelected);
			// 	Vue.set(thista.$parent.selected,"sessions",{});
			// 	setTimeout(function(){
			// 	Vue.set(thista.$parent.selected,"sessions",thista.$parent.defaultSessions);
			// 	},1);
			// 	//console.log(thista.$parent.selected);
			// },1000);
			// Vue.set(this.$parent,"selected",this.$parent.defaultSelected);
			// Vue.set(this.$parent.selected,"sessions",{});
			// Vue.set(this.$parent.selected,"sessions",this.$parent.defaultSessions);
			// //console.log(this.$parent.selected);

		},
		matashitaChecker: function () {
			var matashitainputer = $('.matashitaInputer').length;
			var errors = true;
			if (matashitainputer > 0) {

				$('.matashitaInputer').each(function (key, item) {
					if ($(item).val() == '') {
						errors = false;
					}
				});
			}
			if (errors == false) {
				alert('股下の数値をすべて入力してください');
				return false;
			}
			return true;
		},
		stepNext: function () {
			if (this.matashitaChecker() == false) {
				return true;
			};
			if (this.$parent.clickLocker == false) {
				if (this.selectedChecker()) {
					var step = this.$parent.step;
					if (step == 1 && this.$parent.guest == false) {
						if (this.$parent.selected.fabric) {
							this.$parent.productSelectFlg = true;
						} else {
							// console.log('NEXT', this.$parent.clickLocker);
							alert('生地を選択してください');
						}
					} else {
						var steplimit = this.$parent.stepLimit;
						if (step < steplimit) {
							Vue.set(this.$parent, "step", step + 1);
							if (this.$parent.katagamiNaiUser && this.$parent.tantouFlg == false && step == 2) {
								Vue.set(this.$parent, "step", 3);
							} else if (this.$parent.tantouFlg == false && step == 2) {
								Vue.set(this.$parent, "step", 5);
							} else if (this.$parent.katagamiNaiUser && this.$parent.tantouFlg == false && step == 3) {
								Vue.set(this.$parent, "step", 5);
							}
						}
					}
				} else {
					alert('選択されていない項目があります。ご確認ください。');
				}
			} else {
				alert('入力されていない項目があります。お確かめください。');
			}
		},
		stepPrev: function () {
			var step = this.$parent.step;
			var steplimit = this.$parent.stepLimit;
			// console.log('PREV', this.$parent.clickLocker);
			if (this.$parent.clickLocker == false) {
				if (step == 1) {
					Vue.set(this.$parent, "step", 0);
				}
				if (step > 1) {
					Vue.set(this.$parent, "step", step - 1);
					if (this.$parent.tantouFlg == false && step == 5 && this.$parent.katagamiNaiUser == false) {
						Vue.set(this.$parent, "step", 2);
					} else if (this.$parent.tantouFlg == false && step == 3 && this.$parent.katagamiNaiUser) {
						Vue.set(this.$parent, "step", 2);
					} else if (this.$parent.tantouFlg == false && step == 5 && this.$parent.katagamiNaiUser) {
						Vue.set(this.$parent, "step", 3);
					}
				}
			} else {
				alert('入力されていない項目があります。お確かめください。');
			}
		},
		finalSubmiter: function () {
			//console.log("finalsubmiter");
			//console.log(this.quantity * this.stocktani.all);

			let formdata = new URLSearchParams();
			this.kyouseiOptionChecker();
			var sessionData = this.$parent.selected.sessions;
			sessionData = this.$parent.iranaiChecker(sessionData);
			var sessionJson = JSON.stringify(sessionData);
			formdata.append('quantity', this.$parent.selected.quantity);
			formdata.append('product_id', this.product_id);
			formdata.append('ordersheet', sessionJson);
			formdata.append('deliveryDate', this.deliveryDate);
			//console.log("deliv:"+this.deliveryDate);
			axios.post("/sandbox/ajaxTool/normal_order_regist.php", formdata).then(res => {
				if (res.data == "no stock") {
					alert("在庫が足りないため確保できませんでした");
				} else {
					//console.log("仮受注を受け付けました");
				}
				//console.log(res);
			});

		},
		tenpogaRenzokuSubmiter: function () {
			Vue.set(this.$parent, "loading", true);
			//console.log("tenpoRenzoku");
			//console.log(this.quantity * this.stocktani.all);
			this.finalSheetCheck();
			let formdata = new URLSearchParams();
			this.kyouseiOptionChecker();
			var sessionData = this.$parent.selected.sessions;
			sessionData = this.$parent.iranaiChecker(sessionData);
			var sessionJson = JSON.stringify(sessionData);
			formdata.append('quantity', this.$parent.selected.quantity);
			formdata.append('product_id', this.product_id);
			formdata.append('ordersheet', sessionJson);
			formdata.append('stock_flg', 4);
			formdata.append('token', this.$parent.token);
			formdata.append('shop_id', this.$parent.selected.sessions.base.customize_store);
			formdata.append('tantou_id', this.$parent.selected.sessions.base.customize_employee);
			formdata.append('deliveryDate', this.$parent.deliveryDate);
			//console.log("deliv:"+this.$parent.deliveryDate);
			axios.post("/sandbox/ajaxTool/stepper_order_update.php", formdata).then(res => {
				if (res.data == "no stock") {
					alert("在庫が足りないため確保できませんでした");
				} else {
					//console.log(res.data);
					//console.log("受注を受け付けました");
					var resurl = location.href;

					resurl += (resurl.indexOf('?') == -1) ? '?' : '&';
					resurl += "renzoku=1";


					location.href = resurl;
				}
				//console.log(res);
				Vue.set(this.$parent, "loading", false);
			});
		}
	}
};
</script>