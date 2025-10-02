import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RoleSelect from "./pages/RoleSelect";
import Dashboard from "./pages/Dashboard";
import DriverPortal from "./pages/DriverPortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

type UserRole = 'admin' | 'driver' | null;

const App = () => {
  const [userRole, setUserRole] = useState<UserRole>(null);

  const handleLogout = () => {
    setUserRole(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                userRole ? 
                <Navigate to={userRole === 'admin' ? "/dashboard" : "/driver"} replace /> : 
                <RoleSelect onSelectRole={setUserRole} />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                userRole === 'admin' ? 
                <Dashboard onLogout={handleLogout} /> : 
                <Navigate to="/" replace />
              } 
            />
            <Route 
              path="/driver" 
              element={
                userRole === 'driver' ? 
                <DriverPortal driverId="1" driverName="Иванов Иван" onLogout={handleLogout} /> : 
                <Navigate to="/" replace />
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;