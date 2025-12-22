export const routersTemp = [
    {
        "redirect": null,
        "path": "/merchant",
        "component": "",
        "children": [
            {
                "redirect": null,
                "path": "/merchant/list",
                "component": "merchant/list/index",
                "parent_id": 7000,
                "meta": {
                    "hidden": false,
                    "icon": "ma-icon-user",
                    "hiddenBreadcrumb": false,
                    "type": "M",
                    "title": "商户列表"
                },
                "name": "merchant:list",
                "id": 7100
            },
            {
                "redirect": null,
                "path": "/merchant/transaction",
                "component": "merchant/transaction/index",
                "parent_id": 7000,
                "meta": {
                    "hidden": false,
                    "icon": "ma-icon-user",
                    "hiddenBreadcrumb": false,
                    "type": "M",
                    "title": "商户交易"
                },
                "name": "merchant:transaction",
                "id": 7200
            },
        ],
        "parent_id": 0,
        "meta": {
            "hidden": false,
            "icon": "ma-icon-user",
            "hiddenBreadcrumb": false,
            "type": "M",
            "title": "商户管理"
        },
        "name": "merchant",
        "id": 7000
    },
    {
        "redirect": null,
        "path": "/transaction",
        "component": "",
        "children": [
            {
                "redirect": null,
                "path": "/transaction/payout",
                "component": "transaction/payout/index",
                "parent_id": 8000,
                "meta": {
                    "hidden": false,
                    "icon": "ma-icon-user",
                    "hiddenBreadcrumb": false,
                    "type": "M",
                    "title": "代付列表"
                },
                "name": "transaction:payout",
                "id": 8100
            },
            {
                "redirect": null,
                "path": "/transaction/payin",
                "component": "transaction/payin/index",
                "parent_id": 8000,
                "meta": {
                    "hidden": false,
                    "icon": "ma-icon-user",
                    "hiddenBreadcrumb": false,
                    "type": "M",
                    "title": "代收列表"
                },
                "name": "transaction:payin",
                "id": 8200
            },
        ],
        "parent_id": 0,
        "meta": {
            "hidden": false,
            "icon": "ma-icon-user",
            "hiddenBreadcrumb": false,
            "type": "M",
            "title": "交易管理"
        },
        "name": "transaction",
        "id": 8000
    }
]