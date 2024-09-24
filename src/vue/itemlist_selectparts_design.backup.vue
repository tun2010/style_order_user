<template lang="pug">
	div.simulator__selector.simulator__selector_design
		div.selector_design__category
			ul(v-if="$parent.selected.gender == 'men'")
				li.buttons(:class="{'buttons-line':$parent.c3Category == 1,'buttons-black':$parent.c3Category != 1}" v-on:click="c3CateChanger(1,'',14)" v-if="courseNo == '001' || courseNo == '002' || courseNo == '003' || courseNo == '004'") JACKET
				li.buttons(:class="{'buttons-line':$parent.c3Category == 3 && sub == '','buttons-black':$parent.c3Category != 3}" v-on:click="c3CateChanger(3,'',16)" v-if="courseNo == '001' || courseNo == '002' || courseNo == '003' || courseNo == '006'") SLACKS
				li.buttons(:class="{'buttons-line':$parent.c3Category == 3 && sub=='pants2','buttons-black':$parent.c3Category != 3}" v-if="courseNo == '002' || courseNo == '2'" v-on:click="c3CateChanger(3,'pants2',16)") SLACKS2
				li.buttons(:class="{'buttons-line':$parent.c3Category == 2,'buttons-black':$parent.c3Category != 2}" v-on:click="c3CateChanger(2,'',15)" v-if="courseNo == '003' || courseNo == '005'") VEST
			ul(v-if="$parent.selected.gender == 'women'")
				li.buttons(:class="{'buttons-line':$parent.c3Category == 5,'buttons-black':$parent.c3Category != 5}" v-on:click="c3CateChanger(5,'',31)" v-if="courseNos.indexOf('011') > -1") JACKET
				li.buttons(:class="{'buttons-line':$parent.c3Category == 6 && sub=='','buttons-black':$parent.c3Category != 6}" v-on:click="c3CateChanger(6,'',32)" v-if="courseNos.indexOf('012') > -1") SLACKS
				li.buttons(:class="{'buttons-line':$parent.c3Category == 6 && sub=='pants2','buttons-black':$parent.c3Category != 6}" v-on:click="c3CateChanger(6,'pants2',32)"  v-if="courseNos[2] == '012' || (courseNos[0] == '012' && courseNos[1] == '012')") SLACKS2
				li.buttons(:class="{'buttons-line':$parent.c3Category == 7 && sub == '','buttons-black':$parent.c3Category != 7}" v-on:click="c3CateChanger(7,'',33)" v-if="courseNos.indexOf('013') > -1") SKIRT
				li.buttons(:class="{'buttons-line':$parent.c3Category == 7 && sub == 'skirt2','buttons-black':$parent.c3Category != 7}" v-on:click="c3CateChanger(7,'skirt2',33)" v-if="(courseNos[2] == '013' && courseNos[1] == '013') || (courseNos[0] == '013' && courseNos[1] == '013')") SKIRT2
			ul
				li.buttons(:class="{'buttons-line':$parent.c3Style == 1,'buttons-black':$parent.c3Style != 1,'buttons-nonactive':$parent.selected.gender == 'women' || $parent.c3Category == 2}" v-on:click="c3StyleChanger(1)") SLIM
				li.buttons(:class="{'buttons-line':$parent.c3Style == 2,'buttons-black':$parent.c3Style != 2,'buttons-nonactive':$parent.selected.gender == 'women' || $parent.c3Category == 2}" v-on:click="c3StyleChanger(2)") REGULAR
				li.buttons(:class="{'buttons-line':$parent.c3Style == 3,'buttons-black':$parent.c3Style != 3,'buttons-nonactive':$parent.selected.gender == 'women' || $parent.c3Category == 2}" v-on:click="c3StyleChanger(3)") RELAXING
		div.product__list_selectparts.product__list_selectparts_katagami
			div.gb_alert(v-if="$parent.selected.gb")
				p 現在いずれかにGB用型紙が選択されているため、GB型紙しか表示されません
			div.selector_design_search
				p
					span.design_search__inputbox
						i.material-icons search
						input(type="text" placeholder="デザインNO検索" v-model='sorterstext')
					// span.buttons.buttons-black.buttons-tatesmall 検索
			transition(name="slide" mode="out-in")
				ul(v-if="disp == 1" key="course" :data-sp="selectedParts")
					li(v-for="(parts,key) in ordedReverse" v-if="styleChecker(parts) && ((parts.pattern != false && parts.pattern.indexOf(''+$parent.c3CategoryKatagami) >= 0 && ((parts.style.indexOf(''+$parent.c3Style) >= 0 && ($parent.selected.gender == 'women' || $parent.c3Category == 2)) || ($parent.selected.gender != 'women' && $parent.c3Category != 2)) && parts.pattern.indexOf(''+selectedParts) >= 0) && (($parent.selected.gender == 'men' && parts.gender.men == 'true') || ($parent.selected.gender == 'women' && parts.gender.women == 'true')))" :data-target="parts.style_id" v-on:click="partsClicker(parts.style_id,$event)" :class="{'active':parts.style_id in selectedSelect}")
						div
							figure
								img( v-bind:src="$parent.uploadPass+parts.images")
							div
								p.selectparts__en {{parts.name_en}}
								p.selectparts__ja {{parts.name}}
								div.selectparts__buttons
									p.buttons.buttons-brown.buttons-small.buttons-next(v-if="parts.detail_images !== null" v-on:click="ivModalOpen($parent.uploadPass+parts.detail_images,'image')") IMAGE
									p.buttons.buttons-brown.buttons-small.buttons-next(v-if="parts.youtube !== null" v-on:click="ivModalOpen(parts.youtube,'video')") MOVIE
				ul(v-if="selectedCourseInPatterns && disp == 2 && sorters == false" key="katagami" class="katagami_list")
					li.clicknot(v-for="(parts,key) in selectedCourseInPatterns" :data-target="key" :data-patternid="parts.pattern_id" :class="{'active':parts.pattern_num == selectedSelectKatagami}" v-if="((($parent.selected.gb && parts.gb == '1') || (!$parent.selected.gb && (($parent.selected.gender != 'women') && $parent.c3Style == parts.style || $parent.c3Category == 2 ) ||($parent.selected.gender == 'women'))) && (String(parts.factory).indexOf($parent.selectedProductData.factory) > -1 || $parent.debug) && ((kiziwashableCheck && optionKiziwashableCheck(parts)) || kiziwashableCheck == false || $parent.debug)) && newChecker(parts)")
						div
							div.katagami_selector_info
								p.katagami_num {{apiNameGetter(parts,henkankun($parent.c3Category))}}
								p.katagami_size(v-if="parts.pattern_num == selectedSelectKatagami && targetSize != ''")
									|選択したサイズ：{{targetSize}}
									span(v-if='$parent.selected.gender == "women"') 号
								p.katagami_detail {{parts.detail_text}}
							div
								// p.selectparts__en {{parts.name_en}}
								// p.selectparts__ja {{parts.name}}
								p(v-if="String(parts.factory).indexOf($parent.selectedProductData.factory) == -1 && $parent.debug") [debug]※この型紙は生地と工場が違うので本番では出ない
								p(v-if="kiziwashableCheck == true && optionKiziwashableCheck(parts) == false && $parent.debug") [debug]※生地がウォッシャブルだが、型紙は対応していないので本番では出ない
								//型紙にプリーツのチェックはなかった
								// p(v-if="kizipleatsCheck == true && optionKizipleatsCheck(parts) == false && $parent.debug") [debug]※生地がプリーツ安定だが、型紙は対応していないので本番では出ない
								div.selectparts__buttons
									// p.buttons.buttons-brown.buttons-small.buttons-next.button-info(v-if="parts.detail_text !== null && parts.detail_text != ''" v-on:click="katagamiInfoOpen(parts.detail_text)") INFO
									a.buttons.buttons-brown.buttons-small.buttons-next.button-info(v-if="parts.down_realfilename != '' && parts.down_realfilename != null" :href="'https://style-order.taka-q.com/pdf.php?pdf='+parts.pattern_id" target='_blank') INFO
									p.buttons.buttons-brown.buttons-small.buttons-next(v-if="parts.youtube !== null" v-on:click="katagamiClicker(key,$event,'',parts.pattern_num,parts.pattern_id,'normal')") SIZE
				//検索用の、カテゴリ内すべての型紙を並べるリスト
				ul(v-if="disp == 2 && sorters" key="katagami2" class="katagami_list")
					li.clicknot(v-for="(parts,key) in categoryZen()" :data-target="key" :data-patternid="parts.pattern_id" :class="{'active':parts.pattern_num == selectedSelectKatagami}" v-if="((($parent.selected.gb && parts.gb == '1') || (!$parent.selected.gb && (($parent.selected.gender != 'women') && $parent.c3Style == parts.style || $parent.c3Category == 2) ||($parent.selected.gender == 'women'))) && (String(parts.factory).indexOf($parent.selectedProductData.factory) > -1 || $parent.debug) && ((kiziwashableCheck && optionKiziwashableCheck(parts)) || kiziwashableCheck == false || $parent.debug)) && sorter2run(parts) && newChecker(parts)")
						div
							div.katagami_selector_info
								p.katagami_num {{apiNameGetter(parts,henkankun($parent.c3Category))}}
								p.katagami_size(v-if="parts.pattern_num == selectedSelectKatagami && targetSize != ''")
									|選択したサイズ：{{targetSize}}
									span(v-if='$parent.selected.gender == "women"') 号
								p.katagami_detail {{parts.detail_text}}
							div
								// p.selectparts__en {{parts.name_en}}
								// p.selectparts__ja {{parts.name}}
								p(v-if="String(parts.factory).indexOf($parent.selectedProductData.factory) == -1 && $parent.debug") [debug]※この型紙は生地と工場が違うので本番では出ない
								p(v-if="kiziwashableCheck == true && optionKiziwashableCheck(parts) == false && $parent.debug") [debug]※生地がウォッシャブルだが、型紙は対応していないので本番では出ない
								//型紙にプリーツのチェックはなかった
								// p(v-if="kizipleatsCheck == true && optionKizipleatsCheck(parts) == false && $parent.debug") [debug]※生地がプリーツ安定だが、型紙は対応していないので本番では出ない
								div.selectparts__buttons
									a.buttons.buttons-brown.buttons-small.buttons-next.button-info(v-if="parts.down_realfilename != '' && parts.down_realfilename != null" :href="$parent.uploadPDFPass+parts.down_realfilename" target='_blank') INFO
									// p.buttons.buttons-brown.buttons-small.buttons-next.button-info(v-if="parts.detail_text !== null && parts.detail_text != ''" v-on:click="katagamiInfoOpen(parts.detail_text)") INFO
									p.buttons.buttons-brown.buttons-small.buttons-next(v-if="parts.youtube !== null" v-on:click="katagamiClicker(key,$event,parts.style_option,parts.pattern_num,parts.pattern_id,'zen')") SIZE
			div.product__list_selectparts__backer(v-if="disp == 2")
				p(v-on:click="backs()").buttons.buttons-black.buttons-small 一覧へ戻る

</template>
<style>
.clicknot{
	cursor:default !important;
}
</style>
<script>
// コンポーネントのtemplateは、一つのタグですべて囲われていなければならん。注意。
//アロー関数では値が取れなくなる場合がある。　hoge:function(){}としろ。
module.exports = {
	data:function(){
		return {
			disp:1,
			styleTarget:1,
			targetCourseData:{},
			// パンツ２枚目かスカート２枚目んときつかう
			sub:"",
			courseNo:this.$parent.selected.code.course,
			// 対応するセッションID
			session_himoduke:{
				"1":"jacket_dno",
				"2":"best_dno",
				"3":"slacks_dno1",
				"3pants2":"slacks_dno2",
				"5":"jacket_dno",
				"6":"slacks_dno1",
				"6pants2":"slacks_dno2",
				"7":"wo_sk_d1",
				"7skirt2":"wo_sk_d2",
			},
			sorterstext:'',
			sorters:false
		}
	},
	beforeDestroy:function(){
		Vue.set(this.$parent.selected,'step3disp',1);
		Vue.set(this.$parent.selected,'targetCourseData',{});
		Vue.set(this.$parent,'view',this.$parent.checkSkPt);
		if(this.$parent.step > 3){
			if(this.katagamiGBChecker()){

			}else{
				alert('型紙でいずれかにGBが含まれていますので、すべての型紙にてGBのものを選択してください');
				Vue.set(this.$parent,'step',3);
			};
		}
	},
	props:["partsdata","tantouflg","uploadpass"],
	watch:{
		sorterstext:function(v,ov){
			if(v != ''){
				Vue.set(this,'sorters',true);
				Vue.set(this,'disp',2);
			}else{
				Vue.set(this,'sorters',false);
				Vue.set(this,'disp',1);
			}
		},
		sub:function(v,ov){
			Vue.set(this.$parent.selected,'c3sub',v);
			//console.log('c3sub 変更');
			//console.log(this.$parent.selected.c3sub);
		},
		disp:function(v,ov){
			Vue.set(this.$parent.selected,'step3disp',v);
		}
	},
	computed:{
		orded: function () {
    return _.orderBy(this.$parent.masters.style, 'rank');
		},
		ordedReverse:function(){
			return _.reverse(this.orded);
		},
		ordedkatagami: function () {
    return _.orderBy(this.$parent.selected.targetCourseData.katagami_pattern, 'rank');
		},
		ordedCategoryZen:function(){
			return _.orderBy(this.categoryZen(),'rank');
		},
		ordedCategoryZenReverse:function(){
			return _.reverse(this.ordedCategoryZen);
		},
		ordedkatagamiReverse:function(){
			return _.reverse(this.ordedkatagami);
		},
		targetSize:function(){
			var target = "";
			switch(this.$parent.c3Category){
				case (1):
					target = "jacket_size";
					break;
				case (2):
					target = "best_size";
					break;
				case (3):
					if(this.sub != ""){
					target = "slacks_size2";
					}else{
					target = "slacks_size1";
					}
					break;
				case (5):
					target = "jacket_size";
					break;
				case (6):
					if(this.sub != ""){
					target = "slacks_size2";
					}else{
					target = "slacks_size1";
					}
					break;
				case (7):
					if(this.sub != ""){
					target = "wo_sk_size2";
					}else{
					target = "wo_sk_size1";
					}
					break;
					}

			var sizer = this.$parent.selected.sessions.ordersheet[target];

			return sizer;



		},
		kizipleatsCheck:function(){
			if(this.$parent.selected.sessions.ordersheet.pleats_sta == "1"){
				return true;
			}else{
				return false;
			}
		},
		kiziwashableCheck:function(){
			if(this.$parent.selected.sessions.ordersheet.washable == "1"){
				return true;
			}else{
				return false;
			}
		},
		//女性用
		courseNos:function(){
			var course = this.$parent.selected.code.course;
			var courses = [];
			if(course.indexOf(",") > -1){
				courses = course.split(",");
			}else{
				courses[0] = course;
			}
			//console.log("courseNos:::");
			//console.log(courses);
			return courses;
		},
		gender:function(){
			return this.$parent.selected.gender;
		},
		selectedSelect:function(){
			return this.$parent.selected.course[this.$parent.c3Category+this.sub];
		},
		selectedSelectKatagami:function(){
			var target = this.$parent.c3Category + this.sub;
			//console.log("selectedSelectKatagami:"+this.$parent.selected.sessions.ordersheet[this.session_himoduke[target]]);
			return this.$parent.selected.sessions.ordersheet[this.session_himoduke[target]];

		},
		selectedParts:function(){
			var no = "";
			//console.log("selectedParts");
			$.each(this.$parent.selected.parts,function(key,item){
				//console.log("対象のstyleNo:"+item.masterNo);
				no =  item.masterNo;
			});
			return no;
		},
		selectedCourseInPatterns:function(){
			var katagami = "";
			// //console.log(this.$parent.selected.targetCourseData);
			// //console.log("test");
			// $.each(this.targetCourseData,function(key,item){
				// //console.log(item);
				// //console.log("↑");
				// if("katagami_pattern" in item){
					if("katagami_pattern" in this.$parent.selected.targetCourseData){
				katagami =  this.ordedkatagamiReverse;
					}
				// }
			// });
			// console.log("型紙");
			//console.log(this.$parent.selected.targetCourseData);
			// console.log(katagami);
			return katagami;
		}
	},
	methods:{
		firstkatagamiGBChecker:function(){
			if(this.$parent.selected.gender == 'men'){
				var parts = this.$parent.selected.parts;
			var designParts = '';
			$.each(parts,function(key,item){
				designParts = item.designParts;
			});
			var targetArray = [];
			if(designParts.indexOf('jacket') > -1){
				targetArray.push("1");
			}
			if(designParts.indexOf('pants') > -1){
				targetArray.push("3");
			}
			if(designParts.indexOf('pants2') > -1){
				targetArray.push("3pants2");
			}
			if(designParts.indexOf('vest') > -1){
				targetArray.push("2");
			}
			var gbs = {};
			$.each(this.$parent.selected.katagami,function(key,item){
				if(targetArray.indexOf(key) > -1){
				$.each(item,function(key2,item2){
					gbs[key] = item2.gb;
				})
				}
			});
			// console.log('GBかどうかのリスト');
			// console.log(gbs);
			var finalFlg = false;
			$.each(gbs,function(key,item){
				if(item == "1"){
					finalFlg = true;
				}
			});
			if(finalFlg == true){
				Vue.set(this.$parent.selected,'gb',true);
			}else{
				Vue.set(this.$parent.selected,'gb',false);
			}
			}else{

			}
		},
		katagamiGBChecker:function(){
			if(this.$parent.selected.gender == 'men'){
				var parts = this.$parent.selected.parts;
			var designParts = '';
			$.each(parts,function(key,item){
				designParts = item.designParts;
			});
			var targetArray = [];
			if(designParts.indexOf('jacket') > -1){
				targetArray.push("1");
			}
			if(designParts.indexOf('pants') > -1){
				targetArray.push("3");
			}
			if(designParts.indexOf('pants2') > -1){
				targetArray.push("3pants2");
			}
			if(designParts.indexOf('vest') > -1){
				targetArray.push("2");
			}
			var gbs = {};
			$.each(this.$parent.selected.katagami,function(key,item){
				if(targetArray.indexOf(key) > -1){
				$.each(item,function(key2,item2){
					gbs[key] = item2.gb;
				})
				}
			});
			// console.log('GBかどうかのリスト');
			// console.log(gbs);
			var gbser = '';
			var finalFlg = true;
			$.each(gbs,function(key,item){
				if(gbser == ''){
				gbser = item;
				}else{
					if(gbser != item){
						finalFlg =  false;
					}
				}
			});
			return finalFlg;
			}else{
				return true;
			}
		},
		newChecker:function(parts){
			// console.log(parts);
			if(this.$parent.sinki == true){
			if(parts.new_flg == 1){
			return true;
			}else{
				return false;
			}
			}else{
				return true;
			}
		},
		styleChecker:function(parts){
			// //console.log('stylechecker');
			var target = ''+this.$parent.c3Style;
			var partsStyle = parts.style;
			// //console.log(target);
			// //console.log(partsStyle);
			// //console.log(parts);
			if(partsStyle.indexOf(target) > -1){
				return true;
			}else{
				return false;
			}

		},
		sorter2run:function(product){
			var text = this.sorterstext;
			var texts = [];
			if(text.match(/[ |　]+/g) != null && text.match(/[ |　]+/g).length > 0){
				texts = text.split(/[ |　]+/g);
			}else{
				texts[0] = text;
			}

			if(texts[0] != ''){
			if(texts.indexOf(product.pattern_num) > -1){
				return true;
			}
			return false;
			}else{
				return true;
			}
		},
		categoryZen:function(){
			var zenmasu = this.$parent.masters.style;
			var c3CategoryKatagami = ''+this.$parent.c3CategoryKatagami;
			var targets = [];
			$.each(zenmasu,function(key,item){
				if(item.pattern != false && item.pattern != null && item.pattern.indexOf(c3CategoryKatagami) > -1){
					targets.push(item);
				}
			});
			var targetKatagamis = [];
			$.each(targets,function(key,item){
				if(item.katagami_pattern != false && item.katagami_pattern != null){
				$.each(item.katagami_pattern,function(key,item){
					targetKatagamis.push(item);
				})
				}
			})
			//console.log('カテゴリ内全スタイル');
			//console.log(targetKatagamis);
			return targetKatagamis
		},

		apiNameGetter:function(parts,target){
			var result = parts['pattern_num'];
			if(Object.keys(parts.api_field).length > 0){
				if(target in parts.api_field){
					if(parts.api_field[target].api_field != '' && parts.api_field[target].api_field != null){
					return parts.api_field[target].api_field;
					}else{
						return parts['pattern_num'];
					}
				}
				// result = parts.api_field[target].api_field;

			}
			return result;
		},
		// $parent.c3Categoryを、api_field用に変換
		henkankun:function(target){
			var result = '';
			switch(target){
				case 1:
				result = 2;
				break;
				case 2:
				result = 4;
				break;
				case 3:
				result = 3;
				break;
				default:
				result = target;
				break;
			}
			return result;
		},
		optionKizipleatsCheck:function(parts){
			if("option_id" in parts){
				if("17" in parts.option_id){
					return true;
				}
			}
			return false;
		},
		optionKiziwashableCheck:function(parts){
			if("option_id" in parts){
				if("61" in parts.option_id){
					return true;
				}
			}
			return false;
		},
		backs:function(){
			this.disp = 1;
			Vue.set(this,'sorters',false);
			Vue.set(this,'sorterstext','');
		},
		partsClicker:function(target,event){
			var targetDom;
			if(event != ''){
			targetDom = $(event.target);
			}else{
				targetDom = '';
			}

			if(targetDom != ''){
			if(targetDom.hasClass("buttons")){}else{
				Vue.set(this.$parent,'view','')
			if(this.$parent.katagamiNaiUser == false){
			this.disp = 2;
			}else{
				//遊びだけできるユーザーの挙動

			}
			}
			}
			// console.log('partsclicker');
			// console.log(targetDom);
			// console.log(targetDom.hasClass("buttons"));
			if(targetDom.hasClass("buttons")){}else{
			if(target in this.$parent.selected.targetCourseData){
				// Vue.delete(this.$parent.selected.course,target);
			}else{
				// Vue.set(this.$parent,'view',target);
				// Vue.set(this.$parent.selected["katagami"],this.$parent.c3Category,{});
				this.$parent.partsClicker03(target);
				if(this.$parent.katagamiNaiUser){
					//遊びだけできるユーザーの挙動
					Vue.set(this.$parent.selected.course,this.$parent.c3Category+this.sub,{});
				Vue.set(this.$parent.selected.course[this.$parent.c3Category+this.sub],this.$parent.selected.styleTarget,this.$parent.masters.style[this.$parent.selected.styleTarget]);
				}
				// this.styleTarget = target;
				// Vue.set(this,"targetCourseData",{});
				// Vue.set(this,"targetCourseData",this.$parent.masters.style[target]);
				// //console.log("選択されたパーツ↓");
				// //console.log(this.targetCourseData);
			}
			}
			// this.$parent.selected.parts[target] = this.$parent.selectparts[this.gender][target];

		},
		katagamiClicker:function(target,event,styleno,pattern_nums,pattern_ids,type){
			if(this.sorters){
				this.partsClicker(styleno,'');
			}

			var zenKatagami = this.categoryZen();
			targetDom = $(event.target);
			//console.log(this.$parent.c3Category);
			//console.log(this.$parent.c3Style);

			//console.log("selected.katagami["+this.$parent.c3Category+this.sub+"]を変更 target:"+target);

			//console.log("現在のselected↓");
			//console.log(this.$parent.selected);
			// //console.log("GBなのか："+this.selectedCourseInPatterns[target].gb);

			if(targetDom.hasClass("button-info")){}else{
				//console.log(this.$parent.selected.katagami);
				//console.log(this.$parent.c3Category+this.sub);
			// if(target in this.$parent.selected.katagami[this.$parent.c3Category+this.sub]){
			// 	// Vue.delete(this.$parent.selected.katagami,target);
			// }else{

				Vue.set(this.$parent.selected.course,this.$parent.c3Category+this.sub,{});
				// Vue.set(this.$parent.selected.course[this.$parent.c3Category+this.sub],this.$parent.selected.styleTarget,this.$parent.masters.style[this.$parent.selected.styleTarget]);

				if(type == 'zen'){
				Vue.set(this.$parent.selected.course[this.$parent.c3Category+this.sub],this.$parent.selected.styleTarget,zenKatagami[target]);
				}else{
					Vue.set(this.$parent.selected.course[this.$parent.c3Category+this.sub],this.$parent.selected.styleTarget,this.selectedCourseInPatterns[target]);
				}
				//console.log("this.$parent.selected.course");
				//console.log(this.$parent.selected.course);
				// Vue.set(this.$parent.selected,'katagami',{});
				Vue.set(this.$parent.selected.katagami,this.$parent.c3Category+this.sub,{});
				if(type == 'zen'){
				Vue.set(this.$parent.selected.katagami[this.$parent.c3Category+this.sub],target,zenKatagami[target]);
				}else{
					Vue.set(this.$parent.selected.katagami[this.$parent.c3Category+this.sub],target,this.selectedCourseInPatterns[target]);
				}
				//オプション選択内容をリセット
				// console.log('あなたが選択した型紙↓');
				// console.log(this.$parent.selected.course[this.$parent.c3Category+this.sub][this.$parent.selected.styleTarget]);
				if((this.$parent.selected.sessions.ordersheet.air_fit != '' && this.$parent.selected.sessions.ordersheet.air_fit != null && this.$parent.selected.sessions.ordersheet.air_fit != "0")&&(this.$parent.c3Category == "1" || this.$parent.c3Category == "5")&& !(43 in this.$parent.selected.course[this.$parent.c3Category+this.sub][this.$parent.selected.styleTarget].option_id)){
				// console.log('エアーフィットがついとるのに型紙は対応してない');
				alert('エアーフィットに対応していない型紙なので、エアーフィットを解除します。');
				Vue.set(this.$parent.selected.sessions.ordersheet,'air_fit',null);
				}
			// this.$parent.optionReseter();

				if(this.$parent.c3Category == "1" || this.$parent.c3Category == "5"){
					Vue.set(this.$parent.selected.sessions.ordersheet,"jacket_dno",pattern_nums);
					//firstcheckersを設定しなおす
					if(this.$parent.firstCheckers.ResetedFlg == false || this.$parent.tantouFlg == true){
					Vue.set(this.$parent.firstCheckers,"jacket_dno",pattern_nums);
					}

					Vue.set(this.$parent.selected.sessions.ordersheet,"jacket_dno",pattern_nums);
				}else if((this.$parent.c3Category == "3" && this.sub == "") || (this.$parent.c3Category == "6" && this.sub == "")){
					Vue.set(this.$parent.selected.sessions.ordersheet,"slacks_dno1",pattern_nums);
				}else if((this.$parent.c3Category == "3" && this.sub == "pants2") || (this.$parent.c3Category == "6" && this.sub == "pants2")){
					Vue.set(this.$parent.selected.sessions.ordersheet,"slacks_dno2",pattern_nums);
				}else if(this.$parent.c3Category == "2"){
					Vue.set(this.$parent.selected.sessions.ordersheet,"best_dno",pattern_nums);
				}
				else if(this.$parent.c3Category == "7" && this.sub == ""){
					Vue.set(this.$parent.selected.sessions.ordersheet,"wo_sk_d1",pattern_nums);
				}else if(this.$parent.c3Category == "7" && this.sub == "skirt2"){
					Vue.set(this.$parent.selected.sessions.ordersheet,"wo_sk_d2",pattern_nums);
				}
				//console.log("現在のselected session↓");
				//console.log(this.$parent.selected.sessions.ordersheet);
				//console.log("現在のselected katagami");
				//console.log(this.$parent.selected.katagami);
				Vue.set(this.$parent,"selectedKatagamiId",pattern_ids);
				var thista = this;
				Vue.nextTick(function(){
				if(thista.$parent.c3Category != 2){
					// console.log(thista.selectedCourseInPatterns);
					// console.log(thista.categoryZen());
					// console.log(target);
					var zenKatagami = thista.categoryZen();
				// if(thista.selectedCourseInPatterns[target].gb == "1"){
					var targetKatagamiList = thista.selectedCourseInPatterns;
					if(type == 'zen'){
						targetKatagamiList = zenKatagami;
					}
				if(targetKatagamiList[target].gb == "1"){
					thista.$parent.selected.gb = true;
					//firstcheckersを設定しなおす
					if(thista.$parent.firstCheckers.ResetedFlg == false || thista.$parent.tantouFlg == true){
					Vue.set(thista.$parent.firstCheckers,"gb",true);
					}
				}else{
					thista.$parent.selected.gb = false;
					Vue.set(thista.$parent.firstCheckers,"gb",false);
				}
				}else{
					var targetKatagamiList = thista.selectedCourseInPatterns;
					if(type == 'zen'){
						targetKatagamiList = zenKatagami;
					}
				if(targetKatagamiList[target].gb == "1"){
					thista.$parent.selected.gb = true;
					//firstcheckersを設定しなおす
					if(thista.$parent.firstCheckers.ResetedFlg == false || thista.$parent.tantouFlg == true){
					Vue.set(thista.$parent.firstCheckers,"gb",true);
					}
				}else{
					thista.$parent.selected.gb = false;
					Vue.set(thista.$parent.firstCheckers,"gb",false);
				}
				}
				});
			// }

			if(this.$parent.c3Category == 1 || this.$parent.c3Category == 5){
				// console.log('裏仕様チェック');
				if(type == 'zen'){
					// console.log(zenKatagami[target]['urashiyo']);
				if(zenKatagami[target]['urashiyo'].length >0){
					if(zenKatagami[target]['urashiyo'].indexOf(this.$parent.selected.sessions.ordersheet.ext_specification_normal)){

					}else{
			Vue.set(this.$parent.selected.sessions.ordersheet,'ext_specification_normal',zenKatagami[target]['urashiyo'][0]);
					}
				}else{
					// console.log('ひとつもチェックされていない');
					Vue.set(this.$parent.selected.sessions.ordersheet,'ext_specification_normal',null);
				}
				}else{
				// console.log(this.selectedCourseInPatterns[target]['urashiyo']);
				if(this.selectedCourseInPatterns[target]['urashiyo'].length >0){
					if(this.selectedCourseInPatterns[target]['urashiyo'].indexOf(this.$parent.selected.sessions.ordersheet.ext_specification_normal)){

					}else{
			Vue.set(this.$parent.selected.sessions.ordersheet,'ext_specification_normal',this.selectedCourseInPatterns[target]['urashiyo'][0]);
					}
				}else{
					// console.log('ひとつもチェックされていない');
					Vue.set(this.$parent.selected.sessions.ordersheet,'ext_specification_normal',null);
				}
				}
				// console.log(this.$parent.selected.sessions.ordersheet);
			}
			Vue.set(this.$parent,"sizeSelectModalFlg",true);
			// this.$parent.selected.parts[target] = this.$parent.selectparts[this.gender][target];
			}
			if(this.$parent.firstCheckers.ResetedFlg == false || this.$parent.tantouFlg == true){
				this.$parent.isKataFacChecker();
				// console.log('firstCheckersの型紙ファクトリをセットし直す');
				// console.log(this.$parent.firstCheckers);
			}

			//パワストチェック
			if(this.$parent.selected.sessions.ordersheet.ext_specification != '' && this.$parent.selected.sessions.ordersheet.ext_specification != null && this.$parent.selected.sessions.ordersheet.ext_specification != "0"){
				var powerTaiouFlg = {};
				$.each(this.$parent.selected.course,function(key,item){
					$.each(item,function(key2,item2){
						if(52 in item2.option_id){
							powerTaiouFlg[key] = true;
						}else{
							powerTaiouFlg[key] = false;
						}
				})
				})
				// console.log(powerTaiouFlg);
				var parts = this.$parent.selected.parts;
			var styleNo = '';
			var thista = this;
			$.each(parts,function(key,item){
				styleNo = item.styleNo;
			});
			if(styleNo == 4 || styleNo == 5 || styleNo == 6 || styleNo == 1 || styleNo == 10 || styleNo == 11 || styleNo == 15 || styleNo == 17 || styleNo == 16 || styleNo == 7){
				if((thista.$parent.selected.gender == 'men' && 1 in powerTaiouFlg) || (thista.$parent.selected.gender == 'women' && 5 in powerTaiouFlg)){
					if((thista.$parent.selected.gender == 'men' && powerTaiouFlg[1] == true) || (thista.$parent.selected.gender == 'women' && powerTaiouFlg[5] == true)){
						// console.log('パワストOK');
					}else{
						// console.log('パワストだめ1');
						alert('パワーストレッチに対応していないため、パワーストレッチを解除します。');
						Vue.set(this.$parent.selected.sessions.ordersheet,"ext_specification",null);
					}
				}else{
					// console.log('パワストだめ2');
					alert('パワーストレッチに対応していないため、パワーストレッチを解除します。');
						Vue.set(this.$parent.selected.sessions.ordersheet,"ext_specification",null);
				}
			}
			else if(styleNo == 3 ){
				if(3 in powerTaiouFlg){
					if(powerTaiouFlg[3] == true){
						// console.log('パワストOK');
					}else{
						// console.log('パワストだめ3');
						alert('パワーストレッチに対応していないため、パワーストレッチを解除します。');
						Vue.set(this.$parent.selected.sessions.ordersheet,"ext_specification",null);
					}
				}else{
					// console.log('パワストだめ4');
					alert('パワーストレッチに対応していないため、パワーストレッチを解除します。');
						Vue.set(this.$parent.selected.sessions.ordersheet,"ext_specification",null);
				}
			}
			}

		},
		ivModalOpen:function(target,type){
			Vue.set(this.$parent,"imageAndVideoModalFlg",true);
			Vue.set(this.$parent,"ivModalType",type);
			if(type == "image"){
			Vue.set(this.$parent,"modalImage",target);
			}else if(type == "video"){
				Vue.set(this.$parent,"modalVideo",target);
			}
		},
		katagamiInfoOpen:function(katagamiInfoText){
			Vue.set(this.$parent,"katagamiInfoFlg",true);
			Vue.set(this.$parent,"katagamiInfoText","");
			Vue.set(this.$parent,"katagamiInfoText",katagamiInfoText);

		},
		c3CateChanger:function(target,sub,katagaminoNo){
			Vue.set(this.$parent.selected,"targetCourseData",{});
			Vue.set(this.$parent,'view','')
			if(sub != ""){
				// this.sub = sub;
				Vue.set(this,'sub',sub);
				this.$parent.sub = sub;
				//console.log("２枚目のものを選択");
				//console.log(this.sub);
			}else{
				Vue.set(this,'sub',"");
				Vue.set(this.$parent.selected,'c3sub',"");
				this.$parent.sub = "";
				//console.log("1枚目のものを選択");
				//console.log(this.sub);
			}
			this.disp = 1;
			Vue.set(this.$parent,"c3Category",target);
			Vue.set(this.$parent,"c3CategoryKatagami",katagaminoNo);
			//console.log("コースで表示する箇所が変更されました:"+this.$parent.c3Category);
			//console.log("型紙に登録されている箇所NO:"+this.$parent.c3CategoryKatagami);
			// if(this.$parent.c3Category == 2){
			// 	this.partsClicker(2,"");
			// }
			//console.log("コースで表示するスタイルが変更されました:"+this.$parent.c3Style);
			switch(target){
				case 1:
				case 5:
				Vue.set(this.$parent,'view','');
				break;
				case 2:
				Vue.set(this.$parent,'view','');
				break;
				case 3:
				case 6:
				Vue.set(this.$parent,'view','');
				break;
				case 7:
				Vue.set(this.$parent,'view','');
				break;
			}
// this.categoryZen();
		},
		c3StyleChanger:function(target){
			var c3cate = this.$parent.c3Category;
			Vue.set(this.$parent,'view','');
			Vue.set(this.$parent,'c3Category','');
			Vue.set(this.$parent,'c3Category',c3cate);
			this.disp = 1;
			Vue.set(this.$parent,"c3Style",target);
			// if(this.$parent.c3Category == 2){
			// 	this.partsClicker(2,"");
			// }
			//console.log("コースで表示する箇所が変更されました:"+this.$parent.c3Category);
			//console.log("コースで表示するスタイルが変更されました:"+this.$parent.c3Style);
		}
	},
	mounted:function(){
		this.firstkatagamiGBChecker();
		Vue.nextTick(function(){
			$('.selector_design__category').find('ul').eq(0).find('li').eq(0).click();
		})
	},

};
</script>