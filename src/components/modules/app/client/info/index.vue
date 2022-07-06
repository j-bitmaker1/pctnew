<template>
<div id="client_info">

	<!--<div class="profileinst">
		<div class="imageWrapper">
			<userpic :userinfo="profile" />
		</div>
		<div class="label">
			<span>{{profile.FName}} {{profile.LName}}</span>
		</div>
	</div>-->

	<div class="groups" :key="i" v-for="(group, i) in schema">
		<div class="caption mobp">
			<span>{{$t(group.text)}}</span>
		</div>

		<div class="fields">

			<list :items="group.fields">
				<template v-slot:default="slotProps">

					 <div class="field mobp">

						<div class="label"><span>{{$t(slotProps.item.text)}}</span></div>

						<div class="value">
							<avalue v-if="profile[slotProps.item.id]" :value="profile[slotProps.item.id]"></avalue>
							<span v-else>&mdash;</span>
						</div>
					</div>

				</template>
			</list>
		   
		</div>
	</div>

	<div v-if="questionnaire" class="questionnaire">
		<div class="caption mobp">
			<span>Questionnaire</span>
		</div>

		<questionnaire :result="questionnaire"/>
	</div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
