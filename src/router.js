import Vue from 'vue'
import Router from 'vue-router'
import Layout from './views/layout.vue'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/login',
            component: () => import( /* webpackChunkName: "login" */ './views/login.vue')
        },
        {
            path: '/',
            redirect: 'index',
            component: Layout,
            meta: {
                requiresAuth: true,
                keepAlive: false,
            },
            children: [{
                path: '/index',
                component: () => import( /* webpackChunkName: "Home" */ './views/Home.vue')
            }, {
                path: '/orderList',
                component: () => import( /* webpackChunkName: "orderList" */ './views/order/list.vue'),
                meta: {
                    breadcrumbs: [{
                        name: '订单管理',
                    }]
                }
            }, {
                path: '/errorList',
                component: () => import( /* webpackChunkName: "errorList" */ './views/order/errorList.vue'),
                meta: {
                    breadcrumbs: [{
                        name: '异常订单',
                    }]
                }
            }, {
                path: '/tbcList',
                component: () => import( /* webpackChunkName: "tbcList" */ './views/order/tbcList.vue'),
                meta: {
                    breadcrumbs: [{
                        name: '待确认订单',
                    }]
                }
            }, {
                path: '/accountList',
                component: () => import( /* webpackChunkName: "accountList" */ './views/account/list.vue'),
                meta: {
                    breadcrumbs: [{
                        name: '工号管理',
                    }]
                }
            }, {
                path: '/productList',
                component: () => import( /* webpackChunkName: "productList" */ './views/products/productList.vue'),
                meta: {
                    breadcrumbs: [{
                        name: '产品管理',
                    }]
                }
            }, {
                path: '/blockList',
                component: () => import( /* webpackChunkName: "blockList" */ './views/block/list.vue'),
                meta: {
                    breadcrumbs: [{
                        name: '黑名单列表',
                    }]
                }
            }]
        }
    ]
})

// authorization verify
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        const loginId = localStorage.getItem('loginId');    // eslint-disable-line no-undef
        if (!loginId) {
            next({
                path: '/login',
                query: { redirect: to.fullPath },
            });
        } else {
            next();
        }
        next();
    } else {
        next();
    }
});

export default router;