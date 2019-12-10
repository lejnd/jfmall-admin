<template lang="html">
    <el-menu :default-active="active" :unique-opened="true" :router="true">
        <el-menu-item index="/index">首页</el-menu-item>
        <el-submenu :index="'/' + item.key" v-for="item in menus" v-if="!item.isHide">
            <template slot="title">{{item.displayName}}</template>
            <el-menu-item-group v-if="item.subMenu">
                <el-menu-item :index="'/' + sub.key" v-for="sub in item.subMenu">{{sub.displayName}}</el-menu-item>
            </el-menu-item-group>
        </el-submenu>
    </el-menu>
</template>

<script>
export default {
    name: 'Sidebar',
    props: {
        menus: Array,
    },
    data () {
        return {
            active: '/'
        }
    },
    watch: {
        $route() {
            this.active = this.$route.path
        }
    },
    mounted () {
        this.active = this.$route.path
    },
};
</script>

<style lang="less">
</style>