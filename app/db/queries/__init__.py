from app.db.queries.users import (
    create_user,
    get_user_by_email,
    verefy_user,
    get_all_prompts,
    get_completed_lessons,
    set_user_level,
    get_all_users_ranking
)

from app.db.queries.directlies import (
    get_directly_by_id
)

from app.db.queries.lessons import (
    get_all_lessons,
    get_lesson_by_id,
    complete_lesson
)

from app.db.queries.prompts import (
    add_prompt
)