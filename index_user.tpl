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

<style>

.slideup-enter-active {
    animation: slideup .4s ease;
}
.slideup-enter-active .simulator__modal__back  {
    animation: slidefader .4s ease;
}
.slideup-enter-active .simulator__modal__wrap {
    animation: slideuper .4s ease;
}

.slideup-leave-active {
    animation: slidefader .4s ease reverse;
}
.slideup-leave-active .simulator__modal__wrap {
    animation: slideuper .4s ease reverse;
}

@keyframes slideup {
    0% {
        opacity: 1;
    }
    100%{
        opacity: 1;
    }
}

@keyframes slidefader {
    0% {
        opacity: 0;
    }
    100%{
        opacity: 1;
    }
}

@keyframes slideuper {
    0% {
        opacity: 0;
        translate: 0 60px;
    }
    100%{
        opacity: 1;
        translate: 0 0;
    }
}
@keyframes slideleave {
    0% {
        opacity: 1;
        scale: 1;
    }
    100%{
        opacity: 0;
        scale: 1.2;
    }
}

</style>

<!--{strip}-->
<script src="<!--{$smarty.const.TOP_URL}-->nodedir/src/lib/vue.js"></script>
<script src="<!--{$smarty.const.TOP_URL}-->nodedir/src/lib/axios.min.js"></script>
<script src="<!--{$smarty.const.TOP_URL}-->nodedir/src/lib/jquery-1.12.4.min.js"></script>
<script src="<!--{$smarty.const.TOP_URL}-->scripts/lazy/jquery.lazy.min.js"></script>
<script src="<!--{$smarty.const.TOP_URL}-->scripts/imagesloaded.pkgd.min.js"></script>
<script src="<!--{$smarty.const.TOP_URL}-->scripts/imagesloaded.pkgd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/url-search-params/1.1.0/url-search-params.js"></script>
<script>
        window.token = "<!--{$token}-->";
        window.taxrate = "<!--{$taxrate}-->";
        window.raitenyoyaku = "<!--{$yoyakuURI}-->";
        window.svgList = JSON.parse('<!--{$svgList}-->');
    </script>
    <div id="app">
        <preloader></preloader>
        <div class="loading-template" v-if="loading == true">
            <loadinger></loadinger>
        </div>
        <template v-if="sessionDataLoadFlg">
            <div class="full-template" v-if="step == 0">
                <gender></gender>
            </div>
            <div class="simulator-template" :class="{ 'simulator-template--options': step > 5 }" v-else>
                <div class="headstep">
                    <headstep></headstep>
                </div>
                <div class="totalprice">
                    <totalprice></totalprice>
                </div>
                <div class="messagner">MESSANGER</div>
                <div class="simulator-object">
                    <imageview v-bind:uploadpass="uploadPass"></imageview>
                </div>
                <div class="simulator-controls">
                    <transition name="fade" mode="out-in">
                        <itemlist v-if="step == 1" transition="expand" v-bind:productdata="productData" v-bind:tantouflg="tantouFlg" v-bind:uploadpass="uploadPass"></itemlist>
                        <itemlistselectparts v-else-if="step == 2" v-bind:tantouflg="tantouFlg" v-bind:uploadpass="uploadPass"></itemlistselectparts>
                        <itemlistselectpartsdesign v-else-if="step == 3" v-bind:tantouflg="tantouFlg" v-bind:uploadpass="uploadPass"></itemlistselectpartsdesign>
                        <itemlistselectpartsbutton v-else-if="step == 4" v-bind:tantouflg="tantouFlg" v-bind:uploadpass="uploadPass"></itemlistselectpartsbutton>
                        <itemlistselectpartsfabric v-else-if="step == 5" v-bind:tantouflg="tantouFlg" v-bind:uploadpass="uploadPass"></itemlistselectpartsfabric>
                        <itemlistselectpartsoption v-else-if="step == 6" v-bind:tantouflg="tantouFlg" v-bind:uploadpass="uploadPass"></itemlistselectpartsoption>
                    </transition>
                </div>
                <div class="simulator-actions">
                    <stepactions></stepactions>
                </div>
            </div>
        </template>
        <!--
        <div class="simulator" v-if="sessionDataLoadFlg">
            <div class="simulator__frame">
                <headstep v-if='staffstartFlg == false && step > 0'></headstep>
                <staffstart v-if='staffstartFlg'></staffstart>
                <gender transition="expand" v-else-if="step == 0"></gender>
                <template v-else>
                    <finalstaff v-if="step == 7"></finalstaff>
                    <div class="simulator__flexer" v-else-if="step != 7">
                        <div class="simulator__left">
                            <totalprice></totalprice>
                            <transition name="fade" mode="out-in">
                                <itemlist transition="expand" v-if="step == 1" v-bind:productdata="productData" v-bind:tantouflg="tantouFlg" v-bind:uploadpass="uploadPass"></itemlist>

                                <itemlistselectparts v-else-if="step == 2" v-bind:tantouflg="tantouFlg" v-bind:uploadpass="uploadPass"></itemlistselectparts>
                                <itemlistselectpartsdesign v-else-if="step == 3" :partsdata="selectparts" v-bind:tantouflg="tantouFlg" v-bind:uploadpass="uploadPass"></itemlistselectpartsdesign>
                                <itemlistselectpartsoption v-else-if="step == 5" :partsdata="selectparts" v-bind:tantouflg="tantouFlg" v-bind:uploadpass="uploadPass"></itemlistselectpartsoption>
                                <size v-if="step == 4"></size>

                                <confirm v-if="step == 6"></confirm>
                            </transition>
                    </div>
                </template>
                <controller v-if="step != 0 || staffstartFlg"></controller>
            </div>
        </div>
        -->
        <div class="modals">
            <transition name="slideup">
                <reservationmodal key="reservation" v-bind:uploadpass="uploadPass" v-if="kakuhoFlg == true"></reservationmodal>
                <emailmodal key="email" v-if="emailModalFlg == true"></emailmodal>
                <optionModal key="option" v-if="optionModalFlg == true"></optionModal>
                <optionsetModal key="optionset" v-if="optionsetModalFlg == true"></optionsetModal>
                <sortModal key="sort" v-if="sortFlg == true"></sortModal>
                <productinfomodal key="product-info" v-if="productInfoFlg == true"></productinfomodal>
                <productselectmodal key="product" v-if="productSelectFlg == true"></productselectmodal>
                <imageandvideoModal key="media" v-if="imageAndVideoModalFlg == true"></imageandvideoModal>
                <sizeselectmodal key="size" v-if="sizeSelectModalFlg == true"></sizeselectmodal>
                <katagamiinfomodal key="katagami" v-if="katagamiInfoFlg == true"></katagamiinfomodal>
            </transition>
        </div>

    </div>

    <script src="<!--{$smarty.const.TOP_URL}-->nodedir/dist/bundle_user.js"></script>
<!--{/strip}-->

