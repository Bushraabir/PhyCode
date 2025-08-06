import React, { useState } from "react";
import Split from "react-split";
import ProblemDescription from "./ProblemDescription/ProblemDescription";
import Playground from "./Playground/Playground";
import { Problem } from "@/utils/types/problem";
import Confetti from "react-confetti";
import useWindowSize from "@/hooks/useWindowSize";

type WorkspaceProps = {
  problem: Problem;
};

/**
 * Workspace component
 * Renders problem description on the left and code playground on the right
 * with a split-pane layout and optional confetti celebration.
 */
const Workspace: React.FC<WorkspaceProps> = ({ problem }) => {
  // Get viewport dimensions for confetti canvas sizing
  const { width, height } = useWindowSize();

  // Local success state for triggering confetti
  const [success, setSuccess] = useState(false);
  // Whether the problem has been solved (passed to description)
  const [solved, setSolved] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-charcoalBlack overflow-hidden">
      <Split
        className="split h-full flex"
        sizes={[50, 50]}    // initial split ratios: 50% / 50%
        minSize={300}      // minimum pane width in px
        gutterSize={30}    // width of draggable gutter
        gutterAlign="center"
        snapOffset={30}
        gutter={(index, direction) => {
          const gutterEl = document.createElement("div");
          gutterEl.className = `gutter gutter-${direction}`;
          gutterEl.innerHTML = "<div class='gutter-dots'><span></span><span></span><span></span></div>";
          return gutterEl;
        }}
      >
        {/* Left pane: Problem Description */}
        <div className="pane-left bg-slateBlack p-6 overflow-y-auto">
          <ProblemDescription problem={problem} _solved={solved} />
        </div>

        {/* Right pane: Code Playground */}
        <div className="pane-right bg-slateBlack p-6 overflow-y-auto relative">
          <Playground
            problem={problem}
            setSuccess={setSuccess}
            setSolved={setSolved}
          />

          {/* Confetti celebration on success */}
          {success && (
            <Confetti
              gravity={0.3}
              tweenDuration={4000}
              width={width / 2 - 20}   // half viewport minus padding
              height={height - 94}      // account for header/navbar
            />
          )}
        </div>
      </Split>

      {/* Custom styles for gutter dots */}
      <style jsx>{`
        .gutter {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #1f2937;
          cursor: col-resize;
          /* match gutterSize width */
          width: 30px;
        }
        .gutter-dots {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .gutter-dots span {
          width: 6px;
          height: 6px;
          background-color: #94a3b8;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default Workspace;