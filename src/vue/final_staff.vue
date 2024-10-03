<template lang="pug">
	div.simulator__finalstaff
		div.simulator__finalstaff__wrap(v-if="")
			p.title_style1
				span 現在注文情報
			table
				tr
					th 生地NO
					th コース
					th(v-for="(item2,key2) in courseMaster.designParts") デザインサイズ
					th 納期
				tr
					td {{$parent.selected.sessions.ordersheet.cloth_no}}
					td {{courseMaster.masterValue}}
					td(v-for="(item2,key2) in courseMaster.designParts")
						div(v-if="item2 == 'jacket'")
							span {{$parent.selected.sessions.ordersheet.jacket_dno}}
							span {{$parent.selected.sessions.ordersheet.jacket_size}}
						div(v-if="item2 == 'pants'")
							span {{$parent.selected.sessions.ordersheet.slacks_dno1}}
							span {{$parent.selected.sessions.ordersheet.slacks_size1}}
						div(v-if="item2 == 'pants2'")
							span {{$parent.selected.sessions.ordersheet.slacks_dno2}}
							span {{$parent.selected.sessions.ordersheet.slacks_size2}}
						div(v-if="item2 == 'vest'")
							span {{$parent.selected.sessions.ordersheet.best_dno}}
							span {{$parent.selected.sessions.ordersheet.best_size}}
						div(v-if="item2 == 'skirt'")
							span {{$parent.selected.sessions.ordersheet.wo_sk_d1}}
							span {{$parent.selected.sessions.ordersheet.wo_sk_size1}}
						div(v-if="item2 == 'skirt2'")
							span {{$parent.selected.sessions.ordersheet.wo_sk_d2}}
							span {{$parent.selected.sessions.ordersheet.wo_sk_size2}}
					td {{$parent.deliveryDate}}
			p.finalstaff__title.title_style1(v-if='douzi.length > 0')
				span 同時注文商品
			table(v-if='douzi.length > 0')
				tr
					th 生地NO
					th コース
					th デザインサイズ
					th デザインサイズ
					th デザインサイズ
					th 納期
					th 同時購入
				tr(v-for="(item,key) in douzi" v-if="item.ordersheet != null && item.ordersheet.ordersheet.course_combi && item.ordersheet.ordersheet.sex")
					td {{item.itemDetail.product_code}}
					td
						span(v-if="item.ordersheet != null") {{getCourseCombiName(item.ordersheet.ordersheet.course_combi,item.ordersheet.ordersheet.sex)}}
					template(v-if="item.ordersheet != null")
						td( v-for="(item2,key2) in getSelectParts(item.ordersheet.ordersheet.course_combi,item.ordersheet.ordersheet.sex)['designParts']")
							div(v-if="item2 == 'jacket'")
								span {{item.ordersheet.ordersheet.jacket_dno}}
								span {{item.ordersheet.ordersheet.jacket_size}}
							div(v-if="item2 == 'pants'")
								span {{item.ordersheet.ordersheet.slacks_dno1}}
								span {{item.ordersheet.ordersheet.slacks_size1}}
							div(v-if="item2 == 'pants2'")
								span {{item.ordersheet.ordersheet.slacks_dno2}}
								span {{item.ordersheet.ordersheet.slacks_size2}}
							div(v-if="item2 == 'vest'")
								span {{item.ordersheet.ordersheet.best_dno}}
								span {{item.ordersheet.ordersheet.best_size}}
							div(v-if="item2 == 'skirt'")
								span {{item.ordersheet.ordersheet.wo_sk_d1}}
								span {{item.ordersheet.ordersheet.wo_sk_size1}}
							div(v-if="item2 == 'skirt2'")
								span {{item.ordersheet.ordersheet.wo_sk_d2}}
								span {{item.ordersheet.ordersheet.wo_sk_size2}}
						template(v-if="item.ordersheet.ordersheet.course_combi && item.ordersheet.ordersheet.sex")
							td(v-if="getSelectParts(item.ordersheet.ordersheet.course_combi,item.ordersheet.ordersheet.sex)['designParts'].length < 3")
							td(v-if="getSelectParts(item.ordersheet.ordersheet.course_combi,item.ordersheet.ordersheet.sex)['designParts'].length < 2")
					td {{item.delivery}}
					td
						input(type="checkbox" name="douziChecker[]" :value="item.order_id" v-model="$parent.douziChecker")

</template>

<script>
// コンポーネントのtemplateは、一つのタグですべて囲われていなければならん。注意。
//アロー関数では値が取れなくなる場合がある。　hoge:function(){}としろ。
module.exports = {
	data: function () {
    return {
		douzi:[],
		douziChecker:[],
    }
	},
	watch:{

	},
	methods:{

		getSelectParts:function(number,sex){
			var result = "";
			var gender = "men";
			if(sex == 2){
				gender = "women";
			}
			$.each(this.$parent.selectparts[gender],function(key,item){
				if(item.masterNo == number){
					result = item;
				}
			})
			return result;
		},
		getCourseCombiName:function(number,sex){
			var result = "コース無し";
			var gender = "men";
			if(sex == 2){
				gender = "women";
			}
			$.each(this.$parent.selectparts[gender],function(key,item){
				if(item.masterNo == number){
					result = item.masterValue;
				}
			});
			return result;
		},
	},
	computed:{
		product_id:function(){
			return this.$parent.selected.fabric;
		},
		courseMaster:function(){
		var selected = this.$parent.selected.parts;
		var result = "";
		$.each(selected,function(key,item){
			result = item;
		});
		return result;
		}

	},
	mounted:function(){
		this.$parent.loading = true;
		let formdata = new URLSearchParams();
	// // console.log(JSON.stringify(this.$parent.selected.sessions.ordersheet));
	// return false;
      formdata.append('shop_id',this.$parent.selected.sessions.base.customize_store);
	formdata.append('tantou_id',this.$parent.selected.sessions.base.customize_employee);

    axios.post("/sandbox/ajaxTool/getStockOrder.php",formdata).then(res => {
    // // console.log(res.data);
	this.$parent.loading = false;
	this.douzi = res.data;
	});
	},

};
</script>