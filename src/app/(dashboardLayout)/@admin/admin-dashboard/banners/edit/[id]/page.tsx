import React from 'react'
import { EditBannerForm } from '@/components/modules/admin/edit-banner-form'
import { MoveLeft } from 'lucide-react'
import Link from 'next/link'

export default async function EditBannerPage({ params }: { params: { id: string } }) {
  const { id } = await params;
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
          <h1 className="text-2xl font-bold tracking-tight">Edit Banner</h1>
          <p className="text-muted-foreground">
            Make changes to your homepage banner.
          </p>
        </div>
      </div>

      <EditBannerForm bannerId={id} />
    </div>
  )
}
