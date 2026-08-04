<?php
/* Hidroeng — handler dos formulários (fornecedor / candidato). Padrão BuildV. */
header('Content-Type: application/json; charset=utf-8');

function fail($msg, $code = 400) {
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Método não permitido.', 405);
if (!file_exists(__DIR__ . '/db-config.php')) fail('Configuração ausente no servidor.', 500);
require __DIR__ . '/db-config.php';

$type = $_POST['form_type'] ?? '';
if (!in_array($type, ['fornecedor', 'candidato'], true)) fail('Tipo de formulário inválido.');

$nome     = trim(mb_substr($_POST['nome'] ?? '', 0, 160));
$email    = trim(mb_substr($_POST['email'] ?? '', 0, 160));
$telefone = trim(mb_substr($_POST['telefone'] ?? '', 0, 40));
$empresa  = trim(mb_substr($_POST['empresa'] ?? '', 0, 160));
$produto  = trim(mb_substr($_POST['produto'] ?? '', 0, 200));
$area     = trim(mb_substr($_POST['area'] ?? '', 0, 120));

if ($nome === '' || $telefone === '') fail('Preencha os campos obrigatórios.');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) fail('E-mail inválido.');

/* Upload opcional — só PDF/DOC/DOCX, máx. 5 MB, nome aleatório, fora de execução */
$arquivo_path = null;
if (!empty($_FILES['arquivo']['name']) && $_FILES['arquivo']['error'] === UPLOAD_ERR_OK) {
    if ($_FILES['arquivo']['size'] > 5 * 1024 * 1024) fail('Arquivo acima de 5 MB.');
    $ext = strtolower(pathinfo($_FILES['arquivo']['name'], PATHINFO_EXTENSION));
    $mimes = ['pdf' => 'application/pdf',
              'doc' => 'application/msword',
              'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!isset($mimes[$ext])) fail('Formato não permitido (use PDF, DOC ou DOCX).');
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $_FILES['arquivo']['tmp_name']);
    finfo_close($finfo);
    if ($mime !== $mimes[$ext]) fail('Conteúdo do arquivo não corresponde à extensão.');
    if (!is_dir(PROJETO_UPLOAD_DIR)) mkdir(PROJETO_UPLOAD_DIR, 0755, true);
    $htaccess = PROJETO_UPLOAD_DIR . '.htaccess';
    if (!file_exists($htaccess)) {
        file_put_contents($htaccess, "php_flag engine off\nOptions -ExecCGI -Indexes\nRemoveHandler .php .phtml .php3 .php4 .php5 .php7 .phps\n");
    }
    $fname = PROJETO_PREFIX . '_' . bin2hex(random_bytes(12)) . '.' . $ext;
    if (!move_uploaded_file($_FILES['arquivo']['tmp_name'], PROJETO_UPLOAD_DIR . $fname)) {
        fail('Falha ao salvar o arquivo.', 500);
    }
    $arquivo_path = PROJETO_UPLOAD_URL . $fname;
}

try {
    $pdo = new PDO(
        'mysql:host=' . PROJETO_DB_HOST . ';dbname=' . PROJETO_DB_NAME . ';charset=utf8mb4',
        PROJETO_DB_USER, PROJETO_DB_PASSWORD,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    $pdo->exec('CREATE TABLE IF NOT EXISTS ' . PROJETO_PREFIX . '_leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        form_type VARCHAR(20) NOT NULL,
        nome VARCHAR(160) NOT NULL,
        email VARCHAR(160) NOT NULL,
        telefone VARCHAR(40) NOT NULL,
        empresa VARCHAR(160) NULL,
        produto VARCHAR(200) NULL,
        area VARCHAR(120) NULL,
        arquivo VARCHAR(255) NULL,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) DEFAULT CHARSET=utf8mb4');
    $st = $pdo->prepare('INSERT INTO ' . PROJETO_PREFIX . '_leads
        (form_type, nome, email, telefone, empresa, produto, area, arquivo)
        VALUES (?,?,?,?,?,?,?,?)');
    $st->execute([$type, $nome, $email, $telefone, $empresa ?: null, $produto ?: null, $area ?: null, $arquivo_path]);
} catch (PDOException $e) {
    fail('Erro interno ao registrar. Tente novamente mais tarde.', 500);
}

/* Notificação por e-mail (best-effort; não bloqueia a resposta) */
$assunto = ($type === 'fornecedor' ? 'Novo cadastro de fornecedor' : 'Nova candidatura') . ' — Hidroeng';
$corpo = "Nome: $nome\nE-mail: $email\nTelefone: $telefone\n"
       . ($empresa ? "Empresa: $empresa\n" : '')
       . ($produto ? "Produto/serviço: $produto\n" : '')
       . ($area ? "Área: $area\n" : '')
       . ($arquivo_path ? "Arquivo: $arquivo_path\n" : '');
@mail(PROJETO_NOTIFY, $assunto, $corpo, 'From: no-reply@' . ($_SERVER['SERVER_NAME'] ?? 'hidroengenharia.com.br'));

echo json_encode(['success' => true], JSON_UNESCAPED_UNICODE);
