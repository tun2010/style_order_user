<template lang="pug">
div.simulator__sort_modal.simulator__modal
	div.simulator__modal__back(v-on:click="modalCloser")
	div.simulator__modal__wrap
		div.modal_close_container
			p.modal_closer(v-on:click="modalCloser")
		div.modal_scroll_container
			div.sort_set
				p.sort_set__title
					span 価格
					span.small から
					span 選ぶ
				ul(data-target="price")
					li(:data-id="key" v-for="(item,key) in $parent.masters.line" v-on:click="sortItemClick(key,'price')" :class="{checked: selectedSort.price.indexOf(key) >= 0}")
						span.checkboxDisp
							//- i.material-icons(v-if="selectedSort.price.indexOf(key) >= 0") check
						span {{item.name}}
			div.sort_set
				p.sort_set__title
					span カラー
					span.small から
					span 選ぶ
				ul(data-target="color")
					li(:data-id="key" v-for="(item,key) in $parent.masters.colors" v-on:click="sortItemClick(key,'color')" :class="{checked: selectedSort.color.indexOf(key) >= 0}")
						span.checkboxDisp
							//- i.material-icons(v-if="selectedSort.color.indexOf(key) >= 0") check
						span.maru(:style="'background:'+item.hex" v-bind:class='"maru"+key')
						span {{item.name}}
			div.sort_set
				p.sort_set__title
					span 柄
					span.small から
					span 選ぶ
				ul(data-target="gara")
					li(:data-id="key" v-for="(item,key) in $parent.masters.gara" v-on:click="sortItemClick(key,'pattern')" :class="{checked: selectedSort.pattern.indexOf(key) >= 0}")
						span.checkboxDisp
							//- i.material-icons(v-if="selectedSort.pattern.indexOf(key) >= 0") check
						span {{item}}
			div.sort_set
				p.sort_set__title
					span シーズン
				ul(data-target="season")
					li(:data-id="item.category_id" v-for="(item,key) in $parent.masters.season" v-on:click="sortItemClick(item.category_id,'season')" :class="{checked: selectedSort.season.indexOf(item.category_id) >= 0}")
						span.checkboxDisp
							//- i.material-icons(v-if="selectedSort.season.indexOf(item.category_id) >= 0") check
						span {{item.category_name}}
			div.sort_set
				p.sort_set__title
					span 生地特性
				ul(data-target="function")
					li(data-id="washable" v-on:click="sortItemClick('washable','function')" :class="{checked: selectedSort.function.indexOf('washable') >= 0}")
						span.checkboxDisp
							//- i.material-icons(v-if="selectedSort.function.indexOf('washable') >= 0") check
						span ウォッシャブル対応
					li(data-id="pleats" v-on:click="sortItemClick('pleats','function')" :class="{checked: selectedSort.function.indexOf('pleats') >= 0}")
						span.checkboxDisp
							//- i.material-icons(v-if="selectedSort.function.indexOf('pleats') >= 0") check
						span プリーツ安定対応
					li(data-id="jacket" v-on:click="sortItemClick('jacket','function')" :class="{checked: selectedSort.function.indexOf('jacket') >= 0}")
						span.checkboxDisp
							//- i.material-icons(v-if="selectedSort.function.indexOf('jacket') >= 0") check
						span ジャケット / ベスト専用生地
		div.flex_top
			p.buttons.icon-end.sort_modal-button(v-on:click="sortSubmiter()") 絞り込む

</template>
<style>
.maru{
	width:1rem;
	height:1rem;
	display:block;
	margin-left:0.5em;
	border-radius:50%;
	position:relative;
	overflow:hidden;
}
.maru0001{
	background:#f1f1f1 !important;
}
.maru0001:after{
	content:'';
	background:#000000;
	height:100%;
	width:100%;
	left:-50%;
	position:absolute;
	z-index:2;
}
</style>
<script>
// コンポーネントのtemplateは、一つのタグですべて囲われていなければならん。注意。
//アロー関数では値が取れなくなる場合がある。　hoge:function(){}としろ。
module.exports = {
	props:["uploadpass"],
	data: function () {
    return {
      address:"",
	  selectedSort: {
		  price:[],
		  color:[],
		  pattern:[],
		  season:[],
		  function:[]
	  },
    }
	},
	computed:{

	},
	mounted() {
		this.selectedSort = this.$parent.selectedSort;
	},
	methods:{
		modalCloser:function(){
			Vue.set(this.$parent,"sortFlg",false);
		},
		//ソートアイテムをクリックした時
		sortItemClick:function(key,target){
			if(this.selectedSort[target].indexOf(key) == -1){
			this.selectedSort[target].push(key);
			}else{
				this.selectedSort[target].splice(this.selectedSort[target].indexOf(key),1);
			}
			Vue.set(this.$parent, 'selectedSort', this.selectedSort);
		},
		sortSubmiter:function(){
			Vue.set(this.$parent,'loading',true);
			// 商品読み込み
			// console.log(this.selectedSort);
			// return false;
				const query = {
				headers: {
					"content-Type": "application/json;charset=UTF-8"
				},
				params:{
					price:this.selectedSort.price,
					color:this.selectedSort.color,
					pattern:this.selectedSort.pattern,
					season:this.selectedSort.season,
					gender:this.$parent.selected.gender,
					suitist:this.$parent.selected.suitist,
					selectedFabric:this.$parent.selected.fabric,
					function:this.selectedSort.function,
					sorts:true,
				}
				};
				axios.get("/sandbox/ajaxTool/getItems.php", query).then(res => {
				var data = res.data;
				// var selectedData = this.$parent.productData[this.$parent.selected.fabric];
				// Vue.set(this.$parent,"selectedProductData", selectedData);
				// data[this.$parent.selected.fabric] = selectedData;


				//ステータスっぽいのいらんので削除
				delete res.data.productStatus;
				this.$parent.productData = data;
				this.$parent.dataload = true;
				Vue.set(this.$parent,"sortFlg",false);
				Vue.set(this.$parent,'loading',false);
				});

		}
	}
};
</script>