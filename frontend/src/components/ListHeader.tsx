import { IoIosSearch } from "react-icons/io";
import { MdPersonAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/Context";
import { useEffect, useState } from "react";

const ListHeader = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const { getAllEmployees } = useAppContext();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getAllEmployees(1, 2, filter, sortBy, sortOrder);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [filter, sortBy, sortOrder]);

  return (
    <div className="w-full flex md:flex-row flex-col md:gap-0 gap-4 justify-between items-center">
      <p className="text-xl text-gray-900 font-semibold text-nowrap mr-4">
        Employee List
      </p>
      <div className="flex justify-center items-center md:flex-row flex-col gap-4 w-full md:w-auto">
        <div className="flex w-full justify-center items-center gap-2 border border-gray-900 rounded-md py-2 px-2">
          <IoIosSearch size={25} />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search Employees"
            className="outline-none w-full"
          />
        </div>
        <div className="flex md:w-auto w-full justify-center items-center gap-2 bg-gray-900 text-white rounded-md py-2 px-4">
          <MdPersonAdd size={22} />
          <button
            onClick={() => navigate("/create")}
            className="bg-gray-900 text-nowrap rounded-md hover:opacity-80 cursor-pointer"
          >
            Add Employee
          </button>
        </div>
        <div className="flex justify-center items-center gap-4">
          <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
            <option value="createdAt">Created At</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="id">Id</option>
          </select>

          <select
            onChange={(e) => setSortOrder(e.target.value)}
            value={sortOrder}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ListHeader;
