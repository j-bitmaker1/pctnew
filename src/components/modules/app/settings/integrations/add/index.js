import { mapState } from 'vuex';

export default {
    name: 'settings_integrations_add',
    props: {},

    data: function () {
        return {
            loading: false,
            type: 'AMERITRADE',
            values: {},
        };
    },

    created: () => {},

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth: (state) => state.auth,

        fieldsType: function () {
            return [
                {
                    id: 'type',
                    text: 'campaigns.fields.start.IntegrationId',
                    input: 'select',

                    values: this.core.integrations.staticIntegrations,

                    rules: [],
                },
            ];
        },

        fields: function () {
            const { type } = this;

            return this.core.integrations.staticIntegrations.find(
                (int) => int.value === type,
            ).fields;
        },
    }),

    methods: {
        input: function (v) {
            this.values = v
        },

        inputType: function (v) {
            this.type = v.type;
            this.values = {};
        },

        save: function () {
            this.values = this.$refs.fields.get();
        },
    },
};
