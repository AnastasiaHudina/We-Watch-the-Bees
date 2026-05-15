# We Watch the Bees

Учебный проект: система мониторинга показаний ульев (вес/температура/влажность) с Django API и UI.

## Стек

- Python 3.10+
- Django 4.x
- SQLite
- Bootstrap 5

## Быстрый старт

Полная инструкция (бэкенд + фронт + эмуляторы): [`../../info/docs/install.md`](../../info/docs/install.md).

Кратко — только API:

1. `python3 -m venv venv && source venv/bin/activate`
2. `pip install -r requirements.txt`
3. `python manage.py migrate && python manage.py createsuperuser`
4. `python manage.py runserver` → http://127.0.0.1:8000/

Интерфейс для пользователя — React на http://localhost:5173 (см. `../frontend/`).

## Документация

- [`../../info/docs/install.md`](../../info/docs/install.md) — установка и запуск.

