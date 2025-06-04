import { supabase } from '../lib/supabase';

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Função genérica para buscar dados de qualquer tabela
export const fetchData = async (table: string, query: any = {}) => {
  let queryBuilder = supabase.from(table).select();

  // Adiciona filtros se existirem
  if (query.filters) {
    Object.entries(query.filters).forEach(([key, value]) => {
      queryBuilder = queryBuilder.eq(key, value);
    });
  }

  // Adiciona ordenação se existir
  if (query.orderBy) {
    queryBuilder = queryBuilder.order(query.orderBy.column, {
      ascending: query.orderBy.ascending,
    });
  }

  // Adiciona paginação se existir
  if (query.range) {
    queryBuilder = queryBuilder.range(query.range.start, query.range.end);
  }

  const { data, error } = await queryBuilder;
  return { data, error };
};

// Função genérica para inserir dados em qualquer tabela
export const insertData = async (table: string, data: any) => {
  const { data: result, error } = await supabase
    .from(table)
    .insert(data)
    .select();
  return { data: result, error };
};

// Função genérica para atualizar dados em qualquer tabela
export const updateData = async (table: string, id: number, data: any) => {
  const { data: result, error } = await supabase
    .from(table)
    .update(data)
    .eq('id', id)
    .select();
  return { data: result, error };
};

// Função genérica para deletar dados de qualquer tabela
export const deleteData = async (table: string, id: number) => {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);
  return { error };
}; 