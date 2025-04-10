import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { EmployeesProps } from "../utils/employeeData";
import { BACKEND_URL } from "../utils/config";

type ContextType = {
  username: string;
  setUsername: (name: string) => void;
  employees: EmployeesProps[];
  setEmployees: (e: EmployeesProps[]) => void,
  getAllEmployees: (
    page: number,
    limit: number,
    filter: string,
    sortBy: string,
    order: string
  ) => void;
  totalPages: number;
};

const Context = createContext<ContextType | undefined>(undefined);

export const Provider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState("");
  const [employees, setEmployees] = useState<EmployeesProps[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  const getAllEmployees = async (
    page = 1,
    limit = 6,
    filter = "",
    sortBy = "createdAt",
    order = "desc"
  ) => {
    let url = `${BACKEND_URL}/user/employee/bulk?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}`;

    if (filter) {
      url += `&filter=${encodeURIComponent(filter)}`;
    }

    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    console.log(data);

    setEmployees(data.employees);
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    getAllEmployees(1, 2, "");
  }, []);

  return (
    <Context.Provider
      value={{ username, setUsername, employees, getAllEmployees, totalPages, setEmployees }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};
