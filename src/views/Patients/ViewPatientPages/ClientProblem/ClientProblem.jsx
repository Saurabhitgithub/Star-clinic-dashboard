import React, { useState, useEffect } from "react";
import { Button } from "../../../../components/Buttons/Button";
import { EditIcon } from "../../../../components/Icons/SvgIcons";
import { DeleteButton } from "../../../../components/Buttons/DeleteButton";
import { Outlet, useNavigate, useParams } from "react-router";
import { deleteClientProblem, getAllClientProblem, getClientProblemById } from "../../../../services/offersApis";
import { loader, toast } from "../../../../utils";
 
import { Alert } from '@mui/material';
import moment from "moment";
 
const ClientProblem = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
 
  // console.log("Client ID from useParams:", id); // Debugging log
 
  useEffect(() => {
    if (id) {
      fetchProblems();
      // getClienems();
      // getClientProblem();
    } else {
      console.warn("No ID found in URL parameters.");
    }
  }, [id]); // Runs when `id` changes
 
  const fetchProblems = async () => {
    setLoading(true);
    loader.start();
    try {
      console.log("Fetching data for client ID:", id);
      const response = await getAllClientProblem(id);
 
      console.log("Full API Response:", response);
      if (response?.data?.data) {
        setData(response.data.data);
      } else {
        console.warn("Data not found in response:", response);
        setData([]); // Ensure state is reset if API fails
      }
    } catch (err) {
      console.error("API Error:", err);
      toast.error("Failed to fetch client data");
      setData([]); // Reset data on failure
    } finally {
      setLoading(false);
      loader.stop();
    }
  };
 
  const getClientProblem = async () => {
    setLoading(true);
    loader.start();
    try {
      const response = await getClientProblemById(id); // <-- Pass `id` correctly
      console.log("API Response:", response); // <-- Debugging log
      console.log("Data:", response?.data?.data); // <-- Ensure data exists
 
      if (response?.data?.data) {
        setData([response.data.data]); // Store it properly
      } else {
        console.warn("No data found for the given ID.");
        setData([]);
      }
    } catch (err) {
      console.error("API Error:", err);
      toast.error("Failed to fetch client problem data");
    } finally {
      setLoading(false);
      loader.stop();
    }
  };
 
 
  async function deleteClient(id) {
      try {
        loader.start();
        await deleteClientProblem(id);
        toast.success("Offer deleted successfully");
        setData((prev) => prev.filter((offer) => offer._id !== id));
      } catch (error) {
        console.log(error)
        toast.error("Failed to delete offer");
      } finally {
        loader.stop();
      }              
    }
 
  return (
    <div className="min-h-screen flex flex-col p-4">
      <div className="flex justify-between items-center bg-white shadow-md p-4 rounded-lg">
        {/* <ul className="flex text-sm font-medium text-gray-500">
          <li className="me-2">
            <a
              href="#"
              className="inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg"
            >
              Active
            </a>
          </li>
          <li className="me-2">
            <a
              href="#"
              className="inline-block p-4 rounded-t-lg hover:bg-gray-50"
            >
              Inactive
            </a>
          </li>
        </ul> */}
        <h4>Client Problem</h4>
        <Button primary onClick={() => navigate("add", { replace: true })}>
          + Add Problem
        </Button>
      </div>
      <br />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {data.length > 0 ? (
            data.map((problem) => (
              <div
                key={problem._id}
                className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg mb-2"
              >
                <div>
                  <h2 className="text-lg font-semibold">{problem.problem}</h2>
                  <h1 className="text-sm text-black-600">
                    Diagnose date: {moment(problem.diagnosis_date).format("DD-MM-YYYY")}
                  </h1>
                  <p className="text-sm text-gray-600 pt-2">
                  | Created At:{" "}
                    {moment(problem.createdAt).format("DD-MM-YYYY")} | Code System: {problem.problem_name} |
                    RELATED APPOINTMENTS: {problem.related_appointments}
                  </p>
                  {/* <p className="text-sm text-gray-500">
                    Description:{" "}
                    {problem.description || "No description provided."}
                  </p> */}
                </div>
             
                <div className="flex gap-2">
                {/* <button className="px-4 py-1 text-sm text-blue-600 bg-blue-100 rounded-full gap-2">
                  Active
                </button> */}
                  <EditIcon
                    primary
                    onClick={() =>
                      navigate(`update/${problem._id}`, { replace: true })
                    }
                    className="pointer"
                  />
                  <DeleteButton
                    className="pointer"
                    data={id}
                    confirmation
                    onDelete={()=>deleteClient(problem._id)}
                  />
                </div>
              </div>
            ))
          ) : (
            <p>No problems found for this client.</p>
          )}
        </div>
      )}
      <Outlet context={fetchProblems}/>
    </div>
  );
};
 
export default ClientProblem;