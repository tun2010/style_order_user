<!-- <template lang="pug">
	div.simulator__option_modal.simulator__modal
		div.simulator__modal__back(v-on:click="modalCloser")
		div.simulator__modal__wrap
			div.modal_close_container
				p.modal_closer(v-on:click="modalCloser")
			div.confirm_scroll_container
				div.title_container
					span.size_title 注文内容確認

				div.option_modal__group
					div.option_modal__header_group
						h4.header_title 生地
						button.buttons.buttons-small.icon-end(v-on:click="stepChanger(1)") 変更する
					div.label_value_group
						div.label_name 生地
						div.data_value(v-if="selectedFabricer") {{selectedFabricer.product_code_min}} / {{selectedFabricer.name}}
						div.data_value(v-else)
					div.label_value_group
						div.label_name 生地特性
						div.data_value {{kizitokusei}}

				div.option_modal__group
					div.option_modal__header_group
						h4.header_title コース
						button.buttons.buttons-small.icon-end(v-on:click="stepChanger(2)") 変更する
					div.label_value_group
						div.label_name コース
						div.data_value {{selected02}}

				div.option_modal__group(v-if='$parent.katagamiNaiUser == false')
					div.option_modal__header_group
						h4.header_title デザイン
						button.buttons.buttons-small.icon-end(v-on:click="stepChanger(3)") 変更する
					div.label_value_group(v-if="$parent.selected.sessions.ordersheet.jacket_dno != null && $parent.selected.sessions.ordersheet.jacket_dno != '' && selectparts.indexOf('jacket') > -1")
						div.label_name ジャケット
						div.data_value {{$parent.selected.sessions.ordersheet.jacket_dno}}
					div.label_value_group(v-if="$parent.selected.sessions.ordersheet.slacks_dno1 != null && $parent.selected.sessions.ordersheet.slacks_dno1 != '' && selectparts.indexOf('pants') > -1")
						div.label_name スラックス
						div.data_value {{$parent.selected.sessions.ordersheet.slacks_dno1}}
					div.label_value_group(v-if="$parent.selected.sessions.ordersheet.slacks_dno2 != null && $parent.selected.sessions.ordersheet.slacks_dno2 != '' && selectparts.indexOf('pants2') > -1")
						div.label_name スラックス(２本目)
						div.data_value {{$parent.selected.sessions.ordersheet.slacks_dno2}}
					div.label_value_group(v-if="$parent.selected.sessions.ordersheet.best_dno != null && $parent.selected.sessions.ordersheet.best_dno != '' && selectparts.indexOf('vest') > -1")
						div.label_name ベスト
						div.data_value {{$parent.selected.sessions.ordersheet.best_dno}}
					div.label_value_group(v-if="$parent.selected.sessions.ordersheet.wo_sk_d1 != null && $parent.selected.sessions.ordersheet.wo_sk_d1 != '' && selectparts.indexOf('skirt') > -1")
						div.label_name スカート
						div.data_value {{$parent.selected.sessions.ordersheet.wo_sk_d1}}
					div.label_value_group(v-if="$parent.selected.sessions.ordersheet.wo_sk_d2 != null && $parent.selected.sessions.ordersheet.wo_sk_d2 != '' && selectparts.indexOf('skirt2') > -1")
						div.label_name スカート(２枚目)
						div.data_value {{$parent.selected.sessions.ordersheet.wo_sk_d2}}

				div.option_modal__group(v-if='$parent.step > 4')
					div.option_modal__header_group
						h4.header_title サイズ
						button.buttons.buttons-small.icon-end(v-on:click="stepChanger(4)") 変更する

					div.size_table_group(v-if="$parent.selected.sessions.ordersheet.jacket_dno != null && $parent.selected.sessions.ordersheet.jacket_dno != '' && selectparts.indexOf('jacket') > -1")
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

					div.size_table_group(v-if="$parent.selected.sessions.ordersheet.best_dno != null && $parent.selected.sessions.ordersheet.best_dno != '' && selectparts.indexOf('vest') > -1")
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

					div.size_table_group(v-if="$parent.selected.sessions.ordersheet.slacks_dno1 != null && $parent.selected.sessions.ordersheet.slacks_dno1 != '' && selectparts.indexOf('pants') > -1")
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

					div.size_table_group(v-if="$parent.selected.sessions.ordersheet.slacks_dno2 != null && $parent.selected.sessions.ordersheet.slacks_dno2 != '' && selectparts.indexOf('pants2') > -1")
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

					div.size_table_group(v-if="$parent.selected.sessions.ordersheet.wo_sk_d1 != null && $parent.selected.sessions.ordersheet.wo_sk_d1 != '' && selectparts.indexOf('skirt') > -1")
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

					div.size_table_group(v-if="$parent.selected.sessions.ordersheet.wo_sk_d2 != null && $parent.selected.sessions.ordersheet.wo_sk_d2 != '' && selectparts.indexOf('skirt2') > -1")
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

				div.title_container.margin_block_start(v-if='$parent.step >= 5')
					span.size_title オプション内容確認

				div.option_modal__group(
					v-for="design in optionList",
					v-if='$parent.step >= 5'
					:key="design.id"
				)
					div.option_modal__header_group
						h4.header_title {{ design.name }}
						button.buttons.buttons-small.icon-end(v-on:click="stepChanger(5)") 変更する
					div.label_value_group(v-for="item in design.options")
						div.label_name {{item.disp_name}}
						div.data_value.data_value__center(v-if='item.input_type == "2"') {{item.selectedOption}}
						div.data_value.data_value__center(v-else) {{item.selectedOptionDetail.option_field}}

				div.flex_center(v-if='$parent.step >= 5')
					div.footer_delivery_date
						span 納期 :
						time  {{ $parent.deliveryDate }}

</template> -->

<template>
	<div class="simulator-modal">
		<div class="simulator-modal__container" @click.self="modalCloser">
			<div class="simulator-modal__card">
				<header class="simulator-modal__header">
					<button class="modal-close" @click="modalCloser"></button>
				</header>
				<div class="simulator-modal__body">

					<div class="sticky-title">
						<h3>注文内容確認</h3>
					</div>

					<div class="option-confirm-group">
						<h4>生地</h4>
						<div class="label-group">
							<div class="label-row">
								<div class="label">生地</div>
								<div class="value" v-if="selectedFabricer">{{selectedFabricer.product_code_min}} / {{selectedFabricer.name}}</div>
								<div class="value" v-else></div>
							</div>
							<div class="label-row">
								<div class="label">生地特性</div>
								<div class="value">{{kizitokusei}}</div>
							</div>
						</div>
						<div class="action-container">
							<button class="style-button step-change" @click="stepChanger(1)">
								変更する
							</button>
						</div>
					</div>

					<div class="option-confirm-group">
						<h4>コース</h4>
						<div class="label-group">
							<div class="label-row">
								<div class="label">コース</div>
								<div class="value">{{selected02}}</div>
							</div>
						</div>
						<div class="action-container">
							<button class="style-button step-change" @click="stepChanger(2)">
								変更する
							</button>
						</div>
					</div>

					<div class="option-confirm-group" v-if="!this.$parent.katagamiNaiUser">
						<h4>デザイン</h4>
						<div class="label-group">
							<div class="label-row" v-if="$parent.selected.sessions.ordersheet.jacket_dno != null && $parent.selected.sessions.ordersheet.jacket_dno != '' && selectparts.indexOf('jacket') > -1">
								<div class="label">ジャケット</div>
								<div class="value">{{$parent.selected.sessions.ordersheet.jacket_dno}}</div>
							</div>
							<div class="label-row" v-if="$parent.selected.sessions.ordersheet.slacks_dno1 != null && $parent.selected.sessions.ordersheet.slacks_dno1 != '' && selectparts.indexOf('pants') > -1">
								<div class="label">スラックス</div>
								<div class="value">{{$parent.selected.sessions.ordersheet.slacks_dno1}}</div>
							</div>
							<div class="label-row" v-if="$parent.selected.sessions.ordersheet.slacks_dno2 != null && $parent.selected.sessions.ordersheet.slacks_dno2 != '' && selectparts.indexOf('pants2') > -1">
								<div class="label">スラックス(２本目)</div>
								<div class="value">{{$parent.selected.sessions.ordersheet.slacks_dno2}}</div>
							</div>
							<div class="label-row" v-if="$parent.selected.sessions.ordersheet.best_dno != null && $parent.selected.sessions.ordersheet.best_dno != '' && selectparts.indexOf('vest') > -1">
								<div class="label">ベスト</div>
								<div class="value">{{$parent.selected.sessions.ordersheet.best_dno}}</div>
							</div>
							<div class="label-row" v-if="$parent.selected.sessions.ordersheet.wo_sk_d1 != null && $parent.selected.sessions.ordersheet.wo_sk_d1 != '' && selectparts.indexOf('skirt') > -1">
								<div class="label">スカート</div>
								<div class="value">{{$parent.selected.sessions.ordersheet.wo_sk_d1}}</div>
							</div>
							<div class="label-row" v-if="$parent.selected.sessions.ordersheet.wo_sk_d2 != null && $parent.selected.sessions.ordersheet.wo_sk_d2 != '' && selectparts.indexOf('skirt2') > -1">
								<div class="label">スカート(２枚目)</div>
								<div class="value">{{$parent.selected.sessions.ordersheet.wo_sk_d2}}</div>
							</div>
						</div>
						<div class="action-container">
							<!-- <button class="style-button step-change" @click="stepChanger(3)">
								変更する
							</button> -->
						</div>
					</div>

					<div class="option-confirm-group" v-if='!this.$parent.katagamiNaiUser'>
						<h4>サイズ</h4>

						<div class="table-group-container">
							<div class="table-group" v-if="$parent.selected.sessions.ordersheet.jacket_dno != null && $parent.selected.sessions.ordersheet.jacket_dno != '' && selectparts.indexOf('jacket') > -1">
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
										<div class="value value--title">{{item.name}}</div>
										<div class="value" data-title="基準値">{{$parent.selected.size[item.junle][key]}}cm</div>
										<div class="value" data-title="補正値">{{$parent.selected.sessions.ordersheet[key] - $parent.selected.size[item.junle][key] | round}}cm</div>
										<div class="value" data-title="上がり値">{{$parent.selected.sessions.ordersheet[key]}}cm</div>
									</div>
								</template>
							</div>

							<div class="table-group" v-if="$parent.selected.sessions.ordersheet.best_dno != null && $parent.selected.sessions.ordersheet.best_dno != '' && selectparts.indexOf('vest') > -1">
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
										<div class="value value--title">{{item.name}}</div>
										<div class="value" data-title="基準値">{{$parent.selected.size[item.junle][key]}}cm</div>
										<div class="value" data-title="補正値">{{$parent.selected.sessions.ordersheet[key] - $parent.selected.size[item.junle][key] | round}}cm</div>
										<div class="value" data-title="上がり値">{{$parent.selected.sessions.ordersheet[key]}}cm</div>
									</div>
								</template>
							</div>

							<div class="table-group" v-if="$parent.selected.sessions.ordersheet.slacks_dno1 != null && $parent.selected.sessions.ordersheet.slacks_dno1 != '' && selectparts.indexOf('pants') > -1">
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
										<div class="value value--title">{{item.name}}</div>
										<div class="value" data-title="基準値">{{$parent.selected.size[item.junle][key]}}cm</div>
										<div class="value" data-title="補正値">{{$parent.selected.sessions.ordersheet[key] - $parent.selected.size[item.junle][key] | round}}cm</div>
										<div class="value" data-title="上がり値">{{$parent.selected.sessions.ordersheet[key]}}cm</div>
									</div>
								</template>
								<div class="table-row" v-if="$parent.selected.sessions.ordersheet.crotch_main1 != '' && $parent.selected.sessions.ordersheet.crotch_main1 != null">
									<div class="value value--title">股下(左)</div>
									<div class="value" data-title="基準値">-</div>
									<div class="value" data-title="補正値">-</div>
									<div class="value" data-title="上がり値">{{$parent.selected.sessions.ordersheet.crotch_main1}}cm</div>
								</div>
								<div class="table-row" v-if="$parent.selected.sessions.ordersheet.crotch_right1 != '' && $parent.selected.sessions.ordersheet.crotch_right1 != null">
									<div class="value value--title">股下(右)</div>
									<div class="value" data-title="基準値">-</div>
									<div class="value" data-title="補正値">-</div>
									<div class="value" data-title="上がり値">{{$parent.selected.sessions.ordersheet.crotch_right1}}cm</div>
								</div>
							</div>

							<div class="table-group" v-if="$parent.selected.sessions.ordersheet.slacks_dno2 != null && $parent.selected.sessions.ordersheet.slacks_dno2 != '' && selectparts.indexOf('pants2') > -1">
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
										<div class="value value--title">{{item.name}}</div>
										<div class="value" data-title="基準値">{{$parent.selected.size[item.junle][key]}}cm</div>
										<div class="value" data-title="補正値">{{$parent.selected.sessions.ordersheet[key] - $parent.selected.size[item.junle][key] | round}}cm</div>
										<div class="value" data-title="上がり値">{{$parent.selected.sessions.ordersheet[key]}}cm</div>
									</div>
								</template>
								<div class="table-row" v-if="$parent.selected.sessions.ordersheet.crotch_main2 != '' && $parent.selected.sessions.ordersheet.crotch_main2 != null">
									<div class="value value--title">股下(左)</div>
									<div class="value" data-title="基準値">-</div>
									<div class="value" data-title="補正値">-</div>
									<div class="value" data-title="上がり値">{{$parent.selected.sessions.ordersheet.crotch_main2}}cm</div>
								</div>
								<div class="table-row" v-if="$parent.selected.sessions.ordersheet.crotch_right2 != '' && $parent.selected.sessions.ordersheet.crotch_right2 != null">
									<div class="value value--title">股下(右)</div>
									<div class="value" data-title="基準値">-</div>
									<div class="value" data-title="補正値">-</div>
									<div class="value" data-title="上がり値">{{$parent.selected.sessions.ordersheet.crotch_right2}}cm</div>
								</div>
							</div>

							<div class="table-group" v-if="$parent.selected.sessions.ordersheet.wo_sk_d1 != null && $parent.selected.sessions.ordersheet.wo_sk_d1 != '' && selectparts.indexOf('skirt') > -1">
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
										<div class="value value--title">{{item.name}}</div>
										<div class="value" data-title="基準値">{{$parent.selected.size[item.junle][key]}}cm</div>
										<div class="value" data-title="補正値">{{$parent.selected.sessions.ordersheet[key] - $parent.selected.size[item.junle][key] | round}}cm</div>
										<div class="value" data-title="上がり値">{{$parent.selected.sessions.ordersheet[key]}}cm</div>
									</div>
								</template>
							</div>

							<div class="table-group" v-if="$parent.selected.sessions.ordersheet.wo_sk_d2 != null && $parent.selected.sessions.ordersheet.wo_sk_d2 != '' && selectparts.indexOf('skirt2') > -1">
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
										<div class="value value--title">{{item.name}}</div>
										<div class="value" data-title="基準値">{{$parent.selected.size[item.junle][key]}}cm</div>
										<div class="value" data-title="補正値">{{$parent.selected.sessions.ordersheet[key] - $parent.selected.size[item.junle][key] | round}}cm</div>
										<div class="value" data-title="上がり値">{{$parent.selected.sessions.ordersheet[key]}}cm</div>
									</div>
								</template>
							</div>
						</div>

						<div class="action-container">
							<!-- <button class="style-button step-change" @click="stepChanger(2)">
								変更する
							</button> -->
						</div>
					</div>

					<div class="sticky-title" v-if='!this.$parent.katagamiNaiUser'>
						<h3>オプション内容確認</h3>
					</div>

					<template v-if='!this.$parent.katagamiNaiUser'>
						<template v-for="design in optionList">
							<div class="option-confirm-group" v-if="design.options.length" :key="design.id">
								<h4>{{ design.name }}</h4>
								<div class="label-group">
									<div class="label-row" v-for="item in design.options" :key="item.disp_name">
										<div class="label">{{item.disp_name}}</div>
										<div class="value" v-if="item.input_type == '2'">{{item.selectedOption}}</div>
										<div class="value" v-else>{{item.selectedOptionDetail.option_field}}</div>
									</div>
								</div>
								<div class="action-container">
									<button class="style-button step-change" @click="stepChanger(6)">
										変更する
									</button>
								</div>
							</div>
						</template>
					</template>
					<template v-else>
						<template v-for="design in optionList">
							<div class="option-confirm-group" v-if="design.options.length" :key="design.id">
								<h4>{{ design.name }}</h4>
								<div class="label-group">
									<template v-for="item in design.options">
										<div class="label-row" :key="item.disp_name" v-if="['48', '49', '50'].includes(item.option_id)">
											<div class="label">{{item.disp_name}}</div>
											<div class="value" v-if="item.input_type == '2'">{{item.selectedOption}}</div>
											<div class="value" v-else>{{item.selectedOptionDetail.option_field}}</div>
										</div>
									</template>
								</div>
								<div class="action-container">
									<!-- <button class="style-button step-change" @click="stepChanger(4)">
										変更する
									</button> -->
								</div>
							</div>
						</template>
					</template>

					<div class="delivery-date">
						<h5>納期: {{ $parent.deliveryDate }}</h5>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// コンポーネントのtemplateは、一つのタグですべて囲われていなければならん。注意。
//アロー関数では値が取れなくなる場合がある。　hoge:function(){}としろ。
module.exports = {
	props: ["uploadpass"],
	data: function () {
		return {
			address: "",
			selected: this.$parent.selected.sessions.ordersheet,
			selectedFabricer: this.$parent.productData[this.$parent.selected.fabric],
			sizeAdjs: this.$parent.size.adj,
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
	watch: {
		'$parent.selected.selectedOptions': function(v) {
			this.updateDesignList(v);
		}
	},
	computed: {
		selectparts: function () {
			var result = '';
			$.each(this.$parent.selected.parts, function (key, item) {
				result = item;
			})
			// // console.log('parts');
			// // console.log(result.designParts);
			return result.designParts;
		},
		selectedOption: function () {

			// var list = _.orderBy(this.$parent.selected.selectedOptions, 'option_rank');
			var list = _.sortBy(this.$parent.selected.selectedOptions, [function (o) { return ("0" + o.option_rank).slice(-2) * -1; }]);

			// // console.log('SELECTED_OPTIONS', JSON.parse(JSON.stringify(this.$parent.selected.selectedOptions)));

			// // console.log('並べ替えたオプションリスト');
			// // console.log(list);
			// $.each(list,function(key,item){
			// 	// console.log(item.disp_name);
			// });
			list = _.reverse(list);
			return list;
		},
		kakuhoTarget: function () {
			return this.$parent.kakuhoTarget;
			// return this.$parent.kakuhoTarget;
		},
		kizitokusei: function () {
			if (this.$parent.selected.sessions.ordersheet.washable == 1) {
				return "ウォッシャブル";
			} else if (this.$parent.selected.sessions.ordersheet.pleats_sta == 1) {
				return "プリーツ安定";
			} else {
				return "標準";
			}
		},
		selected02: function () {
			var result = "";
			$.each(this.$parent.selected.parts, function (key, item) {
				result = item.ja;
			})
			return result;
		},
		courseNos: function () {
			var course = this.$parent.selected.code.course;
			var courses = [];
			if (course.indexOf(",") > -1) {
				courses = course.split(",");
			} else {
				courses[0] = course;
			}
			//// console.log("courseNos:::");
			//// console.log(courses);
			return courses;
		},
	},
	methods: {
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
			if (["43", "69"].includes(option.option_id)) {
				const mOption = this.$parent.optionData.mazemaze[option.option_id];
				if (!mOption) return false;
				// console.log('CHACK_AIR_FIT_OPTION', JSON.parse(JSON.stringify(option)));
				// console.log('CHACK_AIR_FIT_MOPTION', JSON.parse(JSON.stringify(mOption)));
				// console.log(option.option_name, mOption.option_shiwake);
				return mOption.option_shiwake == "katagami";
			}
			return true;
		},
		stepChanger: function (target) {
			if (this.$parent.step != target) {
				Vue.set(this.$parent, "step", target);
			}
			Vue.set(this.$parent, "optionModalFlg", false);
		},
		modalCloser: function () {
			Vue.set(this.$parent, "optionModalFlg", false);
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
	},
	mounted: function () {
		// Vue.set(this,"selectedOption",this.$parent.getSelectedOption())
		// // console.log('サイズデータ');
		// // console.log(this.$parent.selected.size);
		this.$parent.getSelectedOption();

		this.updateDesignList(this.$parent.selected.selectedOptions);
	},
};
</script>