<template>
  <div class="bassic-info">
    <a-form :model="baseForm">
      <a-form-item :label="tr('用户名称')" label-col-flex="200px">
        <a-input disabled v-model="baseForm.merchantNo" :default-value="baseForm.merchantNo" allow-clear />
      </a-form-item>
      <a-form-item :label="tr('邮箱')" label-col-flex="200px">
        <a-input disabled v-model="baseForm.email" allow-clear />
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup>
import {onBeforeMount, reactive, ref, toRefs} from 'vue'
import {tr} from "@/utils/common";
import {request} from "@/utils/request";

const baseForm = ref({
  merchantNo: '',
  email: ''
})

async function getBaseInfo() {
  const res = await request({
    url: '/merchant/base_info',
    method: 'get'
  })
  if (res.code === '200') {
    baseForm.value = res.data
  }
}
onBeforeMount(() => {
  getBaseInfo()
})

</script>
<style lang="less" scoped>
.bassic-info {
  background: #fff;
  padding: 0.75rem;
}
</style>
