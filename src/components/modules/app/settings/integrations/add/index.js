import { mapState } from 'vuex';

export default {
    name: 'settings_integrations_add',
    props: {
        oldName: String,
        editedIntegration: Object || null,
    },

    data: function () {
        return {
            loading: false,
            type: 'AMERITRADE',
            values: {},
        };
    },

    created() {
        if (!this.oldName || !this.editedIntegration) return;
        this.type = this.editedIntegration.Type;

        this.values = {
            IntegrationName: this.oldName,
            Login: this.editedIntegration.Login,
            Password: this.editedIntegration.Password,
            RepCode: this.editedIntegration.Repcode,
        };
    },

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
            this.values = { ...v };
        },

        inputType: function (v) {
            this.type = v.type;
            // this.$refs.fields.fields = [];
            this.values = {};
        },

        save: function () {
            this.values = this.$refs.fields.get();
            // console.log(this.values, this.type, inputValues);
            this.core.api.pct.integrations
                .addOrEdit({
                    NewName: this.values.IntegrationName || '',
                    OldName: this.oldName || '',
                    Type: this.type || '',
                    ILogin: this.values.Login || '',
                    IPassword: this.values.Password || '',
                    Repcode: this.values.RepCode || '',
                })
                .then(() => {
                    this.$emit('changed', {
                        Name: this.values.IntegrationName || '',
                        OldName: this.oldName || '',
                        Login: this.values.Login || '',
                        Password: this.values.Password || '',
                        Repcode: this.values.RepCode || '',
                        Type: this.type || '',
                    });
                })
                .catch((e) => {
                    this.$store.commit('icon', {
                        icon: 'error',
                        message: e.text,
                    });
                })
                .finally(() => {
                    this.$emit('close');
                });
        },
    },
};
