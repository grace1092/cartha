'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { CreateClientForm } from '@/lib/types/database'
import { validateEmail } from '@/lib/utils'

export default function NewClientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState<CreateClientForm>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    treatment_goals: '',
    notes: '',
  })

  const handleInputChange = (field: keyof CreateClientForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setError('First name and last name are required')
      setLoading(false)
      return
    }

    if (formData.email && !validateEmail(formData.email)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('You must be logged in to create a client')
        setLoading(false)
        return
      }

      const { data, error: insertError } = await supabase
        .from('clients')
                 .insert({
           therapist_id: session.user.id,
           first_name: formData.first_name.trim(),
           last_name: formData.last_name.trim(),
           email: formData.email?.trim() || null,
           phone: formData.phone?.trim() || null,
           date_of_birth: formData.date_of_birth || null,
           emergency_contact_name: formData.emergency_contact_name?.trim() || null,
           emergency_contact_phone: formData.emergency_contact_phone?.trim() || null,
           treatment_goals: formData.treatment_goals?.trim() || null,
           notes: formData.notes?.trim() || null,
         })
        .select()
        .single()

      if (insertError) {
        setError(insertError.message)
        return
      }

      if (data) {
        router.push(`/dashboard/clients/${data.id}?created=true`)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-xl text-gray-900 mb-2">Add New Client</h1>
          <p className="body-lg text-gray-600">
            Create a new client profile with their basic information
          </p>
        </div>
        <Link href="/dashboard/clients" className="btn-secondary">
          Cancel
        </Link>
      </div>

      <div className="max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="glass-card p-6">
            <h3 className="heading-md text-gray-900 mb-6">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  id="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  className="input-modern"
                  placeholder="Enter first name"
                  required
                />
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  id="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  className="input-modern"
                  placeholder="Enter last name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="input-modern"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="input-modern"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  className="input-modern"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="glass-card p-6">
            <h3 className="heading-md text-gray-900 mb-6">Emergency Contact</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="emergency_contact_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact Name
                </label>
                <input
                  id="emergency_contact_name"
                  type="text"
                  value={formData.emergency_contact_name}
                  onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                  className="input-modern"
                  placeholder="Enter emergency contact name"
                />
              </div>

              <div>
                <label htmlFor="emergency_contact_phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact Phone
                </label>
                <input
                  id="emergency_contact_phone"
                  type="tel"
                  value={formData.emergency_contact_phone}
                  onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                  className="input-modern"
                  placeholder="Enter emergency contact phone"
                />
              </div>
            </div>
          </div>

          {/* Treatment Information */}
          <div className="glass-card p-6">
            <h3 className="heading-md text-gray-900 mb-6">Treatment Information</h3>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="treatment_goals" className="block text-sm font-medium text-gray-700 mb-2">
                  Treatment Goals
                </label>
                <textarea
                  id="treatment_goals"
                  value={formData.treatment_goals}
                  onChange={(e) => handleInputChange('treatment_goals', e.target.value)}
                  className="input-modern min-h-[100px]"
                  placeholder="Describe the client's treatment goals and objectives..."
                  rows={4}
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Notes
                </label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="input-modern min-h-[100px]"
                  placeholder="Any initial observations, intake notes, or relevant information..."
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <Link
              href="/dashboard/clients"
              className="btn-secondary order-2 sm:order-1"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={`btn-primary order-1 sm:order-2 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Creating Client...
                </div>
              ) : (
                'Create Client'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 