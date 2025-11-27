'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateCategoryPage() {
    revalidatePath('/category');
}
