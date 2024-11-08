import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ReactNode } from "react"
import { IoIosArrowBack } from "react-icons/io";


const GoBack = ({ link, children }: { link: string, children: ReactNode }) => {
    return <Link href={link} passHref className='my-4 inline-block'>
        <Button variant={"ghost"}>
            <IoIosArrowBack />{children}
        </Button>
    </Link>
}

export default GoBack