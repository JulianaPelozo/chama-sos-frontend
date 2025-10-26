import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import App from './App'
import theme from './styles/theme'
import './styles/index.css'


createRoot(document.getElementById('root')).render(
<React.StrictMode>
<BrowserRouter>
<MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
<App />
</MantineProvider>
</BrowserRouter>
</React.StrictMode>
)


if ('serviceWorker' in navigator) {
window.addEventListener('load', () => {
navigator.serviceWorker?.ready.then(() => {

})
})
}