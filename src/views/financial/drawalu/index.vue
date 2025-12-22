<template>
  <div class="transfer-main">
    <a-form ref="formRef"  @submit="handleSubmit" class="transfer-main__body" :model="form">
      <a-form-item field="c" :label="tr('提U数量')" :rules="[{required:true, message:'this is required'}]">
        <a-input v-model="form.c" :placeholder="`${tr('手续费')}：0.00+0%`" />
      </a-form-item>
      <a-form-item field="u"  :label="tr('钱包地址')" :extra="tr('注意：如果输入错误，产生的交易不可逆转')" :rules="[{required:true, message:'this is required'}]">
        <a-input v-model="form.u" :placeholder="tr('请输入钱包地址')" />
      </a-form-item>
      <a-form-item field="u" :label="tr('支付密码')" :rules="[{required:true, message:'this is required'}]">
        <a-input v-model="form.a" type="password" :placeholder="tr('请输入支付密码')" />
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
  c: '',
  u: '',
})

const state = reactive({
  bankOption: [],
  balance: {}
})

const formRef = ref()

function handleSubmit({values, errors}) {
  formRef.value?.validate(res => {
    if(!res) {
      const {a, ...rest} = values
      const md5 = new Md5()
      md5.appendAsciiStr(a)
      const params = {...rest, a: md5.end()}
      request({
        url: '/v1/finance/usdt',
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
  :deep(.arco-form-item-extra) {
    color: red;
  }
}
</style>