import { motion } from "framer-motion";

const IconUpload: React.FC = () => {
  return (
    <svg
      width="128"
      height="160"
      viewBox="0 0 128 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 8C0 3.58172 3.58172 0 8 0H120C124.418 0 128 3.58172 128 8C128 12.4183 124.418 16 120 16H8C3.58172 16 0 12.4183 0 8Z"
        fill="var(--icon-dark-gray)"
      />
      <motion.path
        animate={{ y: [0, -20, 0] }}
        transition={{
          ease: "easeInOut",
          duration: 1,
          repeat: Infinity,
        }}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M60.9377 32.607C60.0031 32.9937 59.127 33.5651 58.3651 34.3213C58.3567 34.3296 58.3484 34.3379 58.3401 34.3462L10.3431 82.3431C7.21895 85.4673 7.21895 90.5327 10.3431 93.6569C13.4673 96.781 18.5327 96.781 21.6569 93.6569L56 59.3137V152C56 156.418 59.5817 160 64 160C68.4183 160 72 156.418 72 152V59.3137L106.343 93.6569C109.467 96.781 114.533 96.781 117.657 93.6569C120.781 90.5327 120.781 85.4673 117.657 82.3431L69.6599 34.3462C69.6516 34.3379 69.6433 34.3296 69.6349 34.3213C68.1903 32.8877 66.2016 32.0016 64.006 32C64.004 32 64.002 32 64 32C63.998 32 63.996 32 63.994 32C62.9115 32.0008 61.8792 32.2166 60.9377 32.607Z"
        fill="var(--icon-dark-gray)"
      />
    </svg>
  );
};

export default IconUpload;
