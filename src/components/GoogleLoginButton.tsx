import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

const GoogleLoginButton = () => {
  const handleSuccess = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse.credential;
      if (!idToken) return;

      const decoded: any = jwtDecode(idToken);
      console.log("Google user:", decoded);

      // Send to your .NET backend
      const res = await api.post("/auth/google", { idToken });

      const jwt = res.data.token;
      localStorage.setItem("token", jwt);
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed");
    }
  };

  return (
    <div className="mt-6">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => alert("Google Login Failed")}
      />
    </div>
  );
};

export default GoogleLoginButton;
