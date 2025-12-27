<template>
  <div class="dashboard-container">
    <!-- 余额模块（包含悬浮按钮） -->
    <div class="balance-wrapper">
      <!-- 悬浮按钮组 -->
      <div class="top-buttons">
        <div class="top-btn" @click="go2Path('/financial/billList')">{{tr('资金变动')}}</div>
        <div class="top-btn" @click="go2Path('/financial/drawalu')">{{tr('USDT结算')}}</div>
        <div class="top-btn" @click="go2Path('/orders/all')">{{tr('代收')}}</div>
        <div class="top-btn" @click="go2Path('/payout/drawalu')">{{tr('代付')}}</div>
      </div>

      <!-- 余额模块（高度150px） -->
      <div class="balance-area">
        <div class="total-balance">
          <span class="label">{{tr('总余额')}}:</span>
          <span class="value">₹{{ baseInfo?.accountBaseInfoVo.totalBalance || '0.00' }}</span>
        </div>
        <div class="balance-items">
          <div class="balance-item">
            <div class="item-name">{{tr('可用资金')}}</div>
            <div class="item-value">{{ baseInfo?.accountBaseInfoVo.available || '0.00' }} <i class="info-icon">ⓘ</i></div>
          </div>
          <div class="balance-item">
            <div class="item-name">{{tr('代收争议资金')}}</div>
            <div class="item-value">{{ baseInfo?.accountBaseInfoVo.frozenPayinDisputed || '0.00' }} <i class="info-icon">ⓘ</i></div>
          </div>
          <div class="balance-item">
            <div class="item-name">{{tr('代收待结算')}}</div>
            <div class="item-value">{{ baseInfo?.accountBaseInfoVo.frozenPayin || '0.00' }} <i class="info-icon">ⓘ</i></div>
          </div>
          <div class="balance-item">
            <div class="item-name">{{tr('代付处理中')}}</div>
            <div class="item-value">{{ baseInfo?.accountBaseInfoVo.frozenPayout || '0.00' }} <i class="info-icon">ⓘ</i></div>
          </div>
          <div class="balance-item">
            <div class="item-name">{{tr('冻结资金')}}</div>
            <div class="item-value">{{ baseInfo?.accountBaseInfoVo.holdBal || '0.00' }} <i class="info-icon">ⓘ</i></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 订单统计卡片（第二层，高度150px） -->
    <div class="order-cards">
      <div class="order-card">
        <div class="card-title">{{tr('代收订单')}}</div>
        <div class="card-amount">₹{{ baseInfo?.payinBaseInfoVo.payinSuccessAmount || '0.00' }} <span class="rate">{{ baseInfo?.payinBaseInfoVo.payinSuccessRate || '0.00' }}%</span></div>
        <div class="card-stats">
          <div class="stat-item">{{ baseInfo?.payinBaseInfoVo.payinFee || '0' }} <span>{{tr('代收费用')}}</span></div>
          <div class="stat-item">{{ baseInfo?.payinBaseInfoVo.successCount || '0' }} <span>{{tr('成功单数')}}</span></div>
          <div class="stat-item">{{ baseInfo?.payinBaseInfoVo.failedCount || '0' }} <span>{{tr('失败单数')}}</span></div>
        </div>
      </div>
      <div class="order-card">
        <div class="card-title">{{tr('代付订单')}}</div>
        <div class="card-amount">₹{{ baseInfo?.payoutBaseInfoVo.payoutSuccessAmount || '0.00' }} <span class="rate">{{ baseInfo?.payoutBaseInfoVo.payoutSuccessRate || '0.00' }}%</span></div>
        <div class="card-stats">
          <div class="stat-item">{{ baseInfo?.payoutBaseInfoVo.payoutFee || '0' }} <span>{{tr('代付费用')}}</span></div>
          <div class="stat-item">{{ baseInfo?.payoutBaseInfoVo.successCount || '0' }} <span>{{tr('成功单数')}}</span></div>
          <div class="stat-item">{{ baseInfo?.payoutBaseInfoVo.failedCount || '0' }} <span>{{tr('失败单数')}}</span></div>
        </div>
      </div>
      <div class="order-card">
        <div class="card-title">{{tr('代付处理中')}}</div>
        <div class="card-amount">₹{{ baseInfo?.payoutPendingBaseInfoVo.payoutPendingAmount || '0.00' }}</div>
        <div class="card-stats">
          <div class="stat-item">{{ baseInfo?.payoutPendingBaseInfoVo.payoutPendingCount || '0' }} <span>{{tr('处理中单数')}}</span></div>
          <div class="stat-item">{{ baseInfo?.payoutPendingBaseInfoVo.payoutPendingFee || '0' }} <span>{{tr('处理中费用')}}</span></div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="chart-area">
      <div class="chart-card">
        <div class="chart-title">{{tr('支付成功率')}}</div>
        <div class="chart-container" id="payRateChart"></div>
      </div>
      <div class="chart-card">
        <div class="chart-title">{{tr('成功支付量')}}</div>
        <div class="chart-container" id="payAmountChart"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import {request} from '@/utils/request'
import router from '@/router'
import {tr} from "@/utils/common";
function go2Path(path) {
  router.push(path)
}

// 数据状态
const baseInfo = ref(null)
const payRateData = ref(null)
const payAmountData = ref(null)

// 加载基础数据
const loadBaseInfo = async () => {
  const res = await request({
    url: '/dashboard/base/info',
    method: 'get'
  });
  if (res.code === '200') baseInfo.value = res.data
}

// 加载图表数据
const loadChartData = async () => {
  // 左边支付成功率图表
  const rateRes = await request({url:'/dashboard/payment/success/rate',method: 'get'})
  if (rateRes.code === '200') payRateData.value = rateRes.data

  // 右边成功支付量图表
  const amountRes = await request({url:'/dashboard/payment/success/volume',method: 'get'})
  if (amountRes.code === '200') payAmountData.value = amountRes.data

  // 渲染图表
  nextTick(() => {
    renderRateChart()
    renderAmountChart()
  })
}

// 渲染支付成功率图表
const renderRateChart = () => {
  if (!payRateData.value) return
  const chart = echarts.init(document.getElementById('payRateChart'))
  chart.setOption({
    grid: { top: 20, right: 20, bottom: 30, left: 20 },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: payRateData.value.seriesData,
      axisLine: { show: true }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: true }
    },
    series: [
      {
        name: tr('代收成功率'),
        type: 'line',
        data: payRateData.value.payin,
        smooth: true,
        lineStyle: { color: '#87c4fa' },
        areaStyle: { color: 'rgba(135, 196, 250, 0.3)' }
      },
      {
        name: tr('代付成功率'),
        type: 'line',
        data: payRateData.value.payout,
        smooth: true,
        lineStyle: { color: '#71eea4' },
        areaStyle: { color: 'rgba(113, 238, 154, 0.3)' }
      }
    ]
  })
  window.addEventListener('resize', () => chart.resize())
}

// 渲染成功支付量图表
const renderAmountChart = () => {
  if (!payAmountData.value) return
  const chart = echarts.init(document.getElementById('payAmountChart'))
  chart.setOption({
    grid: { top: 20, right: 20, bottom: 30, left: 20 },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: payAmountData.value.seriesData,
      axisLine: { show: true }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: true }
    },
    series: [
      {
        name: tr('代收金额'),
        type: 'bar',
        data: payAmountData.value.payin,
        itemStyle: { color: '#87c4fa' }
      },
      {
        name: tr('代付金额'),
        type: 'bar',
        data: payAmountData.value.payout,
        itemStyle: { color: '#71eea4' }
      }
    ]
  })
  window.addEventListener('resize', () => chart.resize())
}

// 初始化
onMounted(async () => {
  await Promise.all([loadBaseInfo(), loadChartData()])
})
</script>

<style scoped>
/* 全局容器 */
.dashboard-container {
  padding: 20px;
  background-color: #f5f7fa;
  font-family: Arial, sans-serif;
}

/* 余额模块+悬浮按钮容器 */
.balance-wrapper {
  position: relative;
  margin-bottom: 20px;
}

/* 悬浮按钮组（位于余额模块上方右侧） */
.top-buttons {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 10;
}
.top-btn {
  display: inline-block;
  padding: 6px 12px;
  margin-left: 8px;
  background-color: #e8f3ff; /* 淡蓝色背景（淡化） */
  color: #165dff; /* 原按钮文字色 */
  border: none;
  border-radius: 4px;
  text-decoration: none;
  font-size: 14px;
  transition: background-color 0.2s;
}
.top-btn:hover {
  background-color: #d5e8ff; /*  hover时稍深 */
}

/* 余额模块（高度150px） */
.balance-area {
  background-color: #fff;
  padding: 40px 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  height: 180px; /* 固定高度150px */
  box-sizing: border-box;
}
.total-balance {
  margin-bottom: 20px;
}
.total-balance .label {
  color: #666;
  margin-right: 8px;
  font-size: 1.125rem; /* 总余额字体大小 */
  font-weight: 600; /* 加粗样式 */
}
.total-balance .value {
  color: #333;
  font-size: 1.125rem; /* 总余额金额字体大小 */
  font-weight: 600; /* 加粗样式 */
}
.balance-items {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.balance-item {
  min-width: 120px;
}
.balance-item .item-name {
  font-size: 12px;
  color: #888;
  margin-bottom: 4px;
}
.balance-item .item-value {
  color: #333;
  font-size: 1.125rem; /* 余额项金额字体大小 */
  font-weight: 600; /* 加粗样式 */
}
.info-icon {
  font-size: 12px;
  color: #888;
  margin-left: 4px;
}

/* 订单统计卡片（第二层，高度150px） */
.order-cards {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.order-card {
  flex: 1;
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  height: 150px; /* 固定高度150px */
  box-sizing: border-box; /* 确保内边距不影响高度 */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 内容上下分布，适配高度 */
}
.order-card .card-title {
  color: #666;
  margin-bottom: 8px;
  font-size: 1.225rem; /* 代收/代付订单等字体大小 */
  font-weight: 600; /* 加粗样式 */
}
.order-card .card-amount {
  color: #333;
  font-size: 1.425rem; /* 订单总金额字体大小 */
  font-weight: 600; /* 加粗样式 */
}
.order-card .rate {
  font-size: 12px;
  color: #00b42a;
  margin-left: 4px;
  font-weight: normal; /* 利率不加粗，保持原有样式 */
}
.order-card .card-stats {
  display: flex;
  gap: 15px;
  font-size: 1.125rem; /* 统计项金额字体大小 */
  font-weight: 600; /* 加粗样式 */
  color: #888;
}
.stat-item span {
  display: block;
  color: #aaa;
  margin-top: 2px;
  font-size: 12px; /* 统计项文字保持原有大小 */
  font-weight: normal; /* 统计项文字不加粗 */
}

/* 其他样式不变，仅修改图表容器样式 */
.chart-container {
  width: 100%;
  height: 450px; /* 容器高度强制350px */
  min-width: 300px;
  box-sizing: border-box;
}

/* 图表卡片样式不变，仅确保不限制内部高度 */
.chart-card {
  flex: 1;
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.chart-card .chart-title {
  color: #666;
  margin-bottom: 10px;
  font-size: 1.125rem;
  font-weight: 600;
}
.chart-area {
  display: flex;
  gap: 30px;
}
</style>
