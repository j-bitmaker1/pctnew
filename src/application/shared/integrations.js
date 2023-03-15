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
                    // {
                    //     rule: 'email',
                    // },
                    // {
                    //     rule: 'min:5',
                    // },
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
                    {
                        rule: 'email',
                    },
                    {
                        rule: 'min:5',
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
                    {
                        message: 'fields.strongpassword',
                        rule: 'regex:^(?=.*[!@#$%^&*-])(?=.*[0-9])(?=.*[A-Z]).{8,20}$',
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
                    // {
                    //     rule: 'email',
                    // },
                    // {
                    //     rule: 'min:5',
                    // },
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
                    // {
                    //     rule: 'email',
                    // },
                    // {
                    //     rule: 'min:5',
                    // },
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
                    {
                        rule: 'email',
                    },
                    {
                        rule: 'min:5',
                    },
                ],
                input: 'input',
            },
            {
                id: 'AccessCode',
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
                    // {
                    //     rule: 'email',
                    // },
                    // {
                    //     rule: 'min:5',
                    // },
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
                    {
                        rule: 'email',
                    },
                    {
                        rule: 'min:5',
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
                    {
                        message: 'fields.strongpassword',
                        rule: 'regex:^(?=.*[!@#$%^&*-])(?=.*[0-9])(?=.*[A-Z]).{8,20}$',
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
                    // {
                    //     rule: 'email',
                    // },
                    // {
                    //     rule: 'min:5',
                    // },
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
                    {
                        rule: 'email',
                    },
                    {
                        rule: 'min:5',
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
                    {
                        message: 'fields.strongpassword',
                        rule: 'regex:^(?=.*[!@#$%^&*-])(?=.*[0-9])(?=.*[A-Z]).{8,20}$',
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
                    // {
                    //     rule: 'email',
                    // },
                    // {
                    //     rule: 'min:5',
                    // },
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
                    {
                        rule: 'email',
                    },
                    {
                        rule: 'min:5',
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
                    {
                        message: 'fields.strongpassword',
                        rule: 'regex:^(?=.*[!@#$%^&*-])(?=.*[0-9])(?=.*[A-Z]).{8,20}$',
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
                    // {
                    //     rule: 'email',
                    // },
                    // {
                    //     rule: 'min:5',
                    // },
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
                    // {
                    //     rule: 'email',
                    // },
                    // {
                    //     rule: 'min:5',
                    // },
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
                    {
                        rule: 'email',
                    },
                    {
                        rule: 'min:5',
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
                    {
                        message: 'fields.strongpassword',
                        rule: 'regex:^(?=.*[!@#$%^&*-])(?=.*[0-9])(?=.*[A-Z]).{8,20}$',
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
                    // {
                    //     rule: 'email',
                    // },
                    // {
                    //     rule: 'min:5',
                    // },
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
                    {
                        rule: 'email',
                    },
                    {
                        rule: 'min:5',
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
                    {
                        message: 'fields.strongpassword',
                        rule: 'regex:^(?=.*[!@#$%^&*-])(?=.*[0-9])(?=.*[A-Z]).{8,20}$',
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
                    // {
                    //     rule: 'email',
                    // },
                    // {
                    //     rule: 'min:5',
                    // },
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
                    // {
                    //     rule: 'email',
                    // },
                    // {
                    //     rule: 'min:5',
                    // },
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
                    {
                        rule: 'email',
                    },
                    {
                        rule: 'min:5',
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
