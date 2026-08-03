const EditProfileModal = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

      <div className="bg-slate-900 rounded-2xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6">
          Edit Profile
        </h2>

        <div className="space-y-5">

          <input
            type="text"
            placeholder="Full Name"
            className="w-full bg-slate-800 rounded-xl p-3 outline-none"
          />

          <textarea
            rows="4"
            placeholder="Bio"
            className="w-full bg-slate-800 rounded-xl p-3 outline-none resize-none"
          />

        </div>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl bg-slate-700 hover:bg-slate-600"
          >
            Cancel
          </button>

          <button className="px-5 py-3 rounded-xl bg-green-500 hover:bg-green-600">
            Save
          </button>

        </div>

      </div>

    </div>
  );
};

export default EditProfileModal;