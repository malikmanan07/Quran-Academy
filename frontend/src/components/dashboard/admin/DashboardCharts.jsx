import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';

const DashboardCharts = ({ stats }) => {
  const COLORS = ['#10B981', '#EF4444', '#F59E0B']; // Green (Present), Red (Absent), Yellow (Late)

  const attendanceData = [
    { name: 'Present', value: stats?.attendanceStats?.present || 0 },
    { name: 'Absent', value: stats?.attendanceStats?.absent || 0 },
    { name: 'Late', value: stats?.attendanceStats?.late || 0 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm lg:col-span-2">
        <h3 className="text-lg font-bold text-[#1A1A2E] mb-4">Revenue Overview (Last 6 Months)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats?.monthlyRevenue || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F4F8" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#4A5568', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#4A5568', fontSize: 12}} />
              <Tooltip cursor={{ fill: '#F7FAFC' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="total" fill="#00B4D8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Attendance Chart */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
        <h3 className="text-lg font-bold text-[#1A1A2E] mb-4">Attendance Breakdown</h3>
        <div className="h-[300px] w-full flex flex-col items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={attendanceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {attendanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Student Growth Chart */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm lg:col-span-3">
        <h3 className="text-lg font-bold text-[#1A1A2E] mb-4">Student Growth</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats?.studentGrowth || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F4F8" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#4A5568', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#4A5568', fontSize: 12}} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Line type="monotone" dataKey="count" stroke="#1B3A5C" strokeWidth={3} dot={{r: 4, fill: '#1B3A5C', strokeWidth: 2}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
