import { useState, useEffect, useCallback } from "react";

const API = "http://localhost:8090";

function statusNome(s) {
  return ["aberto", "em andamento", "resolvido", "fechado"][s] || "?";
}
function prioridadeNome(p) {
  return ["baixa", "media", "alta"][p] || "?";
}

function App() {
  const [tickets, setTickets] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const buscar = useCallback(() => {
    return fetch(API + "/tickets")
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then((dados) => {
        setTickets(Array.isArray(dados) ? dados : []);
        setErro(null);
      })
      .catch((e) => {
        setErro("Nao foi possivel carregar os chamados: " + e.message);
        setTickets([]);
      })
      .finally(() => {
        setCarregando(false);
      });
  }, []);

  const carregar = useCallback(() => {
    setCarregando(true);
    buscar();
  }, [buscar]);

  useEffect(() => {
    buscar();
  }, [buscar]);

  function atribuirAuto(id) {
    fetch(API + "/tickets/" + id + "/assign-auto", { method: "POST" })
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(() => carregar())
      .catch((e) => {
        setErro("Falha ao atribuir o chamado: " + e.message);
      });
  }

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Chamados internos (Go + React)</h1>

      <button onClick={carregar} disabled={carregando} style={{ marginBottom: 16 }}>
        Recarregar
      </button>

      {erro && (
        <p style={{ color: "#b00020", marginBottom: 16 }}>{erro}</p>
      )}

      {carregando ? (
        <p>Carregando...</p>
      ) : tickets.length === 0 ? (
        <p>Nenhum chamado encontrado.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#1a3a5c", color: "#fff", textAlign: "left" }}>
              <th style={{ padding: 10 }}>Titulo</th>
              <th style={{ padding: 10 }}>Prioridade</th>
              <th style={{ padding: 10 }}>Status</th>
              <th style={{ padding: 10 }}>Responsavel</th>
              <th style={{ padding: 10 }}>Acao</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: 10 }}>{t.title}</td>
                <td style={{ padding: 10 }}>{prioridadeNome(t.priority)}</td>
                <td style={{ padding: 10 }}>{statusNome(t.status)}</td>
                <td style={{ padding: 10 }}>{t.agent_name || "-"}</td>
                <td style={{ padding: 10 }}>
                  <button onClick={() => atribuirAuto(t.id)}>
                    Atribuir auto
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
