<!-- <template lang="pug">
	div.simulator__preloader
		img(class="preloader" v-if="$parent.selectedProductData.kiji_image" :src="$parent.uploadPass+$parent.selectedProductData.kiji_image")
		img(class="preloader" v-else src="/images/simulator/default/default_tex.jpg")
</template> -->

<template>
	<div class="simulator__preloader">
		<img class="preloader" v-if="$parent.selectedProductData.kiji_image" @load="$parent.onFabricLoad" :src="$parent.uploadPass + $parent.selectedProductData.kiji_image" alt="Image preloader">
		<img class="preloader" v-else @load="$parent.onFabricLoad" src="/images/simulator/default/default_tex.jpg" alt="Image preloader">
	</div>
</template>

<script>
// コンポーネントのtemplateは、一つのタグですべて囲われていなければならん。注意。
//アロー関数では値が取れなくなる場合がある。　hoge:function(){}としろ。
module.exports = {

};
</script>