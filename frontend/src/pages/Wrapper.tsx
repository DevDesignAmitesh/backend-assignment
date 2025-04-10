import { ReactNode } from "react";
import Header from "../components/Header";
import ProtectedRoute from "../components/ProtectedRoute";
import { Provider } from "../context/Context";

const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Provider>
      <ProtectedRoute>
        <div className="w-full h-screen relative">
          <Header />
          <div className="w-full">{children}</div>
        </div>
      </ProtectedRoute>
    </Provider>
  );
};

export default Wrapper;
