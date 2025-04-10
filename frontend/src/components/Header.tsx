import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/config";
import { MdOutlineLogout } from "react-icons/md";
import { useAppContext } from "../context/Context";

const Header = () => {
  const { username } = useAppContext();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/user/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (res.status === 200) {
        alert("Logout successfully");
        navigate("/auth");
      } else {
        console.error("Failed to logout:", res.status);
        alert("Something went wrong");
        return;
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Something went wrong");
      return;
    }
  };
  return (
    <div className="w-full fixed h-[80px] z-[999] md:px-10 px-3 bg-white shadow-md flex justify-between items-center">
      <h1 className="md:text-3xl text-xl font-bold text-gray-900 text-nowrap">Employee Hub</h1>
      <div className="flex justify-center items-center gap-4">
        <p className="capitalize text-nowrap">Hi, {username}</p>
        <button
          onClick={handleLogout}
          className="flex justify-center items-center gap-2 border border-gray-900 rounded-md py-2 px-4 cursor-pointer hover:opacity-80"
        >
          <MdOutlineLogout size={20} />
          <p className="text-[15px] md:block hidden">Logout</p>
        </button>
      </div>
    </div>
  );
};

export default Header;
