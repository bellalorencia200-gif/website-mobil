import { useState } from "react";
import axios from "../api/axiosInstance";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function LoginModal({ setLoggedIn }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [identifierError, setIdentifierError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateIdentifier = (value) => {
    if (!value) {
      setIdentifierError("Email atau username tidak boleh kosong");
    } else {
      setIdentifierError("");
    }
  };

  const validatePassword = (value) => {
    if (!value) {
      setPasswordError("Password tidak boleh kosong");
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("/api/auth/login", {
        password,
        identifier,
      })

      .then((response) => {
        alert(response.data.message);
        document.getElementById("my_modal_1").close();
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

  const handleGoToDaftar = () => {
    document.getElementById("my_modal_1").close();
    document.getElementById("my_modal_2").showModal();
  };

  return (
    <dialog id="my_modal_1" className="modal">
<div className="modal-box w-[92%] max-w-sm sm:max-w-md rounded-2xl p-5 sm:p-8 border-t-4 border-b-4 border-[#8F0712]">
          <h3 className="font-bold text-lg sm:text-xl text-[#8F0712]">Login</h3>
        <p className="py-2 text-xs sm:text-sm text-gray-500">
          Masuk Ke Akun Mobilku
        </p>
        <form
          className="flex flex-col gap-2.5 sm:gap-3 mt-3 sm:mt-4"
          onSubmit={handleLogin}
        >
          <label className="block mt-1 text-sm sm:text-base">
            Email atau Username
          </label>
          <input
            type="text"
            placeholder="email atau username"
            className="input input-bordered w-full text-sm sm:text-base focus:outline-none focus:border-[#8F0712] focus:ring-1 focus:ring-[#8F0712]"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            onBlur={(e) => validateIdentifier(e.target.value)}
          />
          {identifierError && (
            <p className="text-red-600 text-xs">{identifierError}</p>
          )}

          <label className="block mt-1 text-sm sm:text-base">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="password"
              className="input input-bordered w-full pr-10 text-sm sm:text-base focus:outline-none focus:border-[#8F0712] focus:ring-1 focus:ring-[#8F0712]"
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

          <button
            className="btn border-none text-white text-sm sm:text-base bg-gradient-to-r from-[#b3141c] via-[#96131a] to-[#7a0e12] hover:brightness-110 transition"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Login"
            )}
          </button>

          <p className="text-center text-xs sm:text-sm text-gray-500 mt-2">
            Belum punya akun?{" "}
            <button
              type="button"
              onClick={handleGoToDaftar}
              className="text-[#8F0712] font-semibold hover:underline cursor-pointer"
            >
              Daftar di sini
            </button>
          </p>
        </form>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-sm sm:btn-md">Tutup</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
export default LoginModal;