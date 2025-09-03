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
              <div class="text-sm">
                {{ message.text }}
                <span v-if="message.isGenerating" class="typing-indicator">
                  <span class="dot"></span>
                  <span class="dot"></span>
                  <span class="dot"></span>
                </span>
              </div>
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
          text: "您好！我是小Q，有什么可以帮助您的吗？",
          isUser: false,
          timestamp: new Date()
        }
      ],
      inputMessage: "",
      isSending: false,
      // 用于存储对话历史
      chatHistory: [],
      // 用于存储当前正在生成的消息
      currentGeneratingMessage: "",
      // 用于存储流式响应的控制器，以便于取消请求
      controller: null,
      // AI最大上下文长度限制（token数）
      maxContextLength: 131072 // 128K tokens
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

    // 初始化聊天历史
    this.chatHistory = [
      {
        role: "assistant",
        content: "您好！我是小Q，有什么可以帮助您的吗？"
      }
    ]
    // 限制聊天历史长度
    this.limitChatHistory();
  },
  beforeUnmount() {
    // 清理事件
    document.removeEventListener('mousemove', this.onDrag)
    document.removeEventListener('mouseup', this.stopDrag)
    document.removeEventListener('touchmove', this.onDrag)
    document.removeEventListener('touchend', this.stopDrag)

    // 如果有正在进行的请求，取消它
    if (this.controller) {
      this.controller.abort();
    }
  },
  methods: {
    handleRobotClick() {
      // 简化方法，不使用事件参数，只改变眼睛颜色
      // 这样在本地和Vercel都能正常工作
      this.$refs.robotIconComponent.setCyanState(true)
      
      // 防止冒泡的另一种方式，通过返回false
      return false;
    },
    handleClick() {
      if (this.isDragging) return
      this.isChatOpen = true
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
    
    // 修改聊天相关方法
    async sendMessage() {
      if (!this.inputMessage.trim() || this.isSending) return;
      
      // 添加用户消息
      const userMessage = {
        id: this.messages.length + 1,
        text: this.inputMessage,
        isUser: true,
        timestamp: new Date()
      };
      this.messages.push(userMessage);
      
      // 更新聊天历史
      this.chatHistory.push({
        role: "user",
        content: this.inputMessage
      });
      this.limitChatHistory();
      
      // 清空输入框
      const userMessageText = this.inputMessage;
      this.inputMessage = "";
      
      // 设置发送状态
      this.isSending = true;
      
      // 创建一个占位AI消息
      const aiMessageId = this.messages.length + 1;
      this.currentGeneratingMessage = "";
      const aiMessage = {
        id: aiMessageId,
        text: this.currentGeneratingMessage,
        isUser: false,
        timestamp: new Date(),
        isGenerating: true // 标记为正在生成中
      };
      this.messages.push(aiMessage);
      
      // 滚动到底部
      this.$nextTick(() => {
        this.scrollToBottom();
      });
      
      // 调用AI接口获取流式响应
      try {
        await this.fetchAIStreamResponse(aiMessageId);
      } catch (error) {
        console.error('获取AI响应出错:', error);
        
        // 更新消息为错误状态
        const messageIndex = this.messages.findIndex(m => m.id === aiMessageId);
        if (messageIndex !== -1) {
          this.messages[messageIndex].text = "抱歉，我遇到了一些问题，请稍后再试。";
          this.messages[messageIndex].isError = true;
          this.messages[messageIndex].isGenerating = false;
        }
      } finally {
        // 无论成功与否，都设置发送状态为false
        this.isSending = false;
      }
    },
    
    // 限制聊天历史记录长度，防止超出AI上下文限制
    limitChatHistory() {
      // 计算当前聊天历史的总字符数
      let totalChars = this.chatHistory.reduce((sum, msg) => sum + (msg.content ? msg.content.length : 0), 0);
      
      // 如果总字符数超过了最大上下文长度的某个比例（例如80%），则开始删除旧的消息
      const maxChars = this.maxContextLength * 0.8; // 使用80%作为安全边界
      
      while (totalChars > maxChars && this.chatHistory.length > 2) {
        // 保留第一条欢迎消息，从第二条开始删除
        const removedMsg = this.chatHistory.splice(1, 1)[0];
        totalChars -= removedMsg.content ? removedMsg.content.length : 0;
      }
    },
    
    // 调用API获取流式响应
    async fetchAIStreamResponse(messageId) {
      // 创建一个AbortController，用于取消请求
      this.controller = new AbortController();
      const signal = this.controller.signal;
      
      // 限制聊天历史记录长度
      this.limitChatHistory();
      
      try {
        const response = await fetch('https://api.quickso.top/api/chat/stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.chatHistory),
          signal // 传递信号，以便可以取消请求
        });
        
        if (!response.ok) {
          throw new Error(`API请求失败: ${response.status}`);
        }
        
        // 获取响应的reader
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        // 创建一个新的消息对象
        let completeResponse = '';
        
        // 使用无限循环读取流数据
        while (true) {
          // 检查是否被取消
          if (signal.aborted) {
            break;
          }
          
          // 读取一个数据块
          const { done, value } = await reader.read();
          
          // 如果done为true，表示流已经结束
          if (done) {
            break;
          }
          
          // 解码数据并添加到响应中
          const chunk = decoder.decode(value, { stream: true });
          completeResponse += chunk;
          
          // 更新当前生成的消息
          const messageIndex = this.messages.findIndex(m => m.id === messageId);
          if (messageIndex !== -1) {
            this.messages[messageIndex].text = completeResponse;
          }
          
          // 滚动到底部
          this.scrollToBottom();
        }
        
        // 更新聊天历史
        if (completeResponse) {
          this.chatHistory.push({
            role: "assistant",
            content: completeResponse
          });
          
          // 限制聊天历史长度
          this.limitChatHistory();
          
          // 更新消息状态
          const messageIndex = this.messages.findIndex(m => m.id === messageId);
          if (messageIndex !== -1) {
            this.messages[messageIndex].isGenerating = false;
          }
        }
        
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('请求被取消');
        } else {
          throw error;
        }
      } finally {
        this.controller = null;
      }
    },
    
    // 滚动到底部
    scrollToBottom() {
      this.$nextTick(() => {
        const chatBody = document.querySelector('.chat-body');
        if (chatBody) {
          chatBody.scrollTop = chatBody.scrollHeight;
        }
      });
    },
    
    // 格式化时间
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

/* 输入指示器动画 */
.typing-indicator {
  display: inline-flex;
  align-items: center;
  margin-left: 5px;
}

.dot {
  width: 5px;
  height: 5px;
  margin: 0 1px;
  background-color: currentColor;
  border-radius: 50%;
  opacity: 0.6;
  animation: typing 1.5s infinite ease-in-out;
}

.dot:nth-child(2) {
  animation-delay: 0.3s;
}

.dot:nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes typing {
  0%, 100% { transform: translateY(0px); opacity: 0.6; }
  50% { transform: translateY(-2px); opacity: 1; }
}
</style>