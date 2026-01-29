import React from 'react'

export default async function page() {
    let meals = await fetch(process.env.NEXT_PUBLIC_API_URL + '/meal', { cache: 'no-store' })
    let meal = await meals.json()
    console.log("meals:", meal);
    return (
        <div>page</div>
    )
}
