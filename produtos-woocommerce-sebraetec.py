from woocommerce import API
import json

# Configurações da API
wcapi = API(
    url="https://sebraetec.com",  # Substitua pelo domínio da sua loja
    consumer_key="SEU_CONSUMER_KEY",  # Substitua pela sua chave
    consumer_secret="SEU_CONSUMER_SECRET",  # Substitua pela sua senha secreta
    version="wc/v3"
)

def listar_produtos_disponiveis(por_pagina=100):
    pagina = 1
    produtos_disponiveis = []

    while True:
        response = wcapi.get("products", params={
            "per_page": por_pagina,
            "page": pagina,
            "stock_status": "instock"  # apenas produtos com estoque
        })

        if response.status_code != 200:
            print("Erro ao buscar produtos:", response.status_code, response.text)
            break

        produtos = response.json()

        if not produtos:
            break  # sai se não houver mais produtos

        produtos_disponiveis.extend(produtos)
        pagina += 1

    return produtos_disponiveis


# Executa e imprime os produtos disponíveis
produtos = listar_produtos_disponiveis()

print(f"Total de produtos disponíveis: {len(produtos)}\n")

for produto in produtos:
    print(f"- ID: {produto['id']} | Nome: {produto['name']} | Preço: {produto['price']}")
