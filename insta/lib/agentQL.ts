type AgentQLQuery = {
    query: string;
    variables?: Record<string, any>;
  };
  
  const mockDatabase = {
    users: [
      { id: 1, username: 'demo', password: 'password' },
      { id: 2, username: 'john', password: 'doe' },
      { id: 3, username: 'jane', password: 'smith' },
      { id: 4, username: 'example_username', password: 'example_password' },
    ],
    messages: [
      { id: 1, from: 'demo', to: 'john', content: 'Hello John!' },
      { id: 2, from: 'john', to: 'demo', content: 'Hi Demo!' },
    ],
  };
  
  export const executeQuery = async (agentQLQuery: AgentQLQuery) => {
    const { query, variables } = agentQLQuery;
  
    if (query.includes('login')) {
      const user = mockDatabase.users.find(
        (u) => u.username === variables?.username && u.password === variables?.password
      );
      return user ? { token: `token_${user.id}_${Date.now()}` } : null;
    }
  
    if (query.includes('checkSession')) {
      return { isValid: variables?.token?.startsWith('token_') };
    }
  
    if (query.includes('searchUsers')) {
      const searchTerm = variables?.searchTerm.toLowerCase();
      return mockDatabase.users
        .filter((u) => u.username.toLowerCase().includes(searchTerm))
        .map((u) => ({ id: u.id, username: u.username }));
    }
  
    if (query.includes('sendMessage')) {
      const newMessage = {
        id: mockDatabase.messages.length + 1,
        from: variables?.from,
        to: variables?.to,
        content: variables?.content,
      };
      mockDatabase.messages.push(newMessage);
      return { success: true, message: newMessage };
    }
  
    return null;
  };