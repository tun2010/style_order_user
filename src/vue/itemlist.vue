<!-- <template lang="pug">
div.simulator__selector
	div.sorter_flexer
		div.placeholder
		div.product__list__sorter(v-if="!$parent.kakuhoListFlg")
			span.button_white(v-on:click="kakuhoProductsList()") 確保済み生地
			span.button_filter(v-on:click="sortOpen()") 絞り込み検索

		div.product__list__sorter2(v-if='$parent.tantouFlg && !$parent.kakuhoListFlg')
			div.sorter2__flexer
				input(type='text' v-model='sorter2' placeholder='生地NO検索')
				span.search_icon

	transition(name="fade" mode="out-in")
		div.product__list(v-if="$parent.kakuhoListFlg" key="kakuholist")
			div.title_container
				div.design_title 確保済生地一覧
			ul.itemlistlazy
				li(
					v-for="product in kakuhoProduct"
					:data-productid="product.productdata.product_id"
					:class="{'active':selectedFabric == product.productdata.product_code_min}"
				)
					div.product__list__data
						div.product_flex(v-on:click="kakuhoitemClick(product)")
							p.product__list__data__maker {{product.productdata.product_code_min}}
							p.product__list__data__name {{product.productdata.name}}
							div.product__list__data__price
								div.price_name
									strong {{getPrice(product.productdata)}}
									small(v-if="getPrice(product.productdata)") 円
								div.wishable(v-if="product.productdata.check_washable")
								div.pleats(v-if="product.productdata.check_pleats")
						div.product__list__nokori(v-if="tantouflg == true")
							div.select_container
								div.custom_select
									div.custom_select__input
										div.selected_value
											span {{ product.kazu }}
										button.arrow(v-on:click="openSelect($event)")
									div.custom_select__layer(v-on:click="closeSelect($event)")
									div.custom_select__options
										div.custom_select__option(
											v-for="item in optionCreater(product.kazu)",
											v-on:click="selectSizeItem($event, product, item)",
											:class="{'active': product.kazu == item}"
										)
											span {{ item }}

		div.product__list(v-else key="products")
			p.info 生地をお選びください。
			ul.itemlistlazy
				li(
					v-for="(product, index) in productList" :key="index",
					:class="{'active':selectedFabric == product.product_code_min}",
					:data-productid="product.product_id",
					:data-jkonly="product.jk_only",
				)
					div.product__list__data(v-on:click="itemClick(product.product_id)" :data-id="product.id")
						p(v-if='$parent.debug') ※工場{{product.factory}}
						p.product__list__data__maker {{product.product_code_min}}
						p.product__list__data__name {{product.name}}
						div.product__list__data__price
							div.price_name
								strong {{getPrice(product)}}
								small(v-if="getPrice(product)") 円
							div.wishable(v-if="product.check_washable")
							div.pleats(v-if="product.check_pleats")
						div.product__list__nokori(v-if="tantouflg == true")
							p(v-if="product.stock_unlimited_max != 1") {{Math.floor(product.stock_min / stocktani.all)}}着
							p(v-else) 無制限
					div.product_actions
						button.buttons.button_primary(v-on:click="productInfoOpen(product.product_id)") 説明を見る
						button.buttons.button_white(v-on:click="kakuhoOpen(product.product_id)") 在庫確保
</template> -->

<template>
	<div class="products-container">
		<div class="products-controls"></div>
		<ul class="products-list vertical-scroll" @scroll="handleScroll">
			<li class="product" v-for="product in productList" :key="product.product_id" :class="{'active':selectedFabric == product.product_code_min}">
				<button class="product-card" @click="itemClick(product.product_id)">
					<div class="product-info">
						<div class="icon wishable" v-if="product.check_washable"></div>
						<div class="icon pleats" v-if="product.check_pleats"></div>
					</div>
					<figure>
						<img v-if="product.kiji_image" :src="uploadpass + product.kiji_image" alt="Frabic">
						<img v-else src="/images/noimage.png" alt="Frabic">
						<figcaption>生地名</figcaption>
					</figure>
					<div class="product-detail">
						<div class="product-code">{{ product.product_code_min }}</div>
						<div class="product-price">
							{{ getPrice(product) }}
							<small v-if="isPrice(product)">円</small>
						</div>
					</div>
				</button>
				<div class="product-action">
					<button class="style-button icon-end" @click="productInfoOpen(product.product_id)">説明を見る</button>
				</div>
			</li>
		</ul>
		<div class="product-arrows">
			<div class="arrow arrow--prev" v-if="prevIcon"></div>
			<div class="arrow arrow--next" v-if="nextIcon"></div>
		</div>
		<div class="prodcts-explain"></div>
	</div>
</template>

<style scoped>
.title_container {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 5vw;
	margin-top: 40px;
	position: sticky;
	z-index: 2;
	top: 0px;
	padding: 10px 0;
	background-color: #e3e3e3;
}

.title_container::before,
.title_container:after {
	content: "";
	display: block;
	flex: 1;
	height: 6px;
	border-top: 2px solid #777;
	border-bottom: 2px solid #777;
}
</style>

<script>
// コンポーネントのtemplateは、一つのタグですべて囲われていなければならん。注意。
//アロー関数では値が取れなくなる場合がある。　hoge:function(){}としろ。
//ワキタ工場の前寸があるユーザー（店舗じゃないユーザー）は、ワキタ工場の生地しか出さない
//ワキタ工場以外の前寸があるユーザー（店舗じゃないユーザー）は、ワキタ工場以外の生地しか出さない
module.exports = {
	data: function () {
		return {
			// stocktani:this.$parent.masters.stocklimit[this.$parent.selected.gender],
			kakuhoProduct: {},
			sorter2: '',
			genderSelector: true,
			prevIcon: false,
			nextIcon: true,
		}
	},
	mounted: function () {
		// console.log('SELECTED_ITEMLIST', JSON.parse(JSON.stringify(this.$parent.selected)));
		if (this.selectedFabric && this.productdata) {
			const product = Object.values(this.productdata).find(item => item.product_code_min === this.selectedFabric);
			if (product) {
				this.itemClick(product.product_id);
			}
		}
		// console.log('PRODUCT_DATA', JSON.parse(JSON.stringify(this.productdata)));
		// console.log('MASTER_LINE', JSON.parse(JSON.stringify(this.mastersLine)));
		// console.log('LINE_CHECKER', JSON.parse(JSON.stringify(this.lineChecker)));
		// console.log('SELECTED_ITEMLIST_STRING', JSON.stringify(this.$parent.selected));
		// console.log('PRODUCT_DATA', this.productdata);
		// 	$('.lazyitemlister').lazy({
		// 		appendScroll: $('.itemlistlazy'),

		//     effect: 'fadeIn',
		// 	effectTime:5000,
		// 	onLoad:function(){
		// 		//console.log('lazy loadddddd');
		// 	},
		//     onError: function(element) {
		//         //console.log('error loading ' + element.data('src'));
		//     }
		// });
		// //console.log('laaaaaaaaaaazyyyyyyyyyyy');

	},
	props: ["productdata", "tantouflg", "uploadpass"],
	computed: {
		targetParent: function () {
			// //console.log($('.itemlistlazy')[0]);
			return $('.itemlistlazy')[0];
		},
		stocktani: function () {
			if (this.$parent.selected.gender != "") {
				return this.$parent.masters.stocklimit[this.$parent.selected.gender];
			} else {
				return this.$parent.masters.stocklimit["men"];
			}
		},
		masters: function () {
			return this.$parent.masters.maker;
		},
		mastersLine: function () {
			return this.$parent.masters.line;
		},
		selectedFabric: function () {
			return this.$parent.selected.sessions.ordersheet.cloth_no;
		},
		selectedGender: function () {
			return this.$parent.selected.gender;
		},
		lineChecker: function () {
			return this.$parent.lineChecker;
		},
		productList() {
			const isGuest = (product) => {
				if (this.$parent.katagamiNaiUser === false) {
					return true;
				}

				return Array.isArray(product.kiji_disp) && product.kiji_disp.includes('4');
			}

			const isSuitist = (product) => {
				return !(this.$parent.selected.suitist && product.factory == "4423")
			}

			const isStock = (product) => {
				return (
					Math.floor(product.stock_min / this.stocktani.all) > 0
					|| product.stock_unlimited_max == 1
				);
			}

			const isMenOrLadiesline = (product) => {
				if (this.selectedGender == 'women') {
					return product.ladiesline != null
				}
				return this.selectedGender == 'men';
			}

			const isDisplay = (product) => {
				return (
					this.$parent.dispTypeChecker == '999999'
					|| (Array.isArray(product.kiji_disp) && product.kiji_disp.includes(this.$parent.dispTypeChecker))
				);
			}

			const withFilter = (product, text) => {
				if (!text) return true;

				const texts = text.split(/[ |　]+/g);
				let is = false;
				texts.forEach(code => {
					if (product.product_code_min.startsWith(code)) {
						is = true;
					}
				})
				return is;
			}

			const isKatagamiFactory = (product) => {
				if (this.$parent.tantouFlg) return true;

				const katagamiFactories = [];
				Object.values(this.$parent.selected.katagami).forEach(patterns => {
					Object.values(patterns).forEach(pattern => {
						pattern.factory.split(',').forEach(factory => {
							if (!katagamiFactories.includes(factory)) {
								katagamiFactories.push(factory);
							}
						});
					});
				});

				if (!katagamiFactories.length) return true;
				return katagamiFactories.includes(product.factory);
			}

			const list = [];
			this.$parent.productNarabi.forEach(index => {
				const product = this.productdata[index]
				if (product) {
					if (
						isGuest(product)
						&& isSuitist(product)
						&& isStock(product)
						&& isMenOrLadiesline(product)
						&& isDisplay(product)
						&& isKatagamiFactory(product)
						&& withFilter(product, this.sorter2)
					) {
						list.push(product);
					}
					// if (
					// 	isGuest(product)
					// 	&& (
					// 		(isSuitist(product) && isStock(product) && isMenOrLadiesline(product))
					// 		&& isDisplay(product)
					// 		&& withFilter(product, this.sorter2)
					// 	)
					// 	&& isKatagamiFactory(product)
					// ) {
					// 	list.push(product);
					// }
				}
			});

			return list;
		},
	},
	methods: {
		handleScroll(event) {
			const scrollX = event.target.scrollLeft;
			const maxX = event.target.scrollWidth - event.target.clientWidth - 3;
			this.prevIcon = scrollX > 3;
			this.nextIcon = scrollX < maxX;
		},
		openSelect(event) {
			$(event.target).parent().parent().toggleClass('active');

			var element = $(event.target)[0];
			var rect = element.getBoundingClientRect();
			var elementScreenY = rect.top;
			if (elementScreenY > window.innerHeight / 2) {
				$(event.target).parent().parent().addClass('position_top');
			} else {
				$(event.target).parent().parent().removeClass('position_top');
			}
		},
		closeSelect(event) {
			$(event.target).parent().removeClass('active');
		},
		selectSizeItem(event, product, value) {
			$(event.target).parent().parent().removeClass('active');

			var productJson = JSON.stringify(product);
			var value = parseInt(value);
			var sa = parseInt(product.kazu) - value;

			product.kazu = sa;

			let formdata = new URLSearchParams();
			formdata.append('product', productJson);
			formdata.append('sa', sa);

			axios.post("/sandbox/ajaxTool/kazuHerasuKakuhoItems.php", formdata).then(res => {
				if (res.data == 'ok') {
					alert('対象生地の確保数を変更しました。画面をリロードします。');
					this.$parent.setParam('gender', this.$parent.selected.gender);
					window.location.reload();
				} else {
					alert('エラーが発生しました。');
					this.$parent.setParam('gender', this.$parent.selected.gender);
					window.location.reload();
				}
			});
		},
		init: function () {
			//console.log('loaded');
		},
		beforeInit: function () {
			//console.log('loaded2');
		},
		optionCreater: function (num) {
			var count = num;
			var countList = [];
			for (i = count; i >= 0; i--) {
				countList.push(i);
			}
			//console.log(countList);
			return countList;
		},
		guestChecker: function (product) {
			if (!product) return false;
			if (this.$parent.katagamiNaiUser === false) {
				return true
			} else {
				if (!product.kiji_disp) { return false; }
				if (product.kiji_disp.indexOf('4') > -1) {
					return true
				} else {
					return false;
				}
			}
		},
		kakuhoKazuChange: function (product, event) {
			//console.log(product);
			var productJson = JSON.stringify(product);
			var value = parseInt(event.target.value);
			var sa = parseInt(product.kazu) - value;
			// var tani = 5.4;
			let formdata = new URLSearchParams();
			formdata.append('product', productJson);
			formdata.append('sa', sa);

			//console.log('sa '+ sa);
			axios.post("/sandbox/ajaxTool/kazuHerasuKakuhoItems.php", formdata).then(res => {
				//console.log(res.data);
				if (res.data == 'ok') {
					alert('対象生地の確保数を変更しました。画面をリロードします。');
					window.location.reload();
				} else {
					alert('エラーが発生しました。');
					window.location.reload();
				}
			});


		},
		sorter2run: function (product) {
			var text = this.sorter2;
			var texts = [];
			if (text.match(/[ |　]+/g) != null && text.match(/[ |　]+/g).length > 0) {
				texts = text.split(/[ |　]+/g);
			} else {
				texts[0] = text;
			}

			if (texts[0] != '') {
				if (texts.indexOf(product.product_code_min) > -1) {
					return true;
				}
				return false;
			} else {
				return true;
			}
		},
		katagamiFactoryChecker: function (product) {
			// console.log('======================================');
			// console.log(product);
			if (this.$parent.tantouFlg) {
				//仕様変更により店舗はいらなくなったのでtrue
				return true;
			} else {
				var kizifactory = product.factory;
				var katagamifactory = '';
				// console.log(kizifactory);
				var factorys = [];
				$.each(this.$parent.selected.katagami, function (key, item) {
					$.each(item, function (key2, item2) {
						// console.log(item2);
						factoryArray = [];
						if (item2.factory.indexOf(',') > -1) {
							factoryArray = item2.factory.split(',');
						} else {
							factoryArray[0] = item2.factory;
						}
						selectedArray = [];
						if (katagamifactory.indexOf(',') > -1) {
							selectedArray = katagamifactory.split(',');
						} else {
							selectedArray[0] = katagamifactory;
						}
						if (katagamifactory != '') {
							// console.log(selectedArray);
							// console.log(factoryArray);
							if (selectedArray.length > factoryArray.length) {
								katagamifactory = item2.factory;
							} else if (selectedArray.length == factoryArray.length) {
								katagamifactory = item2.factory;
							}

						} else {
							katagamifactory = item2.factory;
						}
						// factorys.push(item2);
					});
				})
				// console.log('対象の型紙ふぁくとり');
				// console.log(katagamifactory);
				if (katagamifactory != "") {
					if (katagamifactory.indexOf(kizifactory) > -1) {
						return true;
					} else {
						return false;
					}
				} else {
					return true;
				}
			}

		},
		//スーティスト店舗で中国工場製品ださんやつ
		suitister: function (product) {
			if (product == void 0) {
				return false;
			} else {
				// //console.log(product);
				if (this.$parent.selected.suitist && product.factory == "4423") {
					//console.log("スーティスト＋中国工場なので排除"+product.product_id);
					return false;
				}
				return true;
			}
		},
		proInit: function () {
			this.$parent.productDataInit();
			// Vue.set(this.$parent, 'kakuhoListFlg', false);
		},
		kakuhoProductsList: function () {
			Vue.set(this.$parent, 'kakuhoListFlg', true);

			const query = {
				headers: {
					"content-Type": "application/json;charset=UTF-8"
				},
				params: {
					shop_id: this.$parent.selected.sessions.base.customize_store,
					tantou_id: this.$parent.selected.sessions.base.customize_employee,
				}
			};

			console.log(JSON.parse(JSON.stringify(this.$parent.selected.sessions)));
			try {
				axios.get("/sandbox/ajaxTool/getKakuhoItems.php", query).then(res => {
					this.kakuhoProduct = res.data;
				})
			} catch(error) {
				this.kakuhoProduct = [];
			}
			console.log('kakuhoProduct', this.kakuhoProduct);
		},
		kakuhoOpen: function (productid) {
			this.$parent.kakuhoTarget = this.$parent.productData[productid];
			this.$parent.kakuhoFlg = true;
		},
		itemClick: function (product_id) {
			//コースの選択をリセットする
			//  Vue.set(this.$parent.selected,"parts",{});

			Vue.set(this.$parent.selected, "kakuhokizi", "");
			Vue.set(this.$parent.selected, "fabric", product_id);
			//console.log(this.$parent.selected.fabric);
			Vue.set(this.$parent.selected.sessions.ordersheet, "cloth_no", this.$parent.productData[product_id].product_code_min);
			Vue.set(this.$parent.selected.sessions.ordersheet, "deliv_flg", this.$parent.productData[product_id].deliv_flg);
			Vue.set(this.$parent, "selectedProductData", this.$parent.productData[product_id]);
			//console.log('this.$parent.selectedProductData');
			// console.log(this.$parent.selected.sessions.ordersheet);
			// console.log(this.$parent.productData[product_id]);
			//console.log(this.$parent.selectedProductData);
			// this.$parent.selected.fabric = product_id;
			this.$parent.checkOptionCourse();

		},
		kakuhoitemClick: function (orderData) {
			Vue.set(this.$parent.selected, "fabric", orderData.productdata.product_id);
			Vue.set(this.$parent.selected, "kakuhokizi", orderData.order_id);
			var product_id = orderData.productdata.product_id;
			Vue.set(this.$parent.selected.sessions.ordersheet, "cloth_no", this.$parent.productData[product_id].product_code_min);
			Vue.set(this.$parent, "selectedProductData", this.$parent.productData[product_id]);
			//console.log(this.$parent.selected.fabric);
			// this.$parent.selected.fabric = product_id;
			this.$parent.checkOptionCourse();
			// this.$parent.productSelectFlg = true;


		},
		// genderChanger: function (gender, master_no) {
		// 	if (this.$parent.selected.gender === gender) {
		// 		this.genderSelector = false;
		// 		return;
		// 	}
		// 	this.$parent.syokika('genderfirst');
		// 	Vue.set(this.$parent, 'firstCheckers', { ResetedFlg: false, jacket_dno: '', cloth_no: '', cloth_image: '', gb: false, washable: false, daiba: false, w_adjuster: false, factory: null, katafactory: "", allReseter: false, waistReseterFlg: false, daibaReseter: false });
		// 	Vue.set(this.$parent.selected, "gender", gender);
		// 	Vue.set(this.$parent.selected.sessions.ordersheet, "sex", master_no);
		// 	//console.log("パラメータリセット");
		// 	Vue.set(this.$parent.selected, "parts", {});
		// 	Vue.set(this.$parent.selected.code, "course", "");
		// 	Vue.set(this.$parent.selected.sessions.ordersheet, "course_no", "");
		// 	Vue.set(this.$parent.selected.sessions.ordersheet, "cloth_no", "");
		// 	Vue.set(this.$parent, "selectedProductData", { kiji_image: "", delivery: null });
		// 	Vue.set(this.$parent.selected, "fabric", "");

		// 	var thista = this;
		// 	setTimeout(function () {
		// 		if (thista.$parent.selected.gender == 'women') {
		// 			Vue.set(thista.$parent, 'view', '_skirt');
		// 		}
		// 		thista.$parent.texChanger();
		// 	}, 500);

		// 	thista.genderSelector = false;
		// },
		sortOpen: function () {
			Vue.set(this.$parent, "sortFlg", true);
		},
		productInfoOpen: function (product_id) {
			Vue.set(this.$parent, "productInfoFlg", true);
			Vue.set(this.$parent, "productInfoTarget", product_id);
		},
		getPrice(product) {
			const lineIndex = product[this.lineChecker];
			if (!lineIndex) return '';

			if (this.mastersLine[lineIndex]?.name) {
				return this.mastersLine[lineIndex].name
					.replace("標準 ￥", "")
					.replace('￥', '').replace('(税込み)', '');
			}
			return '';
		},
		isPrice(product) {
			const lineIndex = product[this.lineChecker];
			if (!lineIndex) return false;

			if (this.mastersLine[lineIndex]?.name) {
				const name = this.mastersLine[lineIndex]?.name;
				return !['特別インポート生地', '特別限定生地', '【特別限定生地】', '【特別限定インポート生地】'].includes(name);
			}
			return false;
		}
	},
	beforeDestroy: function () {
		if (this.$parent.selected.fabric) {

			if (this.$parent.guest === false && this.$parent.katagamiNaiUser == false) {
				//一旦在庫確保
				this.$parent.loading = true;
				let formdata = new URLSearchParams();
				var sessionJson = JSON.stringify(this.$parent.selected.sessions);
				formdata.append('quantity', 1 * this.$parent.stocktani.all);
				formdata.append('product_id', this.$parent.selected.fabric);
				formdata.append("token", this.$parent.token);
				formdata.append('ordersheet', sessionJson);
				formdata.append('kakuhokizi', this.$parent.selected.kakuhokizi);
				axios.post("/sandbox/ajaxTool/stepper_order_regist.php", formdata).then(res => {
					//console.log(res.data);
					if (res.data == "no stock") {
						//console.log("在庫確保失敗");
						alert("指定した生地の在庫がないようです。別の生地を選択してください。");
						this.$parent.step = 1;
						this.$parent.loading = false;
						// Vue.set(this.$parent,"loading",false);
					} else {
						//console.log("在庫確保OK");
						this.$parent.loading = false;
						// Vue.set(this.$parent,"step",2);
						// Vue.set(this.$parent,"loading",false);
					}
				});
			} else {
				//console.log('在庫の確保が必要ないユーザーなので確保しません');
			}
		} else {
			if (this.$parent.step == 0) return;
			if (this.$parent.staffstartFlg == false) {
				alert('生地を選択してください');
				this.$parent.step = 1;
			}
		}
	}
};
</script>