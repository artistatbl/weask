import React from "react";

type Props = {children: React.ReactNode}
    
    
    const Layout = ({children} :Props) => {
 return(
    <div className="dark:text-white bg-gray-900 min-h-screen flex flex-col justify-center items-center">
      <main className="p-6 text-center">
        {children}
      </main>
    </div>
 )

}

export default Layout