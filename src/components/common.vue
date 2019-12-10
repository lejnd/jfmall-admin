<script>
import moment from 'moment';
// 手机号验证规则
const isVerificationNumber = (number) => {
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(number)) {
        return false;
    } else {
        return true;
    }
}

// form-data转换
const obj2formdata = (obj) => {
    let formData = new FormData();
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const element = obj[key];
            formData.append(key, element)
        }
    }
    return formData;
}

// 日期时间格式化
const formatTime = (originTime) => {
    if (!originTime) return null;
    return moment(originTime).format('YYYY/MM/DD HH:mm:ss');
}

// 日期格式化
const formatDate = (originTime) => {
    if (!originTime) return null;
    return moment(originTime).format('YYYY/MM/DD');
}

export default {
    isVerificationNumber, obj2formdata, formatTime, formatDate
}
</script>
