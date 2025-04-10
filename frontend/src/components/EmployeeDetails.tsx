const EmployeeDetails = ({ pair, value }: { pair: string; value: string }) => {
  return (
    <div className="flex justify-start gap-2">
      <span className="text-white">{pair}:</span>
      <span className="text-gray-300">{value}</span>
    </div>
  );
};

export default EmployeeDetails;
