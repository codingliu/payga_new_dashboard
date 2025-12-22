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
import {Message} from "@arco-design/web-vue";
import dayjs from "dayjs";

const crudRef = ref()

async function exportExcel() {
  const {a: b, d: a, t, ...rest} = crudRef.value.crudSearchRef.getSearchForm()
  if (t) {
    rest.startDate = t[0];
    rest.endDate = t[1];
  } else {
    rest.startDate = dayjs().startOf('day').subtract(3, 'day').format('YYYY-MM-DD');
    rest.endDate = dayjs().endOf('day').format('YYYY-MM-DD');
  }
  const res = await request({
    url: '/v1/export/withdraw',
    method: 'get',
    params: tool.clearParamsEmpty({...rest, a, b})
  })
  Message.success(res.data.message)
}

function getOnlineUserPageList(params = {}) {
  const {a: b, d: a, t, ...rest} = params
  if (t) {
    rest.startDate = t[0];
    rest.endDate = t[1];
  } else {
    rest.startDate = dayjs().startOf('day').subtract(3, 'day').format('YYYY-MM-DD');
    rest.endDate = dayjs().endOf('day').format('YYYY-MM-DD');
  }
  return request({
    url: '/v1/finance/withdraw',
    method: 'get',
    params: tool.clearParamsEmpty({...rest, a, b})
  })
}

const crud = reactive({
  api: getOnlineUserPageList,
  showIndex: false,
  showTools: false,
  operationColumn: true,
  operationColumnWidth: 120,
  searchColNumber: 2,
  pageLayout: 'fixed',
})

const columns = reactive([
  // {title: tr('商户号'), dataIndex: 'a', width: 160},
  {title: tr('用户名'), dataIndex: 'b', width: 200},
  {title: tr('单号'), dataIndex: 'c', width: 200},
  {title: tr('账号'), dataIndex: 'd', search: true, width: 200},
  {title: tr('银行'), dataIndex: 'e', width: 200},
  {
    title: tr('金额'), dataIndex: 'f', width: 140, customRender: ({record}) => {
      return parseFloat(record.f || '0').toFixed(2)
    }
  },
  {
    title: tr('状态'), dataIndex: 'a', search: true, formType: 'select',
    dict: {
      data: [{label: 'CREATED', value: 'CREATED'}, {label: 'SUCCESS', value: 'SUCCESS'}, {
        label: 'FAILED',
        value: 'FAILED'
      }], translation: true
    },
  },
  {
    title: tr('时间'), dataIndex: 't', search: true, formType: 'range', width: 180, customRender: ({record}) => {
      return record.t ? tool.dateFormat(record.t) : ''
    },
    searchDefaultValue: [dayjs().startOf('day').subtract(3, 'day').format('YYYY-MM-DD'), dayjs().endOf('day').format('YYYY-MM-DD')],
  }
])
</script>

<script>
export default {name: 'system:onlineUser'}
</script>

<style scoped>

</style>