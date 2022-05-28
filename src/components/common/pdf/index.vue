<template>
<div id="pdf">
    <div id="buttons" class="ui grey three item inverted bottom fixed menu transition hidden">
        <a class="item" @click="page > 1 ? page-- : 1">
            <i class="left chevron icon"></i>
            Back
        </a>
        <a class="ui active item">
            {{page}} / {{ numPages ? numPages : '∞' }}
        </a>
        <a class="item" @click="page < numPages ? page++ : 1">
            Forward
            <i class="right chevron icon"></i>
        </a>
    </div>
    <div id="buttons" class="ui grey three item inverted bottom fixed menu transition hidden">
        <a class="item" @click="scale -= scale > 0.2 ? 0.1 : 0">
            <i class="left chevron icon" />
            Zoom -
        </a>
        <a class="ui active item">
            {{ formattedZoom }} %
        </a>
        <a class="item" @click="scale += scale < 2 ? 0.1 : 0">
            Zoom +
            <i class="right chevron icon" />
        </a>
    </div>
    <pdfvuer :src="pdfdata" v-for="i in numPages" :key="i" :id="i" :page="i" :scale.sync="scale" style="width:100%;margin:20px auto;" :annotation="true" :resize="true" @link-clicked="handle_pdf_link">
        <template slot="loading">
            loading content here...
        </template>
    </pdfvuer>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
<style src="pdfvuer/dist/pdfvuer.css"></style>
