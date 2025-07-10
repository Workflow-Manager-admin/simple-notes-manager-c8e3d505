import React, { useState } from "react";

// PUBLIC_INTERFACE
function Auth({ onAuth }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  // Handle Supabase magic link (email sign-in).
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const { error } = await onAuth(email);
      if (error) throw error;
      setSent(true);
    } catch (err) {
      setError(err.message || "Failed to send login link.");
    }
  };

  if (sent) {
    return (
      <div className="auth-message">
        Check your email for a login link!
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={handleSignIn}>
      <input
        className="auth-email-input"
        type="email"
        placeholder="Email address"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <button className="btn btn-auth" type="submit">Sign In / Register</button>
      {error && <div className="auth-error">{error}</div>}
    </form>
  );
}

export default Auth;
