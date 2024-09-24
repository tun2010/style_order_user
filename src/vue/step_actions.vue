<template>
    <div class="step-actions">
        <button class="action-button action-button--prev" @click="prev">戻る</button>
        <button class="action-button action-button--next" @click="next">次へ</button>
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
        prev() {
            const step = this.$parent.step;
			if (this.$parent.clickLocker == false) {
				if (step >= 1) {
					Vue.set(this.$parent, "step", step - 1);
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
						Vue.set(this.$parent, "step", step + 1)
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
    }
}
</script>