import React from 'react'

interface SectionHeaderProps {
    title?: string;
    subtitle?: string;
    description?: string;
}

export default function SectionHeader({ title, subtitle, description }: SectionHeaderProps) {
    return (
        <div>
            <div className="max-w-2xl mx-auto pb-10">
                <p className="mx-auto text-yellow-600 text-2xl font-semibold text-center">{subtitle}</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">{title}</h2>
                <p className="text-center text-muted-foreground text-sm sm:text-base">{description}</p>
            </div>
        </div>
    )
}
