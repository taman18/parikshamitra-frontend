export default function Spinner({ size = 24, className = '' }) {
    return (
      <div
        className={`animate-spin rounded-full border-4 border-t-transparent border-black ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  