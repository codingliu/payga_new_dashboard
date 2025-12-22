<template>
  <div class="app-config">
    <a-form class="w-full md:w-full mt-3" :model="appInfo" @submit="modifyInfo">
      <a-divider orientation="left">{{ tr('支付密码') }}</a-divider>
      <a-form-item :label="tr('原始支付密码')" label-col-flex="200px"
                   :rules="[{required:true,message:tr('原始支付密码必填')}]">
        <a-input type="password" v-model="appInfo.a" allow-clear/>
      </a-form-item>
      <a-form-item :label="tr('新密码')" label-col-flex="200px" :rules="[{required:true,message:tr('新密码必填')}]">
        <a-input type="password" v-model="appInfo.b" allow-clear/>
      </a-form-item>
      <a-form-item :label="tr('确认密码')" label-col-flex="200px" :rules="[{required:true,message:tr('确认密码必填')}]">
        <a-input type="password" v-model="appInfo.c" allow-clear/>
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
import {reactive, toRefs} from "vue";
import {request} from "@/utils/request";
import {Message} from "@arco-design/web-vue";
import {Md5} from "ts-md5";

const state = reactive({
  appInfo: {
    a: '',
    b: '',
    c: ''
  },
})
const {appInfo} = toRefs(state)

async function modifyInfo() {
  const {a, b, c} = state.appInfo
  if(b !== c) {
    Message.error(tr('两次输入的密码不一致'))
    return
  }
  const md51 = new Md5()
  const md52 = new Md5()
  const res = await request({
    url: '/v1/merchant/update-txn-pwd',
    method: 'post',
    data: {
      pwd: md51.appendAsciiStr(a).end(),
      pwd2: md52.appendAsciiStr(b).end()
    }
  })
  if (res.code === '200') {
    Message.success(tr('修改成功'))
  }
}
</script>
<style lang="less" scoped>
.app-config {
  background: #fff;
  padding: 0.75rem;
}
</style>