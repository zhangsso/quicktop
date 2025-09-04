<template>
  <!-- 整个容器包裹按钮和面板，避免移出时马上关闭 -->
  <div
    class="fixed right-0 top-1/2 -translate-y-1/2 z-50"
    @mouseenter="openPanel"
    @mouseleave="delayedClosePanel"
  >
    <!-- 竖条按钮 -->
    <button
      type="button"
      class="bg-quickYellow text-quickBlack w-4 py-1 rounded-l-xl shadow-md hover:bg-yellow-400 transition-colors cursor-pointer select-none flex items-center justify-center"
      aria-label="@我"
    >
      <!-- 增大两字间距：line-height + 自定义 tracking -->
      <span
        class="[writing-mode:vertical-rl] [text-orientation:upright] font-semibold leading-[2] tracking-[0.1em]"
      >
        ⚡️
      </span>
    </button>

    <!-- 弹出面板 -->
    <div
      v-if="isOpen"
      class="absolute right-full top-1/2 -translate-y-1/2 mr-2 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-4 transition-all duration-300"
    >
      <div class="space-y-3">
        <!-- 微信公众号（含二维码） -->
        <div class="grid grid-cols-[40px,1fr] items-start gap-3">
          <div class="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow shrink-0">
            <img src="/img/favicon.png" alt="WeChat" class="w-5 h-5" />
          </div>
          <div>
            <p class="text-sm font-medium">扫码关注</p>
            <div class="mt-2 bg-white p-2 rounded-lg border shadow-sm inline-block">
              <img src="/img/quickhabit.png" alt="微信公众号二维码" class="w-24 h-24 block" />
            </div>
          </div>
        </div>

        <!-- GitHub -->
        <a
          href="https://github.com/your_github_repo"
          target="_blank"
          rel="noopener noreferrer"
          class="grid grid-cols-[40px,1fr] items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
        >
          <div class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shadow shrink-0">
            <img src="/img/favicon.png" alt="GitHub" class="w-5 h-5" />
          </div>
          <div>
            <p class="text-sm font-medium">GitHub</p>
            <p class="text-xs text-gray-500">https://github.com/quicksoo</p>
          </div>
        </a>

        <!-- Telegram -->
        <a
          href="https://t.me/quicksochannel"
          target="_blank"
          rel="noopener noreferrer"
          class="grid grid-cols-[40px,1fr] items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
        >
          <div class="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center shadow shrink-0">
            <img src="/img/favicon.png" alt="Telegram" class="w-5 h-5" />
          </div>
          <div>
            <p class="text-sm font-medium">Telegram</p>
            <p class="text-xs text-gray-500">@quicksochannel</p>
          </div>
        </a>

        <!-- 邮箱 -->
        <div class="grid grid-cols-[40px,1fr] items-center gap-3 p-2 rounded-lg">
          <div class="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shadow shrink-0">
            <img src="/img/favicon.png" alt="Email" class="w-5 h-5" />
          </div>
          <div>
            <p class="text-sm font-medium">邮箱</p>
            <p class="text-xs text-gray-500">quickso.top@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
let timer

const openPanel = () => {
  clearTimeout(timer)
  isOpen.value = true
}

// 延时关闭，提高容错
const delayedClosePanel = () => {
  timer = setTimeout(() => {
    isOpen.value = false
  }, 200) // 鼠标离开 0.2s 后才关闭
}
</script>
