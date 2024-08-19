import { Box } from "@mui/material";
import Header from "../../Components/Header";

const Dashboard = () => {
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome To Your Dashboard" />
      </Box>
      <h1>Test</h1>
    </Box>
  );
};

export default Dashboard;
