import { UserButton } from "@clerk/nextjs";

export default function Dashboard() {
  return (
    <div style={{ background: 'black', color: 'white', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>ClipForge Dashboard</h1>
        <UserButton />
      </div>
      <p>Welcome! Upload your first video to get started.</p>
    </div>
  );
}