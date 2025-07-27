from app import (
    main
)

from app.db.db_config import (
    create_db,
    drop_db
)

from app.db.tests_db import start_test

if __name__ == "__main__":
    drop_db()
    create_db()
    
    start_test()
    main()