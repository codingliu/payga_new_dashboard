<template>
  <div class="config-page">
    <!-- 顶部标题模块（圆角+背景色） -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">{{tr('配置')}}</h2>
        <p class="page-subtitle">{{tr('设置')}} · {{tr('配置')}}</p>
      </div>
      <div class="header-right">
        <div class="decor-icon">
          <div class="star"></div>
          <div class="dot dot1"></div>
          <div class="dot dot2"></div>
          <div class="dot dot3"></div>
        </div>
      </div>
    </div>

    <!-- Tab栏（宽度100px，可点击切换） -->
    <div class="tab-nav">
      <div
          class="tab-item"
          :class="{ active: activeTab === 'base' }"
          @click="activeTab = 'base'"
      >
        {{tr('配置')}}
      </div>
      <div
          class="tab-item"
          :class="{ active: activeTab === 'api' }"
          @click="activeTab = 'api'"
      >
        Api IP
      </div>
      <div
          class="tab-item"
          :class="{ active: activeTab === 'google' }"
          @click="activeTab = 'google'"
      >
        2FA
      </div>
      <div
          class="tab-item"
          :class="{ active: activeTab === 'password' }"
          @click="activeTab = 'password'"
      >
        {{tr('密码')}}
      </div>
      <div
          class="tab-item"
          :class="{ active: activeTab === 'device' }"
          @click="activeTab = 'device'"
      >
        {{tr('设备')}}
      </div>
    </div>

    <!-- 内容区域（铺满宽度） -->
    <div class="tab-content">
      <!-- 加载状态提示 -->
      <div class="loading-tip" v-if="isLoading">
        Loading
      </div>

      <!-- 1. 基础配置Tab -->
      <div v-if="activeTab === 'base' && !isLoading">
        <div class="tip-box">
          <span class="tip-icon">⚠</span>
          <div class="tip-text">
            <p>If you want to communicate smoothly with the PayGa team, you need to know your merchant number.</p>
            <p>If you are still in the process of connection, please use the test server.</p>
          </div>
        </div>
        <div class="form-container">
          <div class="form-item">
            <label class="form-label">{{tr('商户编号')}}</label>
            <div class="input-group">
              <input type="text" class="form-input" :value="baseForm.merchantId" readonly>
              <button class="copy-btn" @click="copyText(baseForm.merchantId)">📋</button>
            </div>
          </div>
          <div class="form-item">
            <label class="form-label">{{tr('商户名')}}</label>
            <div class="input-group">
              <input type="text" class="form-input" :value="baseForm.merchantName" readonly>
              <button class="copy-btn" @click="copyText(baseForm.merchantName)">📋</button>
            </div>
          </div>
          <div class="form-item">
            <label class="form-label">{{tr('商户')}}md5key</label>
            <div class="input-group">
              <textarea class="form-textarea" readonly>{{ baseForm.md5key }}</textarea>
              <button class="copy-btn copy-textarea-btn" @click="copyText(baseForm.md5key)">📋</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Api密钥Tab -->
      <div v-if="activeTab === 'api' && !isLoading">
        <div class="section-title">API IP{{tr('白名单')}}</div>
        <div class="tip-box">
          <span class="tip-icon">⚠</span>
          <div class="tip-text">
            <p>White IP list refers to a list of IP addresses that are considered trusted or authorized to access a network, system, or service. It is essentially a collection of IP addresses that have been explicitly allowed or given permission to connect to a particular resource.</p>
          </div>
        </div>
        <div class="form-container">
          <div class="form-item">
            <label class="form-label">{{tr('商户编号')}}</label>
            <div class="input-group">
              <input type="text" class="form-input" :value="apiForm.merchantId" readonly>
            </div>
          </div>
          <div class="form-item">
            <label class="form-label">API IP</label>
            <div class="input-group">
              <input type="text" class="form-input" v-model="apiForm.apiIp" placeholder="{{tr('请输入您的代收款服务器IP地址')}}">
            </div>
            <div class="error-text" v-if="apiFormError.payIp">{{tr('请输入有效的IP地址')}}</div>
          </div>
          <div class="form-item btn-wrap">
            <label class="form-label"></label>
            <button class="save-btn" @click="saveApiForm">{{tr('保存')}}</button>
          </div>
        </div>
      </div>

      <!-- 3. Google验证Tab -->
      <div v-if="activeTab === 'google' && !isLoading">
        <div class="section-title">{{tr('谷歌验证设置')}}</div>
        <div class="form-container">
          <!-- 谷歌验证状态（只读展示，不可切换） -->
          <div class="form-item">
            <label class="form-label">{{tr('谷歌验证状态')}}</label>
            <div class="status-display" style="width: 20%">
              {{ googleForm.status === '1' ? tr('开启') : tr('关闭') }}
            </div>
          </div>

          <!-- 关闭状态（status=0）：显示二维码 + 授权码输入框 + 绑定按钮 -->
          <div v-if="googleForm.status === '0'">
            <!-- 二维码展示（300x300） -->
            <div class="qr-container">
              <label class="form-label">{{tr('谷歌验证二维码')}}</label>
              <img
                  :src="googleForm.qr"
                  alt="{{tr('谷歌验证二维码')}}"
                  class="qr-img"
                  v-if="googleForm.qr"
              >
              <div class="empty-tip" v-else>{{tr('二维码加载失败，请刷新页面')}}</div>
            </div>

            <!-- 授权码输入框 -->
            <div class="form-item">
              <label class="form-label">OTP</label>
              <div class="input-group" style="width: 20%">
                <input maxlength="20"
                       type="text"
                       class="form-input"
                       v-model="googleForm.authCode"
                       :placeholder="tr('请输入谷歌验证APP中的授权码')"
                >
              </div>
              <div class="error-text" v-if="googleFormError.authCode">{{tr('请输入授权码')}}</div>
            </div>

            <!-- 绑定按钮 -->
            <div class="form-item btn-wrap">
              <label class="form-label"></label>
              <button class="bind-btn" @click="submitBind">{{tr('提交绑定')}}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. 密码Tab -->
      <div v-if="activeTab === 'password' && !isLoading">
        <div class="section-title">{{tr('修改登录密码')}}</div>
        <div class="form-container">
          <div class="form-item">
            <label class="form-label">{{tr('当前密码')}}</label>
            <div class="input-group">
              <input type="password" class="form-input" v-model="pwdForm.oldPassword" :placeholder="tr('请输入当前密码')">
            </div>
            <div class="error-text" v-if="pwdFormError.oldPassword">{{tr('请输入当前密码')}}</div>
          </div>
          <div class="form-item">
            <label class="form-label">{{tr('新密码')}}</label>
            <div class="input-group">
              <input type="password" class="form-input" v-model="pwdForm.newPassword" :placeholder="tr('请输入6-16位新密码，包含字母和数字')">
            </div>
            <div class="error-text" v-if="pwdFormError.newPassword">{{tr('新密码格式不正确（6-16位，含字母和数字）')}}</div>
          </div>
          <div class="form-item">
            <label class="form-label">{{tr('确认新密码')}}</label>
            <div class="input-group">
              <input type="password" class="form-input" v-model="pwdForm.confirmPassword" :placeholder="tr('请再次输入新密码')">
            </div>
            <div class="error-text" v-if="pwdFormError.confirmPassword">{{tr('两次输入的密码不一致')}}</div>
          </div>
          <div class="form-item btn-wrap">
            <label class="form-label"></label>
            <button class="save-btn" @click="savePwdForm">{{tr('修改密码')}}</button>
          </div>
        </div>
      </div>

      <!-- 5. 设备Tab -->
      <div v-if="activeTab === 'device' && !isLoading">
        <div class="section-title">{{tr('设备管理')}}</div>
        <div class="tip-box">
          <span class="tip-icon">ℹ</span>
          <div class="tip-text">
            <p>The following are the currently bound login devices for you. If you want to delete an abnormal device, please click the corresponding operation button.</p>
          </div>
        </div>
        <div class="device-table">
          <table>
            <thead>
            <tr>
              <th>{{tr('设备名称')}}</th>
              <th>{{tr('登录时间')}}</th>
              <th>{{tr('登录IP')}}</th>
              <th>{{tr('设备状态')}}</th>
              <th>{{tr('操作')}}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(device, index) in deviceList" :key="index">
              <td>{{ device.deviceName }}</td>
              <td>{{ device.loginTime }}</td>
              <td>{{ device.loginIp }}</td>
              <td><span class="status-tag" :class="{ active: device.status === 'active' }">{{ device.status === 'active' ? tr('当前设备') : tr('已登录设备')}}</span></td>
              <td>
                <button class="delete-btn" @click="deleteDevice(index)" v-if="device.status !== 'active'">{{tr('删除')}}</button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 复制成功Tip（屏幕中间显示） -->
    <div class="copy-tip" v-if="showCopyTip">
      {{tr('复制成功')}}
    </div>
    <!-- 复制成功Tip（屏幕中间显示） -->
    <div class="copy-tip" v-if="showSUCCESSTip">
      SUCCESS
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {request} from "@/utils/request";
import {tr} from "@/utils/common";
// 激活的Tab
const activeTab = ref('base')
// 复制成功Tip控制
const showCopyTip = ref(false)
const showSUCCESSTip = ref(false)
// 加载状态控制
const isLoading = ref(true)

// 1. 基础配置表单数据（公钥用123占位）
const baseForm = ref({
  merchantId: '',
  merchantName: '',
  md5key: ''
})

// 2. API密钥表单数据
const apiForm = ref({
  payIp: '',
  withdrawIp: '',
  balanceIp: ''
})
const apiFormError = ref({
  payIp: '',
  withdrawIp: '',
  balanceIp: ''
})

// 3. Google验证表单数据
const googleForm = ref({
  status: '0',     // 0-关闭 1-开启
  secretKey: '',   // 谷歌密钥
  qr: '',          // 二维码base64
  key: '',         // 接口返回的key
  authCode: ''     // 授权码
})
const googleFormError = ref({
  authCode: ''
})

// 4. 密码修改表单数据
const pwdForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const pwdFormError = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 5. 设备列表数据
const deviceList = ref([])

// 页面挂载时加载所有数据
onMounted(async () => {
  isLoading.value = true
  try {
    // 并行请求所有数据（提升加载效率）
    const [baseRes, apiRes, googleRes] = await Promise.all([
      // 基础配置数据
      request({
        url: '/merchant/param/config/merchant',
        method: 'get'
      }),
      // API密钥数据
      request({
        url: '/merchant/param/config',
        method: 'get'
      }),
      // Google验证数据
      request({
        url: '/merchant/param/config/googleKey',
        method: 'get'
      })
    ])

    // 更新页面数据
    if (baseRes.code === '200') {
      baseForm.value = baseRes.data
    }
    if (apiRes.code === '200') {
      apiForm.value = apiRes.data
    }
    if (googleRes.code === '200') {
      googleForm.value = {
        status: googleRes.data.status,
        secretKey: googleRes.data.secretKey || '',
        qr: googleRes.data.qr || '',
        key: googleRes.data.key || ''
      }
    }
  } catch (error) {
    console.error('failed loading：', error)
    alert('failed, pls try again')
  } finally {
    // 无论成功失败，都关闭加载状态
    isLoading.value = false
  }
})

// 提交绑定（关闭状态下，真实接口提交）
const submitBind = async () => {
  // 前置校验
  googleFormError.value.authCode = ''
  if (!googleForm.value.authCode.trim()) {
    googleFormError.value.authCode = tr('请输入授权码')
    return
  }
  isLoading.value = true
  try {
    const res = await request({
      url: '/merchant/param/config/googleKey', // 真实绑定接口
      method: 'POST',
      data: {
        key: googleForm.value.key,       // 后端返回的key
        otp: googleForm.value.authCode.trim()
      }
    })
    // 处理提交结果
    if (res.code === '200') {
      alert(tr('绑定成功'))
      // 绑定成功后，可重新加载谷歌验证数据，更新状态
      onMounted() // 复用加载逻辑，刷新数据
    } else {
      alert('failed, pls try again' + (res.msg))
    }
  } catch (error) {
    console.error('failed:', error)
    alert(error.message)
  } finally {
    isLoading.value = false
    // 清空授权码输入框
    googleForm.value.authCode = ''
  }
}

// 复制文本功能（带Tip提示，3秒自动关闭）
const copyText = (text) => {
  navigator.clipboard.writeText(text)
  showCopyTip.value = true
  setTimeout(() => {
    showCopyTip.value = false
  }, 3000)
}

// 保存Api表单
const saveApiForm = async () => {
  // 提交到后端
  const res = await request({
    url: '/merchant/param/config/saveOrUpdateIp',
    method: 'post',
    data: apiForm.value
  })
  if (res.code === '200') {
    //alert('API密钥配置保存成功')
    showSUCCESSTip.value = true
    setTimeout(() => {
      showSUCCESSTip.value = false
    }, 3000)
  } else {
    alert('failed, pls try again' + (res.msg))
  }
}

// 保存密码表单
const savePwdForm = async () => {
  // 重置错误提示
  pwdFormError.value = {oldPassword: '', newPassword: '', confirmPassword: ''}
  let isValid = true

  // 校验规则
  if (!pwdForm.value.oldPassword) {
    pwdFormError.value.oldPassword = tr('请输入当前密码')
    isValid = false
  }
  if (pwdForm.value.newPassword !== pwdForm.value.confirmPassword) {
    pwdFormError.value.confirmPassword = tr('两次输入的密码不一致')
    isValid = false
  }
  if (!isValid) return

  // 提交到后端
  const res = await request({
    url: '/merchant/current/modifyPassword',
    method: 'put',
    data: pwdForm.value
  })
  if (res.code === '200') {
    //alert('密码修改成功，请重新登录')
    showSUCCESSTip.value = true
    setTimeout(() => {
      showSUCCESSTip.value = false
    }, 3000)
    // 重置表单
    pwdForm.value = {oldPwd: '', newPwd: '', confirmPwd: ''}
  } else {
    alert('failed, pls try again' + (res.msg))
  }
}

</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #f5f7fa;
  padding: 0; /* 移除body默认padding，实现页面全屏铺满 */
  font-family: "Microsoft YaHei", sans-serif;
}

/* 1. 页面宽度铺满 */
.config-page {
  width: 100%; /* 全屏宽度 */
  background-color: #fff;
  border-radius: 0; /* 移除外层圆角，不影响内容布局 */
  box-shadow: none; /* 移除外层阴影 */
  overflow: hidden;
}

/* 2. 广告位（顶部标题）参考图片设为圆角 */
.page-header {
  background-color: #e8f3ff; /* 与图片风格一致的背景色 */
  padding: 24px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px 12px 0 0; /* 顶部左右圆角，匹配图片样式 */
  margin: 20px; /* 保留边距，还原美观布局 */
}

.header-left .page-title {
  font-size: 22px;
  font-weight: 600;
  color: #1d2129;
  margin-bottom: 6px;
}

.header-left .page-subtitle {
  font-size: 14px;
  color: #86909c;
}

.header-right .decor-icon {
  width: 48px;
  height: 48px;
  background-color: #9c92f8;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.decor-icon .star {
  width: 24px;
  height: 24px;
  background-color: #fff;
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  position: absolute;
  top: 12px;
  left: 12px;
}

.decor-icon .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  position: absolute;
}

.dot1 {
  background-color: #ffd4d4;
  top: 8px;
  right: 8px;
}

.dot2 {
  background-color: #d4f3ff;
  bottom: 8px;
  right: 8px;
}

.dot3 {
  background-color: #fef0d4;
  top: 8px;
  right: 20px;
}

/* Tab栏（固定宽度100px，保留原样式） */
.tab-nav {
  display: flex;
  background-color: #fff;
  border-bottom: 1px solid #f0f2f5;
  padding-left: 30px;
  margin: 0 20px; /* 与顶部广告位边距对齐 */
}

.tab-item {
  width: 100px; /* 固定Tab宽度100px */
  font-size: 16px;
  color: #4e5969;
  cursor: pointer;
  padding: 12px 0;
  text-align: center;
  position: relative;
  transition: color 0.2s;
}

.tab-item:hover {
  color: #165dff;
}

.tab-item.active {
  color: #165dff;
  font-weight: 500;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #165dff;
}

/* 内容区域（铺满宽度） */
.tab-content {
  padding: 30px;
  margin: 0 20px; /* 与顶部布局边距对齐 */
  width: calc(100% - 40px); /* 减去左右20px边距，实现全屏铺满 */
}

/* 加载状态样式 */
.loading-tip {
  text-align: center;
  padding: 50px 0;
  font-size: 16px;
  color: #86909c;
}

/* 内容区域通用样式（保留原配置） */
.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #1d2129;
  margin-bottom: 16px;
}

.tip-box {
  background-color: #e8f3ff;
  border-radius: 8px;
  padding: 14px 20px;
  margin-bottom: 28px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.tip-icon {
  font-size: 18px;
  color: #165dff;
  margin-top: 2px;
}

.tip-text {
  font-size: 14px;
  color: #4e5969;
  line-height: 1.6;
}

/* 表单通用样式（铺满宽度） */
.form-container {
  width: 100%; /* 表单全屏铺满 */
  padding: 0 10px;
}

.form-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
  gap: 8px;
}

.form-label {
  font-size: 16px;
  color: #4e5969;
}

.input-group {
  position: relative;
  width: 100%; /* 输入框全屏铺满 */
  max-width: none; /* 取消最大宽度限制 */
}

.form-input {
  width: 100%;
  padding: 12px 18px;
  border: 1px solid #e5e6eb;
  border-radius: 8px;
  font-size: 16px;
  color: #1d2129;
  background-color: #fff;
}

.form-input[readonly] {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.form-textarea {
  width: 100%;
  height: 120px;
  padding: 12px 18px;
  border: 1px solid #e5e6eb;
  border-radius: 8px;
  font-size: 16px;
  color: #1d2129;
  background-color: #f8f9fa;
  cursor: not-allowed;
  resize: none;
}

.copy-btn {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background-color: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #86909c;
  transition: color 0.2s;
}

.copy-textarea-btn {
  top: 20px;
  transform: none;
}

.copy-btn:hover {
  color: #165dff;
}

.error-text {
  font-size: 12px;
  color: #ff4d4f;
  margin-left: 4px;
}

/* 单选框样式（保留原配置） */
.radio-item {
  flex-direction: row;
  align-items: center;
  gap: 16px;
}

.radio-wrap {
  display: flex;
  gap: 24px;
}

.radio-label {
  font-size: 16px;
  color: #4e5969;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 按钮样式（保留原配置） */
.btn-wrap {
  margin-top: 24px;
  margin-bottom: 0;
  text-align: left; /* 文本/按钮左对齐 */
  padding: 0; /* 移除所有内边距 */
  display: block; /* 强制块级元素，取消flex布局干扰 */
}

.save-btn {
  padding: 10px 24px;
  background-color: #165dff;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

.save-btn:hover {
  background-color: #0e4bdb;
}

/* 设备表格样式（保留原配置） */
.device-table {
  width: 100%;
  border: 1px solid #e5e6eb;
  border-radius: 8px;
  overflow: hidden;
}

.device-table table {
  width: 100%;
  border-collapse: collapse;
}

.device-table th {
  background-color: #f8f9fa;
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
  color: #4e5969;
  border-bottom: 1px solid #e5e6eb;
}

.device-table td {
  padding: 12px 16px;
  font-size: 14px;
  color: #1d2129;
  border-bottom: 1px solid #e5e6eb;
}

.device-table tr:last-child td {
  border-bottom: none;
}

.status-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-tag.active {
  background-color: #e8f3ff;
  color: #165dff;
}

.status-tag:not(.active) {
  background-color: #f8f9fa;
  color: #86909c;
}

.delete-btn {
  padding: 4px 12px;
  background-color: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.delete-btn:hover {
  background-color: #d9363e;
}

/* 3. 复制成功Tip样式（屏幕正中间显示，带淡入淡出动画） */
.copy-tip {
  position: fixed;
  top: 50%; /* 垂直居中 */
  left: 50%; /* 水平居中 */
  transform: translate(-50%, -50%); /* 精准居中（抵消自身宽高） */
  padding: 12px 24px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #ffffff;
  border-radius: 8px;
  font-size: 16px;
  z-index: 9999; /* 确保在最上层 */
  animation: fadeInOut 3s ease-in-out;
  pointer-events: none; /* 不遮挡点击事件 */
}

/* 淡入淡出动画 */
@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translate(-50%, -60%);
  }
  10% {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
  90% {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -60%);
  }
}

/* 状态展示样式 */
.status-display {
  padding: 12px 18px;
  border: 1px solid #e5e6eb;
  border-radius: 8px;
  font-size: 16px;
  color: #1d2129;
  background-color: #f8f9fa;
}

/* 二维码容器样式 */
.qr-container {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.qr-img {
  width: 300px;
  height: 300px;
  object-fit: contain;
  border: 1px solid #e5e6eb;
  border-radius: 8px;
  padding: 8px;
}
.empty-tip {
  font-size: 14px;
  color: #86909c;
  padding: 12px 0;
}

/* 提交绑定按钮：确保自身不居中 */
.bind-btn {
  padding: 10px 24px;
  background-color: #00b42a;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
  display: inline-block; /* 行内块，跟随容器text-align:left */
  margin: 0; /* 移除默认外边距 */
}
.bind-btn:hover {
  background-color: #00a127;
}
</style>
