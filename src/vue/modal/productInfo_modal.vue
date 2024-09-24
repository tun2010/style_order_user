<!-- <template lang="pug">
	div.simulator__productinfo_modal.simulator__modal
		div.simulator__modal__back(v-on:click="modalCloser")
		div.simulator__modal__wrap
			div.modal_close_container
				p.modal_closer(v-on:click="modalCloser")
			div.modal_scroll_container
				div.flexer.info__flexer
					figure
						img(:src="$parent.uploadPass+targetProduct.main_image")
					div.productinfo__info
						p.productinfo__info__maker {{targetProduct.product_code_min}} /
							span {{targetProduct.name}}
						//- p.productinfo__info__maker {{targetProduct.product_code_min}} /
						//- 	span(v-if="masters[targetProduct.maker_id]") {{masters[targetProduct.maker_id].name}}
						//- p.productinfo__info__name {{targetProduct.name}}
						p.productinfo__info__price
							span.name 標準
							span  {{ getPriceString(mastersLine, targetProduct, lineChecker) }}
							small  円(税込)
						div.prodcut__list__iconset
								p(v-if="targetProduct.check_washable == true")
									span.product__list__icon.icon_mizuiro
									span ウォッシャブル
								p(v-if="targetProduct.check_pleats == true")
									span.product__list__icon.icon_gray
									span プリーツ
						p.productinfo__info__content {{targetProduct.main_list_comment}}


</template> -->

<template>
	<div class="simulator-modal">
		<div class="simulator-modal__container" @click.self="modalCloser">
			<div class="simulator-modal__card">
				<header class="simulator-modal__header">
					<button class="modal-close" @click="modalCloser"></button>
				</header>
				<div class="simulator-modal__body">
					<div class="product-info">
						<figure>
							<img v-if="targetProduct.main_image" :src="$parent.uploadPass + targetProduct.main_image" alt="Fabric Image">
							<img v-else src="/images/noimage.png" alt="Frabic Image">
						</figure>
						<div class="product-info__detail">
							<h3>{{targetProduct.product_code_min}} / {{targetProduct.name}}</h3>
							<div class="price">
								標準
								<span>{{ getPriceString(mastersLine, targetProduct, lineChecker) }}</span>
								<small>円(税込)</small>
							</div>
							<div class="laundry-status">
								<div class="status wishable" v-if="targetProduct.check_washable">ウォッシャブル</div>
								<div class="status pleats" v-if="targetProduct.check_pleats">ウォッシャブル</div>
							</div>
							<div class="product-detail">{{ targetProduct.main_list_comment }}</div>
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
	props:["uploadpass"],
	data: function () {
    return {
      address:"",
    }
	},
	computed:{
		targetProduct:function(){
			return this.$parent.productData[this.$parent.productInfoTarget];
		},
		masters:function(){
			return this.$parent.masters.maker;
		},
		mastersLine:function(){
			return this.$parent.masters.line;
		},
		lineChecker:function(){
			return this.$parent.lineChecker;
		}
	},
	methods:{
		modalCloser:function(){
			Vue.set(this.$parent,"productInfoFlg",false);
		},
		getPriceString: function (mastersLine, targetProduct, lineChecker) {
			const line = mastersLine[targetProduct[lineChecker]];
			if (!line) return "";

			if (line.name) {
				return line.name.replace("標準 ￥", "")
					.replace('￥', '').replace('(税込み)', '');
			}
			return "";
		}
	}
};
</script>