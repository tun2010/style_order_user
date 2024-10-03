<template lang="pug">
	div.simulator__reservation_modal.simulator__modal
		div.simulator__modal__back(v-on:click="modalCloser")
		div.simulator__modal__wrap
			.modal_flex_center
				button.modal_closer(v-on:click="modalCloser")
				p {{kakuhoTarget.product_code_min}}
				p {{kakuhoTarget.name}}
				p.simulator__reservation__select
					input(type='number' v-model='quantity')
					|着
				button.reservation_modal_submiter(
					v-on:click="kakuhoSubmit"
					class="buttons"
				) 確保する
</template>

<script>
// コンポーネントのtemplateは、一つのタグですべて囲われていなければならん。注意。
//アロー関数では値が取れなくなる場合がある。　hoge:function(){}としろ。
module.exports = {
	props: ["uploadpass"],
	data: function () {
		return {
			quantity: 1,
			product_id: this.$parent.kakuhoTarget.product_id,
			stocktani: this.$parent.masters.stocklimit[this.$parent.selected.gender]
		}
	},
	computed: {
		kakuhoTarget: function () {
			// // console.log(this.$parent.kakuhoTarget);
			return this.$parent.kakuhoTarget;
			// return this.$parent.kakuhoTarget;
		}
	},
	methods: {
		modalCloser: function () {
			Vue.set(this.$parent, "kakuhoFlg", false);
		},
		kakuhoSubmit: function () {
			if (this.quantity > 0) {
				const query = {
					quantity: this.quantity * this.stocktani.all,
					product_id: this.product_id,

				};
				let formdata = new URLSearchParams();
				formdata.append('quantity', this.quantity);
				formdata.append('tani', this.stocktani.all);
				formdata.append('product_id', this.product_id);
				formdata.append('shop_id', this.$parent.selected.sessions.base.customize_store);
				formdata.append('tantou_id', this.$parent.selected.sessions.base.customize_employee);
				axios.post("/sandbox/ajaxTool/shopstock_order_regist.php", formdata).then(res => {
					if (res.data.indexOf('在庫が足りません') > -1) {
						alert(res.data);
						return false;
					} else
						if (res.data == "no stock") {
							alert("在庫が足りないため確保できませんでした");
						} else {
							alert("対象生地を確保しました");
							this.$parent.setParam('gender', this.$parent.selected.gender);
							setTimeout(() => {
								location.reload();
							}, 0);
						}
					// console.log(res.data);
				});
			} else {
				alert("数を入力してください");
			}
		}
	}
};
</script>