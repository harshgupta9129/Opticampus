// import { useLocation, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { baseUrl } from "@/App";

// const VerifyOtp = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const [otp, setOtp] = useState("");

//   useEffect(() => {
//     if (!state?.email) {
//       navigate("/register");
//     }
//   }, [state, navigate]);

//   const handleVerify = async () => {
//     const res = await fetch(`${baseUrl}/api/auth/verify-otp`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         email: state.email,
//         otp,
//       }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       alert(data.message);
//       return;
//     }

//     // ✅ SAVE USER (THIS IS IMPORTANT)
//     localStorage.setItem(
//       "user",
//       JSON.stringify({
//         name: data.name,
//         email: data.email,
//         role: data.role,
//       })
//     );

//     navigate(`/dashboard/${data.role}`);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="space-y-4">
//         <Input
//           placeholder="Enter OTP"
//           value={otp}
//           onChange={(e) => setOtp(e.target.value)}
//         />
//         <Button onClick={handleVerify}>Verify OTP</Button>
//       </div>
//     </div>
//   );
// };

// export default VerifyOtp;
