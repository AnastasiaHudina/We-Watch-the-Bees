-- ============================================================
-- Тестовые данные
-- ============================================================

-- 1. ПОЛЬЗОВАТЕЛИ
INSERT INTO users (name, email, password_hash, role, status) VALUES
    ('Иван Петров', 'admin@example.com', 'hashed_password_1', 'admin', 'active'),
    ('Мария Сидорова', 'maria@example.com', 'hashed_password_2', 'user', 'active'),
    ('Алексей Козлов', 'alexey@example.com', 'hashed_password_3', 'user', 'active');

-- 2. КАТЕГОРИИ СТАТЕЙ
INSERT INTO article_categories (name, description) VALUES
    ('Основы пчеловодства', 'Базовые знания для начинающих'),
    ('Болезни пчёл', 'Диагностика и лечение'),
    ('Оборудование', 'Обзоры инструментов');

-- 3. СТАТЬИ
INSERT INTO articles (category_id, author_id, title, content, status) VALUES
    (1, 1, 'Введение в пчеловодство', 'Пчеловодство — увлекательное занятие...', 'published'),
    (2, 1, 'Варроатоз: диагностика', 'Варроатоз — опасное заболевание пчёл...', 'published'),
    (3, 1, 'IoT-датчики для ульев', 'Современные технологии мониторинга...', 'published');

-- 4. КОММЕНТАРИИ
INSERT INTO comments (article_id, user_id, content) VALUES
    (1, 2, 'Отличная статья для начинающих!'),
    (1, 3, 'Спасибо, очень полезно.'),
    (2, 2, 'Помогло в борьбе с клещом.');

-- 5. ПАСЕКИ
INSERT INTO apiaries (user_id, name, location) VALUES
    (2, 'Солнечная поляна', 'Московская обл., Дмитровский р-н'),
    (2, 'Дачная пасека', 'Московская обл., СНТ Берёзка'),
    (3, 'Лесная пасека', 'Тульская обл., Заокский р-н');

-- 6. УЛЬИ
INSERT INTO hives (apiary_id, name) VALUES
    (1, 'Улей №1'),
    (1, 'Улей №2'),
    (1, 'Улей №3'),
    (2, 'Дачный-1'),
    (3, 'Лесной-1'),
    (3, 'Лесной-2');

-- 7. ПЧЕЛОСЕМЬИ
INSERT INTO bee_colonies (hive_id, breed, queen_age, installation_date, status, notes) VALUES
    (1, 'Карпатская', 8, '2024-05-15', 'active', 'Сильная семья'),
    (2, 'Карпатская', 20, '2023-04-20', 'active', 'Планируется замена матки'),
    (3, 'Бакфаст', 4, '2024-06-01', 'active', NULL),
    (4, 'Карпатская', 10, '2024-04-25', 'active', NULL),
    (5, 'Среднерусская', 14, '2023-05-01', 'active', 'Аборигенная популяция'),
    (6, 'Среднерусская', 8, '2024-05-05', 'active', NULL);

-- 8. ДАТЧИКИ
INSERT INTO sensors (hive_id, device_identifier, sensor_type, status) VALUES
    (1, 'SENSOR-001-W', 'weight', 'active'),
    (1, 'SENSOR-001-T', 'temperature', 'active'),
    (1, 'SENSOR-001-H', 'humidity', 'active'),
    (2, 'SENSOR-002-W', 'weight', 'active'),
    (2, 'SENSOR-002-T', 'temperature', 'active'),
    (3, 'SENSOR-003-W', 'weight', 'active'),
    (5, 'SENSOR-005-W', 'weight', 'active'),
    (5, 'SENSOR-005-T', 'temperature', 'error');

-- 9. ПОКАЗАНИЯ ДАТЧИКОВ (за последние 3 дня)
INSERT INTO sensor_readings (sensor_id, value, timestamp) VALUES
    -- Датчик веса (sensor_id = 1)
    (1, 45.50, NOW() - INTERVAL '3 days'),
    (1, 45.80, NOW() - INTERVAL '2 days'),
    (1, 46.20, NOW() - INTERVAL '1 day'),
    (1, 46.50, NOW()),
    -- Датчик температуры (sensor_id = 2)
    (2, 34.5, NOW() - INTERVAL '3 days'),
    (2, 35.0, NOW() - INTERVAL '2 days'),
    (2, 35.2, NOW() - INTERVAL '1 day'),
    (2, 38.5, NOW()),  -- аномально высокая
    -- Датчик влажности (sensor_id = 3)
    (3, 65.0, NOW() - INTERVAL '2 days'),
    (3, 70.0, NOW() - INTERVAL '1 day'),
    (3, 68.0, NOW()),
    -- Второй улей
    (4, 42.00, NOW() - INTERVAL '2 days'),
    (4, 42.50, NOW() - INTERVAL '1 day'),
    (4, 43.00, NOW());

-- 10. ОПОВЕЩЕНИЯ
INSERT INTO alerts (user_id, hive_id, alert_type, description, status, timestamp) VALUES
    (2, 1, 'high_temperature', 'Температура превысила 38°C', 'new', NOW()),
    (2, 2, 'sensor_error', 'Датчик не передаёт данные', 'read', NOW() - INTERVAL '2 days'),
    (3, 5, 'low_weight', 'Вес улья ниже нормы', 'new', NOW() - INTERVAL '1 day');

-- Проверка данных
SELECT 'users' AS table_name, COUNT(*) FROM users
UNION ALL SELECT 'apiaries', COUNT(*) FROM apiaries
UNION ALL SELECT 'hives', COUNT(*) FROM hives
UNION ALL SELECT 'bee_colonies', COUNT(*) FROM bee_colonies
UNION ALL SELECT 'sensors', COUNT(*) FROM sensors
UNION ALL SELECT 'sensor_readings', COUNT(*) FROM sensor_readings
UNION ALL SELECT 'alerts', COUNT(*) FROM alerts
UNION ALL SELECT 'articles', COUNT(*) FROM articles
UNION ALL SELECT 'comments', COUNT(*) FROM comments;

