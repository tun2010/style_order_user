<template lang="pug">
	div.simulator__selected_window
		dl
			dt タイトル
			dd 選択した項目や値
</template>

<script>
// コンポーネントのtemplateは、一つのタグですべて囲われていなければならん。注意。
//アロー関数では値が取れなくなる場合がある。　hoge:function(){}としろ。
module.exports = {
	props:["uploadpass"]
};
</script>