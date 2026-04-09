import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { SquarePen, MoveLeft } from 'lucide-react';
import Link from 'next/link'
import { bannerAPI } from '@/lib/api'
import { BannerStatusToggle } from '@/components/modules/admin/banner-status-toggle'
import { DeleteBannerButton } from '@/components/modules/admin/delete-banner-button'

export default async function AdminBannersPage() {
    let banners: any[] = [];

    try {
        banners = await bannerAPI.getAll();
    } catch (error) {
        console.error("Failed to fetch banners:", error);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Banners</h1>
                    <p className="text-muted-foreground">
                        Manage your homepage hero carousel banners.
                    </p>
                </div>
                <Link
                    href="/admin-dashboard/banners/add"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                    Add Banner
                </Link>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-40">Preview</TableHead>
                            <TableHead>Heading / Subheading</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {banners.length > 0 ? (
                            banners.map((banner) => (
                                <TableRow key={banner.id}>
                                    <TableCell>
                                        <div className="relative h-20 w-32 overflow-hidden rounded-md border">
                                            <img
                                                src={banner.images?.[0] || '/placeholder-banner.png'}
                                                alt={banner.heading}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{banner.heading}</span>
                                            <span className="text-xs text-muted-foreground line-clamp-1">{banner.subheading}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{banner.priority}</TableCell>
                                    <TableCell>
                                        <BannerStatusToggle
                                            bannerId={banner.id}
                                            initialStatus={banner.isActive}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-3">
                                            <Link
                                                href={`/admin-dashboard/banners/edit/${banner.id}`}
                                                className="text-primary hover:text-primary/80 transition-colors"
                                            >
                                                <SquarePen className="h-4 w-4" />
                                            </Link>
                                            <DeleteBannerButton
                                                bannerId={banner.id}
                                                bannerTitle={banner.heading}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No banners found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
