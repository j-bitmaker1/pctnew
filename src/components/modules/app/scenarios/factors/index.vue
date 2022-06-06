<template>
<div class="scenarios_factors">
        
    <div class="mobp infopt">
        <div class="caption">
            <span>Factors</span>
        </div>
    </div>

    <div class="factors ">
        <list :items="info.factors">
            <template v-slot:default="slotProps">

                <div class="factor mobp">
                    <div class="name">
                        <span>{{slotProps.item.name}}</span>
                    </div>
                    <div class="value">
                        <value :value="slotProps.item.value / 100" mode="p" />
                    </div>
                </div>

            </template>
        </list>
    </div>
    

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
