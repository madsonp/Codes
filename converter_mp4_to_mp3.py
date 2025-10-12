from moviepy.editor import VideoFileClip
import os

def convert_mp4_to_mp3(mp4_file, mp3_file):
    """
    Converte um arquivo MP4 para MP3 extraindo o áudio.

    Args:
        mp4_file (str): Caminho para o arquivo MP4 de entrada.
        mp3_file (str): Caminho para o arquivo MP3 de saída.
    """
    try:
        # Carrega o vídeo
        video = VideoFileClip(mp4_file)
        # Extrai o áudio
        audio = video.audio
        # Salva como MP3
        audio.write_audiofile(mp3_file)
        # Fecha o vídeo para liberar recursos
        video.close()
        print(f"Conversão concluída: {mp3_file}")
    except Exception as e:
        print(f"Erro durante a conversão: {e}")

if __name__ == "__main__":
    # Exemplo de uso
    input_mp4 = "input.mp4"  # Substitua pelo caminho do seu arquivo MP4
    output_mp3 = "output.mp3"  # Substitua pelo caminho desejado para o MP3

    if os.path.exists(input_mp4):
        convert_mp4_to_mp3(input_mp4, output_mp3)
    else:
        print(f"Arquivo {input_mp4} não encontrado. Certifique-se de que o arquivo existe e o caminho está correto.")