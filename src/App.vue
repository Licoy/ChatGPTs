<template>
  <n-config-provider class="h-full" :locale="zhCN" :date-locale="dateZhCN" :theme-overrides="themeOverrides"
                     :theme="theme" :style="_style"
                     :class="`global-theme-${us.darkMode ? 'dark':'light'}`">
    <n-loading-bar-provider>
      <n-message-provider>
        <n-dialog-provider>
          <div id="app-main" :class="{dark:us.darkMode}">
            <router-view></router-view>
          </div>
        </n-dialog-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>
<script setup lang="ts">
import {zhCN, dateZhCN, GlobalThemeOverrides} from 'naive-ui'
import {computed, onMounted} from "vue";
import {darkTheme} from 'naive-ui'
import {useGlobalStore} from "@/store/global";
import {useUserStore} from "@/store/user";

const gs = useGlobalStore()
const us = useUserStore()

const themeOverrides = computed((): GlobalThemeOverrides => {
  const boxColor = us.darkMode ? "#1d273b" : "#fff"
  return {
    common: {
      primaryColor: '#7848f1',
      primaryColorHover: '#7148dc',
      primaryColorPressed: '#6836e3',
      primaryColorSuppl: '#6836e3',
      infoColor: '#0573df',
      borderRadius: '6px',
      bodyColor: us.darkMode ? "#1a2234" : "#f1f5f9",
      cardColor: boxColor,
      modalColor: boxColor,
      popoverColor: us.darkMode ? "#273651" : "#fff",
    },
    Input: {
      textColorDisabled: us.darkMode ? "#aaaaaa" : "#2d2d2d",
      borderFocus: "1px solid #7848f1",
      borderHover: "1px solid #7848f1",
    },
    Button: {
      iconSizeMedium: '15px',
      iconSizeTiny: '12px',
      iconSizeSmall: '13px'
    }
  }
})

const _style = computed(()=>{
  const res = [
      `--aa-c-primary: ${themeOverrides.value.common.primaryColor}`,
  ]
  if(us.darkMode){
    res.push(`--aa-c-primary-low: #2b2054`)
  }else{
    res.push(`--aa-c-primary-low: #ede4fe`)
  }
  return res.join(';')
})

const theme = computed(() => {
  us.bodyColorModeClassSync()
  if (us.darkMode) {
    return darkTheme
  } else {
    return undefined
  }
})

const watchWindowWidth = () => {
  gs.mobile = window.innerWidth < 768
}
window.addEventListener('resize', watchWindowWidth)
watchWindowWidth()

const media = window.matchMedia('(prefers-color-scheme: dark)');
us._sysDarkMode = media.matches;
let callback = (e) => {
  us._sysDarkMode = e.matches;
};
if (typeof media.addEventListener === 'function') {
  media.addEventListener('change', callback);
} else if (typeof media.addListener === 'function') {
  media.addListener(callback);
}

</script>
<style lang="scss">
@import "style/init.scss";
</style>
