const activities = [
  "Joined Operating Systems Room",
  "Created DBMS Study Room",
  "Uploaded CN Notes",
  "Completed DSA Session",
];

const ActivityTimeline = () => {
  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <h2 className="text-2xl font-bold mb-6">
        Recent Activity
      </h2>

      <div className="space-y-4">

        {activities.map((activity, index) => (
          <div
            key={index}
            className="border-l-2 border-green-500 pl-4"
          >
            <p>{activity}</p>
          </div>
        ))}

      </div>

    </section>
  );
};

export default ActivityTimeline;