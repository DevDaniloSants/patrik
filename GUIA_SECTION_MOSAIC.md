# Guia do Arquivo section-mosaic.liquid

Este documento explica cada tag Liquid (`{% %}`) utilizada no arquivo `section-mosaic.liquid` e sua função.

---

## 📋 Índice

1. [Estrutura Geral](#estrutura-geral)
2. [Tags de Controle de Fluxo](#tags-de-controle-de-fluxo)
3. [Tags de Variáveis](#tags-de-variáveis)
4. [Tags de Renderização](#tags-de-renderização)
5. [Schema JSON](#schema-json)

---

## Estrutura Geral

O arquivo `section-mosaic.liquid` cria uma seção de mosaico que pode exibir diferentes tipos de blocos: **Collection**, **Product**, **Image** e **Post (Article)**.

---

## Tags de Controle de Fluxo

### `{% if %}` / `{% elsif %}` / `{% else %}` / `{% endif %}`

**Função:** Condicional - executa código apenas se a condição for verdadeira.

**Exemplos no arquivo:**

```liquid
{% if section.blocks.size == 0 %}
  <div class="text-center">{{ 'home_page.onboarding.no_content' | t }}</div>
{% else %}
  <!-- Renderiza os blocos -->
{% endif %}
```

- **Linha 8-10:** Verifica se não há blocos configurados e exibe mensagem de "sem conteúdo"

```liquid
{% if block.settings.kicker != '' %}
  <div class="tile__kicker {{ kicker_size_class }}">
    <p>{{ block.settings.kicker }}</p>
  </div>
{% endif %}
```

- **Linha 113-118:** Exibe o "kicker" (texto pequeno acima do título) apenas se estiver configurado

```liquid
{% if block.settings.show_title %}
  <!-- Exibe o título -->
{% endif %}
```

- **Linha 121-132:** Exibe o título apenas se a opção `show_title` estiver ativada

---

### `{% unless %}` / `{% endunless %}`

**Função:** Condicional inverso - executa código apenas se a condição for **falsa**.

**Exemplo:**

```liquid
{% unless block.settings.title_text == '' %}
  <div class="tile__content">
    <div class="tile__title {{ heading_size_class }}">
      {{ block.settings.title_text }}
    </div>
  </div>
{% endunless %}
```

- **Linha 246-253:** Exibe o título apenas se NÃO estiver vazio (equivalente a `if title_text != ''`)

---

### `{% for %}` / `{% endfor %}`

**Função:** Loop - itera sobre uma coleção de itens.

**Exemplo:**

```liquid
{% for block in section.blocks %}
  <!-- Renderiza cada bloco -->
{% endfor %}
```

- **Linha 15-342:** Itera sobre todos os blocos da seção

```liquid
{% for tag in article.tags limit: 2 %}
  <span>{{ tag }}</span>
{% endfor %}
```

- **Linha 296-298:** Itera sobre as tags do artigo, limitando a 2 tags

**Variáveis especiais do loop:**

- `forloop.index` - Índice atual (começa em 1)
- `forloop.first` - Verdadeiro no primeiro item
- `forloop.last` - Verdadeiro no último item

---

### `{% case %}` / `{% when %}` / `{% endcase %}`

**Função:** Switch/Case - executa código baseado em diferentes valores de uma variável.

**Exemplo:**

```liquid
{% case section.settings.first_block_height %}
  {% when 'short' %}
    {% if forloop.index == section.blocks.size %}
      {% assign block_height = 'tall' %}
      {% assign block_width = 'lg' %}
    {% endif %}
  {% when 'tall' %}
    {% assign block_height = 'short' %}
    {% assign block_width = 'xl' %}
{% endcase %}
```

- **Linha 19-54:** Define altura e largura dos blocos baseado na configuração `first_block_height`

```liquid
{% case block.type %}
  {% when 'collection' %}
    <!-- Renderiza bloco de coleção -->
  {% when 'product' %}
    <!-- Renderiza bloco de produto -->
  {% when 'image' %}
    <!-- Renderiza bloco de imagem -->
  {% when 'post' %}
    <!-- Renderiza bloco de artigo -->
{% endcase %}
```

- **Linha 85-339:** Renderiza conteúdo diferente baseado no tipo de bloco

---

## Tags de Variáveis

### `{% assign %}`

**Função:** Cria ou atribui valor a uma variável.

**Exemplos:**

```liquid
{% assign wh_ratio = section.settings.wh_ratio | default: 0.6 %}
```

- **Linha 11:** Cria variável `wh_ratio` com valor das configurações ou 0.6 como padrão

```liquid
{% assign block_height = 'short' %}
{% assign block_width = 'sm' %}
```

- **Linha 16-17:** Define valores padrão para altura e largura do bloco

```liquid
{% assign columns = 1 %}
```

- **Linha 56:** Define número de colunas

```liquid
{% assign kicker_size_class = block.settings.kicker_size | prepend: 'accent-size-' %}
```

- **Linha 114:** Cria classe CSS concatenando 'accent-size-' com o tamanho configurado

---

### `{% liquid %}`

**Função:** Permite escrever múltiplas linhas de código Liquid sem repetir `{% %}`.

**Exemplo:**

```liquid
{% liquid
  assign collection = block.settings.collection
  assign img_object = block.settings.image | default: collection.image | default: collection.products.first.featured_media.preview_image
%}
```

- **Linha 87-90:** Define variáveis de coleção e imagem com múltiplos fallbacks

```liquid
{% liquid
  assign article = articles[block.settings.article]
  assign img_object = block.settings.image | default: article.image
%}
```

- **Linha 271-274:** Define variáveis de artigo e imagem

---

### `{% capture %}` / `{% endcapture %}`

**Função:** Captura o conteúdo HTML/texto gerado e armazena em uma variável.

**Exemplos:**

```liquid
{% capture grid_item_class %}
  grid__item--{{ block_height }} grid__item--{{ block_width }}
{% endcapture %}
```

- **Linha 68-70:** Captura classes CSS do item do grid

```liquid
{%- capture sizes -%}
  {%- render 'image-grid-sizes',
    columns_desktop: columns,
    columns_tablet: columns,
    columns_mobile: 1.0,
    section_width: 'wrapper'
  %}
{%- endcapture -%}
```

- **Linha 72-79:** Captura o resultado da renderização do snippet `image-grid-sizes`

```liquid
{%- capture srcset -%}
  {%- render 'image-grid-srcset',
    image: img_object,
    columns_desktop: columns,
    columns_tablet: columns,
    columns_mobile: 1.0,
    section_width: 'wrapper'
  %}
{%- endcapture -%}
```

- **Linha 92-100:** Captura o srcset da imagem para responsividade

```liquid
{%- capture placeholder -%}
  collection-{%- cycle '1', '2', '3', '4', '5', '6' -%}
{%- endcapture -%}
```

- **Linha 102-104:** Captura nome do placeholder usando cycle

---

## Tags de Renderização

### `{% render %}`

**Função:** Renderiza um snippet (arquivo parcial reutilizável) com parâmetros.

**Exemplos:**

```liquid
{%- render 'image-grid-sizes',
  columns_desktop: columns,
  columns_tablet: columns,
  columns_mobile: 1.0,
  section_width: 'wrapper'
%}
```

- **Linha 73-78:** Renderiza snippet que calcula tamanhos de imagem para diferentes dispositivos

```liquid
{%- render 'image-grid-srcset',
  image: img_object,
  columns_desktop: columns,
  columns_tablet: columns,
  columns_mobile: 1.0,
  section_width: 'wrapper'
%}
```

- **Linha 93-99:** Renderiza snippet que gera srcset para imagens responsivas

```liquid
{% render 'image',
  cover: true,
  img_object: img_object,
  wh_ratio: 0,
  sizes: sizes,
  srcset: srcset,
  placeholder: placeholder
%}
```

- **Linha 109:** Renderiza snippet de imagem com múltiplos parâmetros

---

### `{% schema %}` / `{% endschema %}`

**Função:** Define o schema JSON que configura a seção no editor do Shopify.

**Estrutura:**

```liquid
{% schema %}
{
  "name": "Mosaic",
  "max_blocks": 3,
  "settings": [...],
  "blocks": [...],
  "presets": [...],
  "disabled_on": {...}
}
{% endschema %}
```

- **Linha 348-1027:** Define toda a configuração da seção

**Componentes do Schema:**

- **`name`**: Nome da seção no editor
- **`max_blocks`**: Número máximo de blocos (3 neste caso)
- **`settings`**: Configurações gerais da seção (layout, cores, espaçamento)
- **`blocks`**: Tipos de blocos disponíveis (collection, product, image, post)
- **`presets`**: Configuração padrão ao adicionar a seção
- **`disabled_on`**: Onde a seção não pode ser usada (header, footer, aside)

---

## Filtros Liquid Utilizados

### Filtros de Texto

- **`| t`** - Tradução (translation)

  ```liquid
  {{ 'home_page.onboarding.no_content' | t }}
  ```

  - Busca tradução da chave no arquivo de idioma

- **`| default:`** - Valor padrão

  ```liquid
  {% assign wh_ratio = section.settings.wh_ratio | default: 0.6 %}
  ```

  - Usa valor padrão se a variável estiver vazia

- **`| prepend:`** - Adiciona texto no início

  ```liquid
  {% assign kicker_size_class = block.settings.kicker_size | prepend: 'accent-size-' %}
  ```

  - Resultado: 'accent-size-3' se kicker_size for 3

- **`| strip_html`** - Remove tags HTML

  ```liquid
  {{ article.title | strip_html | escape }}
  ```

- **`| escape`** - Escapa caracteres especiais para HTML

  ```liquid
  {{ block_title | strip_html | escape }}
  ```

- **`| truncatewords:`** - Limita número de palavras
  ```liquid
  {%- assign excerpt = article.excerpt_or_content | strip_html | truncatewords: 30 -%}
  ```

  - Limita a 30 palavras

### Filtros Numéricos

- **`| times:`** - Multiplicação

  ```liquid
  --overlay-opacity: {{ block.settings.overlay_opacity | times: 0.01 }};
  ```

  - Converte porcentagem (0-100) para decimal (0-1)

- **`| money`** - Formata preço

  ```liquid
  {{ price | money }}
  ```

  - Formata como moeda (ex: $19.99)

- **`| money_with_currency`** - Formata preço com código da moeda
  ```liquid
  {{ price | money_with_currency }}
  ```

  - Formata como moeda com código (ex: $19.99 USD)

---

## Objetos Shopify Utilizados

### `section`

- **`section.id`** - ID único da seção
- **`section.settings`** - Configurações da seção
- **`section.blocks`** - Array de blocos
- **`section.blocks.size`** - Número de blocos

### `block`

- **`block.type`** - Tipo do bloco (collection, product, image, post)
- **`block.settings`** - Configurações do bloco
- **`block.shopify_attributes`** - Atributos necessários para o editor

### `collection`

- **`collection.title`** - Título da coleção
- **`collection.url`** - URL da coleção
- **`collection.image`** - Imagem da coleção
- **`collection.products.first`** - Primeiro produto da coleção

### `product`

- **`product.title`** - Título do produto
- **`product.url`** - URL do produto
- **`product.price`** - Preço do produto
- **`product.price_varies`** - Se o preço varia
- **`product.images[0]`** - Primeira imagem do produto

### `article`

- **`article.title`** - Título do artigo
- **`article.url`** - URL do artigo
- **`article.image`** - Imagem do artigo
- **`article.tags`** - Tags do artigo
- **`article.excerpt_or_content`** - Resumo ou conteúdo completo

### `all_products`

- **`all_products[handle]`** - Acessa produto pelo handle
  ```liquid
  {% assign product = all_products[block.settings.product] %}
  ```

### `articles`

- **`articles[handle]`** - Acessa artigo pelo handle
  ```liquid
  {% assign article = articles[block.settings.article] %}
  ```

### `settings`

- **`settings.currency_code_enable`** - Configuração global do tema

---

## Funções Especiais

### `cycle`

**Função:** Alterna entre valores em cada iteração.

```liquid
{%- capture placeholder -%}
  collection-{%- cycle '1', '2', '3', '4', '5', '6' -%}
{%- endcapture -%}
```

- **Linha 103:** Alterna entre 'collection-1', 'collection-2', etc. a cada loop
- Usado para variar placeholders de imagem

---

## Sintaxe com Hífens `{%- -%}`

**Função:** Remove espaços em branco antes/depois da tag.

```liquid
{%- capture sizes -%}
  ...
{%- endcapture -%}
```

- **`{%-`** - Remove espaços em branco **antes** da tag
- **`-%}`** - Remove espaços em branco **depois** da tag
- Útil para evitar espaços indesejados no HTML final

---

## Resumo das Tags por Categoria

### 🔄 Controle de Fluxo

- `{% if %}` / `{% elsif %}` / `{% else %}` / `{% endif %}` - Condicionais
- `{% unless %}` / `{% endunless %}` - Condicional inverso
- `{% for %}` / `{% endfor %}` - Loops
- `{% case %}` / `{% when %}` / `{% endcase %}` - Switch/Case

### 📦 Variáveis

- `{% assign %}` - Atribuição de variável
- `{% liquid %}` - Múltiplas linhas de código
- `{% capture %}` / `{% endcapture %}` - Captura de conteúdo

### 🎨 Renderização

- `{% render %}` - Renderiza snippet
- `{% schema %}` / `{% endschema %}` - Define configurações da seção

### 🔧 Saída de Dados

- `{{ variavel }}` - Exibe valor de variável
- `{{ variavel | filtro }}` - Aplica filtro ao valor

---

## Exemplo Prático: Fluxo de um Bloco de Produto

```liquid
{% for block in section.blocks %}                    <!-- 1. Loop pelos blocos -->
  {% case block.type %}                              <!-- 2. Verifica tipo do bloco -->
    {% when 'product' %}                             <!-- 3. Se for produto -->
      {% liquid                                      <!-- 4. Define variáveis -->
        assign product = all_products[block.settings.product]
        assign price = product.price | default: 1999
        assign img_object = block.settings.image | default: product.images[0]
      %}

      {%- capture srcset -%}                         <!-- 5. Captura srcset -->
        {%- render 'image-grid-srcset',
          image: img_object,
          columns_desktop: columns,
          columns_tablet: columns,
          columns_mobile: 1.0,
          section_width: 'wrapper'
        %}
      {%- endcapture -%}

      <div class="tile__image">                      <!-- 6. Renderiza imagem -->
        {% render 'image',
          cover: true,
          img_object: img_object,
          wh_ratio: 0,
          sizes: sizes,
          srcset: srcset,
          placeholder: 'product-1'
        %}
      </div>

      {%- if block.settings.show_title -%}          <!-- 7. Exibe título se configurado -->
        <div class="tile__title">
          {{ block.settings.custom_title | default: product.title }}
        </div>
      {%- endif -%}

      {%- if block.settings.show_price -%}          <!-- 8. Exibe preço se configurado -->
        <span class="tile__link">
          {{ price | money }}
        </span>
      {%- endif -%}

      {% if product.url != blank %}                  <!-- 9. Adiciona link se existir -->
        <a href="{{ product.url }}" class="link-over-image"></a>
      {% endif %}
  {% endcase %}
{% endfor %}
```

---

## 💡 Dicas Importantes

1. **Sempre feche as tags:** Cada `{% if %}` precisa de um `{% endif %}`
2. **Use hífens para HTML limpo:** `{%- -%}` remove espaços em branco
3. **Filtros podem ser encadeados:** `{{ texto | strip_html | truncatewords: 30 }}`
4. **`assign` vs `capture`:** Use `assign` para valores simples, `capture` para HTML
5. **`default` é seu amigo:** Sempre forneça valores padrão para evitar erros
6. **Schema é obrigatório:** Sem ele, a seção não aparece no editor do Shopify

---

## 📚 Recursos Adicionais

- [Documentação Oficial do Liquid](https://shopify.dev/docs/api/liquid)
- [Objetos do Shopify](https://shopify.dev/docs/api/liquid/objects)
- [Filtros do Liquid](https://shopify.dev/docs/api/liquid/filters)
- [Tags do Liquid](https://shopify.dev/docs/api/liquid/tags)
