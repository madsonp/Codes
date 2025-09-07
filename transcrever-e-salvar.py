import whisper
import sys
import time

def barra_progresso(atual, total, tamanho=40):
    porcentagem = atual / total
    preenchido = int(tamanho * porcentagem)
    barra = '█' * preenchido + '-' * (tamanho - preenchido)
    sys.stdout.write(f'\rProgresso: |{barra}| {porcentagem:.0%}')
    sys.stdout.flush()

# Carregar o modelo
model = whisper.load_model("small")

# Transcrever o áudio em partes (segmentos)
result = model.transcribe("record.ogg", language="pt")

# Salvar cada segmento no arquivo de texto conforme for processando
total = len(result["segments"])
with open("transcricao.txt", "w", encoding="utf-8") as f:
    for i, segment in enumerate(result["segments"], 1):
        f.write(segment["text"].strip() + "\n")
        barra_progresso(i, total)
        time.sleep(0.05)  # Apenas para visualização da barra (pode remover)

print("\nTranscrição salva em 'transcricao.txt'")