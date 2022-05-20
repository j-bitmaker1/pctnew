<template>
<div id="riskscore">
    <questionnaire v-if="part == 'q'" :initial="values" @intermediate="questionnaireIntermediate" @finish="questionnaireFinished" :questions="allquestions" />

    <secondpart v-if="part == 'r'" @changecr="changecr" @finish="next" @back="back" :points="crvalue" :values="values"/>

    <questionnaire v-if="part == 'f'" :initial="values" @intermediate="questionnaireIntermediate" @finish="questionnaireFinished" :questions="finishQuestion" />

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
