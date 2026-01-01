import TaskCard from "./TaskCard";

export default function TaskList({ tasks = [], onEdit, onRefresh }) {
  if (!tasks.length) return <p>No tasks yet</p>;

  return (
    <div className="task-grid">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
}
