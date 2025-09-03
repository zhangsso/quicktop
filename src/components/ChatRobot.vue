<template>
  <div>
    <!-- 悬浮机器人图标 -->
    <div ref="robotIcon"
      class="fixed right-4 z-50 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95"
      :class="{ 'animate-pulse': isChatOpen }" :style="{ top: `${robotPosition}px` }" @click="handleClick"
      @mousedown="startDrag" @touchstart="startDrag" role="button" aria-label="打开 AI 助手">
      <div class="robot-wrapper w-28 h-28 sm:w-36 sm:h-36">
        <RobotIcon ref="robotIconComponent" :hoverable="!isChatOpen" @click="handleRobotClick" />
      </div>
    </div>

    <!-- 聊天窗口 -->
    <div v-if="isChatOpen" class="fixed inset-0 z-50 overflow-hidden">
      <!-- 遮罩 -->
      <div class="absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300" @click="closeChat"></div>

      <!-- 主聊天框 -->
      <div
        class="absolute top-0 right-0 w-5/6 max-w-2xl h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out"
        :class="{ 'translate-x-0': isChatOpen, 'translate-x-full': !isChatOpen }">
        <!-- header -->
        <div class="chat-header bg-white text-gray-800 p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-xl font-semibold flex items-center">
            <RobotIcon class="w-8 h-8 sm:w-10 sm:h-10 mr-2" />
            Quick AI CHAT
          </h3>
          <button @click="closeChat" class="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <!-- body -->
        <div class="chat-body flex-1 p-6 overflow-y-auto bg-gray-50">
          <div v-for="message in messages" :key="message.id" class="mb-4" :class="{ 'text-right': message.isUser }">
            <div class="inline-block max-w-xs md:max-w-md px-4 py-2 rounded-lg prose prose-sm"
              v-html="renderMarkdown(message.text)" :class="message.isUser
                ? 'bg-blue-500 text-white rounded-tr-none prose-invert'
                : 'bg-white text-gray-700 rounded-tl-none border border-gray-200'"></div>
            <div class="text-xs mt-1 text-gray-400" :class="message.isUser ? 'text-blue-300' : ''">
              {{ formatTime(message.timestamp) }}
            </div>
          </div>
        </div>

        <!-- footer -->
        <div class="chat-footer p-6 border-t border-gray-200 bg-white flex">
          <input v-model="inputMessage" type="text" placeholder="请输入消息..."
            class="flex-1 border border-gray-300 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @keyup.enter="sendMessage" :disabled="isSending" />
          <button @click="sendMessage"
            class="bg-blue-500 text-white px-6 py-3 rounded-r-lg hover:bg-blue-600 disabled:opacity-50"
            :disabled="isSending || !inputMessage.trim()">
            {{ isSending ? '发送中...' : '发送' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RobotIcon from './RobotIcon.vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css' // 你可以换成自己喜欢的主题

// 初始化 markdown-it
const md = new MarkdownIt({
  breaks: true,
  linkify: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang }).value}</code></pre>`
      } catch (__) { }
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  }
})

export default {
  name: 'ChatRobot',
  components: { RobotIcon },
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
          text: "您好！我是 **小Q**。我可以帮你写代码、画图表、解释问题。",
          isUser: false,
          timestamp: new Date()
        }
      ],
      inputMessage: "",
      isSending: false,
      chatHistory: [],
      controller: null,
      maxContextLength: 131072
    }
  },
  mounted() {
    this.robotPosition = window.innerHeight / 2 - 40
    document.addEventListener('mousemove', this.onDrag)
    document.addEventListener('mouseup', this.stopDrag)
    document.addEventListener('touchmove', this.onDrag)
    document.addEventListener('touchend', this.stopDrag)

    this.chatHistory = [
      { role: "assistant", content: "您好！我是小Q，有什么可以帮助您的吗？" }
    ]
    this.limitChatHistory()
  },
  beforeUnmount() {
    document.removeEventListener('mousemove', this.onDrag)
    document.removeEventListener('mouseup', this.stopDrag)
    document.removeEventListener('touchmove', this.onDrag)
    document.removeEventListener('touchend', this.stopDrag)
    if (this.controller) this.controller.abort()
  },
  methods: {
    renderMarkdown(text) {
      return md.render(text || "")
    },
    handleRobotClick() {
      this.$refs.robotIconComponent.setCyanState(true)
      return false
    },
    handleClick() {
      if (this.isDragging) return
      this.isChatOpen = true
    },
    closeChat() {
      this.isChatOpen = false
      this.$nextTick(() => {
        this.$refs.robotIconComponent.setCyanState(false)
      })
    },
    startDrag(e) {
      e.preventDefault()
      const event = e.type === 'touchstart' ? e.touches[0] : e
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
    async sendMessage() {
      if (!this.inputMessage.trim() || this.isSending) return
      const userMessage = {
        id: this.messages.length + 1,
        text: this.inputMessage,
        isUser: true,
        timestamp: new Date()
      }
      this.messages.push(userMessage)
      this.chatHistory.push({ role: "user", content: this.inputMessage })
      this.limitChatHistory()
      const userMessageText = this.inputMessage
      this.inputMessage = ""
      this.isSending = true

      const aiMessageId = this.messages.length + 1
      this.messages.push({
        id: aiMessageId,
        text: "",
        isUser: false,
        timestamp: new Date(),
        isGenerating: true
      })
      this.$nextTick(() => this.scrollToBottom())

      try {
        await this.fetchAIStreamResponse(aiMessageId)
      } catch (error) {
        console.error('AI响应出错:', error)
        const idx = this.messages.findIndex(m => m.id === aiMessageId)
        if (idx !== -1) {
          this.messages[idx].text = "抱歉，AI 出错了，请稍后再试。"
          this.messages[idx].isError = true
          this.messages[idx].isGenerating = false
        }
      } finally {
        this.isSending = false
      }
    },
    limitChatHistory() {
      let totalChars = this.chatHistory.reduce((s, m) => s + (m.content ? m.content.length : 0), 0)
      const maxChars = this.maxContextLength * 0.8
      while (totalChars > maxChars && this.chatHistory.length > 2) {
        const removed = this.chatHistory.splice(1, 1)[0]
        totalChars -= removed.content ? removed.content.length : 0
      }
    },
    async fetchAIStreamResponse(messageId) {
      this.controller = new AbortController()
      const signal = this.controller.signal
      this.limitChatHistory()

      const response = await fetch('https://api.quickso.top/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.chatHistory),
        signal
      })
      if (!response.ok) throw new Error(`API错误: ${response.status}`)

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let completeResponse = ''

      while (true) {
        if (signal.aborted) break
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        completeResponse += chunk

        // 打字机效果：逐字符追加
        await this.typewriterEffect(messageId, chunk)
        this.scrollToBottom()
      }

      if (completeResponse) {
        this.chatHistory.push({ role: "assistant", content: completeResponse })
        this.limitChatHistory()
        const idx = this.messages.findIndex(m => m.id === messageId)
        if (idx !== -1) this.messages[idx].isGenerating = false
      }
      this.controller = null
    },

    async typewriterEffect(messageId, text, delay = 30) {
      const idx = this.messages.findIndex(m => m.id === messageId)
      if (idx === -1) return

      for (let char of text) {
        if (this.controller?.signal.aborted) return
        this.messages[idx].text += char
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const chatBody = document.querySelector('.chat-body')
        if (chatBody) chatBody.scrollTop = chatBody.scrollHeight
      })
    },
    formatTime(date) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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

.chat-body {
  display: flex;
  flex-direction: column;
}

.chat-body>div:last-child {
  margin-bottom: 0;
}

.prose pre {
  background: #f6f8fa;
  padding: 0.75rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}

.prose code {
  background: #f6f8fa;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
}
</style>
