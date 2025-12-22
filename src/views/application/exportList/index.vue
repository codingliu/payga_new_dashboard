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
      <template #operationBeforeExtend="{ record }">
        <a-link v-if="record.c" @click="go2PZ(record)">{{ tr('下载') }}</a-link>
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

const crudRef = ref()

function getList(params = {}) {
  const {x, ...rest} = params
  if (x) {
    rest.startDate = x[0];
    rest.endDate = x[1];
  } else {
    rest.startDate = dayjs().startOf('day').subtract(3, 'day').format('YYYY-MM-DD');
    rest.endDate = dayjs().endOf('day').format('YYYY-MM-DD');
  }
  return request({
    url: '/v1/export/list',
    method: 'get',
    params: tool.clearParamsEmpty({...rest})
  })
}

function go2PZ(record) {
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = record.c;
  a.download = record.a;
  // 使用target="_blank"时，添加rel="noopener noreferrer" 堵住钓鱼安全漏洞 防止新页面window指向之前的页面
  a.rel = "noopener noreferrer";
  document.body.append(a);
  a.click();

  setTimeout(() => {
    a.remove();
  }, 1000);
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
  {title: tr('名称'), dataIndex: 'a', width: 160},
  {title: tr('类型'), dataIndex: 'b', width: 200},
  {title: tr('链接'), dataIndex: 'c', width: 100},
  {
    title: tr('时间'), dataIndex: 'd', search: true, formType: 'range', width: 180, customRender: ({record}) => {
      return record.d ? tool.dateFormat(record.d) : ''
    },
    searchDefaultValue: [dayjs().startOf('day').subtract(3, 'day').format('YYYY-MM-DD'), dayjs().endOf('day').format('YYYY-MM-DD')],
  },
  {title: tr('状态'), dataIndex: 's', width: 200},
])
</script>

<script>
export default {name: 'system:onlineUser'}
</script>

<style scoped>

</style>