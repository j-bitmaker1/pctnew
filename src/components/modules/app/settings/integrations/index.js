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
        integrationTextByType(type) {
            debugger;
            return this.core.integrations.staticIntegrations.find(
                (int) => int.value === type,
            ).text;
        }
    }),

    methods: {
        add: function () {
            this.core.vueapi.integrationsAdd();
        },
    },
};
