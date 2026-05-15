# Установка и запуск We Watch the Bees

Инструкция для локального запуска и просмотра текущего этапа проекта.

## Что запускается

Три части работают вместе:

| Часть | Назначение | Адрес |
|-------|------------|-------|
| **React (сайт)** | Основной интерфейс для пользователя | http://localhost:5173 |
| **Django API** | Бэкенд, данные, сессии | http://127.0.0.1:8000/api/... |
| **Django Admin** | Просмотр таблиц в БД | http://127.0.0.1:8000/admin/ |
| **Эмуляторы** (опционально) | Имитация показаний датчиков | POST → `/api/sensors/data/` |

Основной сценарий — сайт на **:5173**. Админка нужна для отладки и просмотра записей в базе.

## Требования

- **Python** 3.10+
- **Node.js** 18+ и **npm** (для фронтенда)
- Три отдельных терминала (бэкенд, фронт, эмуляторы)

Корень приложения в репозитории:

```
WeWatchTheBees/
├── backend/
├── frontend/
└── emulators/
```

Далее пути указаны относительно каталога `WeWatchTheBees/`, если не сказано иное.

> **Windows:** пошаговые команды для CMD и PowerShell — в разделе [Запуск на Windows](#запуск-на-windows) ниже.

---

## Первый запуск (один раз)

### Терминал 1 — бэкенд

Перейдите в каталог бэкенда (из **корня репозитория**, где лежит папка `WeWatchTheBees`):

```bash
cd WeWatchTheBees/backend
```

Создайте **своё** виртуальное окружение. Папку `venv` из репозитория (если она есть) лучше удалить — она могла быть собрана на другой ОС и не заработает.

**macOS / Linux:**

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
```

**Windows** — см. [Запуск на Windows](#запуск-на-windows); кратко: `py -3 -m venv venv`, затем `venv\Scripts\activate`.

`createsuperuser` нужен для входа в http://127.0.0.1:8000/admin/ — логин и пароль придумайте сами.

Пример учётной записи команды (необязательно): см. [`../dev/superuser.txt`](../dev/superuser.txt).

Запуск сервера:

```bash
python manage.py runserver
```

Должно появиться: `Starting development server at http://127.0.0.1:8000/`.

### Терминал 2 — фронтенд

```bash
cd WeWatchTheBees/frontend
npm install
npm run dev
```

Откройте **http://localhost:5173** — регистрация, вход, раздел «Моя пасека», ульи, цветовая индикация показаний, обновление данных примерно каждые 5 секунд.

### Терминал 3 — эмуляторы (чтобы цифры «жили»)

```bash
cd WeWatchTheBees/emulators
pip install requests    # если ещё не установлен (можно в том же venv, что и бэкенд)
python start_emulators.py
```

**Порядок важно:**

1. Запустите бэкенд и фронт.
2. Зарегистрируйтесь на сайте и **добавьте улей с датчиками**.
3. Затем запустите эмуляторы — они отправляют POST на `/api/sensors/data/` примерно раз в 30 секунд.

Остановка эмуляторов: `Ctrl+C` в терминале 3.

---

## Повседневный запуск

После первой настройки достаточно трёх терминалов:

| # | Каталог | Команда |
|---|---------|---------|
| 1 | `WeWatchTheBees/backend` | активировать venv → `python manage.py runserver` (Windows: `venv\Scripts\activate`) |
| 2 | `WeWatchTheBees/frontend` | `npm run dev` |
| 3 | `WeWatchTheBees/emulators` | `python start_emulators.py` |

Краткая шпаргалка: [`../dev/quick-start.txt`](../dev/quick-start.txt).

---

## Что смотреть

1. **http://localhost:5173** — главный интерфейс:
   - регистрация и вход;
   - «Моя пасека», добавление ульев;
   - карточки ульев с последними показаниями и цветами (норма / предупреждение / опасность);
   - графики и оповещения (при наличии данных).

2. **http://127.0.0.1:8000/admin/** — Django Admin (логин суперпользователя из `createsuperuser`).

3. При запущенных эмуляторах значения на карточках должны меняться после появления новых записей с датчиков.

---

## Возможные проблемы

| Симптом | Что проверить |
|---------|----------------|
| Фронт не видит API | Бэкенд запущен на `:8000`, в браузере открыт именно `:5173` |
| CORS / ошибки сети | В `settings.py` разрешён origin `http://localhost:5173` |
| Цифры не меняются | Эмуляторы запущены **после** добавления улья с датчиками; бэкенд работает |
| `ModuleNotFoundError: rest_framework` / `corsheaders` | `pip install -r requirements.txt` в активированном venv |
| Ошибки venv / «не тот» Python | Удалите `backend/venv`, создайте заново (`python3 -m venv venv` или `py -3 -m venv venv`) |
| `'source' is not recognized` (Windows) | В CMD/PowerShell не используйте `source`; см. [Запуск на Windows](#запуск-на-windows) |
| `npm: command not found` | Установите Node.js с https://nodejs.org |

---

## Запуск на Windows

Нужны **три окна терминала** (CMD, PowerShell или Windows Terminal). Команды `cd` — из **корня клонированного репозитория** (там, где видна папка `WeWatchTheBees`).

### Подготовка (один раз)

**Терминал 1 — бэкенд**

CMD:

```bat
cd WeWatchTheBees\backend
rmdir /s /q venv
py -3 -m venv venv
venv\Scripts\activate.bat
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

PowerShell (если `py` не находится, замените на `python`):

```powershell
cd WeWatchTheBees\backend
Remove-Item -Recurse -Force venv -ErrorAction SilentlyContinue
py -3 -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Если PowerShell пишет, что выполнение скриптов запрещено:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

После активации в начале строки должно быть `(venv)`. Сервер: http://127.0.0.1:8000/

**Терминал 2 — фронтенд**

```bat
cd WeWatchTheBees\frontend
npm install
npm run dev
```

Сайт: http://localhost:5173

**Терминал 3 — эмуляторы** (после регистрации на сайте и добавления улья)

В том же venv, что и бэкенд (снова `venv\Scripts\activate` в `backend`), или с установленным `requests`:

```bat
cd WeWatchTheBees\emulators
pip install requests
python start_emulators.py
```

### Повседневный запуск (Windows)

| # | Каталог | Действие |
|---|---------|----------|
| 1 | `WeWatchTheBees\backend` | `venv\Scripts\activate` → `python manage.py runserver` |
| 2 | `WeWatchTheBees\frontend` | `npm run dev` |
| 3 | `WeWatchTheBees\emulators` | `python start_emulators.py` (бэкенд уже запущен) |

### Частые ошибки на Windows

| Ошибка | Решение |
|--------|---------|
| `'python' is not recognized` | Установите Python с https://www.python.org/downloads/ и отметьте **Add python.exe to PATH**; используйте `py -3` |
| `'source' is not recognized` | Команда только для Mac/Linux; на Windows: `venv\Scripts\activate.bat` или `.\venv\Scripts\Activate.ps1` |
| `ModuleNotFoundError: django` / `rest_framework` | Не активирован venv или не выполнен `pip install -r requirements.txt` |
| Фронт не открывается | Установите Node.js LTS с https://nodejs.org |

---
