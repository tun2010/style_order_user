<template lang="pug">
	div.simulator__sizeselect_modal.simulator__modal
		div.simulator__modal__back(v-on:click="modalCloser")
		div.simulator__modal__wrap
			p.modal_closer
				span(v-on:click="modalCloser") ×
			div(v-if="sizeDataLoad")
				div.sizeList(v-if="'size' in sizeData.data")
					template(v-for="(baseitem,basekey) in sizeData.cntOption")
						p.size-title
							span(v-if="baseitem in sizeData.data.size") {{sizeData.data.size[baseitem]}}
						table
							tr
								th NO
								th(v-for="item in sizeData.cols[targetCategory]")
									span {{sizeData.colsNihongo[item]}}
							tr(v-for="n in sizeData.kaisu[gender]")
								td(v-if="gender == 1")
									span.buttons.buttons-tatesmall(v-on:click="sizeSubmit(targetCategory,baseitem,n-1)") {{sizeData.data.size[baseitem]}}-{{n-1}}
								td(v-else-if="gender == 2")
									span.buttons.buttons-tatesmall(v-on:click="sizeSubmit(targetCategory,baseitem,n-1)") {{sizeData.radiesSize[n-1]}}
								td(v-for="(item,key) in sizeData.cols[targetCategory]" v-if="item in sizeData.data")
									input(v-if="baseitem in sizeData.data[item] && n-1 in sizeData.data[item][baseitem]" :value="sizeData.data[item][baseitem][n-1]" readonly)
									span(v-else) データなし
				div.sizeList(v-else)
					p サイズが登録されていません
			div(v-else)
				p 対応サイズをロード中・・
</template>

<script>
// コンポーネントのtemplateは、一つのタグですべて囲われていなければならん。注意。
//アロー関数では値が取れなくなる場合がある。　hoge:function(){}としろ。
module.exports = {
	props:["uploadpass"],
	data: function () {
    return {
      sizeDataLoad:false,
	  sizeData:{},
	//   targetCategory:this.$parent.c3Category;
	//   男性１、女性２
	gender:this.$parent.selected.sessions.ordersheet.sex,
    }
	},
	computed:{
		targetProductData:function(){
			return this.$parent.productData[this.product_id];
		},
		targetCategory:function(){
			var t = this.$parent.c3Category;
			if(t == 1 || t == 5){
				return "jacket";
			}else if(t == 3 || t == 6){
				return "pants";
			}else if(t == 2){
				return "vest";
			}else if(t == 7){
				return "skirt";
			}
		}
	},
	methods:{
		modalCloser:function(){
			Vue.set(this.$parent,"sizeSelectModalFlg",false);
		},
		sizeSubmit:function(targetCategory,targetBase,targetNum){

			if(this.gender == 1){
			if(targetCategory == "jacket"){
				// Vue.set(this.$parent.selected.baseSize.jacket,"baseNum",targetBase);
				// Vue.set(this.$parent.selected.baseSize.jacket,"targetNum",targetNum);
				Vue.set(this.$parent.selected.sessions.ordersheet,"jacket_size",this.sizeData.data.size[targetBase]+"-"+[targetNum]);
				Vue.set(this.$parent.selected.sessions.ordersheet,"kitake",this.sizeData.data["kitake"][targetBase][targetNum]);
				Vue.set(this.$parent.selected.sessions.ordersheet,"sodetake_left",this.sizeData.data["sodetake_left"][targetBase][targetNum]);
				Vue.set(this.$parent.selected.sessions.ordersheet,"sodetake_right",this.sizeData.data["sodetake_left"][targetBase][targetNum]);
				Vue.set(this.$parent.selected.sessions.ordersheet,"ja_shoulder",this.sizeData.data["ja_shoulder"][targetBase][targetNum]);
				Vue.set(this.$parent.selected.sessions.ordersheet,"waist",this.sizeData.data["waist"][targetBase][targetNum]);
			}else if(targetCategory == "pants"){

				var subs = this.$parent.sub;
				var subNum = 1;
				if(subs == "pants2"){
					subNum = 2;
				}
				// Vue.set(this.$parent.selected.baseSize["pants"+subNum],"baseNum",targetBase);
				// Vue.set(this.$parent.selected.baseSize["pants"+subNum],"targetNum",targetNum);
				Vue.set(this.$parent.selected.sessions.ordersheet,"slacks_size"+subNum,this.sizeData.data.size[targetBase]+"-"+[targetNum]);
				Vue.set(this.$parent.selected.sessions.ordersheet,"waist_"+subNum,this.sizeData.data["waist_1"][targetBase][targetNum]);
				Vue.set(this.$parent.selected.sessions.ordersheet,"susohaba"+subNum,this.sizeData.data["susohaba1"][targetBase][targetNum]);
				Vue.set(this.$parent.selected.sessions.ordersheet,"watarihaba"+subNum,this.sizeData.data["watarihaba1"][targetBase][targetNum]);
			}else if(targetCategory == "vest"){
				// Vue.set(this.$parent.selected.baseSize.vest,"baseNum",targetBase);
				// Vue.set(this.$parent.selected.baseSize.vest,"targetNum",targetNum);
				Vue.set(this.$parent.selected.sessions.ordersheet,"vest_size",this.sizeData.data.size[targetBase]+"-"+[targetNum]);
				Vue.set(this.$parent.selected.sessions.ordersheet,"bestsetake",this.sizeData.data["bestsetake"][targetBase][targetNum]);
			}
			//女性↓
			}else if(this.gender == 2){
				if(targetCategory == "jacket"){
					// Vue.set(this.$parent.selected.baseSize.jacket,"baseNum",targetBase);
					// Vue.set(this.$parent.selected.baseSize.jacket,"targetNum",targetNum);
					Vue.set(this.$parent.selected.sessions.ordersheet,"jacket_size",this.sizeData.radiesSize[targetNum]);
					Vue.set(this.$parent.selected.sessions.ordersheet,"kitake",this.sizeData.data["kitake"][targetBase][targetNum]);
				Vue.set(this.$parent.selected.sessions.ordersheet,"sodetake_left",this.sizeData.data["sodetake_left"][targetBase][targetNum]);
				Vue.set(this.$parent.selected.sessions.ordersheet,"sodetake_right",this.sizeData.data["sodetake_left"][targetBase][targetNum]);
				Vue.set(this.$parent.selected.sessions.ordersheet,"ja_shoulder",this.sizeData.data["ja_shoulder"][targetBase][targetNum]);
				Vue.set(this.$parent.selected.sessions.ordersheet,"waist",this.sizeData.data["waist"][targetBase][targetNum]);
				}else if(targetCategory == "pants"){
				var subs = this.$parent.sub;
				var subNum = 1;
				if(subs == "pants2"){
					subNum = 2;
				}
				// Vue.set(this.$parent.selected.baseSize["pants"+subNum],"baseNum",targetBase);
				// Vue.set(this.$parent.selected.baseSize["pants"+subNum],"targetNum",targetNum);
				Vue.set(this.$parent.selected.sessions.ordersheet,"slacks_size"+subNum,this.sizeData.radiesSize[targetNum]);
				Vue.set(this.$parent.selected.sessions.ordersheet,"waist_"+subNum,this.sizeData.data["waist_1"][targetBase][targetNum]);
				Vue.set(this.$parent.selected.sessions.ordersheet,"susohaba"+subNum,this.sizeData.data["susohaba1"][targetBase][targetNum]);
				Vue.set(this.$parent.selected.sessions.ordersheet,"watarihaba"+subNum,this.sizeData.data["watarihaba1"][targetBase][targetNum]);
			}else if(targetCategory == "skirt"){
				var subs = this.$parent.sub;
				var subNum = 1;
				if(subs == "skirt2"){
					subNum = 2;
				}
				// Vue.set(this.$parent.selected.baseSize["skirt"+subNum],"baseNum",targetBase);
				// Vue.set(this.$parent.selected.baseSize["skirt"+subNum],"targetNum",targetNum);
				Vue.set(this.$parent.selected.sessions.ordersheet,"wo_sk_size"+subNum,this.sizeData.radiesSize[targetNum]);
				Vue.set(this.$parent.selected.sessions.ordersheet,"wo_skirt_"+subNum,this.sizeData.data["wo_skirt_1"][targetBase][targetNum]);
				Vue.set(this.$parent.selected.sessions.ordersheet,"wo_waist_"+subNum,this.sizeData.data["wo_waist_1"][targetBase][targetNum]);
			}
			}
			// console.log(this.$parent.selected);
			alert("サイズを選択しました.");
			Vue.set(this.$parent,"sizeSelectModalFlg",false);
		}
	},
	mounted:function(){
		const query = {
			headers: {
				"content-Type": "application/json;charset=UTF-8"
			},
			params: {
					gender:this.$parent.selected.sessions.ordersheet.sex,
					pattern_id:this.$parent.selectedKatagamiId
				}
			};
			var thista = this;
			axios.get("/sandbox/ajaxTool/getKatagamiSize.php", query).then(res => {
				// // console.log(res.data);
				thista.sizeData = res.data;
				thista.sizeDataLoad = true;
				// console.log("ロードしたサイズ↓")
				// console.log(thista.sizeData);
			})
	}
};
</script>