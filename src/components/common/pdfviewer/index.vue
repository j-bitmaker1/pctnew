<template>
<div id="pdfviewer">

    <div class="menu">
        <div class="zoom">
            <div class="item btn" @click="scale -= scale > 0.2 ? 0.1 : 0">
                <i class="fas fa-search-minus"></i>
            </div>
            <div class="item" @click="scale = dscale">
                <value v-if="zoom" :value="zoom" mode="p"/>
                <span v-else></span>
            </div>
            <div class="item btn" @click="scale += scale < 2 ? 0.1 : 0">
                <i class="fas fa-search-plus"></i>
            </div>
            
            
        </div>
        <div class="navigator">
            <div class="item btn" @click="topage(page - 1)">
                <i class="fas fa-arrow-left"></i>
            </div>
            <div class="item">
                <span>{{page}}</span><span v-if="numPages">/</span><span v-if="numPages">{{numPages}}</span>
            </div>
            <div class="item btn" @click="topage(page + 1)">
                <i class="fas fa-arrow-right"></i>
            </div>
        </div>
    </div>

    <div class="pdfwrapper">
        <div>
            <pdfvuer :src="pdfdata" v-for="i in numPages" :key="i" :ref="i" :page="i" :scale.sync="scale" :annotation="true"  @link-clicked="handle_pdf_link">
                <template slot="loading">
                    <linepreloader />
                </template>
            </pdfvuer>
        </div>
    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
<style src="pdfvuer/dist/pdfvuer.css"></style>
