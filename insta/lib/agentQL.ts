type AgentQLQuery = {
    query: string;
    variables?: Record<string, any>;
};

type User = {
    id: number;
    username: string;
    password: string;
  };
  
  type Message = {
    id: number;
    from: string;
    to: string;
    content: string;
  };
  
  const mockDatabase: {
    users: User[];
    messages: Message[];
  } = {
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
        return user ? { success: true, token: `token_${user.id}_${Date.now()}` } : { success: false, error: 'Invalid credentials' };
    }

    if (query.includes('checkSession')) {
        return { isValid: variables?.token?.startsWith('token_') };
    }

    if (query.includes('checkUserExists')) {
        const user = mockDatabase.users.find(u => u.username === variables?.username);
        return { exists: !!user };
    }

    if (query.includes('searchUsers')) {
        const searchTerm = variables?.searchTerm.toLowerCase();
        return mockDatabase.users
            .filter((u) => u.username.toLowerCase().includes(searchTerm))
            .map((u) => ({ id: u.id, username: u.username }));
    }
    if (query.includes('signup')) {
        const existingUser = mockDatabase.users.find(u => u.username === variables?.username);
        if (existingUser) {
            return { success: false, error: 'Username already exists' };
        }
        const newUser: User = {
            id: mockDatabase.users.length + 1,
            username: variables?.username,
            password: variables?.password,
        };
        mockDatabase.users.push(newUser);
        return { success: true, token: `token_${newUser.id}_${Date.now()}` };
    }

    if (query.includes('sendMessage')) {
        const recipientExists = mockDatabase.users.some(u => u.username === variables?.to);
        if (!recipientExists) {
          return { success: false, error: 'Recipient does not exist' };
        }
        const newMessage: Message = {
          id: mockDatabase.messages.length + 1,
          from: variables?.from,
          to: variables?.to,
          content: variables?.content,
        };
        mockDatabase.messages.push(newMessage);
        return { success: true, message: newMessage };
      }

      return { success: false, error: 'Invalid query' };
};