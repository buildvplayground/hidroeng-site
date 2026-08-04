<?php
/* Hidroeng — configuração do backend de formulários.
   Copie para db-config.php e preencha (db-config.php é git-ignored; NUNCA versionar credenciais). */
define('PROJETO_PREFIX', 'hidroeng');
if (!defined('PROJETO_DB_HOST'))     define('PROJETO_DB_HOST',     'localhost');
if (!defined('PROJETO_DB_NAME'))     define('PROJETO_DB_NAME',     'u000000_hidroeng');
if (!defined('PROJETO_DB_USER'))     define('PROJETO_DB_USER',     'u000000_hidroeng');
if (!defined('PROJETO_DB_PASSWORD')) define('PROJETO_DB_PASSWORD', '');
if (!defined('PROJETO_NOTIFY'))      define('PROJETO_NOTIFY',      'contato@hidroengenharia.com.br');
if (!defined('PROJETO_ADMIN_PASS'))  define('PROJETO_ADMIN_PASS',  'TROCAR_ANTES_DO_DEPLOY');
if (!defined('PROJETO_UPLOAD_DIR'))  define('PROJETO_UPLOAD_DIR',  __DIR__ . '/uploads/arquivos/');
if (!defined('PROJETO_UPLOAD_URL'))  define('PROJETO_UPLOAD_URL',  '/uploads/arquivos/');
