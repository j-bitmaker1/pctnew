<template>
<div class="forms">
    <div class="form" v-if="form">
        <form>
        <div class="field" v-for="(field, i) in fields" :key="field.id">

            <label v-if="field.input != 'checkbox'">{{$t(field.text)}}</label>

            <input v-if="!field.input || field.input == 'input'" :placeholder="field.placeholder || ''" :disabled="field.disabled" :ref="i" :type="field.type" v-model="form[field.id]" v-on:keyup.enter="onEnter(i)"/>

            <textarea v-on:keyup.enter="onEnter(i)" v-if="field.input == 'textarea'" v-model="form[field.id]" :ref="i" :disabled="field.disabled" />

            <select v-if="field.input == 'select'" :disabled="field.disabled" :ref="i" class="custom" v-model="form[field.id]">
                <option :value="v.value" v-for="(v, i) in field.values" :key="i">{{$t(v.text)}}</option>
            </select>

            <div class="radio" v-if="field.input == 'radio'" :ref="i">
                <div class="radioWrapper" v-for="(v, i) in field.values" :key="i">
                    <input  :name="field.id" :id="formid + field.id + '_' + i" type="radio" 
                        :value="v.value || i" v-model="form[field.id]" 
                        >
                    <label :for="formid + field.id + '_' + i">{{$t(v.text)}}</label>
                </div>
            </div>

            <div class="checkbox" v-if="field.input == 'checkbox'" :ref="i">
                <div class="checkboxWrapper">
                    <input :name="field.id" :id="formid + field.id" type="checkbox" 
                        v-model="form[field.id]" 
                        >
                    <label :for="formid + field.id">{{$t(field.text)}}</label>
                </div>
            </div>

            <span class="error" v-if="showerrors && form.errors().has(field.id)">
                {{ form.errors().get(field.id) }}
            </span>
            
        </div>
        </form>

    </div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
