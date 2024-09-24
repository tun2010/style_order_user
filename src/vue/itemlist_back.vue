<template lang="pug">
	div.simulator__selector
		div.selector__gender_selector
			ul()
				li(v-on:click="genderChanger('men',1)" v-if="$parent.katagamiNaiUser == true || $parent.tantouFlg == true")
					span.buttons(:class="{'buttons-black':selectedGender == 'men','buttons-line':selectedGender == 'women'}") MEN's
				li(v-on:click="genderChanger('women',2)" v-if="$parent.katagamiNaiUser == true || $parent.tantouFlg == true")
					span.buttons(:class="{'buttons-black':selectedGender == 'women','buttons-line':selectedGender == 'men'}") LADIES'
				li(v-if="tantouflg == true" v-on:click="proInit()")
					span.buttons(:class="{'buttons-black':kakuhoListFlg == false,'buttons-line':kakuhoListFlg == true}") 全生地一覧
				li(v-on:click="kakuhoProductsList()" v-if="tantouflg == true")
					span.buttons(:class="{'buttons-black':kakuhoListFlg == true,'buttons-line':kakuhoListFlg == false}") 確保済み生地
		div.product__list
			p(v-if='$parent.tantouFlg && kakuhoListFlg == false') ※生地番号検索は入力した瞬間反映されます
			div.sorter_flexer
				div.product__list__sorter2(v-if='$parent.tantouFlg && kakuhoListFlg == false')
					
					div.sorter2__flexer 
						input(type='text' v-model='sorter2' placeholder='生地番号検索')
						//span.buttons.buttons-black(v-on:click="sorter2run()") 検索
				div.product__list__sorter(v-if="kakuhoListFlg == false")
					span.buttons.buttons-black(v-on:click="sortOpen()") 絞り込み
			ul(v-if="kakuhoListFlg == false")
				li(v-for="product in productdata" v-bind:data-productid="product.product_id" v-bind:class="{'active':selectedFabric == product.product_code_min}" v-if="(suitister(product) && (Math.floor(product.stock_min / stocktani.all) > 0 || product.stock_unlimited_max == 1) && ((selectedGender == 'women' && product.ladiesline != null) || selectedGender == 'men')) && ((product.kiji_disp != false && product.kiji_disp.indexOf($parent.dispTypeChecker) > -1) || $parent.dispTypeChecker == '999999') && sorter2run(product)")
					img(class="product__list__preload_image" v-if="product.kiji_image",v-bind:src="uploadpass+product.kiji_image")
					img(class="product__list__preload_image" v-else="product.kiji_image",src="/images/noimage.png")
					figure(v-on:click="itemClick(product.product_id)")
						div.prodcut__list__iconset
							span.product__list__icon.icon_mizuiro(v-if="product.check_washable == true") W
							span.product__list__icon.icon_gray(v-if="product.check_pleats == true") P
						img(v-if="product.main_image",v-bind:src="uploadpass+product.main_image")
						img(v-else="product.kiji_image",src="/images/noimage.png")
					p.product__list__info_opener(v-on:click="productInfoOpen(product.product_id)") INFO
					p.kakuho(v-if="tantouflg == true" v-on:click="kakuhoOpen(product.product_id)") 在庫確保
					div.product__list__data(v-on:click="itemClick(product.product_id)")
						p.product__list__data__maker {{product.product_code_min}}
						p.product__list__data__name {{product.name}}
						p.product__list__data__price {{mastersLine[product[lineChecker]].name}}
						div.product__list__nokori(v-if="tantouflg == true")
							p(v-if="product.stock_unlimited_max != 1") {{Math.floor(product.stock_min / stocktani.all)}}着
							p(v-else) 無制限
			// 確保済アイテム一覧↓				
			ul(v-else)
				li(v-for="product in kakuhoProduct" v-bind:data-productid="product.productdata.product_id" v-bind:class="{'active':selectedFabric == product.productdata.product_code_min}" v-if="")
					img(class="product__list__preload_image" v-if="product.productdata.kiji_image",v-bind:src="uploadpass+product.productdata.kiji_image")
					img(class="product__list__preload_image" v-else="product.productdata.kiji_image",src="/images/noimage.png")
					figure(v-on:click="kakuhoitemClick(product)")
						div.prodcut__list__iconset
							span.product__list__icon.icon_mizuiro(v-if="product.productdata.check_washable == true") W
							span.product__list__icon.icon_gray(v-if="product.productdata.check_pleats == true") P
						img(v-if="product.productdata.kiji_image",v-bind:src="uploadpass+product.productdata.kiji_image")
						img(v-else="product.productdata.kiji_image",src="/images/noimage.png")

					div.product__list__data(v-on:click="kakuhoitemClick(product)")
						p.product__list__data__maker {{product.productdata.product_code_min}} / 
							span(v-if="masters[product.productdata.maker_id]") {{masters[product.productdata.maker_id].name}}
						p.product__list__data__name {{product.productdata.name}}
						p.product__list__data__price {{mastersLine[product.productdata[lineChecker]].name}}
						div.product__list__nokori(v-if="tantouflg == true")
							p 
								select( v-on:change="kakuhoKazuChange(product,$event)")
									option(v-bind:value="n" v-for="n in optionCreater(product.kazu)") {{n}}
								// input(type="number" v-bind:value="product.kazu" v-bind:max="product.kazu" v-on:change="kakuhoKazuChange(product,$event)")
								|着

					

					
</template>

<script>
// コンポーネントのtemplateは、一つのタグですべて囲われていなければならん。注意。
//アロー関数では値が取れなくなる場合がある。　hoge:function(){}としろ。

//ワキタ工場の前寸があるユーザー（店舗じゃないユーザー）は、ワキタ工場の生地しか出さない
//ワキタ工場以外の前寸があるユーザー（店舗じゃないユーザー）は、ワキタ工場以外の生地しか出さない
module.exports = {
	data:function(){
		return {
			// stocktani:this.$parent.masters.stocklimit[this.$parent.selected.gender],
			kakuhoListFlg:false,
			kakuhoProduct:{},
			sorter2:'',
		}
	},
	mounted:function(){
		// console.log(this.productdata);
	},
	props:["productdata","tantouflg","uploadpass"],
	computed:{
		stocktani:function(){
			if(this.$parent.selected.gender != ""){
				return this.$parent.masters.stocklimit[this.$parent.selected.gender];
			}else{
				return this.$parent.masters.stocklimit["men"];
			}
		},
		masters:function(){
			return this.$parent.masters.maker;
		},
		mastersLine:function(){
			return this.$parent.masters.line;
		},
		selectedFabric:function(){
			return this.$parent.selected.sessions.ordersheet.cloth_no;
		},
		selectedGender:function(){
			return this.$parent.selected.gender;
		},
		lineChecker:function(){
			return this.$parent.lineChecker;
		}
	},
	methods:{
		optionCreater:function(num){
			var count = num;
			var countList = [];
			for(i=count;i>=0;i--){
				countList.push(i);
			}
			console.log(countList);
			return countList;
		},
		kakuhoKazuChange:function(product,event){
			console.log(product);
			var productJson = JSON.stringify(product);
			var value = parseInt(event.target.value);
			var sa = parseInt(product.kazu) - value;
			// var tani = 5.4;
			let formdata = new URLSearchParams();
				formdata.append('product',productJson);
				formdata.append('sa',sa);
				
			console.log('sa '+ sa);
			axios.post("/ajaxTool/kazuHerasuKakuhoItems.php",formdata).then(res => {
				console.log(res.data);
				if(res.data == 'ok'){
					alert('対象生地の確保数を変更しました。画面をリロードします。');
					window.location.reload();
				}else{
					alert('エラーが発生しました。');
					window.location.reload();
				}
			});


		},
		sorter2run:function(product){
			var text = this.sorter2;
			var texts = [];
			if(text.match(/[ |　]+/g) != null && text.match(/[ |　]+/g).length > 0){
				texts = text.split(/[ |　]+/g);
			}else{
				texts[0] = text;
			}

			if(texts[0] != ''){
			if(texts.indexOf(product.product_code_min) > -1){
				return true;
			}
			return false;
			}else{
				return true;
			}
		},
		//スーティスト店舗で中国工場製品ださんやつ
		suitister:function(product){
			if(this.$parent.selected.suitist && product.factory == "4423"){
				console.log("スーティスト＋中国工場なので排除"+product.product_id);
				return false;
			}
			return true;
		},
		proInit:function(){
			this.$parent.productDataInit();
			this.kakuhoListFlg = false;
		},
		kakuhoProductsList:function(){
			this.kakuhoListFlg = true;
			
			const query = {
        headers: {
          "content-Type": "application/json;charset=UTF-8"
        },
        params: {
            shop_id:this.$parent.selected.sessions.base.customize_store,
			tantou_id:this.$parent.selected.sessions.base.customize_employee,
          }
        };
        var thista = this;
        axios.get("/ajaxTool/getKakuhoItems.php", query).then(res => {
			console.log("kakuhokizi↓");
			console.log(res.data);
			this.kakuhoProduct = res.data;
		})
		},
		kakuhoOpen:function(productid){
			this.$parent.kakuhoTarget = this.$parent.productData[productid];
			this.$parent.kakuhoFlg = true;
		},
		itemClick:function(product_id){
			Vue.set(this.$parent.selected,"kakuhokizi","");
			Vue.set(this.$parent.selected,"fabric",product_id);
			console.log(this.$parent.selected.fabric);
			Vue.set(this.$parent.selected.sessions.ordersheet,"cloth_no",this.$parent.productData[product_id].product_code_min);
			Vue.set(this.$parent,"selectedProductData",this.$parent.productData[product_id]);
			// this.$parent.selected.fabric = product_id;
			this.$parent.checkOptionCourse();
			
		},
		kakuhoitemClick:function(orderData){
			Vue.set(this.$parent.selected,"fabric",orderData.productdata.product_id);
			Vue.set(this.$parent.selected,"kakuhokizi",orderData.order_id);
			var product_id = orderData.productdata.product_id;
			Vue.set(this.$parent.selected.sessions.ordersheet,"cloth_no",this.$parent.productData[product_id].product_code_min);
			Vue.set(this.$parent,"selectedProductData",this.$parent.productData[product_id]);
			console.log(this.$parent.selected.fabric);
			// this.$parent.selected.fabric = product_id;
			this.$parent.checkOptionCourse();
			// this.$parent.productSelectFlg = true;

			
		},
		genderChanger:function(gender,master_no){
			this.$parent.syokika('genderfirst');
			Vue.set(this.$parent.selected,"gender",gender);
			Vue.set(this.$parent.selected.sessions.ordersheet,"sex",master_no);
			console.log("パラメータリセット");
			Vue.set(this.$parent.selected,"parts",{});
			Vue.set(this.$parent.selected.code,"course","");
			Vue.set(this.$parent.selected.sessions.ordersheet,"course_no","");
			Vue.set(this.$parent.selected.sessions.ordersheet,"cloth_no","");
			Vue.set(this.$parent.selected,"fabric","");
			
			var thista = this;
			setTimeout(function(){
				if(thista.$parent.selected.gender == 'women'){
				Vue.set(thista.$parent,'view','_skirt');
			}
				thista.$parent.texChanger();
			},500);
		},
		sortOpen:function(){
			Vue.set(this.$parent,"sortFlg",true);
		},
		productInfoOpen:function(product_id){
			Vue.set(this.$parent,"productInfoFlg",true);
			Vue.set(this.$parent,"productInfoTarget",product_id);
		}
	},
	beforeDestroy:function(){
		if(this.$parent.selected.fabric){

		
		if(this.$parent.guest === false && this.$parent.katagamiNaiUser == false){
    //一旦在庫確保
	this.$parent.loading = true;
			let formdata = new URLSearchParams();
      var sessionJson = JSON.stringify(this.$parent.selected.sessions);
      formdata.append('quantity',1 * this.$parent.stocktani.all);
      formdata.append('product_id',this.$parent.selected.fabric);
      formdata.append("token",this.$parent.token);
      formdata.append('ordersheet',sessionJson);
      formdata.append('kakuhokizi',this.$parent.selected.kakuhokizi);
    axios.post("/ajaxTool/stepper_order_regist.php",formdata).then(res => {
      console.log(res.data);
    if(res.data == "no stock"){
      console.log("在庫確保失敗");
      alert("指定した生地の在庫がないようです。別の生地を選択してください。");
	  this.$parent.step = 1;
	  this.$parent.loading = false;
      // Vue.set(this.$parent,"loading",false);
    }else{
    console.log("在庫確保OK");
	this.$parent.loading = false;
    // Vue.set(this.$parent,"step",2);
    // Vue.set(this.$parent,"loading",false);
    }
    });
  }else{
	  console.log('在庫の確保が必要ないユーザーなので確保しません');
  }
  }else{
	  alert('生地を選択してください');
	  this.$parent.step = 1;
  }
	}
};
</script>