import { useState } from 'react'

const initialExercise = { name: '', sets: '', reps: '', weight: '', duration: '', notes: '' }

export default function WorkoutForm({ onCreated }) {
  const [title, setTitle] = useState('')
  const [workoutDate, setWorkoutDate] = useState('')
  const [notes, setNotes] = useState('')
  const [exercises, setExercises] = useState([{ ...initialExercise }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const addExercise = () => setExercises([...exercises, { ...initialExercise }])
  const removeExercise = (idx) => setExercises(exercises.filter((_, i) => i !== idx))

  const updateExercise = (idx, field, value) => {
    setExercises((prev) => prev.map((ex, i) => (i === idx ? { ...ex, [field]: value } : ex)))
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const payload = {
        title: title.trim(),
        workout_date: workoutDate || null,
        notes: notes.trim() || null,
        exercises: exercises
          .filter((e) => e.name.trim())
          .map((e) => ({
            name: e.name.trim(),
            sets: e.sets ? Number(e.sets) : null,
            reps: e.reps ? Number(e.reps) : null,
            weight: e.weight ? Number(e.weight) : null,
            duration: e.duration ? Number(e.duration) : null,
            notes: e.notes ? e.notes.trim() : null,
          })),
      }

      const res = await fetch(`${baseUrl}/api/workouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to create workout')
      const data = await res.json()
      onCreated?.(data.id)

      // reset form
      setTitle('')
      setWorkoutDate('')
      setNotes('')
      setExercises([{ ...initialExercise }])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Upper Body Strength"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={workoutDate}
            onChange={(e) => setWorkoutDate(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Warm up 10 mins"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Exercises</h3>
          <button type="button" onClick={addExercise} className="text-blue-600 hover:underline">
            + Add
          </button>
        </div>

        {exercises.map((ex, idx) => (
          <div key={idx} className="rounded border p-3 bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
              <input
                placeholder="Name"
                value={ex.name}
                onChange={(e) => updateExercise(idx, 'name', e.target.value)}
                className="col-span-2 rounded border border-gray-300 p-2"
                required
              />
              <input
                type="number"
                placeholder="Sets"
                value={ex.sets}
                onChange={(e) => updateExercise(idx, 'sets', e.target.value)}
                className="rounded border border-gray-300 p-2"
                min={0}
              />
              <input
                type="number"
                placeholder="Reps"
                value={ex.reps}
                onChange={(e) => updateExercise(idx, 'reps', e.target.value)}
                className="rounded border border-gray-300 p-2"
                min={0}
              />
              <input
                type="number"
                placeholder="Weight"
                value={ex.weight}
                onChange={(e) => updateExercise(idx, 'weight', e.target.value)}
                className="rounded border border-gray-300 p-2"
                min={0}
              />
              <input
                type="number"
                placeholder="Duration (min)"
                value={ex.duration}
                onChange={(e) => updateExercise(idx, 'duration', e.target.value)}
                className="rounded border border-gray-300 p-2"
                min={0}
              />
            </div>
            <input
              placeholder="Notes (optional)"
              value={ex.notes}
              onChange={(e) => updateExercise(idx, 'notes', e.target.value)}
              className="mt-2 w-full rounded border border-gray-300 p-2"
            />
            {exercises.length > 1 && (
              <button type="button" onClick={() => removeExercise(idx)} className="mt-2 text-red-600 hover:underline">
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-blue-600 text-white py-2 font-semibold hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? 'Saving...' : 'Save Workout'}
      </button>
    </form>
  )
}
