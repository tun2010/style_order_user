<template>
	<div class="step-container">
		<ul class="steps" ref="stepsEl">
			<li class="step" v-for="step in steps" :key="step.step" :class="{ active: step.step == getStep }">
				<div class="step-no">{{ step.step }}</div>
				<div class="step-name">
					<span>{{ step.name }}</span><small>{{ step.sub_name }}</small>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
// コンポーネントのtemplateは、一つのタグですべて囲われていなければならん。注意。
//アロー関数では値が取れなくなる場合がある。　hoge:function(){}としろ。
module.exports = {
	data() {
		return {
			steps: [
				{
					'step':1,
					'stepdisp':1,
					'name':'生地',
					'sub_name': 'を選ぶ',
					'user':'all',
					'katagaminaihito':'false',
				},
				{
					'step':2,
					'stepdisp':2,
					'name':'コース',
					'sub_name': 'を選ぶ',
					'user':'all',
					'katagaminaihito':'false',
				},
				{
					'step':3,
					'stepdisp':3,
					'name':'デザイン',
					'sub_name': 'を選ぶ',
					'user':'shop',
					'katagaminaihito':'true',
				},

				{
					'step':4,
					'name':'ボタン',
					'sub_name': 'を選ぶ',
					'user':'shop',
					'katagaminaihito':'false',
				},
				{
					'step':5,
					'stepdisp':4,
					'name':'裏地',
					'sub_name': 'を選ぶ',
					'user':'all',
					'katagaminaihito':'false',
				},
				{
					'step':6,
					'stepdisp':5,
					'name':'オプション',
					'sub_name': 'を選ぶ',
					'user':'all',
					'katagaminaihito':'false',
				},
			],
		}
	},
	computed:{
		getStep:function(){
			return parseInt(this.$parent.step);
		},
	},
	watch: {
		'$parent.step': function(newValue) {
			if (newValue) {
				// console.log('STEP:::::::::::::::::::::::::', newValue);
				window.scrollTo(0, 0);

				setTimeout(() => {
					if (this.$refs.stepsEl) {
						this.$refs.stepsEl.querySelector(".step.active")?.scrollIntoView({
							behavior: 'smooth',
							inline: 'center',
							block: 'nearest'
						});
					}
				}, 5);
			}
		}
	},
	methods:{
		stepChanger:function(target){
			if(this.$parent.clickLocker == false){
			if(this.$parent.debug == 1){
			Vue.set(this.$parent,"step",target);
			// this.$parent.step = target;
			}else{
				alert('ステップを移動する際は下部の next back ボタンをご利用ください');
			}
			}else{
				alert('入力されていない項目があります。お確かめください。');
			}
		}
	}
};
</script>