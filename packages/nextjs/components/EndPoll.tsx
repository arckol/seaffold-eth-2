import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function EndPoll({ pollId }: { pollId: bigint }) {
  // Хук для записи данных в смарт-контракт
  const { writeContractAsync, isMining } = useScaffoldWriteContract({
    contractName: "VotingContract", // Имя контракта
  });

  // Функция для завершения голосования
  const handleEndPoll = async () => {
    try {
      // Выполняем транзакцию на завершение голосования
      await writeContractAsync({
        functionName: "endPoll", // Имя функции контракта для завершения голосования
        args: [pollId], // Аргумент: идентификатор голосования
      });
      alert("Голосование завершено!");
    } catch (error) {
      console.error(error);
      alert("Ошибка при завершении голосования.");
    }
  };

  return (
    <div className="p-6 bg-[#FF7272] text-white rounded-lg shadow-lg mt-4 max-w-md mx-auto">
      <h3 className="text-2xl font-bold mb-4">Завершить голосование</h3>
      <p className="mb-4">Вы уверены, что хотите завершить голосование?</p>
      <button
        onClick={handleEndPoll} // Завершаем голосование при клике
        disabled={isMining} // Отключаем кнопку, если процесс в ожидании
        className={`px-6 py-3 text-lg rounded-lg shadow-md transition-colors duration-200 ${isMining ? "bg-gray-500" : "bg-red-700 hover:bg-red-800"}`}
      >
        {isMining ? "Завершение..." : "Завершить голосование"}
      </button>
    </div>
  );
}
