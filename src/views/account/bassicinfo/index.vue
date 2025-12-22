<template>
  <div class="bassic-info">
    <a-form :model="baseInfo" @submit="modifyInfo">
      <a-form-item :label="tr('用户名称')" label-col-flex="200px">
        <a-input disabled v-model="baseInfo.a" :default-value="baseInfo.a" allow-clear />
      </a-form-item>
      <a-form-item :label="tr('邮箱')" label-col-flex="200px">
        <a-input v-model="baseInfo.b" allow-clear />
      </a-form-item>
      <a-form-item :label="tr('登录谷歌验证')" label-col-flex="200px">
        <a-switch v-model="baseInfo.c" @change="changeShowQr" />
      </a-form-item>
      <a-form-item v-if="baseInfo.c" :label="tr('二维码')" label-col-flex="200px">
        <div class="qr-code-box">
          <div class="ar-code__header">{{tr('手机打开 Google Authenticator(谷歌身份验证器) ，扫描二维码')}}</div>
          <img :src="qrCode" alt="" class="ar-code__img" />
        </div>
      </a-form-item>
      <a-form-item :label="tr('谷歌验证码')" label-col-flex="200px">
        <a-input v-model="baseInfo.google" allow-clear />
      </a-form-item>
      <a-form-item label-col-flex="200px">
        <a-button type="primary" style="margin-right: 20px">{{tr('重置')}}</a-button>
        <a-button html-type="submit" type="primary">{{tr('保存')}}</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup>
import {onBeforeMount, reactive, ref, toRefs} from 'vue'
import { Message } from '@arco-design/web-vue'
import user from '@/api/system/user'
import {tr} from "@/utils/common";
import {request} from "@/utils/request";

const qrCode = ref('')
const state = reactive({
  baseInfo: {
    c: false,
    a: '',
    b: '',
    google: ''
  }
})
const {baseInfo} = toRefs(state)

async function getBaseInfo() {
  const res = await request({
    url: '/v1/merchant/base-info',
    method: 'get'
  })
  if (res.code === '200') {
    state.baseInfo = res.data
    if(res.data.c) {
      await changeShowQr(true)
    }
  }
}
onBeforeMount(() => {
  getBaseInfo()
})

async function changeShowQr(e) {
  if(e) {
    const res = await request({
      url: '/v1/merchant/google-qr'
    })
    qrCode.value = res.data.qr
  }
}

const modifyInfo = async (data) => {
  const {google} = data.values;
  try {
    await request({
      url: `/v1/merchant/google-qr?code=${google}`,
      method: 'post'
    })
    Message.success(tr('保存成功'))
  }catch (e) {
    Message.success(tr('保存失败'))
  }
}
</script>
<style lang="less" scoped>
.bassic-info {
  background: #fff;
  padding: 0.75rem;
}
</style>