<template lang="pug">
    div.simulator__selector
        div.sorter_flexer
			div.placeholder
            div.simulator__over
                h2.simulator__title Style Order Suit
                div.simulator__choose_message
                    | シミュレーターから、
                    br.break
                    | お好みのスーツをお選びください。
                ul()
                    li(v-on:click="genderChanger('men',1)" v-if="$parent.katagamiNaiUser == true || $parent.tantouFlg == true")
                        span.button.men MEN's
                    li(v-on:click="genderChanger('women',2)" v-if="$parent.katagamiNaiUser == true || $parent.tantouFlg == true")
                        span.button.women LADIES'
</template>