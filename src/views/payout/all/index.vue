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
    url: '/merchant/trade/payout/list/export',
    method: 'get',
    params: tool.clearParamsEmpty({...rest, a, b, c})
  })
  Message.success(res.data.message)
}

function getOnlineUserPageList(params = {}) {
  const {createdTime, merchantOrderNo: merchantOrderNo, platOrderNo: platNo, payerInfo: payerInfo,amount: amount,payerMobile: payerMobile,payerEmail: payerEmail,  ...rest} = params
  if (createdTime) {
    rest.startDate = createdTime[0] + ' 00:00:00';
    rest.endDate = createdTime[1] + ' 23:59:59';
  } else {
    rest.startDate = dayjs().startOf('day').subtract(3, 'day').format('YYYY-MM-DD') + ' 00:00:00';
    rest.endDate = dayjs().endOf('day').format('YYYY-MM-DD')  + ' 23:59:59';
  }

  return request({
    url: '/trade/payout/list',
    method: 'get',
    params
    //params: tool.clearParamsEmpty({...rest, a, b, c})
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
  {title: tr('币种'), dataIndex: 'currency', value: 'INR', search: true, width: 60},
  {title: tr('商户编号'), dataIndex: 'merchantId', width: 180},
  {title: tr('商户订单号'), dataIndex: 'merchantOrderNo', search: true, width: 200},
  {title: tr('平台订单号'), dataIndex: 'platNo', search: true, width: 200},
  {title: tr('支付方式'), dataIndex: 'paymentMethod', width: 100},
  {title: tr('收款账号'), dataIndex: 'payerInfo', search: true, width: 150},
  {title: tr('收款人手机号'), dataIndex: 'payeeMobile', search: true, width: 150},
  {title: tr('付款人姓名'), dataIndex: 'payeeName', search: true, width: 150},
  {title: tr('金额'), dataIndex: 'amount', search: true, width: 100},
  {title: tr('费用'), dataIndex: 'fee', width: 100},
  {title: tr('银行流水'), dataIndex: 'trxid',search: true, width: 100},
  {title: tr('备注'), dataIndex: 'remark', width: 180},
  {
    title: tr('创建时间'), dataIndex: 'createdTime', search: true, formType: 'range', width: 180, customRender: ({record}) => {
      return record.createdTime ? tool.dateFormat(record.createdTime) : ''
    },
    searchDefaultValue: [dayjs().startOf('day').subtract(3, 'day').format('YYYY-MM-DD'), dayjs().endOf('day').format('YYYY-MM-DD')],
  },
  {
    title: tr('更新时间'), dataIndex: 'updatedTime', formType: 'range', width: 180, customRender: ({record}) => {
      return record.updatedTime ? tool.dateFormat(record.updatedTime) : ''
    },
    searchDefaultValue: [dayjs().startOf('day').subtract(3, 'day').format('YYYY-MM-DD'), dayjs().endOf('day').format('YYYY-MM-DD')],
  },
  {
    title: tr('支付状态'), dataIndex: 'paymentStatus', search: true, formType: 'select',
    dict: {
      data: [{label: 'CREATED', value: 'CREATED'}, {label: 'PENDING', value: 'PENDING'},
        {label: 'FAILED', value: 'FAILED' }, {label: 'SUCCESS', value: 'SUCCESS'}], translation: true
    },
  },
])

async function getRest(row) {
  await request({
    url: `/v1/payout/notify/${row.b}`,
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
