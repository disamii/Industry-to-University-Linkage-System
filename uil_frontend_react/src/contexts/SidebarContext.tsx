import { createContext, ReactNode, useContext, useState } from "react";

interface SidebarContextType {
  showSidebar: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  showSidebar: false,
  toggleSidebar: () => {},
});

interface SidebarProviderProps {
  children: ReactNode;
}

function SidebarProvider({ children }: SidebarProviderProps) {
  const [showSidebar, setShowSidebar] = useState(false);

  function toggleSidebar() {
    setShowSidebar((show) => !show);
  }

  return (
    <SidebarContext.Provider value={{ showSidebar, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

function useSidebar() {
  const context = useContext(SidebarContext);

  if (context === undefined)
    throw new Error(
      "SidebarContext was used outside of SidebarContextProvider",
    );

  return context;
}

export { SidebarProvider, useSidebar };
