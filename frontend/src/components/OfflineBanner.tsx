interface Props {
  visible: boolean;
}

function OfflineBanner({
  visible,
}: Props) {
  if (!visible) {
    return null;
  }

  return (
    <div
      className="
        sticky
        top-0
        z-50
        bg-red-600
        text-white
        text-center
        py-3
        px-4
        text-sm
        sm:text-base
        font-medium
        shadow-md
      "
      role="alert"
    >
      📡 No internet connection
    </div>
  );
}

export default OfflineBanner;