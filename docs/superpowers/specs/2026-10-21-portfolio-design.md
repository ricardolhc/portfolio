# Portfólio Ricardo Costa — design

Implementar no checkout fornecido, inicialmente vazio. O briefing do usuário é a especificação completa e autoriza execução sem interrupções. Esta síntese registra as decisões de implementação.

SPA React/Vite/TypeScript estrito, Tailwind 4 e Motion. Design editorial monocromático: fundo claro levemente cinza, navegação compacta, hero tipográfico de grande escala, grades e separadores finos, números de impacto destacados e dark mode com contraste alto. Sem imagens ilustrativas, fontes externas obrigatórias ou conteúdo profissional inventado.

Seções: início, sobre, experiência (CLT separada de independente), projetos, tecnologias, formação, certificação e contato. O conteúdo PT/EN preserva todas as ressalvas do briefing. Sem currículo, repositórios de projeto ou credencial fictícia.

Domain contém contratos e validação de contato. Application compõe mensagens e coordena contato e preferências. Infrastructure adapta localStorage, ambiente do navegador, clipboard e cliente de e-mail. Core implementa tokens, registry isolado (singleton/factory e detecção de ciclos), inject e Context. Composition root configura implementações reais; testes recebem fakes. Dados profissionais são estáticos e não precisam de repositório abstrato.

Idioma: persistido → navegador PT/EN → PT. Tema: persistido → sistema. Mudanças manuais persistem; indisponibilidade do storage não bloqueia a UI. Formulário valida campos e prepara mailto codificado; informa que envio deve ser concluído no cliente. Cópia de endereço e mensagem oferece fallback selecionável se clipboard falhar.

Testes Vitest/jsdom/RTL/userEvent por comportamento. Metas de cobertura 85% linhas/funções e 80% branches. Stryker/Vitest inclui regras executáveis, inclusive UI comportamental, com high 85/low 70/break 75. Mutantes sobreviventes serão analisados.

GitHub Actions valida e constrói; deploy Pages manual/branch main, base inferida do repositório real. URL de produção via VITE_SITE_URL; sem canonical/sitemap inventados. Metadados estáticos PT e limitações de SEO multilíngue documentadas. Não publicar em hospedagem externa adicional.
