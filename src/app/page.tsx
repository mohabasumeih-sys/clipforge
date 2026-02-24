import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Wand2, Download, Sparkles, Check } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 mb-8 text-sm border border-zinc-800">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>AI-Powered Content Repurposing</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Turn One Video Into<br />30 Viral Clips
        </h1>
        
        <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
          Upload your podcast, webinar, or interview. Our AI finds the best moments, 
          adds captions, and resizes for every platform — automatically.
        </p>
        
        <div className="flex gap-4 justify-center mb-12">
          <Link href="/sign-up">
            <Button size="lg" className="bg-white text-black hover:bg-zinc-200">
              Start Free Trial
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-zinc-700">
            Watch Demo
          </Button>
        </div>
        
        <p className="text-sm text-zinc-500">No credit card required • 5 free clips</p>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-4 py-16 border-t border-zinc-900">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6">
              <Upload className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">1. Upload</h3>
              <p className="text-zinc-400">Drop your video or paste a YouTube link. We handle any format up to 2 hours.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6">
              <Wand2 className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">2. AI Magic</h3>
              <p className="text-zinc-400">Our AI transcribes, finds viral moments, and generates captions in minutes.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6">
              <Download className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">3. Download</h3>
              <p className="text-zinc-400">Get 20-30 clips optimized for TikTok, YouTube Shorts, and Instagram.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pricing */}
      <div className="container mx-auto px-4 py-16 border-t border-zinc-900">
        <h2 className="text-3xl font-bold text-center mb-4">Simple Pricing</h2>
        <p className="text-zinc-400 text-center mb-12">Start free, upgrade when you're ready</p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-zinc-400">Starter</h3>
              <div className="text-4xl font-bold my-4">$49<span className="text-lg text-zinc-500">/mo</span></div>
              <ul className="space-y-3 text-zinc-400 mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> 5 videos per month</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> 10 clips per video</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> 2 platforms</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Basic captions</li>
              </ul>
              <Link href="/sign-up" className="w-full block">
                <Button className="w-full" variant="outline">Get Started</Button>
              </Link>
            </CardContent>
          </Card>
          
          {/* Pro */}
          <Card className="bg-zinc-900 border-zinc-700 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-3 py-1 rounded-full">
              MOST POPULAR
            </div>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-zinc-400">Pro</h3>
              <div className="text-4xl font-bold my-4">$149<span className="text-lg text-zinc-500">/mo</span></div>
              <ul className="space-y-3 text-zinc-400 mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Unlimited videos</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> 30 clips per video</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> All platforms</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> AI-generated hooks</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Priority processing</li>
              </ul>
              <Link href="/sign-up" className="w-full block">
                <Button className="w-full bg-white text-black hover:bg-zinc-200">Get Started</Button>
              </Link>
            </CardContent>
          </Card>
          
          {/* Agency */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-zinc-400">Agency</h3>
              <div className="text-4xl font-bold my-4">$499<span className="text-lg text-zinc-500">/mo</span></div>
              <ul className="space-y-3 text-zinc-400 mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> 10 client accounts</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> White-label option</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> API access</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Dedicated support</li>
              </ul>
              <Link href="/sign-up" className="w-full block">
                <Button className="w-full" variant="outline">Contact Sales</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-900 py-8 text-center text-zinc-500">
        <p>© 2024 ClipForge. Built for creators, by creators.</p>
      </div>
    </div>
  );
}