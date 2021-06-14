// import Head from 'next/head'
// import styles from '../styles/Home.module.css'

// export default function Home() {
//   return (
//     <div className={styles.container}>
//       <Head>
//         <title>ToDoDo</title>
//         <meta name="description" content="A simple to-do list app" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <main className={styles.main}>
//         <h1 className={styles.title}>
//           What do you want to do?
//         </h1>

//         <p className={styles.description}>
//           Me? I want to create the app that lets you list down your answers to the question.
//         </p>
//         <p>
//           This might take a little while though...  
//         </p>
//       </main>

//       <footer className={styles.footer}>
//         <a
//           href="https://github.com/5a4fcf"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           A project by 5A4FCF
//         </a>
//       </footer>
//     </div>
//   )
// }
import { useState } from 'react';

const Index = () => {
  const [userInput, setUserInput] = useState('');
  const [toDoList, setToDoList] = useState([]);

  const handleChange = (e) => {
    e.preventDefault();
    setUserInput(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setToDoList([userInput, ...toDoList]);
    setUserInput('')
  }

  const handleDelete = (index) => {
    // filter out item to remove
    let updated = toDoList.filter((item, itemIndex) => itemIndex != index );
    setToDoList(updated);
  }

  return (
    <div>
      <h1> Test </h1>
      <form>
        <input type="text" value={userInput} placeholder="Enter a Todo Item" onChange={handleChange}/>
        <button onClick={handleSubmit}> Submit </button>
      </form>
      <ul>
        {
          toDoList.length >=1 ? toDoList.map((todo, index) => {
            return <li key={index}> {todo} <button onClick = {(e) => {
              e.preventDefault();
              handleDelete(index);
            }}> Delete </button> </li>
          })
          : 'Enter a todo item'
        }
      </ul>
    </div>
  )
}

export default Index;