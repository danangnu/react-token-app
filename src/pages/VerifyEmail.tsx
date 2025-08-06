import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying...");
  const token = searchParams.get("token");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/verify-email?token=${token}`);
        setMessage(res.data.message || "Email verified.");
      } catch (err: any) {
        setMessage(err.response?.data || "Verification failed.");
      }
    };

    if (token) verify();
    else setMessage("No token found.");
  }, [token]);

  return (
    <div className="text-white min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center max-w-md">
        <h1 className="text-xl font-bold mb-4">Email Verification</h1>
        <p>{message}</p>
      </div>
    </div>
  );
}
