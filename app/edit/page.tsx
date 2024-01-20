'use client';

import { deleteDoc, getDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase';
import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Todo } from '../type';
import { Layout } from '@/components/layout';

export default function Page() {
  const [todoItem, setTodoItem] = useState<Todo>({
    id: '',
    title: '',
    content: '',
    is_done: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  const path = useSearchParams();
  const specificId = path.get('id');
  const specificDocRef = doc(db, 'todos', specificId ?? '');
  const router = useRouter();

  const fetchTodoItem = async () => {
    const querySnapshot = await getDoc(specificDocRef);
    const _todoItem = {
      id: querySnapshot.id,
      title: querySnapshot.data()?.title,
      content: querySnapshot.data()?.content,
      is_done: querySnapshot.data()?.is_done,
      createdAt: querySnapshot.data()?.createdAt.toDate(),
      updatedAt: querySnapshot.data()?.updatedAt.toDate(),
    }
    setTodoItem(_todoItem)
  }

  const handleBack = async () => {
    await router.push('/')
  }

  const handleUpdateItem = async () => {
    await updateDoc(specificDocRef, {
      title: todoItem?.title,
      content: todoItem?.content,
      is_done: todoItem?.is_done,
      updatedAt: new Date(),
    })
    alert('更新しました')
  }

  const handleChangeIsDone = async (e: ChangeEvent<HTMLInputElement>) => {
    setTodoItem({
      ...todoItem!,
      is_done: e.target.checked
    })
  }

  const handleChangeTitle = async (e: ChangeEvent<HTMLInputElement>) => {
    setTodoItem({
      ...todoItem!,
      title: e.target.value
    })
  }

  const handleChangeContent = async (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTodoItem({
      ...todoItem!,
      content: e.target.value
    })
  }

  const handleDeleteItem = async () => {
    await deleteDoc(specificDocRef)
    alert(`タイトル：${todoItem.title}を削除しました`)
    handleBack()
  }

  useEffect(() => {
    fetchTodoItem()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout>
      <div className="todo-container">
        <h1>Todo App</h1>
        <div className="todo">
          <div>
            <p className="todo-label">タイトル</p>
            <input className="todo-input" value={todoItem?.title} onChange={(e) => {handleChangeTitle(e)}} />
          </div>
          <div>
            <p className="todo-label">内容</p>
            <textarea className="todo-textarea" value={todoItem?.content} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {handleChangeContent(e)}} />
          </div>
          <div className='todo-is-done'>
            <p className="form-label">完了</p>
            <input
              type="checkbox"
              className="form-checkbox"
              checked={todoItem?.is_done}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeIsDone(e)}
            />
          </div>
          <div>
            <button className="button-back" onClick={handleBack}>戻る</button>
            <button className="button-delete" onClick={handleDeleteItem}>削除</button>
            <button className="button-update" onClick={handleUpdateItem}>更新</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
