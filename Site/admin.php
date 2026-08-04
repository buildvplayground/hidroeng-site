<?php
/* Hidroeng — painel simples de leads (fornecedores + candidaturas). Padrão BuildV. */
session_start();
if (!file_exists(__DIR__ . '/db-config.php')) { http_response_code(500); exit('Configuração ausente.'); }
require __DIR__ . '/db-config.php';

if (isset($_GET['sair'])) { session_destroy(); header('Location: admin.php'); exit; }
if (isset($_POST['senha'])) {
    if (hash_equals(PROJETO_ADMIN_PASS, $_POST['senha'])) { session_regenerate_id(true); $_SESSION['hidroeng_admin'] = true; }
    else { $erro = 'Senha incorreta.'; }
}
$logado = !empty($_SESSION['hidroeng_admin']);
$rows = [];
if ($logado) {
    try {
        $pdo = new PDO('mysql:host=' . PROJETO_DB_HOST . ';dbname=' . PROJETO_DB_NAME . ';charset=utf8mb4',
            PROJETO_DB_USER, PROJETO_DB_PASSWORD, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
        $rows = $pdo->query('SELECT * FROM ' . PROJETO_PREFIX . '_leads ORDER BY criado_em DESC LIMIT 500')
                    ->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) { $erro = 'Banco indisponível ou tabela ainda vazia.'; }
}
function h($s) { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
?><!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>Admin — Hidroeng</title>
<style>
body{font-family:system-ui,sans-serif;background:#F5F8FA;color:#0A1826;margin:0;padding:24px}
.card{background:#fff;border:1px solid #EDF2F6;border-radius:12px;padding:24px;max-width:1100px;margin:0 auto}
h1{font-size:20px;margin:0 0 18px}
input[type=password]{padding:10px 12px;border:1px solid #C6D2DC;border-radius:8px;font-size:15px}
button{padding:10px 18px;border:none;border-radius:8px;background:#0060B0;color:#fff;font-weight:600;cursor:pointer}
table{width:100%;border-collapse:collapse;font-size:13.5px;margin-top:14px}
th,td{padding:9px 10px;border-bottom:1px solid #EDF2F6;text-align:left;vertical-align:top}
th{background:#0A1826;color:#fff;position:sticky;top:0}
.err{color:#8a2020;margin:10px 0}
.top{display:flex;justify-content:space-between;align-items:center}
a{color:#0060B0}
.tag{display:inline-block;padding:2px 9px;border-radius:99px;font-size:11.5px;font-weight:700}
.tag.fornecedor{background:#D2E8FA;color:#004C8F}
.tag.candidato{background:#DBF3E9;color:#0E6B47}
</style>
</head>
<body>
<div class="card">
<?php if (!$logado): ?>
  <h1>Painel Hidroeng — acesso</h1>
  <?php if (!empty($erro)) echo '<p class="err">' . h($erro) . '</p>'; ?>
  <form method="post"><input type="password" name="senha" placeholder="Senha do admin" autofocus required> <button type="submit">Entrar</button></form>
<?php else: ?>
  <div class="top"><h1>Leads — Fornecedores &amp; Trabalhe Conosco (<?= count($rows) ?>)</h1><a href="?sair=1">Sair</a></div>
  <?php if (!empty($erro)) echo '<p class="err">' . h($erro) . '</p>'; ?>
  <table>
    <tr><th>Data</th><th>Tipo</th><th>Nome</th><th>E-mail</th><th>Telefone</th><th>Empresa</th><th>Produto/Área</th><th>Arquivo</th></tr>
    <?php foreach ($rows as $r): ?>
    <tr>
      <td><?= h($r['criado_em']) ?></td>
      <td><span class="tag <?= h($r['form_type']) ?>"><?= h($r['form_type']) ?></span></td>
      <td><?= h($r['nome']) ?></td>
      <td><?= h($r['email']) ?></td>
      <td><?= h($r['telefone']) ?></td>
      <td><?= h($r['empresa']) ?></td>
      <td><?= h($r['produto'] ?: $r['area']) ?></td>
      <td><?= $r['arquivo'] ? '<a href="' . h($r['arquivo']) . '" target="_blank" rel="noopener">abrir</a>' : '—' ?></td>
    </tr>
    <?php endforeach; ?>
  </table>
<?php endif; ?>
</div>
</body>
</html>
