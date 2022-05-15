<template>
<div class="forms">
    <div class="form" v-if="form">
        <div class="field" v-for="(field, i) in fields" :key="field.id">

            <label>{{$t(field.text)}}</label>

            <input v-if="!field.input || field.input == 'input'" :placeholder="field.placeholder || ''" :disabled="field.disabled" :ref="i" :type="field.type" v-model="form[field.id]" v-on:keyup.enter="onEnter(i)"/>


            <select v-if="field.input == 'select'" :disabled="field.disabled" :ref="i" class="custom" v-model="form[field.id]">
                <option :value="v.value" v-for="(v, i) in field.values" :key="i">{{$t(v.text)}}</option>
            </select>

            <span class="error" v-if="form.errors().has(field.id)">
                {{ form.errors().get(field.id) }}
            </span>
        </div>


    </div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
