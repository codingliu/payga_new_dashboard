export const routersTemp = [
    {
        "redirect": null,
        "path": "/orders",
        "component": "",
        "children": [{
            "redirect": null,
            "path": "/orders/all",
            "component": "orders/all/index",
            "parent_id": 3000,
            "meta": {
                "hidden": false,
                "icon": "ma-icon-user",
                "hiddenBreadcrumb": false,
                "type": "M",
                "title": "代收订单"
            },
            "name": "orders:all",
            "id": 3100
        },
            {
                "redirect": null,
                "path": "/payout/all",
                "component": "payout/all/index",
                "parent_id": 3000,
                "meta": {
                    "hidden": false,
                    "icon": "ma-icon-user",
                    "hiddenBreadcrumb": false,
                    "type": "M",
                    "title": "代付订单"
                },
                "name": "payout:all",
                "id": 3200
            }
        ],
        "parent_id": 0,
        "meta": {
            "hidden": false,
            "icon": "ma-icon-group",
            "hiddenBreadcrumb": false,
            "type": "M",
            "title": "订单列表"
        },
        "name": "orders",
        "id": 3000
    },{
        "redirect": null,
        "path": "/account",
        "component": "",
        "children": [{
            "redirect": null,
            "path": "/account/bassicinfo",
            "component": "account/bassicinfo/index",
            "parent_id": 1000,
            "meta": {
                "hidden": false,
                "icon": "ma-icon-user",
                "hiddenBreadcrumb": false,
                "type": "M",
                "title": "基本信息"
            },
            "name": "account:bassicinfo",
            "id": 1100
        },
            {
                "redirect": null,
                "path": "/appConfig",
                "component": "account/appConfig/index",
                "parent_id": 1000,
                "meta": {
                    "hidden": false,
                    "icon": "ma-icon-role",
                    "hiddenBreadcrumb": false,
                    "type": "M",
                    "title": "应用配置"
                },
                "name": "account:appConfig",
                "id": 1400
            }
        ],
        "parent_id": 0,
        "meta": {
            "hidden": false,
            "icon": "ma-icon-workflow",
            "hiddenBreadcrumb": false,
            "type": "M",
            "title": "账户管理"
        },
        "name": "account",
        "id": 1000
    },
    {
        "redirect": null,
        "path": "/financial",
        "component": "",
        "children": [{
            "redirect": null,
            "path": "/financial/billList",
            "component": "financial/billList/index",
            "parent_id": 2000,
            "meta": {
                "hidden": false,
                "icon": "ma-icon-user",
                "hiddenBreadcrumb": false,
                "type": "M",
                "title": "资金记录"
            },
            "name": "financial:billList",
            "id": 2100
        },
            {
                "redirect": null,
                "path": "/financial/transfer",
                "component": "financial/transfer/index",
                "parent_id": 2000,
                "meta": {
                    "hidden": false,
                    "icon": "ma-icon-role",
                    "hiddenBreadcrumb": false,
                    "type": "M",
                    "title": "转账/提现"
                },
                "name": "financial:transfer",
                "id": 2200
            },
            {
                "redirect": null,
                "path": "/financial/drawalu",
                "component": "financial/drawalu/index",
                "parent_id": 2000,
                "meta": {
                    "hidden": false,
                    "icon": "ma-icon-dept",
                    "hiddenBreadcrumb": false,
                    "type": "M",
                    "title": "申请提U"
                },
                "name": "financial:drawalu",
                "id": 2300
            }
        ],
        "parent_id": 0,
        "meta": {
            "hidden": false,
            "icon": "ma-icon-db",
            "hiddenBreadcrumb": false,
            "type": "M",
            "title": "财务管理"
        },
        "name": "financial",
        "id": 2000
    },
    {
        "redirect": null,
        "path": "/paymentMethod",
        "component": "",
        "children": [{
            "redirect": null,
            "path": "/paymentMethod/all",
            "component": "paymentMethod/all/index",
            "parent_id": 5000,
            "meta": {
                "hidden": false,
                "icon": "ma-icon-tool",
                "hiddenBreadcrumb": false,
                "type": "M",
                "title": "支付方法"
            },
            "name": "withdrawal:all",
            "id": 5100
        },

            {
                "redirect": null,
                "path": "/paymentMethod/all",
                "component": "paymentMethod/all/index",
                "parent_id": 5000,
                "meta": {
                    "hidden": false,
                    "icon": "ma-icon-attach",
                    "hiddenBreadcrumb": false,
                    "type": "M",
                    "title": "支付方法"
                },
                "name": "withdrawal:all",
                "id": 5100
            },{
                "redirect": null,
                "path": "/paymentMethod/all",
                "component": "paymentMethod/all/index",
                "parent_id": 5000,
                "meta": {
                    "hidden": false,
                    "icon": "ma-icon-code",
                    "hiddenBreadcrumb": false,
                    "type": "M",
                    "title": "支付方法"
                },
                "name": "withdrawal:all",
                "id": 5100
            },{
                "redirect": null,
                "path": "/paymentMethod/all",
                "component": "paymentMethod/all/index",
                "parent_id": 5000,
                "meta": {
                    "hidden": false,
                    "icon": "ma-icon-db",
                    "hiddenBreadcrumb": false,
                    "type": "M",
                    "title": "支付方法"
                },
                "name": "withdrawal:all",
                "id": 5100
            },{
                "redirect": null,
                "path": "/paymentMethod/all",
                "component": "paymentMethod/all/index",
                "parent_id": 5000,
                "meta": {
                    "hidden": false,
                    "icon": "ma-icon-dept",
                    "hiddenBreadcrumb": false,
                    "type": "M",
                    "title": "支付方法"
                },
                "name": "withdrawal:all",
                "id": 5100
            },{
                "redirect": null,
                "path": "/paymentMethod/all",
                "component": "paymentMethod/all/index",
                "parent_id": 5000,
                "meta": {
                    "hidden": false,
                    "icon": "ma-icon-dict",
                    "hiddenBreadcrumb": false,
                    "type": "M",
                    "title": "支付方法"
                },
                "name": "withdrawal:all",
                "id": 5100
            },{
                "redirect": null,
                "path": "/paymentMethod/all",
                "component": "paymentMethod/all/index",
                "parent_id": 5000,
                "meta": {
                    "hidden": false,
                    "icon": "ma-icon-group",
                    "hiddenBreadcrumb": false,
                    "type": "M",
                    "title": "支付方法"
                },
                "name": "withdrawal:all",
                "id": 5100
            },{
                "redirect": null,
                "path": "/paymentMethod/all",
                "component": "paymentMethod/all/index",
                "parent_id": 5000,
                "meta": {
                    "hidden": false,
                    "icon": "ma-icon-menu",
                    "hiddenBreadcrumb": false,
                    "type": "M",
                    "title": "支付方法"
                },
                "name": "withdrawal:all",
                "id": 5100
            },{
                "redirect": null,
                "path": "/paymentMethod/all",
                "component": "paymentMethod/all/index",
                "parent_id": 5000,
                "meta": {
                    "hidden": false,
                    "icon": "ma-icon-mineadmin",
                    "hiddenBreadcrumb": false,
                    "type": "M",
                    "title": "支付方法"
                },
                "name": "withdrawal:all",
                "id": 5100
            },{
                "redirect": null,
                "path": "/paymentMethod/all",
                "component": "paymentMethod/all/index",
                "parent_id": 5000,
                "meta": {
                    "hidden": false,
                    "icon": "ma-icon-online",
                    "hiddenBreadcrumb": false,
                    "type": "M",
                    "title": "支付方法"
                },
                "name": "withdrawal:all",
                "id": 5100
            },{
                "redirect": null,
                "path": "/paymentMethod/all",
                "component": "paymentMethod/all/index",
                "parent_id": 5000,
                "meta": {
                    "hidden": false,
                    "icon": "ma-icon-permission",
                    "hiddenBreadcrumb": false,
                    "type": "M",
                    "title": "支付方法"
                },
                "name": "withdrawal:all",
                "id": 5100
            },{
                "redirect": null,
                "path": "/paymentMethod/all",
                "component": "paymentMethod/all/index",
                "parent_id": 5000,
                "meta": {
                    "hidden": false,
                    "icon": "ma-icon-post",
                    "hiddenBreadcrumb": false,
                    "type": "M",
                    "title": "支付方法"
                },
                "name": "withdrawal:all",
                "id": 5100
            },{
                "redirect": null,
                "path": "/paymentMethod/all",
                "component": "paymentMethod/all/index",
                "parent_id": 5000,
                "meta": {
                    "hidden": false,
                    "icon": "ma-icon-rely",
                    "hiddenBreadcrumb": false,
                    "type": "M",
                    "title": "支付方法"
                },
                "name": "withdrawal:all",
                "id": 5100
            },{
                "redirect": null,
                "path": "/paymentMethod/all",
                "component": "paymentMethod/all/index",
                "parent_id": 5000,
                "meta": {
                    "hidden": false,
                    "icon": "ma-icon-role",
                    "hiddenBreadcrumb": false,
                    "type": "M",
                    "title": "支付方法"
                },
                "name": "withdrawal:all",
                "id": 5100
            },{
                "redirect": null,
                "path": "/paymentMethod/all",
                "component": "paymentMethod/all/index",
                "parent_id": 5000,
                "meta": {
                    "hidden": false,
                    "icon": "ma-icon-tool",
                    "hiddenBreadcrumb": false,
                    "type": "M",
                    "title": "支付方法"
                },
                "name": "withdrawal:all",
                "id": 5100
            },{
                "redirect": null,
                "path": "/paymentMethod/all",
                "component": "paymentMethod/all/index",
                "parent_id": 5000,
                "meta": {
                    "hidden": false,
                    "icon": "ma-icon-workflow",
                    "hiddenBreadcrumb": false,
                    "type": "M",
                    "title": "支付方法"
                },
                "name": "withdrawal:all",
                "id": 5100
            }


        ],
        "parent_id": 0,
        "meta": {
            "hidden": false,
            "icon": "ma-icon-permission",
            "hiddenBreadcrumb": false,
            "type": "M",
            "title": "支付信息"
        },
        "name": "paymentMethod",
        "id": 5000
    }
]
