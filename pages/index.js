import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import prisma from '../lib/prisma';
import { useState } from 'react';


export const getServerSideProps = async () => {
  const toDoLists = await prisma.todoList.findMany({
    include: {
      _count: { // all items count
        select: {
          items: true
        },
      },
      items: { // done items
        where: {
          done: true
        },
        select : {
          id: true
        }
      }
    }
  });
  return {
    props: {
      initialToDoLists: toDoLists
    }
  };
}


export default function Home({ initialToDoLists }) {
  console.log(initialToDoLists);
  const [toDoLists, setToDoLists] = useState(initialToDoLists);
  const router = useRouter();

  const createList = async(e) => {
    e.preventDefault();

    const res = await fetch('/api/list', {
        body: JSON.stringify({
            title: 'Untitled'
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST'
    })

    const result = await res.json()
    setToDoLists([...toDoLists, result])
    router.push(`/list/${result.id}`);
}

  return (
    <div className={styles.container}>
      <Head>
        <title>ToDoDo</title>
        <meta name="description" content="A simple to-do list app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          What do you want to do today?
        </h1>

        <section className={styles.section}>
          {toDoLists.map((list) => (
            <Link href={`/list/${list.id}`}>
              <div className={styles.card} key={list.id}>
                <div>
                  <h2>{list.title}</h2>
                  <p> {list.items.length} of {list._count.items} done</p>
                </div>
              </div>
            </Link>
          ))}
          <div className={styles.card} onClick={createList}>
            <div>
              <h2> + </h2>
            </div>
          </div>
        </section>
      </main>

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
