<template>
<div id="wai-changepassword">

    <div class="lwork">

        <div class="maket topCaption">
            <div class="caption section">
                {{ $t("common.2901009") }}
            </div>
        </div>
    </div>

    <div class="maket leftPart">

        <div class="sitelogin section">
            <div class="form">

                <div class="item">
                    <div class="label">
                        <div class="lwork">
                            <span>{{ $t("common.2901011") }}</span>
                        </div>
                    </div>
                    <div class="input"><input type="password" value="" v-model="oldpassword" autocomplete="off" /></div>
                </div>

            </div>

        </div>

        <div class="savePanel">
            <button class="button black" @click="cancel">
                Cancel
            </button>
            <button class="button" @click="save" :disabled="!haschanges">
                Save
            </button>
        </div>

    </div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
