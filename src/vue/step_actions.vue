<template>
    <div class="step-actions">
        <button class="action-button action-button--prev"
			:class="{ disabled: $parent.step == 0 || (!$parent.katagamiNaiUser && $parent.step == 1) }"
			@click="prev">戻る</button>
        <button class="action-button action-button--next" v-if="$parent.step < 7" @click="next">次へ</button>
		<button class="action-button action-button--next action-button--email" v-else-if="$parent.katagamiNaiUser == false" @click="okyakusan">カートへ入れる</button>
		<button class="action-button action-button--next action-button--email" v-else @click="emailOpen">内容をメールで送信</button>
    </div>
</template>

<script>
module.exports = {
    data() {
        return {

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
	},
    methods: {
		isVestOnly() {
			const parts = Object.values(this.$parent.selected.parts).find(item => item.styleNo == 2);

			// console.log('VEST_ONLY________:::::_________', parts, !!parts);
			return !!parts;
		},
		isPantsOnly() {
			// pantANsSkirt: 12
			const pantStyleNos = [3, 8, 12, 13];
			const parts = Object.values(this.$parent.selected.parts).find(item => pantStyleNos.includes(item.styleNo));

			// console.log('VEST_ONLY________:::::_________', parts, !!parts);
			return !!parts;
		},
		isSkirtOnly() {
			const skirtStyleNos = [9, 14];
			const parts = Object.values(this.$parent.selected.parts).find(item => skirtStyleNos.includes(item.styleNo));

			// console.log('VEST_ONLY________:::::_________', parts, !!parts);
			return !!parts;
		},
        prev() {
            const step = this.$parent.step;
			if (this.$parent.clickLocker == false) {
				if (step >= 1) {
					// console.log('katagamiNaiUser', this.$parent.katagamiNaiUser);
					// console.log('tantouFlg', this.$parent.tantouFlg);
					if (this.$parent.katagamiNaiUser && step == 7) {
						if (this.isSkirtOnly()) {
							Vue.set(this.$parent, "step", 3);
						} else if (this.isPantsOnly()) {
							Vue.set(this.$parent, "step", 4);
						} else {
							Vue.set(this.$parent, "step", 5);
						}
					} else if (!this.$parent.katagamiNaiUser && step == 4) {
						Vue.set(this.$parent, "step", 2);
					}  else if (!this.$parent.katagamiNaiUser && step == 7) {
						if (this.isVestOnly()) {
							Vue.set(this.$parent, "step", 2);
						} else {
							Vue.set(this.$parent, "step", 6);
						}
					} else if (!this.$parent.katagamiNaiUser && step == 6) {
						if (this.isPantsOnly()) {
							Vue.set(this.$parent, "step", 4);
						} else if (this.isSkirtOnly()) {
							Vue.set(this.$parent, "step", 2);
						} else {
							Vue.set(this.$parent, "step", 5);
						}
					} else {
						Vue.set(this.$parent, "step", step - 1)
					}
					// if (this.$parent.tantouFlg == false && step == 5 && this.$parent.katagamiNaiUser == false) {
					// 	Vue.set(this.$parent, "step", 2);
					// } else if (this.$parent.tantouFlg == false && step == 3 && this.$parent.katagamiNaiUser) {
					// 	Vue.set(this.$parent, "step", 2);
					// } else if (this.$parent.tantouFlg == false && step == 5 && this.$parent.katagamiNaiUser) {
					// 	Vue.set(this.$parent, "step", 3);
					// }
				}
			} else {
				alert('入力されていない項目があります。お確かめください。');
			}
        },
        next() {
			if (this.$parent.staffstartFlg) {
				return this.staffstartClose();
			}
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
							// // console.log('NEXT', this.$parent.clickLocker);
							alert('生地を選択してください');
						}
					} else {
						console.log('katagamiNaiUser', this.$parent.katagamiNaiUser);
						console.log('tantouFlg', this.$parent.tantouFlg);
						if (this.$parent.katagamiNaiUser && step == 3) {
							if (this.isSkirtOnly()) {
								Vue.set(this.$parent, "step", 7);
							} else {
								Vue.set(this.$parent, "step", 4);
							}
						} else if ((this.$parent.katagamiNaiUser && step == 4)) {
							if (this.isPantsOnly()) {
								Vue.set(this.$parent, "step", 7);
							} else {
								Vue.set(this.$parent, "step", 5);
							}
						} else if (this.$parent.katagamiNaiUser && step == 5) {
							Vue.set(this.$parent, "step", 7);
						} else if (!this.$parent.katagamiNaiUser && step == 2) {
							if (this.isSkirtOnly()) {
								Vue.set(this.$parent, "step", 6);
							} else {
								Vue.set(this.$parent, "step", 4);
							}
						} else if (!this.$parent.katagamiNaiUser && step == 4) {
							if (this.isPantsOnly()) {
								Vue.set(this.$parent, "step", 6);
							} else {
								Vue.set(this.$parent, "step", 5);
							}
						} else {
							Vue.set(this.$parent, "step", step + 1)
						}
						// var steplimit = this.$parent.stepLimit;
						// if (step < steplimit) {
						// 	Vue.set(this.$parent, "step", step + 1);
						// 	if (this.$parent.katagamiNaiUser && this.$parent.tantouFlg == false && step == 2) {
						// 		Vue.set(this.$parent, "step", 3);
						// 	} else if (this.$parent.tantouFlg == false && step == 2) {
						// 		Vue.set(this.$parent, "step", 5);
						// 	} else if (this.$parent.katagamiNaiUser && this.$parent.tantouFlg == false && step == 3) {
						// 		Vue.set(this.$parent, "step", 5);
						// 	}
						// }
					}
				} else {
					alert('選択されていない項目があります。ご確認ください。');
				}
			} else {
				alert('入力されていない項目があります。お確かめください。');
			}
        },
		emailOpen:function(){
			Vue.set(this.$parent,"emailModalFlg",true)
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
		selectedChecker: function () {
			var checker = true;

			//// console.log('型紙が選択されているかチェックします');

			var checkList = this.selectparts;

			var os = this.$parent.selected.sessions.ordersheet;
			var courses = this.$parent.selected.course;
			var gender = this.$parent.selected.gender;
			if (this.$parent.step == 3 && this.$parent.katagamiNaiUser == false) {
				$.each(checkList, function (key, item) {
					switch (item) {
						case 'jacket':
							if ((os.jacket_size == '' || os.jacket_size == null) && (gender == 'men' && Object.keys(courses['1']).length == 0 || gender == 'women' && Object.keys(courses['5']).length == 0)) {
								//// console.log(item+'が選択されていません');
								checker = false;
							}
							break;
						case 'pants':
							if ((os.slacks_size1 == '' || os.slacks_size1 == null) && (gender == 'men' && Object.keys(courses['3']).length == 0 || gender == 'women' && Object.keys(courses['6']).length == 0)) {
								//// console.log(item+'が選択されていません');
								checker = false;
							}
							break;
						case 'pants2':
							if ((os.slacks_size2 == '' || os.slacks_size2 == null) && (gender == 'men' && Object.keys(courses['3pants2']).length == 0 || gender == 'women' && Object.keys(courses['6pants2']).length == 0)) {
								//// console.log(item+'が選択されていません');
								checker = false;
							}
							break;
						case 'vest':
							if ((os.best_size == '' || os.best_size == null) && (gender == 'men' && Object.keys(courses['2']).length == 0)) {
								//// console.log(item+'が選択されていません');
								checker = false;
							}
							break;
						case 'skirt':
							if ((os.wo_sk_size1 == '' || os.wo_sk_size1 == null) && (gender == 'women' && Object.keys(courses['7']).length == 0)) {
								//// console.log(item+'が選択されていません');
								checker = false;
							}
							break;
						case 'skirt2':
							if ((os.wo_sk_size2 == '' || os.wo_sk_size2 == null) && (gender == 'women' && Object.keys(courses['7skirt2']).length == 0)) {
								//// console.log(item+'が選択されていません');
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
								//// console.log(item+'が選択されていません');
								checker = false;
							}
							break;
						case 'pants':
							if ((gender == 'men' && Object.keys(courses['3']).length == 0 || gender == 'women' && Object.keys(courses['6']).length == 0)) {
								//// console.log(item+'が選択されていません');
								checker = false;
							}
							break;
						case 'pants2':
							if ((gender == 'men' && Object.keys(courses['3pants2']).length == 0 || gender == 'women' && Object.keys(courses['6pants2']).length == 0)) {
								//// console.log(item+'が選択されていません');
								checker = false;
							}
							break;
						case 'vest':
							if ((gender == 'men' && Object.keys(courses['2']).length == 0)) {
								//// console.log(item+'が選択されていません');
								checker = false;
							}
							break;
						case 'skirt':
							if ((gender == 'women' && Object.keys(courses['7']).length == 0)) {
								//// console.log(item+'が選択されていません');
								checker = false;
							}
							break;
						case 'skirt2':
							if ((gender == 'men' && Object.keys(courses['7skirt2']).length == 0)) {
								//// console.log(item+'が選択されていません');
								checker = false;
							}
							break;


					}
				})
			}
			return checker;
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
				// // console.log('dp スーティストです');
			} else {
				// // console.log('dp スーティストではない');
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
					// // console.log('スーティストではないんでDP消します');
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
    }
}
</script>