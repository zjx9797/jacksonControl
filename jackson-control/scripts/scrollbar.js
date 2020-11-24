script = {
  methods: {
    initScrollbar() {
      const style = document.createElement('style')
      style.type = 'text/css'
      style.appendChild(document.createTextNode(`
        body::-webkit-scrollbar {
          width: 6px;
          height: 6px;
          background-color: #000943;
        }
    
        body::-webkit-scrollbar-track {
          background-color: #000943;
        }
    
        body::-webkit-scrollbar-thumb {
          background-color: rgba(196, 196, 196, 0.65);
          border-radius: 50%;
        }
      `))
      document.getElementsByTagName('head')[0].appendChild(style)
    }
  }
}
