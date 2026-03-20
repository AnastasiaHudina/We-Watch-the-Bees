# Установка и запуск

## 1. Требования

- Python 3.10+

## 2. Создание виртуального окружения

```bash
python3 -m venv venv
source venv/bin/activate
```

## 3. Установка зависимостей

```bash
pip install -r requirements.txt
```

## 4. Миграции и база данных

```bash
python manage.py migrate
```

## 5. Создание суперпользователя (для админки)

```bash
python manage.py createsuperuser
```

## 6. Запуск сервера

```bash
python manage.py runserver
```

Приложение будет доступно по адресу:
`http://127.0.0.1:8000/`

