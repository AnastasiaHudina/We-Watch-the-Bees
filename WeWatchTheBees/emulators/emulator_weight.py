# ЭМУЛЯТОР ДАТЧИКА ВЕСА
# ЭМУЛЯТОР ДАТЧИКА ВЛАЖНОСТИ

import requests
import time
import random
import threading

API_BASE = "http://127.0.0.1:8000/api"
SENSORS_URL = f"{API_BASE}/sensors/"
DATA_URL = f"{API_BASE}/sensors/data/"

SENSOR_TYPE = "weight"
NORMAL_MIN, NORMAL_MAX = 40.0, 60.0
MAX_DELTA = 0.1          # максимальное изменение за 30 секунд
ANOMALY_PROB = 0.05      # 5% шанс начать аномалию
ANOMALY_STEPS = 5        # длительность аномалии (циклов)
ANOMALY_LOW_TARGET = 30.0
ANOMALY_HIGH_TARGET = 75.0

class Emulator:
    def __init__(self, sensor_type):
        self.sensor_type = sensor_type
        self.devices = []
        self.current_values = {}      # device_id -> текущее значение
        self.anomaly_counter = {}     # device_id -> оставшиеся шаги аномалии (0 = нет)
        self.anomaly_target = {}      # device_id -> целевое значение при аномалии
        self.running = True

    def fetch_sensors(self):
        try:
            resp = requests.get(SENSORS_URL, timeout=5)
            if resp.status_code == 200:
                sensors = resp.json()
                new_devices = [s['device_id'] for s in sensors if s['sensor_type'] == self.sensor_type]
                # Добавляем новые датчики в словари
                for dev in new_devices:
                    if dev not in self.current_values:
                        self.current_values[dev] = random.uniform(NORMAL_MIN, NORMAL_MAX)
                        self.anomaly_counter[dev] = 0
                # Удаляем датчики, которых больше нет в БД (опционально)
                self.devices = new_devices
                print(f"[{self.sensor_type}] Загружено {len(self.devices)} датчиков")
            else:
                print(f"[{self.sensor_type}] Ошибка получения датчиков: {resp.status_code}")
        except Exception as e:
            print(f"[{self.sensor_type}] Ошибка соединения: {e}")

    def update_value(self, device_id):
        # Обработка аномалии
        if self.anomaly_counter.get(device_id, 0) > 0:
            # В аномалии движемся к целевой точке
            current = self.current_values[device_id]
            target = self.anomaly_target[device_id]
            diff = target - current
            step = max(-MAX_DELTA, min(MAX_DELTA, diff))  # не более MAX_DELTA за шаг
            new_val = current + step
            self.anomaly_counter[device_id] -= 1
            if self.anomaly_counter[device_id] == 0:
                # Аномалия закончилась – возвращаемся к нормальному диапазону
                # Целевое значение – ближайшая граница нормы
                if new_val < NORMAL_MIN:
                    new_val = NORMAL_MIN
                elif new_val > NORMAL_MAX:
                    new_val = NORMAL_MAX
            self.current_values[device_id] = new_val
            return

        # Обычный режим: плавное блуждание
        current = self.current_values[device_id]
        # С вероятностью ANOMALY_PROB начинаем аномалию
        if random.random() < ANOMALY_PROB:
            # Выбираем тип аномалии: холод или жара
            if random.random() < 0.5:
                target = ANOMALY_LOW_TARGET
            else:
                target = ANOMALY_HIGH_TARGET
            self.anomaly_counter[device_id] = ANOMALY_STEPS
            self.anomaly_target[device_id] = target
            # Первый шаг аномалии будет обработан на следующей итерации
            return

        # Нормальный шаг
        delta = random.uniform(-MAX_DELTA, MAX_DELTA)
        new_val = current + delta
        # Ограничиваем нормальным диапазоном (не выходим за границы)
        new_val = max(NORMAL_MIN, min(NORMAL_MAX, new_val))
        self.current_values[device_id] = new_val

    def send_data(self, device_id):
        self.update_value(device_id)
        value = round(self.current_values[device_id], 1)
        try:
            resp = requests.post(DATA_URL, json={"device_id": device_id, "value": value}, timeout=5)
            if resp.status_code == 201:
                print(f"[{self.sensor_type}] {device_id} -> {value}")
            else:
                print(f"[{self.sensor_type}] Ошибка {resp.status_code}: {resp.text}")
        except Exception as e:
            print(f"[{self.sensor_type}] Ошибка отправки: {e}")

    def run(self):
        self.fetch_sensors()
        refresh_counter = 0
        cycles_per_refresh = max(1, 60 // 30)  # каждые 2 минуты обновляем список датчиков
        while self.running:
            for dev in self.devices:
                self.send_data(dev)
            time.sleep(30)
            refresh_counter += 1
            if refresh_counter >= cycles_per_refresh:
                self.fetch_sensors()
                refresh_counter = 0

    def start(self):
        thread = threading.Thread(target=self.run, daemon=True)
        thread.start()
        return thread

if __name__ == "__main__":
    emu = Emulator(SENSOR_TYPE)
    emu.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Остановка эмулятора")