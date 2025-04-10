import { useEffect, useState } from "react";
import InputBox from "../components/InputBox";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/config";
import { EmployeesProps } from "../utils/employeeData";

interface FormDataProps {
  name: string;
  email: string;
  mobileNum: string;
  imgUrl: File | null;
}

const CreateAndEditComp = ({
  label,
  isEditing,
  employees,
}: {
  label: string;
  isEditing: boolean;
  employees?: EmployeesProps;
}) => {
  const [gender, setGender] = useState<string>("Male");
  const [designation, setDesignation] = useState<string>("Developer");
  const [courses, setCourses] = useState<string[]>(["BCA"]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<FormDataProps>({
    name: "",
    email: "",
    mobileNum: "",
    imgUrl: null,
  });
  const designations = [
    "HR",
    "Sales Manager",
    "Director",
    "Developer",
    "Designer",
  ];
  const courseOptions = ["BCA", "MCA", "MBA", "BBA", "B.Tech"];
  const genders = ["Male", "Female", "Other"];

  const navigate = useNavigate();

  const handleCourseChange = (course: string) => {
    setCourses((prev) =>
      prev.includes(course)
        ? prev.filter((c) => c !== course)
        : [...prev, course]
    );
  };

  const handleAddEmployee = async () => {
    setLoading(false);
    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.mobileNum ||
      !formData.imgUrl ||
      !gender ||
      !designation ||
      courses.length === 0
    ) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("mobileNum", formData.mobileNum);
      form.append("imgUrl", formData.imgUrl);
      form.append("gender", gender);
      form.append("designation", designation);
      form.append("course", courses[0]);

      const res = await fetch(`${BACKEND_URL}/user/create`, {
        method: "POST",
        credentials: "include",
        body: form,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.message || "Something went wrong");
        return;
      }

      alert("Employee Created Successfully");
      navigate("/");
      navigate(0);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditEmployee = async (id: string) => {
    setLoading(false);
    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.mobileNum ||
      !formData.imgUrl ||
      !gender ||
      !designation ||
      courses.length === 0
    ) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("mobileNum", formData.mobileNum);
      form.append("imgUrl", formData.imgUrl); // `File` object from input
      form.append("gender", gender);
      form.append("designation", designation);
      form.append("course", courses[0]);

      const res = await fetch(`${BACKEND_URL}/user/update/${id}`, {
        method: "PUT",
        credentials: "include",
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      alert("Employee Updated Successfully");
      navigate("/");
      navigate(0);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormDataChange = (pair: string, value: string | File | null) => {
    setFormData((prev) => ({
      ...prev,
      [pair]: value,
    }));
  };

  useEffect(() => {
    if (isEditing && employees) {
      setFormData({
        name: employees.name,
        email: employees.email,
        mobileNum: JSON.stringify(employees.mobileNum),
        imgUrl: null,
      });
      setGender(employees.gender);
      setDesignation(employees.designation);
      setCourses([employees.course]);
    }
  }, [isEditing, employees]);

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-200">
      <div className="lg:w-[70%] w-[95%] absolute md:bottom-12 bottom-2 h-auto rounded-md bg-white px-4 md:px-10 py-5 shadow-md flex flex-col justify-start items-center">
        <h1 className="text-3xl font-bold w-full text-left">{label}</h1>
        <div className="w-full mt-5 flex flex-col justify-center items-center gap-4">
          <div className="w-full flex justify-center items-center gap-10">
            <InputBox
              label="Full Name"
              placeholder="Enter Full name"
              value={formData.name}
              onChange={(e) => handleFormDataChange("name", e.target.value)}
            />
            <InputBox
              label="Email"
              placeholder="Enter email"
              type="email"
              value={formData.email}
              onChange={(e) => handleFormDataChange("email", e.target.value)}
            />
          </div>
          <div className="w-full flex justify-center items-center gap-10">
            <InputBox
              label="Mobile Number"
              placeholder="Enter Mobile Number"
              value={formData.mobileNum}
              onChange={(e) =>
                handleFormDataChange("mobileNum", e.target.value)
              }
            />
            <div className="w-full flex flex-col justify-center items-start gap-2">
              <label className="text-sm font-medium">Designation</label>
              <select
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full border rounded-md p-2 text-sm"
              >
                {designations.map((desig) => (
                  <option key={desig} value={desig}>
                    {desig}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="w-full flex justify-center items-center gap-10">
            <div className="w-full flex flex-col justify-center items-start gap-2">
              <label>Gender</label>
              <div className="flex gap-4 md:flex-row flex-col">
                {genders.map((g) => (
                  <label key={g} className="flex items-center gap-1 text-sm">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={gender === g}
                      onChange={() => setGender(g)}
                    />
                    {g}
                  </label>
                ))}
              </div>
            </div>

            <div className="w-full flex flex-col justify-center items-start gap-2">
              <label>Courses</label>
              <div className="flex flex-wrap gap-4">
                {courseOptions.map((course) => (
                  <label
                    key={course}
                    className="flex items-center gap-1 text-sm"
                  >
                    <input
                      type="checkbox"
                      value={course}
                      checked={courses.includes(course)}
                      onChange={() => handleCourseChange(course)}
                    />
                    {course}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full flex justify-start md:items-start items-center gap-5">
            {isEditing && employees?.imgUrl && (
              <img
                src={employees.imgUrl}
                alt="Profile"
                className="md:w-20 w-14 md:h-20 h-14 object-cover rounded-full"
              />
            )}
            <div className="md:w-[50%] w-full">
              <InputBox
                label="Profile Image"
                placeholder="Enter Profile Image"
                type="file"
                onChange={(e) =>
                  handleFormDataChange("imgUrl", e.target.files?.[0] || null)
                }
              />
            </div>
          </div>
          {error && typeof error === "string" ? (
            <p className="w-full text-red-600 text-center">{error}</p>
          ) : (error as any)?.issues ? (
            (error as any).issues.map(
              (issue: { message: string }, idx: number) => (
                <div
                  key={idx}
                  className="w-full flex justify-center items-center gap-2"
                >
                  <p className="w-full text-red-600 text-center">
                    {issue.message}
                  </p>
                </div>
              )
            )
          ) : null}
          <div className="w-full flex justify-center items-center gap-10">
            <div className="w-full mt-4 flex justify-center items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="bg-gray-900 text-white w-full rounded-md py-2 cursor-pointer hover:opacity-80"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={
                  isEditing && employees
                    ? () => handleEditEmployee(employees._id)
                    : handleAddEmployee
                }
                className="bg-green-600 text-white w-full rounded-md py-2 cursor-pointer hover:opacity-80"
              >
                {loading ? "Saving" : isEditing ? "Save changes" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAndEditComp;
