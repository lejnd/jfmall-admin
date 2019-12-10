<template lang="html">
    <div class="product-list">
        <gz-list
            ref="productList"
            :loading="loading"
            @getData="getListHanlder"
            :colNameMap="colNameMap"
            :originPaging="productList.paging"
            :originData="viewData"
            :maxCacheSize="5"
            :pageShow="false"
            :operation="operation"
            @operation-click="clickToCheck">
            <el-form label-position="right" label-width="80px" slot="searchForm">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <el-form-item label="状态：">
                            <el-select v-model="form.status" placeholder="请选择">
                                <el-option
                                    v-for="item in statusOpt"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item>
                            <el-button type="primary" size="mini" @click="$refs.productList.queryHandler()">查询</el-button>
                            <el-button plain type="primary" size="mini" @click="addHandler">新增产品</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </gz-list>
        <el-dialog title="新增/修改" :visible.sync="dialogFormVisible" @close="resetDialogForm('dialogForm')">
            <el-form :model="dialogForm" class="dialog-content" ref="dialogForm" :rules="dialogFormRules" label-width="100px">
                <el-form-item label="产品ID：" prop="wareid">
                    <el-input v-model="dialogForm.wareid" type="number" placeholder="请输入产品ID"></el-input>
                </el-form-item>
                <el-form-item label="显示名称：" prop="name">
                    <el-input v-model="dialogForm.name" type="text" placeholder="请输入显示名称"></el-input>
                </el-form-item>
                <el-form-item label="积分值：" prop="score">
                    <el-input v-model="dialogForm.score" type="number" placeholder="请输入积分值"></el-input>                    
                </el-form-item>
                <el-form-item label="状态：">
                    <el-radio v-model="dialogForm.status" label="1">启用</el-radio>
                    <el-radio v-model="dialogForm.status" label="0">停用</el-radio>
                </el-form-item>
                <el-form-item label="可选商品：" prop="goods" class="input-group">
                    <div class="input-group-item" v-for="(item, index) in goodsArray" :key="index">
                        <el-input v-model="goodsArray[index]" type="textarea" autosize placeholder="请输入商品名称"></el-input>
                        <el-link class="btn" @click="goodsArray.splice(index+1, 0, '')" type="primary" :underline="false" icon="el-icon-circle-plus-outline">增加</el-link>
                        <el-link
                            class="btn"
                            v-if="goodsArray.length>1"
                            @click="goodsArray.splice(index, 1)"
                            type="danger"
                            :underline="false"
                            icon="el-icon-remove-outline"
                        >删除</el-link>
                    </div>
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
import { mapGetters, mapActions } from 'vuex';

const colNameMap = [
    {
        key: 'wareid',
        displayName: '产品ID',
        width: 180,
    }, {
        key: 'name',
        displayName: '显示名称',
        ellipsis: true,
        width: 150,
    }, {
        key: 'score',
        displayName: '积分值',
        ellipsis: true,
        width: 120,
    }, {
        key: 'goods_html',
        displayName: '可选商品',
        type: 'html',
        // ellipsis: true,
    }, {
        key: 'status_des',
        displayName: '状态',
        type: 'html',
        width: 80,        
    }, {
        displayName: '操作',
        type: 'button',
        width: 160,
    }
];
const operation = [
    {
        key: 'update',
        text: '修改',
        buttonType: 'default',
        size: 'mini'
    },
    {
        key: 'delete',
        textFun: (row) => row.status == 0 ? '启用' : '停用',
        typeFun: (row) => row.status == 0 ? 'success' : 'danger',
        size: 'mini'
    },
];
const dialogFormRules = {
    wareid: [
        { required: true, message: '请输入产品ID', trigger: 'blur' },
    ],
    name: [
        { required: true, message: '请输入显示名称', trigger: 'blur' },
    ],
    score: [
        { required: true, message: '请输入积分值', trigger: 'blur' },
    ]
}
export default {
    extends: BaseComponent,
    data() {
        return {
            productList: {
                list: [],
                paging: {
                    total: 100,
                }
            },
            colNameMap,
            operation,
            dialogFormRules,
            loading: true,
            form: {
                status: '-1',
            },
            statusOpt: [
                { value: '-1', label: '全部' },
                { value: '1', label: '启用' },
                { value: '0', label: '停用' },
            ],

            dialogFormVisible: false,
            dialogForm: {
                id: '',
                wareid: '',
                name: '',
                score: '',
                goods: '',
                status: '1',
            },
            goodsArray: [''],
        };
    },
    computed: {
        ...mapGetters([
            'products'
        ]),
        viewData() {
            return this.formatViewData();
        },
    },
    methods: {
        ...mapActions([
            'getProducts'
        ]),
        getListHanlder(queryCondition) {
            this.loading = true;
            this.getProducts(this.form.status)
            .then((res) => {
                this.productList = Object.assign({}, this.productList, {
                    list: this.products
                })
            }).finally(() => {
                this.loading = false;
            });
        },
        formatViewData() {
            return this.productList.list.map((item) => Object.assign({}, item, {
                goods_html: `<div style="text-align:left;line-height:1.5;">${item.goods ? item.goods.replace(/,/g, '<br><hr style="height:1px;border:none;border-top:1px dotted #E6EEF5;">') : ''}</div>`,
                status_des: this.statusOpt.find(el => el.value == item.status).label,
            }));
        },
        updateApi(action, item) {
            let req = Object.assign({}, item, {
                adminid: localStorage.getItem('loginId'),
                productid: item.id,
                action: action,
            })
            return this.$fly.post('/ydjf/addproduct', common.obj2formdata(req))
            .then((res) => {
                if (typeof res === 'string') res = JSON.parse(res);
                let { d, m, s } = res;
                if (s == 1) {
                    this.$message.success(m);
                    this.$refs.productList.queryHandler();                    
                } else {
                    this.$message.error(m);
                }
            })
        },
        addHandler() {
            this.dialogFormVisible = true;
        },
        clickToCheck(args) {
            if (args[0] == 'update') {
                let item = args[1];
                this.dialogForm = item;
                this.goodsArray = item.goods.split(',') || [''];
                console.log(this.goodsArray);
                this.dialogFormVisible = true;                
            }
            if (args[0] == 'delete') {
                this.$confirm(`确定要${args[1].status==0?'启用':'停用'}该产品吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let item = Object.assign({}, args[1], {
                        status: args[1].status==0 ? 1 : 0
                    })
                    this.updateApi('edit', item);
                })
            }
        },
        resetDialogForm(formName) {
            this.$refs[formName].resetFields();
            this.goodsArray = [''];
        },
        onSumbit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let arr = this.goodsArray.filter(s => s && s.trim());
                    if (arr.length <= 0) {
                        this.$message.error('请至少输入一个商品');
                        return false;
                    }
                    this.dialogForm.goods = arr.join(',');
                    if (this.dialogForm.id) {
                        // 编辑
                        this.updateApi('edit', this.dialogForm).then(() => {
                            this.dialogFormVisible = false;
                        })
                    } else {
                        // 新增
                        this.updateApi('add', this.dialogForm).then(() => {
                            this.dialogFormVisible = false;
                        })
                    }
                }
            });
        }
    },
    components: {
        [List.name]: List,
    },
    mounted() {
        this.$refs.productList.queryHandler();
    },
};
</script>

<style lang="less">
.product-list {
    padding: 20px;
    max-width: 1600px;
    // overflow-x: auto;
    .el-range-editor.el-input__inner {
        width: 100%;
        margin-top: 4px;
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
            padding: 10px 0;
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
    .el-form-item__content {
        line-height: 40px;
    }
    .form-btn-group {
        .el-form-item__content {
            margin-left: 20px !important;
        }
    }
    .el-dialog {
        min-width: 720px;
    }
    .dialog-content {
        .el-input, .el-textarea {
            width: 60%;
        }
        .input-group {
            &-item {
                display: flex;
                align-items: center;
                .btn {
                    margin-left: 15px;
                }
            }
        }
    }
}
</style>