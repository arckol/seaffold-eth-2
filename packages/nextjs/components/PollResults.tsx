import { useState } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function PollResults() {
  const [pollId, setPollId] = useState<number>(-1);

  // Чтение результатов голосования
  const { data } = useScaffoldReadContract({
    contractName: "VotingContract", // Имя контракта
    functionName: "getResults", // Функция для получения результатов
    args: [BigInt(pollId)], // Идентификатор голосования
  });

  return (
    <div className="p-8 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg shadow-xl mx-auto max-w-xl">
      <h3 className="text-3xl font-bold mb-6 text-center">Результаты голосования</h3>
      <input
        type="number"
        placeholder="ID голосования"
        onChange={e => setPollId(e.target.value ? Number(e.target.value) : -1)}
        className="w-full p-3 mb-4 text-white bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {data && (
        <div className="p-4 bg-gradient-to-r from-yellow-400 to-red-500 text-white rounded-lg shadow-lg w-full mx-auto">
          <ul>
            {data[0].map((option: string, idx: number) => (
              <li key={idx} className="text-lg mb-2">
                {option}: {Number(data[1][idx])} голосов
                {/*Показываем результат для каждого варианта*/}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
