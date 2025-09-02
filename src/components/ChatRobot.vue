<template>
  <div>
    <!-- 机器人图标 -->
    <!-- 机器人图标容器 -->
    <div
      ref="robotIcon"
      class="fixed right-4 z-50 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95"
      :class="{ 'animate-pulse': isChatOpen }"
      :style="{ top: `${robotPosition}px` }"
      @click="handleClick"
      @mousedown="startDrag"
      @touchstart="startDrag"
      role="button"
      aria-label="打开 AI 助手"
    >
      <!-- 机器人图标 -->
      <div class="robot-wrapper w-28 h-28 sm:w-36 sm:h-36">
        <!-- 传递 hoverable，允许悬停放大 -->
        <RobotIcon ref="robotIconComponent" :hoverable="!isChatOpen"  @click="handleRobotClick"  />
      </div>
    </div>

    <!-- 聊天对话框 -->
    <div v-if="isChatOpen" class="fixed inset-0 z-50 overflow-hidden">
      <!-- 遮罩层 -->
      <div
        class="absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300"
        @click="closeChat"
        @touchend="closeChat"
      ></div>

      <!-- 聊天窗口（右侧滑入） -->
      <div
        class="absolute top-0 right-0 w-5/6 max-w-2xl h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out"
        :class="{ 'translate-x-0': isChatOpen, 'translate-x-full': !isChatOpen }"
      >
        <div class="chat-header bg-white text-gray-800 p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-xl font-semibold flex items-center">
            <span class="mr-3">
              <RobotIcon class="w-8 h-8 sm:w-10 sm:h-10 inline-block" />
            </span>
            Quick AI CHAT
          </h3>
          <button
            @click="closeChat"
            class="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded"
            aria-label="关闭聊天"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>

        <!-- 聊天消息区域 -->
        <div class="chat-body flex-1 p-6 overflow-y-auto text-gray-500 bg-gray-50">
          <div v-for="message in messages" :key="message.id" class="mb-4" :class="{ 'text-right': message.isUser }">
            <div 
              class="inline-block max-w-xs md:max-w-md px-4 py-2 rounded-lg"
              :class="message.isUser ? 
                'bg-blue-500 text-white rounded-tr-none' : 
                'bg-white text-gray-700 rounded-tl-none border border-gray-200'"
            >
              <div class="text-sm">{{ message.text }}</div>
              <div class="text-xs mt-1" :class="message.isUser ? 'text-blue-100' : 'text-gray-400'">
                {{ formatTime(message.timestamp) }}
              </div>
            </div>
          </div>
        </div>

        <div class="chat-footer p-6 border-t border-gray-200 bg-white">
          <div class="flex">
            <input
              v-model="inputMessage"
              type="text"
              placeholder="请输入消息..."
              class="flex-1 border border-gray-300 rounded-l-lg px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              @keyup.enter="sendMessage"
              :disabled="isSending"
              aria-label="消息输入框"
            />
            <button
              @click="sendMessage"
              class="bg-blue-500 text-white px-6 py-3 rounded-r-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-base font-medium"
              :disabled="isSending || !inputMessage.trim()"
              aria-label="发送消息"
            >
              {{ isSending ? '发送中...' : '发送' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RobotIcon from './RobotIcon.vue' // 确保你已创建该组件

export default {
  name: 'ChatRobot',
  components: {
    RobotIcon
  },
  data() {
    return {
      isChatOpen: false,
      robotPosition: 300,
      isDragging: false,
      startY: 0,
      startTop: 0,
      messages: [
        {
          id: 1,
          text: "您好！我是AI助手，有什么可以帮助您的吗？",
          isUser: false,
          timestamp: new Date()
        }
      ],
      inputMessage: "",
      isSending: false
    }
  },
  mounted() {
    // 初始化位置：居中
    this.robotPosition = window.innerHeight / 2 - 40

    // 绑定全局事件
    document.addEventListener('mousemove', this.onDrag)
    document.addEventListener('mouseup', this.stopDrag)
    document.addEventListener('touchmove', this.onDrag)
    document.addEventListener('touchend', this.stopDrag)
  },
  beforeUnmount() {
    // 清理事件
    document.removeEventListener('mousemove', this.onDrag)
    document.removeEventListener('mouseup', this.stopDrag)
    document.removeEventListener('touchmove', this.onDrag)
    document.removeEventListener('touchend', this.stopDrag)
  },
  methods: {
     handleRobotClick(event) {
      // 阻止冒泡，避免重复触发 openChat
      event.stopPropagation()
      // 调用 RobotIcon 的方法改变眼睛颜色
      this.$refs.robotIconComponent.setCyanState(true)
    },
    handleClick() {
      if (this.isDragging) return
      this.isChatOpen = true
      // 可选：同步眼睛状态
      // this.$refs.robotIconComponent.setCyanState(true)
    },
    closeChat() {
      this.isChatOpen = false
      // 可选：聊天关闭后恢复默认眼睛颜色
      this.$nextTick(() => {
        this.$refs.robotIconComponent.setCyanState(false)
      })
    },
    startDrag(e) {
      e.preventDefault()

      const event = e.type === 'touchstart' ? e.touches[0] : e

      // 精确判断是否在机器人图标内拖拽
      const rect = this.$refs.robotIcon.getBoundingClientRect()
      if (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      ) {
        this.isDragging = true
        this.startY = event.clientY
        this.startTop = this.robotPosition
      }
    },
    onDrag(e) {
      if (!this.isDragging) return

      const event = e.type === 'touchmove' ? e.touches[0] : e
      const deltaY = event.clientY - this.startY
      const maxTop = window.innerHeight - 80

      this.robotPosition = Math.max(20, Math.min(this.startTop + deltaY, maxTop))
    },
    stopDrag() {
      this.isDragging = false
    },
    
    // 新增聊天相关方法
    sendMessage() {
      if (!this.inputMessage.trim() || this.isSending) return;
      
      // 添加用户消息
      const userMessage = {
        id: this.messages.length + 1,
        text: this.inputMessage,
        isUser: true,
        timestamp: new Date()
      };
      this.messages.push(userMessage);
      
      // 清空输入框
      const userMessageText = this.inputMessage;
      this.inputMessage = "";
      
      // 设置发送状态
      this.isSending = true;
      
      // 模拟AI回复延迟
      setTimeout(() => {
        this.generateAIResponse(userMessageText);
        this.isSending = false;
        // 滚动到底部
        this.$nextTick(() => {
          const chatBody = document.querySelector('.chat-body');
          if (chatBody) {
            chatBody.scrollTop = chatBody.scrollHeight;
          }
        });
      }, 1000);
    },
    
    generateAIResponse(userMessage) {
      // 模拟AI回复，从预设回复中随机选择
      const responses = [
        "感谢您的提问！这是一个很好的问题。",
        "我理解您的需求，让我为您提供更多信息。",
        "根据我的分析，您可以尝试以下解决方案...",
        "这是一个常见的问题，很多用户都遇到过。",
        "我建议您可以参考我们的文档获取更多详细信息。",
        "您的反馈对我们很重要，我们会持续改进。",
        "这个问题涉及到多个方面，让我详细为您解答。",
        "很高兴为您服务！如果您还有其他问题，请随时提问。",
        "根据您提供的信息，我认为可能的原因是...",
        "我们有专门的教程可以帮助您解决这个问题。",
        "这是一个技术性问题，让我为您提供专业的解答。",
        "感谢您使用我们的服务，希望您有良好的体验。",
        "您的问题我已经记录下来，会尽快给您更详细的回复。",
        "这个问题我们之前处理过类似的案例，解决方案是...",
        "为了更好地帮助您，您可以提供更多的信息吗？"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiMessage = {
        id: this.messages.length + 1,
        text: randomResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      this.messages.push(aiMessage);
    },
    
    formatTime(date) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }
}
</script>

<style scoped>
.robot-wrapper {
  transition: transform 0.2s ease;
}

.robot-wrapper:hover {
  transform: scale(1.1);
}

/* 响应式：小屏适配 */
@media (max-width: 768px) {
  .robot-wrapper {
    transform: scale(1.2);
  }

  .chat-header,
  .chat-footer,
  .chat-body {
    @apply p-4;
  }

  input,
  button {
    @apply py-2 text-sm;
  }
}

/* 消息气泡样式 */
.chat-body {
  display: flex;
  flex-direction: column;
}

.chat-body > div:last-child {
  margin-bottom: 0;
}
</style>