<template>
<div id="camera">

    <div class="topheader mobp">
        <!--<div class="logowrapper">
            <logotype />
        </div>-->

        <div class="cancelWrapper">
            <div class="buttonpanel" @click="cancel">
                <i class="fas fa-times"></i>
            </div>
        </div>
    </div>
    <!--<div class="closecamera" @click="cancel" v-if="!current">
        {{ $t("app.cancel") }}
    </div>-->

    <div class="src" v-if="current">
        <bgimage :src="current" />
    </div>

    <div class="mask" :class="{'hasselected' : count > 0 && !focused}" v-if="mask">
        <div class="area">
        </div>

        <div class="title" v-if="mask.title">
            {{mask.title}}
        </div>
    </div>

    <div class="useselected" @click="blur" :class="{'notfocused' : focused}" v-if="count && !current">
            <div class="wcaption">
                <span>Selected images: {{count}}</span>
            </div>

            <div class="buttonsRow">
                <button class="button small" @click="useselected">Use selected</button>
                <button class="button small ghost" @click="clearselected">Clear</button>
            </div>
    </div>

    <div class="takepicture mbtn" @click="takePicture" v-if="ready && !current">
        <i class="fas fa-camera" v-if="focused || !count"></i>
        <i class="fas fa-redo-alt" v-else></i>
    </div>

    <div class="selectfromstorage sbtn" v-if="!current">

        <upload @start="(files) => uploadStart(files)" @uploaded="(data) => uploadUploaded(data)" @uploadedAll="(result) => uploadUploadedAll(result)" @error="(error) => uploadError(error)" :multiple="upload.multiple" :extensions="upload.extensions" :images="upload.images">
            <template v-slot:content>
                <i class="fas fa-photo-video"></i>
            </template>

            <template v-slot:dropzone>

            </template>

        </upload>
    </div>

    <div class="library" v-if="!current && photos && (photos.length || photolibraryaccessdecline)">
        <div class="liblist">

            <div class="access" @click="initlibraryagain">
                <div>
                    <div>
                        <div class="icon"><i class="fas fa-lock"></i></div>
                        <div class="label">
                            <span>Library</span>
                        </div>
                    </div>
                </div>
            </div>

            <list :items="photos">
                <template v-slot:default="slotProps">
                    <div class="imageWrapper">

                        <bgimage :src="thubnails[slotProps.item.id]" @click="e => showfull(slotProps.item.id)" />
                        <div class="select" @click="e => select(slotProps.item.id)">
                            <i class="fas fa-check-circle" v-if="selected[slotProps.item.id]"></i>
                            <i class="far fa-circle" v-else></i>
                        </div>
                    </div>
                </template>
            </list>

            
            
        </div>

       
    </div>

    <div class="panel" v-if="current">
        <div class="buttons">

            <span class="newpicture" @click="newpicture" v-if="!this.full">
                <i class="fas fa-times"></i> Reshoot
            </span>

            <span class="exitfull" @click="exitfull" v-else>
                <i class="fas fa-times"></i> Cancel
            </span>

            <span class="getselected" @click="getselected" v-if="!this.full">
                <i class="fas fa-check"></i> Use picture
            </span>

        </div>
    </div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
