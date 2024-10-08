<!-- <template lang="pug">
	div.simulator__selector.simulator__selector_design
		div.top_placehilder
		div.product__list_select_parts
			p.info デザインをお選びください。
			div(v-for="design in designList" v-if="design.gender == $parent.selected.gender && design.is(design.gender == 'men' ? courseNo : courseNos)" :key="design.id")
				div.design_container
					div.title_container
						div.design_title {{design.name}}
							small を選ぶ
					div.part_list(:data-sp="selectedParts")
						div(v-for="styleId in design.styles")
							div.design_type(v-if="design.styles.length > 1")
								span {{styleNames[styleId]}}
									small から選ぶ
							div.design_type(v-else)
							//- v-on:click="partsClicker(parts.style_id,$event, design.sub)"
							div.clicknot_container
								template(
									v-for="(parts,key) in orderList(styleId, design.categoryId, design.categoryKatagamiId, design.sub)"
									:data-target="parts.style_id"
									:class="{'active':parts.style_id in selectedSelect(design.sub)}"
								)
									div.clicknot(
										v-for="(item,item_key) in patternList(parts.style_id, styleId, design.categoryId)"
										:data-target="item_key"
										:data-patternid="parts.pattern_id"
										:class="{'active':item.pattern_num == selectedSelectKatagamiNew(design.categoryId + design.sub)}"
									)
										div.katagami_selector_info
											p.katagami_num {{apiNameGetter(item,henkankun(String(design.categoryId)))}}
											p.katagami_size(v-if="item.pattern_num == selectedSelectKatagami && targetSize != ''")
												|選択したサイズ：{{targetSize}}
												span(v-if='$parent.selected.gender == "women"') 号
											p.katagami_detail {{item.detail_text}}
										div.selectparts__buttons
											a.buttons.icon-end(v-if="item.down_realfilename != '' && item.down_realfilename != null" :href="'https://style-order.taka-q.com/pdf.php?pdf='+item.pattern_id" target='_blank') 説明を見る
											p.buttons.icon-end(
												v-if="item.youtube !== null"
												v-on:click="katagamiPreClicker(item, design, item_key)"
											) サイズ選択
											//- v-on:click="katagamiPreClicker(item_key, item, item.style_option, item.pattern_num, item.pattern_id, 'normal', design.categoryId, design.categoryKatagamiId, design.sub)"


			//- div.product__list_selectparts__backer(v-if="disp == 2")
			//- 	p(v-on:click="backs()").buttons.buttons-black.buttons-small 一覧へ戻る

</template> -->

<template>
	<div class="designs-container">
		<div class="design-scroll vertical-scroll">
			<template v-for="design in designList">
				<template v-if="design.gender == $parent.selected.gender && design.is(design.gender == 'men' ? courseNo : courseNos)">
					<div class="sticky-title" :key="'design:' + design.id">
						<h3>
							{{ design.name }}<small>を選ぶ</small>
						</h3>
					</div>
					<div class="designs" v-for="styleId in design.styles" :key="'style:' + design.id + styleId">
						<h4 class="sub-title" v-if="design.styles.length > 1">
							{{ styleNames[styleId] }}<small>から選ぶ</small>
						</h4>
						<ul class="design-list">
							<template v-for="(parts, partIndex) in orderList(styleId, design.categoryId, design.categoryKatagamiId, design.sub)">
								<li
									class="design-card"
									:key="'desing-item:' + design.id + styleId + partIndex"
									v-if="!hideWishable(parts.style_id)"
								>
									<button class="design-button" @click.self="partsClicker(parts, design)" :class="{'active':parts.style_id in isSelect(design)}">
										<img :src="$parent.uploadPass + parts.images" alt="Design Image">
										<div class="design-detail">
											<div class="name">{{ parts.name }}</div>
											<button class="style-button icon-end"
												v-if="parts.detail_images !== null"
												@click.self="ivModalOpen(uploadpass + parts.detail_images,'image')"
											>
												写真で見る
											</button>
										</div>
									</button>
								</li>
							</template>
						</ul>
					</div>
				</template>
			</template>
		</div>
	</div>
</template>

<script>
// コンポーネントのtemplateは、一つのタグですべて囲われていなければならん。注意。
//アロー関数では値が取れなくなる場合がある。　hoge:function(){}としろ。
module.exports = {
	data: function () {
		return {
			disp: 1,
			styleTarget: 1,
			targetCourseData: {},
			// パンツ２枚目かスカート２枚目んときつかう
			sub: "",
			courseNo: this.$parent.selected.code.course,
			// 対応するセッションID
			session_himoduke: {
				"1": "jacket_dno",
				"2": "best_dno",
				"3": "slacks_dno1",
				"3pants2": "slacks_dno2",
				"5": "jacket_dno",
				"6": "slacks_dno1",
				"6pants2": "slacks_dno2",
				"7": "wo_sk_d1",
				"7skirt2": "wo_sk_d2",
			},
			sorterstext: '',
			sorters: false,

			styleNames: { 1: 'スリムタイプ', 2: 'レギュラータイプ', 3: 'リラックスタイプ' },
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
	beforeDestroy: function () {
		Vue.set(this.$parent.selected, 'step3disp', 1);
		Vue.set(this.$parent.selected, 'targetCourseData', {});
		Vue.set(this.$parent, 'view', this.$parent.checkSkPt);
		if (this.$parent.step > 3) {
			if (this.katagamiGBChecker()) {

			} else {
				alert('型紙でいずれかにGBが含まれていますので、すべての型紙にてGBのものを選択してください');
				Vue.set(this.$parent, 'step', 3);
			};
		}
	},
	props: ["partsdata", "tantouflg", "uploadpass"],
	watch: {
		sorterstext: function (v, ov) {
			if (v != '') {
				Vue.set(this, 'sorters', true);
				Vue.set(this, 'disp', 2);
			} else {
				Vue.set(this, 'sorters', false);
				Vue.set(this, 'disp', 1);
			}
		},
		sub: function (v, ov) {
			Vue.set(this.$parent.selected, 'c3sub', v);
			//// console.log('c3sub 変更');
			//// console.log(this.$parent.selected.c3sub);
		},
		disp: function (v, ov) {
			Vue.set(this.$parent.selected, 'step3disp', v);
		},
	},
	computed: {
		orded: function () {
			return _.orderBy(this.$parent.masters.style, 'rank');
		},
		ordedReverse: function () {
			return _.reverse(this.orded);
		},
		ordedkatagami: function () {
			return _.orderBy(this.$parent.selected.targetCourseData.katagami_pattern, 'rank');
		},
		ordedCategoryZen: function () {
			return _.orderBy(this.categoryZen(), 'rank');
		},
		ordedCategoryZenReverse: function () {
			return _.reverse(this.ordedCategoryZen);
		},
		ordedkatagamiReverse: function () {
			return _.reverse(this.ordedkatagami);
		},
		targetSize: function () {
			var target = "";
			switch (this.$parent.c3Category) {
				case (1):
					target = "jacket_size";
					break;
				case (2):
					target = "best_size";
					break;
				case (3):
					if (this.sub != "") {
						target = "slacks_size2";
					} else {
						target = "slacks_size1";
					}
					break;
				case (5):
					target = "jacket_size";
					break;
				case (6):
					if (this.sub != "") {
						target = "slacks_size2";
					} else {
						target = "slacks_size1";
					}
					break;
				case (7):
					if (this.sub != "") {
						target = "wo_sk_size2";
					} else {
						target = "wo_sk_size1";
					}
					break;
			}

			var sizer = this.$parent.selected.sessions.ordersheet[target];

			return sizer;



		},
		kizipleatsCheck: function () {
			if (this.$parent.selected.sessions.ordersheet.pleats_sta == "1") {
				return true;
			} else {
				return false;
			}
		},
		kiziwashableCheck: function () {
			if (this.$parent.selected.sessions.ordersheet.washable == "1") {
				return true;
			} else {
				return false;
			}
		},
		//女性用
		courseNos: function () {
			var course = this.$parent.selected.code.course;
			var courses = [];
			if (course.indexOf(",") > -1) {
				courses = course.split(",");
			} else {
				courses[0] = course;
			}
			// console.log("courseNos:::", courses);
			//// console.log(courses);
			return courses;
		},
		gender: function () {
			return this.$parent.selected.gender;
		},
		selectedSelect: function (sub) {
			return this.$parent.selected.course[this.$parent.c3Category + sub];
		},
		isSelect() {
			return (design) => this.$parent.selected.course[design.categoryId + design.sub];
		},
		selectedSelectKatagami: function () {
			var target = this.$parent.c3Category + this.sub;
			//// console.log("selectedSelectKatagami:"+this.$parent.selected.sessions.ordersheet[this.session_himoduke[target]]);
			return this.$parent.selected.sessions.ordersheet[this.session_himoduke[target]];

		},
		selectedSelectKatagamiNew: function () {
			return (target) => this.$parent.selected.sessions.ordersheet[this.session_himoduke[target]];
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
		selectedCourseInPatterns: function () {
			var katagami = "";
			// //// console.log(this.$parent.selected.targetCourseData);
			// //// console.log("test");
			// $.each(this.targetCourseData,function(key,item){
			// //// console.log(item);
			// //// console.log("↑");
			// if("katagami_pattern" in item){
			if ("katagami_pattern" in this.$parent.selected.targetCourseData) {
				katagami = this.ordedkatagamiReverse;
			}
			// }
			// });
			// // console.log("型紙");
			//// console.log(this.$parent.selected.targetCourseData);
			// // console.log(katagami);
			return katagami;
		}
	},
	methods: {
		hideWishable(id) {
			return this.$parent.selected.sessions.ordersheet.washable == '1' && ['6', '43'].includes(id);
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
			// // console.log('targetCourseData', JSON.parse(JSON.stringify(this.$parent.selected.targetCourseData)));
			// console.log('firstCheckers', JSON.parse(JSON.stringify(this.$parent.firstCheckers)));
			// console.log('DESIGN_LIST', JSON.parse(JSON.stringify(_.orderBy(list, 'rank', 'desc'))));
			return _.orderBy(list, 'rank', 'desc');
		},
		patternList(style, styleId, category) {
			let list = [];

			const styles = this.$parent.masters.style[style];

			if (!styles) return list;
			const c3Style = String(styleId);
			list = styles.katagami_pattern.filter(item => {

				return (
					(
						(
							(this.$parent.selected.gb && item.gb == '1')
							|| (
								!this.$parent.selected.gb
								&& (
									(this.$parent.selected.gender != 'women')
									&& item.style == c3Style
									|| category == 2
								)
								|| (this.$parent.selected.gender == 'women')
							)
						)
						&& (
							String(item.factory).indexOf(this.$parent.selectedProductData.factory) > -1
							|| this.$parent.debug
						) && (
							(this.kiziwashableCheck && this.optionKiziwashableCheck(item))
							|| this.kiziwashableCheck == false
							|| this.$parent.debug
						)
					)
					&& this.newChecker(item)
				);
			});

			// // console.log('STYLE_LIST', JSON.parse(JSON.stringify(_.orderBy(list, 'rank', 'desc'))));
			return _.orderBy(list, 'rank', 'desc');
		},
		firstkatagamiGBChecker: function () {
			if (this.$parent.selected.gender == 'men') {
				var parts = this.$parent.selected.parts;
				var designParts = '';
				$.each(parts, function (key, item) {
					designParts = item.designParts;
				});
				var targetArray = [];
				if (designParts.indexOf('jacket') > -1) {
					targetArray.push("1");
				}
				if (designParts.indexOf('pants') > -1) {
					targetArray.push("3");
				}
				if (designParts.indexOf('pants2') > -1) {
					targetArray.push("3pants2");
				}
				if (designParts.indexOf('vest') > -1) {
					targetArray.push("2");
				}
				var gbs = {};
				$.each(this.$parent.selected.katagami, function (key, item) {
					if (targetArray.indexOf(key) > -1) {
						$.each(item, function (key2, item2) {
							gbs[key] = item2.gb;
						})
					}
				});
				// // console.log('GBかどうかのリスト');
				// // console.log(gbs);
				var finalFlg = false;
				$.each(gbs, function (key, item) {
					if (item == "1") {
						finalFlg = true;
					}
				});
				if (finalFlg == true) {
					Vue.set(this.$parent.selected, 'gb', true);
				} else {
					Vue.set(this.$parent.selected, 'gb', false);
				}
			} else {

			}
		},
		katagamiGBChecker: function () {
			if (this.$parent.selected.gender == 'men') {
				var parts = this.$parent.selected.parts;
				var designParts = '';
				$.each(parts, function (key, item) {
					designParts = item.designParts;
				});
				var targetArray = [];
				if (designParts.indexOf('jacket') > -1) {
					targetArray.push("1");
				}
				if (designParts.indexOf('pants') > -1) {
					targetArray.push("3");
				}
				if (designParts.indexOf('pants2') > -1) {
					targetArray.push("3pants2");
				}
				if (designParts.indexOf('vest') > -1) {
					targetArray.push("2");
				}
				var gbs = {};
				$.each(this.$parent.selected.katagami, function (key, item) {
					if (targetArray.indexOf(key) > -1) {
						$.each(item, function (key2, item2) {
							gbs[key] = item2.gb;
						})
					}
				});
				// // console.log('GBかどうかのリスト');
				// // console.log(gbs);
				var gbser = '';
				var finalFlg = true;
				$.each(gbs, function (key, item) {
					if (gbser == '') {
						gbser = item;
					} else {
						if (gbser != item) {
							finalFlg = false;
						}
					}
				});
				return finalFlg;
			} else {
				return true;
			}
		},
		newChecker: function (parts) {
			// // console.log(parts);
			if (this.$parent.sinki == true) {
				if (parts.new_flg == 1) {
					return true;
				} else {
					return false;
				}
			} else {
				return true;
			}
		},
		styleChecker: function (parts) {
			var target = '' + this.$parent.c3Style;
			var partsStyle = parts.style;
			if (partsStyle.indexOf(target) > -1) {
				return true;
			} else {
				return false;
			}

		},
		sorter2run: function (product) {
			var text = this.sorterstext;
			var texts = [];
			if (text.match(/[ |　]+/g) != null && text.match(/[ |　]+/g).length > 0) {
				texts = text.split(/[ |　]+/g);
			} else {
				texts[0] = text;
			}

			if (texts[0] != '') {
				if (texts.indexOf(product.pattern_num) > -1) {
					return true;
				}
				return false;
			} else {
				return true;
			}
		},
		categoryZen: function () {
			var zenmasu = this.$parent.masters.style;
			var c3CategoryKatagami = '' + this.$parent.c3CategoryKatagami;
			var targets = [];
			$.each(zenmasu, function (key, item) {
				if (item.pattern != false && item.pattern != null && item.pattern.indexOf(c3CategoryKatagami) > -1) {
					targets.push(item);
				}
			});
			var targetKatagamis = [];
			$.each(targets, function (key, item) {
				if (item.katagami_pattern != false && item.katagami_pattern != null) {
					$.each(item.katagami_pattern, function (key, item) {
						targetKatagamis.push(item);
					})
				}
			})
			//// console.log('カテゴリ内全スタイル');
			//// console.log(targetKatagamis);
			return targetKatagamis
		},
		categoryZen2(categoryKatagami) {
			var zenmasu = this.$parent.masters.style;
			var c3CategoryKatagami = String(categoryKatagami);
			var targets = [];
			$.each(zenmasu, function (key, item) {
				if (item.pattern != false && item.pattern != null && item.pattern.indexOf(c3CategoryKatagami) > -1) {
					targets.push(item);
				}
			});
			var targetKatagamis = [];
			$.each(targets, function (key, item) {
				if (item.katagami_pattern != false && item.katagami_pattern != null) {
					$.each(item.katagami_pattern, function (key, item) {
						targetKatagamis.push(item);
					})
				}
			})
			//// console.log('カテゴリ内全スタイル');
			//// console.log(targetKatagamis);
			return targetKatagamis
		},

		apiNameGetter: function (parts, target) {
			var result = parts['pattern_num'];
			if (Object.keys(parts.api_field).length > 0) {
				if (target in parts.api_field) {
					if (parts.api_field[target].api_field != '' && parts.api_field[target].api_field != null) {
						return parts.api_field[target].api_field;
					} else {
						return parts['pattern_num'];
					}
				}
				// result = parts.api_field[target].api_field;

			}
			return result;
		},
		// $parent.c3Categoryを、api_field用に変換
		henkankun: function (target) {
			var result = '';
			switch (target) {
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
		optionKizipleatsCheck: function (parts) {
			if ("option_id" in parts) {
				if ("17" in parts.option_id) {
					return true;
				}
			}
			return false;
		},
		optionKiziwashableCheck: function (parts) {
			if ("option_id" in parts) {
				if ("61" in parts.option_id) {
					return true;
				}
			}
			return false;
		},
		backs: function () {
			this.disp = 1;
			Vue.set(this, 'sorters', false);
			Vue.set(this, 'sorterstext', '');
		},
		partsClicker: function (parts, design) {
			// console.log('SELECTED_COURCES_BEFORE::', JSON.parse(JSON.stringify(this.$parent.selected.course)));
			this.c3CateChanger(design.categoryId, design.sub, design.categoryKatagamiId);

			const target = parts.style_id;

			// console.log(this.$parent.c3Category, this.sub);
			// console.log('TARGET::', target, target in this.$parent.selected.targetCourseData);

			if (!(target in this.$parent.selected.targetCourseData)) {
				// console.log('INSIDE');
				this.$parent.partsClicker03(target);
				if (this.$parent.katagamiNaiUser) {
					//遊びだけできるユーザーの挙動
					Vue.set(this.$parent.selected.course, this.$parent.c3Category + this.sub, {});
					Vue.set(this.$parent.selected.course[this.$parent.c3Category + this.sub], this.$parent.selected.styleTarget, this.$parent.masters.style[this.$parent.selected.styleTarget]);
				}
			}

			console.log('SELECTED_AFTER::', JSON.parse(JSON.stringify(this.$parent.selected)));
		},
		katagamiPreClicker: function (selectedCourse, design, target) {
			const type = 'normal';
			const styleno = selectedCourse.style_option,
				pattern_nums = selectedCourse.pattern_num,
				pattern_ids = selectedCourse.pattern_id,
				category = design.categoryId,
				categoryKatagami = design.categoryKatagamiId,
				sub = design.sub
			;

			Vue.set(this.$parent, 'designSelectedParams', { target, selectedCourse, styleno, pattern_nums, pattern_ids, type, category, categoryKatagami, sub });

			this.c3CateChanger(category, sub, categoryKatagami);
			Vue.set(this.$parent, "selectedKatagamiId", pattern_ids);
			Vue.set(this.$parent, "sizeSelectModalFlg", true);
		},
		katagamiClicker: function (target, selectedCourse, event, styleno, pattern_nums, pattern_ids, type, category, categoryKatagami, sub) {
			const c3Category = String(category);

			if (this.sorters) {
				this.partsClicker(styleno, '');
			}

			var zenKatagami = this.categoryZen2(categoryKatagami);
			targetDom = $(event.target);
			// // console.log(this.$parent.c3Category);
			// // console.log(this.$parent.c3Style);

			Vue.set(this.$parent.selected.course, c3Category + sub, {});
			// Vue.set(this.$parent.selected.course[this.$parent.c3Category+this.sub],this.$parent.selected.styleTarget,this.$parent.masters.style[this.$parent.selected.styleTarget]);

			if (type == 'zen') {
				Vue.set(this.$parent.selected.course[c3Category + sub], this.$parent.selected.styleTarget, zenKatagami[target]);
			} else {
				Vue.set(this.$parent.selected.course[c3Category + sub], this.$parent.selected.styleTarget, selectedCourse);
			}
			//// console.log("this.$parent.selected.course");
			//// console.log(this.$parent.selected.course);
			// Vue.set(this.$parent.selected,'katagami',{});
			Vue.set(this.$parent.selected.katagami, c3Category + sub, {});
			if (type == 'zen') {
				Vue.set(this.$parent.selected.katagami[c3Category + sub], target, zenKatagami[target]);
			} else {
				Vue.set(this.$parent.selected.katagami[c3Category + sub], target, selectedCourse);
			}
			//オプション選択内容をリセット
			// // console.log('あなたが選択した型紙↓');
			// // console.log(this.$parent.selected.course[this.$parent.c3Category+this.sub][this.$parent.selected.styleTarget]);
			if ((this.$parent.selected.sessions.ordersheet.air_fit != '' && this.$parent.selected.sessions.ordersheet.air_fit != null && this.$parent.selected.sessions.ordersheet.air_fit != "0") && (c3Category == "1" || c3Category == "5") && !(43 in this.$parent.selected.course[c3Category + sub][this.$parent.selected.styleTarget].option_id)) {
				// // console.log('エアーフィットがついとるのに型紙は対応してない');
				alert('エアーフィットに対応していない型紙なので、エアーフィットを解除します。');
				Vue.set(this.$parent.selected.sessions.ordersheet, 'air_fit', null);
			}
			// this.$parent.optionReseter();

			if (c3Category == "1" || c3Category == "5") {
				Vue.set(this.$parent.selected.sessions.ordersheet, "jacket_dno", pattern_nums);
				//firstcheckersを設定しなおす
				if (this.$parent.firstCheckers.ResetedFlg == false || this.$parent.tantouFlg == true) {
					Vue.set(this.$parent.firstCheckers, "jacket_dno", pattern_nums);
				}

				Vue.set(this.$parent.selected.sessions.ordersheet, "jacket_dno", pattern_nums);
			} else if ((c3Category == "3" && sub == "") || (c3Category == "6" && this.sub == "")) {
				Vue.set(this.$parent.selected.sessions.ordersheet, "slacks_dno1", pattern_nums);
			} else if ((c3Category == "3" && sub == "pants2") || (c3Category == "6" && sub == "pants2")) {
				Vue.set(this.$parent.selected.sessions.ordersheet, "slacks_dno2", pattern_nums);
			} else if (c3Category == "2") {
				Vue.set(this.$parent.selected.sessions.ordersheet, "best_dno", pattern_nums);
			}
			else if (c3Category == "7" && sub == "") {
				Vue.set(this.$parent.selected.sessions.ordersheet, "wo_sk_d1", pattern_nums);
			} else if (c3Category == "7" && sub == "skirt2") {
				Vue.set(this.$parent.selected.sessions.ordersheet, "wo_sk_d2", pattern_nums);
			}
			//// console.log("現在のselected session↓");
			//// console.log(this.$parent.selected.sessions.ordersheet);
			//// console.log("現在のselected katagami");
			//// console.log(this.$parent.selected.katagami);
			Vue.set(this.$parent, "selectedKatagamiId", pattern_ids);
			var thista = this;
			Vue.nextTick(function () {
				if (c3Category != 2) {
					// // console.log("TYPE::::::", type);
					// // console.log(thista.selectedCourseInPatterns);
					// // console.log(thista.categoryZen());
					// // console.log(target);
					// var zenKatagami = thista.categoryZen();
					// // if(thista.selectedCourse.gb == "1"){
					// var targetKatagamiList = selectedCourseInPatterns;
					// if (type == 'zen') {
					//     targetKatagamiList = zenKatagami;
					// }
					if (selectedCourse.gb == "1") {
						thista.$parent.selected.gb = true;
						//firstcheckersを設定しなおす
						if (thista.$parent.firstCheckers.ResetedFlg == false || thista.$parent.tantouFlg == true) {
							Vue.set(thista.$parent.firstCheckers, "gb", true);
						}
					} else {
						thista.$parent.selected.gb = false;
						Vue.set(thista.$parent.firstCheckers, "gb", false);
					}
				} else {
					// var targetKatagamiList = selectedCourseInPatterns;
					// if (type == 'zen') {
					//     targetKatagamiList = zenKatagami;
					// }
					if (selectedCourse.gb == "1") {
						thista.$parent.selected.gb = true;
						//firstcheckersを設定しなおす
						if (thista.$parent.firstCheckers.ResetedFlg == false || thista.$parent.tantouFlg == true) {
							Vue.set(thista.$parent.firstCheckers, "gb", true);
						}
					} else {
						thista.$parent.selected.gb = false;
						Vue.set(thista.$parent.firstCheckers, "gb", false);
					}
				}
			});
			// }

			if (c3Category == 1 || c3Category == 5) {
				// // console.log('裏仕様チェック');
				if (type == 'zen') {
					// // console.log(zenKatagami[target]['urashiyo']);
					if (zenKatagami[target]['urashiyo'].length > 0) {
						if (zenKatagami[target]['urashiyo'].indexOf(this.$parent.selected.sessions.ordersheet.ext_specification_normal)) {

						} else {
							Vue.set(this.$parent.selected.sessions.ordersheet, 'ext_specification_normal', zenKatagami[target]['urashiyo'][0]);
						}
					} else {
						// // console.log('ひとつもチェックされていない');
						Vue.set(this.$parent.selected.sessions.ordersheet, 'ext_specification_normal', null);
					}
				} else {
					// // console.log(this.selectedCourse['urashiyo']);
					if (selectedCourse['urashiyo'].length > 0) {
						if (selectedCourse['urashiyo'].indexOf(this.$parent.selected.sessions.ordersheet.ext_specification_normal)) {

						} else {
							Vue.set(this.$parent.selected.sessions.ordersheet, 'ext_specification_normal', selectedCourse['urashiyo'][0]);
						}
					} else {
						// // console.log('ひとつもチェックされていない');
						Vue.set(this.$parent.selected.sessions.ordersheet, 'ext_specification_normal', null);
					}
				}
				// // console.log(this.$parent.selected.sessions.ordersheet);
			}
			Vue.set(this.$parent, "sizeSelectModalFlg", true);
			// this.$parent.selected.parts[target] = this.$parent.selectparts[this.gender][target];

			if (this.$parent.firstCheckers.ResetedFlg == false || this.$parent.tantouFlg == true) {
				this.$parent.isKataFacChecker();
				// // console.log('firstCheckersの型紙ファクトリをセットし直す');
				// // console.log(this.$parent.firstCheckers);
			}

			//パワストチェック
			if (this.$parent.selected.sessions.ordersheet.ext_specification != '' && this.$parent.selected.sessions.ordersheet.ext_specification != null && this.$parent.selected.sessions.ordersheet.ext_specification != "0") {
				var powerTaiouFlg = {};
				$.each(this.$parent.selected.course, function (key, item) {
					$.each(item, function (key2, item2) {
						if (52 in item2.option_id) {
							powerTaiouFlg[key] = true;
						} else {
							powerTaiouFlg[key] = false;
						}
					})
				})
				// // console.log(powerTaiouFlg);
				var parts = this.$parent.selected.parts;
				var styleNo = '';
				var thista = this;
				$.each(parts, function (key, item) {
					styleNo = item.styleNo;
				});
				if (styleNo == 4 || styleNo == 5 || styleNo == 6 || styleNo == 1 || styleNo == 10 || styleNo == 11 || styleNo == 15 || styleNo == 17 || styleNo == 16 || styleNo == 7) {
					if ((thista.$parent.selected.gender == 'men' && 1 in powerTaiouFlg) || (thista.$parent.selected.gender == 'women' && 5 in powerTaiouFlg)) {
						if ((thista.$parent.selected.gender == 'men' && powerTaiouFlg[1] == true) || (thista.$parent.selected.gender == 'women' && powerTaiouFlg[5] == true)) {
							// // console.log('パワストOK');
						} else {
							// // console.log('パワストだめ1');
							alert('パワーストレッチに対応していないため、パワーストレッチを解除します。');
							Vue.set(this.$parent.selected.sessions.ordersheet, "ext_specification", null);
						}
					} else {
						// // console.log('パワストだめ2');
						alert('パワーストレッチに対応していないため、パワーストレッチを解除します。');
						Vue.set(this.$parent.selected.sessions.ordersheet, "ext_specification", null);
					}
				}
				else if (styleNo == 3) {
					if (3 in powerTaiouFlg) {
						if (powerTaiouFlg[3] == true) {
							// // console.log('パワストOK');
						} else {
							// // console.log('パワストだめ3');
							alert('パワーストレッチに対応していないため、パワーストレッチを解除します。');
							Vue.set(this.$parent.selected.sessions.ordersheet, "ext_specification", null);
						}
					} else {
						// // console.log('パワストだめ4');
						alert('パワーストレッチに対応していないため、パワーストレッチを解除します。');
						Vue.set(this.$parent.selected.sessions.ordersheet, "ext_specification", null);
					}
				}
			}

			// // console.log('SELECTED_DESIGN', JSON.parse(JSON.stringify(this.$parent.selected)));
		},
		ivModalOpen: function (target, type) {
			Vue.set(this.$parent, "imageAndVideoModalFlg", true);
			Vue.set(this.$parent, "ivModalType", type);
			if (type == "image") {
				Vue.set(this.$parent, "modalImage", target);
			} else if (type == "video") {
				Vue.set(this.$parent, "modalVideo", target);
			}
		},
		katagamiInfoOpen: function (katagamiInfoText) {
			Vue.set(this.$parent, "katagamiInfoFlg", true);
			Vue.set(this.$parent, "katagamiInfoText", "");
			Vue.set(this.$parent, "katagamiInfoText", katagamiInfoText);

		},
		c3CateChanger: function (target, sub, katagaminoNo) {
			Vue.set(this.$parent.selected, "targetCourseData", {});
			Vue.set(this.$parent, 'view', '')
			if (sub != "") {
				// this.sub = sub;
				Vue.set(this, 'sub', sub);
				Vue.set(this.$parent, 'sub', sub);
				// this.$parent.sub = sub;
				//// console.log("２枚目のものを選択");
				//// console.log(this.sub);
			} else {
				Vue.set(this, 'sub', "");
				Vue.set(this.$parent.selected, 'c3sub', "");
				Vue.set(this.$parent, 'sub', "");
				// this.$parent.sub = "";
				//// console.log("1枚目のものを選択");
				//// console.log(this.sub);
			}
			this.disp = 1;
			Vue.set(this.$parent, "c3Category", target);
			Vue.set(this.$parent, "c3CategoryKatagami", katagaminoNo);

			// // console.log("c3Category", this.$parent.c3Category);
			// // console.log("c3CategoryKatagami", this.$parent.c3CategoryKatagami);
			// // console.log("c3Style", this.$parent.c3Style);

			// // console.log("targetCourseData", this.$parent.selected.targetCourseData);
			// // console.log(this.$parent.masters);

			switch (target) {
				case 1:
				case 5:
					Vue.set(this.$parent, 'view', '');
					break;
				case 2:
					Vue.set(this.$parent, 'view', '');
					break;
				case 3:
				case 6:
					Vue.set(this.$parent, 'view', '');
					break;
				case 7:
					Vue.set(this.$parent, 'view', '');
					break;
			}
			// this.categoryZen();
		},
		c3StyleChanger: function (target) {
			var c3cate = this.$parent.c3Category;
			Vue.set(this.$parent, 'view', '');
			Vue.set(this.$parent, 'c3Category', '');
			Vue.set(this.$parent, 'c3Category', c3cate);
			this.disp = 1;
			Vue.set(this.$parent, "c3Style", target);
			// if(this.$parent.c3Category == 2){
			// 	this.partsClicker(2,"");
			// }
			//// console.log("コースで表示する箇所が変更されました:"+this.$parent.c3Category);
			//// console.log("コースで表示するスタイルが変更されました:"+this.$parent.c3Style);
		}
	},
	mounted: function () {
		this.firstkatagamiGBChecker();
		// console.log('SELECTED::DESIGN', JSON.parse(JSON.stringify(this.$parent.selected)));
		// Vue.nextTick(function(){
		// 	$('.selector_design__category').find('ul').eq(0).find('li').eq(0).click();
		// });
	},

};
</script>