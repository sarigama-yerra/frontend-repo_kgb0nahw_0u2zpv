import { useState } from 'react'
import WorkoutForm from './components/WorkoutForm'
import WorkoutList from './components/WorkoutList'

function App() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      <header className="bg-white/70 backdrop-blur sticky top-0 z-10 border-b">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Fitness Notes</h1>
          <a href="/test" className="text-sm text-blue-600 hover:underline">Check backend</a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 grid gap-8 md:grid-cols-2">
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Create Workout</h2>
          <WorkoutForm onCreated={() => setRefreshKey((k) => k + 1)} />
        </section>

        <section key={refreshKey} className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Your Workouts</h2>
          <WorkoutList />
        </section>
      </main>
    </div>
  )
}

export default App
