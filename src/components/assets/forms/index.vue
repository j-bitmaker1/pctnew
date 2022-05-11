<template>
<div class="forms">
    <div class="form" v-if="form">
        <div class="field" v-for="field in fields" :key="field.id">

            <label>{{$t(field.text)}}</label>

            <input :type="field.type" v-model="form[field.id]" />

            <span class="error" v-if="form.errors().has(field.id)">
                {{ form.errors().get(field.id) }}
            </span>
        </div>


    </div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
