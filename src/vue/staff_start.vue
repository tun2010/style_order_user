<!-- <template lang="pug">
div.simulator__start_container
	div.simulator_order__media
		figure
			img(:src="targetImage" alt="Fabric Image")

	div.simulator_order__detail
		div.confirm_scroll_container(v-if="productDataLoad && masterDataLoad")

			div.title_container.margin_block_start
				span.size_title 過去選択仕様確認

			div.option_modal__group
				div.option_modal__header_group
					h4.header_title サイズ

				div.size_table_group(v-if="$parent.selected.sessions.ordersheet.jacket_dno")
					div.size_table_row
						div.table_header.table_header__start
							span ジャケット
							strong {{$parent.selected.sessions.ordersheet.jacket_size}} {{ $parent.selected.gender == "women" ? '号' : '' }}
						div.table_header 基準値
						div.table_header 補正値
						div.table_header 上がり値

					div.size_table_row(v-for="(item,key) in sizeAdjs" v-if="item.junle == 'jacket'")
						div.table_data.table_data__start {{item.name}}
						div.table_data {{$parent.selected.size[item.junle][key]}}cm
						div.table_data {{$parent.selected.sessions.ordersheet[key] - $parent.selected.size[item.junle][key] | round}}cm
						div.table_data {{$parent.selected.sessions.ordersheet[key]}}cm

				div.size_table_group(v-if="$parent.selected.sessions.ordersheet.best_dno")
					div.size_table_row
						div.table_header.table_header__start
							span ベスト
							strong {{$parent.selected.sessions.ordersheet.best_size}}
						div.table_header 基準値
						div.table_header 補正値
						div.table_header 上がり値

					div.size_table_row(v-for="(item,key) in sizeAdjs" v-if="item.junle == 'vest'")
						div.table_data.table_data__start {{item.name}}
						div.table_data {{$parent.selected.size[item.junle][key]}}cm
						div.table_data {{$parent.selected.sessions.ordersheet[key] - $parent.selected.size[item.junle][key] | round}}cm
						div.table_data {{$parent.selected.sessions.ordersheet[key]}}cm

				div.size_table_group(v-if="$parent.selected.sessions.ordersheet.slacks_dno1")
					div.size_table_row
						div.table_header.table_header__start
							span スラックス
							strong {{$parent.selected.sessions.ordersheet.slacks_size1}} {{ $parent.selected.gender == "women" ? '号' : '' }}
						div.table_header 基準値
						div.table_header 補正値
						div.table_header 上がり値

					div.size_table_row(v-for="(item,key) in sizeAdjs" v-if="item.junle == 'pants'")
						div.table_data.table_data__start {{item.name}}
						div.table_data {{$parent.selected.size[item.junle][key]}}cm
						div.table_data {{$parent.selected.sessions.ordersheet[key] - $parent.selected.size[item.junle][key] | round}}cm
						div.table_data {{$parent.selected.sessions.ordersheet[key]}}cm
					div.size_table_row(v-if="$parent.selected.sessions.ordersheet.crotch_main1 != '' && $parent.selected.sessions.ordersheet.crotch_main1 != null")
						div.table_data.table_data__start 股下(左)
						div.table_data -
						div.table_data -
						div.table_data  {{$parent.selected.sessions.ordersheet.crotch_main1}}cm
					div.size_table_row(v-if="$parent.selected.sessions.ordersheet.crotch_right1 != '' && $parent.selected.sessions.ordersheet.crotch_right1 != null")
						div.table_data.table_data__start 股下(右)
						div.table_data -
						div.table_data -
						div.table_data  {{$parent.selected.sessions.ordersheet.crotch_right1}}cm

				div.size_table_group(v-if="$parent.selected.sessions.ordersheet.slacks_dno2")
					div.size_table_row
						div.table_header.table_header__start
							span スラックス(２本目)
							strong {{$parent.selected.sessions.ordersheet.slacks_size2}} {{ $parent.selected.gender == "women" ? '号' : '' }}
						div.table_header 基準値
						div.table_header 補正値
						div.table_header 上がり値

					div.size_table_row(v-for="(item,key) in sizeAdjs" v-if="item.junle == 'pants2'")
						div.table_data.table_data__start {{item.name}}
						div.table_data {{$parent.selected.size[item.junle][key]}}cm
						div.table_data {{$parent.selected.sessions.ordersheet[key] - $parent.selected.size[item.junle][key] | round}}cm
						div.table_data {{$parent.selected.sessions.ordersheet[key]}}cm
					div.size_table_row(v-if="$parent.selected.sessions.ordersheet.crotch_main2 != '' && $parent.selected.sessions.ordersheet.crotch_main2 != null")
						div.table_data.table_data__start 股下(左)
						div.table_data -
						div.table_data -
						div.table_data  {{$parent.selected.sessions.ordersheet.crotch_main2}}cm
					div.size_table_row(v-if="$parent.selected.sessions.ordersheet.crotch_right2 != '' && $parent.selected.sessions.ordersheet.crotch_right2 != null")
						div.table_data.table_data__start 股下(右)
						div.table_data -
						div.table_data -
						div.table_data  {{$parent.selected.sessions.ordersheet.crotch_right2}}cm

				div.size_table_group(v-if="$parent.selected.sessions.ordersheet.wo_sk_d1 != null")
					div.size_table_row
						div.table_header.table_header__start
							span スカート
							strong {{$parent.selected.sessions.ordersheet.wo_sk_d1}} {{ $parent.selected.gender == "women" ? '号' : '' }}
						div.table_header 基準値
						div.table_header 補正値
						div.table_header 上がり値

					div.size_table_row(v-for="(item,key) in sizeAdjs" v-if="item.junle == 'skirt'")
						div.table_data.table_data__start {{item.name}}
						div.table_data {{$parent.selected.size[item.junle][key]}}cm
						div.table_data {{$parent.selected.sessions.ordersheet[key] - $parent.selected.size[item.junle][key] | round}}cm
						div.table_data {{$parent.selected.sessions.ordersheet[key]}}cm

				div.size_table_group(v-if="$parent.selected.sessions.ordersheet.wo_sk_d2 != null")
					div.size_table_row
						div.table_header.table_header__start
							span スカート(２本目)
							strong {{$parent.selected.sessions.ordersheet.wo_sk_d2}} {{ $parent.selected.gender == "women" ? '号' : '' }}
						div.table_header 基準値
						div.table_header 補正値
						div.table_header 上がり値

					div.size_table_row(v-for="(item,key) in sizeAdjs" v-if="item.junle == 'skirt2'")
						div.table_data.table_data__start {{item.name}}
						div.table_data {{$parent.selected.size[item.junle][key]}}cm
						div.table_data {{$parent.selected.sessions.ordersheet[key] - $parent.selected.size[item.junle][key] | round}}cm
						div.table_data {{$parent.selected.sessions.ordersheet[key]}}cm

			div.title_container.margin_block_start
				span.size_title 注文内容確認

			div.option_modal__group
				div.option_modal__header_group
					h4.header_title 生地
				div.label_value_group
					div.label_name 生地
					div.data_value {{$parent.firstCheckers.cloth_no}}
				div.label_value_group
					div.label_name 生地特性
					div.data_value {{kizitokusei}}

			div.option_modal__group
				div.option_modal__header_group
					h4.header_title コース
				div.label_value_group
					div.label_name コース
					div.data_value {{selected02}}

			div.option_modal__group
				div.option_modal__header_group
					h4.header_title デザイン

				div.label_value_group(v-if="$parent.selected.sessions.ordersheet.jacket_dno != null")
					div.label_name ジャケット
					div.data_value {{$parent.selected.sessions.ordersheet.jacket_dno}}
				div.label_value_group(v-if="$parent.selected.sessions.ordersheet.slacks_dno1 != null")
					div.label_name スラックス
					div.data_value {{$parent.selected.sessions.ordersheet.slacks_dno1}}
				div.label_value_group(v-if="$parent.selected.sessions.ordersheet.slacks_dno2 != null")
					div.label_name スラックス(２本目)
					div.data_value {{$parent.selected.sessions.ordersheet.slacks_dno2}}
				div.label_value_group(v-if="$parent.selected.sessions.ordersheet.best_dno != null")
					div.label_name ベスト
					div.data_value {{$parent.selected.sessions.ordersheet.best_dno}}
				div.label_value_group(v-if="$parent.selected.sessions.ordersheet.wo_sk_d1 != null")
					div.label_name スカート
					div.data_value {{$parent.selected.sessions.ordersheet.wo_sk_d1}}
				div.label_value_group(v-if="$parent.selected.sessions.ordersheet.wo_sk_d2 != null")
					div.label_name スカート(２枚目)
					div.data_value {{$parent.selected.sessions.ordersheet.wo_sk_d2}}


			div.title_container.margin_block_start
				span.size_title オプション内容確認

			div.option_modal__group(
				v-for="design in optionList",
				v-if='design.options.length'
				:key="design.id"
			)
				div.option_modal__header_group
					h4.header_title {{ design.name }}
				div.label_value_group(v-for="item in design.options" :key="item.disp_name")
					div.label_name {{item.disp_name}}
					div.data_value.data_value__center(v-if='item.input_type == "2"') {{item.selectedOption}}
					div.data_value.data_value__center(v-else) {{item.selectedOptionDetail.option_field}}

</template> -->

<template>
	<div class="simulator-start--container">
		<div class="simulator__product_view">
			<figure class="fabric-image">
				<img :src="targetImage" alt="Fabric">
			</figure>
		</div>
		<div class="confirm-container">
			<div class="confirm-scroll vertical-scroll">

				<div class="sticky-title">
					<h3>過去選択仕様確認</h3>
				</div>

				<div class="option-confirm-group">
					<h4>サイズ</h4>

					<div class="table-group-container">
						<div class="table-group" v-if="$parent.selected.sessions.ordersheet.jacket_dno">
							<div class="table-row table-row--header">
								<div class="header header--title">
									ジャケット
									<strong>{{$parent.selected.sessions.ordersheet.jacket_size}} {{ $parent.selected.gender == "women" ? '号' : '' }}</strong>
								</div>
								<div class="header">基準値</div>
								<div class="header">補正値</div>
								<div class="header">上がり値</div>
							</div>
							<template v-for="(item,key) in sizeAdjs">
								<div class="table-row" v-if="item.junle == 'jacket'" :key="key">
									<div class="value value--title clickable" @click="imageChanger(key, 'size')">{{item.name}}</div>
									<div class="value" data-title="基準値">{{$parent.selected.size[item.junle][key]}}cm</div>
									<div class="value" data-title="補正値">{{$parent.selected.sessions.ordersheet[key] - $parent.selected.size[item.junle][key] | round}}cm</div>
									<div class="value" data-title="上がり値">{{$parent.selected.sessions.ordersheet[key]}}cm</div>
								</div>
							</template>
						</div>

						<div class="table-group" v-if="$parent.selected.sessions.ordersheet.best_dno">
							<div class="table-row table-row--header">
								<div class="header header--title">
									ベスト
									<strong>{{$parent.selected.sessions.ordersheet.best_size}}</strong>
								</div>
								<div class="header">基準値</div>
								<div class="header">補正値</div>
								<div class="header">上がり値</div>
							</div>
							<template v-for="(item,key) in sizeAdjs">
								<div class="table-row" v-if="item.junle == 'vest'" :key="key">
									<div class="value value--title clickable" @click="imageChanger(key, 'size')">{{item.name}}</div>
									<div class="value" data-title="基準値">{{$parent.selected.size[item.junle][key]}}cm</div>
									<div class="value" data-title="補正値">{{$parent.selected.sessions.ordersheet[key] - $parent.selected.size[item.junle][key] | round}}cm</div>
									<div class="value" data-title="上がり値">{{$parent.selected.sessions.ordersheet[key]}}cm</div>
								</div>
							</template>
						</div>

						<div class="table-group" v-if="$parent.selected.sessions.ordersheet.slacks_dno1">
							<div class="table-row table-row--header">
								<div class="header header--title">
									スラックス
									<strong>{{$parent.selected.sessions.ordersheet.slacks_size1}} {{ $parent.selected.gender == "women" ? '号' : '' }}</strong>
								</div>
								<div class="header">基準値</div>
								<div class="header">補正値</div>
								<div class="header">上がり値</div>
							</div>
							<template v-for="(item,key) in sizeAdjs">
								<div class="table-row" v-if="item.junle == 'pants'" :key="key">
									<div class="value value--title clickable" @click="imageChanger(key, 'size')">{{item.name}}</div>
									<div class="value" data-title="基準値">{{$parent.selected.size[item.junle][key]}}cm</div>
									<div class="value" data-title="補正値">{{$parent.selected.sessions.ordersheet[key] - $parent.selected.size[item.junle][key] | round}}cm</div>
									<div class="value" data-title="上がり値">{{$parent.selected.sessions.ordersheet[key]}}cm</div>
								</div>
							</template>
							<div class="table-row" v-if="$parent.selected.sessions.ordersheet.crotch_main1 != '' && $parent.selected.sessions.ordersheet.crotch_main1 != null">
								<div class="value value--title clickable" @click="imageChanger('crotch_main', 'size')">股下(左)</div>
								<div class="value" data-title="基準値">-</div>
								<div class="value" data-title="補正値">-</div>
								<div class="value" data-title="上がり値">{{$parent.selected.sessions.ordersheet.crotch_main1}}cm</div>
							</div>
							<div class="table-row" v-if="$parent.selected.sessions.ordersheet.crotch_right1 != '' && $parent.selected.sessions.ordersheet.crotch_right1 != null">
								<div class="value value--title clickable" @click="imageChanger('crotch_right', 'size')">股下(右)</div>
								<div class="value" data-title="基準値">-</div>
								<div class="value" data-title="補正値">-</div>
								<div class="value" data-title="上がり値">{{$parent.selected.sessions.ordersheet.crotch_right1}}cm</div>
							</div>
						</div>

						<div class="table-group" v-if="$parent.selected.sessions.ordersheet.slacks_dno2">
							<div class="table-row table-row--header">
								<div class="header header--title">
									スラックス(２本目)
									<strong>{{$parent.selected.sessions.ordersheet.slacks_size2}} {{ $parent.selected.gender == "women" ? '号' : '' }}</strong>
								</div>
								<div class="header">基準値</div>
								<div class="header">補正値</div>
								<div class="header">上がり値</div>
							</div>
							<template v-for="(item,key) in sizeAdjs">
								<div class="table-row" v-if="item.junle == 'pants2'" :key="key">
									<div class="value value--title clickable" @click="imageChanger(key, 'size')">{{item.name}}</div>
									<div class="value" data-title="基準値">{{$parent.selected.size[item.junle][key]}}cm</div>
									<div class="value" data-title="補正値">{{$parent.selected.sessions.ordersheet[key] - $parent.selected.size[item.junle][key] | round}}cm</div>
									<div class="value" data-title="上がり値">{{$parent.selected.sessions.ordersheet[key]}}cm</div>
								</div>
							</template>
							<div class="table-row" v-if="$parent.selected.sessions.ordersheet.crotch_main2 != '' && $parent.selected.sessions.ordersheet.crotch_main2 != null">
								<div class="value value--title clickable" @click="imageChanger('crotch_main', 'size')">股下(左)</div>
								<div class="value" data-title="基準値">-</div>
								<div class="value" data-title="補正値">-</div>
								<div class="value" data-title="上がり値">{{$parent.selected.sessions.ordersheet.crotch_main2}}cm</div>
							</div>
							<div class="table-row" v-if="$parent.selected.sessions.ordersheet.crotch_right2 != '' && $parent.selected.sessions.ordersheet.crotch_right2 != null">
								<div class="value value--title clickable" @click="imageChanger('crotch_right', 'size')">股下(右)</div>
								<div class="value" data-title="基準値">-</div>
								<div class="value" data-title="補正値">-</div>
								<div class="value" data-title="上がり値">{{$parent.selected.sessions.ordersheet.crotch_right2}}cm</div>
							</div>
						</div>

						<div class="table-group" v-if="$parent.selected.sessions.ordersheet.wo_sk_d1">
							<div class="table-row table-row--header">
								<div class="header header--title">
									スカート
									<strong>{{$parent.selected.sessions.ordersheet.wo_sk_d1}} {{ $parent.selected.gender == "women" ? '号' : '' }}</strong>
								</div>
								<div class="header">基準値</div>
								<div class="header">補正値</div>
								<div class="header">上がり値</div>
							</div>
							<template v-for="(item,key) in sizeAdjs">
								<div class="table-row" v-if="item.junle == 'skirt'" :key="key">
									<div class="value value--title clickable" @click="imageChanger(key, 'size')">{{item.name}}</div>
									<div class="value" data-title="基準値">{{$parent.selected.size[item.junle][key]}}cm</div>
									<div class="value" data-title="補正値">{{$parent.selected.sessions.ordersheet[key] - $parent.selected.size[item.junle][key] | round}}cm</div>
									<div class="value" data-title="上がり値">{{$parent.selected.sessions.ordersheet[key]}}cm</div>
								</div>
							</template>
						</div>

						<div class="table-group" v-if="$parent.selected.sessions.ordersheet.wo_sk_d2">
							<div class="table-row table-row--header">
								<div class="header header--title">
									スカート(２本目)
									<strong>{{$parent.selected.sessions.ordersheet.wo_sk_d2}} {{ $parent.selected.gender == "women" ? '号' : '' }}</strong>
								</div>
								<div class="header">基準値</div>
								<div class="header">補正値</div>
								<div class="header">上がり値</div>
							</div>
							<template v-for="(item,key) in sizeAdjs">
								<div class="table-row" v-if="item.junle == 'skirt2'" :key="key">
									<div class="value value--title clickable" @click="imageChanger(key, 'size')">{{item.name}}</div>
									<div class="value" data-title="基準値">{{$parent.selected.size[item.junle][key]}}cm</div>
									<div class="value" data-title="補正値">{{$parent.selected.sessions.ordersheet[key] - $parent.selected.size[item.junle][key] | round}}cm</div>
									<div class="value" data-title="上がり値">{{$parent.selected.sessions.ordersheet[key]}}cm</div>
								</div>
							</template>
						</div>
					</div>

					<div class="action-container"></div>
				</div>

				<div class="sticky-title">
					<h3>注文内容確認</h3>
				</div>

				<div class="option-confirm-group">
					<h4>生地</h4>
					<div class="label-group">
						<div class="label-row">
							<div class="label clickable" @click="imageChanger('cloth_no', 'cloth_no')">生地</div>
							<div class="value">{{$parent.firstCheckers.cloth_no}}</div>
						</div>
						<div class="label-row">
							<div class="label">生地特性</div>
							<div class="value">{{kizitokusei}}</div>
						</div>
					</div>
					<div class="action-container"></div>
				</div>

				<div class="option-confirm-group">
					<h4>コース</h4>
					<div class="label-group">
						<div class="label-row">
							<div class="label">コース</div>
							<div class="value">{{selected02}}</div>
						</div>
					</div>
					<div class="action-container"></div>
				</div>

				<div class="option-confirm-group" v-if="!this.$parent.katagamiNaiUser">
					<h4>デザイン</h4>
					<div class="label-group">
						<div class="label-row" v-if="$parent.selected.sessions.ordersheet.jacket_dno">
							<div class="label">ジャケット</div>
							<div class="value">{{$parent.selected.sessions.ordersheet.jacket_dno}}</div>
						</div>
						<div class="label-row" v-if="$parent.selected.sessions.ordersheet.slacks_dno1">
							<div class="label">スラックス</div>
							<div class="value">{{$parent.selected.sessions.ordersheet.slacks_dno1}}</div>
						</div>
						<div class="label-row" v-if="$parent.selected.sessions.ordersheet.slacks_dno2">
							<div class="label">スラックス(２本目)</div>
							<div class="value">{{$parent.selected.sessions.ordersheet.slacks_dno2}}</div>
						</div>
						<div class="label-row" v-if="$parent.selected.sessions.ordersheet.best_dno">
							<div class="label">ベスト</div>
							<div class="value">{{$parent.selected.sessions.ordersheet.best_dno}}</div>
						</div>
						<div class="label-row" v-if="$parent.selected.sessions.ordersheet.wo_sk_d1">
							<div class="label">スカート</div>
							<div class="value">{{$parent.selected.sessions.ordersheet.wo_sk_d1}}</div>
						</div>
						<div class="label-row" v-if="$parent.selected.sessions.ordersheet.wo_sk_d2">
							<div class="label">スカート(２枚目)</div>
							<div class="value">{{$parent.selected.sessions.ordersheet.wo_sk_d2}}</div>
						</div>
					</div>
					<div class="action-container"></div>
				</div>

				<div class="sticky-title">
					<h3>オプション内容確認</h3>
				</div>

				<template v-for="design in optionList">
					<div class="option-confirm-group" v-if="design.options.length" :key="design.id">
						<h4>{{ design.name }}</h4>
						<div class="label-group">
							<div class="label-row" v-for="item in design.options" :key="item.disp_name">
								<div class="label" :class="{clickable: !notuseChecker(item.api_field)}" @click="imageChanger(item.api_field, 'option')">{{item.disp_name}}</div>
								<div class="value" v-if="item.input_type == '2'">{{item.selectedOption}}</div>
								<div class="value" v-else>{{item.selectedOptionDetail.option_field}}</div>
							</div>
						</div>
						<div class="action-container"></div>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
// コンポーネントのtemplateは、一つのタグですべて囲われていなければならん。注意。
//アロー関数では値が取れなくなる場合がある。　hoge:function(){}としろ。
module.exports = {
	data: function () {
    return {
		selected: this.$parent.selected.sessions.ordersheet,
		selectedFabricer: this.$parent.productData[this.$parent.selected.fabric],
		productDataLoad: this.$parent.productDataLoad,
		masterDataLoad: this.$parent.masterDataLoad,
		sizeAdjs: this.$parent.size.adj,
		gender:this.$parent.selected.gender,
		targetImage:'/user_data/packages/admin/img/header/logo.jpg',
		selectedInfo: '',
		switcher:'size',
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
				},
				options: [],
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
				},
				options: [],
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
				},
				options: [],
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
				},
				options: [],
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
				},
				options: [],
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
				},
				options: [],
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
				},
				options: [],
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
				},
				options: [],
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
				},
				options: [],
			},
		],
		optionList: []
    }
	},
	watch:{
		'$parent.productDataLoad':function(v,ov){
				this.productDataLoad = v;
		},
		'$parent.masterDataLoad':function(v,ov){
				this.masterDataLoad = v;
		},
		'$parent.selected.selectedOptions': function(v) {
			this.updateDesignList(v);
		},
		'$parent.optionData.mazemaze': function (v) {
			if (v) {
				this.updateDesignList(this.$parent.selected.selectedOptions);
			}
		}
	},
	computed:{
		courseNos: function () {
			var course = this.$parent.selected.code.course;
			var courses = [];
			if (course.indexOf(",") > -1) {
				courses = course.split(",");
			} else {
				courses[0] = course;
			}
			return courses;
		},

		selectedProduct:function(){
			var target = '';
			var thista = this;
			$.each(this.$parent.productData,function(key,item){
				if(item.product_code_min == thista.$parent.firstCheckers.cloth_no){
					// console.log(item);
					target = item;
					return false;
				}
			})
			return target;
		},
		selectedOption:function(){

			// var list = _.orderBy(this.$parent.selected.selectedOptions, 'option_rank');
			var list = _.sortBy(this.$parent.selected.selectedOptions,[function(o) { return ("0" + o.option_rank).slice(-2) * -1; }]);
			// // console.log('並べ替えたオプションリスト');
			// // console.log(list);
			// $.each(list,function(key,item){
			// 	// console.log(item.disp_name);
			// });
			// list = _.reverse(list);
			return list;
		},
		shiwake:function(){
			return this.$parent.optionsShiwakeOptiondake;
		},
		ordersheet:function(){
			return this.$parent.selected.sessions.ordersheet;
		},
		kizitokusei:function(){
			if(this.$parent.selected.sessions.ordersheet.washable == 1){
				return "ウォッシャブル";
			}else if(this.$parent.selected.sessions.ordersheet.pleats_sta == 1){
				return "プリーツ安定";
			}else{
				return "標準";
			}
		},
		axiosChecker:function(){

		},
		totalPrice:function(){
			return this.$parent.totalPriceCalc;
		},
		masters:function(){
			return this.$parent.masters.maker;
		},
		mastersLine:function(){
			return this.$parent.masters.line;
		},
		selectedFabric:function(){
			return this.$parent.selected.fabric;
		},
		productData:function(){
			return this.$parent.productData;
		},
		lineChecker:function(){
			return this.$parent.lineChecker;
		},
		selected02:function(){
			var result = "";
			$.each(this.$parent.selected.parts,function(key,item){
				result =  item.ja;
			})
			return result;
		},
		selectedPartsData:function(){
			var result = "";
			$.each(this.$parent.selected.parts,function(key,item){
				result =  item;
			})
			return result;
		},
	},

	methods:{
		updateDesignList(optionList) {
			const courseNo = this.$parent.selected.code.course
			const designs = [];
			const list = _.orderBy(optionList, 'rank', 'desc')

			// const selected = [];
			Object.values(this.designList).forEach(design => {
				if (design.gender == this.$parent.selected.gender && design.is(design.gender == 'men' ? courseNo : this.courseNos)) {
					design.options = list.filter(option => {
						if (
							(option.selectedOptionDetail != null || option.input_type == "2")
							&& this.optionHiddenChecker(option)
							&& option.disp_name != "チェンジポケット"
							&& this.hiddenChecker(option, design.categoryId)
							&& this.checkDoubleStyle(option, design.categoryId, design.sub)
							&& this.checkAitFit(option)
							// && !selected.includes(option.target_api_field)
						) {
							// selected.push(option.target_api_field);
							return true;
						}
						return false;
					});
					designs.push(design);
				}
			});

			// // console.log('SELECTED_OPTIONS', JSON.parse(JSON.stringify(this.$parent.selected.selectedOptions)));
			// // console.log('DESIGNS', JSON.parse(JSON.stringify(designs)));
			this.optionList = designs;
		},
		checkAitFit(option) {
			// console.log('mazemaze', JSON.parse(JSON.stringify(this.$parent.optionData?.mazemaze || {})));
			if (this.$parent.optionData?.mazemaze && ["43", "69"].includes(option.option_id)) {
				const mOption = this.$parent.optionData.mazemaze[option.option_id];
				if (!mOption) return false;
				return mOption.option_shiwake == "katagami";
			}
			return true;
		},
		optionHiddenChecker: function (items) {
			//工場チェック
			var thista = this;
			var checker = true;
			var optionData = this.$parent.optionData;
			if ('mazemaze' in optionData && 'option_id' in items) {
				if (items.option_id in optionData.mazemaze || items.api_field == 'digital_name' || items.api_field == 'enter_name') {

				} else {
					checker = false;
					// // console.log('工場だめ：' + items.option_id);
				}
			}
			return checker;
		},
		hiddenChecker(target, category) {
			let targetCate = category;
			if (category == 3) {
				targetCate = 4;
			} else if (category == 4) {
				targetCate = 3;
			}
			if (!target.option_item.includes(String(targetCate))) {
				return false;
			}
			return true;
		},
		checkDoubleStyle(option, category, sub) {
			const endsWithOneOrTwo = (str) => {
				return str.endsWith('1') || str.endsWith('2');
			}
			if ([ 4, 6, 7].includes(category) && endsWithOneOrTwo(option.target_api_field)) {
				const endNum = sub ? '2' : '1';
				return option.api_field.concat(endNum) == option.target_api_field;
			}
			return true;
		},
		kobetsuOption:function(target_api_field){
			var result = '';
			var thista = this;

			$.each(this.selectedOption,function(key,item){
				if(target_api_field == item.target_api_field){
					result = item;
					return false;
				}
			});

			return result;
		},
		selectedStyle:function(target){
			var courses = this.$parent.selected.course;
			if(target == 'jacket'){
				if(this.gender == 'men'){
					var result ='';
					$.each(courses["1"],function(key,item){
						result = item.style_option;
					});
					if(result in this.$parent.masters.style){
					return this.$parent.masters.style[result].name;
					}
				}else{

					var result ='';
					$.each(courses["5"],function(key,item){
						result = item.style_option;
					});
					if(result in this.$parent.masters.style){
					return this.$parent.masters.style[result].name;
					}
				}
			}else if(target == 'pants'){
				// // console.log('courses');
				// // console.log(courses);
				if(this.gender == 'men'){
					var result ='';
					$.each(courses["3"],function(key,item){
						result = item.style_option;
					});
					if(result in this.$parent.masters.style){
					return this.$parent.masters.style[result].name;
					}
				}else{

					var result ='';
					$.each(courses["6"],function(key,item){
						result = item.style_option;
					});
					if(result in this.$parent.masters.style){
					return this.$parent.masters.style[result].name;
					}
				}
			}else if(target == 'vest'){
					var result ='';
					$.each(courses["2"],function(key,item){
						result = item.style_option;
					});
					if(result in this.$parent.masters.style){
					return this.$parent.masters.style[result].name;
					}

			}
			else if(target == 'skirt'){
					var result ='';
					$.each(courses["7"],function(key,item){
						result = item.style_option;
					});
					if(result in this.$parent.masters.style){
					return this.$parent.masters.style[result].name;
					}

			}
		},
		notDisplayChecker:function(target){
			var notuseList = [
				'change_pocket',
				'mackin_width',
			];
			if(notuseList.indexOf(target.api_field) > -1){
				return false;
			}else{
				return true;
			}
		},
		notuseChecker:function(target){
			var notuseList = [
				'safeguard_s',
				'safeguard_p',
				'kuchi_width_',
				'take',
				'safeguard_s1',
				'safeguard_p1',
				'kuchi_width_1',
				'take1',
				'safeguard_s2',
				'safeguard_p2',
				'kuchi_width_2',
				'take2',
				'enter_name',
				'digital_name',
				'style_name',

			];
			if(notuseList.indexOf(target) > -1){
				return true;
			}else{
				return false;
			}

		},
		spSwitcher:function(target){
			this.imageChanger('cloth_no','');
			Vue.set(this,'switcher',target);

		},
		imageChanger:function(target,type){
			if(target == "cloth_no"){
				if(this.selectedProduct.main_image != null && this.selectedProduct.main_image != ''){
					Vue.set(this,'targetImage',this.$parent.uploadPass+this.selectedProduct.main_image);
				}else{
					Vue.set(this,'targetImage','/images/noimage.png');

				}
				Vue.set(this,'selectedInfo',"cloth_no");
			}else{
			var notuse = this.notuseChecker(target);
			if(notuse == false){
			$(window).scrollTop(0);
			var genders = '';
			Vue.set(this,'selectedInfo',target);
			if(this.gender == 'women'){
				genders = '_women';
			}
			var last = target.substr(-1, 1);
			if(last == '1' || last == '2'){
				target = target.slice(0,-1);
			}
			Vue.set(this,'targetImage','/images/simulator/info_image/'+type+'/'+target+genders+'.png');
			}
			}
		},
		typeChecker(item,type){
			// // console.log(type);
			if(this.shiwake[type].indexOf(item.target_api_field) > -1){
				return true;
			}
			var q = this.selectedPartsData.styleNo;
			if(((item.target_api_field == 'button_cno' || item.target_api_field == 'ext_specification') && (q==3 || q==2 || q==12 || q==13 || q==8)) || ((item.target_api_field == 'ura_cno' || item.target_api_field == 'colorcustoms_ura_cno_normal') && (q==2))){
				return true;
			}
		},
		stepChanger:function(target){
			Vue.set(this.$parent,"step",target);
			// this.$parent.step = target;
		},

	},
	mounted:function(){
		// // console.log('sessiondata', this.selectedFabricer);
		// // console.log(this.$parent.selected.sessions.ordersheet);
		// // console.log(this.sizeAdjs);
		// // console.log(this.$parent.selected.course);
		this.$parent.getSelectedOption();
		var thista = this;

		this.$parent.getJan();
		if(this.$parent.tantouFlg){
		}
		var thista = this;
		// setTimeout(function(){
		Vue.set(thista.$parent,'view',thista.$parent.checkSkPt);
		// },400);
		if(this.$parent.productDataLoad){
			this.productDataLoad = true;

		}
		if(this.$parent.productDataLoad){
			this.masterDataLoad = true;
		}
		if(this.selectedProduct.main_image != null && this.selectedProduct.main_image != ''){
		Vue.set(this,'targetImage',this.$parent.uploadPass+this.selectedProduct.main_image);
		}else{
			Vue.set(this,'targetImage','/images/noimage.png');
		}
		Vue.set(this,'selectedInfo',"cloth_no");
		//// console.log("現在のselected");
		//// console.log(this.$parent.selected);
		//// console.log("sizeadj");
		//// console.log(this.$parent.size.adj);

		// this.updateDesignList(this.$parent.selected.selectedOptions);
	},
	beforeDestroy:function(){
		var thista = this;
		Vue.set(thista.$parent,'view','');
	}
};
</script>