<!-- <template lang="pug">
	div.simulator__selector
		div.top_placehilder
		div.product__list_selectparts
			p.info コースをお選びください。
			ul
				li(v-for="(parts,key) in partsdata[gender]" :data-target="key" v-on:click="partsClicker(key,$event)" :class="{'active':key in selectedSelect}" v-if='guestPartsChecker(parts) && factoryChecker(parts) && jacketonlyChecker(parts) && pleatsChecker(parts)')
					div
						figure
							img( v-bind:src="parts.img")
						div
							p.selectparts__ja {{parts.ja}}


</template> -->

<template>
	<div class="parts-container">
		<ul class="parts-list vertical-scroll" ref="partsEl">
			<template v-for="(parts, key) in partsdata[gender]">
				<li class="part" :key="key" v-if="
					guestPartsChecker(parts) &&
					factoryChecker(parts) &&
					jacketonlyChecker(parts) &&
					pleatsChecker(parts)
				">
					<button class="part-button" :data-target="key" @click="partsClicker(key)"
						:class="{ active: key in selectedSelect }">
						<img :src="parts.img" alt="Part">
						<div class="name">{{ parts.ja }}</div>
					</button>
				</li>
			</template>
		</ul>
	</div>
</template>

<script>
// コンポーネントのtemplateは、一つのタグですべて囲われていなければならん。注意。
//アロー関数では値が取れなくなる場合がある。　hoge:function(){}としろ。
module.exports = {
	data: function () {
		return {
			nanimonai: false,
		};
	},
	props: ["tantouflg", "uploadpass"],
	computed: {
		gender: function () {
			return this.$parent.selected.gender;
		},
		selectedSelect: function () {
			return this.$parent.selected.parts;
		},
		partsdata: function () {
			return this.$parent.selectparts;
		},
		stocktani: function () {
			return this.$parent.masters.stocklimit[this.$parent.selected.gender];
		},
	},
	mounted: function () {
		// console.log('SELECTED::PARTS', JSON.parse(JSON.stringify(this.$parent.selected)));
		const parts = this.$refs.partsEl.querySelectorAll('.part');
		console.log('PARTS LIST MOUNTED', parts.length);
		if (parts.length == 0) {
			console.log('FIRST CONDITION');
			alert("お客様の選択された生地では選択できるコースがありません。別の生地を選択してください");
			this.nanimonai = true;
			Vue.set(this.$parent, "step", 1);
		} else {
			console.log('SECOND CONDITION');
			this.nanimonai = false;
		}
	},
	beforeDestroy: function () {
		console.log('SOMEHOW BEFORE DISTORY RUN');
		//実際にアクティブになっているパーツの数
		const part = this.$refs.partsEl.querySelector('.part-button.active');
		if (
			(Object.keys(this.selectedSelect).length < 1 && this.nanimonai == false)
			|| !part
		) {
			var jkonly = this.$parent.selectedProductData.jk_only;
			if (jkonly == 1) {
				alert("ジャケット専用生地です。コース選択をご確認ください");
			} else {
				alert("ご希望のコースを選択してください");
			}
			Vue.set(this.$parent, "step", 2);
		} else {
			// console.log('irannokesu');
			this.$parent.finalSheetCheck();
		}
	},
	methods: {
		//プリーツがONの場合、パンツ含むスタイルしか選べない
		pleatsChecker(parts) {
			if (this.$parent.selected.sessions.ordersheet.pleats_sta == 1) {
				if (parts.designParts.indexOf("pants") > -1) {
					return true;
				} else {
					return false;
				}
			} else {
				return true;
			}
		},
		//ゲストは前寸データで既に型紙があるパーツしかつかえないので
		guestPartsChecker: function (parts) {
			if (
				this.$parent.tantouFlg == false &&
				this.$parent.katagamiNaiUser == false
			) {
				// console.log('使えるパーツチェック');
				var ordersheet = this.$parent.selected.sessions.ordersheet;
				var jacket = ordersheet.jacket_dno;
				var jacketFlg = true;
				if (jacket == "" || jacket == null || jacket == void 0) {
					jacketFlg = false;
				}
				var pants = ordersheet.slacks_dno1;
				var pantsFlg = true;
				if (pants == "" || pants == null || pants == void 0) {
					pantsFlg = false;
				}
				var vest = ordersheet.best_dno;
				var vestFlg = true;
				if (vest == "" || vest == null || vest == void 0) {
					vestFlg = false;
				}
				var skirt = ordersheet.wo_sk_d1;
				var skirtFlg = true;
				if (skirt == "" || skirt == null || skirt == void 0) {
					skirtFlg = false;
				}
				// console.log('パーツは');
				// console.log(parts);
				if (parts.designParts.indexOf("jacket") > -1 && jacketFlg == false) {
					return false;
				}
				if (parts.designParts.indexOf("pants") > -1 && pantsFlg == false) {
					return false;
				}
				if (parts.designParts.indexOf("vest") > -1 && vestFlg == false) {
					return false;
				}
				if (parts.designParts.indexOf("skirt") > -1 && skirtFlg == false) {
					return false;
				}
				return true;
			} else {
				return true;
			}
		},
		factoryChecker: function (parts) {
			var factory = this.$parent.selectedProductData.factory;
			if (factory == 4423 && parts.designParts.length <= 1) {
				return false;
			}
			return true;
		},
		jacketonlyChecker: function (parts) {
			var jkok = [1, 2, 7];
			var jkonly = this.$parent.selectedProductData.jk_only;
			if (jkonly == 1 && jkok.indexOf(parts.styleNo) == -1) {
				return false;
			} else {
				return true;
			}
		},
		partsClicker: function (target) {

			if (target in this.$parent.selected.parts) {
				// Vue.delete(this.$parent.selected.parts,target);
			} else {
				this.$parent.partsChangers(target);
			}
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
	},
};
</script>