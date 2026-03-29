'use client'

import { useActionState, useEffect } from 'react'
import { loginAction } from '@/lib/actions/auth-actions'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Package } from 'lucide-react'

// Wrap server action to match React hook signature correctly 
async function submitLogin(prevState: { error?: string } | null, formData: FormData) {
  const result = await loginAction(formData)
  if (!result.success && result.error) {
    return { error: result.error }
  }
  return null
}

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(submitLogin, null)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-pink-600" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-slate-900">
            Cozy Corner Admin
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Sign in to manage the store
          </p>
        </div>

        <form className="mt-8 space-y-6" action={formAction}>
          {state?.error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200">
              {state.error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full py-3"
              disabled={isPending}
            >
              {isPending ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
