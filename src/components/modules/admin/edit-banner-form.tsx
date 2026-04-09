"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { bannerAPI } from "@/lib/api"
import ImageUpload from "@/components/common/ImageUpload"

const formSchema = z.object({
    heading: z.string().min(2, "Heading must be at least 2 characters."),
    subheading: z.string().min(2, "Subheading must be at least 2 characters."),
    shortDescription: z.string().min(10, "Description must be at least 10 characters."),
    buttonText: z.string().min(2, "Button text must be at least 2 characters."),
    url: z.string().url("Please enter a valid URL."),
    image: z.string().min(1, "Banner image is required."),
    priority: z.coerce.number().int().nonnegative().default(0),
})

interface EditBannerFormProps {
    bannerId: string;
}

export function EditBannerForm({ bannerId }: EditBannerFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const router = useRouter()

    const form = useForm<any>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            heading: "",
            subheading: "",
            shortDescription: "",
            url: "",
            buttonText: "",
            image: "",
            priority: 0,
        },
    })

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const banner: any = await bannerAPI.getById(bannerId);
                form.reset({
                    heading: banner.heading,
                    subheading: banner.subheading,
                    shortDescription: banner.shortDescription,
                    url: banner.url,
                    buttonText: banner.buttonText,
                    image: banner.images?.[0] || "",
                    priority: banner.priority,
                });
            } catch (error) {
                console.error("Error fetching banner:", error)
                toast.error("Failed to load banner data")
            } finally {
                setIsFetching(false)
            }
        }

        fetchBanner()
    }, [bannerId, form])

    async function onSubmit(values: any) {
        setIsLoading(true)
        try {
            const submitData = {
                ...values,
                images: [values.image]
            }
            await bannerAPI.update(bannerId, submitData);
            toast.success(`Banner updated successfully`)
            router.push("/admin-dashboard/banners")
            router.refresh()
        } catch (error: any) {
            console.error("Error updating banner:", error)
            toast.error(error.message || "An error occurred while updating the banner")
        } finally {
            setIsLoading(false)
        }
    }

    if (isFetching) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Edit Banner</CardTitle>
                <CardDescription>
                    Update the details for this homepage banner.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="heading"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Heading</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Prime Sizzling Steaks" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="subheading"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subheading</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. The Ultimate Steakhouse Experience" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="shortDescription"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Short Description</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="Enter a brief description of the offer..." 
                                            className="resize-none"
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="buttonText"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Button Text</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Order Now" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Target URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. /menu or /meals/id" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Priority</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormDescription>Higher numbers appear first.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Banner Image</FormLabel>
                                    <FormControl>
                                        <ImageUpload
                                            onUploadComplete={(url) => field.onChange(url)}
                                            defaultValue={field.value}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Recommended size: 1920x1080px for best results.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/admin-dashboard/banners")}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update Banner
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
