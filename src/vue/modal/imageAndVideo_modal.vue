<!-- <template lang="pug">
	div.simulator__imageandvideo_modal.simulator__modal
		div.simulator__modal__back(v-on:click="modalCloser")
		div.simulator__modal__wrap
			p.modal_closer
				span(v-on:click="modalCloser") ×
			div(v-if="$parent.ivModalType == 'image'")
				<img :src="$parent.modalImage">
			div(v-if="$parent.ivModalType == 'video'")
				div.movie(v-html="$parent.modalVideo")

</template> -->

<template>
	<div class="simulator-modal">
		<div class="simulator-modal__container" @click.self="modalCloser">
			<div class="simulator-modal__card">
				<header class="simulator-modal__header">
					<button class="modal-close" @click="modalCloser"></button>
				</header>
				<div class="simulator-modal__body">
					<figure class="simulator-modal__image" v-if="$parent.ivModalType == 'image'">
						<img :src="$parent.modalImage" alt="Design Image">
					</figure>
				</div>
			</div>
		</div>
	</div>
</template>

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
			Vue.set(this.$parent,"imageAndVideoModalFlg",false);
		},
	}
};
</script>