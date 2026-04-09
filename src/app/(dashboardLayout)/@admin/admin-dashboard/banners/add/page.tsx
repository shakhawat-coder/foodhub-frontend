import React from 'react'
import { AddBannerForm } from '@/components/modules/admin/add-banner-form'
import { MoveLeft } from 'lucide-react'
import Link from 'next/link'

export default function AddBanner() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/admin-dashboard/banners"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <MoveLeft className="h-4 w-4" />
            </Link>
            <span className="text-sm text-muted-foreground">Back to Banners</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Add New Banner</h1>
          <p className="text-muted-foreground">
            Create a new banner for your homepage carousel.
          </p>
        </div>
      </div>

      <AddBannerForm />
    </div>
  )
}
