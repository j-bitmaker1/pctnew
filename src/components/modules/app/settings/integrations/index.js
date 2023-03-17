import { mapState } from 'vuex';

export default {
    name: 'settings_integrations',
    props: {},

    data: function () {
        return {
            loading: false,
            integrations: [],
        };
    },

    created: () => {},

    mounted() {
        this.core.api.pct.integrations.get().then((data) => {
            this.integrations = [...data];
        });
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth: (state) => state.auth,
    }),

    methods: {
        add: function () {
            this.core.vueapi.integrationsAdd((addedIntegration) => {
                const existingIntegration = this.integrations.findIndex(
                    (integration) => integration.Name === addedIntegration.Name,
                );

                if (existingIntegration > -1) {
                    this.integrations.splice(existingIntegration, 1, {
                        ...addedIntegration,
                    });
                    return;
                }

                this.integrations.push({ ...addedIntegration });
            });
        },

        integrationTextByType(type) {
            return this.core.integrations.staticIntegrations.find(
                (int) => int.value === type,
            ).text;
        },

        remove: function (Name) {
            this.core.api.pct.integrations
                .remove({
                    Name,
                })
                .then(() => {
                    const existingIntegration = this.integrations.findIndex(
                        (integration) => integration.Name === Name,
                    );

                    this.integrations.splice(existingIntegration, 1);
                })
                .catch((e) => {
                    this.$store.commit('icon', {
                        icon: 'error',
                        message: e.text,
                    });
                });
        },
    },
};
