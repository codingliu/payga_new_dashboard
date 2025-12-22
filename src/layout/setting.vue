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
  <a-drawer
    class="backend-setting"
    v-model:visible="visible"
    :on-before-ok="save"
    width="350px"
    :ok-text="$t('sys.saveToBackend')"
    @cancel="close"
    unmountOnClose
  >
    <template #title>{{ $t('sys.backendSettingTitle') }}</template>
    <a-form :model="form" :auto-label-width="true">
      <a-form-item :label="$t('sys.i18n')" :help="$t('sys.i18nHelp')">
        <a-switch v-model="form.i18n" @change="handleI18n" />
      </a-form-item>
      <a-form-item :label="$t('sys.language')" :help="$t('sys.languageHelp')" v-if="form.i18n">
        <a-select v-model="form.language" @change="handleLanguage">
          <a-option value="zh_CN">{{ $t('sys.chinese') }}</a-option>
          <a-option value="zh_TW">{{ $t('sys.chinese_tw') }}</a-option>
          <a-option value="en">{{ $t('sys.english') }}</a-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-drawer>

</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useAppStore, useUserStore } from '@/store'
import { useI18n } from 'vue-i18n'
import 'vue-color-kit/dist/vue-color-kit.css'
import tool from "@/utils/tool";

const userStore = useUserStore()
const appStore  = useAppStore()
const { t } = useI18n()

const visible = ref(false)
const form = reactive({
  ...appStore,
})



const open = () => visible.value = true
const close = () => visible.value = false

const handleI18n = (val) => appStore.toggleI18n(val)
const handleLanguage = (val) => appStore.changeLanguage(val)


const save = async (done) => {
  const data = {
    i18n: appStore.i18n,
    language: appStore.language,
  }
  tool.local.set('setting', JSON.stringify(data))
  done(true)
}

defineExpose({ open })
</script>


