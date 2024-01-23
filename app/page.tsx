'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { addDoc, collection } from 'firebase/firestore'
import { db } from './firebase'
import { Todo } from './type'
import { Layout } from '@/components/layout'
import { TodoForm } from '@/components/todoForm'
import { useGetFirestoreAllData } from '@/hooks/firestore'
import { useSWRConfig } from 'swr'

export default function Home() {
  const [todoList, setTodoList] = useState<Todo[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const { cache } = useSWRConfig()

  const { data, isLoading, isError } = useGetFirestoreAllData()

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
  }

  useEffect(() => {
    if (!data) return
    setTodoList(data)
  }, [cache, data])

  if (isLoading) return <p>loading...</p>
  if (isError) return <p>{isError}</p>

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
          {
            todoList.length > 0 && <table className="todo-table">
              <tbody>
                {todoList?.map((todo, index) => (
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
          }
          {todoList?.length === 0 && <p className="no-todos">Todoがありません</p>}
        </div>
      </div>
    </Layout>
  )
}
