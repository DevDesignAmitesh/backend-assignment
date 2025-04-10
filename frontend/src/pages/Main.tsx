import Employees from "../components/Employees";
import ListHeader from "../components/ListHeader";

const Main = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-200">
      <div className="md:w-[90%] w-[95%] absolute bottom-10 h-[550px] rounded-md bg-white md:px-10 px-4 py-5 shadow-md flex flex-col justify-center items-center">
        <ListHeader />
        <Employees />
      </div>
    </div>
  );
};

export default Main;
