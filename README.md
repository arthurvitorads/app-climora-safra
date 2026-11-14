# Climora Agro

MVP de gestão agrícola em **Vue 3 + TypeScript + Vite** inspirado na identidade visual enviada (verde `#496846`, bege `#F7EDE1` e logo planta/sol).

## Executar

Requer Node.js 20.19+ ou 22.12+.

```bash
npm install
npm run dev
```

Abra o endereço mostrado pelo Vite (geralmente `http://localhost:5173`).

## Funcionalidades

- Painel com propriedades, área total, cultivos e lucro estimado.
- Criar, editar, buscar e excluir propriedades rurais.
- Criar, editar, buscar e excluir cultivos vinculados a uma propriedade.
- Formulários com validação básica, datas, área, produtividade, custo e preço.
- Cálculo de receita bruta = área plantada × produtividade (kg/ha) × preço (R$/kg).
- Cálculo de lucro estimado = receita bruta − custos informados.
- Dados persistidos **somente no localStorage do navegador**. Sem conta, servidor, sincronização ou backup.

## Próximas etapas

1. Backend e banco de dados (usuários, propriedades, safras e análises de solo).
2. Adicionar culturas personalizadas, unidades comerciais (saca, tonelada), múltiplas safras e divisão por talhões.
3. Integrar dados observados da NASA POWER, GPM, Landsat e dados agronômicos da Embrapa.
4. Integrar uma fonte de previsão meteorológica e validar modelos de perda de produtividade antes de estimar prejuízo climático.
5. Implementar custos detalhados, preços reais, intervalos de confiança, relatório e alerta climático.

**Importante:** o MVP calcula lucro a partir de dados informados pelo usuário. Não realiza previsão de clima, detecção de doenças nem recomendações agronômicas automáticas.
