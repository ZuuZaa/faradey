import { Roboto } from 'next/font/google'
import './globals.css'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'


const roboto = Roboto({ 
  subsets: ['latin'],
  weight: ['400','500','700'] 
})

export const metadata = {
  title: 'Faradey',
  description: 'Faradey Company',
}

export default function RootLayout({ children }) {
  
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
