import React, { useState } from "react";
import { motion } from "motion/react";
import { ShieldCheck, ArrowRight, Lock, Mail, User, Phone, Eye, EyeOff } from "lucide-react";
import { Button, Input } from "./UI";
import { cn } from "../lib/utils";

export const Register = ({ onToggle, onSuccess }: { onToggle: () => void, onSuccess: () => void }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors: any = {};
    if (formData.username.length < 3) newErrors.username = "Username must be at least 3 characters";
    if (!formData.email.endsWith("@gmail.com")) newErrors.email = "Only @gmail.com addresses allowed";
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Phone must be 10 digits";
    
    const pass = formData.password;
    if (pass.length < 8) newErrors.password = "Min 8 characters required";
    else if (!/[A-Z]/.test(pass)) newErrors.password = "At least 1 uppercase required";
    else if (!/[a-z]/.test(pass)) newErrors.password = "At least 1 lowercase required";
    else if (!/\d/.test(pass)) newErrors.password = "At least 1 number required";
    else if (!/[!@#$%^&*]/.test(pass)) newErrors.password = "At least 1 special character required";

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = () => {
    const pass = formData.password;
    if (!pass) return { label: "", color: "bg-white/10", width: "w-0" };
    if (pass.length < 6) return { label: "Weak", color: "bg-red-500", width: "w-1/3" };
    if (pass.length < 10 || !/[!@#$%^&*]/.test(pass)) return { label: "Medium", color: "bg-yellow-500", width: "w-2/3" };
    return { label: "Strong", color: "bg-green-500", width: "w-full" };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        onSuccess();
      } else {
        setErrors({ server: data.error });
      }
    } catch (err) {
      setErrors({ server: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-transparent relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-10 space-y-8 relative z-10"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-500/20 orange-glow">
            <ShieldCheck className="text-orange-500" size={32} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Create Account</h2>
          <p className="text-white/40">Join KodBank and start your fintech journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.server && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
              {errors.server}
            </div>
          )}

          <Input 
            label="Username" 
            placeholder="johndoe"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            error={errors.username}
          />
          
          <Input 
            label="Gmail Address" 
            type="email"
            placeholder="john@gmail.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />

          <Input 
            label="Phone Number" 
            type="tel"
            placeholder="10-digit number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            error={errors.phone}
          />

          <div className="space-y-2">
            <div className="relative">
              <Input 
                label="Password" 
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-white/20 hover:text-orange-500 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {/* Strength Indicator */}
            {formData.password && (
              <div className="space-y-1 px-1">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-bold">
                  <span className="text-white/40">Strength</span>
                  <span className={cn(
                    strength.label === "Weak" ? "text-red-400" : 
                    strength.label === "Medium" ? "text-yellow-400" : "text-green-400"
                  )}>{strength.label}</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: strength.width }}
                    className={cn("h-full transition-all duration-500", strength.color)}
                  />
                </div>
              </div>
            )}
          </div>

          <Input 
            label="Confirm Password" 
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
          />

          <Button 
            className="w-full" 
            size="lg" 
            isLoading={isLoading}
            disabled={Object.keys(errors).length > 0 && !errors.server}
          >
            Register Now
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-white/40">
            Already have an account?{" "}
            <button onClick={onToggle} className="text-orange-500 font-semibold hover:underline">
              Login
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export const Login = ({ onToggle, onSuccess, onForgotPassword }: { onToggle: () => void, onSuccess: (token: string) => void, onForgotPassword: () => void }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        onSuccess(data.token);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-transparent relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card p-10 space-y-8 relative z-10"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-500/20 orange-glow">
            <Lock className="text-orange-500" size={32} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome Back</h2>
          <p className="text-white/40">Securely access your KodBank account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <Input 
            label="Email Address" 
            type="email"
            placeholder="john@gmail.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          
          <Input 
            label="Password" 
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-white/40 hover:text-white transition-colors">
              <input type="checkbox" className="accent-orange-500" />
              Remember me
            </label>
            <button 
              type="button" 
              onClick={() => onForgotPassword()}
              className="text-orange-500 font-semibold hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <Button className="w-full" size="lg" isLoading={isLoading}>Sign In</Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-white/40">
            Don't have an account?{" "}
            <button onClick={onToggle} className="text-orange-500 font-semibold hover:underline">
              Register
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export const ResetPassword = ({ onSuccess, onBackToLogin }: { onSuccess: () => void, onBackToLogin: () => void }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    setError("");
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 3000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Reset failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-transparent relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card p-10 space-y-8 relative z-10"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-500/20 orange-glow">
            <Lock className="text-orange-500" size={32} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Reset Password</h2>
          <p className="text-white/40">Enter your new password below.</p>
        </div>

        {success ? (
          <div className="space-y-6 text-center">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400">
              Password reset successfully! Redirecting to login...
            </div>
            <Button onClick={onBackToLogin} variant="outline" className="w-full">Back to Login</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <Input 
              label="New Password" 
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <Input 
              label="Confirm New Password" 
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button className="w-full" size="lg" isLoading={isLoading}>Reset Password</Button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export const ForgotPassword = ({ onBackToLogin }: { onBackToLogin: () => void }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Request failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-transparent relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card p-10 space-y-8 relative z-10"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-500/20 orange-glow">
            <Mail className="text-orange-500" size={32} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Forgot Password</h2>
          <p className="text-white/40">We'll send you a link to reset your password.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm text-center">
              {message}
            </div>
          )}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <Input 
            label="Email Address" 
            type="email"
            placeholder="john@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={!!message}
          />

          <Button className="w-full" size="lg" isLoading={isLoading} disabled={!!message}>Send Reset Link</Button>
          
          <div className="text-center">
            <button onClick={onBackToLogin} className="text-sm text-white/40 hover:text-orange-500 transition-colors">
              Back to Login
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
