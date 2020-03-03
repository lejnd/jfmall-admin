<template lang="html">
    <div class="block-list">
        <gz-list
            ref="blockList"
            :loading="loading"
            :border="false"
            @getData="getListHanlder"
            :form="form"
            :colNameMap="colNameMap"
            :originPaging="blockList.paging"
            :originData="viewData"
            :maxCacheSize="5"
            :pageShow="pageShow">
            <el-form label-position="right" label-width="80px" slot="searchForm">
                <el-row :gutter="10">
                    <el-col :span="7">
                        <el-form-item label="手机号：">
                            <el-input v-model="form.mobile" placeholder="输入手机号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="工号：">
                            <el-input v-model="form.name" placeholder="输入工号"></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="8">
                        <el-form-item label="下单时间：">
                            <el-date-picker
                                v-model="form.timeRange"
                                type="datetimerange"
                                range-separator="-"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :default-time="['00:00:00', '23:59:59']"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="4">
                        <el-form-item class="form-btn-group">
                            <el-button type="primary" size="mini" @click="$refs.blockList.queryHandler()">搜索</el-button>
                            <el-button plain type="primary" size="mini" @click="exportHandler" :loading="exportLoading">导出</el-button>
                            <a ref="downloadDOM" :href="`/ydjf/getblacklist?${queryString}`" v-show></a>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </gz-list>
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
    }, {
        key: 'mobile',
        displayName: '手机号',
    }, {
        key: 'time',
        displayName: '拉黑时间',
    }
];
// const operation = [
//     {
//         key: 'update',
//         textFun: (row) => row.address ? '修改' : '添加',
//         buttonType: 'default',
//         size: 'mini'
//     }
// ];
export default {
    extends: BaseComponent,
    data() {
        return {
            blockList: {
                list: [],
                paging: {
                    total: 100,
                }
            },
            colNameMap,
            form: {
                mobile: '',
                name: '',
            },
            loading: true,
            pageShow: true,
            exportLoading: false,
            queryString: '',
        };
    },
    computed: {
        viewData() {
            return this.formatViewData();
        },
    },
    methods: {
        getListHanlder(queryCondition) {
            this.loading = true;
            this.pageShow = false; 
            let data = {
                adminid: localStorage.getItem('loginId'),
                page: queryCondition.paging.pageIndex,
                mobile: this.form.mobile,
                name: this.form.name,
            }
            this.createQueryString(data);
            this.$fly.get(`/ydjf/getblacklist`, data)
            .then((res) => {
                if (typeof res === 'string') res = JSON.parse(res);
                let { m, s, d } = res;
                this.loading = false;
                if (s == 1) {
                    this.pageShow = true;
                    this.blockList = Object.assign({}, d.data, {
                        list: d.data.list || [],
                        paging: d.data.paging
                    });
                } else {
                    this.$message.error(m);
                    this.blockList = Object.assign({}, {
                        list: [],
                        paging: {
                            total: 0,
                        }
                    });
                }
            });
        },
        createQueryString(data) {
            this.queryString = '';
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const element = data[key];
                    this.queryString += `${key}=${data[key]}&`
                }
            }
            this.queryString += 'export=1';
        },
        formatViewData() {
            let stutasEme = {
                '1': '成功',
                '2': '失败',
                '3': '待确认',
            }
            return this.blockList.list.map((item) => {
                const targetItem = Object.assign({}, item, {
                    status_des: stutasEme[item.status]
                });
                return targetItem;
            });
        },
        exportHandler() {
            this.exportLoading = true;
            this.$refs.downloadDOM.click();
            setTimeout(() => {
                this.exportLoading = false;
            }, 3000)
        },
    },
    components: {
        [List.name]: List,
    },
    mounted() {
        this.$refs.blockList.queryHandler();
    },
};
</script>

<style lang="less">
.block-list {
    padding: 30px;
    max-width: 1800px;
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
        justify-content: flex-end;
    }
    .el-form-item__content {
        line-height: 40px;
    }
    .form-btn-group {
        .el-form-item__content {
            margin-left: 20px !important;
        }
    }
}
</style>