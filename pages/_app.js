import '../styles/globals.css'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

function MyApp({ Component, pageProps }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>ToDoDo</title>
        <meta name="description" content="A simple to-do list app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
      <footer className={styles.footer}>
        <a
          href="https://github.com/5a4fcf"
          target="_blank"
          rel="noopener noreferrer"
        >
          A project by 5A4FCF
        </a>
      </footer>
    </div>
  )
}

export default MyApp
