import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

function Root() {
  useEffect(() => {
    let frame
    let lenis

    import('lenis').then(({ default: Lenis }) => {
      lenis = new Lenis({ duration: 1.2, smoothWheel: true })

      function raf(time) {
        lenis.raf(time)
        frame = requestAnimationFrame(raf)
      }
      frame = requestAnimationFrame(raf)
    })

    return () => {
      if (frame) cancelAnimationFrame(frame)
      if (lenis) lenis.destroy()
    }
  }, [])

  return <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
