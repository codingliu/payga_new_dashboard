import { nextTick } from 'vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from '@/router'
import { useTagStore, useKeepAliveStore } from '@/store'
import tool from '@/utils/tool'
import i18n from '@/i18n'

export const refreshTag = () => {
  const route = router.currentRoute.value
  const keepStore = useKeepAliveStore()
  NProgress.start()
  keepStore.removeKeepAlive(route)
  keepStore.hidden()
  nextTick(() => {
    keepStore.addKeepAlive(route)
    keepStore.display()
    NProgress.done()
  })
}

export const addTag = (tag) => {
  const tagStore  = useTagStore()
  const keepStore = useKeepAliveStore()
  tagStore.addTag(tag)
  keepStore.addKeepAlive(tag)
}

export const closeTag = (tag) => {
  const tagStore  = useTagStore()
  const keepStore = useKeepAliveStore()
  const t = tagStore.removeTag(tag)
  keepStore.removeKeepAlive(tag)
  router.push({ path: t.path, query: tool.getRequestParams(t.path) })
}

/**
 * 多语言翻译
 * @param langString
 */
export function tr(langString) {
  return i18n.global.t(`all.${langString}`);
}
