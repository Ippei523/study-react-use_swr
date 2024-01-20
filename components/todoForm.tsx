type TodoFormProps = {
  title: string
  setTitle: React.Dispatch<React.SetStateAction<string>>
  content: string
  setContent: React.Dispatch<React.SetStateAction<string>>
  error: string
  setError: React.Dispatch<React.SetStateAction<string>>
  addTodo: () => void
}

export const TodoForm = (todoFormProps: TodoFormProps) => {
  const { title, setTitle, content, setContent, error, setError, addTodo } = todoFormProps

  return (
    <>
      <div>
        <p className="todo-label">タイトル</p>
        <input className="todo-input" value={title} onChange={e => setTitle(e.target.value)}/>
      </div>
      <div>
        <p className="todo-label">内容</p>
        <textarea className="todo-textarea" value={content} onChange={e => setContent(e.target.value)} />
      </div>
      <button className="todo-button" onClick={addTodo}>追加</button>
      {error !== "" && <p className="todo-error">※ {error}</p>}
    </>
  )
}
