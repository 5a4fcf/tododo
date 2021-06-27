
import styles from '../../styles/Home.module.css'
import prisma from '../../lib/prisma';
import { useState } from 'react';
import Link from 'next/link'

export const getServerSideProps = async ({ params }) => {
    const list = await prisma.todoList.findUnique({
        where: {
            id: Number(params?.id) || -1,
        },
        include: {
            items: {
                select: {
                    content: true,
                    id: true,
                    done: true
                },
            },
        },
    })
    return {
        props: list,
    }
}

export default function List({ title, items, id }) {
    const [allItems, setItems] = useState(items);
    const [userInput, setUserInput] = useState(title);

    const handleSubmit = async(e) => {
        e.preventDefault();

        const res = await fetch('/api/item', {
            body: JSON.stringify({
                content: e.target.newItem.value,
                todoListId: id
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        })

        const result = await res.json()
        setItems([...allItems, result])
    }

    const handleChange = (e) => {
        e.preventDefault();
        setUserInput(e.target.value);
    }

    const editTitle = async(e) => {
        e.preventDefault();
        await fetch('/api/list', {
            body: JSON.stringify({
                id: id,
                title: userInput
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        });
    }

    const deleteItem = async(itemId) => {
        let newItems = allItems.filter(item => item.id != itemId );
        setItems(newItems);

        await fetch('/api/item', {
            body: JSON.stringify({
                id: itemId
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'DELETE'
        });
    }

    const updateItem = async(itemId) => {
        let item = allItems.find(item => item.id == itemId );
        item.done = !item.done;
        setItems([...allItems]);

        await fetch('/api/item', {
            body: JSON.stringify({
                id: itemId,
                done: item.done
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        });
    }

    return (
        <>
            <main className={styles.main}>
                <div>
                    <Link href="/">
                        <a className={styles.link}>Back to home</a>
                    </Link>
                    <form onSubmit={editTitle}>
                        <input
                            class={styles.form__field}
                            type="text"
                            id="listTitle"
                            name="listTitle"
                            placeholder="new"
                            value={userInput}
                            onChange={handleChange}
                            />
                    </form>
                </div>
                <section className={styles.items}>
                    {allItems.map((item) => (
                        <div
                            className={item.done ? styles['card-done'] : styles.card}
                            key={item.id}
                        >
                            <div>
                                <h2>{item.content}</h2>

                                <div>
                                    <button onClick = {(e) => {
                                        e.preventDefault();
                                        deleteItem(item.id);
                                    }}>
                                        Delete
                                    </button>
                                    <button onClick = {(e) => {
                                        e.preventDefault();
                                        updateItem(item.id);
                                    }}>
                                        {item.done ? 'Mark as undone' : 'Mark as done'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className={styles.card}>
                        <form onSubmit={handleSubmit}>
                            <input
                                class={styles.form__field}
                                type="text"
                                id="newItem"
                                name="newItem"
                                placeholder="new"
                            />
                        </form>
                    </div>
                </section>
            </main>
        </>
    )
}