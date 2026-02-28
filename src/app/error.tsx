'use client';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-red-400 mb-4 font-mono text-sm max-w-lg">{error.message}</p>
        {error.digest && <p className="text-zinc-500 text-xs mb-4">Digest: {error.digest}</p>}
        <button 
          onClick={() => reset()}
          className="bg-white text-black px-4 py-2 rounded hover:bg-zinc-200"
        >
          Try again
        </button>
      </div>
    </div>
  );
}