<template lang="html">
<!-- /www/wwwroot/rrcloud/addons/ewei_shopv2/plugin/merch/template/web_v3/user -->
    <div class="cash-list">
        <gz-list
            ref="amountLogs"
            :loading="loading"
            @getData="getListHanlder"
            :colNameMap="colNameMap"
            :originPaging="amountLogs.paging"
            :originData="viewData"
            :maxCacheSize="5"
            :pageShow="pageShow">
        </gz-list>
    </div>
</template>

<script>
import List from '@/components/table-list';
import listMethodBase from '@/components/listMethodBase';
import common from "../components/common";

const colNameMap = [
    {
        key: 'bfamount',
        displayName: '变化前余额',
    }, {
        key: 'cgamount',
        displayName: '变化余额',
        ellipsis: true,
    }, {
        key: 'afamount',
        displayName: '变化后余额',
        ellipsis: true,
    }, {
        key: 'source',
        displayName: '来源',
        ellipsis: true,
    }, {
        key: 'donetime',
        displayName: '时间',
        ellipsis: true,
        width: 180,
    }
];
export default {
    data() {
        return {
            amountLogs: {
                list: [],
                paging: {
                    total: 100,
                }
            },
            colNameMap,
            loading: true,
            pageShow: false,
        };
    },
    watch: {
        merchid(v) {
            console.log('merchid: ', v);
            this.$refs.amountLogs.queryHandler();
        }
    },
    computed: {
        viewData() {
            return this.formatViewData();
        },
        merchid() {
            return this.$route.params.id;
        }
    },
    methods: {
        getListHanlder(queryCondition) {
            this.loading = true;
            this.pageShow = false;  
            this.$fly.post(`/web/index.php?c=site&a=entry&m=ewei_shopv2&do=web&r=merch.user.getAmountLog&merchid=${this.merchid}`)
            .then((res) => {
                this.loading = false;
                this.amountLogs = Object.assign({}, this.amountLogs, {
                    list: res
                })
            });
        },
        formatViewData() {
            return this.amountLogs.list.map((item) => Object.assign({}, item, {
                donetime: listMethodBase.formatTime(item.donetime),
            }));
        },
    },
    components: {
        [List.name]: List,
    },
    mounted() {
        this.$refs.amountLogs.queryHandler();
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
    .form-select {
        height: 36px;
        width: 100%;
        background-color: #fff;
        border-color: #bfcbd9;
    }
    .el-table {
        min-height: 0;
        th, td{
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