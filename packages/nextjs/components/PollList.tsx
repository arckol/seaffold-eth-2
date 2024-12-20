import EndPoll from "~~/components/EndPoll";
import HasUserVoted from "~~/components/HasUserVoted";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function PollList() {
  // Чтение количества существующих голосований
  const { data: pollCount } = useScaffoldReadContract({
    contractName: "VotingContract", // Имя контракта
    functionName: "getPollCount", // Имя функции для получения количества голосований
  });

  // Функция для рендеринга списка голосований
  const renderPolls = () => {
    if (!pollCount) return <p>Загрузка...</p>; // Пока данные не загружены, показываем индикатор загрузки
    const polls = [];
    for (let i: number = 0; i < pollCount; i++) {
      polls.push(<PollItem key={i} pollId={BigInt(i)} />); // Генерируем компоненты для каждого голосования
    }
    return polls;
  };

  return (
    <div className="p-8 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg shadow-xl mx-auto max-w-xl">
      <h2 className="text-3xl font-bold mb-6">Список голосований</h2>
      {pollCount && pollCount > 0 ? renderPolls() : <p className="text-xl text-center">Нет активных голосований</p>}
      {/*Если голосования есть, показываем их*/}
    </div>
  );
}

// Компонент для каждого отдельного голосования
function PollItem({ pollId }: { pollId: bigint }) {
  const { data } = useScaffoldReadContract({
    contractName: "VotingContract", // Имя контракта
    functionName: "getPollDetails", // Функция для получения данных голосования
    args: [BigInt(pollId)], // Идентификатор голосования
  });

  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "VotingContract", // Имя контракта
  });

  if (!data) return <p>Загрузка...</p>; // Пока данные не загружены, показываем индикатор

  const [question, options, , isActive] = data; // Получаем вопрос, варианты ответов и статус голосования
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6 transition-shadow hover:shadow-xl">
      <h3 className="text-2xl font-semibold text-gray-800">{question}</h3>
      <ul className="mt-4">
        {options.map((opt: string, idx: number) => (
          <li key={idx} className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-800">{opt}</span>
            {isActive && (
              <button
                onClick={() =>
                  writeContractAsync({
                    functionName: "vote", // Функция для голосования
                    args: [BigInt(pollId), BigInt(idx)], // По умолчанию голосуем за первый вариант
                  })
                } // Отправка голоса
                className="bg-green-500 text-white px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
              >
                Голосовать
              </button>
            )}
          </li>
        ))}
      </ul>
      {!isActive && <p className="mt-4 text-red-500 font-semibold">Голосование завершено</p>}
      {/*Показываем сообщение, если голосование завершено*/}
      {isActive && <EndPoll pollId={pollId} />}
      {/* Отображаем кнопку для завершения голосования, если оно активно */}
      <HasUserVoted pollId={pollId} />
      {/* Статус голосования пользователя */}
    </div>
  );
}
