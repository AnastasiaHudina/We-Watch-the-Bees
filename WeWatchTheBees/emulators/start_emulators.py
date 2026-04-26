import subprocess
import time
import sys

emulators = ['emulator_temp.py', 'emulator_hum.py', 'emulator_weight.py']

processes = []
for emu in emulators:
    print(f"Запуск {emu}...")
    p = subprocess.Popen([sys.executable, emu], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    processes.append(p)
    time.sleep(1)

print("Все эмуляторы запущены. Нажмите Ctrl+C для остановки.")
try:
    for p in processes:
        p.wait()
except KeyboardInterrupt:
    print("Останавливаем эмуляторы...")
    for p in processes:
        p.terminate()