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
            user_id=1
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

        lessons = []
        for directly in [directly1, directly2, directly3]:
            for i in range(1, 11):
                lesson = Lesson(
                    title=f"{directly.title} Lesson {i}",
                    description=f"This is lesson {i} for {directly.title}.",
                    directly=directly
                )
                lessons.append(lesson)
        
        session.add_all(lessons)
        session.add_all([user, directly1, directly2, directly3, level1, level2, level3])

    