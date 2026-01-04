<template>
  <div class="usdt-settlement-page">
    <!-- 顶部标题栏 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-group">
          <h1 class="main-title">{{tr('Usdt结算')}}</h1>
          <div class="breadcrumbs">{{tr('财务')}} · {{tr('Usdt结算')}}</div>
        </div>
        <div class="decor-icon">
          <div class="icon-wrapper">
            <span class="badge">?</span>
            <span class="star"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-row">
        <div class="search-item">
          <label class="search-label">{{tr('交易流水hash')}}</label>
          <a-input
              v-model="searchForm.hash"
              :placeholder="tr('交易流水hash')"
              class="search-input"
          />
        </div>
        <div class="search-item">
          <label class="search-label">{{tr('收款地址')}}</label>
          <a-input
              v-model="searchForm.address"
              :placeholder="tr('收款地址')"
              class="search-input"
          />
        </div>
        <div class="search-item">
          <label class="search-label">{{tr('支付状态')}}</label>
          <a-select
              v-model="searchForm.status"
              :placeholder="tr('支付状态')"
              class="search-input">
            <a-option value="">{{tr('全部')}}</a-option>
            <a-option value="CREATED">CREATED</a-option>
            <a-option value="PENDING">PENDING</a-option>
            <a-option value="SUCCESS">SUCCESS</a-option>
          </a-select>
        </div>
      </div>

      <div class="search-row">
        <div class="search-item">
          <label class="search-label">{{tr('平台订单号')}}</label>
          <a-input
              v-model="searchForm.orderNo"
              :placeholder="tr('平台订单号')"
              class="search-input"
          />
        </div>
        <div class="search-item">
          <label class="search-label">{{tr('支付方式')}}</label>
          <a-select
              v-model="searchForm.payType"
              :placeholder="tr('支付方式')"
              class="search-input"
          />
        </div>
        <div class="search-item">
          <label class="search-label">{{tr('创建时间')}}</label>
          <a-range-picker
              v-model="searchForm.createTime"
              type="datetime"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              class="search-input"
          />
        </div>
      </div>

      <div class="space-y-8">
        <div class="button-group">
          <a-button type="primary" icon="search" @click="handleSearch">{{tr('搜索')}}</a-button>
          <a-button type="primary" icon="download" @click="handleExport" :loading="exportLoading">{{tr('导出')}}</a-button>
          <a-button type="primary" icon="refresh" @click="handleReset">{{tr('重置')}}</a-button>
          <a-button type="primary" icon="plus" @click="openCreateModal">{{tr('申请')}}</a-button>
        </div>
      </div>
    </div>

    <!-- 表格区域 -->
    <div class="table-container">
      <a-table
          :columns="columns"
          :data="tableData"
          bordered
          :loading="tableLoading"
          class="usdt-table"
          :pagination="false"
      >
        <template #state="{ record }">
          <span :class="getStateClass(record.paymentStatus)">{{ record.paymentStatus }}</span>
        </template>
      </a-table>

      <!-- 固定分页样式（共X项 + 页码数字） -->
      <div class="fixed-pagination">
        <a-pagination
            v-model:current="paginationConfig.current"
            :total="paginationConfig.total"
            :page-size="paginationConfig.pageSize"
            :show-total="true"
            :show-size-changer="true"
            :show-quick-jumper="true"
            @change="handlePaginationChange"
            class="number-pagination"
        />
      </div>
    </div>

    <!-- 新建弹窗 -->
    <a-modal
        v-model:visible="createModalVisible"
        title="Usdt Settlement"
        :footer="null"
        @cancel="createModalVisible = false"
    >
      <div class="modal-form">
        <div class="form-item">
          <label class="form-label">{{tr('可用余额')}}</label>
          <div class="balance-group">
            <a-input v-model="createForm.balance" disabled />
            <span class="currency">INR</span>
          </div>
        </div>

        <div class="form-item">
          <label class="form-label">{{tr('收款地址')}}</label>
          <div class="address-group">
            <a-select
                v-model="createForm.addressType"
                :options="addressTypeOptions"
                style="width: 100px; margin-right: 8px;"
            />
            <a-input v-model="createForm.address" :placeholder="tr('请输入收款地址')" />
          </div>
        </div>

        <div class="form-item">
          <label class="form-label">{{tr('结算金额')}}({{tr('最小')}}:100000 INR)</label>
          <div class="rate-group">
            <a-input v-model="createForm.amount" :placeholder="tr('请输入结算金额')" @input="calcUsdt" />
            <span class="rate-text">{{tr('汇率')}}: 1 USDT = {{ exchangeRate }} INR</span>
            <span class="usdt-convert">{{ `INR = ${createForm.usdtAmount} USDT` }}</span>
          </div>
        </div>

        <div class="form-item">
          <label class="form-label">{{tr('备注')}}</label>
          <a-input v-model="createForm.remark" :placeholder="tr('请输入备注')" />
        </div>
        <div class="form-item">
          <label class="form-label">Trx Password</label>
          <a-input v-model="createForm.password" placeholder="password" type="password"/>
        </div>

        <div class="form-item">
          <div class="fee-info">
            <p>{{tr('费用')}}: {{ createForm.fee }} USDT</p>
            <p>{{tr('总扣款')}}: {{ createForm.totalDeduct }} INR</p>
            <p>{{tr('收到数量')}}: {{ createForm.usdtAmount }} USDT</p>
          </div>
        </div>

        <div class="modal-footer">
          <a-button type="primary" block @click="handleSubmit">{{tr('提交')}}</a-button>
          <a-button type="default" block @click="createModalVisible = false">{{tr('取消')}}</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import {
  Input, Select, RangePicker, Button, Table, Pagination, Modal, Message
} from '@arco-design/web-vue'
import { request } from "@/utils/request";
import {tr} from "@/utils/common";
import dayjs from 'dayjs';

// 搜索表单（默认最近三天）
const getDefaultDate = () => {
  const threeDaysAgo = dayjs().subtract(3, 'day').format('YYYY-MM-DD 00:00:00');
  const today = dayjs().format('YYYY-MM-DD 23:59:59');
  return [threeDaysAgo, today];
};
const searchForm = reactive({
  hash: '',
  address: '',
  status: '',
  orderNo: '',
  payType: '',
  createTime: getDefaultDate()
})

// 表格数据
const tableLoading = ref(false)
const tableData = reactive([])

// 分页配置（固定样式）
const paginationConfig = reactive({
  current: 1,
  pageSize: 15, // 匹配“共621项→42页”的分页逻辑
  total: 0
})
const exchangeRate = ref(0);

const getExchangeRate = async () => {
  try {
    // 替换为你的实际汇率API地址
    const res = await request({
      url: '/dashboard/base/info', // 示例汇率API地址
      method: 'get'
    });

    if (res.code === '200') {
      // 假设接口返回的汇率字段为rate，可根据实际接口调整
      exchangeRate.value = res.data.accountBaseInfoVo.usdtRate || 98.5; // 若接口返回失败，使用备用值98.5
      createForm.balance = res.data.accountBaseInfoVo.available || 0;
      createForm.rate = res.data.accountBaseInfoVo.usdtRate;
    } else {
      Message.warning('FAILED LOADING RATE');
      exchangeRate.value = 98.5; // 备用值
    }
  } catch (err) {
    console.error('FAILED:', err);
    Message.error('FAILED LOADING RATE');
    exchangeRate.value = 98.5; // 备用值
  }
}

// 表格列配置
const columns = reactive([
  { title: tr('币种'), dataIndex: 'currency' },
  { title: tr('平台订单号'), dataIndex: 'platNo' },
  { title: tr('支付方式'), dataIndex: 'paymentMethod' },
  { title: tr('收款地址'), dataIndex: 'receiveAddress' },
  { title: tr('结算金额'), dataIndex: 'appliedAmount', className: 'custom-number' },
  { title: tr('汇率'), dataIndex: 'rate', className: 'custom-number' },
  { title: tr('费用'), dataIndex: 'fee', className: 'custom-number' },
  //{ title: tr('Usdt金额'), dataIndex: 'arriveAmount', className: 'custom-number' },
  { title: tr('备注'), dataIndex: 'remark' },
  { title: tr('交易流水hash'), dataIndex: 'hash' },
  { title: tr('创建时间'), dataIndex: 'createdTime' },
  { title: tr('更新时间'), dataIndex: 'updatedTime' },
  { title: tr('状态'), dataIndex: 'paymentStatus',slotName: 'state' },
  //{ title: '操作', dataIndex: 'action' }
])

// 新建弹窗
const createModalVisible = ref(false)
const addressTypeOptions = [
  { label: 'TRC-20', value: 'trc20' }
]
const createForm = reactive({
  balance: 0,
  addressType: 'trc20',
  address: '',
  amount: '',
  usdtAmount: '0',
  remark: '',
  googleCode: '',
  fee: '0',
  rate: '0',
  totalDeduct: '0'
})

// 导出加载状态
const exportLoading = ref(false)

// 计算USDT金额
const calcUsdt = () => {
  const amount = Number(createForm.amount) || 0;
  const usdt = (amount / 98.5).toFixed(2);
  createForm.usdtAmount = usdt;
  createForm.totalDeduct = amount.toString();
}

// 获取USDT结算列表
const getUsdtData = async () => {
  tableLoading.value = true;
  try {
    const params = {
      page: paginationConfig.current,
      pageSize: paginationConfig.pageSize,
      ...searchForm
    };
    const [startTime, endTime] = params.createTime || [];
    if (startTime) params.startTime = startTime;
    if (endTime) params.endTime = endTime;
    delete params.createTime;

    // 2. 过滤无效参数：只移除 空字符串、空数组、null/undefined，有效参数保留
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value === '' ||
          (Array.isArray(value) && value.length === 0) ||
          value === null ||
          value === undefined) {
        delete params[key];
      }
    });

    const res = await request({
      url: '/merchant/settlement/usdt/list',
      method: 'get',
      params
    });

    if (res.code === '200') {
      const { item, paginator } = res.data;
      tableData.length = 0;
      tableData.push(...res.data.item);
      // 更新分页配置
      paginationConfig.current = paginator.page;
      paginationConfig.pageSize = paginator.limit;
      paginationConfig.total = paginator.totalCount;
    } else {
      Message.error(res.message);
    }
  } catch (err) {
    console.error('failed:', err);
    Message.error('failed, pls try again');
  } finally {
    tableLoading.value = false;
  }
}

// 搜索
const handleSearch = () => {
  paginationConfig.current = 1;
  getUsdtData();
}

// 重置
const handleReset = () => {
  Object.keys(searchForm).forEach(key => searchForm[key] = '');
  searchForm.createTime = getDefaultDate();
  paginationConfig.current = 1;
  paginationConfig.pageSize = 15;
  getUsdtData();
}

// 分页切换
const handlePaginationChange = () => {
  getUsdtData();
}

// 导出
const handleExport = async () => {
  exportLoading.value = true;
  try {
    const params = { ...searchForm };
    const [startTime, endTime] = params.createTime || [];
    if (startTime) params.startTime = startTime;
    if (endTime) params.endTime = endTime;
    delete params.createTime;

    const res = await request({
      url: 'https://api.com/getusdtData/export',
      method: 'get',
      params,
      responseType: 'blob',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const blob = new Blob([res.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Usdt.xlsx';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    Message.success('Export Success');
  } catch (err) {
    console.error('Error:', err);
    Message.error('Failed,Pls try again');
  } finally {
    exportLoading.value = false;
  }
}

// 打开新建弹窗
const openCreateModal = () => {
  createModalVisible.value = true;
  createForm.address = '';
  createForm.amount = '';
  createForm.usdtAmount = '0';
  createForm.totalDeduct = '0';
  getExchangeRate();
}

// 提交新建
const handleSubmit = async () => {
  if (!createForm.address || !createForm.amount) {
    Message.warning('pls input address and amount');
    return;
  }
  if (Number(createForm.amount) < 100000) {
    Message.warning('Settle amount cant less than 100000 INR');
    return;
  }

  try {
    const res = await request({
      url: '/merchant/settlement/usdt/apply',
      method: 'post',
      data: {
        receiveNetwork: createForm.addressType,
        receiveAddress: createForm.address,
        appliedAmount: createForm.amount,
        usdtAmount: createForm.usdtAmount,
        remark: createForm.remark,
        rate: createForm.rate,
        password: createForm.password
      }
    });
    if (res.code === '200') {
      Message.success('Submit Success');
      createModalVisible.value = false;
      getUsdtData();
    } else {
      Message.error(res.message);
    }
  } catch (err) {
    console.error('failed:', err);
    Message.error('failed, pls try again');
  }
}

const getStateClass = (state) => {
  switch (state) {
    case 'SUCCESS':
      return 'state-tag paid';
    default:
      return 'state-tag paying';
  }
}

// 页面挂载时，先获取汇率，再获取列表数据
onMounted(async () => {
  await getExchangeRate(); // 优先获取汇率
  getUsdtData();
})
</script>

<style scoped>
/* 页面基础样式 */
.usdt-settlement-page {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* 顶部标题栏 */
.page-header {
  background-color: #eef2ff;
  border-radius: 8px;
  padding: 16px 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.main-title {
  font-size: 20px;
  font-weight: 600;
  color: #1d2129;
  margin: 0;
}

.breadcrumbs {
  font-size: 14px;
  color: #86909c;
}

/* 右上角装饰 */
.decor-icon .icon-wrapper {
  width: 48px;
  height: 48px;
  background-color: #722ed1;
  border-radius: 12px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper .badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 18px;
  height: 18px;
  background-color: #ff6b6b;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper .star {
  width: 24px;
  height: 24px;
  background-color: white;
  clip-path: polygon(
      50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%
  );
}

/* 搜索区域 */
.search-container {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-row {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.search-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 220px;
  flex: 1;
}

.search-label {
  font-size: 14px;
  color: #4e5969;
  font-weight: 500;
}

.search-input {
  width: 100% !important;
  height: 40px !important;
}

.button-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* 表格区域 */
.table-container {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.usdt-table {
  --arco-table-header-text-color: #4e5969;
  --arco-table-row-hover-bg-color: #f8f9fa;
  margin-bottom: 16px;
}

/* 固定分页样式（共X项 + 页码数字） */
.fixed-pagination {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #4e5969;
  padding-top: 8px;
  /* 关键样式：让分页靠右对齐 */
  justify-content: flex-end;
  width: 100%;
}

.total-text {
  font-weight: 500;
}

:deep(.number-pagination) {
  --arco-pagination-item-height: 30px;
  --arco-pagination-item-width: 30px;
  --arco-pagination-item-font-size: 14px;
  --arco-pagination-item-border-radius: 4px;
  --arco-pagination-item-active-bg-color: #5d87ff;
  --arco-pagination-item-active-color: #ffffff;
  --arco-pagination-item-hover-bg-color: #f5f7fa;
  --arco-pagination-text-color: #4e5969;
  --arco-pagination-item-border: none;
}

:deep(.number-pagination .arco-pagination-item) {
  margin: 0 2px;
}

/* 数字样式 */
:deep(.custom-number) {
  color: #777 !important;
}

/* 新建弹窗 */
.modal-form {
  padding: 8px 0;
}

.form-item {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #4e5969;
  font-weight: 500;
}

.balance-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.currency {
  font-size: 14px;
  color: #4e5969;
}

.address-group {
  display: flex;
  align-items: center;
}

.rate-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rate-text {
  font-size: 12px;
  color: #86909c;
}

.usdt-convert {
  font-size: 12px;
  color: #4e5969;
}

.fee-info {
  font-size: 14px;
  color: #4e5969;
  line-height: 24px;
}

.modal-footer {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
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

</style>
