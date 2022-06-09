import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { HelloProvider } from '../context/HelloContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <HelloProvider>
      <Component {...pageProps} />
    </HelloProvider>
  )
}

export default MyApp
