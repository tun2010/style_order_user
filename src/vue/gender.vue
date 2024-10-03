<template>
	<div class="gender-container">
		<h2 class="gender-title">Style Order Suit</h2>
		<p class="gender-message">
			シミュレーターから、<br>
			お好みのスーツをお選びください。
		</p>
		<ul class="gender-list">
			<li class="gender">
				<button class="gender-card" @click="genderChanger('men',1)">
					<img src="/user_data/packages/default/img/style_order_icons/men.png" alt="Men">
					<div class="button men">MEN's</div>
				</button>
			</li>
			<li class="gender">
				<button class="gender-card" @click="genderChanger('women',2)">
					<img src="/user_data/packages/default/img/style_order_icons/lady.png" alt="Men">
					<div class="button women">LADIES'</div>
				</button>
			</li>
		</ul>
	</div>
</template>

<script>
module.exports = {
	data: function () {
		return {}
	},
	mounted: function () {
		// console.log("MOUNTED");
	},
	computed: {
		selectedGender: function () {
			return this.$parent.selected.gender;
		},
	},
	methods: {
		genderChanger: function (gender, master_no) {
			if (this.$parent.selected.gender == gender) {
				Vue.set(this.$parent, 'step', 1);
			} else {
				this.$parent.syokika('genderfirst');
				Vue.set(this.$parent, 'firstCheckers', { ResetedFlg: false, jacket_dno: '', cloth_no: '', cloth_image: '', gb: false, washable: false, daiba: false, w_adjuster: false, factory: null, katafactory: "", allReseter: false, waistReseterFlg: false, daibaReseter: false });
				Vue.set(this.$parent.selected, "gender", gender);
				Vue.set(this.$parent.selected.sessions.ordersheet, "sex", master_no);
				//// console.log("パラメータリセット");
				Vue.set(this.$parent.selected, "parts", {});
				Vue.set(this.$parent.selected.code, "course", "");
				Vue.set(this.$parent.selected.sessions.ordersheet, "course_no", "");
				Vue.set(this.$parent.selected.sessions.ordersheet, "cloth_no", "");
				Vue.set(this.$parent, "selectedProductData", { kiji_image: "", delivery: null });
				Vue.set(this.$parent.selected, "fabric", "");

				var thista = this;
				setTimeout(function () {
					if (thista.$parent.selected.gender == 'women') {
						Vue.set(thista.$parent, 'view', '_skirt');
					}
					thista.$parent.texChanger();
					Vue.set(thista.$parent, 'step', 1);
				}, 500);
			}
		},
	},
};
</script>