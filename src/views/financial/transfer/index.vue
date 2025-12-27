<template>
  <div class="transfer-main">
    <a-divider orientation="left">{{ tr('账户信息') }}</a-divider>
    <section class="transfer-main__header">
      <div class="header-item">
        <span class="header-item__label">{{tr('可用余额')}}:</span>
        <span class="header-item__value">{{ tool.groupSeparator(parseFloat(state.balance.a || 0).toFixed(2)) }}</span>
      </div>
      <div class="header-item">
        <span class="header-item__label">{{tr('待结算余额')}}:</span>
        <span class="header-item__value">{{ tool.groupSeparator(parseFloat(state.balance.f || 0).toFixed(2))}}</span>
      </div>
    </section>
    <a-divider></a-divider>
    <a-form ref="formRef"  @submit="handleSubmit" class="transfer-main__body" :model="form">
      <a-form-item field="e" :label="tr('提现金额')" :rules="[{required:true, message:'this is required'}]">
        <a-input v-model="form.e" :placeholder="tr('最小100，单笔手续费+0%')" />
      </a-form-item>
      <a-form-item field="d"  :label="tr('转账账户')" :rules="[{required:true, message:'this is required'}]">
        <a-input v-model="form.d" :placeholder="tr('请输入转账账户')" />
      </a-form-item>
      <a-form-item field="b" :label="tr('收款人')" :rules="[{required:true, message:'this is required'}]">
        <a-input v-model="form.b" :placeholder="tr('请输入收款人真实姓名')" />
      </a-form-item>
      <a-form-item field="c" :label="tr('支付密码')" :rules="[{required:true, message:'this is required'}]">
        <a-input v-model="form.c" type="password" :placeholder="tr('请输入支付密码')" />
      </a-form-item>
      <a-form-item>
        <a-button @click="resetform">{{tr('重置')}}</a-button>
        <a-button  html-type="submit" style="margin-left: 20px" type="primary">{{tr('确认')}}</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import {onBeforeMount, reactive, ref} from "vue";
import {tr} from "@/utils/common";
import {request} from "@/utils/request";
import {Md5} from "ts-md5";
import {Message} from "@arco-design/web-vue";
import tool from "@/utils/tool";

const form = reactive({
  a: '',
  b: '',
  c: '',
  d: '',
  e: ''
})

const state = reactive({
  bankOption: [],
  balance: {}
})

const formRef = ref()

async function getBalance() {
  const res = await request({
    url: '/v1/index/balance',
    method: 'get'
  })
  if (res.code === '200') {
    state.balance = res.data;
  }
}

onBeforeMount(() => {
  getBalance()
})

function handleSubmit({values, errors}) {
  formRef.value?.validate(res => {
    if(!res) {
      const {c, ...rest} = values
      const md5 = new Md5()
      md5.appendAsciiStr(c)
      const params = {...rest, c: md5.end()}
      request({
        url: '/v1/finance/withdraw',
        method: 'post',
        data: params
      }).then(res => {
        if(res.code === '200') {
          Message.success(tr('提现成功'))
          resetform()
        }
      })
    }
  })
}

function resetform() {
  formRef.value?.resetFields()
}
</script>
<style lang="less" scoped>
.transfer-main {
  box-sizing: border-box;
  padding: 20px;
  background: #fff;
  .transfer-main__header {
    display: flex;
    align-items: center;
    .header-item {
       flex: 1;
      .header-item__label {
        font-weight: 500;
        color: #333;
      }
      .header-item__value {
        margin-left: 8px;
      }
    }
  }
}
</style>
