import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

const SelectResultsCount = () => {
    const router = useRouter()
    return (
        <Select onValueChange={(value) => router.push(`?page-size=${value}`)}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Results Count" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectLabel>Select Results Count</SelectLabel>
                    {[10, 20, 30, 40, 50, 100].map(n => (
                        <SelectItem key={n} value={`${n}`}>{n}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select >)
}

export default SelectResultsCount