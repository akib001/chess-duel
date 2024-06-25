import { MoveHistory } from "../../utils/common.interface";
import { generateGameNotation } from "../../utils/gameHistoryUtils";

interface HistoryProps {
  index: number;
  gameHistory: MoveHistory[];
  children: React.ReactNode;
  onChangeHistory: (index: number) => void;
}

export default function HistoryTable({
  gameHistory,
  onChangeHistory,
}: HistoryProps) {
  console.log(
    "gameHistory notation------->",
    generateGameNotation(gameHistory)
  );

  return (
    <table className="border-collapse table-auto text-sm">
      <caption className="text-slate-500 dark:text-slate-400 pb-4 text-xs caption-top">
        Game Moves History
      </caption>
      <thead>
        <tr>
          <th className="border dark:border-slate-600 font-medium p-2 text-slate-400 dark:text-slate-200 text-left">
            Serial
          </th>
          <th className="border dark:border-slate-600 font-medium p-2  text-slate-400 dark:text-slate-200 text-left">
            White
          </th>
          <th className="border dark:border-slate-600 font-medium p-2 text-slate-400 dark:text-slate-200 text-left">
            Black
          </th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-slate-800">
        {generateGameNotation(gameHistory)?.map((item, index) => (
          <tr key={index}>
            <td className="border border-slate-200 dark:border-slate-600 p-2 text-slate-500 dark:text-slate-400">
              {item.serial}
            </td>
            <td className="border border-slate-200 dark:border-slate-600 p-2 text-slate-500 dark:text-slate-400">
              <button onClick={() => onChangeHistory(item.white.historyIndex)}>
                {" "}
                {item.white.notation}
              </button>
            </td>
            <td className="border border-slate-200 dark:border-slate-600 p-2  text-slate-500 dark:text-slate-400">
              <button onClick={() => onChangeHistory(item.black.historyIndex)}>
                {" "}
                {item.black.notation}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
