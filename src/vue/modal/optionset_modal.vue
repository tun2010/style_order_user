<template lang="pug">
	div.simulator__optionset_modal.simulator__modal
		div.simulator__modal__back(v-on:click="modalCloser")
		div.simulator__modal__wrap
			div.modal_close_container
				p.modal_closer(v-on:click="modalCloser")
			div.modal_scroll_container
				div.title_container
					span.size_title 選択オプションを確認
				div.simulator__confirm__box
					p.optionset_message 現在選択されているオプションセット
					h3.confirm__title
						span {{optionCourseDetails.optionset_name}}
						span.price(v-if='$parent.selected.optionCoursePrice != null') ￥{{$parent.selected.optionCoursePrice}}
				div.simulator__confirm__option_group(v-for='(item,key) in optionCourseDetails.siyouOptionSet')
					div.optionset_header
						div.current_selected(v-if="item.optionset_name == optionCourseDetails.optionset_name") 現在のセット
						div.optionset_titles {{ item.optionset_name }}
						div.optionset_price
							span {{ calcOptionSetData(item.optionset_name) }}
							small 円(税込)
					p.optionset_message {{ item.optionset_name }}に含まれる内容
					div.optionset_list
						//- :data-checker="sentakuChecker(optionset)",
						div.optionset_item(
							v-for="optionset in defaultOptions",
							:class="{ 'option': isOption(optionset, item), 'selected': item.optionset_name == optionCourseDetails.optionset_name && optionset.api_field in sentakuList }"
						)
							div.optionset_item__name
								span {{ optionset.option_name }}
								br(v-if="optionset.option_name_extra")
								span {{ optionset.option_name_extra }}
							div.selected_message(v-if="item.optionset_name == optionCourseDetails.optionset_name && optionset.api_field in sentakuList") 選択中

</template>
<style>
.optionFlexer {
	display: flex;
}

;

.sentaku {
	padding-left: 1em;
	color: #777;
}
</style>
<script>
// コンポーネントのtemplateは、一つのタグですべて囲われていなければならん。注意。
//アロー関数では値が取れなくなる場合がある。　hoge:function(){}としろ。
module.exports = {
	props: ["uploadpass"],
	data: function () {
		return {
			sentakuList: {},
			defaultOptions: [
				{
					"option_id": "46",
					"option_num": "1000",
					"option_name": "AMFステッチ",
					"option_name_extra": "(カラー)",
					"option_name_en": "AMF STITCH COLOR",
					"option_type": "2",
					"option_item": "2,5",
					"katagami_flg": "1",
					"processing": null,
					"open_flg": "1",
					"input_type": "1",
					"api_field": "colorcustoms_amf_stitch",
					"images": null,
					"del_flg": "0",
					"rank": "16",
					"creator_id": null,
					"create_date": "2019-06-28 10:47:32",
					"update_date": "2019-09-10 14:18:47",
					"kiji_flg": null,
					"detail_image": null,
					"detail_text": null,
					"price": null
				},
				{
					"option_id": "34",
					"option_num": "1001",
					"option_name": "カラークロス",
					"option_name_extra": "(カラー)",
					"option_name_en": "COLOR CROSS",
					"option_type": "2",
					"option_item": "2",
					"katagami_flg": null,
					"processing": null,
					"open_flg": "1",
					"input_type": "1",
					"api_field": "colorcustoms_color_cross",
					"images": "07291137_5d3e5bfbca28b.jpg",
					"del_flg": "0",
					"rank": "14",
					"creator_id": null,
					"create_date": "2019-06-20 17:03:27",
					"update_date": "2019-10-03 13:16:34",
					"kiji_flg": null,
					"detail_image": null,
					"detail_text": null,
					"price": null
				},
				{
					"option_id": "35",
					"option_num": "1002",
					"option_name": "切羽配色",
					"option_name_extra": "(カラー)",
					"option_name_en": "SEPPA COLER",
					"option_type": "2",
					"option_item": "2,5",
					"katagami_flg": "1",
					"processing": null,
					"open_flg": "1",
					"input_type": "1",
					"api_field": "colorcustoms_seppa_hall",
					"images": "07291138_5d3e5c2ba415f.jpg",
					"del_flg": "0",
					"rank": "20",
					"creator_id": null,
					"create_date": "2019-06-20 17:13:43",
					"update_date": "2019-11-02 10:34:25",
					"kiji_flg": null,
					"detail_image": null,
					"detail_text": null,
					"price": null
				},
				{
					"option_id": "36",
					"option_num": "1003",
					"option_name": "フラワーホール",
					"option_name_extra": "(カラー)",
					"option_name_en": "FLOWER HOLE",
					"option_type": "2",
					"option_item": "2",
					"katagami_flg": null,
					"processing": null,
					"open_flg": "1",
					"input_type": "1",
					"api_field": "colorcustoms_flower_hall",
					"images": "07291139_5d3e5c5617982.jpg",
					"del_flg": "0",
					"rank": "18",
					"creator_id": null,
					"create_date": "2019-06-20 17:19:00",
					"update_date": "2019-10-17 10:54:23",
					"kiji_flg": null,
					"detail_image": null,
					"detail_text": null,
					"price": null
				},
				{
					"option_id": "47",
					"option_num": "1101",
					"option_name": "袖口本切羽",
					"option_name_en": "HONSEPPA",
					"option_type": "2",
					"option_item": "2,5",
					"katagami_flg": "1",
					"processing": null,
					"open_flg": "1",
					"input_type": "1",
					"api_field": "sode_honseppa",
					"images": "07291203_5d3e61fdd9e96.jpg",
					"del_flg": "0",
					"rank": "22",
					"creator_id": null,
					"create_date": "2019-06-28 10:50:50",
					"update_date": "2019-09-19 18:56:31",
					"kiji_flg": null,
					"detail_image": null,
					"detail_text": "本切羽",
					"price": null
				},
				{
					"option_id": "51",
					"option_num": "1106",
					"option_name": "チェンジポケット",
					"option_name_en": "chgin",
					"option_type": "2",
					"option_item": "2,5",
					"katagami_flg": "1",
					"processing": null,
					"open_flg": "1",
					"input_type": "1",
					"api_field": "change_pocket",
					"images": "08021543_5d43db7e5645a.jpg",
					"del_flg": "0",
					"rank": "23",
					"creator_id": null,
					"create_date": "2019-07-01 15:35:55",
					"update_date": "2019-08-16 17:57:35",
					"kiji_flg": null,
					"detail_image": null,
					"detail_text": null,
					"price": null
				},
				{
					"option_id": "52",
					"option_num": "1017",
					"option_name": "パワーストレッチ",
					"option_name_en": "pawer",
					"option_type": "2",
					"option_item": "2,3,5",
					"katagami_flg": "1",
					"processing": null,
					"open_flg": "1",
					"input_type": "1",
					"api_field": "ext_specification",
					"images": "07311338_5d411b40248d6.jpg",
					"del_flg": "0",
					"rank": "28",
					"creator_id": null,
					"create_date": "2019-07-01 15:38:05",
					"update_date": "2019-10-29 16:41:21",
					"kiji_flg": null,
					"detail_image": null,
					"detail_text": null,
					"price": null
				},
				{
					"option_id": "53",
					"option_num": "1011",
					"option_name": "DP裏地ネーム",
					"option_name_en": "DP　name",
					"option_type": "2",
					"option_item": "2,4,5",
					"katagami_flg": null,
					"processing": null,
					"open_flg": "1",
					"input_type": "2",
					"api_field": "digital_name",
					"images": "07291238_5d3e6a2e41300.jpg",
					"del_flg": "0",
					"rank": "25",
					"creator_id": null,
					"create_date": "2019-07-01 15:39:56",
					"update_date": "2019-07-29 12:38:24",
					"kiji_flg": null,
					"detail_image": null,
					"detail_text": null,
					"price": null
				},
				{
					"option_id": "65",
					"option_num": "1010",
					"option_name": "裏地(DP)",
					"option_name_en": "uraji",
					"option_type": "2",
					"option_item": "2,4,5",
					"katagami_flg": null,
					"processing": null,
					"open_flg": "1",
					"input_type": "1",
					"api_field": "colorcustoms_ura_cno",
					"images": "07291212_5d3e6407d5375.jpg",
					"del_flg": "0",
					"rank": "26",
					"creator_id": null,
					"create_date": "2019-07-22 17:51:25",
					"update_date": "2019-09-17 14:34:05",
					"kiji_flg": null,
					"detail_image": null,
					"detail_text": null,
					"price": null
				},
			]
		}
	},
	computed: {
		optionCourseDetails: function () {
			return this.$parent.selected.optionCourseDetails;
		},
	},
	methods: {
		isOption(optionset, items) {
			// console.log('IS_DISABLED', JSON.parse(JSON.stringify(optionset)));
			// console.log('ITEM', JSON.parse(JSON.stringify(items)));
			return !!Object.values(items).find(item => item && item.option_id && item.option_id == optionset.option_id);
		},
		modalCloser: function () {
			Vue.set(this.$parent, "optionsetModalFlg", false);
		},
		sentakuChecker: function (item) {
			var result = false;
			const query = {
				headers: {
					"content-Type": "application/json;charset=UTF-8"
				},
				params: {
					sessions: JSON.stringify(this.$parent.selected.sessions.ordersheet),
					item: JSON.stringify(item)
				}
			};
			var thista = this;
			axios.get("/sandbox/ajaxTool/checkSentaku.php", query).then(res => {
				// console.log(res.data);
				if (res.data == true) {
					// console.log(item);
					Vue.set(thista.sentakuList, item.api_field, item.api_field);
					return true;
				}
				// console.log('sentakuList-----------------------------', thista.sentakuList);
			});

			// return 'ok';
		},
		calcOptionSetData(optionset_name) {
			const sex = this.$parent.selected.gender === 'men' ? '1' : '2';
			const item = this.$parent.masters.optionset.find(item => (
				item.optionset_name === optionset_name
				&& item.sex === sex
			));
			const formatNumber = (number) => new Intl.NumberFormat('en-US').format(parseInt(number));
			// console.log('optionset_name', JSON.parse(JSON.stringify(item)));
			// console.log('GENDER', this.$parent.selected.gender);

			// console.log('selected.parts', JSON.parse(JSON.stringify(this.$parent.selected.parts)));

			if (item) {
				if (item.price_choice == '1') return formatNumber(item.price);
				else if (item.price_choice == '2') {
					const part = Object.values(this.$parent.selected.parts).find(item => !!item);
					// console.log('ITEM', JSON.parse(JSON.stringify(item)));
					// console.log('PART', JSON.parse(JSON.stringify(part)));
					if (part) {
						const key = `price${part.masterNo}`;
						return formatNumber(item[key] || 0);
					}
				}
			}

			return 0;
		},
	},
	mounted: function () {
		// console.log('masters_optionset', JSON.parse(JSON.stringify(this.$parent.masters.optionset)));
		// Vue.set(this,"selectedOption",this.$parent.getSelectedOption())
		// console.log(JSON.parse(JSON.stringify(this.$parent.selected.optionCourseDetails)));
		this.defaultOptions.forEach(item => {
			this.sentakuChecker(item);
		});
	},
};
</script>