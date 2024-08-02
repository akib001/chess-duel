import { GameHistory } from "../../utils/common.interface";
import { generateGameNotation } from "../../utils/gameHistoryUtils";

interface HistoryProps {
  gameHistories: Array<GameHistory>;
  gameHistoryIndex: number | null;
  onChangeHistory: (index: number) => void;
}

export default function HistoryTable({
  gameHistories,
  gameHistoryIndex,
  onChangeHistory,
}: HistoryProps) {
  
  return (
    <div className="bg-[#262421] p-2 rounded-lg h-[calc(100%-45px)]">
      <table className="border-collapse w-full table-auto text-sm">
        <caption className="text-slate-500 dark:text-slate-400 pb-4 text-sm caption-top">
          Game Moves History
        </caption>
        <thead>
          <tr>
            <th className="border dark:border-slate-600 font-medium p-1 text-slate-400 dark:text-slate-200 text-left">
              Serial
            </th>
            <th className="border dark:border-slate-600 font-medium p-1  text-slate-400 dark:text-slate-200 text-left">
              White
            </th>
            <th className="border dark:border-slate-600 font-medium p-1 text-slate-400 dark:text-slate-200 text-left">
              Black
            </th>
          </tr>
        </thead>
        <tbody className="">
          {generateGameNotation(gameHistories)?.map((item, index) => (
            <tr key={index}>
              <td className="border border-slate-200 dark:border-slate-600 p-1 text-slate-500 dark:text-slate-400 w-12">
                {item.serial}
              </td>
              <td className="border border-slate-200 dark:border-slate-600 p-1 text-slate-500 dark:text-slate-400">
                <button
                  className={`rounded-sm px-1 ${
                    item.white.historyIndex === gameHistoryIndex
                      ? "bg-white text-black"
                      : ""
                  }`}
                  onClick={() => onChangeHistory(item.white.historyIndex)}
                >
                  {item.white.notation}
                </button>
              </td>
              <td className="border border-slate-200 dark:border-slate-600 p-1  text-slate-500 dark:text-slate-400">
                <button
                  className={`rounded-sm px-1 ${
                    item.black.historyIndex === gameHistoryIndex
                      ? "bg-white text-black"
                      : ""
                  }`}
                  onClick={() => onChangeHistory(item.black.historyIndex)}
                >
                  {item.black.notation}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
