<template>
<div class="forms">
    <div class="form" v-if="form">
        <div class="fgroup" :class="i" v-for="(g, i) in groups" :key="i">

            <div class="groupcaption" v-if="g.name">
                <span>{{$t(g.name)}}</span>
            </div>

            <div class="fields">

                <div class="field" v-for="(field, i) in g.fields" :key="field.id">

                    <label v-if="field.input != 'checkbox' && field.input != 'slider'">{{$t(field.text)}} <sup v-if="field.__required">*</sup></label>

                    <input v-if="!field.input || field.input == 'input'" :placeholder="field.placeholder || ''" :disabled="field.disabled" :ref="i" :type="field.type" v-model="form[field.id]" v-on:keyup.enter="onEnter(i)"/>

                    <input v-if="field.input == 'phone'" v-mask="'(###) ###-####'" :placeholder="field.placeholder || ''" :disabled="field.disabled" :ref="i" v-model="form[field.id]" v-on:keyup.enter="onEnter(i)"/>

                    <input v-if="field.input == 'currency'" :placeholder="field.placeholder || ''" :disabled="field.disabled" :ref="i" type="number" v-model="form[field.id]" v-on:keyup.enter="onEnter(i)"/>


                    <textarea v-on:keyup.enter="onEnter(i)" v-if="field.input == 'textarea'" v-model="form[field.id]" :ref="i" :disabled="field.disabled" />

                    <select v-if="field.input == 'select'" :disabled="field.disabled" :ref="i" class="custom" v-model="form[field.id]">
                        <option :value="v.value" v-for="(v, i) in field.values" :key="i">{{$t(v.text)}}</option>
                    </select>

                    <datepicker :type="field.type" :options="field.options" :range="field.range" v-if="field.input == 'date'" :disabled="field.disabled" :ref="i" v-model="form[field.id]"/>
                    
                    <timezonepicker v-if="field.input == 'timezone'" :ref="i" v-model="form[field.id]"/>

            
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
                            <input :disabled="field.disabled" :name="field.id" :id="formid + field.id" type="checkbox" 
                                v-model="form[field.id]" 
                                >
                            <label :for="formid + field.id">{{$t(field.text)}}</label>
                        </div>
                    </div>

                    <div class="sliderWrapper" v-if="field.input == 'slider'" :ref="i">
                        <slider v-model="form[field.id]" :name="$t(field.text)" :id="formid + field.id" :options="sliderOptions(field)"/>
                    </div>

                    <div class="vueapiwrapper" v-if="field.input == 'vueapi'" :ref="i">
                        <label class="bs" @click="e => vueapi(field)">{{$t(field.settings.label)}}</label>
                        <label v-if="form[field.id] && form[field.id].label">{{form[field.id].label}}</label>
                        <i v-if="form[field.id]" class="fas fa-times-circle" @click="e => release(field)"></i>
                        <label v-else>Nothing selected</label>
                    </div>

                    <span class="error" v-if="showerrors && form.errors().has(field.id)">
                        {{ form.errors().get(field.id) }}
                    </span>
                    
                </div>
            </div>
        </div>

    </div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
