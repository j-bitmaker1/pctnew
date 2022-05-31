<template>
<div id="pincode" :class="{error}">

    <div class="caption" v-if="mode == 'create'">
        <span v-if="validcode && confirm">Confirm pincode</span>
        <span v-else>Create pincode</span>
    </div>

    <div class="caption" v-if="mode == 'enter'">
        <span v-if="error">Invalid pincode</span>
        <span v-else>Enter pincode</span>
    </div>

    <div class="code">
        <PincodeInput :autofocus="false" v-if="!validcode || !confirm" :secure="true" v-model="code" placeholder="•" :length ="length"/>
        <PincodeInput :autofocus="false" v-if="validcode && confirm" :secure="true" v-model="confirmcode" placeholder="•" :length ="length"/>
    </div>

    <div class="savePanel" v-if="mode == 'create'">
		<button class="button black" @click="cancel" v-if="!validcode">
			Cancel
		</button>

        <button class="button black" @click="back" v-if="validcode && confirm">
			Back
		</button>

		<button class="button" @click="result" :disabled="!(validcode && (!confirm || confirm && confirmcode == code))">
			Save
		</button>
	</div>

    <div class="savePanel" v-if="mode == 'enter'">
		<button class="button black" @click="cancel">
			Cancel
		</button>

		<button class="button" @click="result" :disabled="!(validcode)">
			Apply
		</button>
	</div>
    <!--<forms :fields="fields" />-->
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
