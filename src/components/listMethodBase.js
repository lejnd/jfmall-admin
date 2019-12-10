import moment from 'moment';
import { Notification } from 'element-ui';

moment.locale('zh-cn');
export default {
    isNoSelected(selectedList, emptyTime) {
        const now = new Date().getTime();
        if (selectedList.length === 0 && (now - emptyTime) > 3000) {
            this.$set(this, 'emptyTime', now);
            this.$message({
                showClose: true,
                message: '请至少选择一条记录~',
                type: 'error',
            });
            return true;
        } else if (selectedList.length === 0 && (now - emptyTime) < 3000) {
            return true;
        } return false;
    },
    isSingleSelected(selectedList) {
        if (selectedList.length > 1) {
            this.$alert('只能选择一条记录进行操作，请重新选择', '提示', {
                confirmButtonText: '确定',
            });
            return false;
        }
        return true;
    },
    formatAddress(originData) {
        return Object.keys(originData).reduce((str, key) => str + (originData[key].name || ''), '');
    },
    formatTime(originTime) {
        if (!originTime) return null;
        return moment(originTime).format('YYYY-MM-DD HH:mm:ss');
    },
    formatDate(originTime) {
        if (!originTime) return null;
        return moment(originTime).format('YYYY-MM-DD');
    },
    timewarn(starttime, endtime) {
        if (starttime > endtime && endtime !== '') {
            // alert('请选择正确的时间范围')
            Notification({
                title: '提示',
                message: '请选择正确的时间范围',
                type: 'warning'
            });
            return;
        }
    }
};