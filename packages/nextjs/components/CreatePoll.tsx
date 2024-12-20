import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function CreatePoll() {
  // Состояния для хранения данных о вопросе, вариантах ответов и длительности
  const [question, setQuestion] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [optionInput, setOptionInput] = useState<string>("");
  const [duration, setDuration] = useState<number>(0);

  // Хук для записи данных в смарт-контракт
  const { writeContractAsync, isMining } = useScaffoldWriteContract({
    contractName: "VotingContract", // Имя контракта
  });

  // Функция для добавления нового варианта ответа
  const addOption = () => {
    if (optionInput.trim()) {
      setOptions([...options, optionInput.trim()]); // Добавляем новый вариант в массив
      setOptionInput(""); // Очищаем поле ввода
    }
  };

  // Функция для создания голосования
  const createPoll = async () => {
    if (question && options.length > 1 && duration > 0) {
      // Выполняем транзакцию на создание голосования
      await writeContractAsync({
        functionName: "createPoll", // Имя функции контракта для создания голосования
        args: [question, options, BigInt(duration)], // Аргументы: вопрос, варианты ответов и длительность в секундах
      });
    } else {
      alert("Пожалуйста, заполните все поля корректно."); // Если поля не заполнены правильно
    }
  };

  return (
    <div className="p-8 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg shadow-xl mx-auto max-w-xl">
      <h2 className="text-3xl font-bold mb-6">Создать голосование</h2>
      <input
        type="text"
        placeholder="Вопрос голосования"
        value={question}
        onChange={e => setQuestion(e.target.value)} // Обновляем состояние вопроса
        className="w-full p-3 mb-4 text-white bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Добавить вариант ответа"
          value={optionInput}
          onChange={e => setOptionInput(e.target.value)} // Обновляем состояние для нового варианта
          className="flex-1 p-3 mr-2 text-white bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addOption} // Добавление варианта при клике
          className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700"
        >
          Добавить вариант
        </button>
      </div>
      <ul className="mb-4 list-disc list-inside">
        {options.map((opt, idx) => (
          <li key={idx} className="text-lg mb-2">
            {opt}
          </li> // Выводим добавленные варианты
        ))}
      </ul>
      <input
        type="number"
        placeholder="Длительность (в секундах)"
        value={duration}
        onChange={e => setDuration(Number(e.target.value))} // Обновляем длительность голосования
        className="w-full p-3 mb-4 text-white bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={createPoll} // Запуск создания голосования
        disabled={isMining} // Отключаем кнопку, если процесс в ожидании
        className={`w-full py-3 rounded-lg text-white shadow-md focus:outline-none focus:ring-2 ${isMining ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"}`}
      >
        {isMining ? "Создание..." : "Создать голосование"} {/*Текст на кнопке зависит от состояния загрузки*/}
      </button>
    </div>
  );
}

