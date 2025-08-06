import React from "react";
import { BsChevronUp } from "react-icons/bs";

type EditorFooterProps = {
  handleSubmit: () => void;
};

const EditorFooter: React.FC<EditorFooterProps> = ({ handleSubmit }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full z-20 bg-slateBlack border-t border-slate700">
      <div className="mx-5 my-[10px] flex justify-between items-center">
        {/* Left group: Console toggle */}
        <button
          className="flex items-center space-x-2 px-3 py-1.5 bg-deepPlum text-softSilver text-sm font-medium rounded-lg hover:bg-tealBlue transition"
        >
          <span>Console</span>
          <BsChevronUp className="fill-softSilver transition-transform" />
        </button>

        {/* Right group: Run & Submit */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleSubmit}
            className="px-3 py-1.5 bg-deepPlum text-softSilver text-sm font-medium rounded-lg hover:bg-tealBlue transition focus:outline-none"
          >
            Run
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-1.5 bg-emeraldGreen text-softSilver text-sm font-medium rounded-lg hover:bg-tealBlue transition focus:outline-none"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorFooter;
