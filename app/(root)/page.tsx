import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Terminal, Github, Mail } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative z-20 flex flex-col items-center justify-start min-h-screen overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="w-full max-w-7xl px-6 py-24 md:py-40">
        <div className="flex flex-col items-center text-center space-y-10">
          {/* Headline */}
          <div className="space-y-6 max-w-5xl">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[1.1]">
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground to-foreground/80">
                Build software
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500">
                faster together
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
              Create, collaborate, and deploy—all in your browser. No setup required.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-6">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="text-lg px-10 py-7 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 border-0 shadow-lg shadow-orange-500/25 group transition-all hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30"
              >
                Start creating
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Terminal Preview Mock */}
          <div className="mt-16 w-full max-w-5xl">
            <div className="relative rounded-2xl border border-border bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-muted-foreground font-mono">cipher-ide</span>
                </div>
              </div>
              {/* Terminal Content */}
              <div className="p-6 font-mono text-sm space-y-2 bg-gradient-to-br from-card to-muted/20">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">→</span>
                  <span className="text-muted-foreground">npx create-cipher-app my-project</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-500">✓</span>
                  <span className="text-muted-foreground">Installing dependencies...</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-500">✓</span>
                  <span className="text-muted-foreground">Setting up environment...</span>
                </div>
                <div className="flex items-center gap-2 animate-pulse">
                  <span className="text-yellow-500">◆</span>
                  <span className="text-foreground">Ready! Open http://localhost:3000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full max-w-7xl px-6 py-20 md:py-32">
        <div className="space-y-20">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              Everything you need to{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                ship faster
              </span>
            </h2>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto font-light">
              A complete development environment in your browser. No setup, no config files, just code.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Feature 1 */}
            <div className="group relative p-8 rounded-3xl border border-border bg-gradient-to-br from-card to-card/50 hover:border-orange-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2">
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-pink-500/20 flex items-center justify-center border border-orange-500/20 group-hover:border-orange-500/40 transition-colors">
                  <Terminal className="w-7 h-7 text-orange-500" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold">Code instantly</h3>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    Start coding in seconds with pre-configured environments. No downloads,
                    no installs, no configuration—just pure development.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative p-8 rounded-3xl border border-border bg-gradient-to-br from-card to-card/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2">
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-purple-500/20 group-hover:border-purple-500/40 transition-colors">
                  <Zap className="w-7 h-7 text-purple-500" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold">Blazing fast</h3>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    Powered by WebContainers for near-native speed. Hot reload,
                    fast builds, and instant previews—all in your browser.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-border/50 mt-auto bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col items-center justify-center space-y-6">
            {/* Connect with us */}
            <div className="text-center space-y-4">
              <h4 className="text-lg font-semibold text-foreground">Connect with us</h4>
              <div className="flex gap-4 justify-center">
                <Link
                  href="https://github.com/faisalljavid/"
                  className="w-12 h-12 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all hover:scale-110"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </Link>
                <Link
                  href="mailto:faisalljavid@gmail.com"
                  className="w-12 h-12 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all hover:scale-110"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}