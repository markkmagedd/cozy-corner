"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes("@")) {
      setStatus("error")
      return
    }

    setStatus("loading")
    // Mimic backend processing
    setTimeout(() => {
      setStatus("success")
      setEmail("")
    }, 1000)
  }

  return (
    <section className="py-24 bg-primary text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-linear-to-b from-black/20 to-transparent pointer-events-none" />
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold sm:text-4xl">Join the Explorer's Club</h2>
          <p className="mt-4 text-lg text-slate-300">
            Subscribe to receive updates on new arrivals, exclusive offers, and stories from the field.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => {
                   setEmail(e.target.value)
                   if (status === "error") setStatus("idle")
                }}
                className="h-12 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:bg-white/20 transition-all rounded-lg"
              />
              {status === "error" && (
                <p className="mt-2 text-sm text-red-400 text-left">Please enter a valid email address.</p>
              )}
            </div>
            <Button 
              type="submit" 
              disabled={status === "loading" || status === "success"}
              className="h-12 px-8 bg-accent text-accent-content hover:bg-accent/90 disabled:opacity-50 transition-all rounded-lg font-semibold"
            >
              {status === "loading" ? "Joining..." : status === "success" ? "Subscribed!" : "Subscribe"}
            </Button>
          </form>

          {status === "success" && (
            <p className="mt-4 text-sm text-accent animate-bounce">
              Welcome to the club! Check your inbox soon.
            </p>
          )}

          <p className="mt-6 text-xs text-slate-400">
            By subscribing, you agree to our Privacy Policy and Terms of Service.
          </p>
        </div>
      </div>
    </section>
  )
}
