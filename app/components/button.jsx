import { Plus } from "lucide-react";

function OrangePlusButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Add"
      className="
        h-11 w-11 rounded-xl
        bg-orange-500 text-black
        flex items-center justify-center
        border border-orange-500/60
        hover:bg-orange-400
        active:scale-[0.98]
        transition
      "
    >
      <Plus className="h-5 w-5" />
    </button>
  );
}

export default OrangePlusButton;
