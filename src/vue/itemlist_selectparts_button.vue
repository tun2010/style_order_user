<template>
	<div class="products-container buttons-container" v-if="buttonOption">
		<div class="buttons-list vertical-scroll" @scroll="handleScroll">
			<ul class="products-list">
				<template v-for="item in optionItems(buttonOption.optionitems, searchKey)">
					<li class="product"
						v-if="optionItemHiddenChecker(item)"
						:class="{ active: isActive(item.option_code) }"
						:key="item.option_code">
						<button class="product-card" @click="selectOptionItem(item)">
							<figure>
								<img v-if="item.option_image" :src="uploadpass + item.option_image" alt="Button">
								<img v-else src="/images/noimage.png" alt="Button">
							</figure>
							<div class="product-detail">
								<div class="product-code">{{ item.option_code }}</div>
								<div class="product-name">{{ item.option_field }}</div>
							</div>
						</button>
					</li>
				</template>
			</ul>
		</div>
		<div class="product-arrows">
			<div class="arrow arrow--prev" v-if="prevIcon"></div>
			<div class="arrow arrow--next" v-if="nextIcon"></div>
		</div>
	</div>
    <div class="products-container buttons-container" v-else></div>
</template>

<script>
module.exports = {
    data: function () {
		return {
			prevIcon: false,
			nextIcon: true,
			optionData: null,
			optionLoad: false,
			katagamiKesuOption: {},
			katagami: {},
			searchKey: '',
			designList: [
				{
					id: 1,
					gender: 'men',
					name: 'ジャケット',
					styles: [1, 2, 3],
					categoryId: 2,
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
					categoryId: 3,
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
					categoryId: 4,
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
					categoryId: 4,
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
					sub: 'skirt2',
					is: (courseNos) => {
						return (courseNos[2] == '013' && courseNos[1] == '013') || (courseNos[0] == '013' && courseNos[1] == '013')
					}
				},
			],
            buttonOption: null,
		}
	},
	props: ["tantouflg", "uploadpass"],
	methods: {
		handleScroll(event) {
			const scrollX = event.target.scrollLeft;
			const maxX = event.target.scrollWidth - event.target.clientWidth - 3;
			this.prevIcon = scrollX > 3;
			this.nextIcon = scrollX < maxX;
		},
        isActive(option_code) {
            return this.$parent.selected.sessions.ordersheet[this.buttonOption.api_field] == option_code;
        },
        selectOptionItem(item) {
            Vue.set(this.$parent.selected.sessions.ordersheet, this.buttonOption.api_field, item.option_code);
        },
		optionItems(optionitems, filter = '') {
			let list = [];
			if (Array.isArray(optionitems)) list = optionitems;
			list = Object.values(optionitems);

			if (filter) {
				return list.filter(item => item.option_code.includes(filter));
			}
			return list;
		},
		optionItemHiddenChecker: function (item) {
			var checker = true;
			var thista = this;

			//期限チェックはsc_helper_optionでやってる
			//工場チェック
			if (item.option_factory != "" && item.option_factory != null) {
				var factoryList = [];
				if (item.option_factory.indexOf(",") > -1) {
					factoryList = item.option_factory.split(",");
				} else {
					factoryList[0] = item.option_factory;
				}

				$.each(factoryList, function (key2, item2) {
					if (item2 == thista.$parent.selectedProductData.factory) {
						//// console.log("工場だめ："+item.item_id);
						checker = false;
						return false;
					}
				});
			}
			//スーティストチェック
			if (item.option_tq == "1") {
				if (thista.$parent.selected.suitist) {

				} else {
					//// console.log(thista.$parent.selected.suitist);
					//// console.log("スーティストではないから出さない："+item.item_id);
					checker = false;
				}
			}
			return checker;
		},
		updateKitagami() {
			this.katagami = {};
			Object.entries(this.$parent.selected.course).forEach(([key, katagami]) => {
				Object.values(katagami).forEach(value => {
					this.katagami[key] = value;
				});
			});
		},
        updateOption() {
            const optionId = this.$parent.selected.gender == 'men' ? 49 : 50;
            this.buttonOption = Object.values(this.optionData.mazemaze).find(item => item.option_id == optionId);
            // console.log('OPTION_DATA::', JSON.parse(JSON.stringify(this.buttonOption)));
        },
		async getKatagamiOption(katagami) {
			const query = {
				headers: {
					"content-Type": "application/json;charset=UTF-8"
				},
				params: { katagami }
			};

			try {
				const result = await axios.get("/sandbox/ajaxTool/checkKatagamiOption.php", query);

				if (!result.data) throw new Error('Error');
				return result.data;
			} catch(error) {
				return null;
			}
		},
		async getOptionsData() {
			const katagami = {};
			Object.entries(this.katagami).forEach(([key, value]) => {
				if (value) {
					katagami[key] = value.pattern_id;
				}
			})

			const query = {
				headers: {
					"content-Type": "application/json;charset=UTF-8"
				},
				params: {
					kumiawaseId: this.$parent.selectedProductData.type,
					katagami: katagami,
					gender: this.$parent.selected.gender,
					katagamiNaiUser: this.$parent.katagamiNaiUser,
					parts: this.$parent.selected.parts,
					factory: this.$parent.selectedProductData.factory,
					gb: this.$parent.selected.gb ? 1 : '',
				}
			};
			try {
				const result = await axios.get("/sandbox/ajaxTool/getOptionKumiawase.php", query);

				if (!result.data) throw new Error('Error');
				this.$parent.optionData = result.data;
				this.optionData = result.data;

				// if (26 in this.$parent.optionData.mazemaze) {
				// 	if (this.isMenPantsAndNotWashable('pants', 'w_adjuster1')) {
				// 		Vue.set(this.$parent.selected.sessions.ordersheet, 'w_adjuster1', "0");
				// 	}
				// 	if (this.isMenPantsAndNotWashable('pants2', 'w_adjuster2')) {
				// 		Vue.set(this.$parent.selected.sessions.ordersheet, 'w_adjuster2', "0");
				// 	}
				// } else {
				// 	if (this.isPantsAndWristAdjuster('pants', 'w_adjuster1')) {
				// 		Vue.set(this.$parent.selected.sessions, 'w_adjuster1', null);
				// 	}
				// 	if (this.isPantsAndWristAdjuster('pants2', 'w_adjuster2')) {
				// 		Vue.set(this.$parent.selected.sessions, 'w_adjuster2', null);
				// 	}
				// }

				return true;
			} catch(error) {
				return false;
			}
		},
		async processKitagami() {
			this.katagamiKesuOption = {}
			for (const [key, value] of Object.entries(this.katagami)) {
				const result = await this.getKatagamiOption(JSON.stringify(value));
				if (result) {
					Object.values(result['kesuOption']).forEach(item => {
						this.katagamiKesuOption[item['option_id']] = item;
					});
				}
			}
			// // console.log('this.katagamiKesuOption::::::::::', JSON.parse(JSON.stringify(this.katagamiKesuOption)));
		},
        optionNaiChecker() {
            if (!this.$parent.selected.sessions.ordersheet[this.buttonOption.api_field]) {
                alert(`${this.buttonOption.option_name}を選択してください`);
                Vue.set(this.$parent, 'step', 4);
            }
        }
    },
	async mounted () {
		Vue.set(this.$parent, 'loading', true);
		this.updateKitagami();
		await this.getOptionsData();
		// await this.processKitagami();

        this.updateOption();

		Vue.set(this.$parent, 'loading', false);
		this.optionLoad = true;

		// console.log('SELECTED::PARTS', JSON.parse(JSON.stringify(this.$parent.selected.parts)));
		// console.log('ORDERSHEET::OPTIONS', JSON.parse(JSON.stringify(this.$parent.selected.sessions.ordersheet)));
		// console.log('SELECTED::OPTIONS', JSON.parse(JSON.stringify(this.$parent.selected)));
    },
	beforeDestroy: function () {
		if (this.$parent.step > 4) {
			this.optionNaiChecker();
		}
	}
}
</script>