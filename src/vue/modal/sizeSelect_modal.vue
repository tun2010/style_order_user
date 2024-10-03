<template lang="pug">
.simulator__sizeselect_modal.simulator__modal
    .simulator__modal__back(v-on:click="modalCloser")
    .simulator__modal__wrap
        div.modal_close_container
            p.modal_closer(v-on:click="modalCloser")
        template(v-if="sizeDataLoad")
            div.modal_scroll_container(v-if="targetGender == 'gb' || targetGender == 'men'")
                table.datatable
                    tr
                        th 身長/体型
                        template(v-for="(baseitem, basekey) in sizeData.data.size")
                            th {{ baseitem }}
                            th(v-for="item in sizeData.cols[targetCategory]")
                                span {{ sizeData.colsNihongo[item] }}

                    tr.dataline(v-for="(sizeList, index) in getMenSizetableData()" :key="index")
                        template(v-for="(item, sizeIndex) in sizeList")
                            th(v-if="item.type == 'size'" :key="sizeIndex") {{ item.data }}
                            td.sizeselectButton(
                                v-else-if="item.type == 'size-name'",
                                v-on:click="sizeDataSubmit(targetCategory, item)",
                                :class="{ active: isSelectedItem(item.data), disabled: !item.isData }"
                                :key="sizeIndex"
                            )
                                span {{ item.data }}
                            td.dataline__checker(v-else :key="sizeIndex")
                                span {{ item.data }}

                    //- tr.dataline(v-for="(item, key) in sizeMap[targetGender].sizeNums")
                    //-     th {{ key }}
                    //-     template(v-for="(baseitem, basekey) in sizeData.data.size")
                    //-         td.sizeselectButton
                    //-             span(
                    //-                 v-on:click="sizeSubmit(targetCategory, basekey, item, $event)",
                    //-                 v-bind:data-targets="baseitem + '-' + item",
                    //-                 :class="{'active': isSelected(item, baseitem, sizeData.data.pattern_num)}"
                    //-             ) {{ baseitem }}-{{ item }} {{  }}
                    //-         td.dataline__checker(
                    //-             v-for="(item2, key2) in sizeData.cols[targetCategory]",
                    //-             v-if="item2 in sizeData.data",
                    //-             :class="{ notAdj: notAdjSize.indexOf(item2) > -1, sizenashi: (basekey in sizeData.data[item2] && item in sizeData.data[item2][basekey] && sizeData.data[item2][basekey][item] != null && sizeData.data[item2][basekey][item] != '') == false }",
                    //-             v-bind:data-child="baseitem + '-' + item"
                    //-         )
                    //-             span(
                    //-                 v-if="basekey in sizeData.data[item2] && item in sizeData.data[item2][basekey]"
                    //-             ) {{ sizeData.data[item2][basekey][item] }}
                    //-             span(v-else)

            div.modal_scroll_container(v-else-if="'size' in sizeData.data")
                template(v-for="(baseitem, basekey) in sizeData.cntOption")
                    table.datatable
                        tr
                            th NO
                            th(v-for="item in sizeData.cols[targetCategory]")
                                span {{ sizeData.colsNihongo[item] }}

                        tr.dataline(v-for="(sizeList, index) in getSizetableData(baseitem)" :key="index")
                            template(v-for="(item, sizeIndex) in sizeList")
                                td.sizeselectButton(
                                    v-if="item.type == 'size-name'",
                                    v-on:click="sizeDataSubmit(targetCategory, item)",
                                    :class="{ active: isSelectedItem(item.value), disabled: !item.isData }"
                                    :key="sizeIndex"
                                )
                                    span {{ item.data }}
                                td.dataline__checker(v-else :key="sizeIndex")
                                    span {{ item.data }}

                        //- tr.dataline(v-for="n in sizeData.kaisu[gender]")
                        //-     td.sizeselectButton(v-if="gender == 1")
                        //-         span(
                        //-             v-on:click="sizeSubmit(targetCategory, baseitem, n - 1, $event)",
                        //-             v-bind:data-targets="sizeData.data.size[baseitem] + '-' + (n - 1)"
                        //-         ) {{ sizeData.data.size[baseitem] }}-{{ n - 1 }}
                        //-     td.sizeselectButton(v-else-if="gender == 2")
                        //-         span(
                        //-             v-on:click="sizeSubmit(targetCategory, baseitem, n - 1, $event)",
                        //-             v-bind:data-targets="sizeData.radiesSize[n - 1]"
                        //-         ) {{ sizeData.radiesSize[n - 1] }}号
                        //-     td.dataline__checker(
                        //-         v-for="(item, key) in sizeData.cols[targetCategory]",
                        //-         v-if="item in sizeData.data",
                        //-         :class="{ notAdj: notAdjSize.indexOf(item) > -1, sizenashi: (baseitem in sizeData.data[item] && n - 1 in sizeData.data[item][baseitem] && sizeData.data[item][baseitem][n - 1] != null && sizeData.data[item][baseitem][n - 1] != '') == false }",
                        //-         v-bind:data-child="sizeData.radiesSize[n - 1]"
                        //-     )
                        //-         span(
                        //-             v-if="baseitem in sizeData.data[item] && n - 1 in sizeData.data[item][baseitem]"
                        //-         ) {{ sizeData.data[item][baseitem][n - 1] }}
                        //-         span(v-else)
            div.modal_scroll_container(v-else)
                p サイズが登録されていません
        div(v-else)
            p.sizeTableLoading 対応サイズをロード中・・
</template>

<script>
// コンポーネントのtemplateは、一つのタグですべて囲われていなければならん。注意。
//アロー関数では値が取れなくなる場合がある。　hoge:function(){}としろ。
module.exports = {
    props: ["uploadpass"],
    data: function () {
        return {
            //サイズ調整できないやつ
            notAdjSize: ["hip", "bast"],
            sizeDataLoad: false,
            sizeData: {},
            sizeMap: {
                men: {
                    types: ["Y", "A", "AB", "B"],
                    sizeNums: {
                        "145cm": 0,
                        "150cm": 1,
                        "155cm": 2,
                        "160cm": 3,
                        "165cm": 4,
                        "170cm": 5,
                        "175cm": 6,
                        "180cm": 7,
                        "185cm": 8,
                        "190cm": 9,
                        "195cm": 10,
                        "200cm": 11,
                        "205cm": 12,
                    },
                },
                gb: {
                    types: ["BE", "KB", "KE", "TL"],
                    sizeNums: {
                        //   "155cm":2,
                        //   "160cm":3,
                        //   "165cm":4,
                        //   "170cm":5,
                        //   "175cm":6,
                        //   "180cm":7,
                        //   "185cm":8,
                        //   "190cm":9,
                        "145cm": 0,
                        "150cm": 1,
                        "155cm": 2,
                        "160cm": 3,
                        "165cm": 4,
                        "170cm": 5,
                        "175cm": 6,
                        "180cm": 7,
                        "185cm": 8,
                        "190cm": 9,
                        "195cm": 10,
                        "200cm": 11,
                        "205cm": 12,
                    },
                },
            },
            //   targetCategory:this.$parent.c3Category;
            //   男性１、女性２
            gender: this.$parent.selected.sessions.ordersheet.sex,
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
			session_sizes: {
				"1": "jacket_size",
				"2": "best_size",
				"3": "slacks_size1",
				"3pants2": "slacks_size2",
				"5": "jacket_size",
				"6": "slacks_size1",
				"6pants2": "slacks_size2",
				"7": "wo_sk_size1",
				"7skirt2": "wo_sk_size2",
			},
        };
    },
    computed: {
        targetGender: function () {
            //// console.log('targetgender');
            //// console.log(this.$parent.selected.gb);
            if (this.$parent.selected.gb) {
                return "gb";
            } else {
                return this.$parent.selected.gender;
            }
        },
        targetProductData: function () {
            return this.$parent.productData[this.product_id];
        },
        targetCategory: function () {
            var t = this.$parent.c3Category;
            if (t == 1 || t == 5) {
                return "jacket";
            } else if (t == 3 || t == 6) {
                return "pants";
            } else if (t == 2) {
                return "vest";
            } else if (t == 7) {
                return "skirt";
            }
        },
		selectedKatagami: function () {
			var target = this.$parent.c3Category + this.$parent.sub;
            // // console.log('TARGET', target);
            // // console.log('selectedKatagami', this.$parent.selected.sessions.ordersheet, this.session_himoduke);
			return this.$parent.selected.sessions.ordersheet[this.session_himoduke[target]];
		},
        selectedSize: function () {
			var target = this.$parent.c3Category + this.$parent.sub;
			return this.$parent.selected.sessions.ordersheet[this.session_sizes[target]];
        }
    },
    methods: {
        log(message, data) {
            // console.log(message.toUpperCase().concat('::::::::::'), JSON.parse(JSON.stringify(data)));
        },
        getMenSizetableData() {
            const rows = [];
            Object.entries(this.sizeMap[this.targetGender].sizeNums).forEach(([size, index]) => {
                const cols = [];
                cols.push({ type: 'size', data: size });

                let isSomeData = false;
                Object.entries(this.sizeData.data.size).forEach(([key, sizeName]) => {
                    const list = [];
                    this.sizeData.cols[this.targetCategory].forEach(parts => {
                        const data = this.sizeData.data[parts]?.[key]?.[index];
                        list.push(data || '');
                        if (data) isSomeData = true;
                    });

                    cols.push({ type: 'size-name', data: `${sizeName}-${index}`, key, index, isData: !!list.find(item => !!item) });

                    for(let data of list) {
                        cols.push({ type: 'data', data });
                    }
                });

                if (isSomeData) rows.push(cols);
            });
            // this.log('rows', rows);
            return rows;
        },
        getSizetableData(key) {
            const rows = [];

            const n = this.sizeData.kaisu[this.gender];
            const indexArray = Array.from({ length: n }, (_, i) => i);

            indexArray.forEach(index => {
                const cols = [];

                const list = [];
                let isSomeData = false;
                this.sizeData.cols[this.targetCategory].forEach(parts => {
                    const data = this.sizeData.data[parts]?.[key]?.[index];
                    list.push(data || '');
                    if (data) isSomeData = true;
                })

                let data = '', value = '';
                if (this.gender == 1) {
                    // {{ sizeData.data.size[baseitem] }}-{{ n - 1 }}
                    data = `${this.sizeData.data.size[key]}-${index}`;
                    value = `${this.sizeData.data.size[key]}-${index}`;
                } else if (this.gender == 2) {
                    // {{ sizeData.radiesSize[n - 1] }}号
                    data = `${this.sizeData.radiesSize[index]}号`;
                    value = this.sizeData.radiesSize[index];
                }

                cols.push({ type: 'size-name', data, key, index, value, isData: !!list.find(item => !!item) });
                for(let data of list) {
                    cols.push({ type: 'data', data });
                }

                if (isSomeData) {
                    rows.push(cols);
                }
            })

            // this.log('cols',this.sizeData.cols[this.targetCategory]);
            // this.log('rows',rows);
            return rows;
        },
        modalCloser: function () {
            // alert("サイズを選択してください");
            Vue.set(this.$parent,"sizeSelectModalFlg",false);
            // // console.log(
            //     "SELECTED_SIZE_CLOSED",
            //     JSON.parse(JSON.stringify(this.$parent.selected))
            // );
        },
        isSelectedItem(data) {
            // // console.log('PATTERN', this.selectedKatagami, this.sizeData.data.pattern_num);
            // // console.log('SIZE', this.selectedSize, data);
            return (
                this.selectedKatagami == this.sizeData.data.pattern_num
                && this.selectedSize == data
            )
        },
        isSelected: function(item, baseitem, pattern_num) {
            const size = baseitem + '-' + item
            // // console.log('PATTERN', this.selectedKatagami, pattern_num);
            // // console.log('SIZE', this.selectedSize, size);
            return this.selectedKatagami == pattern_num && this.selectedSize == size;
        },
        sizeDataSubmit(targetCategory, item) {
            // this.log('designSelectedParams', this.$parent.designSelectedParams)
            // console.log(targetCategory, item);

            this.katagamiClicker(
                this.$parent.designSelectedParams.target,
                this.$parent.designSelectedParams.selectedCourse,
                this.$parent.designSelectedParams.styleno,
                this.$parent.designSelectedParams.pattern_nums,
                this.$parent.designSelectedParams.pattern_ids,
                this.$parent.designSelectedParams.type,
                this.$parent.designSelectedParams.categoryKatagami,
                this.$parent.designSelectedParams.sub
            );

            if (!item.isData) {
                alert("こちらはサイズが設定されていないため使えません");
                return false;
            }

            const targetBase = item.key, targetNum = item.index;

            if (this.gender == 1) {
                if (targetCategory == "jacket") {
                    // Vue.set(this.$parent.selected.baseSize.jacket,"baseNum",targetBase);
                    // Vue.set(this.$parent.selected.baseSize.jacket,"targetNum",targetNum);
                    if (
                        this.$parent.selected.sessions.ordersheet.jacket_size ==
                        this.sizeData.data.size[targetBase] + "-" + [targetNum]
                    ) {
                        this.$parent.sizeTouroku(
                            this.sizeData.data.size[targetBase] + "-" + [targetNum],
                            "jacket",
                            "jacket_dno"
                        );
                    }
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "jacket_size",
                        this.sizeData.data.size[targetBase] + "-" + [targetNum]
                    );

                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "kitake",
                        this.sizeData.data["kitake"][targetBase][targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "sodetake_left",
                        this.sizeData.data["sodetake_left"][targetBase][targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "sodetake_right",
                        this.sizeData.data["sodetake_left"][targetBase][targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "ja_shoulder",
                        this.sizeData.data["ja_shoulder"][targetBase][targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "waist",
                        this.sizeData.data["waist"][targetBase][targetNum]
                    );
                } else if (targetCategory == "pants") {
                    var subs = this.$parent.sub;
                    var subNum = 1;
                    if (subs == "pants2") {
                        subNum = 2;
                    }
                    // Vue.set(this.$parent.selected.baseSize["pants"+subNum],"baseNum",targetBase);
                    // Vue.set(this.$parent.selected.baseSize["pants"+subNum],"targetNum",targetNum);
                    if (
                        this.$parent.selected.sessions.ordersheet["slacks_size" + subNum] ==
                        this.sizeData.data.size[targetBase] + "-" + [targetNum]
                    ) {
                        if (subNum == 2 || subNum == "2") {
                            this.$parent.sizeTouroku(
                                this.sizeData.data.size[targetBase] + "-" + [targetNum],
                                "pants2",
                                "slacks_dno2"
                            );
                        } else {
                            this.$parent.sizeTouroku(
                                this.sizeData.data.size[targetBase] + "-" + [targetNum],
                                "pants",
                                "slacks_dno1"
                            );
                        }
                    }
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "slacks_size" + subNum,
                        this.sizeData.data.size[targetBase] + "-" + [targetNum]
                    );

                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "waist_" + subNum,
                        this.sizeData.data["waist_1"][targetBase][targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "susohaba" + subNum,
                        this.sizeData.data["susohaba1"][targetBase][targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "watarihaba" + subNum,
                        this.sizeData.data["watarihaba1"][targetBase][targetNum]
                    );
                } else if (targetCategory == "vest") {
                    // Vue.set(this.$parent.selected.baseSize.vest,"baseNum",targetBase);
                    // Vue.set(this.$parent.selected.baseSize.vest,"targetNum",targetNum);
                    if (
                        this.$parent.selected.sessions.ordersheet.best_size ==
                        this.sizeData.data.size[targetBase] + "-" + [targetNum]
                    ) {
                        this.$parent.sizeTouroku(
                            this.sizeData.data.size[targetBase] + "-" + [targetNum],
                            "vest",
                            "best_dno"
                        );
                    }
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "best_size",
                        this.sizeData.data.size[targetBase] + "-" + [targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "bestsetake",
                        this.sizeData.data["bestsetake"][targetBase][targetNum]
                    );
                }
                //女性↓
            } else if (this.gender == 2) {
                if (targetCategory == "jacket") {
                    // Vue.set(this.$parent.selected.baseSize.jacket,"baseNum",targetBase);
                    // Vue.set(this.$parent.selected.baseSize.jacket,"targetNum",targetNum);
                    if (
                        this.$parent.selected.sessions.ordersheet.jacket_size ==
                        this.sizeData.radiesSize[targetNum]
                    ) {
                        this.$parent.sizeTouroku(
                            this.sizeData.radiesSize[targetNum],
                            "jacket",
                            "jacket_dno"
                        );
                    }
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "jacket_size",
                        this.sizeData.radiesSize[targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "kitake",
                        this.sizeData.data["kitake"][targetBase][targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "sodetake_left",
                        this.sizeData.data["sodetake_left"][targetBase][targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "sodetake_right",
                        this.sizeData.data["sodetake_left"][targetBase][targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "ja_shoulder",
                        this.sizeData.data["ja_shoulder"][targetBase][targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "waist",
                        this.sizeData.data["waist"][targetBase][targetNum]
                    );
                } else if (targetCategory == "pants") {
                    var subs = this.$parent.sub;
                    var subNum = 1;
                    if (subs == "pants2") {
                        subNum = 2;
                    }
                    // Vue.set(this.$parent.selected.baseSize["pants"+subNum],"baseNum",targetBase);
                    // Vue.set(this.$parent.selected.baseSize["pants"+subNum],"targetNum",targetNum);
                    if (
                        this.$parent.selected.sessions.ordersheet["slacks_size" + subNum] ==
                        this.sizeData.radiesSize[targetNum]
                    ) {
                        if (subNum == 2) {
                            this.$parent.sizeTouroku(
                                this.sizeData.radiesSize[targetNum],
                                "pants2",
                                "slacks_dno2"
                            );
                        } else {
                            this.$parent.sizeTouroku(
                                this.sizeData.radiesSize[targetNum],
                                "pants",
                                "slacks_dno1"
                            );
                        }
                    }
                    // this.log(
                    //     "slacks_size" + subNum,
                    //     this.sizeData.radiesSize[targetNum]
                    // );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "slacks_size" + subNum,
                        this.sizeData.radiesSize[targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "waist_" + subNum,
                        this.sizeData.data["waist_1"][targetBase][targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "susohaba" + subNum,
                        this.sizeData.data["susohaba1"][targetBase][targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "watarihaba" + subNum,
                        this.sizeData.data["watarihaba1"][targetBase][targetNum]
                    );
                } else if (targetCategory == "skirt") {
                    var subs = this.$parent.sub;
                    var subNum = 1;
                    if (subs == "skirt2") {
                        subNum = 2;
                    }
                    // Vue.set(this.$parent.selected.baseSize["skirt"+subNum],"baseNum",targetBase);
                    // Vue.set(this.$parent.selected.baseSize["skirt"+subNum],"targetNum",targetNum);
                    if (
                        this.$parent.selected.sessions.ordersheet["wo_sk_size" + subNum] ==
                        this.sizeData.radiesSize[targetNum]
                    ) {
                        if (subNum == 2) {
                            this.$parent.sizeTouroku(
                                this.sizeData.radiesSize[targetNum],
                                "skirt2",
                                "wo_sk_d2"
                            );
                        } else {
                            this.$parent.sizeTouroku(
                                this.sizeData.radiesSize[targetNum],
                                "skirt",
                                "wo_sk_d1"
                            );
                        }
                    }

                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "wo_sk_size" + subNum,
                        this.sizeData.radiesSize[targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "wo_skirt_" + subNum,
                        this.sizeData.data["wo_skirt_1"][targetBase][targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "wo_waist_" + subNum,
                        this.sizeData.data["wo_waist_1"][targetBase][targetNum]
                    );
                }
            }
            // this.log('ordersheet', this.$parent.selected.sessions.ordersheet);
            // alert("サイズを選択しました.");
            Vue.set(this.$parent, "sizeSelectModalFlg", false);
        },
        sizeSubmit: function (targetCategory, targetBase, targetNum, event) {
            // // console.log(targetCategory, targetBase, targetNum);
            this.katagamiClicker(
                this.$parent.designSelectedParams.target,
                this.$parent.designSelectedParams.selectedCourse,
                this.$parent.designSelectedParams.styleno,
                this.$parent.designSelectedParams.pattern_nums,
                this.$parent.designSelectedParams.pattern_ids,
                this.$parent.designSelectedParams.type,
                this.$parent.designSelectedParams.categoryKatagami,
                this.$parent.designSelectedParams.sub
            );

            var st = $(event.target).attr("data-targets");
            //// console.log($('.sizenashi[data-child='+st+']').length);
            if ($(".sizenashi[data-child=" + st + "]").not(".notAdj").length > 0) {
                alert("こちらはサイズが設定されていないため使えません");
                return false;
            }

            if (this.gender == 1) {
                if (targetCategory == "jacket") {
                    // Vue.set(this.$parent.selected.baseSize.jacket,"baseNum",targetBase);
                    // Vue.set(this.$parent.selected.baseSize.jacket,"targetNum",targetNum);
                    if (
                        this.$parent.selected.sessions.ordersheet.jacket_size ==
                        this.sizeData.data.size[targetBase] + "-" + [targetNum]
                    ) {
                        this.$parent.sizeTouroku(
                            this.sizeData.data.size[targetBase] + "-" + [targetNum],
                            "jacket",
                            "jacket_dno"
                        );
                    }
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "jacket_size",
                        this.sizeData.data.size[targetBase] + "-" + [targetNum]
                    );

                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "kitake",
                        this.sizeData.data["kitake"][targetBase][targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "sodetake_left",
                        this.sizeData.data["sodetake_left"][targetBase][targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "sodetake_right",
                        this.sizeData.data["sodetake_left"][targetBase][targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "ja_shoulder",
                        this.sizeData.data["ja_shoulder"][targetBase][targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "waist",
                        this.sizeData.data["waist"][targetBase][targetNum]
                    );
                } else if (targetCategory == "pants") {
                    var subs = this.$parent.sub;
                    var subNum = 1;
                    if (subs == "pants2") {
                        subNum = 2;
                    }
                    // Vue.set(this.$parent.selected.baseSize["pants"+subNum],"baseNum",targetBase);
                    // Vue.set(this.$parent.selected.baseSize["pants"+subNum],"targetNum",targetNum);
                    if (
                        this.$parent.selected.sessions.ordersheet["slacks_size" + subNum] ==
                        this.sizeData.data.size[targetBase] + "-" + [targetNum]
                    ) {
                        if (subNum == 2 || subNum == "2") {
                            this.$parent.sizeTouroku(
                                this.sizeData.data.size[targetBase] + "-" + [targetNum],
                                "pants2",
                                "slacks_dno2"
                            );
                        } else {
                            this.$parent.sizeTouroku(
                                this.sizeData.data.size[targetBase] + "-" + [targetNum],
                                "pants",
                                "slacks_dno1"
                            );
                        }
                    }
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "slacks_size" + subNum,
                        this.sizeData.data.size[targetBase] + "-" + [targetNum]
                    );

                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "waist_" + subNum,
                        this.sizeData.data["waist_1"][targetBase][targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "susohaba" + subNum,
                        this.sizeData.data["susohaba1"][targetBase][targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "watarihaba" + subNum,
                        this.sizeData.data["watarihaba1"][targetBase][targetNum]
                    );
                } else if (targetCategory == "vest") {
                    // Vue.set(this.$parent.selected.baseSize.vest,"baseNum",targetBase);
                    // Vue.set(this.$parent.selected.baseSize.vest,"targetNum",targetNum);
                    if (
                        this.$parent.selected.sessions.ordersheet.best_size ==
                        this.sizeData.data.size[targetBase] + "-" + [targetNum]
                    ) {
                        this.$parent.sizeTouroku(
                            this.sizeData.data.size[targetBase] + "-" + [targetNum],
                            "vest",
                            "best_dno"
                        );
                    }
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "best_size",
                        this.sizeData.data.size[targetBase] + "-" + [targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "bestsetake",
                        this.sizeData.data["bestsetake"][targetBase][targetNum]
                    );
                }
                //女性↓
            } else if (this.gender == 2) {
                if (targetCategory == "jacket") {
                    // Vue.set(this.$parent.selected.baseSize.jacket,"baseNum",targetBase);
                    // Vue.set(this.$parent.selected.baseSize.jacket,"targetNum",targetNum);
                    if (
                        this.$parent.selected.sessions.ordersheet.jacket_size ==
                        this.sizeData.radiesSize[targetNum]
                    ) {
                        this.$parent.sizeTouroku(
                            this.sizeData.radiesSize[targetNum],
                            "jacket",
                            "jacket_dno"
                        );
                    }
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "jacket_size",
                        this.sizeData.radiesSize[targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "kitake",
                        this.sizeData.data["kitake"][targetBase][targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "sodetake_left",
                        this.sizeData.data["sodetake_left"][targetBase][targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "sodetake_right",
                        this.sizeData.data["sodetake_left"][targetBase][targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "ja_shoulder",
                        this.sizeData.data["ja_shoulder"][targetBase][targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "waist",
                        this.sizeData.data["waist"][targetBase][targetNum]
                    );
                } else if (targetCategory == "pants") {
                    var subs = this.$parent.sub;
                    var subNum = 1;
                    if (subs == "pants2") {
                        subNum = 2;
                    }
                    // Vue.set(this.$parent.selected.baseSize["pants"+subNum],"baseNum",targetBase);
                    // Vue.set(this.$parent.selected.baseSize["pants"+subNum],"targetNum",targetNum);
                    if (
                        this.$parent.selected.sessions.ordersheet["slacks_size" + subNum] ==
                        this.sizeData.radiesSize[targetNum]
                    ) {
                        if (subNum == 2) {
                            this.$parent.sizeTouroku(
                                this.sizeData.radiesSize[targetNum],
                                "pants2",
                                "slacks_dno2"
                            );
                        } else {
                            this.$parent.sizeTouroku(
                                this.sizeData.radiesSize[targetNum],
                                "pants",
                                "slacks_dno1"
                            );
                        }
                    }
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "slacks_size" + subNum,
                        this.sizeData.radiesSize[targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "waist_" + subNum,
                        this.sizeData.data["waist_1"][targetBase][targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "susohaba" + subNum,
                        this.sizeData.data["susohaba1"][targetBase][targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "watarihaba" + subNum,
                        this.sizeData.data["watarihaba1"][targetBase][targetNum]
                    );
                } else if (targetCategory == "skirt") {
                    var subs = this.$parent.sub;
                    var subNum = 1;
                    if (subs == "skirt2") {
                        subNum = 2;
                    }
                    // Vue.set(this.$parent.selected.baseSize["skirt"+subNum],"baseNum",targetBase);
                    // Vue.set(this.$parent.selected.baseSize["skirt"+subNum],"targetNum",targetNum);
                    if (
                        this.$parent.selected.sessions.ordersheet["wo_sk_size" + subNum] ==
                        this.sizeData.radiesSize[targetNum]
                    ) {
                        if (subNum == 2) {
                            this.$parent.sizeTouroku(
                                this.sizeData.radiesSize[targetNum],
                                "skirt2",
                                "wo_sk_d2"
                            );
                        } else {
                            this.$parent.sizeTouroku(
                                this.sizeData.radiesSize[targetNum],
                                "skirt",
                                "wo_sk_d1"
                            );
                        }
                    }

                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "wo_sk_size" + subNum,
                        this.sizeData.radiesSize[targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "wo_skirt_" + subNum,
                        this.sizeData.data["wo_skirt_1"][targetBase][targetNum]
                    );
                    Vue.set(
                        this.$parent.selected.sessions.ordersheet,
                        "wo_waist_" + subNum,
                        this.sizeData.data["wo_waist_1"][targetBase][targetNum]
                    );
                }
            }
            //// console.log(this.$parent.selected);
            // alert("サイズを選択しました.");
            Vue.set(this.$parent, "sizeSelectModalFlg", false);

            // // console.log('SELECTED_DESIGN', JSON.parse(JSON.stringify(this.$parent.selected)));
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
        katagamiClicker: function(target, selectedCourse, styleno, pattern_nums, pattern_ids, type, categoryKatagami, sub) {
            // if (this.sorters) {
                // this.partsClicker(styleno, '');
            // }
            this.$parent.partsClicker03(styleno);
            if(this.$parent.katagamiNaiUser) {
                //遊びだけできるユーザーの挙動
                Vue.set(this.$parent.selected.course,this.$parent.c3Category+sub,{});
                Vue.set(this.$parent.selected.course[this.$parent.c3Category+sub],this.$parent.selected.styleTarget,this.$parent.masters.style[this.$parent.selected.styleTarget]);
            }

            var zenKatagami = this.categoryZen2(categoryKatagami);

            Vue.set(this.$parent.selected.course, this.$parent.c3Category + sub, {});
            // Vue.set(this.$parent.selected.course[this.$parent.c3Category+this.sub],this.$parent.selected.styleTarget,this.$parent.masters.style[this.$parent.selected.styleTarget]);

            if (type == 'zen') {
                Vue.set(this.$parent.selected.course[this.$parent.c3Category + sub], this.$parent.selected.styleTarget, zenKatagami[target]);
            } else {
                Vue.set(this.$parent.selected.course[this.$parent.c3Category + sub], this.$parent.selected.styleTarget, selectedCourse);
            }
            //// console.log("this.$parent.selected.course");
            //// console.log(this.$parent.selected.course);
            // Vue.set(this.$parent.selected,'katagami',{});
            Vue.set(this.$parent.selected.katagami, this.$parent.c3Category + sub, {});
            if (type == 'zen') {
                Vue.set(this.$parent.selected.katagami[this.$parent.c3Category + sub], target, zenKatagami[target]);
            } else {
                Vue.set(this.$parent.selected.katagami[this.$parent.c3Category + sub], target, selectedCourse);
            }
            //オプション選択内容をリセット
            // // console.log('あなたが選択した型紙↓');
            // // console.log(this.$parent.selected.course[this.$parent.c3Category+this.sub][this.$parent.selected.styleTarget]);
            if ((this.$parent.selected.sessions.ordersheet.air_fit != '' && this.$parent.selected.sessions.ordersheet.air_fit != null && this.$parent.selected.sessions.ordersheet.air_fit != "0") && (this.$parent.c3Category == "1" || this.$parent.c3Category == "5") && !(43 in this.$parent.selected.course[this.$parent.c3Category + sub][this.$parent.selected.styleTarget].option_id)) {
                // // console.log('エアーフィットがついとるのに型紙は対応してない');
                alert('エアーフィットに対応していない型紙なので、エアーフィットを解除します。');
                Vue.set(this.$parent.selected.sessions.ordersheet, 'air_fit', null);
            }
            // this.$parent.optionReseter();

            // console.log('kitagami_clicker', this.$parent.c3Category, sub, pattern_nums);

            if (this.$parent.c3Category == "1" || this.$parent.c3Category == "5") {
                Vue.set(this.$parent.selected.sessions.ordersheet, "jacket_dno", pattern_nums);
                //firstcheckersを設定しなおす
                if (this.$parent.firstCheckers.ResetedFlg == false || this.$parent.tantouFlg == true) {
                    Vue.set(this.$parent.firstCheckers, "jacket_dno", pattern_nums);
                }

                Vue.set(this.$parent.selected.sessions.ordersheet, "jacket_dno", pattern_nums);
            } else if ((this.$parent.c3Category == "3" && sub == "") || (this.$parent.c3Category == "6" && sub == "")) {
                Vue.set(this.$parent.selected.sessions.ordersheet, "slacks_dno1", pattern_nums);
            } else if ((this.$parent.c3Category == "3" && sub == "pants2") || (this.$parent.c3Category == "6" && sub == "pants2")) {
                Vue.set(this.$parent.selected.sessions.ordersheet, "slacks_dno2", pattern_nums);
            } else if (this.$parent.c3Category == "2") {
                Vue.set(this.$parent.selected.sessions.ordersheet, "best_dno", pattern_nums);
            }
            else if (this.$parent.c3Category == "7" && sub == "") {
                Vue.set(this.$parent.selected.sessions.ordersheet, "wo_sk_d1", pattern_nums);
            } else if (this.$parent.c3Category == "7" && sub == "skirt2") {
                Vue.set(this.$parent.selected.sessions.ordersheet, "wo_sk_d2", pattern_nums);
            }

            Vue.set(this.$parent, "selectedKatagamiId", pattern_ids);
            var thista = this;
            Vue.nextTick(function () {
                if (thista.$parent.c3Category != 2) {
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
                    if (selectedCourse.gb == "1") {
                        thista.$parent.selected.gb = true;
                        if (thista.$parent.firstCheckers.ResetedFlg == false || thista.$parent.tantouFlg == true) {
                            Vue.set(thista.$parent.firstCheckers, "gb", true);
                        }
                    } else {
                        thista.$parent.selected.gb = false;
                        Vue.set(thista.$parent.firstCheckers, "gb", false);
                    }
                }
            });

            if (this.$parent.c3Category == 1 || this.$parent.c3Category == 5) {
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
        }
    },
    mounted: function () {
        const query = {
            headers: {
                "content-Type": "application/json;charset=UTF-8",
            },
            params: {
                gender: this.$parent.selected.sessions.ordersheet.sex,
                pattern_id: this.$parent.selectedKatagamiId,
            },
        };
        var thista = this;
        axios.get("/ajaxTool/getKatagamiSize.php", query).then((res) => {
            // // console.log("サイズデータロードOK");
            // thista.sizeData = res.data;
            Vue.set(thista, "sizeData", res.data);
            thista.sizeDataLoad = true;

            // // console.log('-----------------------------------');
            // // console.log(
            //     "SIZE_DATA",
            //     this.$parent.selectedKatagamiId,
            //     JSON.parse(JSON.stringify(thista.sizeData))
            // );
            // // console.log("SIZE_DATA_LIST",JSON.parse(JSON.stringify(thista.sizeData.data.size)))
            // // console.log(this.targetGender, this.targetCategory);
            // // console.log(this.$parent.designSelectedParams);

            // // console.log('-----------------------------------');

            //データが無い列は表示を消す
            // setTimeout(function () {
            //     //// console.log('データが無いカラムを非表示');
            //     $(".dataline").each(function (key, item) {
            //         var checkstring = "";
            //         $(item)
            //             .find(".dataline__checker")
            //             .each(function (key2, item2) {
            //                 checkstring = checkstring + $(item2).find("span").html();
            //             });
            //         if (checkstring == "") {
            //             $(item).hide();
            //         }
            //     });
            // }, 0);
        });
    },
};
</script>
