async function buscar() {
  const origem = document.getElementById('origem').value;
  const destino = document.getElementById('destino').value;
  const data = document.getElementById('data').value;
  const token = prompt("Informe o token JWT:");
  const res = await fetch('http://localhost:3000/api/passagens/buscar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ origem, destino, data })
  });
  const resultado = await res.json();
  document.getElementById('resultado').textContent = JSON.stringify(resultado, null, 2);
}