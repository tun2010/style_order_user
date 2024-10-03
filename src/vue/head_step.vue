<template>
	<div class="step-container">
		<ul class="steps" ref="stepsEl">
			<template v-for="step in steps">
				<li class="step" v-if="isShow(step.step)" :key="step.step" :class="{ active: step.step == getStep }">
					<div class="step-no"></div>
					<div class="step-name">
						<span>{{ step.name }}</span><small>{{ step.sub_name }}</small>
					</div>
				</li>
			</template>
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
					'name':'生地',
					'sub_name': 'を選ぶ',
				},
				{
					'step':2,
					'name':'コース',
					'sub_name': 'を選ぶ',
				},
				{
					'step':3,
					'name':'デザイン',
					'sub_name': 'を選ぶ',
				},

				{
					'step':4,
					'name':'ボタン',
					'sub_name': 'を選ぶ',
				},
				{
					'step':5,
					'name':'裏地',
					'sub_name': 'を選ぶ',
				},
				{
					'step':6,
					'name':'オプション',
					'sub_name': 'を選ぶ',
				},
				{
					'step':7,
					'name':'確認',
					'sub_name': '',
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
				console.log('STEP:::::::::::::::::::::::::', newValue);
				window.scrollTo(0, 0);

				const step = this.steps.find(item => item.step == newValue);
				if (step) {
					console.log(':::::::::::::::::::::', step.name);
					Vue.set(this.$parent, 'stepMessage', step.name);
				}

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
		isShow: function(step) {
			if (this.$parent.katagamiNaiUser) {
				return step != 6 && this.checkCourse(step);
			} else if (!this.$parent.katagamiNaiUser) {
				return ![3].includes(step) && this.checkCourse(step);
			}
		},
		checkCourse(step) {
			if (this.isPantsOnly()) {
				return step != 5;
			} else if (this.isSkirtOnly()) {
				return ![4, 5].includes(step);
			} else if (this.isVestOnly()) {
				return step != 6;
			} else {
				return true;
			}
		},
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