<template>
<div id="riskscore">

    <questionnaire :direction="direction" key="c" v-if="part == 'c'" @back="back" :initial="values" @finish="commonFinished" :questions="commonQuestions" />

    <questionnaire :direction="direction" key="q" v-if="part == 'q'" @back="back" :initial="values" @intermediate="intermediate" @finish="questionnaireFinished" :questions="allquestions" />

    <secondpart :direction="direction" key="r" v-if="part == 'r'" @changecr="changecr" @changecapacity="changecapacity" @finish="next" @back="back" :values="values" :points="crvalue" :capacityValues="capacityValues"/>

    <questionnaire :direction="direction" key="f" v-if="part == 'f'" @back="back" :initial="values" @intermediate="last"  :questions="finishQuestions" />

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
