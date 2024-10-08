import "./normalize.css";
import "./reset.css";
import "./animation.css";
import "./styles.css";

import axios from "axios"; //外部
import Vue from "vue"; //外部
import LoginApiData from "./model/LoginApiData.js";
import $ from "jquery"; //外部
import _ from 'lodash'
import indexVue from "./vue/index.vue";
import gender from "./vue/gender.vue";
import stepActions from "./vue/step_actions.vue";
import itemlist from "./vue/itemlist.vue";
import itemlistSelectparts from "./vue/itemlist_selectparts.vue";
import itemlistSelectpartsDesign from "./vue/itemlist_selectparts_design.vue";
import itemlistSelectpartsButton from "./vue/itemlist_selectparts_button.vue";
import itemlistSelectpartsFabric from "./vue/itemlist_selectparts_fabric.vue";
import itemlistSelectpartsOption from "./vue/itemlist_selectparts_option.vue";
import headStep from "./vue/head_step.vue";
import totalPrice from "./vue/total_price.vue";
import imageViewVue from "./vue/imageview.vue";
import rightUtil from "./vue/right_util.vue";
import controller from "./vue/controller.vue";
import staffstart from "./vue/staff_start.vue";
import selectedWindow from "./vue/selectedwindow.vue";
import reservationModal from "./vue/modal/reservation_modal.vue";
import emailModal from "./vue/modal/email_modal.vue";
import optionModal from "./vue/modal/option_modal.vue";
import optionsetModal from "./vue/modal/optionset_modal.vue";
import sortModal from "./vue/modal/sort_modal.vue";
import productInfoModal from "./vue/modal/productInfo_modal.vue";
import productSelectModal from "./vue/modal/productSelect_modal.vue";
import imageAndVideoModal from "./vue/modal/imageAndVideo_modal.vue";
import katagamiInfoModal from "./vue/modal/katagami_info_modal.vue";
import size from "./vue/size.vue";
import sizeSelectModal from "./vue/modal/sizeSelect_modal.vue";
import confirm from "./vue/confirm.vue";
import loadinger from "./vue/loadinger.vue";
import finalStaff from "./vue/final_staff.vue";
import preloader from "./vue/preloader.vue";
import VueLazyComponent from '@xunlei/vue-lazy-component'
Vue.filter('pricer', function (value) {
    return parseInt(value).toLocaleString();
});
//// console.log('a');
var lads = new LoginApiData();
Vue.filter('addComma', function (val) {
    return val.toLocaleString();
});

//四捨五入
Vue.filter('round', function (val) {
    val = val * 10;
    return Math.round(val) / 10;
});
// 商品読み込み
const query = {
    headers: {
        "content-Type": "application/json;charset=UTF-8"
    }
};
var itemdatas;


function getParam(key) {
    let currentURL = window.location.href;
    let url = new URL(currentURL);
    let params = new URLSearchParams(url.search);
    // // console.log('GENDER:::::::::::', params.get(key));
    return params.get(key) || null;
}

axios.get("/sandbox/ajaxTool/getMasters.php", query).then(res => {
    var data = res.data;
    app.masters = data;
    sessionGetter();
    // // console.log('マスター');
    // // console.log(res.data);
    // app.testSetter();
    // // console.log(data);
});
function sessionGetter() {
    axios.get("/sandbox/ajaxTool/getItems.php", query).then(res => {
        var data = res.data;
        itemdatas = res.data;
        //ステータスっぽいのいらんので削除
        delete res.data.productStatus;
        app.productNarabi = res.data.narabi;
        delete res.data.narabi;
        app.productData = res.data;
        app.dataload = true;

        // // console.log('getItems.php', JSON.parse(JSON.stringify(app.productData)));
        // // console.log('app.productNarabi', JSON.parse(JSON.stringify(app.productNarabi)));
        var gets = getUrlVars();
        if (gets["guest"] == 1) {
            app.guest = true;
        }
        if (gets["debug"] == 1) {
            app.debug = true;
        }
        var paramser = {};
        $.each(gets, function (key, item) {
            paramser[item] = gets[item];
        });
        ////// console.log('paramser');
        // // console.log('GETS_BEFORE', gets);
        const query = {
            headers: {
                "content-Type": "application/json;charset=UTF-8"
            },
            params: {
                gets: paramser,
            }
        };
        axios.get("/sandbox/ajaxTool/getSession.php", query).then(res => {
            if (res.data.ordersheet.cloth_no == null || res.data.ordersheet.cloth_no == '') {
                app.optionInit();
            }
            var data = res.data;
            // // console.log('getSession.php', JSON.parse(JSON.stringify(data)));
            app.sessions = data;
            app.defaultSessions = data;
            app.selected.sessions = data;






            // if(app.selected.sessions.base.customize_store == "" || app.selected.sessions.base.customize_store == null){
            //   app.tantouFlg = false;
            // }
            // // console.log("セッション読み込みOK");
            // // console.log(app.selected.sessions);
            if (res.data.base.customize_store != "" && res.data.base.customize_store != null) {
                app.tantouFlg = true;
                if (getUrlVars()['tantoukill'] == 1) {
                    app.tantouFlg = false;
                }
                ////// console.log("店舗担当の方");
            } else {
                app.tantouFlg = false;
                app.stepLimit = 6;
                ////// console.log("一般のお客様");
            }
            if ((app.selected.sessions.ordersheet.jacket_dno == null || app.selected.sessions.ordersheet.jacket_dno == '') && (app.selected.sessions.ordersheet.slacks_dno1 == null || app.selected.sessions.ordersheet.slacks_dno1 == '') && (app.selected.sessions.ordersheet.best_dno == null || app.selected.sessions.ordersheet.best_dno == '') && (app.selected.sessions.ordersheet.wo_sk_d1 == null || app.selected.sessions.ordersheet.wo_sk_d1 == '')) {
                app.sinki = true;
            }


            ////// console.log("スーティスト店舗かをチェック");
            ////// console.log(res.data.base.customize_store);
            $.each(app.masters.suitist, function (key, item) {
                if (item.shop_id == res.data.base.customize_store) {
                    //// console.log("スーティスト店舗です");
                    Vue.set(app.selected, "suitist", true);
                    return false;
                } else {
                    //// console.log('スーティストではない');
                }
            });

            const paramGender = getParam('gender');
            if (paramGender) {
                app.selected.gender = paramGender;
                Vue.set(app.selected.sessions.ordersheet, "sex", paramGender == "men" ? 1 : 2);
            } else {
                ////// console.log("セッションのデータからシミュレーターを再構築します");
                if (res.data.ordersheet.sex == 1 || res.data.ordersheet.sex == null) {
                    app.selected.gender = "men";
                    ////// console.log("session:性別:男性");
                    Vue.set(app.selected.sessions.ordersheet, "sex", 1);
                } else if (res.data.ordersheet.sex == 2) {
                    app.selected.gender = "women";
                    ////// console.log("session:性別:女性");
                } else {
                    app.selected.gender = "men";
                    ////// console.log("session:性別が未選択なので男性にします");
                }
            }

            //01部分


            var targetProductId = "";
            // axios.get("/ajaxTool/getItems.php", query).then(res => {
            //     var data2 = itemdatas;
            //     //// console.log('プロダクトデータ一覧');
            //     //// console.log(data2);
            //     //ステータスっぽいのいらんので削除
            //     delete data2.productStatus;
            //     app.productNarabi = data2.narabi;
            // delete data2.narabi;
            //     app.productData = data2;
            if (res.data.ordersheet.cloth_no != "") {
                $.each(app.productData, function (key, item) {
                    if (data.ordersheet.cloth_no == item.product_code_min) {
                        targetProductId = item.product_id;
                    }
                });
                var pocketer = 0;


                //オプションリセット判断のため登録↓
                Vue.set(app.firstCheckers, 'factory', app.selected.sessions.base.customer_code);
                if (app.selected.sessions.ordersheet.washable != '' && app.selected.sessions.ordersheet.washable != null) {
                    Vue.set(app.firstCheckers, 'washable', true);
                }
                if (app.selected.sessions.ordersheet.daiba == 1 || app.selected.sessions.ordersheet.daiba == "1") {
                    Vue.set(app.firstCheckers, 'daiba', true);
                }
                if (app.selected.sessions.ordersheet.w_adjuster1 == 1 || app.selected.sessions.ordersheet.w_adjuster1 == '1') {
                    Vue.set(app.firstCheckers, 'w_adjuster', true);
                }
                if (app.selected.sessions.ordersheet.cloth_no != '' && app.selected.sessions.ordersheet.cloth_no != null) {
                    Vue.set(app.firstCheckers, 'cloth_no', app.selected.sessions.ordersheet.cloth_no);
                    if (app.renzoku != true && app.guest != true && app.step == 0) {
                        Vue.set(app, 'staffstartFlg', true);
                    }

                }
                if (app.selected.sessions.ordersheet.jacket_dno != '' && app.selected.sessions.ordersheet.jacket_dno != null) {
                    Vue.set(app.firstCheckers, 'jacket_dno', app.selected.sessions.ordersheet.jacket_dno);
                }

                //チェックしなくて良い場合
                if (app.selected.sessions.ordersheet.cloth_no == '' || app.selected.sessions.ordersheet.cloth_no == null) {
                    Vue.set(app.firstCheckers, 'ResetedFlg', true);
                }

                //セットされている型紙にGBのやつがあるかチェックする
                app.isGBChecker();
                //型紙に登録されている工場を取得
                app.isKataFacChecker();
                // //// console.log(data.base);
                // //// console.log('初期状態取得結果');
                // //// console.log(app.firstCheckers);
                Vue.set(app, 'loading', false);

                if (targetProductId != "") {
                    //// console.log('ここはとおってる');
                    //オプションリセット判断のため登録↓
                    Vue.set(app.firstCheckers, 'factory', app.productData[targetProductId]['factory']);


                    if ((Math.floor(app.productData[targetProductId].stock_min / app.stocktani.all) > 0) || app.productData[targetProductId].stock_unlimited_max == 1) {
                        Vue.set(app, "selectedProductData", app.productData[targetProductId]);
                        //↓を有効にすると前寸で生地がある場合勝手にセットされる
                        // Vue.set(app.selected,"fabric",targetProductId);
                        if (app.selected.suitist) {
                            //// console.log("スーティスト店舗です");
                            Vue.set(app.selected, "suitist", true);
                            // return false;
                        } else {
                            //// console.log('スーティスト店舗ではない');
                            if (app.productData[targetProductId]['kiji_disp'].indexOf("3") > -1 || app.productData[targetProductId]['kiji_disp'].indexOf("1") > -1) { } else {
                                //// console.log('スーティストではないんでスーティスト専用ファブリック空にします');
                                Vue.set(app.selected, "fabric", "");
                            }
                            // Vue.set(app.selected,"fabric","");
                        }
                        if (app.selected.suitist) {
                            Vue.set(app.selected.code, "line", app.masters.line[app.selectedProductData["suitistline"]]["line_code"]);
                        } else {
                            if (app.selected.gender == 'men') {
                                Vue.set(app.selected.code, "line", app.masters.line[app.selectedProductData["mensline"]]["line_code"]);
                            } else {
                                Vue.set(app.selected.code, "line", app.masters.line[app.selectedProductData["ladiesline"]]["line_code"]);
                            }
                        }
                    } else {
                        alert('指定された生地の在庫がありませんでした。別の生地を選択してください。');
                    }
                    const query = {
                        headers: {
                            "content-Type": "application/json;charset=UTF-8"
                        },
                    };
                    var thista = this;
                    // //// console.log("パワーストレッチチェック");
                    if (app.selected.sessions.ordersheet["specification"] != "" && app.selected.sessions.ordersheet["specification"] != null) {
                        var power = parseInt(app.selected.sessions.ordersheet["specification"]);
                        if (power > 10) {
                            // //// console.log(power);
                            // //// console.log("パワーストレッチつかってる");
                            Vue.set(app.selected.sessions.ordersheet, "ext_specification_normal", power / 11);
                            Vue.set(app.selected.sessions.ordersheet, "ext_specification", 1);
                        } else if (power < 9) {
                            // //// console.log("パワーストレッチつかってない");
                            Vue.set(app.selected.sessions.ordersheet, "ext_specification_normal", power);
                            Vue.set(app.selected.sessions.ordersheet, "ext_specification", 0);
                        }
                    }
                    // //// console.log(app.selected.sessions.ordersheet);
                    ////// console.log("パッチポケットチェック");
                    if (app.selected.sessions.ordersheet["patch_pocket"] != "" && app.selected.sessions.ordersheet["patch_pocket"] != null) {
                        var power = parseInt(app.selected.sessions.ordersheet["patch_pocket"]);
                        if (power == 1) {
                            ////// console.log("パッチポケット使ってる");
                            Vue.set(app.selected.sessions.ordersheet, "customselect_pocket", 1);
                            pocketer = 1;
                        }
                    }
                    ////// console.log("チェンジポケットチェック");
                    if (app.selected.sessions.ordersheet["change_pocket"] != "" && app.selected.sessions.ordersheet["change_pocket"] != null) {
                        var power = parseInt(app.selected.sessions.ordersheet["change_pocket"]);
                        if (power == 1) {
                            ////// console.log("チェンジポケット使ってる");
                            Vue.set(app.selected.sessions.ordersheet, "customselect_pocket", 2);
                            pocketer = 1;
                        }
                    }

                    // //// console.log("カラー使用チェック：切羽配色");
                    if (app.selected.sessions.ordersheet["seppa_hall"] != "" && app.selected.sessions.ordersheet["seppa_hall"] != null) {
                        if (app.selected.sessions.ordersheet["seppa_hall"] != "00" && app.selected.sessions.ordersheet["seppa_hall"] != "200") {
                            // //// console.log("切羽配色は有料のカラーを使っている");
                            Vue.set(app.selected.sessions.ordersheet, "colorcustoms_seppa_hall", app.selected.sessions.ordersheet["seppa_hall"]);
                            Vue.set(app.selected.sessions.ordersheet, "colorcustoms_seppa_hall_normal", "999999");
                        } else {
                            Vue.set(app.selected.sessions.ordersheet, "colorcustoms_seppa_hall_normal", "00");
                            // //// console.log("切羽配色は無料");
                        }
                    }
                    ////// console.log("有料使用チェック：女性ボタン");
                    if (app.selected.sessions.ordersheet["sex"] == 2 && (app.selected.sessions.ordersheet["button_cno"] == '61' || app.selected.sessions.ordersheet["button_cno"] == '67' || app.selected.sessions.ordersheet["button_cno"] == '69')) {
                        ////// console.log("女性ボタンは有料のもの");
                        Vue.set(app.selected.sessions.ordersheet, "colorcustoms_button_cno", app.selected.sessions.ordersheet["button_cno"]);
                    } else {
                        ////// console.log('女性ボタンは無料か設定なし');
                    }
                    ////// console.log("カラー使用チェック：カラークロス");
                    if (app.selected.sessions.ordersheet["color_cross"] != "" && app.selected.sessions.ordersheet["color_cross"] != null) {
                        if (app.selected.sessions.ordersheet["color_cross"] != "00" && app.selected.sessions.ordersheet["color_cross"] != "200") {
                            ////// console.log("カラークロスは有料のカラーを使っている");
                            Vue.set(app.selected.sessions.ordersheet, "colorcustoms_color_cross", app.selected.sessions.ordersheet["color_cross"]);
                            Vue.set(app.selected.sessions.ordersheet, "colorcustoms_color_cross_normal", "999999");
                        } else {
                            ////// console.log("カラークロスは無料");
                        }
                    }
                    //// console.log("カラー使用チェック：dp裏地");
                    if (app.selected.sessions.ordersheet["ura_cno"] != "" && app.selected.sessions.ordersheet["ura_cno"] != null) {
                        if (parseInt(app.selected.sessions.ordersheet["ura_cno"]) > 300) {
                            //// console.log("dp裏地は有料のカラーを使っている");
                            Vue.set(app.selected.sessions.ordersheet, "colorcustoms_ura_cno", app.selected.sessions.ordersheet["ura_cno"]);
                        } else {
                            //// console.log("裏地は無料");
                            Vue.set(app.selected.sessions.ordersheet, "colorcustoms_ura_cno_normal", app.selected.sessions.ordersheet["ura_cno"])
                        }
                    } else {

                    }
                    ////// console.log("カラー使用チェック：フラワーホール");
                    if (app.selected.sessions.ordersheet["flower_hall"] != "" && app.selected.sessions.ordersheet["flower_hall"] != null) {
                        if (app.selected.sessions.ordersheet["flower_hall"] != "00" && app.selected.sessions.ordersheet["flower_hall"] != "200") {
                            ////// console.log("フラワーホールは有料のカラーを使っている");
                            Vue.set(app.selected.sessions.ordersheet, "colorcustoms_flower_hall", app.selected.sessions.ordersheet["flower_hall"]);
                            Vue.set(app.selected.sessions.ordersheet, "colorcustoms_flower_hall_normal", "999999");
                        } else {
                            Vue.set(app.selected.sessions.ordersheet, "colorcustoms_flower_hall_normal", app.selected.sessions.ordersheet["flower_hall"]);
                            ////// console.log("フラワーホールは無料");
                        }
                    }
                    ////// console.log("カラー使用チェック：amfステッチ");
                    if (app.selected.sessions.ordersheet["amf_stitch"] != "" && app.selected.sessions.ordersheet["amf_stitch"] != null) {
                        if (app.selected.sessions.ordersheet["amf_stitch"] != "0") {
                            ////// console.log("amfステッチは有料のカラーを使っている");
                            Vue.set(app.selected.sessions.ordersheet, "colorcustoms_amf_stitch", Math.floor(parseFloat(app.selected.sessions.ordersheet["amf_stitch"])));
                            if (String(app.selected.sessions.ordersheet["amf_stitch"]).indexOf('.2') > -1) {
                                Vue.set(app.selected.sessions.ordersheet, "colorcustoms_amf_stitch_normal", "0.2");
                            } else if (String(app.selected.sessions.ordersheet["amf_stitch"]).indexOf('.7') > -1) {
                                Vue.set(app.selected.sessions.ordersheet, "colorcustoms_amf_stitch_normal", "0.7");
                            }
                        } else {
                            ////// console.log("amfステッチは無料");
                        }
                    }


                    app.optionInit();
                    app.getSelectedOption();
                }
                // //// console.log(pocketer);
                if (pocketer == 0) {
                    //ポケット選択なければ０
                    Vue.set(app.selected.sessions.ordersheet, "customselect_pocket", "0");
                }
                //オプションコースを割り出すやつ
                setTimeout(function () {
                    app.getOptionsHazime(app.selectedProductData.type, app.selected.gender);
                }, 500);

                // this.$parent.selected.code.line = this.$parent.masters.line[this.$parent.selectedProductData["suitistline"]]["line_code"];
                // });

            }
            ////// console.log('後継機チェック前一応チェック');
            ////// console.log(app.selected.course);
            //02部分

            // エアーフィットがついてたらjacket_dnoからAを取る
            ////// console.log('エアーフィットチェック');
            if (app.selected.sessions.ordersheet['air_fit'] == 1 || app.selected.sessions.ordersheet['air_fit'] == '1') {
                ////// console.log('エアーフィットなのでA取ります');
                if (app.selected.sessions.ordersheet.jacket_dno != '' && app.selected.sessions.ordersheet.jacket_dno != null) {
                    var jacketer = app.selected.sessions.ordersheet.jacket_dno.slice(0, -1);
                    Vue.set(app.selected.sessions.ordersheet, 'jacket_dno', jacketer);
                }
            }

            if (res.data.ordersheet.course_combi != "") {
                var masterNo = res.data.ordersheet.course_combi;
                $.each(app.selectparts[app.selected.gender], function (key, item) {
                    if (item.masterNo == masterNo) {
                        ////// console.log("session:step02部分を反映");
                        app.partsChangers(key);
                    }
                })
            }
            // // console.log('GETS_AFTER', gets);
            //03部分
            if ('st1' in gets) {
                Vue.set(app.selected.course["1"], gets['st1'], {});
            }
            if ('st2' in gets) {
                Vue.set(app.selected.course["2"], gets['st2'], {});
            }
            if ('st3' in gets) {
                Vue.set(app.selected.course["3"], gets['st3'], {});
            }
            if ('st3pants2' in gets) {
                Vue.set(app.selected.course["3pants2"], gets['st3pants2'], {});
            }
            if ('st5' in gets) {
                Vue.set(app.selected.course["5"], gets['st5'], {});
            }
            if ('st6' in gets) {
                Vue.set(app.selected.course["6"], gets['st6'], {});
            }
            if ('st6pants2' in gets) {
                Vue.set(app.selected.course["6pants2"], gets['st6pants2'], {});
            }
            if ('st7' in gets) {
                Vue.set(app.selected.course["7"], gets['st7'], {});
            }
            if ('st7skirt2' in gets) {
                Vue.set(app.selected.course["7skirt2"], gets['st7skirt2'], {});
            }
            if (app.selected.sessions.ordersheet.jacket_dno || app.selected.sessions.ordersheet.slacks_dno1 || app.selected.sessions.ordersheet.best_dno || app.selected.sessions.ordersheet.wo_sk_d1) {
                $.each(app.masters.style, function (key, item) {
                    $.each(item.katagami_pattern, function (key2, item2) {
                        if ("jacket_dno" in app.selected.sessions.ordersheet) {
                            if (item2.pattern_num == app.selected.sessions.ordersheet.jacket_dno) {
                                ////// console.log('選択されている型紙の期限');
                                app.katagamiKoukeiChecker(item2, 'jacket_dno', 'ジャケット').then((katagami) => {
                                    ////// console.log('後継機チェックの後の型紙 jacket');
                                    ////// console.log(key);
                                    ////// console.log(katagami);
                                    if (app.selected.gender == 'men') {
                                        ////// console.log('後継機を実際セットするとこ');
                                        ////// console.log(key);
                                        Vue.set(app.selected.course["1"], key, {});
                                        app.selected.course["1"][key] = katagami;
                                        Vue.set(app.selected.katagami["1"], key2, katagami);
                                    } else {
                                        Vue.set(app.selected.course["5"], key, {});
                                        Vue.set(app.selected.katagami["5"], key2, katagami);
                                        app.selected.course["5"][key] = katagami;
                                    }
                                    ////// console.log(app.selected.course);
                                });
                            }
                        }
                        if ("slacks_dno1" in res.data.ordersheet) {
                            if (item2.pattern_num == res.data.ordersheet.slacks_dno1) {
                                app.katagamiKoukeiChecker(item2, 'slacks_dno1', 'スラックス１枚目').then((katagami) => {
                                    ////// console.log('後継機チェックの後の型紙 slacks_dno1');
                                    ////// console.log(katagami);
                                    if (app.selected.gender == 'men') {
                                        Vue.set(app.selected.course["3"], key, {});
                                        app.selected.course["3"][key] = katagami;
                                        Vue.set(app.selected.katagami["3"], key2, katagami);
                                    } else {
                                        Vue.set(app.selected.course["6"], key, {});
                                        app.selected.course["6"][key] = katagami;
                                        Vue.set(app.selected.katagami["6"], key2, katagami);
                                    }
                                });
                            }
                        }
                        if ("slacks_dno2" in res.data.ordersheet) {
                            if (item2.pattern_num == res.data.ordersheet.slacks_dno2) {
                                app.katagamiKoukeiChecker(item2, 'slacks_dno2', 'スラックス２枚目').then((katagami) => {
                                    ////// console.log('後継機チェックの後の型紙 slacks_dno2');
                                    ////// console.log(katagami);
                                    if (app.selected.gender == 'men') {
                                        Vue.set(app.selected.course["3pants2"], key, {});
                                        app.selected.course["3pants2"][key] = katagami;
                                        Vue.set(app.selected.katagami["3pants2"], key2, katagami);
                                    } else {
                                        Vue.set(app.selected.course["6pants2"], key, {});
                                        app.selected.course["6pants2"][key] = katagami;
                                        Vue.set(app.selected.katagami["6pants2"], key2, katagami);
                                    }
                                });
                            }
                        }
                        if ("best_dno" in res.data.ordersheet) {
                            if (item2.pattern_num == res.data.ordersheet.best_dno) {
                                app.katagamiKoukeiChecker(item2, 'best_dno', 'ベスト').then((katagami) => {
                                    ////// console.log('後継機チェックの後の型紙 best_dno');
                                    ////// console.log(katagami);
                                    Vue.set(app.selected.course["2"], key, {});
                                    app.selected.course["2"][key] = katagami;
                                    Vue.set(app.selected.katagami["2"], key2, katagami);
                                });
                            }
                        }
                        if ("wo_sk_d1" in res.data.ordersheet) {
                            if (item2.pattern_num == res.data.ordersheet.wo_sk_d1) {
                                app.katagamiKoukeiChecker(item2, 'wo_sk_d1', 'スカート１枚目').then((katagami) => {
                                    ////// console.log('後継機チェックの後の型紙 wo_sk_d1');
                                    ////// console.log(katagami);
                                    Vue.set(app.selected.course["7"], key, {});
                                    app.selected.course["7"][key] = katagami;
                                    Vue.set(app.selected.katagami["7"], key2, katagami);
                                });
                            }
                        }
                        if ("wo_sk_d2" in res.data.ordersheet) {
                            if (item2.pattern_num == res.data.ordersheet.wo_sk_d2) {
                                app.katagamiKoukeiChecker(item2, 'wo_sk_d2', 'スカート２枚目').then((katagami) => {
                                    ////// console.log('後継機チェックの後の型紙 wo_sk_d2');
                                    ////// console.log(katagami);
                                    Vue.set(app.selected.course["7skirt2"], key, {});
                                    app.selected.course["7skirt2"][key] = katagami;
                                    Vue.set(app.selected.katagami["7skirt2"], key2, katagami);
                                });
                            }
                        }
                    });
                });
            }
            ////// console.log('app.selected.course');
            ////// console.log(app.selected.course);
            //サイズ部分
            var targetJunle = [];
            Vue.set(app.size, "adj", {});
            if (app.selected.sessions.ordersheet.jacket_dno != "" && app.selected.sessions.ordersheet.jacket_dno != null) {
                app.setSizer(1, app, "jacket", 1);
            }
            if (app.selected.sessions.ordersheet.best_dno != "") {
                //ベスト
                targetJunle.push("2");
                app.setSizer(2, app, "vest", 1);
            }
            if (app.selected.sessions.ordersheet.slacks_dno1 != "" && app.selected.sessions.ordersheet.slacks_dno1 != null) {
                //パンツ
                app.setSizer(3, app, "pants", 1);
            }
            if (app.selected.sessions.ordersheet.slacks_dno2 != "" && app.selected.sessions.ordersheet.slacks_dno2 != null) {
                //パンツ
                app.setSizer(3, app, "pants2", 2);
            }
            if (app.selected.sessions.ordersheet.wo_sk_d1 != "" && app.selected.sessions.ordersheet.wo_sk_d1 != null) {
                //スカート
                app.setSizer(4, app, "skirt", 1);
            }
            if (app.selected.sessions.ordersheet.wo_sk_d2 != "" && app.selected.sessions.ordersheet.wo_sk_d2 != null) {
                //スカート
                app.setSizer(4, app, "skirt2", 2);
            }

            if (app.selected.sessions.ordersheet.wo_sk_d1 != "" || app.selected.sessions.ordersheet.wo_sk_d2 != "") {
                targetJunle.push("4");
            }

            app.sessionDataLoadFlg = true;
            app.texChanger();
        });
    });
};
var app = new Vue({
    el: "#app",
    data: {
        //オプションモーダルで照合用に使うオプションデータ
        optionData: {},
        //注文を追加するでリロードした後
        renzoku: false,
        productNarabi: '',
        //オーダーシートの仕分け
        //フルホール仕様は無視でOK
        optionZentai: ['jacket', 'pants', 'pants2', 'vest', 'skirt', 'skirt2'],
        optionsShiwake: {
            jacket: [
                'sh_eri',
                'jacket_dno',
                'jacket_size',
                'jacket_model',
                'kitake',
                'sodetake_left',
                'sodetake_right',
                'ura_cno',
                'button_cno',
                'bento',
                'specification',
                'amf_stitch',
                'change_pocket',
                'sode_honseppa',
                'patch_pocket',
                'barca_pocket',
                'dcan',
                'waist',
                'enter_name',
                'style_name',
                'backlining',
                'yukitake_left',
                'yukitake_right',
                'digital_name',
                'daiba',
                'seppa_hall',
                'flower_hall',
                'color_cross',
                'air_fit',
                'ja_shoulder',
                'side_pat',
                'colorcustoms_amf_stitch_normal',
                'colorcustoms_amf_stitch',
                'colorcustoms_button_cno',
                'colorcustoms_color_cross_normal',
                'colorcustoms_color_cross',
                'colorcustoms_flower_hall_normal',
                'colorcustoms_flower_hall',
                'colorcustoms_seppa_hall',
                'colorcustoms_seppa_hall_normal',
                'colorcustoms_ura_cno',
                'colorcustoms_ura_cno_normal',
                'ext_specification',
                'ext_specification_normal',
                'customselect_pocket',
            ],
            pants: [
                'slacks_dno1',
                'slacks_size1',
                'waist_1',
                'kuchi_width_1',
                'crotch_main1',
                'crotch_right1',
                'mackin_width1',
                'suso_d1',
                'take1',
                'w_adjuster1',
                'slacks_yobi11',
                'slacks_yobi12',
                'safeguard_p1',
                'watarihaba1',
                'susohaba1',
                // ジャケットにもパンツにもあるとせれくてっどオプションではじかれる可能性がある
                // 'ext_specification',
                // ジャケットにもパンツにもあるとせれくてっどオプションではじかれる可能性がある
                // 'ext_specification_normal',

            ],
            pants2: [
                'slacks_dno2',
                'slacks_size2',
                'slacks_model2',
                'waist_2',
                'kuchi_width_2',
                'crotch_main2',
                'crotch_right2',
                'mackin_width2',
                'suso_d2',
                'take2',
                'w_adjuster2',
                'slacks_yobi21',
                'slacks_yobi22',
                'safeguard_p2',
                'watarihaba2',
                'susohaba2',
            ],
            vest: [
                'best_dno',
                'best_size',
                'best_model',
                'bestsetake',
                'best_yobi1',
                'best_yobi2',
                'best_yobi3',
            ],
            skirt: [
                'wo_waist_1',
                'wo_skirt_1',
                'wo_sk_d1',
                'wo_sk_model1',
                'wo_sk_size1',
                'safeguard_s1',
            ],
            skirt2: [
                'wo_waist_2',
                'wo_skirt_2',
                'wo_sk_d2',
                'wo_sk_model2',
                'wo_sk_size2',
                'safeguard_s2',
            ]
        },
        //型紙番号とかはぶいたオプションだけのやつ
        optionsShiwakeOptiondake: {
            jacket: [
                'sh_eri',
                'ura_cno',
                'button_cno',
                'bento',
                'specification',
                'amf_stitch',
                'change_pocket',
                'sode_honseppa',
                'patch_pocket',
                'barca_pocket',
                'dcan',
                'enter_name',
                'style_name',
                'backlining',
                'digital_name',
                'daiba',
                'seppa_hall',
                'flower_hall',
                'color_cross',
                'air_fit',
                'side_pat',
                'colorcustoms_amf_stitch_normal',
                'colorcustoms_amf_stitch',
                'colorcustoms_button_cno',
                'colorcustoms_color_cross_normal',
                'colorcustoms_color_cross',
                'colorcustoms_flower_hall_normal',
                'colorcustoms_flower_hall',
                'colorcustoms_seppa_hall',
                'colorcustoms_seppa_hall_normal',
                'colorcustoms_ura_cno',
                'colorcustoms_ura_cno_normal',
                'ext_specification',
                'ext_specification_normal',
                'customselect_pocket',

            ],
            vest: [],
            pants: [
                'w_adjuster1',
                'safeguard_p1',
                'mackin_width1',
                'suso_d1',
                // 'ext_specification',
                // 'ext_specification_normal',

            ],
            pants2: [

                'w_adjuster2',
                'mackin_width2',
                'safeguard_p2',
                'suso_d2',

            ],

            skirt: [

                'safeguard_s1',
            ],
            skirt2: [

                'safeguard_s2',
            ]
        },
        //絶対に選択せなあかんやつがあるときのロック
        clickLocker: false,
        //シミュレータで表示する箇所
        view: '_all',
        view2: '',
        //同時に購入するものチェック用
        douziChecker: [],
        //見るだけで買えない人フラグ
        guest: false,
        sessionDataLoadFlg: false,
        //ローディングが重なりなにも押せなくする
        loading: false,
        //シミュレータのローディング
        texLoadingFlg: false,
        defaultSessions: {},
        token: window.token,
        // 店舗のスタッフ用セーブ格納
        saveData: [],
        //03にてパンツ２、スカート２の時値が入る。サイズ選択モーダル時での判別用
        sub: "",
        //店舗で前寸ありの場合の最初画面出すか
        staffstartFlg: false,
        //各種確認用の表示が出る
        debug: false,
        selectImageDisp: "jacket",
        step: (getParam('gender') || (getParam('guest') == 1 && getParam('email') == 1)) ? 1 : 0,
        stepLimit: 7,
        productDataLoad: false,
        masterDataLoad: false,
        //インスタント的に使う、選択された型紙のID　サイズセレクト用
        selectedKatagamiId: "",
        //イメージ画像のSVG
        model: "sample",
        //店舗担当の方かフラグ
        tantouFlg: true,
        sinki: false,
        //モーダル切り替え
        kakuhoFlg: false,
        emailModalFlg: false,
        optionModalFlg: false,
        optionsetModalFlg: false,
        sizeSelectModalFlg: false,
        imageAndVideoModalFlg: false,
        productInfoFlg: false,
        katagamiInfoFlg: false,
        //生地選択するときのモーダル
        productSelectFlg: false,
        //インフォで表示するアイテムのプロダクトID
        productInfoTarget: "",
        //型紙の説明テキストモーダル用
        katagamiInfoText: "",
        sortFlg: false,
        //イメージビデオモーダル
        ivModalType: "image",
        modalImage: "",
        modalVideo: "",
        //確保対象商品
        kakuhoTarget: {},
        lad: lads,

        productData: {},
        //選択されてるプロダクトデータ
        selectedProductData: {
            kiji_image: "",
            delivery: null,
        },
        //03 corse で選択されているカテゴリ
        c3Category: '',
        //option で選択されているカテゴリ
        optionC3Category: '',
        //3_allとかの　全体像ナンバーがなんなのか記憶する
        zentaiNo: '',
        //03 course で選択されているカテゴリの型紙に登録されている番号
        c3CategoryKatagami: '',
        c3Style: 1,
        //非同期でプロダクトデータ取ってくるの終わったか
        dataload: false,
        masters: {},
        uploadPass: "/sandbox/upload/save_image/",
        uploadPDFPass: '/sandbox/upload/',
        //セッション情報 初期状態　変更されるのはselectedの中
        sessions: {},
        defaultSelected: {},
        //オプションをリセットするのかどうかの判定につかう初期状態
        firstCheckers: {
            //リセットしたらこれをtrueにしてもうリセットしないようにする
            ResetedFlg: false,
            //jacket_dnoが　AJMCH-15　の場合はウォッシャブルがつかえないので調べる
            jacket_dno: '',

            cloth_no: '',
            cloth_image: '',
            //GBの場合もウォッシャブルがつかえないので調べる
            gb: false,
            //washable
            washable: false,
            //daiba
            daiba: false,
            //ウェストアジャスター
            w_adjuster: false,
            //factory(数字)
            factory: null,
            //型紙のファクトリー
            katafactory: "",
            //全リセットの場合これをtrueに
            allReseter: false,
            //ウェストアジャスターだけをリセットする場合はこれ
            waistReseterFlg: false,
            //お台場だけをリセットする場合
            daibaReseter: false
        },
        selected: {
            //オプションコースをトータルプライスの横に出すときに使う情報
            optionCourseDetails: {},
            //現状のオプションコースのプライス
            optionCoursePrice: null,
            //カテゴリ３のdisp状況画像反映につかう
            step3disp: 1,
            //カテゴリ３で選んだサブ
            c3sub: '',
            //optionカテゴリのサブ
            optionSub: '',
            // ワキタ工場フラグ
            //ワキタ工場の前寸があるユーザー（店舗じゃないユーザー）は、ワキタ工場の生地しか出さない
            //ワキタ工場以外の前寸があるユーザー（店舗じゃないユーザー）は、ワキタ工場以外の生地しか出さない
            wakitaFlg: false,
            //選択されているオプション一覧
            selectedOptions: {},
            //03で選択された親スタイル
            targetCourseData: {},
            //03で選択されたスタイル２
            styleTarget: 1,
            //店舗確保生地ならオーダーIDが入る
            kakuhokizi: "",
            //実際に使う長さ
            quantity: 0,
            //基本サイズとどれだけ変更したかを入れる予定
            size: {
                jacket: {},
                pants: {},
                pants2: {},
                vest: {},
                skirt: {},
                skirt2: {},
            },

            //セッション情報　カスタマイズされる
            sessions: {},
            // ジャンコード、およびそれを特定するためのコード群
            code: {
                //productSelectmodalで決めてる
                line: "",
                course: "",
                optionSonota: "",
                optionCourse: "",
                result: {},
            },
            //gbフラグ
            gb: false,
            //スーティスト店舗か
            //スーティストの時は中国工場生地は出さない（id:4423）
            suitist: false,
            gender: "",
            fabric: "",
            //02 design で選択したものが入る
            parts: {},
            course: {
                // jacket
                "1": {},
                // pants
                "3": {},
                "3pants2": {},
                // vest
                "2": {},
                // womenjacket
                "5": {},
                // womenpants
                "6": {},
                "6pants2": {},
                // womenskirt
                "7": {},
                "7skirt2": {},
            },
            options: {},
            katagami: {
                // jacket
                "1": {},
                // pants
                "3": {},
                "3pants2": {},
                // vest
                "2": {},
                //
                "4": {},
                // womenjacket
                "5": {},
                // womenpants
                "6": {},
                "6pants2": {},
                // womenskirt
                "7": {},
                "7skirt2": {},
            },
        },
        size: {
            // dtb_katagamiのsizeカラム。女性は１固定
            baseNum: "",
            // dtb_katagamiのstyleカラム。
            targetNum: "",
            adj: {

            },
            //セッションのサイズ番号を解読する用 男性は　- をsplitでいけそうなんで省略
            ladysNums: {
                "3": 0,
                "5": 1,
                "7": 2,
                "9": 3,
                "11": 4,
                "13": 5,
                "15": 6,
                "17": 7,
                "19": 8,
                "21": 9,
                "23": 10,
            }
        },
        // その他オプションとジャンコード用NOをひもづける
        sonota: {
            // ウォッシャブル
            2001: "001",
            // プリーツ安定
            2002: "002",
            // お台場じたて
            2004: "006",
            // プリーツ安定・お台場じだて
            9999999999: "008"
        },
        selectparts: {
            men: {
                0: {
                    styleNo: 4,
                    en: "SUIT",
                    ja: "スーツ",
                    //jancode 特定用コード
                    code: "001",
                    masterNo: 11,
                    gbPrice: 10000,
                    masterValue: "上下",
                    img: "/sandbox/images/simulator/parts/parts_suit.png",
                    modalImage: "/sandbox/images/simulator/parts/parts_suit.png",
                    modalMovie: '<iframe width="560" height="315" src="https://www.youtube.com/embed/wgOZ5WrcFHo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
                    designParts: ["jacket", "pants"]
                },
                1: {
                    styleNo: 5,
                    en: "2 PANTS SUIT",
                    ja: "2パンツスーツ",
                    //jancode 特定用コード
                    code: "002",
                    masterNo: 12,
                    gbPrice: 14000,
                    masterValue: "上下下",
                    img: "/sandbox/images/simulator/parts/parts_2pants_suit.png",
                    modalImage: "/sandbox/images/simulator/parts/parts_suit.png",
                    modalMovie: '<iframe width="560" height="315" src="https://www.youtube.com/embed/wgOZ5WrcFHo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
                    designParts: ["jacket", "pants", "pants2"]
                },
                2: {
                    styleNo: 6,
                    en: "3 PIECE SUIT",
                    ja: "３ピーススーツ",
                    //jancode 特定用コード
                    code: "003",
                    masterNo: 13,
                    gbPrice: 12000,
                    masterValue: "上中下",
                    img: "/sandbox/images/simulator/parts/parts_3pants_suit.png",
                    modalImage: "/sandbox/images/simulator/parts/parts_suit.png",
                    modalMovie: '<iframe width="560" height="315" src="https://www.youtube.com/embed/wgOZ5WrcFHo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
                    designParts: ["jacket", "vest", "pants"]
                },
                3: {
                    styleNo: 1,
                    en: "JACKET",
                    ja: "ジャケット",
                    //jancode 特定用コード
                    code: "004",
                    masterNo: 14,
                    gbPrice: 6000,
                    masterValue: "上",
                    img: "/sandbox/images/simulator/parts/parts_jacket.png",
                    modalImage: "/sandbox/images/simulator/parts/parts_suit.png",
                    modalMovie: '<iframe width="560" height="315" src="https://www.youtube.com/embed/wgOZ5WrcFHo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
                    designParts: ["jacket"]
                },
                4: {
                    styleNo: 3,
                    en: "SLACKS",
                    ja: "スラックス",
                    //jancode 特定用コード
                    code: "006",
                    masterNo: 16,
                    gbPrice: 4000,
                    masterValue: "下",
                    img: "/sandbox/images/simulator/parts/parts_pants.png",
                    modalImage: "/sandbox/images/simulator/parts/parts_suit.png",
                    modalMovie: '<iframe width="560" height="315" src="https://www.youtube.com/embed/wgOZ5WrcFHo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
                    designParts: ["pants"]
                },
                5: {
                    styleNo: 2,
                    en: "VEST",
                    ja: "ベスト",
                    //jancode 特定用コード
                    code: "005",
                    masterNo: 15,
                    gbPrice: 2000,
                    masterValue: "中",
                    img: "/sandbox/images/simulator/parts/parts_vest.png",
                    modalImage: "/sandbox/images/simulator/parts/parts_suit.png",
                    modalMovie: '<iframe width="560" height="315" src="https://www.youtube.com/embed/wgOZ5WrcFHo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
                    designParts: ["vest"]
                },
            },
            women: {
                0: {
                    styleNo: 11,
                    en: "JACKET + SKIRT",
                    ja: "ジャケット + スカート",
                    //jancode 特定用コード
                    code: "011,013",
                    masterNo: 35,
                    gbPrice: 0,
                    masterValue: "JKSK",
                    img: "/sandbox/images/simulator/parts/parts_women_jacket_skirt.png",
                    modalImage: "/sandbox/images/simulator/parts/parts_suit.png",
                    modalMovie: '<iframe width="560" height="315" src="https://www.youtube.com/embed/wgOZ5WrcFHo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
                    designParts: ["jacket", "skirt"]
                },
                1: {
                    styleNo: 10,
                    en: "JACKET + SLACKS",
                    ja: "ジャケット + パンツ",
                    //jancode 特定用コード
                    code: "011,012",
                    masterNo: 34,
                    gbPrice: 0,
                    masterValue: "JKPT",
                    img: "/sandbox/images/simulator/parts/parts_women_jacket_pants.png",
                    modalImage: "/sandbox/images/simulator/parts/parts_suit.png",
                    modalMovie: '<iframe width="560" height="315" src="https://www.youtube.com/embed/wgOZ5WrcFHo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
                    designParts: ["jacket", "pants"]
                },
                2: {
                    styleNo: 15,
                    en: "JACKET + SLACKS + SKIRT",
                    ja: "ジャケット + パンツ + スカート",
                    //jancode 特定用コード
                    code: "011,012,013",
                    masterNo: 39,
                    gbPrice: 0,
                    masterValue: "JKPTSK",
                    img: "/sandbox/images/simulator/parts/parts_women_jacket_slacks_skirt.png",
                    modalImage: "/sandbox/images/simulator/parts/parts_suit.png",
                    modalMovie: '<iframe width="560" height="315" src="https://www.youtube.com/embed/wgOZ5WrcFHo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
                    designParts: ["jacket", "pants", "skirt"]
                },
                3: {
                    styleNo: 17,
                    en: "JACKET + 2 SKIRTS",
                    ja: "ジャケット + ２スカート",
                    //jancode 特定用コード
                    code: "011,013,013",
                    masterNo: 41,
                    gbPrice: 0,
                    masterValue: "JKSKSK",
                    img: "/sandbox/images/simulator/parts/parts_women_jacket_2skirt.png",
                    modalImage: "/sandbox/images/simulator/parts/parts_suit.png",
                    modalMovie: '<iframe width="560" height="315" src="https://www.youtube.com/embed/wgOZ5WrcFHo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
                    designParts: ["jacket", "skirt", "skirt2"]
                },
                4: {
                    styleNo: 16,
                    en: "JACKET + 2 PANTS",
                    ja: "ジャケット + 2パンツ",
                    //jancode 特定用コード
                    code: "011,012,012",
                    masterNo: 40,
                    gbPrice: 0,
                    masterValue: "JKPTPT",
                    img: "/sandbox/images/simulator/parts/parts_women_jacket_2pants.png",
                    modalImage: "/sandbox/images/simulator/parts/parts_suit.png",
                    modalMovie: '<iframe width="560" height="315" src="https://www.youtube.com/embed/wgOZ5WrcFHo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
                    designParts: ["jacket", "pants", "pants2"]
                },
                5: {
                    styleNo: 12,
                    en: "SLACKS + SKIRT",
                    ja: "パンツ + スカート",
                    //jancode 特定用コード
                    code: "012,013",
                    masterNo: 36,
                    gbPrice: 0,
                    masterValue: "PTSK",
                    img: "/sandbox/images/simulator/parts/parts_women_slacks_skirt.png",
                    modalImage: "/sandbox/images/simulator/parts/parts_suit.png",
                    modalMovie: '<iframe width="560" height="315" src="https://www.youtube.com/embed/wgOZ5WrcFHo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
                    designParts: ["pants", "skirt"]
                },
                6: {
                    styleNo: 14,
                    en: "2 SKIRT",
                    ja: "2スカート",
                    //jancode 特定用コード
                    code: "013,013",
                    masterNo: 38,
                    gbPrice: 0,
                    masterValue: "SKSK",
                    img: "/sandbox/images/simulator/parts/parts_women_2skirt.png",
                    modalImage: "/sandbox/images/simulator/parts/parts_suit.png",
                    modalMovie: '<iframe width="560" height="315" src="https://www.youtube.com/embed/wgOZ5WrcFHo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
                    designParts: ["skirt", "skirt2"]
                },
                7: {
                    styleNo: 13,
                    en: "2 PANTS",
                    ja: "2パンツ",
                    //jancode 特定用コード
                    code: "012,012",
                    masterNo: 37,
                    gbPrice: 0,
                    masterValue: "PTPT",
                    img: "/sandbox/images/simulator/parts/parts_women_2pants.png",
                    modalImage: "/sandbox/images/simulator/parts/parts_suit.png",
                    modalMovie: '<iframe width="560" height="315" src="https://www.youtube.com/embed/wgOZ5WrcFHo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
                    designParts: ["pants", "pants2"]
                },
                8: {
                    styleNo: 7,
                    en: "JACKET",
                    ja: "ジャケット",
                    //jancode 特定用コード
                    code: "011",
                    masterNo: 31,
                    gbPrice: 0,
                    masterValue: "JK",
                    img: "/sandbox/images/simulator/parts/parts_women_jacket.png",
                    modalImage: "/sandbox/images/simulator/parts/parts_suit.png",
                    modalMovie: '<iframe width="560" height="315" src="https://www.youtube.com/embed/wgOZ5WrcFHo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
                    designParts: ["jacket"]
                },
                9: {
                    styleNo: 9,
                    en: "SKIRT",
                    ja: "スカート",
                    //jancode 特定用コード
                    code: "013",
                    masterNo: 33,
                    gbPrice: 0,
                    masterValue: "SK",
                    img: "/sandbox/images/simulator/parts/parts_women_skirt.png",
                    modalImage: "/sandbox/images/simulator/parts/parts_suit.png",
                    modalMovie: '<iframe width="560" height="315" src="https://www.youtube.com/embed/wgOZ5WrcFHo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
                    designParts: ["skirt"]
                },
                10: {
                    styleNo: 8,
                    en: "SLACKS",
                    ja: "パンツ",
                    //jancode 特定用コード
                    code: "012",
                    masterNo: 32,
                    gbPrice: 0,
                    masterValue: "PT",
                    img: "/sandbox/images/simulator/parts/parts_women_slacks.png",
                    modalImage: "/sandbox/images/simulator/parts/parts_suit.png",
                    modalMovie: '<iframe width="560" height="315" src="https://www.youtube.com/embed/wgOZ5WrcFHo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
                    designParts: ["pants"]
                },

            }
        },
        kakuhoListFlg: false,
        designSelectedParams: {},
        selectedPartOption: null,
        selectedSort: {
            price:[],
            color:[],
            pattern:[],
            season:[],
            function:[]
        },
        stepMessage: '生地'
    },
    components: {
        'vue-lazy-component': VueLazyComponent,
        mainapp: indexVue,
        gender: gender,
        stepactions: stepActions,
        itemlist: itemlist,
        itemlistselectparts: itemlistSelectparts,
        itemlistselectpartsdesign: itemlistSelectpartsDesign,
        itemlistselectpartsfabric: itemlistSelectpartsFabric,
        itemlistselectpartsbutton: itemlistSelectpartsButton,
        itemlistselectpartsoption: itemlistSelectpartsOption,
        totalprice: totalPrice,
        controller: controller,
        staffstart: staffstart,
        imageview: imageViewVue,
        loadinger: loadinger,
        rightutil: rightUtil,
        selectedwindow: selectedWindow,
        reservationmodal: reservationModal,
        emailmodal: emailModal,
        optionmodal: optionModal,
        optionsetmodal: optionsetModal,
        productinfomodal: productInfoModal,
        productselectmodal: productSelectModal,
        sortmodal: sortModal,
        imageandvideomodal: imageAndVideoModal,
        sizeselectmodal: sizeSelectModal,
        headstep: headStep,
        size: size,
        confirm: confirm,
        finalstaff: finalStaff,
        preloader: preloader,
        katagamiinfomodal: katagamiInfoModal,
    },
    watch: {
        tantouFlg: function (v) {
            // //// console.log('担当なのか');
            // //// console.log(v);
        },
        'selected.course': {
            handler(v, ov) {
                ////// console.log('ジャケットあるかチェック');
                var jacketstyle = '';
                var thista = this;
                if (this.selected.gender == 'men') {
                    if (Object.keys(v[1]).length > 0) {
                        $.each(v[1], function (key, item) {
                            jacketstyle = thista.masters.style[key]?.style_id;
                        });
                        ////// console.log('style_idは'+jacketstyle);
                    }
                } else {
                    if (Object.keys(v[5]).length > 0) {
                        ////// console.log('ジャケットある');
                        $.each(v[5], function (key, item) {
                            jacketstyle = thista.masters.style[key]?.style_id;
                        });
                    }
                }
                Vue.set(this, 'zentaiNo', jacketstyle);
                ////// console.log('全体表示に使うナンバーは'+this.zentaiNo);
            },
            deep: true
        },
        'selected.code.line': function () {
            this.getJan();
        },
        // 'selected.sessions.ordersheet.jacket_dno':function(){}
        'selected.code.course': function () {
            this.getJan();
        },
        'selected.code.optionSonota': function () {
            this.getJan();
        },
        'selected.code.optionCourse': function () {
            this.getJan();
        },
        selected: function () {
            ////// console.log("selected 内部が変更された");
            ////// console.log(selected);
        },
        //jacket_size は　Y-０とかはいるやつ
        'selected.sessions.ordersheet.jacket_size': function (v, ov) {
            if (this.guest == false) {
                ////// console.log("ジャケットサイズが変更された");
                ////// console.log(v);
                if (v != "" && v != null) {
                    this.sizeTouroku(v, "jacket", "jacket_dno");
                }
            }
        },
        'selected.sessions.ordersheet.best_size': function (v, ov) {
            if (this.guest == false) {
                ////// console.log("べすとサイズが変更された");
                ////// console.log(v);
                if (v != "" && v != null) {
                    this.sizeTouroku(v, "vest", "best_dno");
                }
            }
        },
        'selected.sessions.ordersheet.slacks_size1': function (v, ov) {
            if (this.guest == false) {
                // // console.log("SLACKS_SIZE_1_CHANGE");
                // // console.log(v);
                if (v != "" && v != null) {
                    this.sizeTouroku(v, "pants", "slacks_dno1");
                }
            }
        },
        'selected.sessions.ordersheet.slacks_size2': function (v, ov) {
            if (this.guest == false) {
                ////// console.log("スラックスサイズ(2)が変更された");
                ////// console.log(v);
                if (v != "" && v != null) {
                    this.sizeTouroku(v, "pants2", "slacks_dno2");
                }
            }
        },
        'selected.sessions.ordersheet.wo_sk_size1': function (v, ov) {
            if (this.guest == false) {
                ////// console.log("スカートサイズが変更された");
                ////// console.log(v);
                if (v != "" && v != null) {
                    this.sizeTouroku(v, "skirt", "wo_sk_d1");
                }
            }
        },
        'selected.sessions.ordersheet.wo_sk_size2': function (v, ov) {
            if (this.guest == false) {
                ////// console.log("スカートサイズ(2)が変更された");
                ////// console.log(v);
                if (v != "" && v != null) {
                    this.sizeTouroku(v, "skirt2", "wo_sk_d2");
                }
            }
        },
        'selected.sessions.ordersheet.suso_d1': function (v, ov) {

            ////// console.log("裾１が変更された");
            ////// console.log(v);
            if (this.step > 1) {
                Vue.set(this.selected.sessions.ordersheet, 'mackin_width1', null);
            }
        },
        'selected.sessions.ordersheet.suso_d2': function (v, ov) {

            ////// console.log("裾2が変更された");
            ////// console.log(v);
            if (this.step > 1) {
                Vue.set(this.selected.sessions.ordersheet, 'mackin_width2', null);
            }

        },
        'selected.sessions.ordersheet.colorcustoms_ura_cno_normal': function (v, ov) {


            ////// console.log(v);
            if (this.selected.sessions.ordersheet.colorcustoms_ura_cno_normal != null) {
                ////// console.log("裏地が無料のものに変更された");
                Vue.set(this.selected.sessions.ordersheet, "ura_cno", v);
                Vue.set(this.selected.sessions.ordersheet, "colorcustoms_ura_cno", null);
            }

        },
        'selected.sessions.ordersheet.colorcustoms_ura_cno': function (v, ov) {


            ////// console.log(v);
            if (this.selected.sessions.ordersheet.colorcustoms_ura_cno != null) {
                ////// console.log("裏地が有料のものに変更された");
                Vue.set(this.selected.sessions.ordersheet, "ura_cno", v);
                Vue.set(this.selected.sessions.ordersheet, "colorcustoms_ura_cno_normal", null);
            }

        },
        'selected.sessions.ordersheet.colorcustoms_color_cross_normal': function (v, ov) {

            ////// console.log("カラークロスが変更された");
            ////// console.log(v);
            var seppa = false;
            if ("colorcustoms_color_cross_normal" in this.selected.sessions.ordersheet) {
                if (this.selected.sessions.ordersheet.colorcustoms_color_cross_normal != "00" && this.selected.sessions.ordersheet.colorcustoms_color_cross_normal != null) {
                    seppa = true;
                }
            }
            if (seppa) {
                ////// console.log("カラークロスは有料になる");
                Vue.set(this.selected.sessions.ordersheet, "color_cross", this.selected.sessions.ordersheet.colorcustoms_color_cross);
                ////// console.log(this.selected.sessions.ordersheet.color_cross);
            } else {
                ////// console.log("カラークロスは無料になる");
                Vue.set(this.selected.sessions.ordersheet, "colorcustoms_color_cross", '');
                Vue.set(this.selected.sessions.ordersheet, "color_cross", "00");
                ////// console.log(this.selected.sessions.ordersheet.color_cross);
            }
        },
        'selected.sessions.ordersheet.colorcustoms_color_cross': function (v, ov) {

            ////// console.log("カラークロスが変更された");
            ////// console.log(v);
            var seppa = false;
            if ("colorcustoms_color_cross_normal" in this.selected.sessions.ordersheet) {
                if (this.selected.sessions.ordersheet.colorcustoms_color_cross_normal != "00" && this.selected.sessions.ordersheet.colorcustoms_color_cross_normal != null) {
                    seppa = true;
                }
            }
            if (seppa) {
                ////// console.log("カラークロスは有料になる");
                Vue.set(this.selected.sessions.ordersheet, "color_cross", this.selected.sessions.ordersheet.colorcustoms_color_cross);
                ////// console.log(this.selected.sessions.ordersheet.color_cross);
            } else {
                ////// console.log("カラークロスは無料になる");
                Vue.set(this.selected.sessions.ordersheet, "colorcustoms_color_cross", '');
                Vue.set(this.selected.sessions.ordersheet, "color_cross", "00");
                ////// console.log(this.selected.sessions.ordersheet.color_cross);
            }
        },
        'selected.sessions.ordersheet.colorcustoms_flower_hall_normal': function (v, ov) {

            ////// console.log("フラワーホールが変更された");
            ////// console.log(v);
            var seppa = false;
            if ("colorcustoms_flower_hall_normal" in this.selected.sessions.ordersheet) {
                if (this.selected.sessions.ordersheet.colorcustoms_flower_hall_normal != "00" && this.selected.sessions.ordersheet.colorcustoms_flower_hall_normal != "200" && this.selected.sessions.ordersheet.colorcustoms_flower_hall_normal != null) {
                    seppa = true;
                }
            }
            if (seppa) {
                ////// console.log("フラワーホールは有料になる");
                Vue.set(this.selected.sessions.ordersheet, "flower_hall", this.selected.sessions.ordersheet.colorcustoms_flower_hall);
                ////// console.log(this.selected.sessions.ordersheet.flower_hall);
            } else {
                ////// console.log("フラワーホールは無料になる");
                Vue.set(this.selected.sessions.ordersheet, "colorcustoms_flower_hall", "");
                Vue.set(this.selected.sessions.ordersheet, "flower_hall", this.selected.sessions.ordersheet.colorcustoms_flower_hall_normal);


                ////// console.log(this.selected.sessions.ordersheet.flower_hall);
            }
        },

        'selected.sessions.ordersheet.colorcustoms_flower_hall': function (v, ov) {

            ////// console.log("フラワーホールが変更された");
            ////// console.log(v);
            var seppa = false;
            if ("colorcustoms_flower_hall_normal" in this.selected.sessions.ordersheet) {
                if (this.selected.sessions.ordersheet.colorcustoms_flower_hall_normal != "00" && this.selected.sessions.ordersheet.colorcustoms_flower_hall_normal != "200" && this.selected.sessions.ordersheet.colorcustoms_flower_hall_normal != null) {
                    seppa = true;
                }
            }
            if (seppa) {
                ////// console.log("フラワーホールは有料になる");
                Vue.set(this.selected.sessions.ordersheet, "flower_hall", this.selected.sessions.ordersheet.colorcustoms_flower_hall);
                ////// console.log(this.selected.sessions.ordersheet.flower_hall);
            } else {
                ////// console.log("フラワーホールは無料になる");
                Vue.set(this.selected.sessions.ordersheet, "colorcustoms_flower_hall", "");
                Vue.set(this.selected.sessions.ordersheet, "flower_hall", this.selected.sessions.ordersheet.colorcustoms_flower_hall_normal);


                ////// console.log(this.selected.sessions.ordersheet.flower_hall);
            }
        },
        'selected.sessions.ordersheet.colorcustoms_seppa_hall_normal': function (v, ov) {

            ////// console.log("切羽配色が変更された");
            ////// console.log(v);
            var seppa = false;
            if ("colorcustoms_seppa_hall_normal" in this.selected.sessions.ordersheet) {
                if ((this.selected.sessions.ordersheet.colorcustoms_seppa_hall_normal != "00" && this.selected.sessions.ordersheet.colorcustoms_seppa_hall_normal != "200") && this.selected.sessions.ordersheet.colorcustoms_seppa_hall_normal != null) {
                    seppa = true;
                }
            }
            if (seppa) {
                ////// console.log("切羽配色は有料になる");
                Vue.set(this.selected.sessions.ordersheet, "seppa_hall", this.selected.sessions.ordersheet.colorcustoms_seppa_hall);
                ////// console.log(this.selected.sessions.ordersheet.seppa_hall);
            } else {
                ////// console.log("切羽配色は無料になる");
                Vue.set(this.selected.sessions.ordersheet, "colorcustoms_seppa_hall", "");
                Vue.set(this.selected.sessions.ordersheet, "seppa_hall", this.selected.sessions.ordersheet.colorcustoms_seppa_hall_normal);


                ////// console.log(this.selected.sessions.ordersheet.seppa_hall);
            }
        },
        'selected.sessions.ordersheet.colorcustoms_seppa_hall': function (v, ov) {

            ////// console.log("切羽配色が変更された");
            ////// console.log(v);
            var seppa = false;
            if ("colorcustoms_seppa_hall_normal" in this.selected.sessions.ordersheet) {
                if ((this.selected.sessions.ordersheet.colorcustoms_seppa_hall_normal != "00" && this.selected.sessions.ordersheet.colorcustoms_seppa_hall_normal != "200")) {
                    seppa = true;
                }
            }
            if (seppa) {
                ////// console.log("切羽配色は有料になる");
                Vue.set(this.selected.sessions.ordersheet, "seppa_hall", this.selected.sessions.ordersheet.colorcustoms_seppa_hall);
                ////// console.log(this.selected.sessions.ordersheet.seppa_hall);
            } else {
                ////// console.log("切羽配色は無料になる");
                Vue.set(this.selected.sessions.ordersheet, "colorcustoms_seppa_hall", "");
                Vue.set(this.selected.sessions.ordersheet, "seppa_hall", this.selected.sessions.ordersheet.colorcustoms_seppa_hall_normal);


                ////// console.log(this.selected.sessions.ordersheet.seppa_hall);
            }
        },
        'selected.sessions.ordersheet.colorcustoms_amf_stitch_normal': function (v, ov) {

            ////// console.log("amfステッチが変更された");
            ////// console.log(v);
            var amf = false;
            if ("colorcustoms_amf_stitch_normal" in this.selected.sessions.ordersheet) {
                if (this.selected.sessions.ordersheet.colorcustoms_amf_stitch_normal != "0" && this.selected.sessions.ordersheet.colorcustoms_amf_stitch_normal != null) {
                    amf = true;
                }
            }
            if (amf) {
                ////// console.log("amfステッチは有料になる");
                Vue.set(this.selected.sessions.ordersheet, "amf_stitch", parseFloat(this.selected.sessions.ordersheet.colorcustoms_amf_stitch) + parseFloat(this.selected.sessions.ordersheet.colorcustoms_amf_stitch_normal));
                ////// console.log(this.selected.sessions.ordersheet.amf_stitch);
            } else {
                ////// console.log("amfステッチは無料になる");
                Vue.set(this.selected.sessions.ordersheet, "colorcustoms_amf_stitch", "");
                Vue.set(this.selected.sessions.ordersheet, "amf_stitch", "0");
                ////// console.log(this.selected.sessions.ordersheet.amf_stitch);
            }
        },
        'selected.sessions.ordersheet.colorcustoms_amf_stitch': function (v, ov) {

            ////// console.log("amfステッチが変更された");
            ////// console.log(v);
            var amf = false;
            if ("colorcustoms_amf_stitch_normal" in this.selected.sessions.ordersheet) {
                if (this.selected.sessions.ordersheet.colorcustoms_amf_stitch_normal != "0" && this.selected.sessions.ordersheet.colorcustoms_amf_stitch_normal != null) {
                    amf = true;
                }
            }
            if (amf) {
                ////// console.log("amfステッチは有料になる");
                Vue.set(this.selected.sessions.ordersheet, "amf_stitch", parseFloat(this.selected.sessions.ordersheet.colorcustoms_amf_stitch) + parseFloat(this.selected.sessions.ordersheet.colorcustoms_amf_stitch_normal));
                ////// console.log(this.selected.sessions.ordersheet.amf_stitch);
            } else {
                ////// console.log("amfステッチは無料になる");
                Vue.set(this.selected.sessions.ordersheet, "colorcustoms_amf_stitch", "");
                Vue.set(this.selected.sessions.ordersheet, "amf_stitch", "0");
                ////// console.log(this.selected.sessions.ordersheet.amf_stitch);
            }
        },
        'selected.sessions.ordersheet.ext_specification_normal': function (v, ov) {

            ////// console.log("裏仕様が変更された");
            ////// console.log(v);
            var powerFlg = false;
            if ("ext_specification" in this.selected.sessions.ordersheet) {
                if (this.selected.sessions.ordersheet.ext_specification == "1") {
                    powerFlg = true;
                }
            }
            if (powerFlg) {
                ////// console.log("パワーストレッチが発動した specificationは１１倍される");
                Vue.set(this.selected.sessions.ordersheet, "specification", parseInt(this.selected.sessions.ordersheet.ext_specification_normal) * 11);
                ////// console.log(this.selected.sessions.ordersheet.specification);
            } else {
                ////// console.log("パワーストレッチ無し");
                Vue.set(this.selected.sessions.ordersheet, "specification", this.selected.sessions.ordersheet.ext_specification_normal);
                ////// console.log(this.selected.sessions.ordersheet.specification);
            }
        },
        'selected.sessions.ordersheet.ext_specification': function (v, ov) {

            //// console.log("裏仕様が変更された");
            ////// console.log(v);
            var powerFlg = false;
            if ("ext_specification" in this.selected.sessions.ordersheet) {
                if (this.selected.sessions.ordersheet.ext_specification == "1") {
                    powerFlg = true;
                }
            }
            if (powerFlg) {
                if (this.selected.sessions.ordersheet.ext_specification_normal != '' && this.selected.sessions.ordersheet.ext_specification_normal != null) {
                    //// console.log("パワーストレッチが発動した specificationは１１倍される");
                    Vue.set(this.selected.sessions.ordersheet, "specification", parseInt(this.selected.sessions.ordersheet.ext_specification_normal) * 11);
                } else {
                    Vue.set(this.selected.sessions.ordersheet, "specification", 11);
                }
                ////// console.log(this.selected.sessions.ordersheet.specification);
            } else {
                //// console.log("パワーストレッチ無し");
                Vue.set(this.selected.sessions.ordersheet, "specification", this.selected.sessions.ordersheet.ext_specification_normal);
                //// console.log(this.selected.sessions.ordersheet.specification);
            }
        },
        'selected.sessions.base': function (v) {
            ////// console.log('セッションのbaseが変更された');
            ////// console.log(v);
        },
        'selected.sessions.ordersheet': {
            handler(v, ov) {
                // //// console.log("セッションの中身が変更された");
                // //// console.log(v);
                ////// console.log(this.defaultSessions);

                //その他オプションのコード特定
                var sonota1 = v.washable;
                var sonota2 = v.pleats_sta;
                var sonota6 = v.daiba;
                var sonotaR = "000"
                if (sonota1 == 1 && sonota2 != 1 && sonota6 != 1) {
                    var sonotaR = "001";
                }
                else if (sonota1 != 1 && sonota2 == 1 && sonota6 != 1) {
                    var sonotaR = "002";
                }
                else if (sonota1 != 1 && sonota2 != 1 && sonota6 == 1) {
                    var sonotaR = "006";
                }
                else if (sonota1 != 1 && sonota2 == 1 && sonota6 == 1) {
                    var sonotaR = "008";
                }
                Vue.set(this.selected.code, "optionSonota", sonotaR);
                ////// console.log("その他アイテムコード："+sonotaR);
            },
            deep: true
        },
        // 'selected.fabric':function(){
        //   Vue.nextTick(function(){
        //   app.texChanger();
        //   });
        // },
        selectedProductData: function (v) {
            Vue.set(this.selected.sessions.base, 'customer_code', v.factory);
            Vue.nextTick(function () {
                app.texChanger();
            });
        },
        'selected.gb': function (v) {
            Vue.nextTick(function () {
                ////// console.log("selected.gbが変更された："+v);
            });
        },
        step: function (v, ov) {
            if (v != ov) {
                if (v < 4) {
                    Vue.nextTick(function () {
                        app.texChanger();
                    });
                }
            }
        },
        dataload: function () {
            Vue.nextTick(function () {
                app.texChanger();
                // Vue.set(app,"selectedProductData",app.productData[app.selected.fabric]);
            });
        },
        productData: function (v, ov) {
            if (Object.keys(v).length > 0) {
                app.productDataLoad = true;
                ////// console.log('ロードされたプロダクトデータ');
                ////// console.log(v);
                // Vue.set(app.selected,"fabric",4);

            }
        },
        masters: function (v, ov) {
            if (Object.keys(v).length > 0) {
                app.masterDataLoad = true;
                // var compObj = {};
                // $.each(app.masters.compen,function(key,item){
                //   compObj[item.interface] = {
                //     name:item.name,
                //     min:0,
                //     max:0,
                //     step:item.tick,
                //     value:0,
                //     plus:item.plus,
                //     minus:item.minus,
                //     junle:item.junle
                //   }
                // });
                // app.size.adj = compObj;
                // ////// console.log("サイズ調整用データ登録");
                // ////// console.log(app.size.adj);
            }
        }
    },
    computed: {
        dispTypeChecker: function () {
            var result = '999999';
            if (this.tantouFlg) {
                if (this.selected.suitist) {
                    result = "2";
                } else {
                    result = "1";
                }
            } else {
                if (this.katagamiNaiUser) {
                    result = "999999";
                } else {
                    result = "3";
                }
            }
            ////// console.log('dispTypeChecker '+ result);
            return result;
        },
        stocktani: function () {
            if (this.selected.gender != "") {
                return this.masters.stocklimit[this.selected.gender];
            } else {
                return this.masters.stocklimit["men"];
            }
        },
        //女性のとき画像がスカート出すのかパンツ出すのか判別用
        checkSkPt: function () {
            var course = this.selected.code.course;
            var courses = [];
            if (course.indexOf(",") > -1) {
                courses = course.split(",");
            } else {
                courses[0] = course;
            }
            var aller = '_all';
            if (courses.indexOf('013') > -1) {
                aller = '_skirt';
            }
            ////// console.log(aller);
            ////// console.log('checkskpt');
            return aller;
        },
        //セッションの型紙項目無い人は買えないけど形は変えられる
        katagamiNaiUser: function () {
            if (this.tantouFlg == false && this.selected.sessions.ordersheet.jacket_dno == null && this.selected.sessions.ordersheet.slacks_dno1 == null && this.selected.sessions.ordersheet.slacks_dno2 == null && this.selected.sessions.ordersheet.best_dno == null && this.selected.sessions.ordersheet.wo_sk_d1 == null && this.selected.sessions.ordersheet.wo_sk_d2 == null) {
                Vue.set(app, "stepLimit", 5);
                return true;
            } else {
                return false;
            }
        },
        //サイズ関係で使う
        getSex: function () {
            if (this.selected.gb) {
                return 3;
            } else {
                return this.selected.sessions.ordersheet.sex;
            }
        },
        stocktani: function () {
            var genders = this.selected.gender;
            if (this.selected.gender == "") {
                genders = "men";
            }
            return this.masters.stocklimit[genders];
        },
        targetOptionSet: function () {
            if (this.selected.fabric) {
                var kumiawase = this.productData[this.selected.fabric];
                return kumiawase;
            } else {
                return false
            }
        },
        ladData: function () {
            return this.lad;
        },
        totalPriceCalc: function () {
            let totalPrice = 0;
            if (this.selected.suitist == true) {
                var productLineId = this.selectedProductData["suitistline"];
            } else if (this.selected.gender == "men") {
                var productLineId = this.selectedProductData["mensline"];
            } else if (this.selected.gender == "women") {
                var productLineId = this.selectedProductData["ladiesline"];
            }
            var productLine = "";
            $.each(this.masters.line, function (key, item) {
                if (item.line_id == productLineId) {
                    productLine = item;
                }
            });
            var parts;
            if (Object.keys(this.selected.parts).length > 0) {
                $.each(this.selected.parts, function (key, item) {
                    parts = item.designParts;
                })

            }
            ////// console.log(productLine);
            ////// console.log("料金計算：02")
            ////// console.log(parts);
            $.each(parts, function (key, item) {
                if (item == "jacket" && app.selected.gender == "men") {
                    totalPrice = totalPrice + parseInt(productLine.men_price_jk);
                    ////// console.log("料金計算：男性ジャケット："+productLine.men_price_jk);
                } else if ((item == "pants" || item == "pants2") && app.selected.gender == "men") {
                    totalPrice = totalPrice + parseInt(productLine.men_price_pt);
                    ////// console.log("料金計算：男性pants："+productLine.men_price_pt);
                } else if (item == "vest") {
                    totalPrice = totalPrice + parseInt(productLine.men_price_gill);
                    ////// console.log("料金計算：男性ベスト："+productLine.men_price_gill);
                } else if (item == "jacket" && app.selected.gender == "women") {
                    totalPrice = totalPrice + parseInt(productLine.ladies_price_jk);
                    ////// console.log("料金計算：女性ジャケット："+productLine.ladies_price_jk);
                } else if ((item == "pants" || item == "pants2") && app.selected.gender == "women") {
                    totalPrice = totalPrice + parseInt(productLine.ladies_price_pt);
                    ////// console.log("料金計算：女性pants："+productLine.ladies_price_pt);
                } else if ((item == "skirt" || item == "skirt2") && app.selected.gender == "women") {
                    totalPrice = totalPrice + parseInt(productLine.ladies_price_sk);
                    ////// console.log("料金計算：女性skirt："+productLine.ladies_price_sk);
                }
            });


            if (this.selected.code.optionCourse != "") {
                var course = this.selected.code.optionCourse;
                Vue.set(app.selected, 'optionCoursePrice', null);
                $.each(this.masters.optionset, function (key, item) {
                    if (item.optionset_num == course) {
                        if (item.price_choice == 1) {
                            ////// console.log("料金計算：オプションセットネーム: "+item.optionset_name);
                            ////// console.log("料金計算：オプション(全タイプ同額)："+item.optionset_name+""+item.price);
                            if (item.price != null) {
                                totalPrice = totalPrice + parseInt(item.price);
                                Vue.set(app.selected, 'optionCoursePrice', item.price);
                            } else {
                                ////// console.log("注意：オプションセットネーム: "+item.optionset_name+"はオプション価格が設定されていない可能性");
                            }
                        } else {
                            var masterNo = "";
                            if (Object.keys(app.selected.parts).length > 0) {
                                $.each(app.selected.parts, function (key, item) {
                                    masterNo = item.masterNo;
                                })
                                if (masterNo != "") {
                                    ////// console.log("料金計算：オプションセットネーム: "+item.optionset_name);
                                    ////// console.log("料金計算：オプション（タイプ別に値段が設定してある、タイプ"+masterNo+"）："+item["price"+masterNo]);
                                    if (item["price" + masterNo] != null) {
                                        totalPrice = totalPrice + parseInt(item["price" + masterNo]);
                                        Vue.set(app.selected, 'optionCoursePrice', item["price" + masterNo]);
                                    } else {
                                        ////// console.log("注意：オプションセットネーム: "+item.optionset_name+"はオプション価格が設定されていない可能性");
                                    }
                                }

                            }
                        }
                        return false;

                    }
                });
            }

            //料金計算　その他オプション
            if (Object.keys(this.selected.parts).length > 0) {
                var styleno;
                $.each(this.selected.parts, function (key, item) {
                    styleno = item.styleNo;
                });
                var targetPartsName;
                switch (styleno) {
                    case 1:
                        targetPartsName = 'jk';
                        break;
                    case 2:
                        targetPartsName = 'gill';
                        break;
                    case 3:
                        targetPartsName = 'pt';
                        break;
                    case 4:
                        targetPartsName = 'jkpt';
                        break;
                    case 5:
                        targetPartsName = 'jkptpt';
                        break;
                    case 6:
                        targetPartsName = 'jkgillpt';
                        break;
                    case 7:
                        targetPartsName = 'jk';
                        break;
                    case 8:
                        targetPartsName = 'pt';
                        break;
                    case 9:
                        targetPartsName = 'sk';
                        break;
                    case 10:
                        targetPartsName = 'jkpt';
                        break;
                    case 11:
                        targetPartsName = 'jksk';
                        break;
                    case 12:
                        targetPartsName = 'ptsk';
                        break;
                    case 13:
                        targetPartsName = 'ptpt';
                        break;
                    case 14:
                        targetPartsName = 'sksk';
                        break;
                    case 15:
                        targetPartsName = 'jkptsk';
                        break;
                    case 16:
                        targetPartsName = 'jkptpt';
                        break;
                    case 17:
                        targetPartsName = 'jksksk';
                        break;
                }
                var targetPartsGender;
                switch (this.selected.gender) {
                    case 'men':
                        targetPartsGender = 'mens';
                        break;
                    case 'women':
                        targetPartsGender = 'ladies';
                }
                var washablePrice = targetPartsGender + '_price_' + targetPartsName;
                var pleatPrice = targetPartsGender + '_price2_' + targetPartsName;
                var odaibaPrice = targetPartsGender + '_price3_' + targetPartsName;
                if (this.selected.sessions.ordersheet.washable == 1) {
                    ////// console.log('料金計算：ウォッシャブル価格追加');
                    ////// console.log(this.masters.other[washablePrice]);
                    totalPrice = totalPrice + parseInt(this.masters.other[washablePrice]);
                }
                if (this.selected.sessions.ordersheet.pleats_sta == 1) {
                    ////// console.log('料金計算：プリーツ価格追加');
                    ////// console.log(this.masters.other[pleatPrice]);
                    totalPrice = totalPrice + parseInt(this.masters.other[pleatPrice]);
                }
                if (this.selected.sessions.ordersheet.daiba == 1) {
                    ////// console.log('料金計算：お台場価格追加');
                    ////// console.log(this.masters.other[odaibaPrice]);
                    totalPrice = totalPrice + parseInt(this.masters.other[odaibaPrice]);
                }
            }


            if (this.selected.gb) {
                var selectparts = '';
                $.each(this.selected.parts, function (key, item) {
                    selectparts = item;
                });
                totalPrice = totalPrice + selectparts.gbPrice;
            }
            ////// console.log("料金計算：税金");
            ////// console.log(totalPrice * (window.taxrate /100));
            ////// console.log("料金計算：合計金額：");
            ////// console.log((totalPrice * (window.taxrate /100)) +totalPrice);
            var totalpricer = (totalPrice * (window.taxrate / 100)) + totalPrice;
            if (Number.isNaN(totalpricer)) {
                totalpricer = 0;
            }
            return totalpricer;
            // const fabricPrice = this.productData[this.selected.fabric].price;
        },
        lineChecker: function () {
            var gender = this.selected.gender;
            var suitist = this.selected.suitist;
            if (suitist == true) {
                return "suitistline";
            } else if (gender == "men") {
                return "mensline";
            } else if (gender == "women") {
                return "ladiesline";
            } else {
                return "mensline";
            }
        },
        deliveryDate: function () {
            if (Object.keys(this.productData).length > 0) {
                if ("delivery" in this.selectedProductData) {
                    if (this.selectedProductData.delivery == null) {
                        return "お問い合わせください";
                    } else {
                        var now = new Date();
                        now.setDate(now.getDate() + parseInt(this.selectedProductData.delivery));
                        var y = now.getFullYear();
                        var m = now.getMonth() + 1;
                        var d = now.getDate();
                        // var d = now.getDay();
                        var dater = y + "年" + m + "月" + d + "日";
                        return dater;
                    }
                } else {
                    return "----";
                }
            }
        },
    },
    methods: {
        getParam(key) {
            let currentURL = window.location.href;
            let url = new URL(currentURL);
            let params = new URLSearchParams(url.search);
            return params.get(key) || null;
        },
        setParam(key, value) {
            let currentURL = window.location.href;
            let url = new URL(currentURL);
            let params = new URLSearchParams(url.search);
            params.set(key, value);
            url.search = params.toString();
            window.history.replaceState({}, '', url.toString());
        },
        // 最終的に残すセッション項目の選定
        finalSheetCheck: function () {
            var thista = this;
            var selectparts = '';
            $.each(thista.selected.parts, function (key, item) {
                selectparts = item;
            });
            var parts = selectparts.designParts;
            var target = this.selected.parts;
            var all = this.optionZentai;
            var sakujoTarget = [];
            var shiwake = this.optionsShiwakeOptiondake;
            var targetparts;
            var targetpartsArray = [];
            $.each(target, function (key, item) {
                targetparts = item['designParts'];
            });
            targetpartsArray = targetparts;

            $.each(all, function (key, item) {
                if (targetpartsArray.indexOf(item) >= 0) {

                } else {
                    sakujoTarget.push(item);
                }
            });
            var apiSakujoTarget = [];
            $.each(sakujoTarget, function (key, item) {
                $.each(shiwake[item], function (key2, item2) {
                    if (item == 'jacket') {
                        if (thista.selected.gender == 'women' && item2 == 'specification') {
                            apiSakujoTarget.push(item2);
                        }
                        else if ((parts.indexOf('pants') > -1 && (item2 == 'button_cno' || item2 == 'ext_specification' || item2 == 'specification')) || (parts.indexOf('vest') > -1 && (item2 == 'button_cno' || item2 == 'colorcustoms_ura_cno_normal' || item2 == 'ura_cno'))) {
                        } else {
                            apiSakujoTarget.push(item2);
                        }
                    } else {
                        apiSakujoTarget.push(item2);
                    }
                });
            });
            var partsc = '';
            var coursec = this.selected.parts;
            $.each(coursec, function (key23, item23) {
                partsc = item23;
            });
            if ((partsc.styleNo == 3 || partsc.styleNo == 12 || partsc.styleNo == 13 || partsc.styleNo == 8) && this.selected.sessions.ordersheet.specification < 10) {
                apiSakujoTarget.push('specification');
            }
            var thista = this;
            $.each(apiSakujoTarget, function (key, item) {
                // // console.log(item+'をnullにします');
                Vue.set(thista.selected.sessions.ordersheet, item, null);
            });
            //// console.log(thista.selected.sessions.ordersheet);
            this.optionInit();
        },
        //コースを選択しなおした際などにオプションをリセットする用(全リセット)
        optionReseter: function () {
            var shiwake = this.optionsShiwakeOptiondake;
            ////// console.log('オプション選択内容をリセットします');
            $.each(shiwake, function (key, item) {
                $.each(item, function (key2, item2) {
                    Vue.set(app.selected.sessions.ordersheet, item2, null);
                })
            })
            this.optionInit();
        },
        //オプション型紙サイズ全部リセットする
        optionKatagamiSizeReseter: function () {
            var shiwake = this.optionsShiwake;
            ////// console.log('オプション選択内容をリセットします');
            $.each(shiwake, function (key, item) {
                $.each(item, function (key2, item2) {
                    Vue.set(app.selected.sessions.ordersheet, item2, null);
                })
            })
            $.each(this.selected.course, function (key, item) {
                Vue.set(app.selected.course, key, {});
            });
            $.each(this.selected.katagami, function (key, item) {
                Vue.set(app.selected.katagami, key, {});
            });
            this.optionInit();
        },
        //型紙の名前から詳細を取得する
        getKatagamiDetail(targetName) {
            const query = {
                headers: {
                    "content-Type": "application/json;charset=UTF-8"
                },
                params: {
                    product_id: targetName
                }
            };
            var thista = this;
            axios.get("/sandbox/ajaxTool/getKatagami.php", query).then(res => {
                // //// console.log('初期の型紙の情報');
                //   //// console.log(res.data);
            })
        },
        //最初にGBなんかを調べる用
        isGBChecker() {
            const query = {
                headers: {
                    "content-Type": "application/json;charset=UTF-8"
                },
                params: {
                    jacket_dno: app.selected.sessions.ordersheet.jacket_dno,
                    slacks_dno1: app.selected.sessions.ordersheet.slacks_dno1,
                    best_dno: app.selected.sessions.ordersheet.best_dno,
                }
            };
            var thista = this;
            axios.get("/sandbox/ajaxTool/isGB.php", query).then(res => {
                // //// console.log('GBなのか');
                //   //// console.log(res.data);
                if (res.data == true) {
                    Vue.set(app.firstCheckers, 'gb', true);
                    // //// console.log(app.firstCheckers);
                }
            })
        },
        //最初に型紙ファクトリーを調べる用
        isKataFacChecker() {
            const query = {
                headers: {
                    "content-Type": "application/json;charset=UTF-8"
                },
                params: {
                    jacket_dno: app.selected.sessions.ordersheet.jacket_dno,
                    slacks_dno1: app.selected.sessions.ordersheet.slacks_dno1,
                    best_dno: app.selected.sessions.ordersheet.best_dno,
                    wo_sk_d1: app.selected.sessions.ordersheet.wo_sk_d1,
                }
            };
            // // console.log('isKataFacChecker', query)
            var thista = this;
            axios.get("/sandbox/ajaxTool/getKataFac.php", query).then(res => {
                // //// console.log('型紙ふぁくとり');
                // //// console.log(res.data);


                Vue.set(app.firstCheckers, 'katafactory', res.data.toString());
                // // console.log('app.firstCheckers', app.firstCheckers);

            })
        },
        //ウェストアジャスターだけリセット
        waistReseter: function () {
            Vue.set(this.selected.sessions.ordersheet, 'w_adjuster1', null);
            Vue.set(this.selected.sessions.ordersheet, 'w_adjuster2', null);
        },
        //お台場だけリセット
        daibaReseter: function () {
            Vue.set(this.selected.sessions.ordersheet, 'daiba', null);
        },
        katagamiKoukeiChecker: function (katagami, target_dno, name) {
            return new Promise((resolve, reject) => {
                if (this.katagamiLimitChecker(katagami)) {
                    ////// console.log('既に選択されている'+name+'型紙は期限内もしくは期限なし');
                    resolve(katagami);
                } else {
                    ////// console.log('既に選択されている'+name+'型紙は期限が切れている');
                    if (katagami.after_num != '' && katagami.after_num != null) {

                        ////// console.log('jacket 後継ナンバーがある:'+katagami.after_num);
                        const query = {
                            headers: {
                                "content-Type": "application/json;charset=UTF-8"
                            },
                            params: {
                                product_id: katagami.after_num
                            }
                        };
                        var thista = this;
                        axios.get("/sandbox/ajaxTool/getKatagami.php", query).then(res => {
                            ////// console.log('後継機の型紙');
                            ////// console.log(res.data);
                            if (app.katagamiLimitChecker(res.data)) {
                                ////// console.log('後継機の型紙をセットします');
                                alert('既に選択されている' + name + '型紙は期限が切れていて、後継となる型紙（' + res.data.pattern_num + '）がありますのでそちらを使用します。');
                                Vue.set(app.selected.sessions.ordersheet, target_dno, res.data.pattern_num);
                                resolve(res.data);
                            } else {
                                if (res.data.after_num != '' && res.data.after_num != null) {
                                    ////// console.log(''+name+' 後継ナンバーがある:'+res.data.after_num);
                                    const query = {
                                        headers: {
                                            "content-Type": "application/json;charset=UTF-8"
                                        },
                                        params: {
                                            product_id: res.data.after_num
                                        }
                                    };
                                    var thista = this;
                                    axios.get("/sandbox/ajaxTool/getKatagami.php", query).then(res => {
                                        ////// console.log('後継機の型紙');
                                        ////// console.log(res.data);
                                        if (this.katagamiLimitChecker(res.data)) {
                                            ////// console.log('後継機の型紙をセットします');
                                            alert('既に選択されている' + name + '型紙は期限が切れていて、後継となる型紙（' + res.data.pattern_num + '）がありますのでそちらを使用します。');
                                            Vue.set(app.selected.sessions.ordersheet, target_dno, res.data.pattern_num);
                                            resolve(res.data);
                                        } else {

                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        },
        //型紙の有効期限を見て切れているかチェック
        katagamiLimitChecker: function (target) {
            if (target.end_date != null && target.end_date != '') {
                var limitDate = new Date(target.end_date);
                var nowDate = new Date();
                ////// console.log(target.end_date);
                ////// console.log(limitDate.getTime());
                ////// console.log(nowDate.getTime());
                if (limitDate.getTime() < nowDate.getTime()) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        },
        // シュミレータ全体表示
        view_zentai: function () {

        },
        //オプションのデフォルト化
        optionInit: function () {
            var cloth_no = '';
            if ('ordersheet' in this.selected.sessions) {
                cloth_no = this.selected.sessions.ordersheet.cloth_no;
            }
            const query = {
                headers: {
                    "content-Type": "application/json;charset=UTF-8"
                },
                params: {
                    cloth_no: cloth_no
                }
            };
            axios.get("/sandbox/ajaxTool/getOptionSyokiti.php", query).then(res => {
                // //// console.log("オプション初期値取得。セットします");
                // //// console.log(res.data);
                // //// console.log(app.selected.sessions.ordersheet);
                var defaulter = res.data;
                var thista = this;
                $.each(defaulter, function (key, item) {
                    if (key == 'ext_specification_normal') {
                        var targetGenderNum = 1;
                        if (thista.selected.gender == 'women') {
                            targetGenderNum = 5;
                        }
                        // //// console.log('型紙の裏仕様');
                        // //// console.log(thista.selected.katagami);
                        if (Object.keys(thista.selected.katagami[targetGenderNum]).length > 0) {
                            // //// console.log('実際のチェック');
                            // //// console.log(Object.keys(thista.selected.katagami[targetGenderNum]).length);
                            // //// console.log(thista.selected.katagami[targetGenderNum]);
                            $.each(thista.selected.katagami[targetGenderNum], function (key, item) {
                                if (item['urashiyo'].length > 0) {
                                    if (thista.selected.sessions.ordersheet.specification == null || thista.selected.sessions.ordersheet.specification == "") {
                                        // //// console.log('裏仕様');
                                        // //// console.log(thista.selected.sessions.ordersheet.specification);
                                        Vue.set(thista.selected.sessions.ordersheet, 'ext_specification_normal', item['urashiyo'][0]);
                                    }
                                } else {

                                    Vue.set(thista.selected.sessions.ordersheet, 'ext_specification_normal', null);
                                }
                            })
                        }
                    }
                    if (key != 'pleats_sta' && key != 'washable' && key.indexOf("colorcustoms_") == -1 && key != "ext_specification_normal") {
                        if (key in app.selected.sessions.ordersheet) {
                            if (app.selected.sessions.ordersheet[key] == null || app.selected.sessions.ordersheet[key] == "") {
                                if (item == 0) {
                                    item = '0';
                                }
                                Vue.set(app.selected.sessions.ordersheet, key, item);
                            }
                        }
                        if (key == 'ext_specification') {
                            if (app.selected.sessions.ordersheet[key] == null || app.selected.sessions.ordersheet[key] == "") {
                                Vue.set(app.selected.sessions.ordersheet, key, '0');
                            }
                        }

                        if (key + "1" in app.selected.sessions.ordersheet) {
                            if (app.selected.sessions.ordersheet[key + "1"] == null || app.selected.sessions.ordersheet[key + "1"] == "") {
                                if (item == 0) {
                                    item = '0';
                                }
                                Vue.set(app.selected.sessions.ordersheet, key + "1", item);
                            }
                        }
                        if (key + "2" in app.selected.sessions.ordersheet) {
                            if (app.selected.sessions.ordersheet[key + "2"] == null || app.selected.sessions.ordersheet[key + "2"] == "") {
                                if (item == 0) {
                                    item = '0';
                                }
                                Vue.set(app.selected.sessions.ordersheet, key + "2", item);
                            }
                        }
                    }
                    if (key == "ext_specification_normal" || key.indexOf("colorcustoms_") >= 0) {
                        if (key in app.selected.sessions.ordersheet && app.selected.sessions.ordersheet[key] != null && app.selected.sessions.ordersheet[key] != "") {
                        } else {
                            if (key.indexOf("colorcustoms_seppa_hall_normal") >= 0 || key.indexOf("colorcustoms_color_cross_normal") >= 0) {
                                item = '00';
                            }
                            else if (item == 0) {
                                item = '0';
                            }
                            Vue.set(app.selected.sessions.ordersheet, key, item);
                        }
                    }
                });
                // //// console.log("オプション初期値セット完了");
                // //// console.log(app.selected.sessions);
                if (Object.keys(this.selected.katagami[1]).length > 0 || Object.keys(this.selected.katagami[5]).length > 0) {
                    var eriFlg = false;
                    if (this.selected.gender == 'men') {
                        $.each(this.selected.katagami[1], function (key, item) {
                            if (42 in item.option_id) {
                                eriFlg = true;
                            }
                        });
                    } else {
                        $.each(this.selected.katagami[5], function (key, item) {
                            if (42 in item.option_id) {
                                eriFlg = true;
                            }
                        });
                    }
                    if (eriFlg == false) {
                        Vue.set(this.selected.sessions.ordersheet, 'sh_eri', null);
                    }
                    // //// console.log('衿判定は');
                    // //// console.log(eriFlg);
                }
                app.getSelectedOption();
            });
        },
        //各種変更した際の初期化
        syokika: function (level) {
            // //// console.log('初期化');
            var deleter = [];
            if (level == 'genderfirst') {
                deleter.push("kitake");
                deleter.push("sodetake_left");
                deleter.push("sodetake_right");
                deleter.push("ura_cno");
                deleter.push("button_cno");
                deleter.push("bento");
                deleter.push("specification");
                deleter.push("amf_stitch");
                deleter.push("change_pocket");
                deleter.push("sode_honseppa");
                deleter.push("patch_pocket");
                deleter.push("barca_pocket");
                deleter.push("sh_eri");
                deleter.push("dcan");
                deleter.push("waist");
                deleter.push("waist_1");
                deleter.push("waist_2");
                deleter.push("kuchi_width_1");
                deleter.push("kuchi_width_2");
                deleter.push("bestsetake");
                deleter.push("enter_name");
                deleter.push("style_name");
                deleter.push("crotch_main1");
                deleter.push("crotch_right1");
                deleter.push("crotch_main2");
                deleter.push("crotch_right2");
                deleter.push("mackin_width1");
                deleter.push("mackin_width2");
                deleter.push("suso_d1");
                deleter.push("suso_d2");
                deleter.push("take1");
                deleter.push("take2");
                deleter.push("w_adjuster1");
                deleter.push("w_adjuster2");
                deleter.push("slacks_yobi11");
                deleter.push("slacks_yobi12");
                deleter.push("slacks_yobi21");
                deleter.push("slacks_yobi22");
                deleter.push("slacks_yobi31");
                deleter.push("slacks_yobi32");
                deleter.push("backlining");
                deleter.push("best_yobi1");
                deleter.push("best_yobi2");
                deleter.push("best_yobi3");
                deleter.push("neck");
                deleter.push("yukitake_left");
                deleter.push("yukitake_right");
                deleter.push("cleric");
                // deleter.push("sh_style");
                // deleter.push("sh_figure");
                // deleter.push("sh_maetate");
                // deleter.push("sh_back tack");
                // deleter.push("sh_cuffs");
                // deleter.push("sh_pocket");
                // deleter.push("sh_button");
                // deleter.push("sh_thread");
                // deleter.push("sh_buttonhall");
                // deleter.push("sh_text");
                // deleter.push("sh_font");
                // deleter.push("sh_nposition");
                // deleter.push("sh_ncolor");
                // deleter.push("sh_kitake");
                // deleter.push("sh_yobi2");
                // deleter.push("sh_yobi3");
                deleter.push("digital_name");
                deleter.push("note");
                deleter.push("wo_waist_1");
                deleter.push("wo_waist_2");
                deleter.push("wo_skirt_1");
                deleter.push("wo_skirt_2");
                deleter.push("daiba");
                deleter.push("wo_sk_d1");
                deleter.push("wo_sk_d2");
                deleter.push("wo_sk_model1");
                deleter.push("wo_sk_model2");
                deleter.push("wo_sample_2");
                deleter.push("wo_sample_3");
                deleter.push("sh_size");
                deleter.push("wo_sk_size1");
                deleter.push("wo_sk_size2");
                deleter.push("suit_combi");
                deleter.push("sex");
                deleter.push("seppa_hall");
                deleter.push("flower_hall");
                deleter.push("color_cross");
                deleter.push("washable");
                deleter.push("safeguard_p1");
                deleter.push("safeguard_p2");
                deleter.push("safeguard_s1");
                deleter.push("safeguard_s2");
                deleter.push("air_fit");
                deleter.push("ja_shoulder");
                deleter.push("watarihaba1");
                deleter.push("susohaba1");
                deleter.push("course_combi");
                deleter.push("pleats_sta");
                deleter.push("side_pat");
                deleter.push("full_hall");
                deleter.push("watarihaba2");
                deleter.push("susohaba2");
                deleter.push("o_yobi1");
                deleter.push("o_yobi2");
                deleter.push("o_yobi3");
                deleter.push("o_yobi4");
                deleter.push("o_yobi5");
                deleter.push("o_yobi6");
                deleter.push("o_yobi7");
                deleter.push("o_yobi8");
                deleter.push("o_yobi9");
                deleter.push("o_yobi10");
                deleter.push("course_no");
                deleter.push("cloth_no");
                deleter.push("jacket_dno");
                deleter.push("jacket_size");
                deleter.push("jan_result");
                deleter.push("colorcustoms_amf_stitch");
                deleter.push("colorcustoms_amf_stitch_normal");
                deleter.push("ext_specification_normal");
                deleter.push("colorcustoms_seppa_hall_normal");
                deleter.push("colorcustoms_ura_cno_normal");
                deleter.push("colorcustoms_ura_cno");
                deleter.push("ext_specification");
                deleter.push("jan_result");
                $.each(deleter, function (key, item) {
                    if (item in app.selected.sessions.ordersheet) {
                        Vue.set(app.selected.sessions.ordersheet, item, null);
                    }
                })
                $.each(this.selected.code, function (key, item) {
                    Vue.set(app.selected.code, key, '');
                });
                $.each(this.selected.course, function (key, item) {
                    Vue.set(app.selected.course, key, {});
                });
                // Vue.set(this.selectedProductData,'kiji_image',"");
                Vue.set(this.selectedProductData, 'delivery', null);
                app.optionInit();
            }
            Vue.set(this.selected, 'gb', false);
        },
        //オーダーセッション送信の際いらない部分消す
        iranaiChecker(data) {
            var result = data;
            if ("ext_specification" in result.ordersheet) {
                delete result.ordersheet["ext_specification"];
            }
            if ("ext_specification_normal" in result.ordersheet) {
                delete result.ordersheet["ext_specification_normal"];
            }
            $.each(result.ordersheet, function (key, item) {
                if (key.indexOf("colorcustoms_") > -1) {
                    delete result.ordersheet[key];
                }
            });
            return result;
        },
        //選択されているオプションをセッションと照らし合わせ判別する
        getSelectedOption: function () {
            let formdata = new URLSearchParams();
            var sessionJson = JSON.stringify(this.selected.sessions);
            formdata.append('sessions', sessionJson);
            var resdata = "";
            var thista = this;
            axios.post("/sandbox/ajaxTool/getSelectedOption.php", formdata).then(res => {
                // //// console.log('selectedoption');
                // //// console.log(res.data);
                resdata = res.data;
                // $.each(resdata,function(key,item){
                //   if(Object.keys(thista.optionData.mazemaze).indexOf(item.option_id) == -1){
                //     delete resdata[key];
                //   }
                // });

                // //// console.log(this.selected.sessions);
                // $.each(resdata,function(key,item){
                //   //// console.log(item.disp_name);
                // })
                //選択されていないパーツは消す
                var shiwake = thista.optionsShiwakeOptiondake;
                var selectparts = '';
                $.each(thista.selected.parts, function (key, item) {
                    selectparts = item;
                });
                var parts = selectparts.designParts;
                if (parts != void 0) {
                    var esFlg = false;
                    var esnFlg = false;
                    if (parts.indexOf('jacket') == -1) {
                        $.each(shiwake['jacket'], function (key, item) {
                            $.each(resdata, function (key2, item2) {
                                if (item2.target_api_field == item) {
                                    if (item2.target_api_field == 'ext_specification') {
                                        esFlg = true;
                                        if (thista.selected.gender == 'women') {
                                            delete resdata[key2];
                                        }
                                    }
                                    if (item2.target_api_field == 'ext_specification_normal') {
                                        esFlg = true;
                                    }
                                    if ((parts.indexOf('pants') > -1 && (item2.target_api_field == 'button_cno' || item2.target_api_field == 'ext_specification')) || (parts.indexOf('vest') > -1 && (item2.target_api_field == 'button_cno' || item2.target_api_field == 'colorcustoms_ura_cno_normal' || item2.target_api_field == 'ura_cno'))) {

                                    } else {
                                        delete resdata[key2];
                                    }
                                }
                            });
                        });

                    }
                    if (parts.indexOf('pants') == -1) {
                        $.each(shiwake['pants'], function (key, item) {
                            $.each(resdata, function (key2, item2) {
                                if (item2.target_api_field == item) {
                                    if (item2.target_api_field == 'ext_specification') {
                                        if (esFlg == true) {
                                            delete resdata[key2];
                                        }
                                    }
                                    else if (item2.target_api_field == 'ext_specification_normal') {
                                        if (esnFlg == true) {
                                            delete resdata[key2];
                                        }
                                    } else {
                                        delete resdata[key2];
                                    }
                                }
                            });

                        });
                    }
                    if (parts.indexOf('pants2') == -1) {
                        $.each(shiwake['pants2'], function (key, item) {
                            $.each(resdata, function (key2, item2) {
                                if (item2.target_api_field == item) {
                                    delete resdata[key2];
                                }
                            });
                        });
                    }
                    if (parts.indexOf('skirt') == -1) {
                        $.each(shiwake['skirt'], function (key, item) {
                            $.each(resdata, function (key2, item2) {
                                if (item2.target_api_field == item) {
                                    delete resdata[key2];
                                }
                            });
                        });
                    }
                    if (parts.indexOf('skirt2') == -1) {
                        $.each(shiwake['skirt2'], function (key, item) {
                            $.each(resdata, function (key2, item2) {
                                if (item2.target_api_field == item) {
                                    delete resdata[key2];
                                }
                            });
                        });
                    }
                }
                thista.selected.selectedOptions = resdata;
                // return resdata;
            });

        },
        //セッションにオプションデータがあるときjancode 出さなあかんので使う
        getOptionsHazime: function (kumiawaseId, gender) {
            var gb = "";
            if (this.selected.gb) {
                gb = 1;
            }
            var katagami = {};
            $.each(this.selected.katagami, function (key, item) {
                if (Object.keys(item).length > 0) {
                    ////// console.log("型紙検知："+key);
                    $.each(item, function (key2, item2) {
                        katagami[key] = item2.pattern_id;
                    })
                }
            });
            const query = {
                headers: {
                    "content-Type": "application/json;charset=UTF-8"
                },
                params: {
                    kumiawaseId: kumiawaseId,
                    katagami: katagami,
                    katagamiNaiUser: this.katagamiNaiUser,
                    gender: gender,
                    parts: this.selected.parts,
                    factory: this.selectedProductData.factory,
                    gb: gb,
                }
            };
            var thista = this;
            axios.get("/sandbox/ajaxTool/getOptionKumiawase.php", query).then(res => {
                // ////// console.log(res.data);
                thista.optionData = res.data;
                // //// console.log("暫定のオプション組み合わせ：");
                // //// console.log(thista.optionData);
                thista.checkOptionCourse();
            })
        },
        getOptions: function (kumiawaseId, gender) {
            var gb = "";
            if (this.selected.gb) {
                gb = 1;
            }
            var katagami = {};
            // // console.log('COURSE', this.selected.course);
            $.each(this.selected.course, function (key, item) {
                if (Object.keys(item).length > 0) {
                    // // console.log("型紙検知："+key, item);
                    $.each(item, function (key2, item2) {
                        if (item2) {
                            katagami[key] = item2.pattern_id;
                        }
                    })
                }
            });
            const query = {
                headers: {
                    "content-Type": "application/json;charset=UTF-8"
                },
                params: {
                    kumiawaseId: kumiawaseId,
                    katagami: katagami,
                    gender: gender,
                    katagamiNaiUser: this.katagamiNaiUser,
                    parts: this.selected.parts,
                    factory: this.selectedProductData.factory,
                    gb: gb,
                }
            };
            var thista = this;
            return new Promise(function (resolve, reject) {
                axios.get("/sandbox/ajaxTool/getOptionKumiawase.php", query).then(res => {
                    // ////// console.log(res.data);
                    thista.optionData = res.data;
                    thista.optionLoad = true;
                    resolve('ok');
                })
            })
        },
        //オプションコースチェック
        // itemlist_selectparts_option.vueにもある　両方修正せよ
        checkOptionCourse: function () {

            var kumiawaseIds = this.selectedProductData.type;

            this.getOptions(kumiawaseIds, this.selected.gender).then(res => {
                var thista = app;
                ////// console.log("checkOptionCourse");
                // //// console.log(app.optionData);
                var fabricOptionSetId = '';
                if ('optionData' in thista) {
                    if ('fabricOptionSetId' in thista.optionData) {
                        fabricOptionSetId = thista.optionData.fabricOptionSetId;
                    }
                }

                const query = {
                    headers: {
                        "content-Type": "application/json;charset=UTF-8"
                    },
                    params: {
                        sessions: JSON.stringify(thista.selected.sessions.ordersheet),
                        factory: thista.selectedProductData.factory,
                        gender: thista.selected.gender,
                        gb: thista.selected.gb,
                        selectedOptionset: fabricOptionSetId,
                        fabricTourokuOption: thista.selectedProductData.specification
                    }
                };
                var thista = thista;
                axios.get("/sandbox/ajaxTool/getOptionCourse.php", query).then(res => {
                    ////// console.log(res.data);
                    // //// console.log('工場は：'+thista.selectedProductData.factory);
                    // //// console.log(thista.selected.gender);
                    // //// console.log(thista.selected.gb);
                    // //// console.log(fabricOptionSetId);
                    // //// console.log(thista.selectedProductData.specification);
                    var data = res.data;
                    Vue.set(thista.selected.code, "optionCourse", data);
                    Vue.set(thista.selected.sessions.ordersheet, 'course_no', data);
                    // //// console.log('オプションコース特定：'+thista.selected.sessions.ordersheet.course_no);
                    // //// console.log("オプションコース特定した selected.code.optionCourse："+thista.selected.code.optionCourse);
                    if (thista.selected.sessions.ordersheet.course_no != 'none' && thista.selected.sessions.ordersheet.course_no != '' && thista.selected.sessions.ordersheet.course_no != null) {
                        thista.getOptionCourseDetail(thista.selected.sessions.ordersheet.course_no);
                    }
                })
            });
        },
        //オプションコースの内容をゲット
        getOptionCourseDetail: function (id) {
            const query = {
                headers: {
                    "content-Type": "application/json;charset=UTF-8"
                },
                params: {
                    targetId: id,
                    factory: this.selectedProductData.factory,
                    gender: this.selected.gender,
                    gb: this.selected.gb,
                }
            };
            axios.get("/sandbox/ajaxTool/getOptionCourseDetail.php", query).then(res => {
                var data = res.data;
                // //// console.log('オプションコース詳細');
                // //// console.log(id);
                // //// console.log(data);
                app.selected.optionCourseDetails = data;
            });
        },
        //サイズのセット
        setSizer: function (targetJunle, thista, targetParts, maisu) {
            //ジャケット
            // //// console.log(targetParts+':desuyo');
            $.each(this.masters.compen, function (key, item) {
                var itemInterfaceArray = [];
                if (item.interface.indexOf("__") >= 0) {
                    itemInterfaceArray = item.interface.split("__");
                }
                if (itemInterfaceArray.length < 1) {

                    if (item.junle == targetJunle && parseInt(item.sex) == parseInt(thista.getSex)) {
                        Vue.set(thista.size.adj, item.interface, {
                            name: item.name,
                            junle: targetParts,
                            min: (parseFloat(thista.selected.size[targetParts][item.interface]) - parseFloat(item.minus)).toFixed(1),
                            max: (parseFloat(thista.selected.size[targetParts][item.interface]) + parseFloat(item.plus)).toFixed(1),
                            step: item.tick,
                            value: thista.sessions.ordersheet[item.interface]
                        });
                    }
                } else {

                    if (targetJunle == 1) {
                        $.each(itemInterfaceArray, function (key2, item2) {
                            var target = "";
                            var side = "";
                            if (targetJunle == 1) {
                                if (itemInterfaceArray.indexOf("sodetake_left") >= 0) {
                                    target = "sodetake_left";
                                } else {
                                };
                                if (item2.indexOf("left") >= 0) {
                                    side = "左";
                                } else {
                                    side = "右";
                                };

                                if (item.junle == targetJunle && parseInt(item.sex) == parseInt(thista.getSex)) {
                                    Vue.set(thista.size.adj, item2, {
                                        name: item.name + "(" + side + ")",
                                        junle: targetParts,
                                        min: (parseFloat(thista.selected.size[targetParts][target]) - parseFloat(item.minus)).toFixed(1),
                                        max: (parseFloat(thista.selected.size[targetParts][target]) + parseFloat(item.plus)).toFixed(1),
                                        step: item.tick,
                                        value: thista.sessions.ordersheet[item2]
                                    });
                                }
                            }
                        })
                    } else {
                        ////// console.log("枚数"+(maisu-1));
                        ////// console.log(itemInterfaceArray);
                        ////// console.log(thista.sessions.ordersheet);
                        if (item.junle == targetJunle && parseInt(item.sex) == parseInt(thista.getSex)) {
                            Vue.set(thista.size.adj, itemInterfaceArray[maisu - 1], {
                                name: item.name,
                                junle: targetParts,
                                min: (parseFloat(thista.selected.size[targetParts][itemInterfaceArray[0]]) - parseFloat(item.minus)).toFixed(1),
                                max: (parseFloat(thista.selected.size[targetParts][itemInterfaceArray[0]]) + parseFloat(item.plus)).toFixed(1),
                                step: item.tick,
                                value: thista.sessions.ordersheet[itemInterfaceArray[maisu - 1]]
                            });
                        }
                    }
                }
            })
            // //// console.log(this.size.adj);
        },
        //03で親スタイル選択時
        partsClicker03: function (target) {
            this.selected.styleTarget = target;
            if (this.katagamiNaiUser == false) {
                Vue.set(this.selected, "targetCourseData", {});
                ////// console.log("ここまでOK");
                Vue.set(this.selected, "targetCourseData", this.masters.style[target]);
                ////// console.log("選択されたパーツ↓");
                ////// console.log(this.selected.targetCourseData);
            } else {
                Vue.set(this.selected.course, this.c3Category + this.sub, {});
                Vue.set(this.selected.course[this.c3Category + this.sub], this.selected.styleTarget, this.masters.style[this.selected.styleTarget]);
            }
        },
        //02 で組み合わせをクリックしたときなど
        partsChangers: function (target) {
            Vue.set(this.selected, "parts", {});
            Vue.set(this.selected.parts, target, this.selectparts[this.selected.gender][target]);
            ////// console.log("スタイルが変更された");
            ////// console.log("スタイルNO"+this.selectparts[this.selected.gender][target].styleNo);
            Vue.set(this.selected, "quantity", this.targetNagasa(this.selectparts[this.selected.gender][target].styleNo));
            ////// console.log(this.selected);
            Vue.set(this.selected.code, "course", this.selectparts[this.selected.gender][target]["code"]);
            Vue.set(this.selected.sessions.ordersheet, "course_combi", this.selectparts[this.selected.gender][target]["masterNo"]);
            if (this.selected.sessions.ordersheet.sex == 2) {
                Vue.set(this.selected.sessions.ordersheet, "suit_combi", this.selectparts[this.selected.gender][target]["masterValue"]);
            }
            ////// console.log("jan特定用 course 変更");
            ////// console.log(this.selected.code);
            ////// console.log('選択された買う組み合わせコース↓');
            ////// console.log(this.selected.parts);
            if (this.selectparts[this.selected.gender][target].styleNo == 4 || this.selectparts[this.selected.gender][target].styleNo == 5 || this.selectparts[this.selected.gender][target].styleNo == 6 || this.selectparts[this.selected.gender][target].styleNo == 1) {
                this.c3Category = 1;
            } else if (this.selectparts[this.selected.gender][target].styleNo == 3) {
                this.c3Category = 3;
            } else if (this.selectparts[this.selected.gender][target].styleNo == 2) {
                this.c3Category = 2;
            }

            console.log('SELECTED:::::', JSON.parse(JSON.stringify(this.selected)));
        },
        defaultSelectedRe: function () {
            var data = {
                //基本サイズとどれだけ変更したかを入れる予定
                size: {
                    jacket: {},
                    pants: {},
                    pants2: {},
                    vest: {},
                    skirt: {},
                    skirt2: {},
                },

                //セッション情報　カスタマイズされる
                sessions: {},
                // ジャンコード、およびそれを特定するためのコード群
                code: {
                    //productSelectmodalで決めてる
                    line: "",
                    course: "",
                    optionSonota: "",
                    optionCourse: "",
                    result: {},
                },
                //gbフラグ
                gb: false,
                //スーティスト店舗か
                suitist: false,
                gender: "men",
                fabric: "",
                //02 design で選択したものが入る
                parts: {},
                //スタイルのIDをkeyとしたオブジェクトに型紙の情報が入ったものが挿入される。注意。
                course: {
                    // jacket
                    "1": {},
                    // pants
                    "3": {},
                    "3pants2": {},
                    // vest
                    "2": {},
                    // womenjacket
                    "5": {},
                    // womenpants
                    "6": {},
                    "6pants2": {},
                    // womenskirt
                    "7": {},
                    "7skirt2": {},
                },
                options: {},
                katagami: {
                    // jacket
                    "1": {},
                    // pants
                    "3": {},
                    "3pants2": {},
                    // vest
                    "2": {},
                    // womenjacket
                    "4": {},
                    // womenpants
                    "5": {},
                    // womenskirt
                    "6": {},
                    "6pants2": {},
                    // womenskirt
                    "7": {},
                    "7skirt2": {},
                },
            };
            Vue.set(this, "selected", data);
            var thista = this;
            const query = {
                headers: {
                    "content-Type": "application/json;charset=UTF-8"
                }
            };
            axios.get("/sandbox/ajaxTool/getSession.php", query).then(res => {
                var data = res.data;

                Vue.set(thista.selected, "sessions", data);
                ////// console.log("セッションリローディングOK");
                ////// console.log(thista.selected);
            });
            ////// console.log("セーブされているセッション↓");
            ////// console.log(this.saveData);
            Vue.set(this, "step", 1);
        },
        sizeTouroku: function (v, targetParts, dno) {
            var numList = [];
            if (this.selected.sessions.ordersheet.sex == 1) {
                numList = v.split("-");

            } else if (this.selected.sessions.ordersheet.sex == 2) {
                numList[0] = 1;
                numList[1] = this.size.ladysNums[v];
            }
            ////// console.log("numList[1]:"+numList[1]);
            ////// console.log(v);
            if (this.selected.sessions.ordersheet[dno] != '' && this.selected.sessions.ordersheet[dno] != null) {
                const query = {
                    headers: {
                        "content-Type": "application/json;charset=UTF-8"
                    },
                    params: {
                        base: numList[0],
                        target: numList[1],
                        katagami: this.selected.sessions.ordersheet[dno]
                    }
                };
                var thista = this;
                axios.get("/sandbox/ajaxTool/getKihonSize.php", query).then(res => {
                    // ////// console.log(res.data);
                    Vue.set(this.selected.size, targetParts, res.data);
                    ////// console.log("対象基本データ("+targetParts+")を取得しselectedに格納");
                    ////// console.log(this.selected.size[targetParts]);
                    ////// console.log(this.selected.size);
                    ////// console.log("↑↑↑↑↑↑");
                    ////// console.log("↑↑↑↑↑↑");
                    ////// console.log("↑↑↑↑↑↑");
                    ////// console.log("↑↑↑↑↑↑");
                    ////// console.log("↑↑↑↑↑↑");
                    if ("sodetake_left" in this.selected.size[targetParts]) {
                        Vue.set(this.selected.size[targetParts], "sodetake_right", this.selected.size[targetParts].sodetake_left);
                    }
                    if ("waist_1" in this.selected.size[targetParts]) {
                        Vue.set(this.selected.size[targetParts], "waist_2", this.selected.size[targetParts].waist_1);
                    }
                    if ("watarihaba1" in this.selected.size[targetParts]) {
                        Vue.set(this.selected.size[targetParts], "watarihaba2", this.selected.size[targetParts].watarihaba1);
                    }
                    if ("susohaba1" in this.selected.size[targetParts]) {
                        Vue.set(this.selected.size[targetParts], "susohaba2", this.selected.size[targetParts].susohaba1);
                    }
                    if ("wo_skirt_1" in this.selected.size[targetParts]) {
                        Vue.set(this.selected.size[targetParts], "wo_skirt_2", this.selected.size[targetParts].wo_skirt_1);
                    }
                    if ("wo_waist_1" in this.selected.size[targetParts]) {
                        Vue.set(this.selected.size[targetParts], "wo_waist_2", this.selected.size[targetParts].wo_waist_1);
                    }
                    ////// console.log(this.selected.size);

                    ////// console.log(res.data);
                })
                ////// console.log(v);
                ////// console.log("size base:"+this.size.baseNum);
                ////// console.log("size target:"+this.size.targetNum);
            }
        },
        getJan: function () {
            // if(this.katagamiNaiUser == false){
            // //// console.log("getJan 現在の状況↓");
            // //// console.log(this.selected.code);
            // //// console.log(this.selectedProductData);
            if (this.selected.code.line != "" && this.selected.code.course != "" && this.selected.code.optionSonota != "" && this.selected.code.optionCourse != "") {

                const query = {
                    headers: {
                        "content-Type": "application/json;charset=UTF-8"
                    },
                    params: {
                        code: this.selected.code,
                        gender: this.selected.gender,
                        productData: this.selectedProductData,

                    }
                };
                var thista = this;
                axios.get("/sandbox/ajaxTool/getJan.php", query).then(res => {
                    // ////// console.log(res.data);

                    //ここ変更した　1001 コメントアウト
                    // thista.optionData = res.data;


                    thista.optionLoad = true;

                    Vue.set(this.selected.code, "result", res.data);
                    Vue.set(this.selected.sessions.ordersheet, "jan_result", res.data);
                    // //// console.log("jancode算出しました");
                    // //// console.log(this.selected.code);
                })
            }
            // }else{
            ////// console.log("jancode 算出無し");
            // }
            // //// console.log('jan code');
            // //// console.log(this.selected.code);
        },
        testSetter: function () {
            this.selected.parts[0] = this.selectparts["men"][0];
            this.selected.course[1][1] = this.masters["style"][1];
        },
        onFabricLoad() {
            const fabrigImg = $(".simulator__preloader").find("img");
            const suitModal = document.querySelector(".suitmodel");

            if (fabrigImg && suitModal) {
                const target = suitModal.contentDocument;
                const [src, width, height] = [fabrigImg.attr("src"), fabrigImg.width(), fabrigImg.height()];

                $(target).find("pattern").not("#buttons").find("image").attr("xlink:href", src).attr("width", width).attr("height", height);
                $(target).find("pattern").not("#buttons").attr("width", width).attr("height", height);

                $('.simulator__image_view img,.simulator__image_view object').addClass('loaded');
                $('.simulator__image_view img,.simulator__image_view object').addClass('loaded');
            }
        },
        texChanger: function (firstflg = false) {
            var isIOS = /[ \(]iP/.test(navigator.userAgent);

            setTimeout(function () {
                ////// console.log('texchanger');
                if ($('.simulator__preloader').length > 0 && $(".suitmodel").length > 0) {
                    $('.simulator__preloader img').imagesLoaded(function () {
                        if (firstflg == true && isIOS) {
                            setTimeout(function () {
                                var target = document.querySelector(".suitmodel").contentDocument;
                                var tex = $(".simulator__preloader").find("img");
                                // alert(tex.attr('src'));
                                $(target).find("pattern").not("#buttons").find("image").attr("xlink:href", tex.attr("src")).attr("width", tex.width()).attr("height", tex.height());
                                $(target).find("pattern").not("#buttons").attr("width", tex.width()).attr("height", tex.height());
                            }, 3000);
                        } else {
                            var target = document.querySelector(".suitmodel").contentDocument;
                            var tex = $(".simulator__preloader").find("img");
                            // alert(tex.attr('src'));
                            $(target).find("pattern").not("#buttons").find("image").attr("xlink:href", tex.attr("src")).attr("width", tex.width()).attr("height", tex.height());
                            $(target).find("pattern").not("#buttons").attr("width", tex.width()).attr("height", tex.height());

                        }
                    });
                }

            }, 500);
        },
        productDataInit: function () {
            axios.get("/sandbox/ajaxTool/getItems.php", query).then(res => {
                var data = res.data;

                //ステータスっぽいのいらんので削除
                delete res.data.productStatus;
                app.productNarabi = res.data.narabi;
                delete res.data.narabi;
                app.productData = res.data;
                app.dataload = true;
                ////// console.log(res.data);
            });
        },
        //選択されたパーツの長さ計算
        targetNagasa: function (targetStyleNo) {
            var result = 0;
            switch (targetStyleNo) {
                case 4:
                    result = parseFloat(this.stocktani.jacket) + parseFloat(this.stocktani.pants);
                    break;
                case 5:
                    result = parseFloat(this.stocktani.jacket) + parseFloat(this.stocktani.pants) + parseFloat(this.stocktani.pants);
                    break;
                case 6:
                    result = parseFloat(this.stocktani.jacket) + parseFloat(this.stocktani.pants) + parseFloat(this.stocktani.jire);
                    break;
                case 1:
                    result = parseFloat(this.stocktani.jacket)
                    break;
                case 3:
                    result = parseFloat(this.stocktani.pants)
                    break;
                case 2:
                    result = parseFloat(this.stocktani.jire)
                    break;
                case 11:
                    result = parseFloat(this.stocktani.jacket) + parseFloat(this.stocktani.skirt);
                    break;
                case 10:
                    result = parseFloat(this.stocktani.jacket) + parseFloat(this.stocktani.pants);
                    break;
                case 15:
                    result = parseFloat(this.stocktani.jacket) + parseFloat(this.stocktani.pants) + parseFloat(this.stocktani.skirt);
                    break;
                case 17:
                    result = parseFloat(this.stocktani.jacket) + parseFloat(this.stocktani.skirt) + parseFloat(this.stocktani.skirt);
                    break;
                case 16:
                    result = parseFloat(this.stocktani.jacket) + parseFloat(this.stocktani.pants) + parseFloat(this.stocktani.pants);
                    break;
                case 12:
                    result = parseFloat(this.stocktani.pants) + parseFloat(this.stocktani.skirt);
                    break;
                case 14:
                    result = parseFloat(this.stocktani.skirt) + parseFloat(this.stocktani.skirt);
                    break;
                case 13:
                    result = parseFloat(this.stocktani.pants) + parseFloat(this.stocktani.pants);
                    break;
                case 7:
                    result = parseFloat(this.stocktani.jacket);
                    break;
                case 9:
                    result = parseFloat(this.stocktani.skirt);
                    break;
                case 8:
                    result = parseFloat(this.stocktani.pants);
                    break;

            }
            return result;
        },

    },
    mounted: function () {
        Vue.nextTick(() => {
            ////// console.log(this.token);
            ////// console.log("mounted");
            app.loading = true;
            this.defaultSelected = this.selected;
            if (getUrlVars()['renzoku'] == '1') {
                app.renzoku = true;
            }

        });
    },
    created: function () {
    }
});

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
