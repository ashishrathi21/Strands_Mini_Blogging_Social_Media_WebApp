import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { user, authLoading } = useSelector((state) => state.user);

  if (authLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-gray-400">
        Checking authentication...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
