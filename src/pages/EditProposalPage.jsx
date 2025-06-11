// src/pages/EditProposalPage.jsx
import ProposalForm from '../pages/ProposalForm';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { editProposal, deleteProposal } from '../features/proposalSlice';

const EditProposalPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [defaultValues, setDefaultValues] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/proposals/${id}`)
      .then(res => setDefaultValues(res.data))
      .catch(err => console.error('Fetch failed', err));
  }, [id]);

  const handleEdit = async (data) => {
    try {
      await axios.put(`http://localhost:5000/api/proposals/${id}`, data);
      // Optionally update the Redux store or local state here
      dispatch(editProposal({ id, ...data }));
      navigate('/profile');
    } catch (err) {
      console.error('Failed to update:', err);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this proposal?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/proposals/${id}`);
      // Update the Redux store or local state
      dispatch(deleteProposal(id));
      navigate('/profile');
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  if (!defaultValues) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Edit Proposal</h2>
      <ProposalForm onSubmit={handleEdit} defaultValues={defaultValues} isEdit />

      <div className="mt-6">
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
        >
          Delete Proposal
        </button>
      </div>
    </div>
  );
};

export default EditProposalPage;
