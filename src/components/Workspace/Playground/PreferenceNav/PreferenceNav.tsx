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

  const handleFullScreen = () => {
    if (isFullScreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    } else {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    function exitHandler() {
      if (!document.fullscreenElement) {
        setIsFullScreen(false);
        return;
      }
      setIsFullScreen(true);
    }

    // Add event listeners for fullscreen changes
    if (document.addEventListener) {
      document.addEventListener('fullscreenchange', exitHandler);
      document.addEventListener('webkitfullscreenchange', exitHandler);
      document.addEventListener('mozfullscreenchange', exitHandler);
      document.addEventListener('MSFullscreenChange', exitHandler);
    }

    return () => {
      // Cleanup event listeners
      if (document.removeEventListener) {
        document.removeEventListener('fullscreenchange', exitHandler);
        document.removeEventListener('webkitfullscreenchange', exitHandler);
        document.removeEventListener('mozfullscreenchange', exitHandler);
        document.removeEventListener('MSFullscreenChange', exitHandler);
      }
    };
  }, []);

  const getLanguageName = (langId: number) => {
    switch (langId) {
      case 54: return 'C++';
      case 71: return 'Python';
      case 62: return 'Java';
      case 63: return 'JavaScript';
      case 50: return 'C';
      default: return `Language ${langId}`;
    }
  };

  return (
    <>
      <div className="flex justify-between items-center p-2 bg-charcoalBlack border-b border-slate700">
        <div className="text-softSilver text-sm font-medium">
          Language: {getLanguageName(settings.languageId)}
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="p-1.5 hover:bg-deepPlum rounded transition-colors duration-200"
            onClick={() => setSettings({ ...settings, settingsModalIsOpen: true })}
            title="Settings"
          >
            <AiOutlineSetting className="text-softSilver text-lg" />
          </button>
          <button
            className="p-1.5 hover:bg-deepPlum rounded transition-colors duration-200"
            onClick={handleFullScreen}
            title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
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
        <SettingsModal settings={settings} setSettings={setSettings} />
      )}
    </>
  );
};

export default PreferenceNav;
            