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
      <!--      <template #searchAfterButtons>-->
      <!--        <a-button type="primary" status="danger" @click="exportExcel">{{tr('导出')}}</a-button>-->
      <!--      </template>-->
      <!--      <template #operationBeforeExtend="{ record }">-->
      <!--        <a-link @click="getRest(record)">{{ tr('回调') }}</a-link>-->
      <!--        <a-link v-if="record.h === 'SUCCESS'" @click="go2PZ(record)">{{ tr('凭证') }}</a-link>-->
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

const crudRef = ref()

function getOnlineUserPageList(params = {}) {

  return request({
    url: '/v1/agent/merchant/list',
    method: 'get',
    params: tool.clearParamsEmpty()
  })
}

function go2PZ(row) {
  console.log(row, 111)
}

async function getRest(row) {
  await request({
    url: `/v1/payout/notify/${row.b}`,
    method: 'post'
  })
  Message.success(tr('回调成功'));
  crudRef.value.refresh();
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
  {title: tr('邮箱'), dataIndex: 'email'},
  {title: tr('用户名'), dataIndex: 'name'},
  {title: tr('商户编号'), dataIndex: 'merchantNo'},
    { title: tr('操作'), dataIndex: '__operation', hide: true },
])
</script>
