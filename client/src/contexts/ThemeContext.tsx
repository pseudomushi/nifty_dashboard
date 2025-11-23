import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeName = "light" | "dark" | "dracula" | "nord" | "solarized-light" | "solarized-dark" | "monokai" | "gruvbox";

export interface ThemeOption {
  name: ThemeName;
  label: string;
  description: string;
  preview: {
    background: string;
    foreground: string;
    primary: string;
    accent: string;
  };
}

export const AVAILABLE_THEMES: ThemeOption[] = [
  {
    name: "light",
    label: "Light",
    description: "Clean and bright theme for daytime trading",
    preview: {
      background: "#ffffff",
      foreground: "#0a0a0a",
      primary: "#2563eb",
      accent: "#10b981",
    },
  },
  {
    name: "dark",
    label: "Dark",
    description: "Easy on the eyes for night trading sessions",
    preview: {
      background: "#0a0a0a",
      foreground: "#fafafa",
      primary: "#3b82f6",
      accent: "#10b981",
    },
  },
  {
    name: "dracula",
    label: "Dracula",
    description: "Dark theme with vibrant purple and pink accents",
    preview: {
      background: "#282a36",
      foreground: "#f8f8f2",
      primary: "#bd93f9",
      accent: "#ff79c6",
    },
  },
  {
    name: "nord",
    label: "Nord",
    description: "Arctic, north-bluish color palette",
    preview: {
      background: "#2e3440",
      foreground: "#eceff4",
      primary: "#88c0d0",
      accent: "#a3be8c",
    },
  },
  {
    name: "solarized-light",
    label: "Solarized Light",
    description: "Precision colors for machines and people",
    preview: {
      background: "#fdf6e3",
      foreground: "#657b83",
      primary: "#268bd2",
      accent: "#859900",
    },
  },
  {
    name: "solarized-dark",
    label: "Solarized Dark",
    description: "Dark variant of the Solarized theme",
    preview: {
      background: "#002b36",
      foreground: "#839496",
      primary: "#268bd2",
      accent: "#859900",
    },
  },
  {
    name: "monokai",
    label: "Monokai",
    description: "Warm and vibrant coding-inspired theme",
    preview: {
      background: "#272822",
      foreground: "#f8f8f2",
      primary: "#66d9ef",
      accent: "#a6e22e",
    },
  },
  {
    name: "gruvbox",
    label: "Gruvbox",
    description: "Retro groove with warm earthy tones",
    preview: {
      background: "#282828",
      foreground: "#ebdbb2",
      primary: "#fe8019",
      accent: "#b8bb26",
    },
  },
];

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  availableThemes: ThemeOption[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeName;
  switchable?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    if (switchable) {
      const stored = localStorage.getItem("theme") as ThemeName;
      return stored && AVAILABLE_THEMES.some(t => t.name === stored) ? stored : defaultTheme;
    }
    return defaultTheme;
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    AVAILABLE_THEMES.forEach(t => {
      root.classList.remove(t.name);
    });
    
    // Add current theme class
    root.classList.add(theme);
    
    // For backward compatibility, also add 'dark' class for dark-based themes
    const darkThemes: ThemeName[] = ["dark", "dracula", "nord", "solarized-dark", "monokai", "gruvbox"];
    if (darkThemes.includes(theme)) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    if (switchable) {
      localStorage.setItem("theme", theme);
    }
  }, [theme, switchable]);

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, availableThemes: AVAILABLE_THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
