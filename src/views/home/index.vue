<template>
  <div class="h-[100vh] w-[100vw] flex justify-center items-center">
    <div class="max-w-7xl m-auto flex h-[90vh] w-full">
      <n-card>
        <div class="text-center">
          <h1>ChatGPT-Midjourney V2 Test</h1>
        </div>
        <n-space align="center" justify="center" vertical size="large">
          <n-input
              type="password"
              show-password-on="mousedown"
              placeholder="访问密码"
              :maxlength="8"
          />
          <n-button type="primary" secondary>立即进入</n-button>
        </n-space>
      </n-card>
    </div>
  </div>
</template>
<script lang="ts" setup>
</script>