import { useEffect, useState } from "react";
import { onAdminAuthChange } from "../../firebase.js";
import AdminLogin from "./AdminLogin.jsx";
import AdminDashboard from "./AdminDashboard.jsx";

export default function AdminPage() {
  const [user, setUser] = useState(undefined); // undefined = still checking, null = logged out

  useEffect(() => {
    const unsubscribe = onAdminAuthChange(setUser);
    return unsubscribe;
  }, []);

  if (user === undefined) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Loading...</div>;
  }

  return user ? <AdminDashboard /> : <AdminLogin />;
}