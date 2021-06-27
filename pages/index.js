import Link from 'next/link'
import styles from '../styles/Home.module.css'
import prisma from '../lib/prisma';
import { useState } from 'react';
import { useRouter } from 'next/router'


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
      });

      const result = await res.json()
      router.push(`/list/${result.id}`);
      setToDoLists([...toDoLists, result])
  }


  const deleteList = async(listId) => {
    let newItems = toDoLists.filter(list => list.id != listId );
    setToDoLists(newItems);

    await fetch('/api/list', {
        body: JSON.stringify({
            id: listId
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'DELETE'
    });
  }

  return (
    <>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Lists
        </h1>
        <section className={styles.section}>
          {toDoLists.map((list) => (
            <Link href={`/list/${list.id}`}>
              <div className={styles.card} key={list.id}>
                <div>
                  <h2>{list.title}</h2>
                  <p> {list.items?.length} of {list._count?.items} done</p>
                </div>

                <button onClick = {(e) => {
                    e.preventDefault();
                    deleteList(list.id);
                }}>
                    Delete
                </button>
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
    </>
  )
}
