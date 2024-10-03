

<template lang="pug">
	div
		p test2
</template>

<script>
// コンポーネントのtemplateは、一つのタグですべて囲われていなければならん。注意。
//アロー関数では値が取れなくなる場合がある。　hoge:function(){}としろ。
module.exports = {
	props:["lad"],
	data:()=>{
		return {
		test:"asdfas"
		}
	},
    computed: {
        msg: function () {
            return "test";
        },
		ladtest:function(){
			// console.log(this.lad);
			// console.log("↑");
			return this.lad.getOnlineCustomerCard;
		}
    },
	mounted:function(){
			// console.log("sss");
	}
};
</script>
