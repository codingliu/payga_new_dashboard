<template>
  <div class="page-container">
    <!-- 顶部标题栏（广告位）- 圆角、大图标 -->
    <div class="page-header">
      <div class="header-text">
        <h2 class="page-title">支付方式</h2>
        <p class="page-subtitle">支付信息 · 支付方式</p>
      </div>
      <div class="header-icon">
        <div class="icon-box">
          <span class="star-icon"></span>
          <span class="question-icon">?</span>
        </div>
      </div>
    </div>

    <!-- Tab切换栏 - 宽度200px、高度55px -->
    <div class="tab-nav">
      <div
          class="tab-item"
          :class="{ active: activeTab === 'PAYIN' }"
          @click="handleTabChange('PAYIN')"
      >
        代收
      </div>
      <div
          class="tab-item"
          :class="{ active: activeTab === 'PAYOUT' }"
          @click="handleTabChange('PAYOUT')"
      >
        代付
      </div>
      <div
          class="tab-item"
          :class="{ active: activeTab === 'WITHDRAW' }"
          @click="handleTabChange('WITHDRAW')"
      >
        提现
      </div>
    </div>

    <!-- 表格内容区 -->
    <div class="content-wrap">
      <a-table
          :columns="tableColumns"
          :data="tableData"
          bordered
          :loading="loading"
          :pagination="false"
          size="small"
      >

        <template #feeRate="{ record }">
          <div >{{record.fixedAmount}} INR + {{record.feeRate}} %</div>
        </template>
        <template #state="{ record }">
          <span :class="getStateClass(record.status)">{{ record.status }}</span>
        </template>

      </a-table>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, watch, nextTick} from 'vue'
import {Table, Message} from '@arco-design/web-vue'
import {request} from '@/utils/request'

// 当前激活的tab - 默认代收
const activeTab = ref('PAYIN')
// 表格加载状态
const loading = ref(false)
// 表格数据
const tableData = reactive([])
// 表格列 - 根据tab动态切换（代收多【结算周期】列）
const tableColumns = reactive([])
// 列配置映射表
const columnsMap = {
  PAYIN: [
    {title: '支付方式编码', dataIndex: 'methodName', width: 120},
    {title: '币种', dataIndex: 'currency', width: 80},
    {title: '收费方式', dataIndex: 'feeRate', slotName: 'feeRate', width: 180, align: 'left'},
    {title: '支付单笔最小额度', dataIndex: 'lowAmount', width: 140},
    {title: '支付单笔最大额度', dataIndex: 'topAmount', width: 140},
    {title: '状态', dataIndex: 'status', slotName: 'state', width: 100},
    {title: '结算周期', dataIndex: 'settleMethod', width: 100}
  ],
  PAYOUT: [
    {title: '支付方式编码', dataIndex: 'methodName', width: 120},
    {title: '币种', dataIndex: 'currency', width: 80},
    {title: '收费方式', dataIndex: 'feeRate', slotName: 'feeRate',width: 180},
    {title: '支付单笔最小额度', dataIndex: 'lowAmount', width: 140},
    {title: '支付单笔最大额度', dataIndex: 'topAmount', width: 140},
    {title: '状态', dataIndex: 'status', slotName: 'state',width: 100}
  ],
  WITHDRAW: [
    {title: '支付方式编码', dataIndex: 'methodName', width: 120},
    {title: '币种', dataIndex: 'currency', width: 80},
    {title: '收费方式', dataIndex: 'feeRate', slotName: 'feeRate',width: 180},
    {title: '支付单笔最小额度', dataIndex: 'lowAmount', width: 140},
    {title: '支付单笔最大额度', dataIndex: 'topAmount', width: 140},
    {title: '状态', dataIndex: 'status',slotName: 'state', width: 100}
  ]
}
const getStateClass = (state) => {
  switch (state) {
    case 'ACTIVE':
      return 'state-tag paid';
    default:
      return 'state-tag created';
  }
}
// 请求接口：地址固定/merchant/method/list  参数transType=collect/pay/withdraw
const getMethodList = async (transType) => {
  loading.value = true
  try {
    const res = await request({
      url: '/merchant/method/list',
      method: 'get',
      params: {transType} // 核心参数，和tab一一对应
    })
    // 接口返回成功赋值
    if (res.code === '200' && Array.isArray(res.data)) { // 强制判断数组
      tableData.length = 0
      await nextTick() // 等待DOM更新，避免数据覆盖
      // 直接存入数组，表格自动遍历
      tableData.push(...res.data)
      console.log('表格数据：', tableData) // 确认数据已存入
    } else {
      Message.error(res.message || '获取数据失败（非数组格式）')
    }
  } catch (err) {
    console.error(err)
    Message.error('网络异常，请重试')
  } finally {
    loading.value = false
  }
}
// 切换tab的核心方法
const handleTabChange = (tabKey) => {
  activeTab.value = tabKey
}

// 监听tab切换，自动请求接口 + 切换表格列
watch(activeTab, async (newVal) => {
  // 切换表格列
  tableColumns.length = 0
  tableColumns.push(...columnsMap[newVal])
  // 请求接口数据
  await getMethodList(newVal)
}, {immediate: true})


</script>

<style scoped>
/* 全局容器 - 纯白背景 无边距 */
.page-container {
  width: 100%;
  height: 100%;
  background: #ffffff;
  margin: 0;
  padding: 0;
  /* 给广告位留出圆角不被遮挡的空间（可选，根据布局调整） */
  padding-top: 8px;
}

/* 顶部标题栏（广告位）- 圆角、背景#ecf2ff、高度130px、大图标 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  background: #ecf2ff;
  border-bottom: 1px solid #ebeef5;
  height: 130px;
  border-radius: 6px; /* 广告位圆角（可根据需求调整大小，如8px/16px） */
  margin: 5px 25px; /* 左右留白，凸显圆角效果 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* 可选：添加轻微阴影，增强圆角视觉感 */
}

.page-title {
  font-size: 1.5rem !important;
  color: #1d2129;
  font-weight: 500;
  margin: 0 0 2px 0;
}

.page-subtitle {
  font-size: 12px;
  color: #86909c;
  margin: 0;
}

/* 右上角图标 - 放大尺寸（比原有大50%左右，可按需调整） */
.header-icon .icon-box {
  width: 56px; /* 原有24px → 放大到36px */
  height: 56px; /* 原有24px → 放大到36px */
  background: #722ed1;
  border-radius: 8px; /* 图标盒子也添加圆角，更协调 */
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.star-icon {
  width: 18px; /* 原有12px → 放大到18px */
  height: 18px; /* 原有12px → 放大到18px */
  background: #fff;
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
}

.question-icon {
  position: absolute;
  top: -5px; /* 随图标放大调整位置，保持美观 */
  right: -5px; /* 随图标放大调整位置，保持美观 */
  width: 18px; /* 原有12px → 放大到18px */
  height: 18px; /* 原有12px → 放大到18px */
  background: #fff;
  color: #722ed1;
  border-radius: 50%;
  font-size: 12px; /* 原有8px → 放大到12px */
  text-align: center;
  line-height: 18px; /* 垂直居中文字 */
  border: 1px solid #722ed1;
}

/* Tab栏 - 宽度200px、高度55px */
.tab-nav {
  display: flex;
  padding: 0 16px;
  border-bottom: 1px solid #ebeef5;
  align-items: center;
  margin: 8px; /* 与广告位圆角留白保持一致 */
}

.tab-item {
  font-size: 14px;
  color: #4e5969;
  width: 200px;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  box-sizing: border-box;
}

.tab-item.active {
  color: #5d87ff;
  border-bottom: 2px solid #5d87ff;
  font-weight: 500;
}

/* 内容区 */
.content-wrap {
  padding: 16px;
  margin: 0 8px; /* 与广告位圆角留白保持一致 */
}

/* 状态标签 */
.status-enable {
  display: inline-block;
  padding: 1px 6px;
  background: #f0fff4;
  color: #52c41a;
  font-size: 12px;
  border-radius: 6px;
}

/* 空数据提示 */
.empty-text {
  color: #86909c;
  font-size: 12px;
  text-align: center;
  padding: 20px 0;
}

/* 穿透修改表格样式 */
:deep(.arco-table) {
  --arco-table-header-text-color: #4e5969;
  --arco-table-header-background: #f5f7fa;
  --arco-table-border-color: #ebeef5;
  --arco-table-row-hover-bg-color: #f5f7fa;
  font-size: 12px;
}

:deep(.arco-table-cell) {
  padding: 8px 12px;
  white-space: pre-wrap; /* 收费方式自动换行 */
}

:deep(.arco-table-loading) {
  min-height: 100px;
}

/* 行高75px样式（保留你的需求） */
.content-wrap :deep(.custom-row-height) {
  height: 75px !important;
  line-height: 75px !important;
  min-height: 75px !important;
}
.content-wrap :deep(.custom-row-height td) {
  vertical-align: middle !important;
  padding: 15px 12px !important;
  white-space: normal;
  color: #86909c !important;
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


/* 穿透定位表格数据行，设置高度70px */
.content-wrap :deep(.arco-table-tr) {
  height: 70px !important; /* !important 强制覆盖默认样式，确保生效 */
  min-height: 70px !important; /* 防止内容过少时行高收缩 */
}

.content-wrap {
  padding: 16px;
  margin: 0 8px;
  /* 新增：表格容器圆角，与表格圆角一致 */
  border-radius: 10px; /* 可自定义圆角大小，如8px/16px */
  overflow: hidden;
}
/* 穿透设置表格整体圆角 */
:deep(.arco-table) {
  border-radius: 8px !important; /* 表格圆角大小，与容器一致 */
  overflow: hidden; /* 关键：让表格内部内容跟随圆角显示，不溢出 */
  border: none !important; /* 可选：去掉默认边框，圆角更美观 */
}
</style>
