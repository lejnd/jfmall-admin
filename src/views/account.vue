<template>
<div class='account'>
    <div class="groups">
        <div class="item">
            <div class="info">
                <span class="name">可用店铺余额(元)</span>
                <span class="deco">(不可用店铺余额 <i>0.00</i> 元)</span>
            </div>
            <div class="amount">
                <span class="num">1672388.51</span>
                <el-button plain size="small" class="btn" @click="gotoCashout">提 现</el-button>
            </div>
        </div>
        <div class="item">
            <div class="info">
                <span class="name">待结算(元)</span>
            </div>
            <div class="amount">
                <span class="num">6672388.51</span>
            </div>
        </div>
    </div>
    <div class="box-title">
        <div class="content">
            <div class="tag"></div>
            <span>收支概况</span>
        </div>
    </div>
    <el-table
    :data="tableData"
    border
    class="account-table"
    style="width: 100%">
        <el-table-column label="账户" prop="name" width="150">
        </el-table-column>
        <el-table-column label="收入">
            <template slot-scope="scope">
                <div class="cell-wrapper">
                    <div class="cell-item" v-for="(item, index) in scope.row.incomeList" :key="index">
                        <span class="ele">{{item.name}}</span>
                        <span class="ele">{{item.money}}元</span>
                        <span class="ele">{{item.amount}}笔</span>
                        <el-button class="btn" type="text">明细</el-button>
                    </div>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="支出">
            <template slot-scope="scope">
                <div class="cell-wrapper">
                    <div class="cell-item" v-for="(item, index) in scope.row.outcomeList" :key="index">                
                        <span class="ele">{{item.name}}</span>
                        <span class="ele">{{item.money}}元</span>
                        <span class="ele">{{item.amount}}笔</span>
                        <el-button class="btn" type="text">明细</el-button>
                    </div>
                </div>
            </template>
        </el-table-column>
    </el-table>
</div>
</template>

<script>

export default {
   name: 'Account',
   components: {},
   data() {
       return {
           tableData: [{
               name: '店铺余额',
               incomeList: [
                   { name: '订单入账', money: '53343.23', amount: '109' }
               ],
               outcomeList: [
                   { name: '退款', money: '343.23', amount: '1' },
                   { name: '交易手续费', money: '3343.23', amount: '109' },
                   { name: '交易手续费', money: '43.23', amount: '109' },
               ]
           }]
       };
   },
   methods: {
       gotoCashout() {
           this.$router.push('cashout');
       }
   },
   mounted() {
       
   },
}
</script>

<style lang='less'>
.account {
    min-width: 900px;
    .groups {
        padding: 60px 0 100px 30px;
        display: flex;
        .item {
            flex: 1;
            .info {
                font-size: 12px;
                .deco {
                    margin-left: 12px;
                    color: #999;
                    i {
                        color: #409EFF;
                        font-style: unset;
                    }
                }
            }
            .amount {
                padding: 20px 0;
                display: flex;
                align-items: center;
                .num {
                    font-size: 24px;
                    font-weight: 400;
                }
                .btn {
                    color: #3388ff;
                    font-weight: 400;
                    margin-left: 20px;
                }
            }
        }
    }
    .box-title {
        padding: 10px 12px;
        background-color: #f5f5f5;
        .content {
            display: flex;
            align-items: center;
            .tag {
                height: .9em;
                width: 3px;
                background-color: #3388ff;
            }
            span {
                margin-left: 6px;
            }
        }
    }
    .account-table {
        td {
            vertical-align: top;
            &:first-child {
                vertical-align: middle;
            }
        }
        .cell-wrapper {
            padding: 0 20px;
            .cell-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid #eee;
                padding: 15px 0;
                font-size: 12px;
                &:last-child {
                    border-bottom: 0;
                }
                .ele {
                    flex: 1;
                }
                .btn {
                    font-size: 12px;
                    font-weight: 400;
                }
            }
        }
    }
}
</style>