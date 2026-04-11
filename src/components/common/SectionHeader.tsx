import React from 'react'
import { FadeInUp } from './MotionWrapper';

interface SectionHeaderProps {
    title?: string;
    subtitle?: string;
    description?: string;
}

export default function SectionHeader({ title, subtitle, description }: SectionHeaderProps) {
    return (
        <FadeInUp>
            <div className="max-w-2xl mx-auto pb-6 md:pb-8">
                <p className="mx-auto text-yellow-600 text-lg sm:text-xl lg:text-2xl font-semibold text-center italic">{subtitle}</p>
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-center mb-3 sm:mb-4">{title}</h2>
                <p className="text-center text-muted-foreground text-xs sm:text-sm lg:text-base leading-relaxed">{description}</p>
            </div>
        </FadeInUp>
    )
}
