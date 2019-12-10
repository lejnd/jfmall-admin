<template lang="html">
<!-- /www/wwwroot/rrcloud/addons/ewei_shopv2/plugin/merch/template/web_v3/manage/qdlist -->
    <div class="account-list">
        <gz-list
            ref="accountList"
            :loading="loading"
            :border="false"
            @getData="getListHanlder"
            :form="form"
            :colNameMap="colNameMap"
            :originPaging="accountList.paging"
            :originData="viewData"
            :maxCacheSize="5"
            :operation="operation"
            :pageShow="pageShow"
            @operation-click="clickToCheck">
            <el-form label-position="right" label-width="5px" slot="searchForm">
                <el-row :gutter="10">
                    <el-col :span="10">
                        <el-form-item>
                            <el-input v-model="form.keyword" placeholder="输入工号" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item>
                            <el-button type="primary" size="mini" @click="$refs.accountList.queryHandler()">查询</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="handlerToolbar" class="handler-toolbar-inner">
                <el-button plain type="primary" size="mini" @click="addUser">工号分配</el-button>
            </div>
        </gz-list>
        <el-dialog :title="dialogFormTypes[dialogFormType]" :visible.sync="dialogFormVisible" @close="resetDialogForm('dialogForm')">
            <el-form :model="dialogForm" :rules="dialogFormRules" ref="dialogForm" label-width="100px">
                <el-form-item label="工号名：" prop="userName">
                    <el-input v-model="dialogForm.userName" type="text" placeholder="请输入工号名" :readonly="dialogFormType==1"></el-input>
                </el-form-item>
                <el-form-item label="工号类型：" prop="isteam" v-if="isZadmin && dialogFormType==0">
                    <el-radio v-model="dialogForm.isteam" label="1">团队工号</el-radio>
                    <el-radio v-model="dialogForm.isteam" label="0">办单工号</el-radio>
                </el-form-item>
                <el-form-item :label="dialogFormType==0 ? '密码：' : '新密码：'" prop="password">
                    <el-input v-model="dialogForm.password" type="password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码：" prop="passwordConfirm">
                    <el-input v-model="dialogForm.passwordConfirm" type="password" placeholder="请输入确认密码"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSumbit('dialogForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import List from '@/components/table-list';
import listMethodBase from '@/components/listMethodBase';
import common from "@/components/common";
import BaseComponent from '@/views/base';

const colNameMap = [
    {
        key: 'name',
        displayName: '工号',
    },
    // {
    //     key: 'amount',
    //     displayName: '成单数/未成单数',
    //     ellipsis: true,
    // }, 
    // {
    //     key: 'info',
    //     type: 'html',
    //     displayName: '交易额',
    //     ellipsis: true,
    //     width: 200,
    // }, 
    {
        displayName: '操作',
        type: 'button',
    }
];
const operation = [
    {
        key: 'update',
        text: '修改密码',
        buttonType: 'default',
        size: 'mini'
    }
];
export default {
    extends: BaseComponent,
    data() {
        var checkPasswordConfirm = (rule, value, callback) => {
            if (this.dialogForm.passwordConfirm != this.dialogForm.password) {
                return callback(new Error('两次密码输入不一致！'));
            } else {
                callback();
            }
        };
        var checkPassword = (rule, value, callback) => {
            if (this.dialogForm.password.length < 6) {
                return callback(new Error('密码长度不能少于6位！'));
            } else {
                callback();
            }
        };
        return {
            accountList: {
                list: [],
                paging: {
                    total: 100,
                }
            },
            colNameMap,
            operation,
            form: {
                keyword: '',
            },
            loading: true,
            pageShow: true,
            dialogFormVisible: false,
            dialogFormTypes: [ '工号分配', '修改密码' ],
            dialogFormType: null,  // 0,工号分配   1,修改密码
            dialogForm: {
                userName: '',
                isteam: '1',
                password: '',
                passwordConfirm: '',
            },
            dialogFormRules: {
                userName: [
                    { required: true, message: '请输入工号名', trigger: 'blur' },
                    { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '工号名格式不正确（汉字、字母、数字、下划线）' }
                ],
                isteam: [
                    { required: true, message: '请选择工号类型', trigger: 'change' },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { validator: checkPassword, trigger: 'blur' }
                ],
                passwordConfirm: [
                    { required: true, message: '请输入确认密码', trigger: 'blur' },
                    { validator: checkPasswordConfirm, trigger: 'blur' }
                ]
            }
        };
    },
    computed: {
        viewData() {
            return this.formatViewData();
        },
        // 超级管理员权限
        isZadmin() {
            return localStorage.getItem('teamid') == 0;
        }
    },
    methods: {
        getListHanlder(queryCondition) {
            this.loading = true;
            this.pageShow = false;  
            let data = {
                adminid: localStorage.getItem('loginId'),
                page: queryCondition.paging.pageIndex,
                keyword: this.form.keyword,
            }
            this.$fly.post('/ydjf/getadminlist', common.obj2formdata(data))
            .then((res) => {
                if (typeof res === 'string') res = JSON.parse(res);
                let { m, s, d } = res;
                if (s == 1) {
                    this.loading = false;
                    this.pageShow = true;
                    this.accountList = Object.assign({}, d.data, {
                        list: d.data.list || [],
                        paging: d.data.paging
                    });
                }
            });
        },
        formatViewData() {
            let stutasEme = {
                '1': '待受理',
                '2': '付款中',
                '3': '拒绝',
                '4': '成功',
            }
            return this.accountList.list.map((item) => {
                const targetItem = Object.assign({}, item, {
                    
                });
                return targetItem;
            });
        },
        clickToCheck(args) {
            this.dialogForm = Object.assign({}, this.dialogForm, {
                userName: args[1].name
            })
            if (args[0] == 'update') {
                this.dialogFormType = 1;
                this.dialogFormVisible = true;
            }
        },
        addUser() {
            this.dialogFormType = 0;
            this.dialogFormVisible = true;
        },
        resetDialogForm() {            
            this.dialogForm = Object.assign({}, this.dialogForm, {
                userName: '',
                password: '',
                passwordConfirm: '',
            })
        },
        onSumbit(formName) {
            if (this.dialogForm.passwordConfirm != this.dialogForm.password) {
                this.$message.error('两次密码输入不一致！');
                return false;
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.dialogFormType == 0) this.apiAddUser('addadmin');
                    if (this.dialogFormType == 1) this.apiAddUser('changepwd');
                }
            });
        },
        apiAddUser(apiName) {
            let data = Object.assign({}, this.dialogForm, {
                adminid: localStorage.getItem('loginId'),
                name: this.dialogForm.userName
            })
            this.$fly.post(`/ydjf/${apiName}`, common.obj2formdata(data))
            .then((res) => {
                if (typeof res === 'string') res = JSON.parse(res);
                let { m, s, d } = res;
                if (s == 1) {
                    this.$message.success(m);
                    this.$refs.accountList.queryHandler();
                    this.dialogFormVisible = false;              
                } else {
                    this.$message.error(m);
                }
            })
        },
    },
    components: {
        [List.name]: List,
    },
    mounted() {
        this.$refs.accountList.queryHandler();
    },
};
</script>

<style lang="less">
.account-list {
    padding: 30px;
    max-width: 1000px;
    // overflow-x: auto;
    .el-range-editor.el-input__inner {
        width: 100%;
    }
    .el-input__inner {
        height: 33px;
        line-height: 33px;
    }
    .el-form-item__label {
        font-size: 12px;
    }
    .search .line {
        text-align: center;
    }
    .handler-toolbar {
        // margin-bottom: 20px;
        // padding: 0 10px;
    }
    .list {
        // border-top: 1px solid #cdcdcd;
        // padding-top: 25px;
        // padding: 0 10px;
    }
    .form-select {
        height: 36px;
        width: 100%;
        background-color: #fff;
        border-color: #bfcbd9;
    }
    .el-table {
        min-height: 0;
        border-top: 1px solid #EBEEF5;
        th, td {
            text-align: center;
            font-size: 12px;
        }
        th {
            color: #333;
            font-weight: 700;
        }
        td {
            color: #777;
        }
    }
    .el-cascader {
        width: 100%;
    }
    .el-select {
        width: 100%;
    }
    .el-date-editor.el-input {
        width: 100%;
    }
    .el-icon-circle-close {
        z-index: 1000;
    }
    .first {
        padding-top: 10px;
        margin-left: 30px;
        border-top: 1px solid #cdcdcd;
    }
    .second {
        border-bottom: 1px solid #cdcdcd;
    }
    .open {
        margin-bottom: 10px;
    }
    .el-date-editor .el-range-separator {
        width: 30px;
    }
    .handler-toolbar-inner {
        display: flex;
        // justify-content: flex-end;
        padding-left: 5px;
    }
    .el-dialog {
        width: 500px;
    }
}
</style>