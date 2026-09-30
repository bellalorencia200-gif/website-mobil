import { useState } from "react";
import axios from "../api/axiosInstance";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function DaftarModal({ setLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError("Email tidak boleh kosong");
    } else if (!emailRegex.test(value)) {
      setEmailError("Format email tidak valid, contoh: nama@gmail.com");
    } else {
      setEmailError("");
    }
  };

  const validateFullName = (value) => {
    if (!value) {
      setFullNameError("Nama lengkap tidak boleh kosong");
    } else if (value.trim().length < 3) {
      setFullNameError("Nama Lengkap Minimal 3 karakter");
    } else {
      setFullNameError("");
    }
  };

  const validateUsername = (value) => {
    if (!value) {
      setUsernameError("Username tidak boleh kosong");
    } else if (value.trim().length < 4) {
      setUsernameError("Username minimal 4 karakter");
    } else {
      setUsernameError("");
    }
  };

  const validatePassword = (value) => {
    if (!value) {
      setPasswordError("password tidak boleh kosong");
    } else if (value.length < 6) {
      setPasswordError("Password minimal 6 karakter");
    } else {
      setPasswordError("");
    }
  };

  const validateConfirmPassword = (value) => {
    if (!value) {
      setConfirmPasswordError("Konfirmasi password tidak boleh kosong");
    } else if (value !== password) {
      setConfirmPasswordError("Password dan konfirmasi password tidak cocok");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleDaftar = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("password dan konfirmasi password tidak cocok");

      return;
    }
    setLoading(true);
    axios
      .post("/api/auth/register", {
        username,
        password,
        email,
        fullName,
      })

      .then((response) => {
        alert(response.data.message);
        document.getElementById("my_modal_2").close();
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setLoggedIn(true);
      })

      .catch((error) => {
        alert(error.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <dialog id="my_modal_2" className="modal">
      <div className="modal-box w-[92%] max-w-md rounded-2xl p-3 sm:p-5 border-t-4 border-b-4 border-[#8F0712] md:w-11/12 md:max-w-lg md:rounded-2xl">
        <h3 className="font-bold text-lg sm:text-xl text-[#8F0712]">Daftar</h3>
        <p className="text-xs sm:text-sm text-gray-500 mb-1.5">
          Daftar dan mulai jual beli mobil bersama MobilKu
        </p>
        <form
          className="flex flex-col gap-1.5 sm:gap-2"
          onSubmit={handleDaftar}
        >
          <label className="block text-xs sm:text-sm">Nama Lengkap</label>
          <input
            type="text"
            placeholder="Nama Lengkap"
            className="input input-bordered input-sm sm:input-md w-full text-sm sm:text-base focus:outline-none focus:border-[#8F0712] focus:ring-1 focus:ring-[#8F0712]"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            onBlur={(e) => validateFullName(e.target.value)}
          />
          {fullNameError && (
            <p className="text-red-600 text-xs">{fullNameError}</p>
          )}
          <label className="block text-xs sm:text-sm">Email</label>
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered input-sm sm:input-md w-full text-sm sm:text-base focus:outline-none focus:border-[#8F0712] focus:ring-1 focus:ring-[#8F0712]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={(e) => validateEmail(e.target.value)}
          />
          {emailError && <p className="text-red-600 text-xs">{emailError}</p>}
          <label className="block text-xs sm:text-sm">Username</label>

          <input
            type="text"
            placeholder="Username"
            className="input input-bordered input-sm sm:input-md w-full text-sm sm:text-base focus:outline-none focus:border-[#8F0712] focus:ring-1 focus:ring-[#8F0712]"
            autoComplete="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={(e) => validateUsername(e.target.value)}
          />
          {usernameError && (
            <p className="text-red-600 text-xs">{usernameError}</p>
          )}

          <label className="block text-xs sm:text-sm">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input input-bordered input-sm sm:input-md w-full pr-10 text-sm sm:text-base focus:outline-none focus:border-[#8F0712] focus:ring-1 focus:ring-[#8F0712]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={(e) => validatePassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {passwordError && (
            <p className="text-red-600 text-xs">{passwordError}</p>
          )}

          <label className="block text-xs sm:text-sm">
            Konfirmasi Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Konfirmasi Password"
              className="input input-bordered input-sm sm:input-md w-full pr-10 text-sm sm:text-base focus:outline-none focus:border-[#8F0712] focus:ring-1 focus:ring-[#8F0712]"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={(e) => validateConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {confirmPasswordError && (
            <p className="text-red-600 text-xs">{confirmPasswordError}</p>
          )}

          <button
            className="btn border-none text-white text-sm sm:text-base bg-gradient-to-r from-[#b3141c] via-[#96131a] to-[#7a0e12] hover:brightness-110 transition mt-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Daftar"
            )}
          </button>
        </form>
        <p className="text-center text-xs sm:text-sm text-gray-500 mt-1.5">
          Sudah punya akun?{" "}
          <button
            type="button"
            onClick={() => {
              document.getElementById("my_modal_2").close();
              document.getElementById("my_modal_1").showModal();
            }}
            className="text-[#8F0712] font-semibold hover:underline"
          >
            Silakan login di sini
          </button>
        </p>
        <div className="modal-action mt-1.5">
          <form method="dialog">
            <button className="btn btn-sm">Tutup</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
export default DaftarModal;