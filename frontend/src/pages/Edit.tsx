import { useLocation } from "react-router-dom";
import CreateAndEditComp from "../components/CreateAndEditComp";
import { useEffect, useState } from "react";
import { EmployeesProps } from "../utils/employeeData";
import { BACKEND_URL } from "../utils/config";

const Edit = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  const [employee, setEmployee] = useState<EmployeesProps>();

  const getOneEmployee = async () => {
    if (!id) {
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/user/employee/${id}`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        return;
      }

      setEmployee(data);
    } catch (err) {
    } finally {
    }
  };

  useEffect(() => {
    getOneEmployee();
  }, []);

  return (
    <CreateAndEditComp
      label={`Edit ${employee?.name}'s Data`}
      isEditing
      employees={employee}
    />
  );
};

export default Edit;
