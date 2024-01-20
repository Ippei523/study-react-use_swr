'use client';

import { collection, query, where, getDoc, doc } from 'firebase/firestore'
import { db } from '../firebase';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Todo } from '../type';

export default function Page() {
  const [todoItem, setTodoItem] = useState<Todo>()
  const path = useSearchParams();
  const specificId = path.get('id');

  const fetchTodoItem = async () => {
    const querySnapshot = await getDoc(doc(db, 'todos', specificId ?? ''));
    console.log(querySnapshot)
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

  useEffect(() => {
    fetchTodoItem()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="todo-container">
      <h1>Todo App</h1>
      <div className="todo">
        <div>
          <p>タイトル</p>
          <input value={todoItem?.title}/>
        </div>
        <div>
          <p>内容</p>
          <textarea value={todoItem?.content}/>
        </div>
        <button>追加</button>
      </div>
    </div>
  );
}