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
      <h1 className="todo-header">Todo App</h1>
      <div className="todo">
        <div>
          <p className="todo-label">タイトル</p>
          <input className="todo-input" value={title} onChange={e => setTitle(e.target.value)}/>
        </div>
        <div>
          <p className="todo-label">内容</p>
          <textarea className="todo-textarea" value={content} onChange={e => setContent(e.target.value)} />
        </div>
        <button className="todo-button" onClick={addTodo}>追加</button>
        {error !== "" && <p className="todo-error">{error}</p>}

        <h2 className="todo-list-header">Todo一覧</h2>
        {todos.length > 0 && <div className="todo-list">
          {todos.map((todo, index) => (
            <div key={index} className='todo-item'>
              <h2 className="todo-item-title">{index + 1}. {todo.title} </h2>
              <p className="todo-item-content">{todo.content}</p>
              <div className='todo-item-actions'>
                <button className="todo-edit-button" onClick={() => {router.push(`/edit?id=${todo.id}`)}}>編集</button>
                <p className="todo-status">{todo.is_done ? "完了" : "未完"}</p>
              </div>
            </div>
          ))}
        </div>}
        {todos.length === 0 && <p className="no-todos">Todoがありません</p>}
      </div>
    </div>
  );
}
