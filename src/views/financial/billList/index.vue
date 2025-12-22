<!--
 - MineAdmin is committed to providing solutions for quickly building web applications
 - Please view the LICENSE file that was distributed with this source code,
 - For the full copyright and license information.
 - Thank you very much for using MineAdmin.
 -
 - @Author X.Mo<root@imoi.cn>
 - @Link   https://gitee.com/xmo/mineadmin-vue
-->
<template>
  <div class="ma-content-block lg:flex justify-between p-4">
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
      <template #searchAfterButtons>
        <a-button type="primary" status="danger" @click="exportExcel">{{tr('导出')}}</a-button>
      </template>
    </ma-crud>
  </div>
</template>

<script setup>
import {reactive, ref} from 'vue'
import {tr} from "@/utils/common";
import {request} from "@/utils/request";
import tool from "@/utils/tool";
import dayjs from "dayjs";
import {Message} from "@arco-design/web-vue";

const crudRef = ref()
async function exportExcel() {
  const {g, ...rest} = crudRef.value.crudSearchRef.getSearchForm()
  if (g) {
    rest.startDate = g[0];
    rest.endDate = g[1];
  } else {
    rest.startDate = dayjs().startOf('day').subtract(3, 'day').format('YYYY-MM-DD');
    rest.endDate = dayjs().endOf('day').format('YYYY-MM-DD');
  }
  const res = await request({
    url: '/v1/export/detail',
    method: 'get',
    params: tool.clearParamsEmpty({...rest})
  })
  Message.success(res.data.message)
}
function getList(params = {}) {
  const {g, ...rest} = params
  if (g) {
    rest.startDate = g[0];
    rest.endDate = g[1];
  } else {
    rest.startDate = dayjs().startOf('day').subtract(3, 'day').format('YYYY-MM-DD');
    rest.endDate = dayjs().endOf('day').format('YYYY-MM-DD');
  }
  return request({
    url: '/v1/finance/account-detail',
    method: 'get',
    params: tool.clearParamsEmpty({...rest})
  })
}


const crud = reactive({
  api: getList,
  showIndex: false,
  showTools: false,
  operationColumn: true,
  operationColumnWidth: 120,
  searchColNumber: 2,
  pageLayout: 'fixed',
})

const columns = reactive([
  {title: tr('支付订单号'), dataIndex: 'b', search: true, width: 200},
  {title: tr('金额'), dataIndex: 'c', width: 140, customRender: ({record}) => {return parseFloat(record.c || '0').toFixed(2)}},
  {title: tr('费用'), dataIndex: 'd', width: 140, customRender: ({record}) => {return parseFloat(record.d || '0').toFixed(2)}},
  {title: tr('交易前商余'), dataIndex: 'e', width: 140, customRender: ({record}) => {return parseFloat(record.e || '0').toFixed(2)}},
  {title: tr('交易后商余'), dataIndex: 'f', width: 140, customRender: ({record}) => {return parseFloat(record.f || '0').toFixed(2)}},
  {
    title: tr('时间'), dataIndex: 'g', search: true, formType: 'range', width: 180, customRender: ({record}) => {
      return record.g ? tool.dateFormat(record.g) : ''
    },
    searchDefaultValue: [dayjs().startOf('day').subtract(3, 'day').format('YYYY-MM-DD'), dayjs().endOf('day').format('YYYY-MM-DD')],
  },
  {title: tr('交易类型'), dataIndex: 'h', width: 120},
])
</script>

<script>
export default {name: 'system:onlineUser'}
</script>

<style scoped>

</style>