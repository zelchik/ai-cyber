'use client'

import { useEffect, useState } from "react"

type Task = {
  id: string
  title: string
  completed: boolean
  createdAt: string
}


export default function TasksPage() {

  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)


  async function loadTasks() {

    try {

      const res = await fetch("/api/tasks")

      const data = await res.json()

      setTasks(data)

    } catch (error) {

      console.error(error)

    } finally {

      setLoading(false)

    }

  }


async function toggleTask(id: string, completed: boolean) {
  await fetch(`/api/tasks/${id}`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      completed,
    }),
  })

  loadTasks()
}

async function deleteTask(id: string) {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "DELETE",
  })

  if (!res.ok) {
    console.error("Не вдалося видалити задачу")
    return
  }

  setTasks((prev) => prev.filter((task) => task.id !== id))
}

useEffect(() => {
  loadTasks()
}, [])


  return (

    <div
      style={{
        padding: "24px",
        maxWidth: "480px",
        margin: "0 auto"
      }}
    >

      <div
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--text-secondary)",
          letterSpacing: "0.08em",
          marginBottom: "24px"
        }}
      >
        //: МОДУЛЬ ЗАВДАНЬ
      </div>


      {loading && (

        <div style={{color:"var(--text-muted)"}}>
          Завантаження...
        </div>

      )}


      {!loading && tasks.length === 0 && (

        <div style={{color:"var(--text-muted)"}}>
          Немає завдань
        </div>

      )}



      {tasks.map((task) => (

        <div
          key={task.id}
          className="card-cyber"
          style={{
            marginBottom:"12px"
          }}
        >
<div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "8px",
  }}
>
  <button
    onClick={() => deleteTask(task.id)}
    style={{
      background: "rgba(220, 38, 38, 0.12)",
      border: "1px solid #dc2626",
      borderRadius: "8px",
      color: "#ef4444",
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      fontWeight: 600,
      padding: "5px 8px",
      cursor: "pointer",
      transition: "all 0.2s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "#dc2626"
      e.currentTarget.style.color = "#ffffff"
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "rgba(220, 38, 38, 0.12)"
      e.currentTarget.style.color = "#ef4444"
    }}
  >
    🗑 ВИДАЛИТИ
  </button>
</div>
          <div
            style={{
              color:"var(--text-primary)",
              fontSize:"15px"
            }}
          >
            {task.title}
          </div>



          <div
            style={{
              color:"var(--text-secondary)",
              fontSize:"12px",
              marginTop:"8px"
            }}
          >

            <button

              onClick={() => 
                toggleTask(
                  task.id,
                  !task.completed
                )
              }

              style={{
                background:"transparent",
                border:"none",
                color:"var(--accent)",
                cursor:"pointer",
                padding:0
              }}

            >

              {task.completed 
                ? "✓ Виконано" 
                : "○ Активне"
              }

            </button>

          </div>


        </div>

      ))}


    </div>

  )

}