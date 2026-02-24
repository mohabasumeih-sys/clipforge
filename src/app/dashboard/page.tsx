import { UserButton } from "@clerk/nextjs";
import UploadForm from "@/components/ui/UploadForm";

export default function Dashboard() {
  return (
    <div style={{ background: 'black', color: 'white', padding: '20px', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>ClipForge Dashboard</h1>
        <UserButton afterSignOutUrl="/" />
      </div>
      
      <p>Welcome! Upload your first video to get started.</p>
      
      <UploadForm />
    </div>
  );
}