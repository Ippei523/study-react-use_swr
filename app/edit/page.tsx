'use client'

import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { ChangeEvent, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Layout } from '@/components/layout'
import { useGetFirestoreData } from '@/hooks/firestore'
import { useSWRConfig } from 'swr'

export default function Page() {
  const path = useSearchParams()
  const specificId = path.get('id')
  const specificDocRef = doc(db, 'todos', specificId ?? '')
  const router = useRouter()
  const { data, isLoading, isError } = useGetFirestoreData(specificId ?? '')
  const { cache } = useSWRConfig();
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isDone, setIsDone] = useState(false)

  const handleBack = async () => {
    await router.push('/')
  }

  const handleUpdateItem = async () => {
    await updateDoc(specificDocRef, {
      title: title,
      content: content,
      is_done: isDone,
      updatedAt: new Date(),
    })
    alert('更新しました')
  }

  const handleChangeIsDone = (e: ChangeEvent<HTMLInputElement>) => {
    setIsDone(e.target.checked)
  }

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleChangeContent = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }

  const handleDeleteItem = async () => {
    await deleteDoc(specificDocRef)
    alert(`タイトル：${data?.title}を削除しました`)
    handleBack()
  }

  if (isLoading) return <p>loading...</p>
  if (isError) return <p>エラーが発生しました</p>

  return (
    <Layout>
      <div className="todo-container">
        <h1>Todo App</h1>
        <div className="todo">
          <div>
            <p className="todo-label">タイトル</p>
            <input className="todo-input" value={data?.title} onChange={(e) => {handleChangeTitle(e)}} />
          </div>
          <div>
            <p className="todo-label">内容</p>
            <textarea className="todo-textarea" value={data?.content} onChange={(e) => {handleChangeContent(e)}} />
          </div>
          <div className='todo-is-done'>
            <p className="form-label">完了</p>
            <input
              type="checkbox"
              className="form-checkbox"
              checked={data?.is_done}
              onChange={(e) => handleChangeIsDone(e)}
            />
          </div>
          <div>
            <button disabled={isLoading} className="button-back" onClick={handleBack}>戻る</button>
            <button disabled={isLoading} className="button-delete" onClick={handleDeleteItem}>削除</button>
            <button disabled={isLoading} className="button-update" onClick={handleUpdateItem}>更新</button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
