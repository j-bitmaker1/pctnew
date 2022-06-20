<template>
<div id="filemanager">

    <div class="topheader mobp" v-if="page.key == 'list'">
        <div>
            <upload :extensions="extensions" @uploadedAll="uploaded" @error="uploadError">
                <template v-slot:content>
                    <button class="button" key="file">
                        <i class="fas fa-plus"></i> Upload File
                    </button>
                </template>
            </upload>
        </div>

        <button class="button black" key="scan" @click="camera" v-if="cordova">
			<i class="fas fa-camera"></i> Camera
		</button>
    </div>

    <div class="topheader mobp" v-if="page.key != 'list'">

        <button class="button black" @click="back">
			<i class="fas fa-angle-left"></i> Back
		</button>
    </div>

    <div class="content">
       <component :scroll="scroll" ref="page" v-if="getmodule()" :is="getmodule()" v-bind="page.data || {}" @openFile="openFile" @createPortfolio="createPortfolio"/>
    </div>

    <div class="uploading" v-if="hasUploading && hasUploading.length">
        <div class="caption mobp" v-if="uploading.length"><span>Do you want to upload {{uploading.length}} file(s)?</span></div>

        <div class="caption mobp" v-if="!uploading.length"><span>Unfortunately, we only support uploading certain file formats: {{extensions.join(', ')}}</span></div>

        <div class="subcaption mobp" v-if="uploading.length && hasUploading.length != uploading.length">
            <span>We do not support uploading files other than certain formats: {{extensions.join(', ')}}</span>
        </div>

        <div class="savePanel">
            <button class="button black" @click="cancelUploadingStore">
                Cancel
            </button>
            <button class="button" v-if="uploading.length" @click="uploadStore">
                Upload
            </button>
        </div>
    </div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
