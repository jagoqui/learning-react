import { useMemo, useState } from 'react';
import './App.css';
import { UsersList } from './components/UsersList';
import { SortBy, type User } from './types.d';
import { useUsers } from './hooks/useUser';
import { Results } from './components/Results';

function App() {
  const {
    isLoading,
    isError,
    users,
    refetch,
    fetchNextPage,
    hasNextPage,
    deleteUser,
  } = useUsers();

  const [showColors, setShowColors] = useState(false);
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const [filterCountry, setFilterCountry] = useState<string | null>(null);

  const toggleColors = () => setShowColors(!showColors);

  const toggleSortByCountry = () => {
    const newSortingValue =
      sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE;
    setSorting(newSortingValue);
  };

  const handleReset = async () => await refetch();

  const handleDelete = (uuid: string) => deleteUser(uuid);

  const handleChangeSort = (sort: SortBy) =>
    setSorting((prevState) => (prevState === sort ? SortBy.NONE : sort));

  const filteredUsers = useMemo(
    () =>
      filterCountry
        ? users.filter((user) => {
            return user.location.country
              .toLowerCase()
              .includes(filterCountry.toLowerCase());
          })
        : users,
    [users, filterCountry]
  );

  const sortedUsers = useMemo(() => {
    if (sorting === SortBy.NONE) return filteredUsers;

    const compareProperties: Record<string, (user: User) => any> = {
      [SortBy.COUNTRY]: (user) => user.location.country,
      [SortBy.NAME]: (user) => user.name.first,
      [SortBy.LAST]: (user) => user.name.last,
    };

    return filteredUsers.toSorted((a, b) => {
      const extractProperty = compareProperties[sorting];
      return extractProperty(a).localeCompare(extractProperty(b));
    });
  }, [filteredUsers, sorting]);

  return (
    <div className="App">
      <h1>Prueba técnica</h1>
      <Results />
      <header>
        <button onClick={toggleColors}>Colorear files</button>

        <button onClick={toggleSortByCountry}>
          {sorting === SortBy.COUNTRY
            ? 'No ordenar por país'
            : 'Ordenar por país'}
        </button>

        <button onClick={handleReset}>Resetear estado</button>

        <input
          placeholder="Filtra por país"
          onChange={(e) => {
            setFilterCountry(e.target.value);
          }}
        />
      </header>
      <main>
        {users.length > 0 && (
          <UsersList
            changeSorting={handleChangeSort}
            deleteUser={handleDelete}
            showColors={showColors}
            users={sortedUsers}
          />
        )}

        {isLoading && <strong>Cargando...</strong>}
        {isError && <p>Ha habido un error {isError}</p>}

        {!isLoading && !isError && (
          <>
            {users.length === 0 && <p>No hay usuarios</p>}
            {hasNextPage ? (
              <button onClick={() => fetchNextPage()}>
                Cargar más resultados
              </button>
            ) : (
              <p>No hay más resultados</p>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
