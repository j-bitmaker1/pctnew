<template>
<div id="comparewith_structureinfo">
    <div class="name mobp"><span>{{annuity.name}}</span><template v-if="weight"> &middot; </template><value v-if="weight" :mode="mode" :value="weight"/></div>

    <div class="infotable">
        <div class="line" :class="field.id" v-for="field in fields" v-if="annuity[field.id]">
            <div class="wrapper">
                <div class="label">
                    <span>{{$t('annuity.' + field.id)}}</span> 
                </div>
                <div class="forvalue">
                
                    <template v-if="!(field.type == 'date' && !annuity[field.id])">
                        <span v-if="field.type == 'string'">{{annuity[field.id]}}</span>
                        <date v-if="field.type == 'date'" :date="annuity[field.id]" />
                        <value v-if="field.type == 'p' || field.type == 'd'" :mode="field.type" :value="annuity[field.id]" />
                    </template>

                    <template v-else>
                        <span>&mdash;</span>
                    </template>


                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
