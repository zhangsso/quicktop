module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js}"],
  theme: {
    extend: {
      colors: {
        quickYellow: "#FFD600",
        quickBlack: "#1E1E1E",
        quickGray: "#FAFAFA",
      },
       width: {
        '10': '40px', // 添加 w-10 对应 40px
      },
      height: {
        '10': '40px', // 添加 h-10 对应 40px
      }
    }
  },
  plugins: []
}
