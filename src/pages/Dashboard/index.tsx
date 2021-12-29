import React, { useState, FormEvent, useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Logo from '../../assets/logo.svg';
import { api } from '../../services/api';
import { Title, Form, Repositories, Error } from './styles';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [InputError, setInputError] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRepo = localStorage.getItem('@GithubExplorer:repositories');
    if (storagedRepo) {
      return JSON.parse(storagedRepo);
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem(
      '@GithubExplorer:repositories',
      JSON.stringify(repositories),
    );
  }, [repositories]);

  async function HandleAddRepo(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!newRepo) {
      setInputError('Digite o autor/nome do repositorio!');
      return;
    }

    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);

      const repository = response.data;

      setRepositories([...repositories, repository]);
      setNewRepo('');
      setInputError('');
    } catch (e) {
      setInputError('Erro na busca por esse repositorio!');
    }
  }

  return (
    <>
      <img src={Logo} alt="Github Explorer" />
      <Title>Explore Repositorios no github</Title>
      <Form hasError={!!InputError} onSubmit={HandleAddRepo}>
        <input
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
          type="text"
          placeholder="Digite o nome do repositório..."
        />
        <button type="submit">Pesquisar</button>
      </Form>
      {InputError && <Error>{InputError}</Error>}

      <Repositories>
        {repositories.map((repo) => {
          return (
            <Link key={repo.full_name} to={`/repositories/${repo.full_name}`}>
              <img src={repo.owner.avatar_url} alt={repo.owner.login} />
              <div>
                <strong>{repo.full_name}</strong>
                <p>{repo.description}</p>
              </div>
              <FiChevronRight size={20} />
            </Link>
          );
        })}
      </Repositories>
    </>
  );
};

export default Dashboard;
