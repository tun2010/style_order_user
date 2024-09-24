<!-- <template lang="pug">
	div.simulator__total_price(:class="{'add_width': 'optionset_name' in optionCourseDetails && $parent.step >= 5}")
		div.simulator__total_price_flexer
			p
				span 合計金額
				span.total_price__disp {{totalPrice | pricer}}
				span 円（税込）
			p.flex_center(v-if='"optionset_name" in optionCourseDetails && $parent.step >= 5' v-on:click='optionsetModalOpen')
				span {{optionCourseDetails.optionset_name}}
				span(v-if='$parent.selected.optionCoursePrice != null') ￥{{$parent.selected.optionCoursePrice}}
</template> -->

<template>
	<div class="noti-container">
		<div class="price-container">
			<div class="main-price">
				合計金額
				<span class="price">{{ totalPrice | pricer }}</span>
				円（税込）
			</div>
			<div class="extra-price">
				スーツ上下の価格
			</div>
		</div>
		<div class="action-container">
			<button class="style-button icon-end" @click="optionsetModalOpen">注文内容を確認</button>
		</div>
	</div>
</template>

<script>
// コンポーネントのtemplateは、一つのタグですべて囲われていなければならん。注意。
//アロー関数では値が取れなくなる場合がある。　hoge:function(){}としろ。
module.exports = {
	computed:{
		totalPrice:function(){
			return this.$parent.totalPriceCalc;
		},
		optionCourseDetails:function(){
			return this.$parent.selected.optionCourseDetails;
		}
	},
	methods:{
		optionsetModalOpen:function(){
			Vue.set(this.$parent,'optionsetModalFlg',true);
		}
	}
};
</script>