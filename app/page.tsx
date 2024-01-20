'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import { addDoc, collection, query, orderBy, getDocs } from 'firebase/firestore'
import { db } from './firebase';
import { Todo } from './type';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const router = useRouter();

  const addTodo = async () => {
    if (!title || !content) {
      setError("タイトルと内容を入力してください")
      return
    }

    await addDoc(collection(db, 'todos'), {
      title: title,
      content: content,
      is_done: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    setTitle('')
    setContent('')
    setError('')

    fetchTodos()
  }

  const fetchTodos = async () => {
    const q = query(collection(db, 'todos'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const _todos = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      content: doc.data().content,
      is_done: doc.data().is_done,
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    }))
    setTodos(_todos)
  }

  useEffect(() => {
    fetchTodos()
  }, []);

  return (
    <div className="todo-container">
      <h1>Todo App</h1>
      <div className="todo">
        <div>
          <p>タイトル</p>
          <input value={title} onChange={e => setTitle(e.target.value)}/>
        </div>
        <div>
          <p>内容</p>
          <textarea value={content} onChange={e => setContent(e.target.value)} />
        </div>
        <button onClick={addTodo}>追加</button>
        {error !== "" && <p>{error}</p>}

        <h2>Todo一覧</h2>
        {
          todos.length > 0 && <div className="todo-list">
            {todos.map((todo, index) => (
              <div key={index} className='todo-item'>
                <h2>{index + 1}. {todo.title} </h2>
                <p>{todo.content}</p>
                <div>
                  <button onClick={() => {router.push(`/edit?id=${todo.id}`)}}>編集</button>
                  <p>{todo.is_done && "完了"}</p>
                </div>
              </div>
            ))}
          </div>
        }
        {todos.length === 0 && <p>Todoがありません</p>}
      </div>
    </div>
  );
}
