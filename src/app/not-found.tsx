import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MoveLeft } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-background relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-700 pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse pointer-events-none" />

            <div className="relative z-10 text-center space-y-8 px-4 animate-in fade-in zoom-in duration-500">
                <div className="relative inline-block">
                    <h1 className="text-[12rem] leading-none font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-primary/80 to-primary/20 select-none opacity-50 blur-[2px]">
                        404
                    </h1>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl md:text-5xl font-bold text-foreground tracking-widest uppercase">
                        Not Found
                    </div>
                </div>

                <div className="space-y-4 max-w-md mx-auto">
                    <p className="text-muted-foreground text-lg">
                        Oops! The page you are looking for seems to have wandered off into the digital void.
                    </p>
                </div>

                <div className="pt-4">
                    <Button asChild size="lg" className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                        <Link href="/">
                            <MoveLeft className="mr-2 h-4 w-4" />
                            Return Home
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
