import { useMantineColorScheme, useComputedColorScheme } from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons-react";

export function LightDarkToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const scheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const toggle = () => setColorScheme(scheme === "light" ? "dark" : "light");

  return (
    <button
      onClick={toggle}
      className={`relative flex items-center h-8 w-25 rounded-full transition-colors duration-500
        ${scheme === "light" ? "bg-gradient-to-r from-yellow-200 to-yellow-400" : "bg-gradient-to-r from-indigo-900 to-gray-800"}
      `}
      aria-label="Toggle color scheme"
    >
      {/* Stars only in dark mode */}
      {scheme === "dark" && (
        <>
          <span className="absolute left-4 top-2 h-1 w-1 bg-white rounded-full opacity-80" />
          <span className="absolute left-8 top-3 h-1.5 w-1.5 bg-white rounded-full opacity-60" />
          <span className="absolute left-6 top-6 h-1 w-1 bg-white rounded-full opacity-70" />
        </>
      )}

      {/* Sliding knob */}
      <span
        className={`absolute flex items-center justify-center h-8 w-8 rounded-full bg-white shadow-md transition-transform duration-500
          ${scheme === "light" ? "translate-x-1" : "translate-x-11"}
        `}
      >
        {scheme === "light" ? (
          <IconSun size={16} className="text-yellow-500" />
        ) : (
          <IconMoonStars size={16} className="text-indigo-700" />
        )}
      </span>
    </button>
  );
}
