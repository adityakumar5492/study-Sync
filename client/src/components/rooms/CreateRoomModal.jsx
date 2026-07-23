import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

const initialState = {
  title: "",
  subject: "",
  description: "",
  privacy: "Public",
};

const CreateRoomModal = ({ isOpen, onClose, onCreateRoom }) => {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  // Reset form whenever modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData(initialState);
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Room name is required.");
      return;
    }

    if (!formData.subject.trim()) {
      alert("Subject is required.");
      return;
    }

    setLoading(true);

    try {
      // Temporary
      console.log(formData);

      // Later:
      // const room = await roomService.createRoom(formData);
      // onCreateRoom(room);

      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to create room.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-slate-900 w-full max-w-lg rounded-2xl p-8 border border-slate-800">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Create Study Room
          </h2>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="title"
            placeholder="Room Name"
            value={formData.title}
            onChange={handleChange}
            className="w-full bg-slate-800 p-3 rounded-xl outline-none border border-transparent focus:border-green-500"
          />

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full bg-slate-800 p-3 rounded-xl outline-none border border-transparent focus:border-green-500"
          />

          <textarea
            rows={4}
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-slate-800 p-3 rounded-xl outline-none border border-transparent focus:border-green-500 resize-none"
          />

          <select
            name="privacy"
            value={formData.privacy}
            onChange={handleChange}
            className="w-full bg-slate-800 p-3 rounded-xl outline-none border border-transparent focus:border-green-500"
          >
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold transition ${
              loading
                ? "bg-slate-700 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {loading ? "Creating..." : "Create Room"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal;