import { removeCategory } from "@/actions/categories";
import { restrictPageAccess } from "@/actions/helpers/check-access";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { GrFormPrevious } from "react-icons/gr";

const deleteCategoryPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    // console.log({ id });

    await restrictPageAccess('/admin/manage-categories')


    const id = (await params).id

    if (!id) {
        redirect('/admin/manage-categories')
    }

    try {
        const data = await removeCategory(parseInt(id))
        const success = data.success
        const message = data.message
        if (success) {
            return (
                <div className="flex gap-4 flex-col h-96 w-full justify-center items-center p-5 text-center">
                    <p className="text-green-600 dark:text-green-300">
                        Category with ID: {id} Successfully deleted!
                    </p>
                    <p>
                        {message}
                    </p>
                    <Link passHref href={'/admin/manage-categories'}>
                        <Button type="button" variant={"default"} className="my-4 px-4"><GrFormPrevious /> Go To Manage Categories Section</Button>
                    </Link>
                </div>
            )
        } else {
            return (
                <div className="flex gap-4 flex-col h-96 w-full justify-center items-center p-5 text-center">
                    <p className="text-destructive">
                        Something Went Wrong!
                    </p>
                    <p>
                        {message}
                    </p>
                    <Link passHref href={'/admin/manage-categories'}>
                        <Button type="button" variant={"default"} className="my-4 px-4"><GrFormPrevious /> Go To Manage Categories Section</Button>
                    </Link>
                </div>
            )
        }
    } catch {
        return (
            <div className="flex gap-4 flex-col h-96 w-full justify-center items-center p-5 text-center">
                <p className="text-destructive">
                    Something Went Wrong!
                </p>
                <Link passHref href={'/admin/manage-categories'}>
                    <Button type="button" variant={"default"} className="my-4 px-4"><GrFormPrevious /> Go To Manage Categories Section</Button>
                </Link>
            </div>
        )

    }
}

export default deleteCategoryPage