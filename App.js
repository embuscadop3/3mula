import React, { useState, useCallback, useEffect } from 'react';
import './App.css';

// Componente para a lista de dias e períodos
const PeriodosDoDia = ({ dia, estudos }) => {
  return (
    <div className="dia-container">
      <h2>{dia}</h2>
      {['manha', 'tarde', 'noite'].map(periodo => (
        <div key={periodo} className="periodo-container">
          <strong>{`${periodo.charAt(0).toUpperCase() + periodo.slice(1)}:`}</strong> {estudos[dia][periodo]}
        </div>
      ))}
    </div>
  );
};

function App() {
  const diasDaSemana = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];

  const [estudos, setEstudos] = useState(() => {
    // 3. Carregar dados do LocalStorage
    const savedData = localStorage.getItem('estudos');
    return savedData ? JSON.parse(savedData) : {
      'Segunda-feira': { manha: '', tarde: '', noite: '' },
      'Terça-feira': { manha: '', tarde: '', noite: '' },
      'Quarta-feira': { manha: '', tarde: '', noite: '' },
      'Quinta-feira': { manha: '', tarde: '', noite: '' },
      'Sexta-feira': { manha: '', tarde: '', noite: '' },
      'Sábado': { manha: '', tarde: '', noite: '' },
      'Domingo': { manha: '', tarde: '', noite: '' },
    };
  });

  const [atividade, setAtividade] = useState('');
  const [diaSelecionado, setDiaSelecionado] = useState('Segunda-feira');
  const [periodoSelecionado, setPeriodoSelecionado] = useState('manha');
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('');

  // 3. Salvar os dados no LocalStorage quando houver mudanças
  useEffect(() => {
    localStorage.setItem('estudos', JSON.stringify(estudos));
  }, [estudos]);

  const getPeriodosDisponiveis = (dia) => {
    return ['manha', 'tarde', 'noite'].filter(periodo => !estudos[dia][periodo]);
  };

  const adicionarAtividade = useCallback(() => {
    if (!atividade) {
      setMensagem('Por favor, insira uma atividade.');
      setTipoMensagem('erro');
      return;
    }

    // 1. Impedir atividades duplicadas no mesmo período
    if (estudos[diaSelecionado][periodoSelecionado] === atividade) {
      setMensagem('Esta atividade já foi adicionada para este período.');
      setTipoMensagem('erro');
      return;
    }

    setEstudos((prevEstudos) => ({
      ...prevEstudos,
      [diaSelecionado]: {
        ...prevEstudos[diaSelecionado],
        [periodoSelecionado]: atividade,
      },
    }));

    setMensagem('Atividade adicionada com sucesso!');
    setTipoMensagem('sucesso');
    setAtividade('');
    setPeriodoSelecionado(getPeriodosDisponiveis(diaSelecionado)[0]);

    setTimeout(() => {
      setMensagem('');
      setTipoMensagem('');
    }, 3000);
  }, [atividade, diaSelecionado, periodoSelecionado]);

  // 2. Função para limpar todas as atividades
  const limparAtividades = () => {
    setEstudos({
      'Segunda-feira': { manha: '', tarde: '', noite: '' },
      'Terça-feira': { manha: '', tarde: '', noite: '' },
      'Quarta-feira': { manha: '', tarde: '', noite: '' },
      'Quinta-feira': { manha: '', tarde: '', noite: '' },
      'Sexta-feira': { manha: '', tarde: '', noite: '' },
      'Sábado': { manha: '', tarde: '', noite: '' },
      'Domingo': { manha: '', tarde: '', noite: '' },
    });
    setMensagem('Todas as atividades foram removidas.');
    setTipoMensagem('sucesso');
  };

  return (
    <div className="app-container">
      <h1>Gerenciador de Estudos 2024</h1>

      <div className="input-container">
        <label>Dia:</label>
        <select value={diaSelecionado} onChange={(e) => setDiaSelecionado(e.target.value)}>
          {diasDaSemana.map(dia => (
            <option key={dia} value={dia}>{dia}</option>
          ))}
        </select>

        <label>Período:</label>
        <select value={periodoSelecionado} onChange={(e) => setPeriodoSelecionado(e.target.value)}>
          {getPeriodosDisponiveis(diaSelecionado).map(periodo => (
            <option key={periodo} value={periodo}>
              {periodo.charAt(0).toUpperCase() + periodo.slice(1)}
            </option>
          ))}
        </select>

        <label>O que estudar:</label>
        <input
          type="text"
          value={atividade}
          onChange={(e) => setAtividade(e.target.value)}
          placeholder="Ex: Matemática"
        />
        <button onClick={adicionarAtividade}>Adicionar Estudo</button>
      </div>

      {/* Exibição de mensagem de erro ou sucesso */}
      {mensagem && (
        <p className={tipoMensagem === 'erro' ? 'mensagem-erro' : 'mensagem-sucesso'}>
          {mensagem}
        </p>
      )}


      {/* Renderizar os dias da semana */}
      {diasDaSemana.map(dia => (
        <PeriodosDoDia key={dia} dia={dia} estudos={estudos} />
      ))}


      {/* 2. Botão para limpar todas as atividades */}
      <button onClick={limparAtividades}>Limpar Atividades</button>
    </div>
  );
}

export default App;
