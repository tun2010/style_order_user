<!-- <template lang="pug">
	div.simulator__email_modal.simulator__modal
		div.simulator__modal__back(v-on:click="modalCloser")
		div.simulator__modal__wrap
			p.modal_closer
				span(v-on:click="modalCloser") ×
			p メールアドレスを入力してください。
			p
				input(v-model="address")
			p.centers.flex_centers.buttons.buttons-black.buttons-small(v-on:click="mailSender()")
				i.custom-icons.email
				span 送信する
</template> -->

<template>
	<div class="simulator-modal">
		<div class="simulator-modal__container" @click.self="modalCloser">
			<div class="simulator-modal__card">
				<header class="simulator-modal__header">
					<button class="modal-close" @click="modalCloser"></button>
				</header>
				<div class="simulator-modal__body">
					<div class="simulator-mail__body">
						<div class="mail-input--box">
							<label for="email">メールアドレスを入力してください。</label>
							<input type="email" name="eamil" id="email" v-model="address">
						</div>
						<div class="mail-sender">
							<button class="simu-button simu-button--send-email" @click="mailSender()">
								送信する
							</button>
						</div>
					</div>
				</div>
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
			address: "",
		}
	},
	computed: {
		kakuhoTarget: function () {
			return this.$parent.kakuhoTarget;
			// return this.$parent.kakuhoTarget;
		}
	},
	methods: {
		mailSender() {
			Vue.set(this.$parent, "loading", true);
			let formdata = new URLSearchParams();
			// // console.log(JSON.stringify(this.$parent.selected.sessions.ordersheet));
			// return false;
			formdata.append('email', this.address);
			var sessionData = {};
			sessionData = JSON.parse(JSON.stringify(this.$parent.selected.sessions));
			sessionData = this.$parent.iranaiChecker(sessionData);
			var sessionJson = JSON.stringify(sessionData.ordersheet);
			if (Object.keys(this.$parent.selected.course).length > 0) {
				formdata.append('stylenocourse', JSON.stringify(this.$parent.selected.course));
			} else {
				formdata.append('stylenoid', '');
			}
			formdata.append('sessions', sessionJson);
			axios.post("/ajaxTool/simuMailSend.php", formdata).then(res => {
				// console.log(res.data);
				if (res.data == "mail sended") {
					alert("メールを送信しました");
				} else {
					alert("メール送信に失敗しました");
				}
				Vue.set(this.$parent, "loading", false);
				Vue.set(this.$parent, "emailModalFlg", false);
			});
		},
		modalCloser: function () {
			Vue.set(this.$parent, "emailModalFlg", false);
		},
		// kakuhoSubmit:function(){
		// 	if(this.quantity > 0){
		// 	const query = {
		// 		quantity:this.quantity * this.stocktani.all,
		// 		product_id:this.product_id,

		// 		};
		// 		let formdata = new URLSearchParams();
		// 		formdata.append('quantity',this.quantity * this.stocktani.all);
		// 		formdata.append('product_id',this.product_id);
		// 	axios.post("/ajaxTool/shopstock_order_regist.php",formdata).then(res => {
		// 	if(res.data == "no stock"){
		// 		alert("在庫が足りないため確保できませんでした");
		// 	}else{
		// 	alert("対象生地を確保しました");
		// 	}
		// 	// console.log(res);
		// 	});
		// 	}else{
		// 		alert("数を入力してください");
		// 	}
		// }
	}
};
</script>