from app.tools.ai.ai_config import (
    client
)

import json

class AiEvaluationModel:
    def __init__(
            self,
            client=client,
            theme: str = None,
            model: str = "google/gemini-2.0-flash-exp:free",
            last_prompts: list = []
    ):
        self.client = client
        self.model = model
        self.theme = theme
        self.last_prompts = last_prompts

        self.system_content = (
            f"Ви — експерт з оцінювання промптів для штучного інтелекту. "
            f"Відповідайте українською мовою.\n\n"
            f"Ваше завдання — детально оцінити промпт користувача за темою '{self.theme}' та надати структуровану відповідь у форматі JSON.\n\n"
            f"Структура JSON відповіді:\n"
            f"{{\n"
            f'  "score": [число від 0 до 10],\n'
            f'  "theme_relevance": "[повністю/частково/не відповідає]",\n'
            f'  "quality": "[відмінна/хороша/задовільна/погана]",\n'
            f'  "confusion_risk": "[висока/середня/низька]",\n'
            f'  "comment": "[детальний аналіз сильних та слабких сторін промпту]",\n'
            f'  "tips": ["порада 1", "порада 2", "порада 3"],\n'
            f'  "progress_analysis": "[порівняння з попередніми промптами, якщо доступні]"\n'
            f"}}\n\n"
            f"Критерії оцінки:\n"
            f"- Чіткість формулювання (0-3 бали)\n"
            f"- Відповідність темі '{self.theme}' (0-3 бали)\n"
            f"- Деталізація та специфічність (0-2 бали)\n"
            f"- Відсутність двозначності (0-2 бали)\n\n"
            f"ВАЖЛИВО: Відповідайте ТІЛЬКИ валідним JSON без додаткового тексту."
        )

        prompts_history = ""
        if self.last_prompts:
            prompts_history = (
                f"\n\nІСТОРІЯ ПОПЕРЕДНІХ ПРОМПТІВ КОРИСТУВАЧА:\n" +
                "\n".join(f"{i+1}. \"{prompt}\"" for i, prompt in enumerate(self.last_prompts[-5:]))
            )

        self.assistant_content = (
            f"Я готовий оцінювати промпти на тему '{self.theme}' за вказаною структурою. "
            f"Я буду надавати детальну оцінку з конкретними балами, аналізом та порадами для покращення."
            f"{prompts_history}"
        )

    async def evaluate(self, prompt: str):
        history_context = ""
        if self.last_prompts:
            history_context = (
                f"\n\nДля контексту, ось останні промпти цього користувача:\n" +
                "\n".join(f"- \"{p}\"" for p in self.last_prompts[-3:]) +
                f"\n\nПорівняйте поточний промпт з попередніми та зазначте прогрес або регрес."
            )

        user_content = (
            f"Оцініть промпт на тему '{self.theme}': \"{prompt}\"\n"
            f"{history_context}\n\n"
            f"Поверніть відповідь у форматі DICT згідно зі структурою. Без символів '\n' просто словник з даними"
        )

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": self.system_content},
                {"role": "assistant", "content": self.assistant_content},
                {"role": "user", "content": user_content},
            ],
            temperature=0.2
        )
        return json.loads(response.choices[0].message.content.replace("```json", "").replace("```", "").strip())
