<template>
    <div class="layout">
        <my-header :title="title" :userInfo="userInfo" @signOut="logout"></my-header>
        <div class="sidebar">
            <sidebar :menus="menus"></sidebar>
        </div>
        <div class="main">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index" :to="{ path: item.to }">{{item.name}}</el-breadcrumb-item>
            </el-breadcrumb>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import MyHeader from '@/components/biz/header';
import Sidebar from '@/components/biz/sidebar';
export default {
    data() {
        return {
            // menus,
            title: '积分商城管理系统',
        };
    },
    components: { MyHeader, Sidebar },
    computed: {
        ...mapGetters([
            'breadcrumbs',
        ]),
        userInfo() {
            return {
                userDisplayName: localStorage.getItem('userName'),
            };
        },
        menus() {
            return [
                {
                    "displayName": "订单",
                    "key": "order",
                    "subMenu": [
                        {
                            "displayName": "订单管理",
                            "key": "orderList",
                        },
                        {
                            "displayName": "异常订单",
                            "key": "errorList",
                        }
                    ]
                },
                {
                    "displayName": "工号",
                    "key": "account",
                    "isHide": localStorage.getItem('isadmin') == '0',
                    "subMenu": [
                        {
                            "displayName": "工号管理",
                            "key": "accountList",
                        }
                    ]
                },
                {
                    "displayName": "积分产品",
                    "key": "products",
                    "isHide": localStorage.getItem('teamid') != '0',
                    "subMenu": [
                        {
                            "displayName": "产品管理",
                            "key": "productList",
                        }
                    ]
                },
            ];
        }
    },
    methods: {
        ...mapActions([
            'setBreadcrumbs',
        ]),
        logout() {
            localStorage.removeItem('isadmin');
            localStorage.removeItem('teamid');  
            localStorage.removeItem('userName')
            localStorage.removeItem('loginId')
            this.$router.replace('/login');
        },
    },
    mounted() {
    },
};
</script>

<style lang="less">
.layout {
    min-height: 100%;
    position: relative;
    .el-menu {
        border-right: solid 1px #f5f5f5;
        height: 100%;
        .el-submenu .el-menu-item {
            background-color: #eff2f7;
        }
    }
}
.el-breadcrumb {
    padding: 20px 10px;
}
.page-content {
    padding: 20px;
}
.pagination-bar {
    margin-top: 20px;
    text-align: center;
}
.sidebar{
    width: 220px;
    position: absolute;
    top:70px;
    left:0px;
    bottom:0px;
    background-color:#eff2f7;
    box-shadow: 2px 1px 4px #f5f5f5;
}
.main {
    margin-left: 220px;
    padding: 0 5px 5px 5px;
}
.date-separator .el-form-item__label {
    text-align: center;
}
</style>