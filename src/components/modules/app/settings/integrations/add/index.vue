<template>
    <div id="settings_integrations_add">
        <div class="cnt">
            <div class="formswrapper mobp">
                <forms
                    @input="inputType"
                    :value="{ type }"
                    ref="fieldsType"
                    :fields="fieldsType"
                />
            </div>

            <div class="formswrapper mobp" v-if="fields">
                <forms
                    @input="input"
                    :value="values || {}"
                    ref="fields"
                    :fields="fields"
                />
            </div>
        </div>

        <div class="savePanel">
            <button class="button" @click="save">Save</button>
        </div>
    </div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
