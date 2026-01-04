<template>
  <div class="page-container">
    <!-- 第一层：搜索框区域（绑定搜索条件，字段名与API参数名一致） -->
    <div class="search-area" style="margin-bottom: 25px; margin-top: 10px;">
      <div class="search-row">
        <div class="search-item">
          <label class="search-label">{{tr('创建时间')}}</label>
          <a-range-picker style="height:38px; width: 550px;"
              v-model="searchForm.createTimeRange"
              class="search-input"
              show-date
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
          />
        </div>
        <div class="search-item">
          <a-button type="primary" icon="search" style="background-color: #5d87ff" @click="handleSearch()">{{tr('搜索')}}</a-button>
          <a-button type="primary" icon="refresh" style="margin-left: 20px; background-color: #5d87ff" @click="handleReset()">{{tr('重置')}}</a-button>
        </div>
      </div>
    </div>

    <!-- 新增：分隔线（区分按钮和统计卡片） -->
    <div class="divider"></div>
    <!-- 第三层：统计卡片区域 -->

    <!-- 第四层：数据表格区域（改用Table自带loading，不破坏原有样式） -->
    <div class="table-area"> <!-- 控制容器渲染 -->
      <a-table
          :columns="columns"
          :data="tableData"
          bordered
          :pagination="false"
          :scroll="{ x: 'max-content' }"
          :loading="tableLoading"
          loading-text="Loading..."  >
      </a-table>

    </div>
  </div>
</template>


<script setup>
import { reactive, ref, onMounted, nextTick } from 'vue' // 导入nextTick
import { request } from "@/utils/request";
import {tr} from "@/utils/common";
import dayjs from "dayjs";

const getDefaultDate = () => {
  const threeDaysAgo = dayjs().subtract(4, 'day').format('YYYY-MM-DD');
  const today = dayjs().add(0, 'day').format('YYYY-MM-DD');
  return [threeDaysAgo, today];
};

const searchForm = reactive({
  createTimeRange: getDefaultDate()
})
// 表格列配置
const columns = reactive([
  { title: tr('日期'), dataIndex: 'txnDate' },
  { title: tr('交易笔数'), dataIndex: 'txnCount'},
  { title: tr('代付金额'), dataIndex: 'payoutAmount' },
  { title: tr('代收金额'), dataIndex: 'payinAmount' },
  { title: tr('代付成功笔数'), dataIndex: 'payoutSuccCount' },
  { title: tr('代收成功笔数'), dataIndex: 'payinSuccCount' },
  { title: tr('手续费'), dataIndex: 'fee' },
])

// 表格加载状态（简化为普通布尔值，更易控制）
const tableLoading = ref(false) // false：隐藏；true：显示
// 获取支付列表API（接收分页参数和搜索条件）
const getDailyList = async (searchParams = {}) => {
  try {
    await nextTick(); // 等待DOM更新

    tableLoading.value = true;
    // 构造请求参数（分页参数 + 搜索条件）
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
      url: '/trade/statistics/daily', // API地址
      method: 'get',
      params: requestParams
    })
    // 解析接口返回数据
    if (res.code === '200') {
      // 更新表格数据
      tableData.length = 0;
      tableData.push(...res.data);
    } else {
      console.error('failed：', res.message);
    }
  } catch (error) {
    console.error('failed：', error);
  } finally {
    tableLoading.value = false;
  }
}

const callbackLoadingMap = reactive({})

// 搜索按钮点击事件
const handleSearch = () => {
  getDailyList(searchForm);
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
  getDailyList(searchForm);
}

// 模拟表格数据
const tableData = reactive([])

onMounted(() => {
  getDailyList(searchForm);
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
  margin: 26px 0;
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
