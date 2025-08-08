import React, { useState, useEffect } from 'react';
import {
  AiOutlineFullscreen,
  AiOutlineFullscreenExit,
  AiOutlineSetting,
} from 'react-icons/ai';
import { ISettings } from '../Playground';
import SettingsModal from '@/components/Modals/SettingsModal';

type PreferenceNavProps = {
  settings: ISettings;
  setSettings: React.Dispatch<React.SetStateAction<ISettings>>;
};

const PreferenceNav: React.FC<PreferenceNavProps> = ({ settings, setSettings }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreen = () => {
    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    function exitHandler(e: any) {
      if (!document.fullscreenElement) {
        setIsFullScreen(false);
        return;
      }
      setIsFullScreen(true);
    }

    if (document.addEventListener) {
      document.addEventListener('fullscreenchange', exitHandler);
      document.addEventListener('webkitfullscreenchange', exitHandler);
      document.addEventListener('mozfullscreenchange', exitHandler);
      document.addEventListener('MSFullscreenChange', exitHandler);
    }

    return () => {
      if (document.removeEventListener) {
        document.removeEventListener('fullscreenchange', exitHandler);
        document.removeEventListener('webkitfullscreenchange', exitHandler);
        document.removeEventListener('mozfullscreenchange', exitHandler);
        document.removeEventListener('MSFullscreenChange', exitHandler);
      }
    };
  }, [isFullScreen]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguageId = Number(e.target.value);
    setSettings((prev) => ({ ...prev, languageId: newLanguageId }));
  };

  return (
    <div className="flex justify-between items-center p-2 bg-charcoalBlack">
      <div className="flex items-center">
        <select
          value={settings.languageId || 71}
          onChange={handleLanguageChange}
          className="px-2 py-1 bg-deepPlum text-softSilver rounded-lg hover:bg-tealBlue transition text-sm"
        >
          <option value={54}>C++</option>
          <option value={71}>Python</option>
        </select>
      </div>
      <div className="flex space-x-2">
        <button
          className="p-1 hover:bg-deepPlum rounded transition"
          onClick={() => setSettings({ ...settings, settingsModalIsOpen: true })}
        >
          <AiOutlineSetting className="text-softSilver text-lg" />
        </button>
        <button
          className="p-1 hover:bg-deepPlum rounded transition"
          onClick={handleFullScreen}
        >
          {isFullScreen ? (
            <AiOutlineFullscreenExit className="text-softSilver text-lg" />
          ) : (
            <AiOutlineFullscreen className="text-softSilver text-lg" />
          )}
        </button>
      </div>
      {settings.settingsModalIsOpen && (
        <SettingsModal settings={settings} setSettings={setSettings} />
      )}
    </div>
  );
};

export default PreferenceNav;