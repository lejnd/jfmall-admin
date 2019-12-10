<template lang="html">
<div class="gz-header">
    <div class="title">
        <div class="title-inner v-middle">
            {{title}}
        </div>
    </div>
    <div class="header-content">
        <div class="user-info">
            <div class="user-info-inner v-middle">
                <span class="welcomeMsg">欢迎，{{userInfo.userDisplayName}}</span>
                <el-button class="signOut" type="text" @click="signOut" :loading="loading">退出<i class="el-icon-switch-button"></i></el-button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { Dropdown } from 'element-ui';
export default {
    name: 'MyHeader',
    props: {
        title: {
            type: String,
            default: () => '',
        },
        menus: {
            type: Object,
            default: () => {},
        },
        userInfo: {
            type: Object,
            default: () => {},
            validator: val => val !== null,
        },
    },
    data() {
        return {
            loading: false,
        };
    },
    components: {
        [Dropdown.name]: Dropdown,
    },
    methods: {
        signOut() {
            this.$set(this, 'loading', true);
            this.$emit('signOut');
        },
    },
};
</script>

<style lang="less">
.gz-header {
    &:after {
        content: "";
        display: block;
        height: 0;
        visibility: hidden;
        clear: both;
    }
    height: 70px;
    background-color: rgb(32, 160, 255);
    background-image: linear-gradient(to top, #3c88bd, #1891d8);
    padding: 0 40px;
    font-size: 14px;
    color: #fff;
    .fl {
        float: left;
    }
    .v-middle {
        display: table-cell;
        height: 70px;
        vertical-align: middle;
    }
    .white {
        color: #fff;
    }
    .title {
        font-size: 22px;
        .fl;
        .v-middle;
    }
    .header-content {
        float: right;
        .user-info {
            .fl;
            padding-left: 10px;
            margin: 0 5px 0 10px;
            .user-info-inner {
                .el-button {
                    color: #fff;
                    &:before {
                        background: 0 0;
                    }
                }
            }
        }
        .welcomeMsg {
            display: inline-block;
            margin: 0 10px;
            line-height: 20px;
        }
        .signOut {
            span {
                padding-left: 10px;
                border-left: 1px solid #487e9e;
            }
            i {
                font-size: 15px;
                font-weight: 700;
                margin-left: 5px;
            }
        }
    }
}
.dropdown-user-items {
    color: #478fca;
}
.dropdown-user-items li:last-child {
    color: black;
}
.dropdown-icon {
    margin-right: 10px;
}
</style>