<template lang="pug">
	div.simulator__confirm
		div.simulator__confirm__wrap(v-if="productDataLoad && masterDataLoad")
			figure.simulator__confirm__image
				img( v-if="productData[selectedFabric].kiji_image",v-bind:src="$parent.uploadPass+productData[selectedFabric].kiji_image")
			div.simulator__confirm__info
				p
					span {{productData[selectedFabric].product_code_min}}
					span / 
					span(v-if="productData[selectedFabric].maker_id > 0") {{masters[productData[selectedFabric].maker_id].name}}
				p {{productData[selectedFabric].name}}
				p.simulator__confirm__info__price ￥{{totalPrice}}
					span (税込)
				p.simulator__confirm__info__content {{productData[selectedFabric].main_list_comment}}
				div.simulator__confirm__info__buttons
					p
						span.buttons.buttons-brown オーダー内容を確認
					p
						span.buttons.buttons-brown サイズを確認
</template>

<script>
// コンポーネントのtemplateは、一つのタグですべて囲われていなければならん。注意。
//アロー関数では値が取れなくなる場合がある。　hoge:function(){}としろ。
module.exports = {
	data: function () {
    return {
      productDataLoad: this.$parent.productDataLoad,
	  masterDataLoad: this.$parent.masterDataLoad,
    }
	},
	watch:{
		'$parent.productDataLoad':function(v,ov){
				this.productDataLoad = v;
		},
		'$parent.masterDataLoad':function(v,ov){
				this.masterDataLoad = v;
		}
	},
	computed:{
		axiosChecker:function(){
			
		},
		totalPrice:function(){
			return this.$parent.totalPriceCalc;
		},
		masters:function(){
			return this.$parent.masters.maker;
		},
		mastersLine:function(){
			return this.$parent.masters.line;
		},
		selectedFabric:function(){
			return this.$parent.selected.fabric;
		},
		productData:function(){
			return this.$parent.productData;
		},
		lineChecker:function(){
			return this.$parent.lineChecker;
		}
	},
	mounted:function(){
		if(this.$parent.productDataLoad){
			this.productDataLoad = true;
		}
		if(this.$parent.productDataLoad){
			this.masterDataLoad = true;
		}
	},

};
</script>