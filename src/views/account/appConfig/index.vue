<template>
  <div class="app-config">
    <a-form class="w-full md:w-full mt-3" :model="appInfo" @submit="modifyInfo">
      <a-form-item :label="tr('接口地址')" label-col-flex="160px">
        <a-input disabled v-model="appInfo.a" allow-clear/>
      </a-form-item>
      <a-divider orientation="left">{{ tr('应用信息') }}</a-divider>
      <a-form-item :label="tr('AppKey')" label-col-flex="160px">
        <a-input disabled v-model="appInfo.b" allow-clear/>
      </a-form-item>
      <a-form-item :label="tr('MD5Key')" label-col-flex="160px">
        <a-input disabled v-model="appInfo.d" allow-clear/>
      </a-form-item>
      <a-divider orientation="left">{{ tr('渠道') }}</a-divider>
      <a-table style="margin-left: 176px" border stripe :pagination="false" :columns="columns" :data="appInfo.c || []" />
      <a-divider orientation="left">{{ tr('白名单') }}</a-divider>
      <a-form-item :label="tr('IP白名单')" label-col-flex="160px">
        <a-textarea v-model="appInfo.e" class="h-28" allow-clear/>
      </a-form-item>
      <a-form-item label-col-flex="160px">
        <a-button type="primary" style="margin-right: 20px">{{ tr('重置') }}</a-button>
        <a-button html-type="submit" type="primary">{{ tr('保存') }}</a-button>
      </a-form-item>
    </a-form>

  </div>
</template>
<script setup lang="ts">
import {tr} from "@/utils/common";
import {onBeforeMount, reactive, toRefs} from "vue";
import {request} from "@/utils/request";
import {Message} from "@arco-design/web-vue";
const state = reactive({
  appInfo: {
    e: '',
    a: '',
    b: '',
    d: '',
    c: []
  },
  url: location.host
})
const {appInfo, url} = toRefs(state)

const columns = [
  {title: tr('收款渠道'), dataIndex: 'a'},
  {title: tr('商户费率'), dataIndex: 'b', render: ({record}) => {
    return `${parseFloat(record.b|| '0').toFixed(2)} + ${parseFloat(record.c|| '0').toFixed(2)}%`
    }},
  {title: tr('结算方式'), dataIndex: 't'},
]

async function getAppInfo() {
  const res = await request({
    url: '/v1/merchant/application-info',
    method: 'get'
  })
  if (res.code === '200') {
    state.appInfo = res.data
  }
}

onBeforeMount(() => {
  getAppInfo()
})

async function modifyInfo() {
  const res = await request({
    url: '/v1/merchant/update-ip',
    method: 'post',
    data: {
      ip: state.appInfo?.e
    }
  })
  if(res.code === '200') {
    Message.success('保存成功')
  }
}
</script>
<style lang="less" scoped>
.app-config {
  background: #fff;
  padding: 0.75rem;
}
</style>