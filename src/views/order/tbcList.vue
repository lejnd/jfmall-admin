<template lang="html">
    <div class="order-list">
        <gz-list
            ref="orderList"
            :loading="loading"
            :border="false"
            @getData="getListHanlder"
            :form="form"
            :colNameMap="colNameMap"
            :originPaging="orderList.paging"
            :originData="viewData"
            :maxCacheSize="5"
            :pageShow="pageShow"
            :operation="operation"
            @operation-click="clickToCheck">
            <el-form label-position="right" label-width="80px" slot="searchForm">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <el-form-item label="手机号：">
                            <el-input v-model="form.keyword" placeholder="输入手机号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="工号：">
                            <el-input v-model="form.sadminname" placeholder="输入工号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="下单时间：">
                            <el-date-picker
                                v-model="form.timeRange"
                                type="datetimerange"
                                range-separator="-"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :default-time="['20:00:00', '20:00:00']"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item class="form-btn-group">
                            <el-button type="primary" size="mini" @click="$refs.orderList.queryHandler()">搜索</el-button>
                            <el-button plain type="primary" size="mini" @click="exportHandler" :loading="exportLoading">导出</el-button>
                            <a ref="downloadDOM" :href="`/ydjf/getmyorder?${queryString}`" v-show></a>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <!-- <el-col :span="9">
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
                    <el-col :span="9">
                        <el-form-item label="下单时间：">
                            <el-date-picker
                                v-model="form.timeRange"
                                type="daterange"
                                range-separator="-"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item class="form-btn-group">
                            <el-button type="primary" size="mini" @click="$refs.orderList.queryHandler()">搜索</el-button>
                            <el-button plain type="primary" size="mini" @click="exportHandler" :loading="exportLoading">导出</el-button>
                            <a ref="downloadDOM" :href="`/ydjf/getmyorder?${queryString}`" v-show></a>
                        </el-form-item>
                    </el-col> -->
                </el-row>
            </el-form>
            <!-- <div slot="handlerToolbar" class="handler-toolbar-inner">
                <el-button type="primary" size="mini" @click="$refs.userList.queryHandler()">搜索</el-button>
                <el-button plain type="primary" size="mini" @click="exportHandler" :loading="exportLoading">导出</el-button>
                <a ref="downloadDOM" :href="`/web/index.php?c=site&a=entry&m=ewei_shopv2&do=web&r=merch.credit.export&action=${form.tpl}`" v-show></a>
            </div> -->
        </gz-list>
        <el-dialog title="添加/修改" :visible.sync="dialogFormVisible" @close="resetDialogForm('dialogForm')">
            <el-form :model="dialogForm" ref="dialogForm" label-width="100px">
                <el-form-item label="收货人：" prop="name">
                    <el-input v-model="dialogForm.name" type="text" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="收货电话：" prop="name">
                    <el-input v-model="dialogForm.mobile" type="text" placeholder="请输入收货电话"></el-input>
                </el-form-item>
                <el-form-item label="收货地址：" prop="address">
                    <span>{{(dialogForm.areaName + dialogForm.addressDetail) || dialogForm.address}}</span>
                    <el-button type="primary" @click="isSetArea=!isSetArea" size="small" style="margin-left:20px;">设置</el-button>
                </el-form-item>
                <div v-show="isSetArea">
                    <el-form-item label="选择地区：" prop="areaName">
                        <el-cascader
                            ref="cascaderAddr"
                            v-model="dialogForm.areaCode"
                            :options="citys"
                            :props="{ value: 'code', label: 'name' }"
                            clearable
                            @change="handleChange"
                        ></el-cascader>
                    </el-form-item>
                    <el-form-item label="详细地址：" prop="address">
                        <el-input v-model="dialogForm.addressDetail" type="textarea" placeholder="请输入详细地址"></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="发货商品：" prop="goods">
                    <el-radio v-for="(item, index) in product_goods" v-model="dialogForm.goods" :label="index+1">{{item}}</el-radio>
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
import common from "@/components/common";
import BaseComponent from '@/views/base';
import ydArea from '@/yd-area.js';
import { mapGetters, mapActions } from 'vuex';

const colNameMap = [
    {
        key: 'orderno',
        displayName: '订单号',
        width: 100,
    }, {
        key: 'name',
        displayName: '工号',
    }, {
        key: 'teamname',
        displayName: '团队工号',
    }, {
        key: 'mobile',
        displayName: '手机号',
        width: 120,
    }, {
        key: 'score',
        displayName: '积分值',
        width: 100,
    }, {
        key: 'donetime',
        displayName: '下单时间',
        width: 140
    }, {
        key: 'goods',
        displayName: '商品',
    }, {
        key: 'name1',
        displayName: '收件人',
    }, {
        key: 'address',
        displayName: '收货地址',
    }, {
        key: 'sjmobile',
        displayName: '收货电话',
        width: 120,
    }, {
        key: 'status_des',
        displayName: '状态',
        width: 80,
    }, {
        displayName: '操作',
        type: 'button',
    }
];
const operation = [
    {
        key: 'update',
        textFun: (row) => row.address ? '修改' : '添加',
        buttonType: 'default',
        size: 'mini'
    }
];
// const products = {
//     '16500': ['【主】27卷有芯卷纸', '4.5公斤洗衣液组合装', '碗筷6件套', '精美茶具', '微波炉加热碗'],
//     '19800': ['【主】10000毫安充电宝（1万毫安）', '27卷有芯卷纸', '4.5公斤洗衣液组合装', '碗筷6件套', '精美茶具', '微波炉加热碗'],
//     '26400': ['【主】运动蓝牙耳机（黑色）', '【主】运动蓝牙耳机（红色）', '10000毫安充电宝（1万毫安）', '27卷有芯卷纸+4包抽纸', '4.5公斤洗衣液组合装', '碗筷6件套', '精美茶具', '微波炉加热碗']
// }
export default {
    extends: BaseComponent,
    data() {
        return {
            orderList: {
                list: [],
                paging: {
                    total: 100,
                }
            },
            jfList: [],
            colNameMap,
            operation,
            form: {
                keyword: '',
                timeRange: [],
                sadminname: '',
                status: '',
            },
            // statusOpt: [
            //     { value: '1', label: '成功' },
            //     { value: '2', label: '失败' },
            //     { value: '3', label: '待确认' },
            // ],
            loading: true,
            pageShow: true,
            exportLoading: false,
            queryString: '',
            
            citys: [],            
            dialogFormVisible: false,
            isSetArea: false,
            orderItem: {},
            dialogForm: {
                name: '',
                mobile: '',
                address: '',
                goods: '',
                areaName: '',
                areaCode: '',
                addressDetail: '',
            }
        };
    },
    computed: {
        ...mapGetters([
            'products'
        ]),
        viewData() {
            return this.formatViewData();
        },
        product_goods() {
            if (!this.products) return [];
            let product = this.products.filter(item => item.id == this.orderItem.productid)[0] || {};
            let pGoods = product.goods || '';
            return pGoods.split(',') || [];
        }
    },
    methods: {
        ...mapActions([
            'getProducts'
        ]),
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
            console.log(this.form.timeRange);
            let begintime = this.form.timeRange ? this.form.timeRange[0] || '' : ''
            let endtime = this.form.timeRange ? this.form.timeRange[1] || '' : ''
            let data = {
                adminid: localStorage.getItem('loginId'),
                page: queryCondition.paging.pageIndex,
                sadminname: this.form.sadminname,
                keyword: this.form.keyword,
                status: '3',
                begintime: begintime ? listMethodBase.formatTime(begintime) : '',
                // endtime: endtime ? listMethodBase.formatDate(endtime) + ' 23:59:59' : '',
                endtime: endtime ? listMethodBase.formatTime(endtime) : '',
            }
            this.createQueryString(data);
            // let queryString = `adminid=${localStorage.getItem('loginId')}&page=${queryCondition.paging.pageIndex}&sadminname=${this.form.sadminname}&keyword=${this.form.keyword}&begintime=${begintime ? listMethodBase.formatTime(begintime) : ''}&endtime=${endtime ? listMethodBase.formatDate(endtime) + ' 23:59:59' : ''}&export=1`
            // console.log(22222, queryString);
            this.$fly.get(`/ydjf/getmyorder`, data)
            .then((res) => {
                if (typeof res === 'string') res = JSON.parse(res);
                let { m, s, d } = res;
                this.loading = false;
                if (s == 1) {
                    this.pageShow = true;
                    this.orderList = Object.assign({}, d.data, {
                        list: d.data.list || [],
                        paging: d.data.paging
                    });
                } else {
                    this.$message.error(m);
                    this.orderList = Object.assign({}, {
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
            // console.log(111111, this.queryString);
        },
        formatViewData() {
            let stutasEme = {
                '1': '成功',
                '2': '失败',
                '3': '待确认',
            }
            return this.orderList.list.map((item) => {
                const targetItem = Object.assign({}, item, {
                    status_des: stutasEme[item.status]
                });
                return targetItem;
            });
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
        getMobileLoc(mobile) {
            return this.$fly.get('/ydjf/getmobileloc', { mobile: mobile })
            .then((res) => {
                if (typeof res === 'string') res = JSON.parse(res);
                let { content } = res;
                content = JSON.parse(content)
                let city = content.response[mobile].detail.area[0].city;
                let provice = content.response[mobile].detail.province;
                return Promise.resolve(provice + ' ' + city);
            })
        },
        clickToCheck(args) {
            this.orderItem = args[1];
            this.dialogForm = Object.assign({}, this.dialogForm, {
                name: args[1].name1,
                mobile: args[1].sjmobile || args[1].mobile,
                address: args[1].address,
                goods: '',
            })
            this.dialogFormVisible = true;
            this.getMobileLoc(args[1].sjmobile || args[1].mobile)
            .then((resAddress) => {
                let addressStr = args[1].address.replace(/\s*/g, "")
                this.dialogForm = Object.assign({}, this.dialogForm, {
                    address: addressStr ? args[1].address : resAddress
                })
            })
        },
        onSumbit() {
            if (!this.dialogForm.goods) {
                this.$message.error('请选择发货商品');
                return false;                
            }
            let handleAddress = `${this.dialogForm.areaName || ''}${this.dialogForm.addressDetail || ''}`;
            this.$fly.post('/ydjf/saveadd', common.obj2formdata({
                name: this.dialogForm.name || '',
                sjmobile: this.dialogForm.mobile || '',
                orderid: this.orderItem.id,
                address: this.dialogForm.areaName ? handleAddress : this.dialogForm.address,  // 优先上传手动设置的地址，否则上传原地址
                goods: this.product_goods[this.dialogForm.goods-1]
            })).then((res) => {
                if (typeof res === 'string') res = JSON.parse(res);
                let { m, s, d } = res
                if (s==1) {
                    this.$message.success(m);
                    this.dialogFormVisible = false;
                    this.$refs.orderList.queryHandler();
                } else {
                    this.$message.error(m);
                }
            })
        },
        handleChange(e) {
            console.log(e, this.$refs.cascaderAddr.getCheckedNodes()[0].pathLabels);
            let labels = this.$refs.cascaderAddr.getCheckedNodes()[0].pathLabels
            this.dialogForm = Object.assign({}, this.dialogForm, {
                areaName: `${labels[0]} ${labels[1]} ${labels[2]} `
            })
        },
        resetDialogForm(formName) {
            this.dialogForm = Object.assign({}, this.dialogForm, {
                name: '',
                mobile: '',
                address: '',
                goods: '',
                areaName: '',
                areaCode: '',
                addressDetail: '',
            })
            this.isSetArea = false;
        },
        // 生成城市json
        setCitys() {
            let provList = ydArea.data.provinceList;
            let cityList = ydArea.data.cityList;
            let distList = ydArea.data.districtList;
            this.citys = provList.map(item => Object.assign({}, item, {
                children: cityList[item.code].map(sub => Object.assign({}, sub, {
                    children: distList[sub.code]
                })),
            }));
        }
    },
    components: {
        [List.name]: List,
    },
    mounted() {
        this.$refs.orderList.queryHandler();
        this.getProducts(1);
        this.setCitys();
        if (localStorage.getItem('teamid') != 0) {
            this.colNameMap = this.colNameMap.filter(item => item.key != 'teamname');
        }
    },
};
</script>

<style lang="less">
.order-list {
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