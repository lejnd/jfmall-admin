<template>
<!-- /www/wwwroot/rrcloud/addons/ewei_shopv2/plugin/merch/template/web_v3/manage/apply/withdraw.html -->
<div class='cash-out'>
    <div class="account">
        <h1 class="title">可提现金额</h1>
        <div class="money">¥ {{amount}}</div>
    </div>
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="110px" class="cash-form">
        <!-- <el-form-item label="姓名：" prop="name">
            <el-input class="small-input" v-model="form.cash"></el-input>
        </el-form-item>
        <el-form-item label="开户银行：" prop="account">
            <el-select v-model="form.bankName" placeholder="请选择">
                <el-option
                v-for="item in bankOpts"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </el-form-item> -->
        <el-form-item label="到账银行卡：" prop="bankid">
            <div class="flex-box">
                <el-select v-model="form.bankid" placeholder="请选择">
                    <el-option
                    v-for="item in bankOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-button class="btn" type="text" @click="dialogFormVisible = true">绑卡</el-button>
            </div>
        </el-form-item>
        <el-form-item label="本次提现：" prop="Amount">
            <div class="flex-box">
                <el-input class="small-input" type="number" v-model="form.Amount" placeholder="输入金额">
                    <template slot="append">元</template>
                </el-input>
                <el-button class="btn" type="text" @click="form.Amount = parseInt(amount)">全额提现</el-button>
            </div>
        </el-form-item>
        <!-- <el-form-item label="手机号：" prop="name">
            <el-input class="small-input" v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item label="短信验证码：" prop="code">
            <div class="flex-box">
                <el-input class="small-input" v-model="form.code"></el-input>
                <sms-btn :mobile="form.mobile" type="primary" class="codeBtn"></sms-btn>
            </div>
            <p class="tip">验证短信将发送到你的手机，请注意查收</p>
        </el-form-item> -->
        <el-form-item label="备注：">
            <el-input type="textarea" :rows="2" :maxlength="50" placeholder="最多可输入50个字" v-model="form.Remark" style="width:350px;"></el-input>
        </el-form-item>
        <el-form-item>
            <div class="btn-group">
                <el-button type="primary" @click="onSubmit('ruleForm')">提交申请</el-button>
                <el-button @click="goback">返回</el-button>
            </div>
        </el-form-item>
    </el-form>

    <el-dialog class="card-dialog" title="添加银行卡" :visible.sync="dialogFormVisible" @close="resetForm('cardForm')">
        <el-form :model="cardform" :rules="cardRules" ref="cardForm" label-width="100px">
            <el-form-item label="开户行：" prop="BankName">
                <el-select v-model="cardform.BankName" placeholder="请选择" @change="cardform.ReceiveAccountNo = ''">
                    <el-option
                    v-for="item in bankNameOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="银行卡号：" prop="ReceiveAccountNo">
                <el-input v-model="cardform.ReceiveAccountNo" :disabled="!cardform.BankName" placeholder="请输入银行卡号"></el-input>
            </el-form-item>
            <el-form-item label="持卡人：" prop="ReceiveAccountName">
                <el-input v-model="cardform.ReceiveAccountName" placeholder="请输入持卡人姓名"></el-input>                
            </el-form-item>
            <!-- <el-form-item label="身份证号：" prop="CertificateNo">
                <el-input v-model="cardform.CertificateNo" placeholder="请输入身份证号"></el-input>                
            </el-form-item> -->
            <el-form-item label="手机号：" prop="Mobile">
                <el-input v-model="cardform.Mobile" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="验证码：" prop="Code">
                <div class="flex-box">
                    <el-input class="small-input" v-model="cardform.Code" placeholder="请输入短信验证码"></el-input>
                    <sms-btn :mobile="cardform.Mobile" type="primary" class="codeBtn" @getCode="getCode"></sms-btn>
                </div>              
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="doBind('cardForm')">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import SmsBtn from '@/components/smscode-button';
import common from "../components/common";
const rules = {
    bankid: [
        { required: true, message: '请选择到账银行卡', trigger: 'change' },
    ],
    Amount: [
        { required: true, message: '请输入提现金额', trigger: 'change' },
    ],
};
const openid =  window.$openid;
// const openid = 'oxN0Q1CalWJS_R19dFDAeW5afrG0';
export default {
    name: 'CashOut',
    components: { SmsBtn },
    data() {
        var checkCard = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请输入银行卡号'));
            } else {
                this.$fly.post('/web/merchant.php?c=site&a=entry&m=ewei_shopv2&do=web&r=withdraw.CheckBank', common.obj2formdata({
                    ReceiveAccountNo: this.cardform.ReceiveAccountNo,
                    BankName: this.cardform.BankName
                })).then((res) => {
                    let { status, data } = res;
                    if (status == 0) {
                        callback();  
                    } else {
                        callback(new Error(`卡号格式不对，请输入${this.cardform.BankName}卡号`));
                    }
                }).catch(() => {
                    callback();
                })
            }
        };
        return {
            rules,
            cardRules: {
                BankName: [
                    { required: true, message: '请选择开户行名称', trigger: 'change' },
                ],
                ReceiveAccountNo: [
                    { validator: checkCard, trigger: 'blur' }
                ],
                ReceiveAccountName: [
                    { required: true, message: '请输入持卡人姓名', trigger: 'blur' },
                ],
                Mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/, message: '手机号格式错误' }
                ],
                Code: [
                    { required: true, message: '请输入短信验证码', trigger: 'blur' },
                ],
            },
            bankOpts: [],
            bankNameOpts: [{
                label: '中国建设银行',
                value: '中国建设银行'
            }, {
                label: '云南省农村信用社',
                value: '云南省农村信用社'
            }],
            dialogFormVisible: false,
            form: {
                Amount: '',
                bankid: '',
                Remark: '',
                openid,
            },
            cardform: {
                ReceiveAccountNo: '',
                ReceiveAccountName: '',
                BankName: '',
                Mobile: '',
                Code: '',
                openid,
            },
            amount: 0,
        };
    },
    methods: {
        getBank() {
            this.$fly.post('/web/merchant.php?c=site&a=entry&m=ewei_shopv2&do=web&r=withdraw.getBank', common.obj2formdata({
                openid: openid
            })).then((res) => {
                let { status, data } = res;
                if (status == 0) {
                    this.amount = data.amount ? data.amount : 0;
                    console.log(this.amount);
                    let list = data.list || [];
                    this.bankOpts = list.map(item => {
                        let card = item.ReceiveAccountNo;
                        let lastFour = card.slice(card.length - 4, card.length);
                        let obj = {
                            label: `${item.BankName} - ${item.ReceiveAccountName} - 尾号 ${lastFour}`,
                            value: item.id,
                        }
                        return obj;
                    })
                    if (this.bankOpts.length > 0) {
                        this.form = Object.assign({}, this.form, {
                            bankid: this.bankOpts[0].value,
                        })
                    }
                }
            })
        },
        goback() {
            window.parent.history.back(-1);
            return false;
        },
        onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.form.Amount <= 0) {
                        this.$message.error('请输入正确的提现金额');
                        return false;
                    }
                    if (this.form.Amount > parseInt(this.amount)) {
                        this.$message.error('提现金额不能大于余额');
                        return false;
                    }
                    this.$confirm('确定申请提现吗？', `提现金额：¥ ${this.form.Amount}`, {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$fly.post('/web/merchant.php?c=site&a=entry&m=ewei_shopv2&do=web&r=withdraw.withdraw', common.obj2formdata(this.form))
                        .then((res) => {
                            let { status, msg } = res;
                            this.$message(msg);
                            if (status == 0) {
                                this.getBank();
                            }
                        })
                    })
                } else {
                    return false;
                }
            });
        },
        doBind(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$fly.post('/web/merchant.php?c=site&a=entry&m=ewei_shopv2&do=web&r=withdraw.bindCard', common.obj2formdata(this.cardform))
                    .then((res) => {
                        let { status, msg } = res;
                        if (status == 0) {
                            this.dialogFormVisible = false;
                            this.$message.success(msg);
                            this.getBank();
                        } else {
                            this.$message.error(msg);
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        getCode(mobile) {
            this.$fly.post('/web/merchant.php?c=site&a=entry&m=ewei_shopv2&do=web&r=withdraw.withdrawcode', common.obj2formdata({
                mobile: mobile,
            })).then((res) => {
                let { result, status } = res;
                if (status == 0) {
                    this.$message.success(result.message);
                } else {
                    this.$message.error(result.message);
                }
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    },
    mounted() {
        this.getBank();
    },
}
</script>

<style lang='less'>
.cash-out {
    padding: 20px;
    .el-select {
        width:350px;
    }
    .card-dialog {
        .el-dialog {
            width: 500px;
        }
        .el-select {
            width: 100%;
        }
    }
    .account {
        width: 500px;
        border: 1px solid #eee;
        border-radius: 4px;
        margin-bottom: 40px;
        .title {
            line-height: 40px;
            background-color: #f5f5f5;
            font-size: 16px;
            padding: 0 15px;
            font-weight: 500;
        }
        .money {
            text-align: center;
            padding: 40px 0;
            color: #ed423d;
            font-size: 20px;
            font-weight: 600;
        }
    }
    .cash-form {
        .tip {
            color: #999;
            font-size: 12px;
            margin-left: 10px;
        }
        .small-input {
            width: 350px;
        }
        .btn-group {
            margin-top: 20px;
        }
    }
    .flex-box {
        display: flex;
        .btn {
            padding: 0 10px;
            font-weight: 400;
        }
        .codeBtn {
            border-radius: 0 4px 4px 0;
            margin-left: -5px;
            z-index: 1;
        }
    }
}
</style>