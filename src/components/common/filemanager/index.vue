<template>
<div id="filemanager">

    <div class="topheader mobp">
        <div>
            <upload :extensions="['csv', 'xls', 'xlsx', 'pdf']" @uploadedAll="uploaded" @error="uploadError">
                <template v-slot:content>
                    <button class="button" key="file">
                        <i class="fas fa-plus"></i> Upload File
                    </button>
                </template>
            </upload>
        </div>

        <button class="button black" key="scan" @click="camera">
			<i class="fas fa-camera"></i> Camera
		</button>
    </div>

    <div class="content">
       <component ref="page" v-if="getmodule()" :is="getmodule()" v-bind="page.data || {}"/>
    </div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
