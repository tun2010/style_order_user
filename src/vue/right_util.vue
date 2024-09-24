<template lang="pug">
	div.simulator__right_util
		div.scroller(v-on:click='spShitaIdou()')
			img(src='/images/arrow_down.png')
		div.simulator__info
			div.simulator__info__box
				hr
				p(v-if='$parent.step in infoString') {{infoString[$parent.step]}}を選択してください
				hr
		p.buttons.buttons-line.buttons-small.optionOpener(v-on:click="optionOpen()" v-if="$parent.selected.fabric != ''") オプション内容を確認
		p.buttons.buttons-line.buttons-small.viewZentai(v-on:click="zentai()" v-if='$parent.step == 3 && $parent.view != $parent.checkSkPt') 全体を表示
		// p.buttons.buttons-line.buttons-small.viewZentai(v-on:click="zentai2()" v-if='$parent.step == 5 && $parent.view2 != $parent.checkSkPt') 全体を表示
		p.buttons.buttons-line.buttons-small.viewZentai(v-on:click="kakudai()" v-else-if='$parent.step == 3 && $parent.view == $parent.checkSkPt') 拡大表示
		// p.buttons.buttons-line.buttons-small.viewZentai(v-on:click="kakudai2()" v-else-if='$parent.step == 5 && $parent.view2 == $parent.checkSkPt') 拡大表示
		p.buttons.buttons-line.buttons-small.mailSender(v-on:click="emailOpen()") 
			span シミュレーション内容をメールで送信
		// ul.parts_selector()
		// 	li(:class="{'active':selectImageDisp == 'jacket'}")
		// 		span(v-on:click="partsSelect('jacket')") JACKET
		// 	li(:class="{'active':selectImageDisp == 'pants'}")
		// 		span(v-on:click="partsSelect('pants')") PANTS
		// 	li(:class="{'active':selectImageDisp == 'vest'}")
		// 		span(v-on:click="partsSelect('vest')") VEST
</template>

<script>
// コンポーネントのtemplateは、一つのタグですべて囲われていなければならん。注意。
//アロー関数では値が取れなくなる場合がある。　hoge:function(){}としろ。
module.exports = {
	data:function(){
		return {
			infoString:{
				1:'生地',
				2:'コース',
				3:'デザイン',
				5:'オプション',

			},
			
		}
	},
	computed:{
		selectImageDisp:function(){
			return this.$parent.selectImageDisp;
		},
		
	},
	methods:{
		spShitaIdou:function(){
      var target = $('.simulator__left').offset().top;
	  $(window).scrollTop(target);
      console.log(target);
    },
		partsSelect:function(parts){
			Vue.set(this.$parent,"selectImageDisp",parts);
		},
		emailOpen:function(){
			Vue.set(this.$parent,"emailModalFlg",true)
		},
		optionOpen:function(){
			Vue.set(this.$parent,"optionModalFlg",true)
		},
		zentai:function(){
			Vue.set(this.$parent,'view',this.$parent.checkSkPt)
		},
		kakudai:function(){
			Vue.set(this.$parent,'view','')
		},
		zentai2:function(){
			Vue.set(this.$parent,'view2',this.$parent.checkSkPt)
		},
		kakudai2:function(){
			Vue.set(this.$parent,'view2','')
		},
	}
};
</script>