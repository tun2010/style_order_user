<template lang="pug">
	div.loadinger
		div.loadinger__wrap
			p loading...
</template>
<style>
	.loadinger{
		position: fixed;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		z-index: 10000;
		background: rgba(255,255,255,0.7);
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 200%;
	}
</style>
<script>
// コンポーネントのtemplateは、一つのタグですべて囲われていなければならん。注意。
//アロー関数では値が取れなくなる場合がある。　hoge:function(){}としろ。
module.exports = { 
	computed:{
		getStep:function(){
			return this.$parent.step;
		}
	},
	methods:{
		stepChanger:function(target){
			Vue.set(this.$parent,"step",target);
			// this.$parent.step = target;
		}
	}
};
</script>