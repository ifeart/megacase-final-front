interface UserFind {
  id: string;
  name: string;
  position: string;
  city: string;
  office?: string;
  level?: number;
  room?: string;
  desk?: string;
  statusBooked: boolean;
}

const mockUsersBooked: UserFind[] = [
  {
    id: "001",
    name: "Иванов Алексей Петрович",
    position: "Разработчик",
    city: "Москва",
    office: "Central Tower",
    level: 5,
    room: "501",
    desk: "A12",
    statusBooked: true,
  },
  {
    id: "002",
    name: "Смирнова Елена Владимировна",
    position: "Разработчик",
    city: "Санкт-Петербург",
    office: "Nevsky Plaza",
    level: 3,
    room: "310",
    desk: "B05",
    statusBooked: false,
  },
  {
    id: "003",
    name: "Кузнецов Дмитрий Игоревич",
    position: "Разработчик",
    city: "Новосибирск",
    office: "Siberia Center",
    level: 2,
    room: "205",
    desk: "C08",
    statusBooked: true,
  },
  {
    id: "004",
    name: "Петрова Анна Сергеевна",
    position: "Разработчик",
    city: "Москва",
    office: "Central Tower",
    level: 7,
    room: "720",
    desk: "D03",
    statusBooked: false,
  },
  {
    id: "005",
    name: "Васильев Михаил Олегович",
    position: "Разработчик",
    city: "Казань",
    office: "Volga Space",
    level: 1,
    room: "110",
    desk: "E15",
    statusBooked: true,
  },
  {
    id: "006",
    name: "Николаева Ольга Дмитриевна",
    position: "Разработчик",
    city: "Екатеринбург",
    office: "Ural Heights",
    level: 4,
    room: "415",
    desk: "F22",
    statusBooked: false,
  },
  {
    id: "007",
    name: "Соколов Артем Викторович",
    position: "Разработчик",
    city: "Москва",
    office: "Central Tower",
    level: 5,
    room: "502",
    desk: "A14",
    statusBooked: true,
  },
  {
    id: "008",
    name: "Морозова Татьяна Александровна",
    position: "Разработчик",
    city: "Санкт-Петербург",
    office: "Nevsky Plaza",
    level: 3,
    room: "312",
    desk: "B07",
    statusBooked: false,
  },
  {
    id: "009",
    name: "Лебедев Павел Андреевич",
    position: "Разработчик",
    city: "Новосибирск",
    office: "Siberia Center",
    level: 2,
    room: "207",
    desk: "C10",
    statusBooked: true,
  },
  {
    id: "010",
    name: "Козлова Ирина Валерьевна",
    position: "Разработчик",
    city: "Москва",
    office: "Central Tower",
    level: 8,
    room: "810",
    desk: "D25",
    statusBooked: false,
  },
  {
    id: "011",
    name: "Федоров Сергей Николаевич",
    position: "Разработчик",
    city: "Москва",
    office: "Central Tower",
    level: 6,
    room: "605",
    desk: "E08",
    statusBooked: true,
  },
  {
    id: "012",
    name: "Антонова Мария Игоревна",
    position: "Разработчик",
    city: "Санкт-Петербург",
    office: "Nevsky Plaza",
    level: 4,
    room: "408",
    desk: "F12",
    statusBooked: false,
  },
  {
    id: "013",
    name: "Григорьев Андрей Владимирович",
    position: "Разработчик",
    city: "Казань",
    office: "Volga Space",
    level: 3,
    room: "302",
    desk: "G05",
    statusBooked: true,
  },
  {
    id: "014",
    name: "Белова Екатерина Олеговна",
    position: "Разработчик",
    city: "Екатеринбург",
    office: "Ural Heights",
    level: 2,
    room: "210",
    desk: "H17",
    statusBooked: false,
  },
  {
    id: "015",
    name: "Тихонов Артем Сергеевич",
    position: "Разработчик",
    city: "Новосибирск",
    office: "Siberia Center",
    level: 1,
    room: "115",
    desk: "I22",
    statusBooked: true,
  },
  {
    id: "016",
    name: "Орлова Виктория Дмитриевна",
    position: "Разработчик",
    city: "Москва",
    office: "Central Tower",
    level: 7,
    room: "715",
    desk: "J03",
    statusBooked: false,
  },
  {
    id: "017",
    name: "Комаров Денис Петрович",
    position: "Разработчик",
    city: "Санкт-Петербург",
    office: "Nevsky Plaza",
    level: 5,
    room: "503",
    desk: "K14",
    statusBooked: true,
  },
  {
    id: "018",
    name: "Семенова Анастасия Александровна",
    position: "Разработчик",
    city: "Казань",
    office: "Volga Space",
    level: 4,
    room: "401",
    desk: "L09",
    statusBooked: false,
  },
  {
    id: "019",
    name: "Павлов Иван Алексеевич",
    position: "Разработчик",
    city: "Екатеринбург",
    office: "Ural Heights",
    level: 3,
    room: "307",
    desk: "M11",
    statusBooked: true,
  },
  {
    id: "020",
    name: "Волкова Юлия Сергеевна",
    position: "Разработчик",
    city: "Новосибирск",
    office: "Siberia Center",
    level: 2,
    room: "208",
    desk: "N20",
    statusBooked: false,
  },
  {
    id: "021",
    name: "Максимов Алексей Дмитриевич",
    position: "Разработчик",
    city: "Москва",
    office: "Central Tower",
    level: 9,
    room: "920",
    desk: "O05",
    statusBooked: true,
  },
  {
    id: "022",
    name: "Зайцева Ольга Викторовна",
    position: "Разработчик",
    city: "Санкт-Петербург",
    office: "Nevsky Plaza",
    level: 6,

    room: "610",
    desk: "P18",
    statusBooked: false,
  },
  {
    id: "023",
    name: "Егоров Дмитрий Олегович",
    position: "Разработчик",
    city: "Казань",
    office: "Volga Space",
    level: 5,
    room: "505",
    desk: "Q07",
    statusBooked: true,
  },
  {
    id: "024",
    name: "Романова Татьяна Игоревна",
    position: "Разработчик",
    city: "Екатеринбург",
    office: "Ural Heights",
    level: 4,
    room: "412",
    desk: "R13",
    statusBooked: false,
  },
  {
    id: "025",
    name: "Киселев Артур Валерьевич",
    position: "Разработчик",
    city: "Новосибирск",
    office: "Siberia Center",
    level: 3,
    room: "309",
    desk: "S21",
    statusBooked: true,
  },
  {
    id: "026",
    name: "Медведева Елена Анатольевна",
    position: "Разработчик",
    city: "Москва",
    office: "Central Tower",
    level: 8,
    room: "818",
    desk: "T04",
    statusBooked: false,
  },
  {
    id: "027",
    name: "Сорокин Павел Сергеевич",
    position: "Разработчик",
    city: "Санкт-Петербург",
    office: "Nevsky Plaza",
    level: 7,
    room: "707",
    desk: "U15",
    statusBooked: true,
  },
  {
    id: "028",
    name: "Терентьева Анна Владимировна",
    position: "Разработчик",
    city: "Казань",
    office: "Volga Space",
    level: 6,
    room: "606",
    desk: "V10",
    statusBooked: false,
  },
  {
    id: "029",
    name: "Гусев Михаил Андреевич",
    position: "Разработчик",
    city: "Екатеринбург",
    office: "Ural Heights",
    level: 5,
    room: "510",
    desk: "W19",
    statusBooked: true,
  },
  {
    id: "030",
    name: "Филиппова Дарья Игоревна",
    position: "Разработчик",
    city: "Новосибирск",
    office: "Siberia Center",
    level: 4,
    room: "415",
    desk: "X22",
    statusBooked: false,
  },
];

import { Pagination } from "@/components/Pagination";

import { IconArrowLeft, IconFilter, IconSearch } from "@tabler/icons-react";
import React from "react";
import { Link } from "react-router-dom";

export function SearchEmployees() {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const searchRef = React.useRef<string>("");
  const timer = React.useRef<number | null>(null);
  const [filtered, setFiltered] = React.useState<UserFind[]>([]);
  const isSearched = React.useRef<boolean>(false);

  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const MAX_ElEMS = 2;
  const TOTAL_PAGES = Math.ceil(filtered.length / MAX_ElEMS);

  const runSearchCombined = () => {
    const search = searchRef.current.toLowerCase().trim();

    if (search === "") {
      setFiltered([]);
      isSearched.current = true;
      return;
    }

    const filtered = mockUsersBooked.filter((emp) => {
      const nameWords = emp.name.toLowerCase().split(/\s+/);
      const positionWords = emp.position.toLowerCase().split(/\s+/);
      const cityWords = emp.city.toLowerCase().split(/\s+/);

      const allWords = [...nameWords, ...positionWords, ...cityWords];

      // Сначала ищем точное совпадение слов
      const exactMatch = allWords.includes(search);

      // Если есть точное совпадение, сразу возвращаем true
      if (exactMatch) return true;

      // Если точного совпадения нет, ищем по началу слов
      return allWords.some((word) => word.startsWith(search));
    });

    setFiltered(filtered);
    isSearched.current = true;
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchRef.current = e.target.value;

    if (timer.current) clearTimeout(timer.current);

    timer.current = window.setTimeout(() => {
      runSearchCombined();
    }, 500);
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-start py-10 bg-white">
      <div className="w-full max-w-6xl flex flex-col gap-6 px-4">
        <header className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-[#e6f7ff] transition"
          >
            <IconArrowLeft
              size={24}
              className="text-black group-hover:text-[#1daff7]"
            />
            <span className="font-['PPRader'] text-[16px] text-black group-hover:text-[#1daff7] hidden sm:inline">
              Назад
            </span>
          </Link>

          <h1 className="font-['PPRader'] text-[28px] md:text-[36px] text-black tracking-tight text-center flex-1">
            Поиск сотрудников
          </h1>

          <div className="w-[72px] md:w-[100px]" />
        </header>

        <section className="space-y-8">
          <div className="relative w-full max-w-2xl mx-auto">
            <IconSearch
              size={22}
              className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="search"
              placeholder="Введите имя или должность"
              className="w-full pl-9 py-4 text-[18px] font-['PPRader'] text-black bg-transparent border-0 border-b-2 border-black focus:border-[#1daff7] focus:outline-none transition-colors duration-300 placeholder-gray-400"
              onChange={handleChange}
            />
          </div>

          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-[#1daff7] transition "
          >
            <IconFilter size={20} />
            <span className="font-['PPRader'] text-[14px]">Фильтры</span>
          </button>
        </section>

        <section className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col">
            <div className="grid sm:grid-cols-2 gap-4">
              {isSearched.current && !filtered.length ? (
                <p>Сотрудники не найдены</p>
              ) : (
                filtered
                  .slice((currentPage - 1) * MAX_ElEMS, currentPage * MAX_ElEMS)
                  .map((item) => (
                    <article
                      className="p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-[#1daff7] transition flex flex-col items-center space-y-2"
                      key={item.id}
                    >
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {/* сюда можно вставить{" "} */}
                        <img
                          src="/profile.svg"
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="font-['PPRader'] text-[18px] text-black text-center">
                        {item.name}
                      </p>
                      <p className="font-['PPRader'] text-[16px] text-gray-500">
                        {item.position}
                      </p>
                      <p className="font-['PPRader'] text-[14px] text-gray-400 text-center">
                        {item.city + ", " + item.office}
                      </p>
                      {item.statusBooked && (
                        <div className="font-['PPRader'] text-[13px] text-gray-400 text-center">
                          <p>Этаж: {item.level}</p>
                          <p>Комната: {item.room}</p>
                          <p>Стол: {item.desk}</p>
                        </div>
                      )}
                    </article>
                  ))
              )}
            </div>

            {filtered.length > 0 && (
              <div className="flex justify-center mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={TOTAL_PAGES}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
          {/* 
					<aside className='hidden md:block w-full md:w-[clamp(220px,25vw,280px)] p-6 border border-gray-200 rounded-xl shadow-sm h-fit'>
						<h2 className="font-['PPRader'] text-[18px] text-black">Фильтры</h2>
						<p className="font-['PPRader'] text-[14px] text-gray-500 mt-2">
							Тут будут элементы фильтрации
						</p>
					</aside> */}
        </section>
      </div>

      {isFilterOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
            <h2 className="font-['PPRader'] text-[18px] text-black">Фильтры</h2>
            <p className="font-['PPRader'] text-[14px] text-gray-500 mt-2">
              Тут будут элементы фильтрации
            </p>

            <button
              onClick={() => setIsFilterOpen(false)}
              className="mt-6 ml-auto block px-4 py-2 bg-black text-white rounded hover:bg-[#1daff7] transition"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
