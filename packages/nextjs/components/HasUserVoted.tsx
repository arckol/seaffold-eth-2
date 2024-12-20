import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function HasUserVoted({ pollId }: { pollId: bigint }) {
  const [userAddress, setUserAddress] = useState<string>("");

  // Хук для чтения данных о том, проголосовал ли пользователь
  const { data: hasVoted } = useScaffoldReadContract({
    contractName: "VotingContract", // Имя контракта
    functionName: "hasUserVoted", // Функция для проверки, проголосовал ли пользователь
    args: [pollId, userAddress], // Аргументы: идентификатор голосования и адрес пользователя
  });

  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, [isConnected, address]);

  if (hasVoted === undefined) return <p>Загрузка...</p>; // Пока данные не загружены, показываем индикатор

  return (
    <div className="p-6 bg-[#00FFFF] text-white rounded-lg shadow-lg mt-4 max-w-md mx-auto">
      {hasVoted ? (
        <p className="text-2xl font-semibold text-dark-blue">Вы уже проголосовали в этом голосовании.</p> // Если пользователь проголосовал
      ) : (
        <p className="text-2xl font-semibold text-dark-blue">Вы ещё не проголосовали в этом голосовании.</p> // Если пользователь не проголосовал
      )}
    </div>
  );
}
