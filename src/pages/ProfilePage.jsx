import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProposals } from '../features/proposalSlice'; // 👈 Add this
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const proposals = useSelector((state) => state.proposals.list);
  const status = useSelector((state) => state.proposals.status);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProposals());
    }
  }, [dispatch, status]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <p className="mb-2">Name: Jane Doe</p>
      <p className="mb-4">Total Proposals: {proposals.length}</p>

      {proposals.length < 5 ? (
        <Link to="/proposal/new" className="bg-blue-600 text-white px-4 py-2 rounded">
          + New Proposal
        </Link>
      ) : null}
      {proposals.length >= 5 && (
        <p className="text-red-500 mt-2">
          Maximum number of proposals reached. You can only have up to 5 proposals.
        </p>
      )}

      <div className="mt-6 space-y-4">
        <h3 className="text-xl font-semibold mb-4">Your Proposals</h3>

        {status === 'loading' && <p>Loading proposals...</p>}
        {status === 'failed' && <p className="text-red-500">Failed to fetch proposals.</p>}
        {status === 'succeeded' && proposals.length === 0 && <p>No proposals found.</p>}

        {status === 'succeeded' && proposals.map((p) => (
          <div key={p._id || p.id} className="border p-4 rounded bg-white shadow">
            <h3 className="font-semibold text-lg">{p.title || p.companyName}</h3>
            <p className="text-gray-700">{p.companyOverview}</p>
            <Link
              to={`/proposal/${p._id || p.id}/edit`}
              className="text-blue-600 underline text-sm inline-block mt-2"
            >
              View / Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
