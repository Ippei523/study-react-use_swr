export default function Home() {
  return (
    <div className="todo-container">
      <h1>Todo App</h1>
      <div className="todo">
        <div>
          <p>タイトル</p>
          <input/>
        </div>
        <div>
          <p>内容</p>
          <textarea/>
        </div>
        <button>追加</button>
      </div>
    </div>
  );
}
