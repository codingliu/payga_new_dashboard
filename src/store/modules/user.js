import {defineStore} from 'pinia'
import loginApi from '@/api/login'
import tool from '@/utils/tool'
import router from '@/router'
import webRouter from '@/router/webRouter'
import {homePage} from '@/router/homePageRoutes'
import {useAppStore} from '@/store'
import {routersTemp} from "@/router/data";

const useUserStore = defineStore('user', {

    state: () => ({
        codes: undefined,
        roles: undefined,
        routers: undefined,
        user: undefined,
        menus: undefined,
    }),

    getters: {
        setUserInfo(state) {
            return {...state};
        },
    },

    actions: {

        setToken(token) {
            tool.local.set(import.meta.env.VITE_APP_TOKEN_PREFIX, token)
        },

        getToken() {
            return tool.local.get(import.meta.env.VITE_APP_TOKEN_PREFIX)
        },

        clearToken() {
            tool.local.remove(import.meta.env.VITE_APP_TOKEN_PREFIX)
        },

        setInfo(data) {
            this.$patch(data)
        },

        resetUserInfo() {
            this.$reset();
        },

        setHomePath(val) {
            tool.local.set('homePath', val)
        },

        setMenu(data) {
            const routers = flatAsyncRoutes(filterAsyncRouter(data))
            routers.map(item => router.addRoute('layout', item))
        },

        requestUserInfo() {
            return new Promise((resolve, reject) => {
                loginApi.getInfo().then(response => {
                    if (!response || !response.data) {
                        this.clearToken()
                        router.push({name: 'login'})
                        reject(false)
                    } else {
                        const params = {
                            codes: ['*'],
                            //...response.data,
                             routers: routersTemp,
                            user: {
                                "id": 1,
                                "username": "superAdmin",
                                "user_type": "100",
                                "nickname": "超级管理员",
                                "phone": "13888888888",
                                "email": "admin123@adminmine.com",
                                "avatar": "https://demo.mineadmin.com/upload/uploadfile/20230330/499990370432749568.jpg",
                                "signed": "Today is very good！",
                                "dashboard": "statistics",
                                "status": 2,
                                "login_ip": "89.189.88.156",
                                "login_time": "2023-11-05 03:31:46",
                                "backend_setting": {
                                    "mode": "light",
                                    "tag": false,
                                    "menuCollapse": false,
                                    "menuWidth": 360,
                                    "layout": "classic",
                                    "skin": "mine",
                                    "i18n": false,
                                    "language": "en",
                                    "animation": "ma-slide-down",
                                    "color": "#165DFF",
                                },
                                "created_by": 0,
                                "updated_by": 1,
                                "created_at": "2022-08-01 02:35:14",
                                "updated_at": "2023-11-05 03:31:46",
                                "remark": null
                            },
                            roles: ['superAdmin']
                        }
                        this.setInfo(params)
                        this.setMenu(this.routers)
                        this.routers = removeButtonMenu(this.routers)
                        if(tool.local.get('menuList') !== 'AGENT') {
                            homePage.children = webRouter[0].children
                            this.routers.unshift(homePage)
                        }
                        this.setApp()
                        resolve(params)
                    }
                })
            })
        },

        login(form) {
            return loginApi.login(form).then(r => {
                if (r.data.token) {
                    this.setToken(r.data.token)
                    tool.local.set('menuList', r.data.menuList);
                    const tempPath = r.data.menuList === 'AGENT' ? '/merchant/list' : '/'
                    this.setHomePath(tempPath)
                    return true
                } else if (r.data.needOtp) {
                    return r.data;
                } else {
                    return false
                }
            }).catch(e => {
                console.error(e)
                return false
            })
        },

        async logout() {
            // await loginApi.logout()
            tool.local.remove('tags')
            this.clearToken()
            this.resetUserInfo()
        },

        async setApp() {
            const appStore = useAppStore()
            const setting = this.user.backend_setting
            if (setting) {
                appStore.toggleMode(setting.mode)
                appStore.toggleMenu(setting.menuCollapse)
                appStore.toggleTag(setting.tag)
                appStore.changeMenuWidth(setting.menuWidth)
                appStore.changeLayout(setting.layout)
                appStore.useSkin(setting.skin)
                appStore.changeColor(setting.color)
            }
        }
    }

})

//路由扁平化
const flatAsyncRoutes = (routes, breadcrumb = []) => {
    let res = []
    routes.forEach(route => {
        const tmp = {...route}
        if (tmp.children) {
            let childrenBreadcrumb = [...breadcrumb]
            childrenBreadcrumb.push(route)
            let tmpRoute = {...route}
            tmpRoute.meta.breadcrumb = childrenBreadcrumb
            delete tmpRoute.children
            res.push(tmpRoute)
            let childrenRoutes = flatAsyncRoutes(tmp.children, childrenBreadcrumb)
            childrenRoutes.map(item => {
                res.push(item)
            })
        } else {
            let tmpBreadcrumb = [...breadcrumb]
            tmpBreadcrumb.push(tmp)
            tmp.meta.breadcrumb = tmpBreadcrumb
            res.push(tmp)
        }
    })
    return res
}

const views = import.meta.glob('../../views/**/**.vue')
const empty = import.meta.glob('../../layout/empty.vue')

// 菜单转换路由
const filterAsyncRouter = (routerMap) => {
    const accessedRouters = []
    routerMap.forEach(item => {
        if (item.meta.type !== 'B') {

            if (item.meta.type === 'I') {
                item.meta.url = item.path
                item.path = `/maIframe/${item.name}`
            }

            const route = {
                path: item.path,
                name: item.name,
                hidden: item.hidden == 1,
                meta: item.meta,
                children: item.children ? filterAsyncRouter(item.children) : null,
                component: views[`../../views/${item.component}.vue`]
            }
            accessedRouters.push(route)
        }
    })
    return accessedRouters
}

// 去除按钮菜单
const removeButtonMenu = (routers) => {
    let handlerAfterRouters = []
    routers.forEach(item => {
        if (item.meta.type !== 'B' && !item.meta.hidden) {
            let route = item
            if (item.children && item.children.length > 0) {
                route.children = removeButtonMenu(item.children)
            }
            handlerAfterRouters.push(route)
        }
    })
    return handlerAfterRouters
}
export default useUserStore
