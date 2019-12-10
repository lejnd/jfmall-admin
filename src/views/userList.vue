<template lang="html">
<!-- /www/wwwroot/rrcloud/addons/ewei_shopv2/plugin/merch/template/web_v3/manage/qdlist -->
    <div class="user-list">
        <gz-list
            ref="userList"
            :loading="loading"
            :border="false"
            @getData="getListHanlder"
            :form="form"
            :colNameMap="colNameMap"
            :originPaging="userList.paging"
            :originData="viewData"
            :maxCacheSize="5"
            :operation="operation"
            :pageShow="pageShow"
            @operation-click="clickToCheck">
            <el-form label-position="right" label-width="5px" slot="searchForm">
                <el-row :gutter="10">
                    <el-col :span="10">
                        <el-form-item>
                            <el-input v-model="form.keyword" placeholder="姓名/手机号/微信号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item>
                            <el-button type="primary" size="mini" @click="$refs.userList.queryHandler()">搜索</el-button>
                            <el-button plain type="primary" size="mini" @click="exportHandler" :loading="exportLoading">导出</el-button>
                            <a ref="downloadDOM" :href="`/web/index.php?c=site&a=entry&m=ewei_shopv2&do=web&r=merch.credit.export&action=${form.tpl}`" v-show></a>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <!-- <div slot="handlerToolbar" class="handler-toolbar-inner">
                <el-button type="primary" size="mini" @click="$refs.userList.queryHandler()">搜索</el-button>
                <el-button plain type="primary" size="mini" @click="exportHandler" :loading="exportLoading">导出</el-button>
                <a ref="downloadDOM" :href="`/web/index.php?c=site&a=entry&m=ewei_shopv2&do=web&r=merch.credit.export&action=${form.tpl}`" v-show></a>
            </div> -->
        </gz-list>
    </div>
</template>

<script>
import List from '@/components/table-list';
import listMethodBase from '@/components/listMethodBase';
import common from "../components/common";

const colNameMap = [
    {
        key: 'realname',
        displayName: '姓名',
    }, {
        key: 'mobile',
        displayName: '手机号',
        ellipsis: true,
        width: 220,
    }, {
        key: 'nickname_wechat',
        displayName: '微信名',
        ellipsis: true,
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
    // {
    //     text: '冻结',
    // }, 
    {
        key: 'delete',
        text: '删除',
        buttonType: 'danger',
        size: 'mini'
    }
];
export default {
    data() {
        return {
            userList: {
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
            downloadUrl: '',
            loading: true,
            thisCondition: {},
            // open: false,
            // close: true,
            pageShow: true,
            exportLoading: false,
        };
    },
    computed: {
        viewData() {
            return this.formatViewData();
        },
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
            this.$fly.post(`/web/merchant.php?c=site&a=entry&m=ewei_shopv2&do=web&r=qdlist&searchfield=member&keyword=${this.form.keyword}&clerk=1`)
            .then((res) => {
                let { status, msg, data } = res;
                if (status == 0) {
                    this.loading = false;
                    this.pageShow = true;
                    this.userList = data;
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
            return this.userList.list.map((item) => {
                const targetItem = Object.assign({}, item, {
                    info: `开户银行：${item.bankname}<br>姓名：${item.name}<br>卡号：${item.cardno}<br>备注：${item.remark}`,
                    status: stutasEme[item.status],
                    uptime: listMethodBase.formatTime(item.uptime),
                });
                return targetItem;
            });
        },
        clickToCheck(args) {
            let opid = args[1].openid;
            if (args[0] == 'delete') {
                this.$confirm('确认删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$fly.post('/web/merchant.php?c=site&a=entry&m=ewei_shopv2&do=web&r=qdlist.delete', common.obj2formdata({
                        openid: opid,
                    })).then((res) => {
                        let { status, msg, data } = res;
                        if (status == 0) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.$refs.userList.queryHandler();                        
                        }
                    });
                })
                
            }
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
        this.$refs.userList.queryHandler();
    },
};
</script>

<style lang="less">
.user-list {
    padding: 30px;
    // min-width: 1000px;
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
        justify-content: flex-end;
    }
}
</style>