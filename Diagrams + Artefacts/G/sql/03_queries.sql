-- ============================================================
-- Основные запросы
-- ============================================================


-- ============================================================
-- АВТОРИЗАЦИЯ И РЕГИСТРАЦИЯ
-- ============================================================

-- Регистрация нового пользователя
INSERT INTO users (name, email, password_hash, role, status)
VALUES ('Новый Пользователь', 'new@example.com', 'hashed_password', 'user', 'inactive');

-- Авторизация (проверка данных)
SELECT user_id, name, email, role, status
FROM users
WHERE email = 'maria@example.com' AND status = 'active';

-- Активация аккаунта
UPDATE users SET status = 'active' WHERE user_id = 4;


-- ============================================================
-- ПАСЕКИ И УЛЬИ
-- ============================================================

-- Получить все пасеки пользователя
SELECT apiary_id, name, location, created_at
FROM apiaries
WHERE user_id = 2;

-- Добавить новую пасеку
INSERT INTO apiaries (user_id, name, location)
VALUES (2, 'Новая пасека', 'Калужская область');

-- Получить ульи на пасеке
SELECT h.hive_id, h.name, bc.breed, bc.queen_age, bc.status
FROM hives h
LEFT JOIN bee_colonies bc ON h.hive_id = bc.hive_id AND bc.status = 'active'
WHERE h.apiary_id = 1;

-- Добавить улей
INSERT INTO hives (apiary_id, name) VALUES (1, 'Улей №4');

-- Добавить пчелосемью
INSERT INTO bee_colonies (hive_id, breed, queen_age, installation_date, status)
VALUES (4, 'Карпатская', 3, CURRENT_DATE, 'active');


-- ============================================================
-- ДАТЧИКИ И ПОКАЗАНИЯ
-- ============================================================

-- Получить датчики улья
SELECT sensor_id, device_identifier, sensor_type, status
FROM sensors
WHERE hive_id = 1;

-- Получить последние показания датчика
SELECT value, timestamp
FROM sensor_readings
WHERE sensor_id = 1
ORDER BY timestamp DESC
LIMIT 10;

-- Получить показания за период
SELECT value, timestamp
FROM sensor_readings
WHERE sensor_id = 1
  AND timestamp >= NOW() - INTERVAL '7 days'
ORDER BY timestamp;

-- Средние показания по дням
SELECT 
    DATE(timestamp) AS day,
    AVG(value) AS avg_value,
    MIN(value) AS min_value,
    MAX(value) AS max_value
FROM sensor_readings
WHERE sensor_id = 1
GROUP BY DATE(timestamp)
ORDER BY day;

-- Найти аномальную температуру (выше 38°C)
SELECT s.sensor_id, h.name AS hive_name, sr.value, sr.timestamp
FROM sensor_readings sr
JOIN sensors s ON sr.sensor_id = s.sensor_id
JOIN hives h ON s.hive_id = h.hive_id
WHERE s.sensor_type = 'temperature' AND sr.value > 38;


-- ============================================================
-- ОПОВЕЩЕНИЯ
-- ============================================================

-- Получить оповещения пользователя
SELECT al.alert_id, al.alert_type, al.description, al.status, h.name AS hive_name
FROM alerts al
JOIN hives h ON al.hive_id = h.hive_id
WHERE al.user_id = 2
ORDER BY al.timestamp DESC;

-- Только новые оповещения
SELECT alert_id, alert_type, description
FROM alerts
WHERE user_id = 2 AND status = 'new';

-- Пометить как прочитанное
UPDATE alerts SET status = 'read' WHERE alert_id = 1;

-- Создать оповещение
INSERT INTO alerts (user_id, hive_id, alert_type, description)
VALUES (2, 1, 'possible_swarm', 'Резкое снижение веса улья');


-- ============================================================
-- БАЗА ЗНАНИЙ
-- ============================================================

-- Получить все категории
SELECT category_id, name, description
FROM article_categories;

-- Получить статьи категории
SELECT a.article_id, a.title, u.name AS author, a.created_at
FROM articles a
JOIN users u ON a.author_id = u.user_id
WHERE a.category_id = 1 AND a.status = 'published';

-- Поиск статей по ключевому слову
SELECT article_id, title
FROM articles
WHERE status = 'published'
  AND (title ILIKE '%пчел%' OR content ILIKE '%пчел%');

-- Получить статью с информацией об авторе
SELECT a.title, a.content, u.name AS author, c.name AS category
FROM articles a
JOIN users u ON a.author_id = u.user_id
JOIN article_categories c ON a.category_id = c.category_id
WHERE a.article_id = 1;

-- Комментарии к статье
SELECT cm.content, u.name AS author, cm.created_at
FROM comments cm
JOIN users u ON cm.user_id = u.user_id
WHERE cm.article_id = 1
ORDER BY cm.created_at;

-- Добавить комментарий
INSERT INTO comments (article_id, user_id, content)
VALUES (1, 2, 'Спасибо за статью!');


-- ============================================================
-- СТАТИСТИКА И ОТЧЁТЫ
-- ============================================================

-- Количество ульев и семей у пользователя
SELECT 
    u.name,
    COUNT(DISTINCT a.apiary_id) AS apiaries,
    COUNT(DISTINCT h.hive_id) AS hives,
    COUNT(DISTINCT bc.colony_id) AS colonies
FROM users u
LEFT JOIN apiaries a ON u.user_id = a.user_id
LEFT JOIN hives h ON a.apiary_id = h.apiary_id
LEFT JOIN bee_colonies bc ON h.hive_id = bc.hive_id AND bc.status = 'active'
WHERE u.user_id = 2
GROUP BY u.name;

-- Статистика по породам пчёл
SELECT breed, COUNT(*) AS count
FROM bee_colonies
WHERE status = 'active'
GROUP BY breed
ORDER BY count DESC;

-- Количество оповещений по статусам
SELECT status, COUNT(*) AS count
FROM alerts
WHERE user_id = 2
GROUP BY status;

-- Статус датчиков
SELECT sensor_type, status, COUNT(*) AS count
FROM sensors
GROUP BY sensor_type, status
ORDER BY sensor_type;

