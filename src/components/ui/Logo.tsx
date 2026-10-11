import { LOGO_URL } from "../../lib/data";
import { cn } from "../../utils/cn";

type Props = {
  /** Wrapper classes */
  className?: string;
  /** Height classes for the image (width follows the 1106×362 ratio) */
  imgClassName?: string;
  /** Puts the logo on a soft off-white plate so it stays legible over deep-green backgrounds */
  plate?: boolean;
};

/** The official solarshop logo. */
export default function Logo({ className, imgClassName = "h-9 sm:h-10", plate = false }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center",
        plate && "rounded-2xl bg-canvas px-3.5 py-2.5 shadow-lg shadow-forest/25",
        className
      )}
    >
      <img
        src={LOGO_URL}
        alt="solarshop"
        decoding="async"
        draggable={false}
        className={cn("w-auto select-none object-contain", imgClassName)}
      />
    </span>
  );
}
