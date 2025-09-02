<!-- components/RobotIcon.vue -->
<template>
  <svg
    viewBox="0 0 240 240"
    xmlns="http://www.w3.org/2000/svg"
    class="w-full h-full"
    :class="{ 'hover:scale-105': hoverable }"
    :style="{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))' }"
    @click="handleClick"
    role="button"
    aria-label="机器人图标，可点击交互"
  >
    <defs>
      <!-- 主渐变 -->
      <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffea99" />
        <stop offset="60%" stop-color="#ffd100" />
        <stop offset="100%" stop-color="#ffbf00" />
      </linearGradient>

      <!-- 身体渐变 -->
      <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#f8fafc" />
        <stop offset="50%" stop-color="#f2f5f7" />
        <stop offset="100%" stop-color="#e6ebf0" />
      </linearGradient>

      <!-- 胸口径向渐变 -->
      <radialGradient id="coreRadial" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#1e293b" />
        <stop offset="70%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#0a0e17" />
      </radialGradient>

      <!-- 发光滤镜 -->
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="pulseGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <!-- Shadow -->
    <ellipse cx="120" cy="206" rx="46" ry="10" fill="rgba(0,0,0,0.15)" />

    <!-- Robot -->
    <g id="bot">
      <!-- Antenna -->
      <circle id="antennaLight" cx="120" cy="38" r="6" fill="url(#blueGrad)" filter="url(#pulseGlow)" />
      <rect x="118" y="44" width="4" height="8" rx="2" fill="url(#blueGrad)" />

      <!-- Head -->
      <g id="head">
        <rect x="70" y="52" width="100" height="70" rx="16" fill="#f2f5f7" stroke="#d8dee6" />
        <rect x="82" y="64" width="76" height="46" rx="10" fill="#0f172a" />
        <circle class="eye" cx="108" cy="87" r="6" :fill="eyeColor" />
        <circle class="eye" cx="132" cy="87" r="6" :fill="eyeColor" />
      </g>

      <!-- Body -->
      <g id="body">
        <rect x="88" y="120" width="64" height="60" rx="20" fill="url(#bodyGrad)" stroke="#d8dee6" />
        <circle cx="120" cy="150" r="20" fill="url(#coreRadial)" />
        <circle id="coreGlow" cx="120" cy="150" r="20" fill="url(#blueGrad)" opacity=".3" filter="url(#glow)" />
        <!-- 闪电图标，替换原来的Q图标 -->
        <path
          d="M 120,138 L 110,150 L 116,151 L 109,164 L 129,150 L 120,149 L 127,138 Z"
          fill="#ffd100"
          stroke="#ffffff"
          stroke-width="1"
        />
      </g>

      <!-- Arms -->
      <g id="leftArm">
        <rect x="60" y="118" width="26" height="16" rx="8" fill="#e9eef2" stroke="#d8dee6" />
        <circle cx="60" cy="126" r="10" fill="#f2f5f7" stroke="#d8dee6" />
        <circle cx="50" cy="126" r="8" fill="#9aa7b1" />
      </g>
      <g id="rightArm">
        <rect x="154" y="118" width="26" height="16" rx="8" fill="#e9eef2" stroke="#d8dee6" />
        <circle cx="194" cy="126" r="10" fill="#f2f5f7" stroke="#d8dee6" />
        <circle cx="204" cy="126" r="8" fill="#9aa7b1" />
      </g>

      <!-- Legs -->
      <g id="legs">
        <rect x="92" y="178" width="22" height="26" rx="8" fill="#f2f5f7" stroke="#d8dee6" />
        <rect x="126" y="178" width="22" height="26" rx="8" fill="#f2f5f7" stroke="#d8dee6" />
        <rect x="88" y="200" width="30" height="8" rx="4" fill="url(#blueGrad)" />
        <rect x="122" y="200" width="30" height="8" rx="4" fill="url(#blueGrad)" />
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  name: 'RobotIcon',
  props: {
    hoverable: { type: Boolean, default: true },
    defaultColor: { type: String, default: '#ffcc00' },
    cyanColor: { type: String, default: '#00ffff' }
  },
  data() {
    return {
      eyeColor: this.defaultColor
    }
  },
  methods: {
    handleClick() {
      this.eyeColor = this.eyeColor === this.cyanColor ? this.defaultColor : this.cyanColor
      this.$emit('click', { isCyan: this.eyeColor === this.cyanColor })
    },
    setCyanState(isCyan) {
      this.eyeColor = isCyan ? this.cyanColor : this.defaultColor
    }
  }
}
</script>

<style scoped>
/* 保留所有动画 */
#bot {
  transform-origin: 120px 170px;
  animation: breathe 3s ease-in-out infinite;
}
@keyframes breathe {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-2px) scale(1.02); }
}

.eye {
  animation: eyeglow 2.4s ease-in-out infinite, blink 6s ease-in-out infinite;
}
@keyframes eyeglow {
  0%, 100% { filter: drop-shadow(0 0 2px #ffcc00); }
  50% { filter: drop-shadow(0 0 6px #ffcc00); }
}
@keyframes blink {
  0%, 90%, 100% { r: 6; }
  95% { r: 0.5; }
}

#coreGlow {
  animation: coreglow 2.2s ease-in-out infinite;
}
@keyframes coreglow {
  0%, 100% { opacity: 0.28; }
  50% { opacity: 0.8; }
}

#rightArm {
  transform-origin: 170px 120px;
  animation: wave 2.4s ease-in-out infinite;
}
@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  40% { transform: rotate(-16deg); }
  60% { transform: rotate(6deg); }
}

#antennaLight {
  animation: pulse 2.8s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

/* 悬停效果增强 */
#bot:hover ~ #coreGlow,
#bot:hover + #coreGlow {
  opacity: 0.9;
  transition: opacity 0.3s ease;
}
</style>