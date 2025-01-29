import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import { ModelProviderPages } from "@/components/adminPage/providers/model-provider";
import QueryProvider from "@/components/adminPage/providers/query-provider";
import { ModelProvider } from "@/hooks/model-context";
import { MyProvider } from "../../context/MyContext";

export const metadata = {
  title: "Bhaw Bhaw",
  description: "Welcome to the Bhaw Bhaw Admin Panel home page. Manage and monitor the platform seamlessly. Access detailed insights, track system activities, and oversee operations to maintain smooth functionality. The home page acts as your gateway to managing users, vendors, products, bookings, and more. Leverage our tools to ensure consistent platform performance and a delightful user experience for pet owners and sellers.",
  keywords: "admin home, platform management, Bhaw Bhaw tools, operational insights"
};

export default function RootLayout({ children }) {
  return (
    <MyProvider>
      <div className="flex flex-col w-full h-screen relative">
        <div className="z-[50]">
          <Header />
        </div>
        <div className="flex flex-row flex-grow w-full h-full overflow-hidden">
          <div className="custom_shadow fixed z-[40]">
            <Sidebar />
          </div>          
          <div className="mt-16 flex-grow lg:ml-60 bg-oohpoint-grey-100 sm:px-5 sm:py-5 py-0 px-2 sidebar-scrollbar overflow-x-auto">
            <ModelProvider>
              <ModelProviderPages />
              <QueryProvider>{children}</QueryProvider>
            </ModelProvider>
          </div>
        </div>
      </div>
    </MyProvider>
  );
}


// import Sidebar from "../../components/Sidebar/Sidebar";
// import Header from "../../components/Header/Header";
// import { ModelProviderPages } from "@/components/adminPage/providers/model-provider";
// import QueryProvider from "@/components/adminPage/providers/query-provider";
// import { ModelProvider } from "@/hooks/model-context";
// import { MyProvider } from "../../context/MyContext";

// export const metadata = {
//   title: "Bhaw Bhaw",
//   description: "Welcome to the Bhaw Bhaw Admin Panel home page. Manage and monitor the platform seamlessly. Access detailed insights, track system activities, and oversee operations to maintain smooth functionality. The home page acts as your gateway to managing users, vendors, products, bookings, and more. Leverage our tools to ensure consistent platform performance and a delightful user experience for pet owners and sellers.",
//   keywords: "admin home, platform management, Bhaw Bhaw tools, operational insights"
// };

// export default function RootLayout({ children }) {
//   return (
//     <MyProvider>
//       <div className="flex flex-col w-full h-screen">
//         <Header />
//         {/* <div className="flex flex-row flex-grow w-full h-full"> */}
//         <div className="w-full h-full">
//           <div className="custom_shadow fixed">
//             <Sidebar />
//           </div>
//           <div className="mt-16 flex-grow -z-50 lg:ml-60 bg-oohpoint-grey-100 sm:px-5 py-5 px-2">
//             <ModelProvider>
//               <ModelProviderPages />
//               <QueryProvider>{children}</QueryProvider>
//             </ModelProvider>
//           </div>
//         </div>
//       </div>
//     </MyProvider>
//   );
// }
