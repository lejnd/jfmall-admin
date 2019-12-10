<template lang='html'>
    <div id="login_page">
        <div class="logo">
            积分商城管理系统
        </div>
        <div class="login-form" :span="9" :offset="8">
            <h3 class="title">登录</h3>
            <el-form :model="loginForm" :rules="rules" ref="loginForm">
                <el-form-item prop="account">
                    <el-input v-model="loginForm.account" icon="message" placeholder="工号" @keypress.enter.native="submitToLogin('loginForm')"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" icon="information" placeholder="密码" type="password" @keypress.enter.native="submitToLogin('loginForm')"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitToLogin('loginForm')">登录</el-button>
                    <el-button @click="resetForm('loginForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import common from "@/components/common";

const rules = {
    account: [
        { required: true, message: '请输入工号', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
    ],
};
export default {
    data() {
        return {
            rules,
            loginForm: {
                userName: '',
                password: '',
            },
        };
    },
    metaInfo: {
        title: '登录',
    },
    methods: {
        submitToLogin(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loginHandler();
                } else {
                    this.$notify({
                        message: '登录信息不完整',
                        type: 'warning',
                        duration: 1800,
                    });
                }
            });
        },
        loginHandler() {
            let data = {
                mobile: this.loginForm.account,
                password: this.loginForm.password,
            }
            this.$fly.post('/ydjf/login', common.obj2formdata(data))
            .then((res) => {
                if (typeof res === 'string') res = JSON.parse(res);
                let { d, m, s } = res;
                if (s == 1) {
                    this.$message({
                        type: 'success',
                        message: m
                    });
                    /***
                    总管理员：teamid == 0
                    团队管理员：isadmin == 1
                    ***/
                    localStorage.setItem('loginId', d.id);
                    localStorage.setItem('isadmin', d.isadmin);
                    localStorage.setItem('teamid', d.teamid);
                    localStorage.setItem('userName', this.loginForm.account);
                    this.$router.replace('/');
                } else {
                    this.$notify({
                        message: m,
                        type: 'warning',
                        duration: 1800,
                    });
                }
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
    },
    mounted() {

    },
};
</script>
<style lang='less'>
html, body {
    margin: 0;
    box-sizing: border-box;
}
#login_page {
    display: flex;
    flex-direction: column;
    align-items: center;
    .logo {
        margin-top: 20px;
        font-size: 60px;
        color: rgb(225, 229, 234);
        font-weight: bolder;
        padding-left: 10px;
        text-align: center;
    }
    .login-form {
        margin-top: 30px;
        padding: 30px;
        width: 450px;
        background-color: rgba(255, 255, 255, 0.85);
        border-radius: 8px;
        border: 1px solid #eee;
        .title {
            text-align: center;
            padding-bottom: 40px;
            font-size: 20px;
            color: #666;
            font-weight: 900;
        }
    }
}
</style>