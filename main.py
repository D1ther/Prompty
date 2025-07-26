from app import (
    main
)

from app.db.db_config import (
    create_db,
    drop_db
)

if __name__ == "__main__":
    # drop_db()
    create_db()
    
    main()