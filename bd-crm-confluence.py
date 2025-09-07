import pandas as pd

# Carregar as duas bases de dados
base1 = pd.read_csv(r'C:\Users\madso\OneDrive - SEBRAE\Área de Trabalho\Produtos\Produtos.csv')
base2 = pd.read_excel(
    r'C:\Users\madso\OneDrive - SEBRAE\Área de Trabalho\Produtos\Atualização no Confluence.xlsx',
    sheet_name='Dados'
)

# Comparar a coluna 'Descrição' do Excel com a coluna 'produto' do CSV
novas_linhas = base2[~base2['Descrição'].isin(base1['Produto'])]

# Salvar as novas linhas em um novo arquivo CSV
novas_linhas.to_csv('novas_linhas.csv', index=False)

print("Novas linhas de produtos foram salvas em 'novas_linhas.csv'")