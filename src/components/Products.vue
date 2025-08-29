<template>
  <section id="products" class="py-16 px-8 bg-white text-center">
    <h3 class="text-3xl font-bold mb-12">Quick 系列产品</h3>
    <div class="grid md:grid-cols-3 gap-8">
      <!-- QuickMagnet - 修复点击跳转功能 -->
      <div class="p-6 border rounded-xl shadow hover:shadow-lg transition cursor-pointer" @click="goToLink('https://channel.quickso.top')">
        <h4 class="text-2xl font-bold mb-4">⚡ QuickMagnet</h4>
        <p class="mb-6 text-gray-600">网页划词、整页收藏，卡片式分享与时间线回顾。</p>
      </div>
      
      <!-- QuickTools - 修复点击跳转功能 -->
      <div class="p-6 border rounded-xl shadow hover:shadow-lg transition cursor-pointer" @click="goToLink('https://tools.quickso.top')">
        <h4 class="text-2xl font-bold mb-4">⚡ QuickTools</h4>
        <p class="mb-6 text-gray-600">常用在线工具聚合，快捷直达。</p>
      </div>
      
      <!-- QuickHabit - 鼠标悬浮在上方展示二维码 -->
      <div 
        class="p-6 border rounded-xl shadow hover:shadow-lg transition cursor-pointer relative" 
        @mouseenter="showQRCode = true"
        @mouseleave="showQRCode = false"
      >
        <!-- 二维码展示区域 - 悬浮在卡片上方 -->
        <div v-if="showQRCode" class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
          <div class="bg-white p-4 rounded-lg shadow-xl border flex flex-col items-center">
            <img src="/img/quickhabit.png" class="w-32 h-32 object-contain"/>
            <p class="mb-6 text-gray-600">扫码体验</p>
          </div>
        </div>
        <h4 class="text-2xl font-bold mb-4">⚡ QuickHabit</h4>
        <p class="mb-6 text-gray-600">简单有效的习惯追踪，轻量化自我提升。</p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Products',
  data() {
    return {
      showQRCode: false
    }
  },
  methods: {
    goToLink(url) {
      // 对于即将上线的产品，阻止跳转
      if (url.includes('example.com')) {
        return;
      }
      window.open(url, '_blank');
    }
  }
}
</script>