import SideBar from "@/components/SideBar";
export default async function UserLayout({children}:{children:React.ReactNode}) {

    return (
      <SideBar>
          <div className="h-full">
    {children}
        </div>
      </SideBar>
    );
    
}