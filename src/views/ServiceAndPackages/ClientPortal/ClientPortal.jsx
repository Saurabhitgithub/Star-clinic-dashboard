import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  Divider,
} from '@mui/material';

const ClientPortal = () => {
  const connectData = [
    { month: "Aug", registrations: 0 },
    { month: "Sep", registrations: 20 },
    { month: "Oct", registrations: 35 },
    { month: "Nov", registrations: 35 },
    { month: "Dec", registrations: 8 },
    { month: "Jan", registrations: 2 },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-2">Setup &gt; Client Portal</div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-2 md:mb-0">
          Online Registration
          <span className="text-green-600 text-xs bg-green-100 px-2 py-1 ml-2 rounded">
            Enabled
          </span>
        </h1>
        <div className="text-black-600 text-sm">
          Your Online registration Portal Link:
          <br />
          <a
            href="https://example.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-600"
          >
            https://yourlink.com
          </a>
        </div>
      </div>

      {/* Chart + Bookings Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Chart Section */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">
          Online Registration by Month
          </h2>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={connectData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorConnect" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a0d8ef" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#a0d8ef" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="registrations"
                  stroke="#4fb3bf"
                  fillOpacity={1}
                  fill="url(#colorConnect)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings Source Section */}
        <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardHeader
                title="Registration"
                titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                sx={{ pb: 0 }}
              />
              <CardContent>
                <List dense>
                  <ListItem disableGutters>
                    <ListItemText primary="App" secondary="21" />
                  </ListItem>
                  <Divider />
                  <ListItem disableGutters>
                    <ListItemText primary="Facebook" secondary="-" />
                  </ListItem>
                  <Divider />
                  <ListItem disableGutters>
                    <ListItemText primary="Instagram" secondary="-" />
                  </ListItem>
                  <Divider />
                  <ListItem disableGutters>
                    <ListItemText primary="Google" secondary="-" />
                  </ListItem>
                </List>
        
               
              </CardContent>
            </Card>
      </div>

      {/* Bottom Section */}
     
      <div className="bg-white p-6 rounded-2xl shadow-md">
  {/* Header: Location Selector + Promote Button */}
  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
    <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-auto">
      <option>All Locations</option>
      <option>New York</option>
      <option>San Francisco</option>
    </select>
  
  </div>

  {/* Booking Activity */}
  <div>
    <h3 className="text-base font-semibold text-gray-800 mb-3">📋 Registration Activity</h3>
    <div className="bg-gray-50 rounded-lg px-4 py-4 border border-gray-100">
      <ul className="divide-y divide-gray-200 text-sm text-gray-700">
        <li className="py-2 flex justify-between items-center">
          <span>✅ John Doe Registered via App</span>
          <span className="text-gray-400 text-xs">May 12, 2025</span>
        </li>
        <li className="py-2 flex justify-between items-center">
          <span>✅ Jane Smith Registered  via Website</span>
          <span className="text-gray-400 text-xs">May 11, 2025</span>
        </li>
        <li className="py-2 flex justify-between items-center">
          <span>✅ Michael Lee Registered  via Facebook</span>
          <span className="text-gray-400 text-xs">May 10, 2025</span>
        </li>
        <li className="py-2 flex justify-between items-center">
          <span>✅ Sarah Jones Registered  via Google</span>
          <span className="text-gray-400 text-xs">May 9, 2025</span>
        </li>
      </ul>
    </div>
  </div>
</div>
    </div>
  );
};

export default ClientPortal;
