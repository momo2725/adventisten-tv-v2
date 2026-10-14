export const metadata = {
  title: 'Adventisten.de – Live News',
  description: 'TV news display for Adventisten.de',
}

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body style={{ margin: 0, padding: 0, background: '#000' }}>
        {children}
      </body>
    </html>
  )
}
