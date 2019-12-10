<template>
<!-- /www/wwwroot/rrcloud/addons/ewei_shopv2/plugin/merch/template/web_v3/manage/sysset -->
<div class='set-payment'>
    <div class="header">
        <div class="line">
            <img src="" alt="">
            <span class="name">微信支付</span>
            <el-switch
                v-model="selected"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="openCust()">
            </el-switch>
        </div>
        <div class="line">
            <p class="deco">资金结算至店铺余额，结算时扣除0.65%交易手续费（微信收取）。（支付宝内无法使用微信支付）</p>
        </div>
    </div>
    <el-table
        :data="tableData"
        border
    >
        <el-table-column v-for="(col, index) in rowHeader" :key="index" :prop="col.prop" :label="col.label" align="center">
        </el-table-column>
    </el-table>
    <div class="tip">
        注：首次开通有4元手续费，当月从账户余额中扣除
    </div>
</div>
</template>

<script>
import common from "../components/common";
export default {
   name: 'SetPayment',
   components: {},
   data() {
       return {
            selected: false,
            rowHeader: [
                { prop: 'way', label: '支付方式' },
                { prop: 'where', label: '收款去向' },
                { prop: 'fee', label: '交易手续费' },
                { prop: 'cycle', label: '结算周期' },
                { prop: 'settlement', label: '结算' },
                { prop: 'refund', label: '退款' }
            ],
            tableData: [{
                way: '微信支付',
                where: '代销',
                fee: '0.65%，飞迅代收，结算时扣除',
                cycle: '确认收货或发货后T+1结算',
                settlement: '随时申请提现，最低门槛手续费为2元',
                refund: '订单退款直接在店铺发起'
            }]
       };
   },
   methods: {
        openCust() {
            let flag = this.selected ? 1 : 2
            let data = {
                openid: window.$openid,
                flag: flag,
            }
            this.$fly.post('/web/index.php?c=site&a=entry&m=ewei_shopv2&do=web&r=payapi.openCust', common.obj2formdata(data))
            .then((res) => {
                let { status, result } = res;
                this.$message(result);
            })
        }
   },
   mounted() {
       this.selected = window.parent.$status == '1' ? true : false;
       console.log(window.parent.$status);
   },
}
</script>

<style lang='less'>
.set-payment {
    .header {
        background-color: #f5f5f5;
        padding: 10px;
        .line {
            padding: 5px;
            display: flex;
            align-items: center;
            .name {
                font-size: 20px;
                flex: 1;
            }
            .deco {
                font-size: 12px;
                color: #999;
            }
        }
    }
    .el-table td {
        padding-top: 80px;
        padding-bottom: 80px;
    }
    .tip {
        padding: 30px;
        font-size: 14px;
    }
}
</style>