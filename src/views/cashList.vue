<template lang="html">
<!-- /www/wwwroot/rrcloud/addons/ewei_shopv2/plugin/merch/template/web_v3/credit -->
    <div class="cash-list">
        <gz-list
            ref="cashList"
            :loading="loading"
            @getData="getListHanlder"
            :form="form"
            :colNameMap="colNameMap"
            :originPaging="cashList.paging"
            :originData="viewData"
            :maxCacheSize="5"
            :operation="operation"
            :pageShow="pageShow"
            :hasCheckbox="(form.tpl == 1 || form.tpl == 2).toString()"
            :checkboxHandler="checkboxHandler"
            @operation-click="clickToCheck">
            <el-form label-position="right" label-width="85px" slot="searchForm">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="用户：">
                            <el-input v-model="form.merchname"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="用户类型：">
                            <el-select v-model="form.utype" placeholder="请选择">
                                <el-option
                                    v-for="item in utypeOpts"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属团队：">
                            <el-input v-model="form.agentmerchname"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="状态：">
                            <el-select v-model="form.status" placeholder="请选择">
                                <el-option
                                    v-for="item in statusOpts"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="80">
                    <el-col :span="11">
                        <el-form-item label="提交时间：">
                            <el-date-picker

                                type="daterange"
                                range-separator="-"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" v-if="form.tpl != 1">
                        <el-form-item label="受理时间：">
                            <el-date-picker
                            
                                type="daterange"
                                range-separator="-"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="7">
                        <el-form-item label="状态：">
                            <select v-model="form.agentState" placeholder="请选择" class="form-select" @change="agentStateToNum">
                                <option value="0">所有</option>
                                <option value="50">在职</option>
                                <option value="-1">离职</option>
                            </select>
                        </el-form-item>
                    </el-col> -->
                </el-row>
                <!-- <div class="open">
                    <el-button v-show="close" type="text" @click="openSearch">打开更多查询条件</el-button>
                    <el-button v-show="open" type="text" @click="openSearch">关闭更多查询条件</el-button>
                </div> -->
            </el-form>
            <div slot="handlerToolbar" class="handler-toolbar-inner">
                <el-button type="primary" @click="$refs.cashList.queryHandler()">查询</el-button>
                <el-button plain type="primary" @click="batchHandler" :loading="batchLoading" v-if="form.tpl == 1 || form.tpl == 2">批量{{batchBtnText}}</el-button>
                <el-button plain type="primary" @click="exportHandler" :loading="exportLoading">导出记录</el-button>
                <a ref="downloadDOM" :href="`/web/index.php?c=site&a=entry&m=ewei_shopv2&do=web&r=merch.credit.export&action=${form.tpl}`" v-show></a>
            </div>
        </gz-list>
        <el-dialog :title="batchBtnText" :visible.sync="dialogFormVisible" @close="resetHandleForm('handleForm')">
            <el-form :model="handleForm" ref="handleForm" label-width="100px">
                <el-form-item label="受理结果：">
                    <el-radio v-model="handleForm.flag" label="0">同意</el-radio>
                    <el-radio v-model="handleForm.flag" label="1">拒绝</el-radio>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input v-model="handleForm.remark" type="textarea" placeholder="请输入备注"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSumbit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import List from '@/components/table-list';
import listMethodBase from '@/components/listMethodBase';
import common from "../components/common";

const colNameMap = [
    {
        key: 'merchname',
        displayName: '提现用户',
    }, {
        key: 'utype',
        displayName: '用户类型',
        ellipsis: true,
    }, {
        key: 'agentmerchname',
        displayName: '所属团队',
        ellipsis: true,
    }, {
        key: 'amount',
        displayName: '提现金额(元)',
        ellipsis: true,
    }, {
        key: 'info',
        type: 'html',
        displayName: '收款信息',
        ellipsis: true,
        width: 280,
    }, {
        key: 'uptime',
        displayName: '提交时间',
        ellipsis: true,
        width: 180,
    }, {
        key: 'status',
        displayName: '状态',
    }, {
        key: 'donetime',
        displayName: '受理时间',
        ellipsis: true,
        width: 180,
    }, {
        displayName: '操作',
        type: 'button',
        buttonType: 'primary'
    }
];
const operation = [{
    text: '受理',
}];
export default {
    data() {
        return {
            cashList: {
                list: [],
                paging: {
                    total: 100,
                }
            },
            utypeOpts: [
                {
                    value: 0,
                    label: '不限'
                }, {
                    value: 1,
                    label: '地包'
                }, {
                    value: 2,
                    label: '渠道'
                }
            ],
            statusOpts: [
                {
                    value: 0,
                    label: '不限'
                }, {
                    value: 1,
                    label: '待受理'
                }, {
                    value: 2,
                    label: '付款中'
                }, {
                    value: 3,
                    label: '拒绝'
                }, {
                    value: 4,
                    label: '成功'
                }
            ],
            colNameMap,
            operation,
            form: {
                tpl: 1,
                merchname: '',
                utype: 0,
                agentmerchname: '',
            },
            downloadUrl: '',
            loading: true,
            thisCondition: {},
            // open: false,
            // close: true,
            pageShow: true,
            exportLoading: false,
            batchLoading: false,
            dialogFormVisible: false,
            resultRadio: '0',
            handleForm: {
                ids: '',
                flag: '0',
                remark: '',
            },
            ids: [],
        };
    },
    computed: {
        viewData() {
            return this.formatViewData();
        },
        batchBtnText() {
            const obj = {
                '1': '受理提现',
                '2': '确认打款'
            }
            return obj[this.form.tpl];
        }
    },
    methods: {
        getListHanlder(queryCondition) {
            // const thisCondition = Object.assign({}, queryCondition.condition, {
            //     region: {
            //         cityCode: this.form.region[0] || '',
            //         districtCode: this.form.region[1] || '',
            //         townCode: this.form.region[2] || '',
            //         villageCode: this.form.region[3] || '',
            //     },
            //     entryTime: listMethodBase.formatTime(this.form.entryTime) || '',
            //     entryTimeTo: listMethodBase.formatTime(this.form.entryTimeTo) || '',
            // });
            // listMethodBase.timewarn(thisCondition.entryTime, thisCondition.entryTimeTo);
            this.loading = true;
            this.pageShow = false;  
            console.log('tpl: ', this.form.tpl);          
            this.$fly.post('/web/index.php?c=site&a=entry&m=ewei_shopv2&do=web&r=merch.credit.getlist', common.obj2formdata({
                tpl: this.form.tpl,
                page: queryCondition.paging.pageIndex,
            }))
            .then((res) => {
                let { status, msg, data } = res;
                this.loading = false;
                this.pageShow = true;
                this.cashList = data;
            });
        },
        formatViewData() {
            let stutasEme = {
                '1': '待受理',
                '2': '付款中',
                '3': '拒绝',
                '4': '成功',
            }
            return this.cashList.list.map((item) => {
                const targetItem = Object.assign({}, item, {
                    info: `开户银行：${item.bankname}<br>姓名：${item.name}<br>卡号：${item.cardno}<br>备注：${item.remark}`,
                    status: stutasEme[item.status],
                    uptime: listMethodBase.formatTime(item.uptime),
                });
                return targetItem;
            });
        },
        checkboxHandler(val) {
            this.ids = val.map(item => item.id);
        },
        clickToCheck(args) {
            this.dialogFormVisible = true;
            this.handleForm.ids = args[1].id;
        },
        resetHandleForm(formName) {
            this.$refs[formName].resetFields();
        },
        onSumbit() {
            if (this.handleForm.flag == '1' && !this.handleForm.remark) {
                this.$message.error('请填写备注信息！');
                return false;
            }
            let handle = this.form.tpl == 1 ? 'handle' : 'handle1';
            this.$fly.post(`/web/index.php?c=site&a=entry&m=ewei_shopv2&do=web&r=merch.credit.${handle}`, common.obj2formdata(this.handleForm))
            .then((res) => {
                let { status, msg } = res;
                if (status == 0) {
                    this.$message.success(msg);
                    this.$refs.cashList.queryHandler();
                    this.dialogFormVisible = false;                    
                } else {
                    this.$message.error(msg);
                }
            })
        },
        batchHandler() {
            if (this.ids.length <= 0) {
                this.$message.error('请先选择用户');   
                return false;             
            }
            this.$confirm('确定批量受理提现吗？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let handle = this.form.tpl == 1 ? 'handle' : 'handle1';
                this.$fly.post(`/web/index.php?c=site&a=entry&m=ewei_shopv2&do=web&r=merch.credit.${handle}`, common.obj2formdata({
                    ids: this.ids
                }))
                .then((res) => {
                    let { status, msg } = res;
                    if (status == 0) {
                        this.$message.success(msg);
                        this.$refs.cashList.queryHandler();
                        this.batchSendCode();
                    } else {
                        this.$message.error(msg);
                    }
                })
            })
        },
        batchSendCode() {
            // 上传参数：ids,flag(1是批量受理提现，3是批量确认打款)
            this.$fly('/web/index.php?c=site&a=entry&m=ewei_shopv2&do=web&r=merch.credit.sendcode', common.obj2formdata({
                ids: this.ids,
                flag: this.form.tpl == 1 ? 1 : 3
            }))
        },
        exportHandler() {
            this.exportLoading = true;
            // this.downloadUrl = `/web/index.php?c=site&a=entry&m=ewei_shopv2&do=web&r=merch.credit.export?action=${this.form.tpl}`
            this.$refs.downloadDOM.click();
            setTimeout(() => {
                this.exportLoading = false;
            }, 3000)
            // this.getAgentsExportKey(this.thisCondition)
            // .then(() => {
            //     this.downloadUrl = `${StaticString.url}/common/export-excel?key=${this.agentsKey}`;
            // })
            // .then(() => {
            //     this.$refs.downloadDOM.click();
            //     this.exportLoading = false;
            // })
            // .catch((err) => {
            //     this.exportLoading = false;
            //     this.$notify({
            //         message: err.msg || err,
            //         type: 'warning',
            //     });
            // });
        },
    },
    components: {
        [List.name]: List,
    },
    mounted() {
        this.form = Object.assign({}, this.form, {
            tpl: this.$route.query.tpl,
        });
        this.$refs.cashList.queryHandler();
        if (this.form.tpl == 1) {
            this.colNameMap = this.colNameMap.filter(item => item.displayName != '受理时间')
        }
        if (this.form.tpl == 3 || this.form.tpl == 4) {
            this.colNameMap = this.colNameMap.filter(item => item.displayName != '操作')
        }
    },
};
</script>

<style lang="less">
.cash-list {
    padding: 30px;
    // min-width: 1000px;
    // overflow-x: auto;
    .el-range-editor.el-input__inner {
        width: 100%;
    }
    .search .line {
        text-align: center;
    }
    .handler-toolbar {
        margin-bottom: 20px;
        // padding: 0 10px;
    }
    .list {
        border-top: 1px solid #cdcdcd;
        padding-top: 25px;
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
        th, td:first-child {
            text-align: center;
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
}
</style>