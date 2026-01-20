# Guia de Edição de Arquivos Liquid (Shopify)

## O que é Liquid?

**Liquid** é uma linguagem de template desenvolvida pela Shopify para criar temas dinâmicos. Ela permite combinar HTML com lógica de programação para exibir conteúdo dinâmico nas lojas.

---

## Estrutura Básica

### 1. **Delimitadores**

Liquid usa três tipos de delimitadores:

```liquid
{{ variavel }}           <!-- Exibe o valor de uma variável -->
{% comando %}            <!-- Executa lógica (if, for, assign, etc) -->
{%- comando -%}          <!-- Remove espaços em branco antes/depois -->
```

### 2. **Comentários**

```liquid
<!-- Comentário HTML (visível no código-fonte) -->
{% comment %}Comentário Liquid (não aparece no código-fonte){% endcomment %}
```

---

## Variáveis e Atribuições

### Atribuir Valores

```liquid
{% assign nome_variavel = 'valor' %}
{% assign contador = 0 %}
{% assign preco = 99.90 %}
```

### Acessar Propriedades de Objetos

```liquid
{{ section.settings.title }}
{{ product.title }}
{{ block.settings.text_size }}
```

---

## Estruturas de Controle

### 1. **Condicionais (if/elsif/else)**

```liquid
{% if section.settings.enable_overlay_text %}
  <div class="overlay">Conteúdo com overlay</div>
{% elsif section.settings.show_banner %}
  <div class="banner">Banner alternativo</div>
{% else %}
  <div>Conteúdo padrão</div>
{% endif %}
```

### 2. **Verificações Comuns**

```liquid
{% if variavel != blank %}        <!-- Verifica se não está vazio -->
{% if variavel == nil %}           <!-- Verifica se é nulo -->
{% if numero > 10 %}               <!-- Comparação numérica -->
{% unless condicao %}              <!-- Equivalente a "if not" -->
```

### 3. **Loops (for)**

```liquid
{% for block in section.blocks %}
  <div>{{ block.settings.title }}</div>
{% endfor %}

{% for i in (1..3) %}              <!-- Loop de 1 a 3 -->
  Item {{ forloop.index }}
{% endfor %}
```

**Variáveis úteis em loops:**

- `forloop.index` - Índice atual (começa em 1)
- `forloop.first` - Verdadeiro na primeira iteração
- `forloop.last` - Verdadeiro na última iteração

### 4. **Case/When (Switch)**

```liquid
{% case block.type %}
  {% when 'heading' %}
    <h1>{{ block.settings.title }}</h1>
  {% when 'text' %}
    <p>{{ block.settings.text }}</p>
  {% when 'button' %}
    <a href="#">{{ block.settings.link_text }}</a>
{% endcase %}
```

---

## Filtros

Filtros modificam a saída de variáveis usando o símbolo `|`:

### Filtros Comuns

```liquid
{{ 'texto' | upcase }}                    <!-- TEXTO -->
{{ 'TEXTO' | downcase }}                  <!-- texto -->
{{ texto | escape }}                      <!-- Escapa HTML -->
{{ numero | plus: 10 }}                   <!-- Soma 10 -->
{{ numero | minus: 5 }}                   <!-- Subtrai 5 -->
{{ numero | times: 2 }}                   <!-- Multiplica por 2 -->
{{ numero | divided_by: 2 }}              <!-- Divide por 2 -->
{{ numero | times: 0.01 }}                <!-- Converte para decimal -->
{{ texto | default: 'Valor padrão' }}     <!-- Valor se vazio -->
{{ texto | prepend: 'prefixo-' }}         <!-- Adiciona antes -->
{{ texto | append: '-sufixo' }}           <!-- Adiciona depois -->
{{ texto | replace: 'old', 'new' }}       <!-- Substitui texto -->
{{ array | join: ', ' }}                  <!-- Junta array com vírgula -->
```

### Filtros de Imagem (Shopify)

```liquid
{{ section.settings.image | image_url: width: 800 }}
{{ product.featured_image | image_url: width: 1200, height: 600 }}
```

---

## Snippets (Includes)

Snippets são arquivos reutilizáveis (geralmente em `/snippets/`):

```liquid
{% render 'nome-do-snippet' %}
{% render 'video-popup', video: block.settings.video_link, unique: section.id %}
```

---

## Objetos Shopify Comuns

### Section

```liquid
{{ section.id }}                    <!-- ID único da seção -->
{{ section.settings.titulo }}       <!-- Configuração definida no schema -->
{{ section.blocks }}                <!-- Blocos da seção -->
```

### Block

```liquid
{{ block.type }}                    <!-- Tipo do bloco (heading, text, etc) -->
{{ block.settings.text }}           <!-- Configuração do bloco -->
{{ block.shopify_attributes }}      <!-- Atributos para editor visual -->
```

### Settings (Tema)

```liquid
{{ settings.layout_site_width }}    <!-- Configuração global do tema -->
```

---

## Schema (Configurações do Editor)

No final dos arquivos `.liquid` de seções, há um bloco `{% schema %}` em JSON que define as configurações editáveis no painel do Shopify:

```liquid
{% schema %}
{
  "name": "Nome da Seção",
  "settings": [
    {
      "type": "text",
      "id": "titulo",
      "label": "Título",
      "default": "Título padrão"
    },
    {
      "type": "range",
      "id": "padding_top",
      "min": 0,
      "max": 100,
      "step": 5,
      "unit": "px",
      "label": "Espaçamento superior",
      "default": 20
    },
    {
      "type": "select",
      "id": "cor",
      "label": "Cor",
      "options": [
        { "value": "azul", "label": "Azul" },
        { "value": "vermelho", "label": "Vermelho" }
      ],
      "default": "azul"
    },
    {
      "type": "checkbox",
      "id": "ativar_overlay",
      "label": "Ativar overlay",
      "default": false
    },
    {
      "type": "image_picker",
      "id": "imagem",
      "label": "Imagem de fundo"
    },
    {
      "type": "video",
      "id": "video_bg",
      "label": "Vídeo de fundo"
    }
  ],
  "blocks": [
    {
      "type": "heading",
      "name": "Título",
      "settings": [...]
    }
  ]
}
{% endschema %}
```

### Tipos de Campos Comuns

| Tipo           | Descrição                      |
| -------------- | ------------------------------ |
| `text`         | Campo de texto simples         |
| `textarea`     | Área de texto multilinha       |
| `richtext`     | Editor de texto rico (HTML)    |
| `image_picker` | Seletor de imagem              |
| `video`        | Upload de vídeo                |
| `video_url`    | URL de vídeo (YouTube/Vimeo)   |
| `range`        | Controle deslizante numérico   |
| `select`       | Lista suspensa                 |
| `checkbox`     | Caixa de seleção               |
| `color`        | Seletor de cor                 |
| `url`          | Campo de URL/link              |
| `header`       | Cabeçalho visual (não é campo) |

---

## Boas Práticas

### 1. **Remover Espaços em Branco**

Use `{%-` e `-%}` para evitar espaços desnecessários:

```liquid
{%- assign variavel = 'valor' -%}
```

### 2. **Verificar Existência Antes de Usar**

```liquid
{% if section.settings.image %}
  <img src="{{ section.settings.image | image_url }}">
{% endif %}
```

### 3. **Usar Valores Padrão**

```liquid
{%- assign alt = section.settings.image.alt | default: 'Imagem padrão' -%}
```

### 4. **Organizar Código com Comentários**

```liquid
<!-- /sections/section-video.liquid -->

{%- comment -%}
  Seção de vídeo banner com overlay e texto
{%- endcomment -%}
```

---

## Exemplos Práticos do Seu Arquivo

### 1. **Atribuição com Condicional**

```liquid
{%- assign scroll_class = '' -%}
{% if section.settings.height == 'use_screen_full' %}
  {%- assign scroll_class = 'has-scroll-arrow' -%}
{%- endif -%}
```

### 2. **Loop com Case**

```liquid
{% for block in section.blocks %}
  {% case block.type %}
    {% when 'heading' %}
      <h1>{{ block.settings.title }}</h1>
    {% when 'text' %}
      <p>{{ block.settings.text }}</p>
  {% endcase %}
{% endfor %}
```

### 3. **Estilos Inline com Variáveis**

```liquid
<div style="--PT: {{ section.settings.padding_top }}px; --PB: {{ section.settings.padding_bottom }}px;">
```

### 4. **Atributos Condicionais**

```liquid
<div
  {% if section.settings.width == "wrapper--none" and section.settings.padding_top == 0 %}
    data-overlay-header
  {% endif %}>
```

---

## Recursos Adicionais

- **Documentação Oficial Liquid**: https://shopify.dev/docs/api/liquid
- **Referência de Objetos Shopify**: https://shopify.dev/docs/api/liquid/objects
- **Filtros Liquid**: https://shopify.dev/docs/api/liquid/filters

---

## Dicas de Edição

1. **Sempre teste suas alterações** no ambiente de desenvolvimento do Shopify
2. **Use o editor de temas do Shopify** para visualizar mudanças em tempo real
3. **Mantenha backups** antes de fazer alterações significativas
4. **Consulte o schema** para entender quais configurações estão disponíveis
5. **Siga a estrutura existente** do tema para manter consistência

---

**Criado em**: 2026-01-16  
**Projeto**: Patrik Theme (Shopify)
