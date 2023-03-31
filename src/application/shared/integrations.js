const STATIC_INTEGRATIONS = [
    {
        value: 'AMERITRADE',
        text: "TD Ameritrade Institutional's Veo®",
        fields: [
            {
                id: 'IntegrationName',
                text: 'fields.IntegrationName',
                rules: [
                    {
                        rule: 'required',
                    },
                ],
                input: 'input',
            },
            {
                id: 'Login',
                text: 'fields.Login',
                rules: [
                    {
                        rule: 'required',
                    },
                ],
                input: 'input',
            },
            {
                id: 'Password',
                text: 'fields.password',
                type: 'password',
                rules: [
                    {
                        rule: 'required',
                    },
                ],
                input: 'input',
            },
            {
                id: 'RepCode',
                text: 'fields.RepCode',
                rules: [
                    {
                        rule: 'required',
                    },
                ],
                input: 'input',
            },
        ],
    },
    {
        value: 'MORNINGSTAR',
        text: 'Morningstar Office®',
        fields: [
            {
                id: 'IntegrationName',
                text: 'fields.IntegrationName',
                rules: [
                    {
                        rule: 'required',
                    },
                ],
                input: 'input',
            },
            {
                id: 'Login',
                text: 'fields.Login',
                rules: [
                    {
                        rule: 'required',
                    },
                ],
                input: 'input',
            },
            {
                id: 'RepCode',
                text: 'fields.AccessCode',
                rules: [
                    {
                        rule: 'required',
                    },
                ],
                input: 'input',
            },
        ],
    },
    {
        value: 'ORION',
        text: 'Orion®',
        fields: [
            {
                id: 'IntegrationName',
                text: 'fields.IntegrationName',
                rules: [
                    {
                        rule: 'required',
                    },
                ],
                input: 'input',
            },
            {
                id: 'Login',
                text: 'fields.Login',
                rules: [
                    {
                        rule: 'required',
                    },
                ],
                input: 'input',
            },
            {
                id: 'Password',
                text: 'fields.password',
                type: 'password',
                rules: [
                    {
                        rule: 'required',
                    },
                ],
                input: 'input',
            },
        ],
    },
    {
        value: 'BLACKDIAMOND',
        text: 'Black Diamond®',
        fields: [
            {
                id: 'IntegrationName',
                text: 'fields.IntegrationName',
                rules: [
                    {
                        rule: 'required',
                    },
                ],
                input: 'input',
            },
            {
                id: 'Login',
                text: 'fields.Login',
                rules: [
                    {
                        rule: 'required',
                    },
                ],
                input: 'input',
            },
            {
                id: 'Password',
                text: 'fields.password',
                type: 'password',
                rules: [
                    {
                        rule: 'required',
                    },
                ],
                input: 'input',
            },
        ],
    },
    {
        value: 'STERNEAGEE',
        text: 'SA Stone®',
        fields: [
            {
                id: 'IntegrationName',
                text: 'fields.IntegrationName',
                rules: [
                    {
                        rule: 'required',
                    },
                ],
                input: 'input',
            },
            {
                id: 'Login',
                text: 'fields.Login',
                rules: [
                    {
                        rule: 'required',
                    },
                ],
                input: 'input',
            },
            {
                id: 'Password',
                text: 'fields.password',
                type: 'password',
                rules: [
                    {
                        rule: 'required',
                    },
                ],
                input: 'input',
            },
            {
                id: 'RepCode',
                text: 'fields.RepCode',
                rules: [
                    {
                        rule: 'required',
                    },
                ],
                input: 'input',
            },
        ],
    },
    {
        value: 'REDTAIL',
        text: 'Redtail®',
        fields: [
            {
                id: 'IntegrationName',
                text: 'fields.IntegrationName',
                rules: [
                    {
                        rule: 'required',
                    },
                ],
                input: 'input',
            },
            {
                id: 'Login',
                text: 'fields.Login',
                rules: [
                    {
                        rule: 'required',
                    },
                ],
                input: 'input',
            },
            {
                id: 'Password',
                text: 'fields.password',
                type: 'password',
                rules: [
                    {
                        rule: 'required',
                    },
                ],
                input: 'input',
            },
        ],
    },
    {
        value: 'ALBRIDGE',
        text: 'Albridge®',
        fields: [
            {
                id: 'IntegrationName',
                text: 'fields.IntegrationName',
                rules: [
                    {
                        rule: 'required',
                    },
                ],
                input: 'input',
            },
            {
                id: 'Login',
                text: 'fields.Login',
                rules: [
                    {
                        rule: 'required',
                    },
                ],
                input: 'input',
            },
            {
                id: 'Password',
                text: 'fields.password',
                type: 'password',
                rules: [
                    {
                        rule: 'required',
                    },
                ],
                input: 'input',
            },
            {
                id: 'RepCode',
                text: 'fields.RepCode',
                rules: [
                    {
                        rule: 'required',
                    },
                ],
                input: 'input',
            },
        ],
    },
    {
        value: 'SCHWAB',
        text: 'Charles Schwab Corporation®',
        fields: [
            {
                id: 'IntegrationName',
                text: 'fields.IntegrationName',
                rules: [
                    {
                        rule: 'required',
                    },
                ],
                input: 'input',
            },
            {
                id: 'Login',
                text: 'fields.Login',
                rules: [
                    {
                        rule: 'required',
                    },
                ],
                input: 'input',
            },
        ],
    },
];

class SingleIntegration {
    constructor(staticIntegration) {
        const { value, text, fields } = staticIntegration;
        this.value = value;
        this.text = text;
        this.fields = fields;
    }
}

class Integrations {
    constructor() {
        this.staticIntegrations = STATIC_INTEGRATIONS.map(
            (integration) => new SingleIntegration(integration),
        );
    }
}

export default Integrations;
