import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
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

const OnlineBooking = () => {
  const bookingData = [
    { month: 'Jul', bookings: 0 },
    { month: 'Aug', bookings: 0 },
    { month: 'Sep', bookings: 0 },
    { month: 'Oct', bookings: 0 },
    { month: 'Nov', bookings: 5 },
    { month: 'Dec', bookings: 5 },
    { month: 'Jan', bookings: 5 },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-2">Setup &gt; Online Booking</div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-2 md:mb-0">
          Online Booking
          <span className="text-green-600 text-xs bg-green-100 px-2 py-1 ml-2 rounded">Enabled</span>
        </h1>
        <div className="text-black-600 text-sm">
          Your Online Booking Portal Link:<br />
          <a href="https://example.com" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">
            https://yourlink.com
          </a>
        </div>
      </div>

      {/* Chart + Bookings Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Chart Section */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Online Bookings by Month</h2>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bookingData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a0d8ef" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#a0d8ef" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="bookings" stroke="#4fb3bf" fillOpacity={1} fill="url(#colorBookings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings Source Section */}
      
 <Card elevation={3} sx={{ borderRadius: 3 }}>
      <CardHeader
        title="Bookings"
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

        {/* <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            borderRadius: 2,
            textTransform: 'none',
            backgroundColor: '#1976d2',
            '&:hover': { backgroundColor: '#1565c0' },
          }}
        >
          Customize
        </Button> */}
      </CardContent>
    </Card>

      </div>

      {/* Bottom Section */}
      {/* <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:justify-between items-center mb-4">
          <select className="border rounded px-2 py-1 w-full md:w-auto mb-2 md:mb-0">
            <option>All Locations</option>
          </select>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition">
            Promote
          </button>
        </div>
        <div >
            <div  className="text-black-600 text-sm font-semibold">Booking Activity</div>
        <div className="h-24 bg-gray-100 rounded flex items-center justify-center text-gray-400">
          Booking Activity Placeholder
        </div>
        </div>
      </div> */}
{/* Bottom Section */}
{/* Bottom Section */}
<div className="bg-white p-6 rounded-2xl shadow-md">
  {/* Header: Location Selector + Promote Button */}
  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
    <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-auto">
      <option>All Locations</option>
      <option>New York</option>
      <option>San Francisco</option>
    </select>
    {/* <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md shadow transition">
      🚀 Promote
    </button> */}
  </div>

  {/* Booking Activity */}
  <div>
    <h3 className="text-base font-semibold text-gray-800 mb-3">📋 Booking Activity</h3>
    <div className="bg-gray-50 rounded-lg px-4 py-4 border border-gray-100">
      <ul className="divide-y divide-gray-200 text-sm text-gray-700">
        <li className="py-2 flex justify-between items-center">
          <span>✅ John Doe booked via App</span>
          <span className="text-gray-400 text-xs">May 12, 2025</span>
        </li>
        <li className="py-2 flex justify-between items-center">
          <span>✅ Jane Smith booked via Website</span>
          <span className="text-gray-400 text-xs">May 11, 2025</span>
        </li>
        <li className="py-2 flex justify-between items-center">
          <span>✅ Michael Lee booked via Facebook</span>
          <span className="text-gray-400 text-xs">May 10, 2025</span>
        </li>
        <li className="py-2 flex justify-between items-center">
          <span>✅ Sarah Jones booked via Google</span>
          <span className="text-gray-400 text-xs">May 9, 2025</span>
        </li>
      </ul>
    </div>
  </div>
</div>

    </div>
  );
};

export default OnlineBooking;
