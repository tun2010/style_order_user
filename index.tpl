<!--{*
 * This file is part of EC-CUBE
 *
 * Copyright(c) 2000-2014 LOCKON CO.,LTD. All Rights Reserved.
 *
 * http://www.lockon.co.jp/
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.


 css,js は　nodedirディレクトリの中で管理されています。
 *}-->

<!--{strip}-->
<script src="<!--{$smarty.const.TOP_URL}-->nodedir/src/lib/vue.js"></script>
<script src="<!--{$smarty.const.TOP_URL}-->nodedir/src/lib/axios.min.js"></script>
<script src="<!--{$smarty.const.TOP_URL}-->nodedir/src/lib/jquery-1.12.4.min.js"></script>
<script src="<!--{$smarty.const.TOP_URL}-->scripts/lazy/jquery.lazy.min.js"></script>
<script src="<!--{$smarty.const.TOP_URL}-->scripts/imagesloaded.pkgd.min.js"></script>
<script src="<!--{$smarty.const.TOP_URL}-->scripts/imagesloaded.pkgd.min.js"></script>
<script src="<!--{$smarty.const.TOP_URL}-->scripts/ui-slider/jquery-ui-slider.min.js"></script>
<script src="<!--{$smarty.const.TOP_URL}-->scripts/ui-slider/jquery.ui.touch-punch.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/url-search-params/1.1.0/url-search-params.js"></script>
<link rel="stylesheet" href="<!--{$smarty.const.TOP_URL}-->scripts/ui-slider/jquery-ui-slider.min.css">
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<script>
        window.token = "<!--{$token}-->";
        window.taxrate = "<!--{$taxrate}-->";
        window.raitenyoyaku = "<!--{$yoyakuURI}-->";
        window.svgList = JSON.parse('<!--{$svgList}-->');
    </script>
    <div id="app">
        <p style='text-align:center; font-size: 30px;'>※こちらはテスト用画面です。</p>
        <loadinger v-if="loading == true"></loadinger>
        <preloader></preloader>
        <div class="simulator" v-if="sessionDataLoadFlg">
            <div class="simulator__frame">
                <!-- <p class="delivery_date"><span>最短納期：</span><time>{{deliveryDate}}</time></p> -->
                <headstep v-if='staffstartFlg == false'></headstep>
                <staffstart v-if='staffstartFlg'></staffstart>
                <template v-else>


                <size v-if="step == 4"></size>
                <finalstaff v-if="step == 7"></finalstaff>
                <div class="simulator__flexer" v-else-if="step != 4 && step != 7">
                <div class="simulator__left">
                    <transition name="fade" mode="out-in">
                        <itemlist transition="expand" v-if="step == 1" v-bind:productdata="productData" v-bind:tantouflg="tantouFlg" v-bind:uploadpass="uploadPass"></itemlist>

                        <itemlistselectparts v-else-if="step == 2" v-bind:tantouflg="tantouFlg" v-bind:uploadpass="uploadPass"></itemlistselectparts>
                        <itemlistselectpartsdesign v-else-if="step == 3" :partsdata="selectparts" v-bind:tantouflg="tantouFlg" v-bind:uploadpass="uploadPass"></itemlistselectpartsdesign>
                        <itemlistselectpartsoption v-else-if="step == 5" :partsdata="selectparts" v-bind:tantouflg="tantouFlg" v-bind:uploadpass="uploadPass"></itemlistselectpartsoption>

                        <confirm v-if="step == 6"></confirm>
                    </transition>
                    <totalprice></totalprice>
                    <div class='itemlistInfo' v-if="step == 1">
                        <div class="itemlistInfo__flexer">
                            <p>
                                <span class="product__list__icon icon_mizuiro">W</span>
                                <span>ウォッシャブル</span>
                                <!-- <span class="itemlistInfo__btn">INFO</span> -->
                            </p>
                            <p>
                                    <span class="product__list__icon icon_gray">P</span>
                                    <span>プリーツ</span>
                                <!-- <span class="itemlistInfo__btn">INFO</span> -->
                                </p>
                        </div>
                    </div>
                </div>
                <div class="simulator__right">
                    <rightutil></rightutil>
                    <imageview v-bind:uploadpass="uploadPass"></imageview>
                </div>
                </div>
            </template>
            <controller></controller>
            </div>
        </div>
        <!-- //読み込み完了前 -->
        <div class="simulator" v-else>
                <div class="simulator__frame simulator__loadinger">
                    <p>Loading</p>
                </div>
        </div>
            <!-- ↑読み込み完了前 -->
        <div class="modals">
            <reservationmodal v-bind:uploadpass="uploadPass" v-if="kakuhoFlg == true"></reservationmodal>
            <emailmodal v-if="emailModalFlg == true"></emailmodal>
            <optionModal v-if="optionModalFlg == true"></optionModal>
            <optionsetModal v-if="optionsetModalFlg == true"></optionsetModal>
            <sortModal v-if="sortFlg == true"></sortModal>
            <productinfomodal v-if="productInfoFlg == true"></productinfomodal>
            <productselectmodal v-if="productSelectFlg == true"></productselectmodal>
            <imageandvideoModal v-if="imageAndVideoModalFlg == true"></imageandvideoModal>
            <sizeselectmodal v-if="sizeSelectModalFlg == true"></sizeselectmodal>
            <katagamiinfomodal v-if="katagamiInfoFlg == true"></katagamiinfomodal>
        </div>

    </div>

    <script src="<!--{$smarty.const.TOP_URL}-->nodedir/dist/bundle.js"></script>
<!--{/strip}-->

