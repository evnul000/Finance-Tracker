export function Navbar() {
  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6">
      <h1 className="text-xl font-bold">Finance Tracker</h1>

      <div>
        <button className="border rounded-md px-4 py-2">
          Profile
        </button>
      </div>
    </header>
  )
}