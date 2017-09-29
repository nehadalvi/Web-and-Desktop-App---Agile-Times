import { ApolloClient, createNetworkInterface } from 'apollo-client';

// Paste your endpoint for the Simple API here.
// Info: https://github.com/graphcool-examples/angular-apollo-instagram-example#2-create-graphql-api-with-graphcool
const networkInterface = createNetworkInterface({ uri: 'https://api.graph.cool/simple/v1/cj7wl5ej40i7h01472ugj328w' })

const client = new ApolloClient({ networkInterface });

export function provideClient(): ApolloClient {
  return client;
}