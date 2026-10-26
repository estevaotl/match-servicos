import { Link } from 'react-router-dom';
import { FiArrowLeft, FiArrowUpRight, FiTool } from 'react-icons/fi';
import '../../marketplace/styles.css';
import './styles.css';

export default function NaoEncontradaPage() {
  return <div className="not-found-page"><div className="not-found-layout"><div className="not-found-art" aria-hidden="true"><div className="not-found-sign"><span>404</span><div><FiTool /><span>Fora do caminho.</span></div></div><span className="not-found-note">Bora encontrar<br />outra direção?</span></div><section className="not-found-content" aria-labelledby="not-found-heading"><p className="not-found-label">Página não encontrada</p><h1 id="not-found-heading">Esse caminho<br />não deu match.</h1><p>A página pode ter mudado de endereço ou o link está incompleto. Tem um próximo bom encontro esperando por você.</p><div className="not-found-actions"><Link className="market-primary" to="/"><FiArrowLeft aria-hidden="true" />Voltar ao início</Link><Link className="market-subtle" to="/busca">Encontrar um profissional <FiArrowUpRight aria-hidden="true" /></Link></div><Link className="not-found-contact" to="/contato">Precisa de uma mão? Fale com a equipe.</Link></section></div></div>;
}
