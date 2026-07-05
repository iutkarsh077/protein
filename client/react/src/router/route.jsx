import Home from "@/components/Home";
import Login from "@/components/Login";
import Signup from "@/components/signup";
import { Routes, Route } from "react-router-dom";


const CustomRoute = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    )
}

export default CustomRoute;
