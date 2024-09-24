<template lang="pug">
	div.simulator__katagamiinfo_modal.simulator__modal
		div.simulator__modal__back(v-on:click="modalCloser")
		div.simulator__modal__wrap
			p.modal_closer
				span(v-on:click="modalCloser") ×
			div()
				p {{$parent.katagamiInfoText}}
				
			
</template>
<style>
	.simulator__katagamiinfo_modal .simulator__modal__wrap{
		max-width:800px;
	}
</style>
<script>
// コンポーネントのtemplateは、一つのタグですべて囲われていなければならん。注意。
//アロー関数では値が取れなくなる場合がある。　hoge:function(){}としろ。
module.exports = {
	props:["uploadpass"],
	data: function () {
    return {
      address:"",
    }
	},
	computed:{
		kakuhoTarget:function(){
			return this.$parent.kakuhoTarget;
			// return this.$parent.kakuhoTarget;
		}
	},
	methods:{
		modalCloser:function(){
			Vue.set(this.$parent,"katagamiInfoFlg",false);
		},
	}
};
</script>