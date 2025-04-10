import { useEffect, useState } from "react";
import EmployeeDetails from "./EmployeeDetails";
import DeletePopup from "./DeletePopup";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/Context";
import Pagination from "./Pagination";
import ToggleSwitch from "./ToggleSwitch";
import { BACKEND_URL } from "../utils/config";

const Employees = () => {
  const [popup, setPopup] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [employeeId, setEmployeeId] = useState<string>("");
  const navigate = useNavigate();
  const { employees, getAllEmployees, totalPages, setEmployees } =
    useAppContext();

  const handlePopup = (id: string) => {
    setPopup(true);
    setEmployeeId(id);
  };

  useEffect(() => {
    getAllEmployees(page, 2, "", "", "");
  }, [page]);

  const toggleActive = async (id: string, newStatus: boolean) => {
    const updatedEmployees = employees.map((emp) =>
      emp._id === id ? { ...emp, active: !emp.active } : emp
    );

    setEmployees(updatedEmployees);

    alert(
      `Employee status updated to ${
        !employees.find((emp) => emp._id === id)?.active
          ? "Active"
          : "Deactivated"
      }`
    );

    try {
      await fetch(`${BACKEND_URL}/user/employee/status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ active: newStatus }),
      });
    } catch (err) {
      console.error("Failed to update backend status:", err);
      alert("Something went wrong while saving to the backend.");
    }
  };

  return (
    <>
      <div
        className={`w-full h-[400px] overflow-y-auto mt-10 grid ${
          employees.length > 0
            ? "xl:grid-cols-3 lg:grid-cols-2 grid-cols-1"
            : "grid-cols-1"
        } place-items-center gap-3 pb-5`}
      >
        {employees.length === 0 && <div>No Employees in the list</div>}
        {employees.map((item) => (
          <div className="p-2 md:p-6 w-full relative rounded-md bg-gray-900 text-white flex flex-col justify-center items-center">
            <div className="w-full flex justify-between items-center">
              <div className="flex justify-center items-center gap-2">
                <img
                  src={item.imgUrl}
                  alt="profile"
                  className="h-10 w-10 rounded-full bg-red-200 object-cover"
                />
                <div className="flex flex-col justify-center items-start">
                  <p className="text-[15px] font-medium">{item.name}</p>
                  <p className="text-[12px] text-gray-300">
                    {item._id.slice(0, 10)}
                  </p>
                </div>
              </div>
              <div className="flex justify-center items-center gap-4">
                <div className="border-2 border-white text-white py-[6px] px-4 rounded-md text-[12px] font-medium text-nowrap">
                  {item.designation}
                </div>
                <ToggleSwitch
                  isActive={item.active}
                  onToggle={() => toggleActive(item._id, !item.active)}
                />
              </div>
            </div>

            <div className="w-full mt-4 text-[13px] space-y-2">
              <EmployeeDetails pair="Email" value={item.email} />
              <EmployeeDetails
                pair="Mobile"
                value={item.mobileNum.toString()}
              />
              <EmployeeDetails pair="Gender" value={item.gender} />
              <EmployeeDetails pair="Course" value={item.course} />
              <EmployeeDetails
                pair="Created At"
                value={new Date(item.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              />
            </div>

            <div className="w-full mt-4 flex justify-center items-center gap-4">
              <button
                onClick={() => navigate(`/edit?id=${item._id}`)}
                className="bg-gray-100 text-gray-900 w-full rounded-md py-2 cursor-pointer hover:opacity-80"
              >
                Edit
              </button>
              <button
                onClick={() => handlePopup(item._id)}
                className="bg-red-600 text-white w-full rounded-md py-2 cursor-pointer hover:opacity-80"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
      {popup && <DeletePopup setPopup={setPopup} employeeId={employeeId} />}
    </>
  );
};

export default Employees;
