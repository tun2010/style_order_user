<template>
	<div class="simulator__image_view" :class="$parent.selected.gender || ''">
		<div class="simulator__product_view" v-if="$parent.staffstartFlg">
				<figure class="fabric-image">
					<img :src="fabric" alt="Fabric">
				</figure>
		</div>
		<div class="simulator__fabric_view" v-if="$parent.step == 5">
			<div class="fabric-container">
				<div class="fabric-label">表地</div>
				<div class="fabric-image">
					<img :src="fabric" alt="Fabric">
				</div>
				<div class="child-fabric-container" v-if="lining">
					<div class="fabric-label">裏地</div>
					<div class="fabric-image fabric-image--lining">
						<img :src="lining" alt="Lining">
					</div>
				</div>
			</div>
		</div>
		<p style="display:none;">{{ targetCourser }}</p>
		<p style="display:none;">{{ targetSrc }}</p>
		<div class="zentai" v-if='courseNo != ""'>
			<img :src="targetSrc + 'torso.png'" alt="Troso" class="torso">
			<object class="suitmodel model1" type="image/svg+xml"
				@load="$parent.onFabricLoad"
				@error="handleError"
				:data="targetSrc+'svg.svg'"
				style="-ms-interpolation-mode: bicubic;image-rendering: pixelated;"
			></object>
			<img class="shadow" :src="targetSrc+'shadow.png'">
		</div>
		<div class="sample" v-else>
			<img class="torso" :src="sampletorsosrc">
			<object class="suitmodel model2" type="image/svg+xml"
				@load="$parent.onFabricLoad"
				:data="modelsrc"
				style="-ms-interpolation-mode: bicubic;image-rendering: pixelated;"
			></object>
			<img class="shadow" :src="sampleshadowsrc">
		</div>
		<div class="options">
			<img data-id="1" v-if='optionTargetResult != ""' :src='optionSrcer+optionTargetResult+"/button/"+buttons+".png"' :data-image-url='optionSrcer+optionTargetResult+"/button/"+buttons+".png"' v-on:error='notfounder'>
			<img data-id="2" v-else :src='optionSrcer+optionTarget+"/button/"+buttons+".png"' :data-iamge-url='optionSrcer+optionTarget+"/button/"+buttons+".png"' v-on:error='notfounder'>

			<img data-id="3" v-if='optionTargetResult != ""' :src='optionSrcer+optionTargetResult+"/flower/"+flowerF+".png"' :data-image-url='optionSrcer+optionTargetResult+"/flower/"+flowerF+".png"' v-on:error='notfounder'>
			<img data-id="4" v-else :src='optionSrcer+optionTarget+"/flower/"+flowerF+".png"' :data-image-url='optionSrcer+optionTarget+"/flower/"+flowerF+".png"' v-on:error='notfounder'>
		</div>

		<!-- <div class="actions-group" v-if="$parent.step > 4">
			<button class="simu-button simu-button--primary" @click="optionsetModalOpen()">
				選択オプションを確認
			</button>
		</div> -->

	</div>
</template>

<style>
.simulator__image_view img,
.simulator__image_view object {
	opacity: 0;
	transition: 0s;
}

.simulator__image_view img.loaded,
.simulator__image_view object.loaded {
	opacity: 1;
	transition: 0.2s;
}
</style>
<script>

// コンポーネントのtemplateは、一つのタグですべて囲われていなければならん。注意。
//アロー関数では値が取れなくなる場合がある。　hoge:function(){}としろ。
module.exports = {
	props: ["uploadpass"],
	data: function () {
		return {
			svg: '',
			shadow: '',
			imageDirUrl: '/sandbox/images/simulator/svg_shadow2/',
			optionDirUrl: '/sandbox/images/simulator/options/',
			optionTargetResult: '',
			designList: [
				{
					id: 1,
					gender: 'men',
					name: 'ジャケット',
					styles: [1, 2, 3],
					categoryId: 1,
					categoryKatagamiId: 14,
					sub: '',
					is: (courseNo) => {
						return courseNo == '001' || courseNo == '002' || courseNo == '003' || courseNo == '004'
					}
				},
				{
					id: 4,
					gender: 'men',
					name: 'ベスト',
					styles: [1],
					categoryId: 2,
					categoryKatagamiId: 15,
					sub: '',
					is: (courseNo) => {
						return courseNo == '003' || courseNo == '005'
					}
				},
				{
					id: 2,
					gender: 'men',
					name: 'スラックス',
					styles: [1, 2, 3],
					categoryId: 3,
					categoryKatagamiId: 16,
					sub: '',
					is: (courseNo) => {
						return courseNo == '001' || courseNo == '002' || courseNo == '003' || courseNo == '006'
					}
				},
				{
					id: 3,
					gender: 'men',
					name: 'スラックス2',
					styles: [1, 2, 3],
					categoryId: 3,
					categoryKatagamiId: 16,
					sub: 'pants2',
					is: (courseNo) => {
						return courseNo == '002' || courseNo == '2'
					}
				},
				{
					id: 6,
					gender: 'women',
					name: 'ジャケット',
					styles: [1],
					categoryId: 5,
					categoryKatagamiId: 31,
					sub: '',
					is: (courseNos) => {
						return courseNos.indexOf('011') > -1
					}
				},
				{
					id: 7,
					gender: 'women',
					name: 'スラックス',
					styles: [1],
					categoryId: 6,
					categoryKatagamiId: 32,
					sub: '',
					is: (courseNos) => {
						return courseNos.indexOf('012') > -1
					}
				},
				{
					id: 8,
					gender: 'women',
					name: 'スラックス2',
					styles: [1],
					categoryId: 6,
					categoryKatagamiId: 32,
					sub: 'pants2',
					is: (courseNos) => {
						return courseNos[2] == '012' || (courseNos[0] == '012' && courseNos[1] == '012')
					}
				},
				{
					id: 9,
					gender: 'women',
					name: 'スカート',
					styles: [1],
					categoryId: 7,
					categoryKatagamiId: 33,
					sub: '',
					is: (courseNos) => {
						return courseNos.indexOf('013') > -1
					}
				},
				{
					id: 10,
					gender: 'women',
					name: 'スカート2',
					styles: [1],
					categoryId: 7,
					categoryKatagamiId: 33,
					sub: 'skirt2',
					is: (courseNos) => {
						return (courseNos[2] == '013' && courseNos[1] == '013') || (courseNos[0] == '013' && courseNos[1] == '013')
					}
				},
			],
		}
	},
	methods: {
		handleError() {
			if (this.imageDirUrl == this.imageDirMain) {
				this.imageDirUrl = this.imageDirFallback;
			} else {
				this.imageDirUrl = this.imageDirMain;
			}
		},
		optionsetModalOpen: function () {
			Vue.set(this.$parent, 'optionsetModalFlg', true);
		},
		notfounder: function (e) {
			e.target.src = '/sandbox/images/notfounder.png';
		},
		imageloaded: function (event) {
			//// console.log('imageloaded');
			var target = $(event.target);
			setTimeout(function () {
				target.addClass('loaded');
			}, 1000);
			//// console.log(target);
		},
		log(title, data) {
			console.log(title.toUpperCase().concat('::::::::::::::'), JSON.parse(JSON.stringify(data)));
		},
		orderList(style, cateogry, categoryKatagami, sub) {
			const c3Style = String(style);
			// const c3Cateogry = String(cateogry)
			const c3CategoryKatagami = String(categoryKatagami);
			const list = Object.values(this.$parent.masters.style).filter((parts) => {

				// // console.log('parts', JSON.parse(JSON.stringify(parts)));

				return (
					parts.style.includes(c3Style)
					&& (
						parts.pattern != false
						&& parts.pattern.includes(c3CategoryKatagami)
						&& (
							(this.$parent.selected.gender == 'women' || cateogry == 2)
							|| (this.$parent.selected.gender != 'women' && cateogry != 2)
						)
						&& parts.pattern.includes(String(this.selectedParts))
					) && (
						(this.$parent.selected.gender == 'men' && parts.gender.men == 'true')
						|| (this.$parent.selected.gender == 'women' && parts.gender.women == 'true')
					)
				);
			});
			return _.orderBy(list, 'rank', 'desc');
		},
	},
	watch: {
		targetSrc: function (newData) {
			if (newData.includes('svg_shadow')) {
				$('.simulator__image_view img,.simulator__image_view object').removeClass('loaded');
			}
		},
		optionTarget: function (v, ov) {
			// // console.log(this.optionSrcer+v+"/button/"+this.buttons+".png");
			// // console.log(this.optionSrcer+v+"/flower/"+this.flowerF+".png");
			// $('.simulator__image_view .options img,.simulator__image_view .options object').removeClass('loaded');
			// // console.log('option chang3e');
		},
		sampletorsosrc: function (newData) {
			if (newData.includes('svg_shadow')) {
				$('.simulator__image_view img,.simulator__image_view object').removeClass('loaded');
			}
		},
	},
	computed: {
		// selectedProduct:function(){
		// 	var target = '';
		// 	var thista = this;
		// 	$.each(this.$parent.productData,function(key,item){
		// 		if(item.product_code_min == thista.$parent.firstCheckers.cloth_no){
		// 			// console.log(item);
		// 			target = item;
		// 			return false;
		// 		}
		// 	})
		// 	return target;
		// },
		fabric: function () {
			if (!this.$parent.productData) return '';

			const fabricData = Object.values(this.$parent.productData).find(item => item.product_code_min == this.$parent.selected.sessions.ordersheet.cloth_no);
			if (fabricData) {
				return fabricData.main_image ? this.uploadpass + fabricData.main_image : '/sandbox/images/noimage.png';
			}
			return '';
		},
		lining: function () {
			if (this.$parent.optionData && this.$parent.optionData.mazemaze && this.$parent.selected.sessions.ordersheet.ura_cno) {
				this.$parent.selected.selectedOptions
				const optionId = 48;
				const liningOption = Object.values(this.$parent.optionData.mazemaze).find(item => item.option_id == optionId);
				if (liningOption) {
					const itemValue = this.$parent.selected.sessions.ordersheet.ura_cno;
					const lineingItem = Object.values(liningOption.optionitems).find(item => item.option_code == itemValue);

					if (lineingItem) {
						return lineingItem.option_image ? this.uploadpass + lineingItem.option_image : '/sandbox/images/noimage.png';
					}
				}
			}
			return '';
		},
		flowerF: function () {
			var flower = this.$parent.selected.sessions.ordersheet.colorcustoms_flower_hall;
			if (flower != '' && flower != null && flower != '00' && flower != '0') {
				return flower;
			} else {
				return '05';
			}
		},
		buttons: function () {
			var genders = this.$parent.selected.gender;
			var button = '';
			if (genders == 'men') {
				button = this.$parent.selected.sessions.ordersheet.button_cno;
			} else {
				button = this.$parent.selected.sessions.ordersheet.button_cno;
			}
			if (button != '' && button != null && button != '00' && button != '0') {
				return button;
			} else {
				return '19';
			}
		},
		targetSrc: function () {
			// console.log('COURSE_NO', this.courseNo);
			return this.imageDirUrl + this.courseNo + '/';
		},
		targetView: function () {
			var thista = this;
			var view = this.$parent.view;
			//// console.log('viewは'+view);
			// if (this.$parent.step >= 5) {

			// 	view = this.$parent.view2;
			// }


			var selectparts = '';
			$.each(thista.$parent.selected.parts, function (key, item) {
				selectparts = item;
			});
			var parts = selectparts.designParts;
			//// console.log(parts);
			if (parts != void 0 && parts.length > 1 && selectparts.masterNo != 36 && selectparts.masterNo != 37 && selectparts.masterNo != 38 && this.$parent.step >= 6) {
				view = this.$parent.view;
				//// console.log('全体を表示');
			}
			//// console.log('viewは'+view);
			return view.replace('_all', '');
		},
		defaultCategoryNo: function () {
			var targetc3;
			if (this.$parent.selected.gender == 'men') {
				targetc3 = "1";
			} else if (this.$parent.selected.gender == 'women') {
				targetc3 = "5";
			}
			return targetc3;
		},
		targetCategoryNo: function () {
			var targetc;
			targetc = this.$parent.c3Category;
			return targetc;
		},
		targetStyleNo: function () {
			var targetc;
			targetc = this.$parent.c3Style;
			return targetc;
		},
		targetOptionCategoryNo: function () {
			var targetc;
			targetc = this.$parent.optionC3Category;
			return targetc;
		},
		selectedParts: function () {
			var no = "";
			//// console.log("selectedParts");
			$.each(this.$parent.selected.parts, function (key, item) {
				//// console.log("対象のstyleNo:"+item.masterNo);
				no = item.masterNo;
			});
			return no;
		},
		design: function () {
			const courseNo = this.$parent.selected.code.course;
			if (!courseNo) return null;
			return this.designList.find(item => item.is(item.gender == 'men' ? courseNo : courseNo.split(',')));
		},
		targetCourser: function () {
			let category = null;
			if (this.$parent.step === 3) {
				category = (this.targetCategoryNo || this.defaultCategoryNo) + this.$parent.selected.c3sub;
			} else if (this.design) {
				category = this.design.categoryId;
			} else {
				category = this.defaultCategoryNo;
			}

			const getCourse = (category) => {
				const item = Object.values(this.$parent.selected.course[category]).find(value => !!value);
				this.log('item', item || {});
				if (!item && this.design) {
					const courses = this.orderList(1, this.design.categoryId, this.design.categoryKatagamiId, this.design.sub);
					return courses[0] || {}
				}
				return item || {};
			}
			return getCourse(category);
		},
		optionTarget: function () {
			Vue.set(this, 'optionTargetResult', 'up');
			return 'up';
		},
		optionSrcer: function () {
			var targetView = this.targetView;
			if (this.targetCourser != '' && this.targetCourser != void 0) {
				if (this.targetCourser.style_id != void 0) {
					var src = this.optionDirUrl + this.targetCourser.style_id + '/';
					if (targetView != "" && this.$parent.step >= 5) {
						src = this.optionDirUrl + this.$parent.zentaiNo + '/';
					}
				} else if (this.targetCourser.style_option != void 0) {
					var src = this.optionDirUrl + this.targetCourser.style_option + '/';
					if (targetView != "" && this.$parent.step >= 5) {
						src = this.optionDirUrl + this.$parent.zentaiNo + '/';
					}
				} else {
					// なにも選択されていない状態
					if (this.$parent.selected.gender == 'women') {
						var src = this.optionDirUrl + '5/';
					} else {
						var src = this.optionDirUrl + '3/';
					}
				}
			} else {
				// なにも選択されていない状態
				if (this.$parent.selected.gender == 'women') {
					var src = this.optionDirUrl + '5/';
				} else {
					var src = this.optionDirUrl + '3/';
				}
			}
			return src;
		},
		courseNo: function () {
			if ('style_id' in this.targetCourser) {
				const nums = this.targetCourser.style_id;
				this.log('nums', nums);
				if (Object.values(window.svgList).includes(nums)) {
					return nums;
				}
			} else if ('style_option' in this.targetCourser) {
				const nums = this.targetCourser.style_option;
				this.log('nums', nums);
				if (Object.values(window.svgList).includes(nums)) {
					return nums;
				}
			}
			return '';
		},
		modelsrc: function () {
			var model = this.$parent.model;
			var view = this.$parent.view;
			var gender = this.$parent.selected.gender;

			// console.log('GENDER', gender);
			// console.log('MODAL', model);
			// console.log('VIEW', view);

			if (view == '_all' && gender == 'women') {
				return "/sandbox/images/simulator/model/" + gender + "/sample_pants/svg.svg";
			} else {
				return "/sandbox/images/simulator/model/" + gender + "/" + model + "/model.svg";
			}
		},
		sampleshadowsrc: function () {
			var gender = this.$parent.selected.gender;
			var view = this.$parent.view;
			if (view == '_all' && gender == 'women') {
				return "/sandbox/images/simulator/model/" + gender + "/sample_pants/shadow.png";
			} else {
				return "/sandbox/images/simulator/model/" + gender + "/sample/shadow.png";
			}
		},
		sampletorsosrc: function () {
			var gender = this.$parent.selected.gender;
			var view = this.$parent.view;
			if (view == '_all' && gender == 'women') {
				return "/sandbox/images/simulator/model/" + gender + "/sample_pants/torso.png";
			} else {
				return "/sandbox/images/simulator/model/" + gender + "/sample/torso.png";
			}
		},
		targetSvgSrc: function () {
			return this.imageDirUrl + this.dirNo + 'svg.svg';
		},
		targetShadowSrc: function () {
			return this.imageDirUrl + this.shadow;
		},
		targetSvg: function () {
			//// console.log('現在のコースデータ');
			//// console.log(this.$parent.selected.targetCourseData);
			var target = '';
			var targetShadow = '';
			if ('svg' in this.$parent.selected.targetCourseData) {
				if (this.$parent.selected.targetCourseData.svg != null && this.$parent.selected.targetCourseData.svg != '') {
					target = this.$parent.selected.targetCourseData.svg;
				}
				if (this.$parent.selected.targetCourseData.shadow != null && this.$parent.selected.targetCourseData.shadow != '') {
					targetShadow = this.$parent.selected.targetCourseData.shadow;
				}
			}
			if (target != '') {
				Vue.set(this, 'svg', target);
			}
			if (targetShadow != '') {
				Vue.set(this, 'shadow', targetShadow + '.png');
			}

			return this.svg;

		}

	},
	mounted: function () {
		//// console.log("imageview mounted");
		var thista = this;
		Vue.set(this.$parent, 'view', this.$parent.checkSkPt);
		// this.$parent.view = this.$parent.checkSkPt;
		Vue.nextTick(function () {
			setTimeout(function () {
				// thista.$parent.texChanger();
			}, 100);
		});
	}
};
</script>