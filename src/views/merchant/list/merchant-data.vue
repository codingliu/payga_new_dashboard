
<template>
    <div class="ma-content-block lg:flex justify-between p-4">
  
        <ma-crud :options="crud" :columns="columns" ref="crudRef">
     
        </ma-crud>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { tr } from "@/utils/common";
import { request } from "@/utils/request";
import tool from "@/utils/tool";
import dayjs from "dayjs";

const crudRef = ref()

function getOnlineUserPageList(params:any) {
    const { x } = params;
    const rest: any = {}
  if (x) {
    rest.startDate = x[0];
    rest.endDate = x[1];
  } else {
    rest.startDate = dayjs().startOf('day').subtract(3, 'day').format('YYYY-MM-DD');
    rest.endDate = dayjs().endOf('day').format('YYYY-MM-DD');
  }
    return request({
        url: '/v1/agent/merchant/merchant-data',
        method: 'get',
        params: tool.clearParamsEmpty(rest)
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
    { title: tr('商户编号'), dataIndex: 'merchantNo', width: 160 },
    { title: tr('收款金额'), dataIndex: 'a' },
    { title: tr('收款笔数'), dataIndex: 'b' },
    { title: tr('出款金额'), dataIndex: 'c' },
    { title: tr('出款笔数'), dataIndex: 'd' },
    {
        title: tr('时间'), search: true, formType: 'range', dataIndex: 'x', hide: true, customRender: ({ record }) => {
            return record.z ? tool.dateFormat(record.z) : ''
        },
        searchDefaultValue: [dayjs().startOf('day').subtract(3, 'day').format('YYYY-MM-DD'), dayjs().endOf('day').format('YYYY-MM-DD')],
    },
    { title: tr('操作'), dataIndex: '__operation', hide: true },
])
</script>