'use client'
import { useRouter } from 'next/navigation'
import { SetStateAction, useEffect, useState } from 'react'
import { addDoc, collection, query, orderBy, getDocs } from 'firebase/firestore'
import { db } from './firebase'
import { Todo } from './type'
import { Layout } from '@/components/layout'
import { TodoForm } from '@/components/todoForm'

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

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
    const q = query(collection(db, 'todos'), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
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
  }, [])

  return (
    <Layout>
      <div className="todo-container">
        <h1 className="todo-header">Todo App</h1>
        <div className="todo">
          <TodoForm
            title={title}
            setTitle={setTitle}
            content={content}
            setContent={setContent}
            error={error}
            setError={setError}
            addTodo={addTodo}
          />

          <h2 className="todo-list-header">Todo一覧</h2>
          <table className="todo-table">
            <tbody>
              {todos.map((todo, index) => (
                <tr key={index}>
                  <td>{todo.title}</td>
                  <td className='todo-content'>{todo.content}</td>
                  <td className='todo-item-actions'>
                    <button className="todo-edit-button" onClick={() => {router.push(`/edit?id=${todo.id}`)}}>編集</button>
                    <p className="todo-status">{todo.is_done ? "完了" : "未完"}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {todos.length === 0 && <p className="no-todos">Todoがありません</p>}
        </div>
      </div>
    </Layout>
  )
}
