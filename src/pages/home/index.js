import { useState } from 'react';
import { Header } from '../../components/Header';
import background from '../../assets/background.png';
import ItemList from '../../components/ItemList';
import './styles.css';

function App() {
  const [user, setUser] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [repos, setRepos] = useState([]);

  const handleGetData = async () => {
    if (!user) return;

    try {
      // Busca dados do usuário
      const userResponse = await fetch(`https://api.github.com/users/${user}`);
      const userData = await userResponse.json();

      if (userData && userData.login) {
        const { avatar_url, name, bio, login } = userData;
        setCurrentUser({
          avatar_url,
          name: name || "Nome não informado",
          bio: bio || "Sem descrição no perfil",
          login
        });

        // Busca repositórios
        const reposResponse = await fetch(`https://api.github.com/users/${user}/repos`);
        const reposData = await reposResponse.json();
        setRepos(reposData);
      } else {
        setCurrentUser(null);
        setRepos([]);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  return (
    <div className="App">
      <Header />

      <div className="conteudo">
        <img src={background} className="background" alt="background app" />

        <div className="info">
          {/* Área de busca */}
          <div className="busca">
            <input
              name="usuario"
              value={user}
              onChange={event => setUser(event.target.value)}
              placeholder="@username"
            />
            <button onClick={handleGetData}>Buscar</button>
          </div>

          {/* Perfil */}
          {currentUser && (
            <>
              <div className="perfil">
                <img
                  className="profile"
                  src={currentUser.avatar_url}
                  alt="Foto de perfil"
                />
                <div>
                  <h3>{currentUser.name}</h3>
                  <span>@{currentUser.login}</span>
                  <p>{currentUser.bio}</p>
                </div>
              </div>
              <hr />
            </>
          )}

          {/* Lista de repositórios */}
          {repos.length > 0 && (
            <div>
              <h4 className="repositorio">Repositórios</h4>
              {repos.map(repo => (
                <ItemList
                  key={repo.id}
                  title={repo.name}
                  description={repo.description || "Sem descrição"}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
