import { useEffect, useState } from 'react'

export default function WorkoutList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${baseUrl}/api/workouts`)
      if (!res.ok) throw new Error('Failed to load workouts')
      const data = await res.json()
      setItems(data.items || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const remove = async (id) => {
    if (!confirm('Delete this workout?')) return
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${baseUrl}/api/workouts/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setItems((prev) => prev.filter((i) => i.id !== id))
    } catch (e) {
      alert(e.message)
    }
  }

  if (loading) return <p className="text-gray-600">Loading...</p>
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="text-gray-500">No workouts yet. Add your first!</p>}
      {items.map((w) => (
        <div key={w.id} className="rounded border p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold">{w.title}</p>
            <p className="text-sm text-gray-600">
              {w.workout_date ? new Date(w.workout_date).toLocaleDateString() : 'No date'}
            </p>
          </div>
          <button onClick={() => remove(w.id)} className="text-red-600 hover:underline">Delete</button>
        </div>
      ))}
    </div>
  )
}
