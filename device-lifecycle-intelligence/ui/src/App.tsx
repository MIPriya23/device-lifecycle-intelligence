import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import Overview from "@/pages/Overview";
import DeviceSearch from "@/pages/DeviceSearch";
import Alerts from "@/pages/Alerts";
import Reports from "@/pages/Reports";
import Timeline from "@/pages/Timeline";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-p1 text-p5">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/overview/:deviceId" element={<Overview />} />
            <Route path="/devices" element={<DeviceSearch />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/timeline/:deviceId" element={<Timeline />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
