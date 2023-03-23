import { mapState } from 'vuex';

export default {
    name: 'settings_integrations',
    props: {},

    data: function () {
        return {
            loading: true,
            integrations: [],
        };
    },

    created: () => {},

    mounted() {
        this.core.api.pct.integrations
            .get()
            .then((data = []) => {
                this.integrations = [...data];
            })
            .finally(() => {
                this.loading = false;
            });
    },

    watch: {
        //$route: 'getdata'
        // integrations: {
        //     deep: true,
        //     handler(after, before) {
        //         debugger;
        //     },
        // },
    },
    computed: mapState({
        auth: (state) => state.auth,
    }),

    methods: {
        add: function (oldName = '') {
            const editedIntegration = oldName
                ? this.integrations.find((int) => int.Name === oldName)
                : null;

            this.core.vueapi.integrationsAdd(
                (addedIntegration) => {

                    if (!addedIntegration.OldName) {
                        return this.integrations.push({ ...addedIntegration });
                    }

                    const existingIntegration = this.integrations.findIndex(
                        (integration) =>
                            integration.Name === addedIntegration.OldName,
                    );

                    if (existingIntegration > -1) {
                        
                        this.integrations.splice(existingIntegration, 1, {
                            ...addedIntegration,
                        });
                        return;
                    }
                },
                {
                    oldName,
                    editedIntegration,
                },
            );
        },

        integrationTextByType(type) {
            return this.core.integrations.staticIntegrations.find(
                (int) => int.value === type,
            ).text;
        },

        editIntegration(name) {
            const items = [
                {
                    text: 'integrations.editIntegration',
                    icon: 'fas fa-pen',
                    action: () => this.add(name),
                },
                {
                    text: 'integrations.removeIntegration',
                    icon: 'fas fa-times-circle',
                    action: () => this.remove(name),
                },
            ];

            this.core.vueapi.listmenu(items);
        },

        remove: function (Name) {
            this.loading = true;

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
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
};
