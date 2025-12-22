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
      <template #tableBeforeButtons>
        <div class="total-sum">
          <section  class="total-sum--item">
            <span class="total-sum--item-label">{{tr('汇总笔数')}}:</span>
            <span class="total-sum--item-value">{{sumData.a || 0}}</span>
          </section>
          <section  class="total-sum--item">
            <span class="total-sum--item-label">{{tr('汇总金额')}}:</span>
            <span class="total-sum--item-value">{{sumData.b || 0}}</span>
          </section>
        </div>
      </template>
<!--      <template #searchAfterButtons>-->
<!--        <a-button type="primary" status="danger" @click="exportExcel">{{tr('导出')}}</a-button>-->
<!--      </template>-->
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

// async function exportExcel() {
//   const {x, b: a, c: b, h: c, ...rest} = crudRef.value.crudSearchRef.getSearchForm()
//   if (x) {
//     rest.startDate = x[0];
//     rest.endDate = x[1];
//   } else {
//     rest.startDate = dayjs().startOf('day').subtract(3, 'day').format('YYYY-MM-DD');
//     rest.endDate = dayjs().endOf('day').format('YYYY-MM-DD');
//   }
//   const res = await request({
//     url: '/v1/export/payin',
//     method: 'get',
//     params: tool.clearParamsEmpty({...rest, a, b, c})
//   })
//   Message.success(res.data.message)
// }
const sumData = ref({})

function getOnlineUserPageList(params = {}) {
  const {x, i: c, ...rest} = params
  if (x) {
    rest.startDate = x[0];
    rest.endDate = x[1];
  } else {
    rest.startDate = dayjs().startOf('day').subtract(3, 'day').format('YYYY-MM-DD');
    rest.endDate = dayjs().endOf('day').format('YYYY-MM-DD');
  }
  getSum({...rest, c})
  return request({
    url: '/v1/agent/txn/payin',
    method: 'get',
    params: tool.clearParamsEmpty({...rest, c})
  })
}

function getSum(params) {
  request({
    url: '/v1/agent/txn/payin/sum',
    method: 'get',
    params: tool.clearParamsEmpty(params)
  }).then(res => {
    sumData.value = res.data
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
  {title: tr('商户号'), dataIndex: 'a', width: 160},
  {title: tr('商家订单号'), dataIndex: 'b',  width: 160},
  {title: tr('支付订单号'), dataIndex: 'c',  width: 180},
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
    { title: tr('操作'), dataIndex: '__operation', hide: true },
])

</script>
<style lang="less" scoped>
.total-sum {
  display: flex;
  align-items: center;
  .total-sum--item {
    display: flex;
    align-items: center;
    margin-right: 20px;
    .total-sum--item-label {
      font-size: 14px;
      font-weight: 600;
      margin-right: 8px;
    }
  }
}
</style>