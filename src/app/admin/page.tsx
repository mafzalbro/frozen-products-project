import { verifyUser } from "@/actions/auth";
import { restrictPageAccess } from "@/actions/helpers/check-access";
import { getProfileItems } from "@/store/sidebars-items";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconType } from "react-icons";


const AdminMainPage = async () => {
  const { user, isAuthenticated } = await verifyUser()


  if (!isAuthenticated) {
    notFound()
  }

  await restrictPageAccess('/admin')

  const adminItems = await getProfileItems(user?.role || "super_admin", user?.privileges || [])


  if (adminItems)
    return (
      <div className="p-10 min-h-screen">
        <h1 className="text-2xl font-semibold mb-8 dark:text-white">Admin Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminItems?.map((item: { icon: IconType; bgColor: string; url: string, textColor: string, title: string }, index: number) => (
            < Link href={item.url} key={index} className="relative block overflow-hidden group w-full">
              {/* ${item.bgColor} */}
              <div className={`p-6 rounded-lg shadow-lg bg-card w-full border`}>
                <div className="flex items-center space-x-4">
                  <div className={`absolute top-2 right-2 transform translate-y-2 translate-x-0 opacity-20 text-6xl ${item.textColor}`}>
                    <item.icon />
                  </div>
                  <h2 className={`text-xl font-bold group-hover:scale-105 transform transition duration-200 ${item.textColor}`}>
                    {item.title}
                  </h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div >
    );
};

export default AdminMainPage;
