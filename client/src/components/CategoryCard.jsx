import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function CategoryCard({ name, logo, categoryId, count }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();

  const target = categoryId
    ? `/katalog?kategori=${categoryId}`
    : `/katalog?merek=${name}`;

  const handleClick = (e) => {
    e.preventDefault();
    setIsNavigating(true);
    setTimeout(() => {
      navigate(target);
      setIsNavigating(false);
    }, 400);
  };

  return (
    <>
      <Link
        to={target}
        onClick={handleClick}
        className="group relative flex flex-col items-center justify-center 
           p-5 md:p-6 bg-white rounded-2xl 
           border border-amber-200/70 shadow-sm
           hover:shadow-[0_10px_30px_-8px_rgba(217,168,92,0.4)]
           hover:border-amber-400
           hover:-translate-y-1.5
           transition-all duration-300 overflow-hidden"
      >
        {/* Efek Kilau Emas */}
        <span className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <span className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-[#D9A85C]/30 to-transparent skew-x-[-15deg] group-hover:left-full transition-all duration-1000 ease-in-out" />
        </span>

        {/* Icon */}
        <div className="w-20 h-14 md:w-24 md:h-16 mb-3 flex items-center justify-center">
          <img
            src={logo}
            alt={name}
            className="max-h-full max-w-full object-contain 
                 group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        <span className="relative inline-block text-[13px] md:text-sm font-bold uppercase tracking-[0.08em] text-gray-700 group-hover:text-[#B5321A] transition-colors duration-300">
          {name}
          <span className="absolute left-1/2 -bottom-1.5 h-[2px] w-0 bg-gradient-to-r from-[#D9A85C] to-[#B5321A] group-hover:w-full group-hover:left-0 transition-all duration-300" />
        </span>
      </Link>

      {/* Loading Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <span className="loading loading-spinner loading-lg text-white"></span>
        </div>
      )}
    </>
  );
}

export default CategoryCard;
