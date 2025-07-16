import { useEffect } from "react";

const AppleLoginButton = () => {
  useEffect(() => {
    if ((window as any).AppleID) {
      (window as any).AppleID.auth.init({
        clientId: "com.your.bundle.id", // Apple service ID (from Apple Dev console)
        scope: "name email",
        redirectURI: "https://your-frontend.com", // Must match in Apple Dev config
        usePopup: true,
      });
    }
  }, []);

  const handleAppleLogin = async () => {
    try {
      const response = await (window as any).AppleID.auth.signIn();
      const identityToken = response.authorization.id_token;

      // Send to .NET backend
      const res = await fetch("https://your-backend.com/auth/apple-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identityToken }),
      });

      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard"; // or use `navigate`
      } else {
        alert("Apple Login failed");
      }
    } catch (err) {
      console.error("Apple Login error", err);
      alert("Apple Sign-In failed");
    }
  };

  return (
    <button
      onClick={handleAppleLogin}
      className="bg-black text-white py-2 px-4 rounded flex items-center gap-2 hover:bg-gray-800"
    >
       Sign in with Apple
    </button>
  );
};

export default AppleLoginButton;
