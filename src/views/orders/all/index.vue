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
      <template #operationBeforeExtend="{ record }">
        <a-link @click="getRest(record)">{{ tr('回调') }}</a-link>
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
  const {x, b: a, c: b, h: c, ...rest} = crudRef.value.crudSearchRef.getSearchForm()
  if (x) {
    rest.startDate = x[0];
    rest.endDate = x[1];
  } else {
    rest.startDate = dayjs().startOf('day').subtract(3, 'day').format('YYYY-MM-DD');
    rest.endDate = dayjs().endOf('day').format('YYYY-MM-DD');
  }
  const res = await request({
    url: '/v1/export/payin',
    method: 'get',
    params: tool.clearParamsEmpty({...rest, a, b, c})
  })
  Message.success(res.data.message)
}

function getOnlineUserPageList(params = {}) {
  const {x, b: a, c: b, i: c, ...rest} = params
  if (x) {
    rest.startDate = x[0];
    rest.endDate = x[1];
  } else {
    rest.startDate = dayjs().startOf('day').subtract(3, 'day').format('YYYY-MM-DD');
    rest.endDate = dayjs().endOf('day').format('YYYY-MM-DD');
  }

  return request({
    url: '/v1/payin/list',
    method: 'get',
    params: tool.clearParamsEmpty({...rest, a, b, c})
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
  {title: tr('商家订单号'), dataIndex: 'b', search: true, width: 160},
  {title: tr('支付订单号'), dataIndex: 'c', search: true, width: 180},
  {
    title: tr('金额'), dataIndex: 'd', width: 140, customRender: ({record}) => {
      return parseFloat(record.d || '0').toFixed(2)
    }
  },
  {
    title: tr('费用'), dataIndex: 'e', width: 140, customRender: ({record}) => {
      return parseFloat(record.e || '0').toFixed(2)
    }
  },
  {
    title: tr('状态'), dataIndex: 'i', search: true, formType: 'select',
    dict: {
      data: [{label: 'CREATED', value: 'CREATED'}, {label: 'PENDING', value: 'PENDING'}, {
        label: 'FAILED',
        value: 'FAILED'
      }, {label: 'SUCCESS', value: 'SUCCESS'}], translation: true
    },
  },
  {title: tr('客户姓名'), dataIndex: 'f',},
  {title: tr('渠道'), dataIndex: 'g',},
  {title: tr('卡号'), dataIndex: 'h', width: 200},
  {
    title: tr('创建时间'), dataIndex: 'x', search: true, formType: 'range', width: 180, customRender: ({record}) => {
      return record.x ? tool.dateFormat(record.x) : ''
    },
    searchDefaultValue: [dayjs().startOf('day').subtract(3, 'day').format('YYYY-MM-DD'), dayjs().endOf('day').format('YYYY-MM-DD')],
  },
  {
    title: tr('结算时间'), dataIndex: 'z', customRender: ({record}) => {
      return record.z ? tool.dateFormat(record.z) : ''
    }
  },
  {
    title: tr('完成时间'), dataIndex: 'y', width: 180, customRender: ({record}) => {
      return record.y ? tool.dateFormat(record.y) : ''
    }
  },
])

async function getRest(row) {
  await request({
    url: `/v1/payin/notify/${row.b}`,
    method: 'post'
  })
  Message.success(tr('回调成功'));
  crudRef.value.refresh();
}

</script>

<script>
export default {name: 'system:onlineUser'}
</script>

<style scoped>

</style>