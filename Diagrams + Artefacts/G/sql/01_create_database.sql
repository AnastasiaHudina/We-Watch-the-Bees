-- ============================================================
-- Система мониторинга пасеки "We Watch the Bees"
-- Создание базы данных (PostgreSQL)
-- ============================================================

-- ============================================================
-- МОДУЛЬ "ПОЛЬЗОВАТЕЛИ И АВТОРИЗАЦИЯ"
-- ============================================================

-- Пользователи
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',        -- 'user' или 'admin'
    status VARCHAR(20) NOT NULL DEFAULT 'inactive',  -- 'inactive' или 'active'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Токены активации
CREATE TABLE account_activation_tokens (
    token VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    expires_at TIMESTAMP NOT NULL
);

-- ============================================================
-- МОДУЛЬ "МОНИТОРИНГ ПАСЕКИ"
-- ============================================================

-- Пасеки
CREATE TABLE apiaries (
    apiary_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ульи
CREATE TABLE hives (
    hive_id SERIAL PRIMARY KEY,
    apiary_id INT NOT NULL REFERENCES apiaries(apiary_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Пчелосемьи
CREATE TABLE bee_colonies (
    colony_id SERIAL PRIMARY KEY,
    hive_id INT NOT NULL REFERENCES hives(hive_id) ON DELETE CASCADE,
    breed VARCHAR(255),
    queen_age INT,                                    -- возраст матки в месяцах
    installation_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'active',    -- 'active' или 'archived'
    notes TEXT
);

-- Датчики
CREATE TABLE sensors (
    sensor_id SERIAL PRIMARY KEY,
    hive_id INT NOT NULL REFERENCES hives(hive_id) ON DELETE CASCADE,
    device_identifier VARCHAR(255) NOT NULL UNIQUE,
    sensor_type VARCHAR(50) NOT NULL,                -- 'weight', 'temperature', 'humidity', 'sound'
    status VARCHAR(20) NOT NULL DEFAULT 'active',    -- 'active', 'inactive', 'error'
    installed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Показания датчиков
CREATE TABLE sensor_readings (
    reading_id BIGSERIAL PRIMARY KEY,
    sensor_id INT NOT NULL REFERENCES sensors(sensor_id) ON DELETE CASCADE,
    value DECIMAL(10, 2) NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Индекс для быстрого поиска показаний
CREATE INDEX idx_readings_sensor_time ON sensor_readings(sensor_id, timestamp);

-- Оповещения
CREATE TABLE alerts (
    alert_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    hive_id INT NOT NULL REFERENCES hives(hive_id) ON DELETE CASCADE,
    alert_type VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'new',       -- 'new', 'read', 'resolved'
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- МОДУЛЬ "БАЗА ЗНАНИЙ"
-- ============================================================

-- Категории статей
CREATE TABLE article_categories (
    category_id SERIAL PRIMARY KEY,
    parent_category_id INT REFERENCES article_categories(category_id),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT
);

-- Статьи
CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    category_id INT NOT NULL REFERENCES article_categories(category_id),
    author_id INT NOT NULL REFERENCES users(user_id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',     -- 'draft', 'published', 'archived'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Комментарии
CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    parent_comment_id INT REFERENCES comments(comment_id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

