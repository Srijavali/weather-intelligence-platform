interface Props {
  onClick: () => void;
}

function LocationButton({
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className="
        w-full
        sm:w-auto
        bg-green-500
        md:hover:bg-green-600
        text-white
        px-6
        py-3
        rounded-xl
        font-medium
        transition-colors
        duration-300
        min-h-[48px]
      "
    >
      📍 Use Current Location
    </button>
  );
}

export default LocationButton;