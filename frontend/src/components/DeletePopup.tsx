import { useState } from "react";
import { BACKEND_URL } from "../utils/config";
import { useNavigate } from "react-router-dom";

const DeletePopup = ({
  setPopup,
  employeeId,
}: {
  setPopup: (e: boolean) => void;
  employeeId: string;
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  console.log(employeeId);

  const handleDeleteEmployee = async (employeeId: string) => {
    setLoading(false);
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/user/delete/${employeeId}`, {
        method: "DELETE",
        credentials: "include", // ensures cookies (auth tokens) are sent
      });

      if (res.status === 200) {
        await res.json();
        alert("Employee deleted Successfully");
        navigate("/");
        navigate(0);
      } else {
        const errorData = await res.json();
        console.error("Delete failed:", errorData.message);
        alert("Something went wrong");
        return;
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Something went wrong");
      return;
    }
  };

  return (
    <div className="w-full md:p-0 p-6 h-[120vh] fixed bg-black/70 z-[999] flex justify-center items-start">
      <div className="p-6 mt-64 bg-white w-[500px] rounded-xl text-gray-900 flex flex-col justify-center items-center">
        <p className="text-xl font-bold w-full text-left">Are you sure?</p>
        <p className="text-gray-500 text-[14px] mt-2 w-full text-left">
          This acion cannot be undone. This will permanently delete the
          employee's data from our servers.
        </p>
        <div className="w-full mt-5 flex justify-center items-center gap-5">
          <button
            onClick={() => setPopup(false)}
            className="bg-gray-900 text-white w-full rounded-md py-2 hover:opacity-80 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDeleteEmployee(employeeId)}
            disabled={loading}
            className="bg-red-600 text-white w-full rounded-md py-2 hover:opacity-80 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
