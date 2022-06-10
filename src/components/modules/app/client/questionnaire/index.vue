<template>
<div class="client_questionnaire" :class="{inwnd : wnd}">
    <div class="groups" :key="i" v-for="(group, i) in schema">
		<!--<div class="subcaption mobp">
			<span>{{i}}</span>
		</div>-->

		<div class="fields">

			<list :items="group">
				<template v-slot:default="slotProps">

					<div class="question mobp">
						<span>{{$t(slotProps.item.question)}}</span>
					</div>

					<list :items="slotProps.item.form.schema">
						<template v-slot:default="slotProps">

							<div class="field mobp">

								<div class="label" v-if="slotProps.item.text"><span>{{$t(slotProps.item.text)}}</span></div>

								<div class="value">
									<template v-if="result && result[i] && typeof result[i][slotProps.item.id] != 'undefined'">
										<template v-if="slotProps.item.values && slotProps.item.values[result[i][slotProps.item.id]]">
											<div class="qwra">
												<i class="fas fa-check-circle"></i> <span>{{$t(slotProps.item.values[result[i][slotProps.item.id]].text)}}</span>
											</div>
										</template>
										<template v-else>
											<value :value="result[i][slotProps.item.id]" :mode="slotProps.item.mode" />
										</template>
									</template>
									<template v-else><span>&mdash;</span></template>
								</div>
							</div>

						</template>
					</list>

					

				</template>
			</list>
		   
		</div>
	</div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
