from app.db.models import (
    User,
    Lesson,
    Directly,
    Level
)

from app.db.db_config import Session

def start_test():
    with Session.begin() as session:
        level1 = Level(
            title="Початківець"
        )

        level2 = Level(
            title="Промптовик",
        )

        level3 = Level(
            title="Промпт-майстер",
        )


        user = User(
            username="Maxim",
            email="bot@gmail.com",
            password="12345678Max",
        )

        user.hash_password()

        directly1 = Directly(
            title="Code",
            description="Програмування та написання коду. Цей напрямок охоплює навчання створенню промптів для генерації коду, автоматизації задач, розв'язання алгоритмічних проблем та використання сучасних інструментів програмування."
        )

        directly2 = Directly(
            title="Design",
            description="Дизайн та оформлення. Тут ви навчитеся створювати промпти для генерації графічних матеріалів, розробки інтерфейсів, підбору кольорів та стилів, а також для оптимізації візуального сприйняття інформації."
        )

        directly3 = Directly(
            title="Teaching",
            description="Навчання та викладання. Даний напрямок присвячений створенню промптів для освітніх цілей: пояснення складних тем, підготовки навчальних матеріалів, тестових завдань та організації ефективного навчального процесу."
        )

        lesson1 = Lesson(
            title = "",
            description = "",
            directly_id = 1
        )

        # Тематика: Код
        lesson1 = Lesson(title="Вступ до промптингу для коду", description="Що таке промпт для коду? Як сформулювати запит, щоб отримати правильний фрагмент коду.", directly_id=1)
        lesson2 = Lesson(title="Як просити приклад коду", description="Формулювання запитів для отримання конкретного прикладу функції або скрипта.", directly_id=1)
        lesson3 = Lesson(title="Налагодження помилок через промпти", description="Як правильно просити допомоги у виправленні помилок у коді.", directly_id=1)
        lesson4 = Lesson(title="Пояснення чужого коду", description="Як скласти промпт, щоб AI пояснив складний код.", directly_id=1)
        lesson5 = Lesson(title="Генерація алгоритмів", description="Як формулювати запити для створення алгоритмів або шаблонів.", directly_id=1)
        lesson6 = Lesson(title="Оптимізація коду через промпти", description="Як отримати поради для покращення продуктивності коду.", directly_id=1)
        lesson7 = Lesson(title="Створення тестів через AI", description="Промпти для генерації unit-тестів та перевірки логіки.", directly_id=1)
        lesson8 = Lesson(title="Пояснення складних концепцій", description="Як запитувати пояснення ООП, асинхронності тощо.", directly_id=1)
        lesson9 = Lesson(title="Порівняння технологій", description="Запити на зразок: що краще — Flask чи FastAPI?", directly_id=1)
        lesson10 = Lesson(title="Генерація проектної структури", description="Як промптити для створення шаблону проєкту з нуля.", directly_id=1)

        # Тематика: Творчість
        lesson11 = Lesson(title="Вступ до креативного промптингу", description="Як створювати промпти для генерації текстів, віршів чи історій.", directly_id=2)
        lesson12 = Lesson(title="Опис персонажів", description="Як сформулювати запит для створення глибокого персонажа.", directly_id=2)
        lesson13 = Lesson(title="Генерація фантастичних світів", description="Як створювати унікальні світи за допомогою промптів.", directly_id=2)
        lesson14 = Lesson(title="Промпти для поезії", description="Як отримувати вірші в різних стилях — від хоку до сонету.", directly_id=2)
        lesson15 = Lesson(title="Ілюстрації та візуальний стиль", description="Як створювати промпти для генерації зображень (Midjourney, DALL·E).", directly_id=2)
        lesson16 = Lesson(title="Сценарії для відео чи подкастів", description="Як отримати структуру сценарію для творчого проєкту.", directly_id=2)
        lesson17 = Lesson(title="Музичні композиції", description="Формулювання промптів для генерації текстів пісень або ідей мелодій.", directly_id=2)
        lesson18 = Lesson(title="Ідеї для сторітелінгу", description="Як отримати ідеї для сюжетів з допомогою AI.", directly_id=2)
        lesson19 = Lesson(title="Креативні техніки", description="Запити на генерацію нестандартних технік та вправ.", directly_id=2)
        lesson20 = Lesson(title="Створення обкладинок або постерів", description="Як створити запит для гарної візуальної обкладинки.", directly_id=2)

        # Тематика: Навчання
        lesson21 = Lesson(title="Як промптити для навчання", description="Як запитувати, щоб зрозуміти складну тему просто.", directly_id=3)
        lesson22 = Lesson(title="Створення навчальних планів", description="Промпти для генерації індивідуального навчального маршруту.", directly_id=3)
        lesson23 = Lesson(title="Отримання прикладів і вправ", description="Як формулювати промпти для отримання практичних завдань.", directly_id=3)
        lesson24 = Lesson(title="Пояснення на рівні школяра", description="Як просити пояснення максимально просто і доступно.", directly_id=3)
        lesson25 = Lesson(title="Промпти для підготовки до екзаменів", description="Формулювання ефективних запитів для тренування.", directly_id=3)
        lesson26 = Lesson(title="Створення флеш-карток", description="Як запитувати генерацію карток для повторення матеріалу.", directly_id=3)
        lesson27 = Lesson(title="Аналіз помилок", description="Як за допомогою AI розібратись у своїх помилках.", directly_id=3)
        lesson28 = Lesson(title="Порівняння тем", description="Запити на зразок: чим відрізняється демократія від авторитаризму.", directly_id=3)
        lesson29 = Lesson(title="Промпти для глибокого розуміння", description="Як запитати так, щоб AI дав кілька точок зору.", directly_id=3)
        lesson30 = Lesson(title="Створення підсумків і конспектів", description="Як отримати стислий конспект або шпаргалку по темі.", directly_id=3)

        session.add_all([
            lesson1, lesson2, lesson3, lesson4, lesson5,
            lesson6, lesson7, lesson8, lesson9, lesson10,
            lesson11, lesson12, lesson13, lesson14, lesson15,
            lesson16, lesson17, lesson18, lesson19, lesson20,
            lesson21, lesson22, lesson23, lesson24, lesson25,
            lesson26, lesson27, lesson28, lesson29, lesson30
        ])

        
        session.add_all([user, directly1, directly2, directly3, level1, level2, level3])

    