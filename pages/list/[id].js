
import styles from '../../styles/Home.module.css'
import prisma from '../../lib/prisma';
import { useState } from 'react';

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
        const res = await fetch('/api/list', {
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
        const res = await fetch('/api/item', {
            body: JSON.stringify({
                id: itemId
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'DELETE'
        })

        if (res) {
            let newItems = allItems.filter(item => item.id != itemId );
            setItems(newItems);
        }
    }

    const updateItem = async(itemId) => {
        let item = allItems.find(item => item.id == itemId );
        const res = await fetch('/api/item', {
            body: JSON.stringify({
                id: itemId,
                done: !item.done
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        })

        const result = await res.json()

        if (result) {
            item.done = !item.done;
            setItems([...allItems]);
        }
    }

    return (
        <div className={styles.main}>
            <h1>
                <form onSubmit={editTitle}>
                    <input
                        type="text"
                        id="listTitle"
                        name="listTitle"
                        placeholder="new"
                        value={userInput}
                        onChange={handleChange}
                    />
                </form>
            </h1>
            {allItems.map((item) => (
            <div className={item.done ? styles['card-done'] : styles.card} key={item.id}>
                <div>
                <h2>{c.content}</h2>

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
                        Done
                    </button>
                </div>
                </div>
            </div>
            ))}
            <div className={styles.card}>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        id="newItem"
                        name="newItem"
                        placeholder="new"
                    />
                </form>
            </div>
        </div>
    )
}