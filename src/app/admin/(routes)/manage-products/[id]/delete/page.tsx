import { deleteProduct } from "@/actions/products";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { GrFormPrevious } from "react-icons/gr";


const deleteProductPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    // console.log({ id });

    const id = (await params).id

    if (!id) {
        redirect('/admin/manage-products')
    }
    try {
        const { success, message } = await deleteProduct(parseInt(id))
        if (success) {
            return (
                <div className="flex gap-4 flex-col h-96 w-full justify-center items-center p-5 text-center">
                    <p className="text-green-600 dark:text-green-300">
                        Product with ID: {id} Successfully deleted!
                    </p>
                    <p>
                        {message}
                    </p>
                    <Link passHref href={'/admin/manage-products'}>
                        <Button type="button" variant={"default"} className="my-4 px-4"><GrFormPrevious /> Go To Manage Products Section</Button>
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
                    <Link passHref href={'/admin/manage-products'}>
                        <Button type="button" variant={"default"} className="my-4 px-4"><GrFormPrevious /> Go To Manage Products Section</Button>
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
                <Link passHref href={'/admin/manage-products'}>
                    <Button type="button" variant={"default"} className="my-4 px-4"><GrFormPrevious /> Go To Manage Products Section</Button>
                </Link>
            </div>
        )

    }
}

export default deleteProductPage