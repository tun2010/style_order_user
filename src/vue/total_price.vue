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
			<div class="main-price" v-if="!$parent.katagamiNaiUser || $parent.step != 1">
				合計金額
				<span class="price">{{ totalPrice | pricer }}</span>
				円（税込）
			</div>
			<div class="extra-price" v-if='"optionset_name" in optionCourseDetails && $parent.step >= 4 && isOptionPrice' v-on:click='optionsetModalOpen'>
				<span>{{optionCourseDetails.optionset_name}}</span>
				<span>￥{{addTax($parent.selected.optionCoursePrice)}}</span>
				<small>円（税込）</small>
			</div>
		</div>
		<div class="action-container">
			<div class="prodcts-explain">
				<div class="explain wishable" v-if="$parent.step == 1">ウォッシャブル</div>
				<div class="explain pleats" v-if="$parent.step == 1">プリーツ</div>
			</div>
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
		},
		isOptionPrice() {
			return !!parseFloat(this.$parent.selected.optionCoursePrice);
		}
	},
	methods:{
		addTax(data, rate = 10) {
			const amount = parseFloat(data);
			const taxRate = rate * 0.01;
			const totalAmount = amount + (amount * taxRate);
			return totalAmount;
		},
		optionsetModalOpen:function(){
			Vue.set(this.$parent,'optionModalFlg',true);
		}
	}
};
</script>