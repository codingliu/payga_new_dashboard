<template>
  <div class="finance-page">
    <!-- 顶部广告标题栏 -->
    <div class="finance-header">
      <div class="header-content">
        <div class="title-group">
          <h1 class="main-title">{{tr('账务变动')}}</h1>
          <div class="breadcrumbs">{{tr('财务 ')}}· {{tr('账务变动')}}</div>
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
          <label class="search-label">{{tr('平台订单号')}}</label>
          <a-input
              v-model="searchForm.platNo"
              placeholder="请输入平台订单号"
              class="search-input"
          />
        </div>
        <div class="search-item">
          <label class="search-label">{{tr('类型')}}</label>
          <a-select
              v-model="searchForm.type"
              placeholder="请选择类型"
              class="search-input">
          <a-option value="">{{tr('全部')}}</a-option>
          <a-option value="PAYIN">PAYIN</a-option>
          <a-option value="PAYOUT">PAYOUT</a-option>
          </a-select>
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

      <div class="button-group">
        <a-button type="primary" icon="search" @click="handleSearch" style="background-color: #5d87ff">{{tr('搜索')}}</a-button>
        <a-button type="primary" style="background-color: #5d87ff"
            icon="download"
            @click="handleExport"
            :loading="exportLoading"
        >
          导出
        </a-button>
        <a-button type="primary" icon="refresh" @click="handleReset" style="background-color: #5d87ff">{{tr('重置')}}</a-button>
      </div>
    </div>

    <!-- 表格区域（强制启用完整分页） -->
    <div class="table-container">
      <a-table
          :columns="columns"
          :data="tableData"
          bordered
          :loading="tableLoading"
          class="finance-table"
          :pagination="false"
      />
      <!-- 强制启用完整分页功能 -->
      <div class="pagination-wrapper">
        <a-pagination
            v-model:current="paginationConfig.current"
            v-model:page-size="paginationConfig.pageSize"
            :total="paginationConfig.total"
            :show-total="true"
            :show-size-changer="true"
            :show-quick-jumper="true"
            @change="handlePaginationChange"
            style="--arco-pagination-show-total: true; --arco-pagination-show-size-changer: true;"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, nextTick } from 'vue'
import {
  Input, Select, RangePicker, Button, Table, Pagination, Message
} from '@arco-design/web-vue'
import { request } from "@/utils/request";
import qs from 'qs';
import {tr} from "@/utils/common";
// 搜索表单
const searchForm = reactive({
  platNo: '',
  type: '',
  createTime: []
})

// 表格加载状态
const tableLoading = ref(false)

// 表格数据
const tableData = reactive([])

// 导出加载状态
const exportLoading = ref(false)

// 分页配置（强制设置功能属性）
const paginationConfig = reactive({
  current: 1,
  pageSize: 50,
  total: 0,
  // 显式声明功能属性
  showTotal: true,
  showSizeChanger: true,
  showQuickJumper: true
})

// 表格列配置
const columns = reactive([
  { title: tr('类型'), dataIndex: 'transType', width: 120 },
  { title: tr('余额变动类型'), dataIndex: 'balChangeType', width: 150 },
  { title: tr('流水号'), dataIndex: 'relatedPaymentId', width: 200 },
  { title: tr('金额'), dataIndex: 'tradeAmount', width: 120, className: 'custom-number-class' },
  { title: tr('费用'), dataIndex: 'feeAmount', width: 120, className: 'custom-number-class' },
  { title: tr('发生前总金额'), dataIndex: 'openingTotalAmount', width: 150, className: 'custom-number-class' },
  { title: tr('发生后总金额'), dataIndex: 'endTotalAmount', width: 150, className: 'custom-number-class' },
  { title: tr('交易备注'), dataIndex: 'remark', width: 200 },
  { title: tr('创建时间'), dataIndex: 'createdAt', width: 200 }
])

// 获取账务变动列表
const getBalList = async () => {
  tableLoading.value = true;
  try {
    const requestParams = {
      page: paginationConfig.current,
      pageSize: paginationConfig.pageSize,
      ...searchForm
    };

    const [createStartTime, createEndTime] = requestParams.createTime || [];
    if (createStartTime) requestParams.createdStartTime = createStartTime;
    if (createEndTime) requestParams.createdEndTime = createEndTime;
    delete requestParams.createTime;

    Object.keys(requestParams).forEach(key => {
      const value = requestParams[key];
      if (value === '' || value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
        delete requestParams[key];
      }
    });

    const res = await request({
      url: '/merchant/finance/balList',
      method: 'get',
      params: requestParams
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
      Message.error(res.message );
      paginationConfig.total = 0;
    }
  } catch (error) {
    console.error('failed loading：', error);
    Message.error('failed, pls try again');
    paginationConfig.total = 0;
  } finally {
    await nextTick();
    tableLoading.value = false;
  }
}

// 搜索
const handleSearch = () => {
  paginationConfig.current = 1;
  getBalList();
}

// 重置
const handleReset = () => {
  searchForm.platNo = '';
  searchForm.type = '';
  searchForm.createTime = [];
  paginationConfig.current = 1;
  paginationConfig.pageSize = 50;
  getBalList();
}

// 分页切换
const handlePaginationChange = () => {
  getBalList();
}

// 导出
const handleExport = () => {
  exportLoading.value = true;
  try {
    const exportParams = { ...searchForm };
    const [createStartTime, createEndTime] = exportParams.createTime || [];
    if (createStartTime) exportParams.createdStartTime = createStartTime;
    if (createEndTime) exportParams.createdEndTime = createEndTime;
    delete exportParams.createTime;

    const validParams = {};
    Object.keys(exportParams).forEach(key => {
      const value = exportParams[key];
      if (value !== '' && value !== null && value !== undefined && !Array.isArray(value) && value.length !== 0) {
        validParams[key] = value;
      }
    });

    const exportUrl = 'http://localhost:2888/api/finance/balList/export';
    const paramsStr = qs.stringify(validParams);
    const fullUrl = paramsStr ? `${exportUrl}?${paramsStr}` : exportUrl;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', fullUrl, true);
    const token = localStorage.getItem('token');
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.responseType = 'blob';

    xhr.onload = function () {
      if (xhr.status === 200) {
        const blob = new Blob([xhr.response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
        });
        let fileName = 'BalanceDetail.xlsx';
        const contentDisposition = xhr.getResponseHeader('content-disposition');
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename=(?:\"?)(.+?)(?:\"?;|$)/);
          if (fileNameMatch && fileNameMatch[1]) fileName = decodeURIComponent(fileNameMatch[1]);
        }
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          URL.revokeObjectURL(downloadUrl);
          document.body.removeChild(a);
        }, 100);
        Message.success('Export Success');
      } else {
        Message.error(`failed，code：${xhr.status}`);
      }
      exportLoading.value = false;
    };

    xhr.onerror = function () {
      console.error('failed');
      Message.error('failed, pls try again');
      exportLoading.value = false;
    };

    xhr.send();
  } catch (error) {
    exportLoading.value = false;
    console.error('failed：', error);
    Message.error('failed, pls try again');
  }
}

// 页面挂载
onMounted(() => {
  getBalList();
})
</script>

<style scoped>
/* 页面整体样式 */
.finance-page {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* 顶部广告标题栏 */
.finance-header {
  background-color: #eef2ff;
  border-radius: 8px;
  padding: 16px 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
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

/* 右上角装饰图标 */
.decor-icon {
  position: relative;
}

.icon-wrapper {
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
  background-color: #ffffff;
  width: 100%;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 20px;
  box-sizing: border-box;
}

.search-row {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.search-item {
  display: flex;
  align-items: center;
  width: calc((100% - 40px) / 3);
  min-width: 250px;
}

.search-label {
  width: 90px;
  text-align: right;
  margin-right: 12px;
  font-size: 14px;
  color: #4e5969;
  font-weight: 500;
}

.search-input {
  flex: 1;
  height: 40px !important;
  font-size: 14px !important;
  padding: 0 16px !important;
  border: 1px solid #dcdfe6 !important;
  border-radius: 4px !important;
  box-sizing: border-box !important;
}

.search-input:focus,
:deep(.search-input:focus-within) {
  border-color: #5d87ff !important;
  box-shadow: 0 0 0 2px rgba(93, 135, 255, 0.2) !important;
  outline: none !important;
}

/* 按钮组样式 */
.button-group {
  display: flex;
  gap: 12px;
  margin-left: 102px;
  margin-top: 8px;
}

/* 表格区域 */
.table-container {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.finance-table {
  --arco-table-header-text-color: #4e5969;
  --arco-table-row-hover-bg-color: #f8f9fa;
  margin-bottom: 16px;
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

/* 强制修复分页样式 */
:deep(.arco-pagination) {
  --arco-pagination-show-total: true !important;
  --arco-pagination-show-size-changer: true !important;
  --arco-pagination-show-quick-jumper: true !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
}

:deep(.arco-pagination .arco-pagination-total,
.arco-pagination .arco-pagination-size-changer,
.arco-pagination .arco-pagination-quick-jumper) {
  display: flex !important;
  visibility: visible !important;
}

.pagination-wrapper {
  text-align: right;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

/* 数字样式 */
:deep(.custom-number-class) {
  color: #777 !important;
}
</style>
