import React, { useState } from "react";
import { useTheme, type ThemeName, type ThemeOption } from "@/contexts/ThemeContext";
import { Check, Palette } from "lucide-react";

export default function ThemeSelector() {
  const { theme: currentTheme, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeSelect = (themeName: ThemeName) => {
    setTheme(themeName);
    setIsOpen(false);
  };

  const currentThemeOption = availableThemes.find(t => t.name === currentTheme);

  return (
    <div className="relative">
      {/* Theme Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card text-card-foreground border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
        aria-label="Select theme"
      >
        <Palette className="w-5 h-5" />
        <span className="hidden md:inline text-sm font-medium">
          {currentThemeOption?.label || "Theme"}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Content */}
          <div className="absolute right-0 mt-2 w-80 bg-card text-card-foreground border border-border rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="p-3 border-b border-border">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Select Theme
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Choose your preferred color scheme
              </p>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {availableThemes.map((themeOption: ThemeOption) => (
                <button
                  key={themeOption.name}
                  onClick={() => handleThemeSelect(themeOption.name)}
                  className={`w-full p-3 flex items-start gap-3 hover:bg-accent hover:text-accent-foreground transition-colors text-left ${
                    currentTheme === themeOption.name ? "bg-accent/50" : ""
                  }`}
                >
                  {/* Theme Preview */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border border-border shadow-sm">
                    <div className="grid grid-cols-2 h-full">
                      <div
                        style={{ backgroundColor: themeOption.preview.background }}
                        className="col-span-2 h-1/2"
                      />
                      <div
                        style={{ backgroundColor: themeOption.preview.primary }}
                        className="h-1/2"
                      />
                      <div
                        style={{ backgroundColor: themeOption.preview.accent }}
                        className="h-1/2"
                      />
                    </div>
                  </div>

                  {/* Theme Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">
                        {themeOption.label}
                      </span>
                      {currentTheme === themeOption.name && (
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {themeOption.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-2 border-t border-border bg-muted/50">
              <p className="text-xs text-muted-foreground text-center">
                Theme preference is saved automatically
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
