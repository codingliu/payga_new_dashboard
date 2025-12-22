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
    </ma-crud>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import monitor from '@/api/system/monitor'
import { Message } from '@arco-design/web-vue'
import {tr} from "@/utils/common";

const crudRef = ref()
import dayjs from "dayjs";
import tool from "@/utils/tool";

const crud = reactive({
  api: monitor.getOnlineUserPageList,
  showIndex: false,
  showTools: false,
  operationColumn: false,
  operationColumnWidth: 120,
  searchColNumber: 2,
  pageLayout: 'fixed',
})

const columns = reactive([
  { title: tr('登录IP'), dataIndex: 'loginIp',  },
  { title: tr('登录时间'), dataIndex: 'loginTime', search: true,
    formType: 'range',
    customRender: ({record}) => {
      return record.loginTime ? tool.dateFormat(record.loginTime) : ''
    },
    searchDefaultValue: [dayjs().startOf('day').subtract(3, 'day').format('YYYY-MM-DD'), dayjs().endOf('day').format('YYYY-MM-DD')]},
])
</script>

<script>
export default { name: 'system:onlineUser' }
</script>

<style scoped>

</style>