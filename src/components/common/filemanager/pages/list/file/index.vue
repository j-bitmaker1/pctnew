<template>
<div class="filemanager_list_file" @click="open">

    <div class="filepreviewWrapper">
        <filespreview :info="file.info" />
    </div>

    <div class="data">

        <div class="name" >
            <span v-if="name">{{name}}</span>
            <span v-else>&mdash;</span>
        </div>
        <div class="meta" >
            <span v-if="size">{{size}}, </span>
            <date :date="file.completed || file.created" />
        </div>

        <div class="extended" v-if="!cut" >

            <div class="process" :key="i" v-for="(i) in processes">
                
            
                    <template v-if="i == 'PARSEPORTFOLIO' && tasks[i]">
                        <div class="contents" v-if="tasks[i].status == 'SUCCESS' && tasks[i].data && tasks[i].data.length">
                            <div class="ticker" v-if="asset.Ticker && asset.Value" :key="i" v-for="(asset, i) in tasks[i].data">
                                <span>{{asset.Ticker}}</span>
                            </div>
                        </div>
                    </template>

                    <div class="progress" v-if="tasks[i] && (tasks[i].status == 'ACTIVE' || tasks[i].status == 'NEW')">
                        <div class="processcaption">
                            <span>{{$t('filemanager.processes.' + i)}}</span>
                        </div>
                        <div class="row">
                            <div class="bg" :style="{width : (tasks[i].progress) + '%'}">
                            </div>
                        </div>
                        <div class="value">
                            <value :value="tasks[i].progress / 100" mode="p" />
                        </div>
                    </div>

                    <div class="failed" v-if="tasks[i] && tasks[i].status == 'FAULTED'">
                        <span>Sorry, auto-recognition of this file is not possible.</span>
                    </div>
                    
                    <template v-if="tasks[i] && i == 'PARSEPORTFOLIO'">
                        <div class="failed" v-if="(!tasks[i].data || !tasks[i].data.length) && tasks[i].status == 'SUCCESS'">
                            <span>No items found in this file.</span>
                        </div>
                    </template>
                    

                    <div class="processpanel removeclick" v-if="!tasks[i]">
                        <button class="button small" @click="e => runprocess(i)">Run {{$t('filemanager.processes.' + i)}}</button>
                    </div>

                    <div class="processpanel removeclick" v-if="tasks[i] && tasks[i].status == 'FAULTED'">
                        <button class="button small" @click="e => restartprocess(i)">Try again</button>
                    </div>
            </div>

            
        </div>

    </div>

    <div class="formenu" v-if="!nomenu">
        <filemenu :file="file" @deleted="deleted"/>
    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
