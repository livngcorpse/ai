import logging
import sys
from app.core.config import settings

def setup_logging():
    logging.basicConfig(
        level=logging.INFO if settings.ENVIRONMENT == "production" else logging.DEBUG,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler("app.log") if settings.ENVIRONMENT == "production" else logging.NullHandler()
        ]
    )