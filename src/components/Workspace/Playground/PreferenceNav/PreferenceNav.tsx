import React, { useState, useEffect } from 'react';
import { AiOutlineFullscreen, AiOutlineFullscreenExit, AiOutlineSetting } from 'react-icons/ai';
import SettingsModal from '@/components/Modals/SettingsModal';

export interface ISettings {
  fontSize: string;
  settingsModalIsOpen: boolean;
  dropdownIsOpen: boolean;
  languageId: number;
}

type PreferenceNavProps = {
  settings: ISettings;
  setSettings: React.Dispatch<React.SetStateAction<ISettings>>;
};

const PreferenceNav: React.FC<PreferenceNavProps> = ({ settings, setSettings }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreen = async () => {
    try {
      if (isFullScreen) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      } else {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      }
    } catch (error) {
      console.warn('Fullscreen operation failed:', error);
      // Fallback: toggle state anyway for UI consistency
      setIsFullScreen(!isFullScreen);
    }
  };

  // Fixed memory leak: properly cleanup event listeners
  useEffect(() => {
    function exitHandler() {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullScreen(isCurrentlyFullscreen);
    }

    // All possible fullscreen change events for cross-browser compatibility
    const events = [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'MSFullscreenChange'
    ];

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, exitHandler, { passive: true });
    });

    // Initial check
    setIsFullScreen(!!document.fullscreenElement);

    // Cleanup function to remove all event listeners
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, exitHandler);
      });
    };
  }, []); // Empty dependency array ensures this runs once on mount

  const getLanguageName = (langId: number): string => {
    switch (langId) {
      case 54: return 'C++';
      case 71: return 'Python';
      case 62: return 'Java';
      case 63: return 'JavaScript';
      case 50: return 'C';
      case 72: return 'Ruby';
      case 73: return 'Rust';
      case 74: return 'TypeScript';
      default: return `Language ${langId}`;
    }
  };

  const getLanguageVersion = (langId: number): string => {
    switch (langId) {
      case 54: return 'GCC 9.2.0';
      case 71: return '3.8.1';
      case 62: return 'OpenJDK 13.0.1';
      case 63: return 'Node.js 12.14.0';
      case 50: return 'GCC 9.2.0';
      default: return '';
    }
  };

  return (
    <>
      <div className="flex justify-between items-center p-2 bg-charcoalBlack border-b border-slate700">
        <div className="flex items-center space-x-4">
          <div className="text-softSilver text-sm font-medium">
            {getLanguageName(settings.languageId)}
            {getLanguageVersion(settings.languageId) && (
              <span className="text-xs text-gray-400 ml-1">
                ({getLanguageVersion(settings.languageId)})
              </span>
            )}
          </div>
          
          {settings.languageId === 54 && (
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span className="text-xs text-green-400">Ready</span>
            </div>
          )}
          
          {settings.languageId !== 54 && (
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-red-400 rounded-full"></span>
              <span className="text-xs text-red-400">Not Supported</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Fullscreen indicator */}
          {isFullScreen && (
            <div className="text-xs text-tealBlue px-2 py-1 bg-tealBlue/10 rounded">
              Fullscreen
            </div>
          )}
          
          <button
            className="p-1.5 hover:bg-deepPlum rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-tealBlue"
            onClick={() => setSettings(prev => ({ ...prev, settingsModalIsOpen: true }))}
            title="Settings"
            aria-label="Open settings"
          >
            <AiOutlineSetting className="text-softSilver text-lg" />
          </button>
          
          <button
            className="p-1.5 hover:bg-deepPlum rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-tealBlue"
            onClick={handleFullScreen}
            title={isFullScreen ? "Exit Fullscreen (ESC)" : "Enter Fullscreen (F11)"}
            aria-label={isFullScreen ? "Exit fullscreen mode" : "Enter fullscreen mode"}
          >
            {isFullScreen ? (
              <AiOutlineFullscreenExit className="text-softSilver text-lg" />
            ) : (
              <AiOutlineFullscreen className="text-softSilver text-lg" />
            )}
          </button>
        </div>
      </div>
      
      {settings.settingsModalIsOpen && (
        <SettingsModal 
          settings={settings} 
          setSettings={setSettings} 
        />
      )}
    </>
  );
};

export default PreferenceNav;