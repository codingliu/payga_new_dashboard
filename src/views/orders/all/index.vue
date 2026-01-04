<template>
  <div class="page-container">
    <!-- 第一层：搜索框区域（绑定搜索条件，字段名与API参数名一致） -->
    <div class="search-area">
      <div class="search-row">
        <div class="search-item">
          <label class="search-label">{{tr('商户订单号')}}</label>
          <!-- 字段名 merchantOrderNo 与API参数名一致 -->
          <a-input
              v-model="searchForm.merchantOrderNo"
              :placeholder="tr('请输入商户订单号')"
              class="search-input"
          />
        </div>
        <div class="search-item">
          <label class="search-label">{{tr('平台订单号')}}</label>
          <!-- 字段名 platNo 与API参数名一致 -->
          <a-input
              v-model="searchForm.platNo"
              :placeholder="tr('请输入平台订单号')"
              class="search-input"
          />
        </div>
        <div class="search-item">
          <label class="search-label">{{tr('支付状态')}}</label>
          <a-select style="height:38px;"
              v-model="searchForm.paymentStatus"
              :placeholder="tr('请选择支付状态')"
              class="search-input">
            <a-option value="">{{tr('全部')}}</a-option>
            <a-option value="CREATED">{{tr('已创建')}}</a-option>
            <a-option value="CLEARED">{{tr('已支付')}}</a-option>
            <a-option value="PENDING">{{tr('支付中')}}</a-option>
          </a-select>
        </div>
      </div>
      <div class="search-row">
        <div class="search-item">
          <label class="search-label">{{tr('付款人手机号')}}</label>
          <a-input
              v-model="searchForm.payerMobile"
              :placeholder="tr('请输入付款人手机号')"
              class="search-input"
          />
        </div>
        <div class="search-item">
          <label class="search-label">{{tr('付款人邮箱')}}</label>
          <a-input
              v-model="searchForm.payerEmail"
              :placeholder="tr('请输入付款人邮箱')"
              class="search-input"
          />
        </div>
        <div class="search-item">
          <label class="search-label">{{tr('付款人姓名')}}</label>
          <a-input
              v-model="searchForm.payerInfo"
              :placeholder="tr('请输入付款人姓名')"
              class="search-input"
          />
        </div>
      </div>
      <div class="search-row">
        <div class="search-item">
          <label class="search-label">{{tr('银行流水号')}}</label>
          <a-input
              v-model="searchForm.trxId"
              :placeholder="tr('请输入银行流水号')"
              class="search-input"
          />
        </div>
        <div class="search-item">
          <label class="search-label">{{tr('创建时间')}}</label>
          <a-range-picker style="height:38px; width: 550px;"
              v-model="searchForm.createTimeRange"
              class="search-input"
              show-time
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
          />
        </div>
        <!--<div class="search-item">
          <label class="search-label">{{tr('更新时间')}}</label>
          <a-range-picker
              v-model="searchForm.updateTimeRange"
              :placeholder="tr('选择时间范围')"
              class="search-input"
              show-time
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
          />
        </div>
        div class="search-item">
          <label class="search-label">{{tr('金额')}}</label>
          <div class="amount-group">
            <a-input
                v-model="searchForm.minAmount"
                placeholder="最小金额"
                class="search-input amount-input"
                type="number"
            />
            <span class="amount-separator">-</span>
            <a-input
                v-model="searchForm.maxAmount"
                placeholder="最大金额"
                class="search-input amount-input"
                type="number"
            />
          </div>
        </div-->
        <!--div class="search-item">
          <label class="search-label">{{tr('清算状态')}}</label>
          <a-select
              v-model="searchForm.settlementStatus"
              :placeholder="tr('请选择清算状态')"
              class="search-input"
          >
            <a-option value="">{{tr('全部')}}</a-option>
            <a-option value="SETTLED">{{tr('已清算')}}</a-option>
            <a-option value="UNSETTLED">{{tr('未清算')}}</a-option>
          </a-select>
        </div-->
      </div>
    </div>

    <!-- 第二层：操作按钮区域 -->
    <div class="button-area">
      <a-button type="primary" icon="search" style="background-color: #5d87ff" @click="handleSearch()">{{tr('搜索')}}</a-button>
      <a-button type="primary" icon="refresh" style="margin-left: 8px; background-color: #5d87ff" @click="handleReset()">{{tr('重置')}}</a-button>
      <a-button type="primary" icon="download" style="margin-left: 8px; background-color: #5d87ff" @click="handleExport()" :loading="exportLoading">{{tr('导出')}}</a-button>
    </div>
    <!-- 新增：分隔线（区分按钮和统计卡片） -->
    <div class="divider"></div>
    <!-- 第三层：统计卡片区域 -->
    <div class="stats-area">
      <div class="stats-card blue">
        <div class="stats-value">{{ statsData.totalOrder }}</div>
        <div class="stats-label">{{tr('总订单数')}}</div>
      </div>
      <div class="stats-card purple">
        <div class="stats-value">{{ statsData.totalAmount }}</div>
        <div class="stats-label">{{tr('总金额')}}</div>
      </div>
      <div class="stats-card green">
        <div class="stats-value">{{ statsData.successAmount }}</div>
        <div class="stats-label">{{tr('成功金额')}}</div>
      </div>
      <div class="stats-card orange">
        <div class="stats-value">{{ statsData.refundAmount }}</div>
        <div class="stats-label">{{tr('退款金额')}}</div>
      </div>
      <div class="stats-card yellow">
        <div class="stats-value">{{ statsData.successFee }}</div>
        <div class="stats-label">{{tr('成功费用')}}</div>
      </div>
      <div class="stats-card red">
        <div class="stats-value">{{ statsData.disputeAmount }}</div>
        <div class="stats-label">{{tr('争议金额')}}</div>
      </div>
    </div>

    <!-- 第四层：数据表格区域（改用Table自带loading，不破坏原有样式） -->
    <div class="table-area"> <!-- 控制容器渲染 -->
      <a-table
          :columns="columns"
          :data="tableData"
          bordered
          :pagination="false"
          :scroll="{ x: 'max-content' }"
          :loading="tableLoading"
          loading-text="Loading..."
          :key="paginationConfig.current + '-' + paginationConfig.pageSize" >
      <template #state="{ record }">
        <span :class="getStateClass(record.paymentStatus)">{{ record.paymentStatus }}</span>
      </template>
        <!-- 回调按钮绑定点击事件，传递当前行数据record -->
        <template #operation="{ record }">
          <a-button
              type="primary"
              size="small"
              @click="handleCallback(record)"
              :loading="callbackLoadingMap[record.merchantOrderNo]"
          >
          {{tr('回调')}}
          </a-button>
        </template>
      </a-table>

      <!-- 独立分页组件：直接绑定分页配置，确保事件正常触发 -->
      <div class="pagination-wrapper" style="margin-top: 20px; text-align: right;">
        <a-pagination
            v-model:current="paginationConfig.current"
        v-model:page-size="paginationConfig.pageSize"
        :total="paginationConfig.total"
        show-total
        show-size-changer
        show-quick-jumper
        @change="handlePaginationChange"
        />
      </div>
    </div>
  </div>
</template>


<script setup>
import { reactive, ref, onMounted, nextTick } from 'vue' // 导入nextTick
import {
  Input,
  Select,
  Option,
  RangePicker,
  Button,
  Table,
  Pagination,
  Message
} from '@arco-design/web-vue'
import { request } from "@/utils/request";
import qs from 'qs';
import {tr} from "@/utils/common";
import tool from "@/utils/tool";
import dayjs from "dayjs";

const getDefaultDate = () => {
  const threeDaysAgo = dayjs().subtract(3, 'day').format('YYYY-MM-DD 00:00:00');
  const today = dayjs().format('YYYY-MM-DD 23:59:59');
  return [threeDaysAgo, today];
};
// 统计数据
const statsData = reactive({
  totalOrder: '0 '+tr('单'),
  totalAmount: '0 INR',
  successAmount: '0 INR',
  refundAmount: '0 INR',
  successFee: '0 INR',
  disputeAmount: '0 INR'
})

const searchForm = reactive({
  merchantOrderNo: '', // 与API参数名 merchantOrderNo 一致
  platNo: '', // 与API参数名 platNo 一致
  paymentStatus: '',
  bankNo: '',
  minAmount: '',
  maxAmount: '',
  payerName: '',
  payerMobile: '',
  payerEmail: '',
  settlementStatus: '',
  createTimeRange: getDefaultDate(),
  updateTimeRange: [],
  currency: ''
})
// 表格列配置
const columns = reactive([
  { title: tr('币种'), dataIndex: 'currency' },
  { title: tr('商户订单号'), dataIndex: 'merchantOrderNo', className: 'custom-number-class' },
  { title: tr('平台订单号'), dataIndex: 'platNo' },
  { title: tr('支付方式'), dataIndex: 'paymentMethodName' },
  { title: tr('付款人姓名'), dataIndex: 'payerInfo' },
  { title: tr('付款人手机号'), dataIndex: 'payerPhone' },
  { title: tr('付款人邮箱'), dataIndex: 'payerEmail' },
  { title: tr('支付金额'), dataIndex: 'actualAmount' },
  { title: tr('金额'), dataIndex: 'amount' },
  { title: tr('费用'), dataIndex: 'fee' },
  { title: tr('银行流水号'), dataIndex: 'trxId' },
  { title: tr('备注'), dataIndex: 'remark' },
  { title: tr('创建时间'), dataIndex: 'createdTime' },


  // 新增：状态列（固定在右侧）
  {
    title: tr('状态'),
    slotName: 'state',
    width: 150,
    fixed: 'right' // 固定在右侧
  },
  // 操作列（固定在右侧）
  {
    title: tr('操作'),
    slotName: 'operation',
    width: 80,
    fixed: 'right' // 固定在右侧
  }
])

// 表格加载状态（简化为普通布尔值，更易控制）
const tableLoading = ref(false) // false：隐藏；true：显示
const exportLoading = ref(false)
// 获取支付列表API（接收分页参数和搜索条件）
const getPayList = async (page = 1, limit = 15, searchParams = {}) => {
  try {
    await nextTick(); // 等待DOM更新

    tableLoading.value = true;
    // 构造请求参数（分页参数 + 搜索条件）
    const requestParams = {
      page: paginationConfig.current,
      pageSize: paginationConfig.pageSize,
      ...searchParams
    };

    // 2. 拆分创建时间：从createTimeRange提取start/end，转为后端参数名
    const [createStartTime, createEndTime] = searchParams.createTimeRange || [];
    // 添加createdStartTime和createdEndTime到请求参数
    if (createStartTime) {
      requestParams.createdStartTime = createStartTime;
    }
    if (createEndTime) {
      requestParams.createdEndTime = createEndTime;
    }

    // 3. 删除原有的createTimeRange（避免传递给后端）
    delete requestParams.createTimeRange;
    // 同理：如果更新时间也需要拆分，按相同逻辑处理
    delete requestParams.updateTimeRange;

    // 2. 过滤无效参数：只移除 空字符串、空数组、null/undefined，有效参数保留
    Object.keys(requestParams).forEach(key => {
      const value = requestParams[key];
      if (value === '' ||
          (Array.isArray(value) && value.length === 0) ||
          value === null ||
          value === undefined) {
        delete requestParams[key];
      }
    });
    const res = await request({
      url: '/trade/payin/list', // API地址
      method: 'get',
      params: requestParams
    })
    // 解析接口返回数据
    if (res.code === '200') {
      const { item, paginator } = res.data;
      // 更新表格数据
      tableData.length = 0;
      tableData.push(...item);
      // 更新分页配置
      paginationConfig.current = paginator.page;
      paginationConfig.pageSize = paginator.limit;
      paginationConfig.total = paginator.totalCount;
    } else {
      console.error('failed：', res.message);
    }
  } catch (error) {
    console.error('failed：', error);
  } finally {
    tableLoading.value = false;
  }
}

// 新增：处理Excel导出的核心函数
const handleExport = async () => {
  exportLoading.value = true;
  try {
    // 1. 构造导出参数（与方案1一致）
    const exportParams = { ...searchForm };
    const [createStartTime, createEndTime] = exportParams.createTimeRange || [];
    if (createStartTime) {
      exportParams.createdStartTime = createStartTime;
    }
    if (createEndTime) {
      exportParams.createdEndTime = createEndTime;
    }
    delete exportParams.createTimeRange;
    delete exportParams.updateTimeRange;

    // 2. 过滤空参数
    const validParams = {};
    Object.keys(exportParams).forEach(key => {
      const value = exportParams[key];
      if (value !== '' && value !== null && value !== undefined && !Array.isArray(value) && value.length !== 0) {
        validParams[key] = value;
      }
    });

    const env = import.meta.env
    // 3. 拼接URL和参数
    const exportUrl = 'https://dashboard.paygaindia.com/api/trade/payin/list/export';
    const paramsStr = qs.stringify(validParams);
    const fullUrl = paramsStr ? `${exportUrl}?${paramsStr}` : exportUrl;
    // 4. 创建XMLHttpRequest对象，手动携带Token
    const xhr = new XMLHttpRequest();
    xhr.open('GET', fullUrl, true); // 若后端是POST，改为POST，并在send中传递参数
    // 关键：设置请求头携带Token（根据你的Token存储位置调整）
    const token = tool.local.get(env.VITE_APP_TOKEN_PREFIX); // 假设Token存在localStorage中
    xhr.setRequestHeader('MERCHANT-TOKEN', `${token}`); // 常见的Token传递格式
      // 若后端要求Token放在其他请求头，如：xhr.setRequestHeader('Token', token);
    xhr.responseType = 'blob';
    xhr.onload = function () {
      if (xhr.status === 200) {
        // 创建Blob对象
        const blob = new Blob([xhr.response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
        });
        // 提取文件名
        let fileName = 'PayInList.xlsx';
        const contentDisposition = xhr.getResponseHeader('content-disposition');
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename=(?:\"?)(.+?)(?:\"?;|$)/);
          if (fileNameMatch && fileNameMatch[1]) {
            fileName = decodeURIComponent(fileNameMatch[1]);
          }
        }
        // 模拟下载
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        // 销毁资源
        setTimeout(() => {
          URL.revokeObjectURL(downloadUrl);
          document.body.removeChild(a);
        }, 100);
        // 提示成功
        Message.success('Excel Export Success');
      } else {
        // 响应状态异常
        Message.error(`failed, code：${xhr.status}`);
      }
      exportLoading.value = false;
    };
    xhr.send();
  } catch (error) {
    exportLoading.value = false;
    console.error('failed：', error);
    Message.error('failed, pls try again');
  }
}

const callbackLoadingMap = reactive({})
const handleCallback = async (record) => {
  const orderNo = record.merchantOrderNo;
  // 设置当前行的loading状态
  callbackLoadingMap[orderNo] = true;
  try {
    // 发送回调API请求（替换为你的实际回调接口地址和参数）
    const res = await request({
      url: '/trade/payin/callback',
      method: 'get',
      data: {
        merchantOrderNo: orderNo
      }
    });
    // 请求成功，弹出success提示
    if (res.code === 200) {
      Message.success('success'); // 核心：弹出成功提示
      // 可选：刷新表格数据，更新回调后的状态
      // getPayList();
    } else {
      Message.error(res.message );
    }
  } catch (error) {
    console.error('failed：', error);
    Message.error('failed, pls try again');
  } finally {
    // 关闭当前行的loading状态
    callbackLoadingMap[orderNo] = false;
  }
}

// 独立分页组件事件：页码/每页条数变化时触发
const handlePaginationChange = () => {
  // 直接调用getPayList，使用paginationConfig的最新值
  getPayList(searchForm);
}

// 搜索按钮点击事件
const handleSearch = () => {
  // 搜索时重置页码为1
  paginationConfig.current = 1;
  // 携带搜索条件请求数据
  getPayList(paginationConfig.current, paginationConfig.pageSize, searchForm);
  getStatsData(searchForm);
}

// 重置按钮点击事件
const handleReset = () => {
  // 清空所有搜索条件
  Object.keys(searchForm).forEach(key => {
    if (Array.isArray(searchForm[key])) {
      searchForm[key] = [];
    } else {
      searchForm[key] = '';
    }
  });
  // 重置页码为1并重新请求
  paginationConfig.current = 1;
  getPayList(paginationConfig.current, paginationConfig.pageSize);
}

// 模拟表格数据
const tableData = reactive([])

// 状态对应的样式（匹配截图）
const getStateClass = (state) => {
  switch (state) {
    case 'CLEARED':
      return 'state-tag paid';
    case 'SUCCESS':
      return 'state-tag paid';
    case 'CREATED':
      return 'state-tag paying';
    case 'PENDING':
      return 'state-tag pending';
    default:
      return 'state-tag';
  }
}

// 调用统计数据API
const getStatsData = async (searchParams = {}) => {
  try {
    const requestParams = {
      ...searchParams
    };
// 2. 拆分创建时间：从createTimeRange提取start/end，转为后端参数名
    const [createStartTime, createEndTime] = searchParams.createTimeRange || [];
    // 添加createdStartTime和createdEndTime到请求参数
    if (createStartTime) {
      requestParams.createdStartTime = createStartTime;
    }
    if (createEndTime) {
      requestParams.createdEndTime = createEndTime;
    }

    // 3. 删除原有的createTimeRange（避免传递给后端）
    delete requestParams.createTimeRange;
    // 同理：如果更新时间也需要拆分，按相同逻辑处理
    delete requestParams.updateTimeRange;

    const res = await request({
      url: '/trade/payin/statistic',
      method: 'get',
      params: requestParams
    })
    const data = res.data;
    statsData.totalOrder = `${data.totalOrder || 0} Order`;
    statsData.totalAmount = `${data.totalAmount || 0} INR`;
    statsData.successAmount = `${data.successAmount || 0} INR`;
    statsData.refundAmount = `${data.refundAmount || 0} INR`;
    statsData.successFee = `${data.successFee || 0} INR`;
    statsData.disputeAmount = `${data.disputeAmount || 0} INR`;
  } catch (error) {
    console.error('failed ：', error);
  }
}
// 分页配置（绑定接口返回的分页信息）
const paginationConfig = reactive({
  current: 1,
  pageSize: 15,
  total: 0,
  showTotal: true,
  showSizeChanger: true,
  showQuickJumper: true
})


onMounted(() => {
  getStatsData(searchForm);
  getPayList(paginationConfig.current, paginationConfig.pageSize, searchForm);
})
</script>

<style scoped>
/* 原有样式完全保留，无变动 */
.page-container {
  padding: 20px;
  background-color: #ffffff;
  width: 100%;
  box-sizing: border-box;
}
.search-area {
  margin-bottom: 16px;
  width: 100%;
}
.search-row {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  width: 100%;
}
.search-item {
  display: flex;
  align-items: center;
  width: calc((100% - 40px) / 3);
}
.search-label {
  width: 90px;
  text-align: right;
  margin-right: 12px;
  font-size: 14px;
}
.search-input {
  width: 100% !important;
  height: 40px !important;
  font-size: 14px !important;
  padding: 0 16px !important;
  border: 1px solid #dcdfe6 !important;
  border-radius: 4px !important;
}
.search-input:focus,
:deep(.search-input:focus-within) {
  border-color: #5d87ff !important;
  box-shadow: 0 0 0 2px rgba(93, 135, 255, 0.2) !important;
  outline: none !important;
}
.amount-group {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}
.amount-input {
  width: calc(50% - 6px) !important;
}
.amount-separator {
  color: #999;
  font-size: 14px;
}
.button-area {
  margin-bottom: 0;
  width: 100%;
}
:deep(.a-button-primary) {
  background-color: #5d87ff !important;
  border-color: #5d87ff !important;
  color: #ffffff !important;
}
:deep(.a-button-primary:hover) {
  background-color: #4a76ee !important;
  border-color: #4a76ee !important;
}
:deep(.a-button .a-icon) {
  color: #ffffff !important;
}
.divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 16px 0;
  width: 100%;
}
.stats-area {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  width: 100%;
  box-sizing: border-box;
  padding: 0;
  margin-top: 8px;
}
.stats-card {
  padding: 16px 24px;
  border-radius: 8px;
  color: #ffffff;
  min-width: 120px;
  flex: 1;
  text-align: center;
  box-sizing: border-box;
}
.stats-card.blue {
  background-color: #409eff;
}
.stats-card.purple {
  background-color: #722ed1;
}
.stats-card.green {
  background-color: #13ce66;
}
.stats-card.orange {
  background-color: #ff9c07;
}
.stats-card.yellow {
  background-color: #ffc82c;
}
.stats-card.red {
  background-color: #ff4d4f;
}
.stats-value {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
}
.stats-label {
  font-size: 14px;
  opacity: 0.9;
}
.table-area {
  background-color: #ffffff;
  width: 100%;
  overflow: auto;
}
.state-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #333;
}
.state-tag.created {
  background-color: #f5f5f5;
}
.state-tag.paid {
  background-color: #d9f7be;
}
.state-tag.paying {
  background-color: #e6f3ff;
}
.state-tag.pending {
  background-color: #fffbe6;
}
:deep(.a-table-fixed-right .a-table-cell) {
  border-left: 1px solid #e5e7eb;
}
/* 分页组件样式优化 */
:deep(.pagination-wrapper .arco-pagination) {
  display: inline-flex;
}

/* 新增：数字列变灰样式（可自定义灰度值 #666/#777/#888） */
:deep(.custom-number-class) {
  color: #777 !important; /* 浅灰色，可根据需求调整（#666深灰，#888更浅） */
  /* 可选：添加字体透明度，让颜色更浅 */
  /* opacity: 0.8; */
}

</style>
